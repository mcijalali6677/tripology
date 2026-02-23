"""
LLM Engine — Multi-provider AI support.
Supports: Groq (blazing fast, free tier), OpenAI, and local Ollama as fallback.
Provider is selected via LLM_PROVIDER env var.
"""
import logging
from typing import AsyncGenerator, Optional, Dict, Any, List
from app.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()


class LLMEngine:
    """Unified LLM interface supporting Groq, OpenAI, and Ollama."""
    
    def __init__(self):
        self.provider = settings.LLM_PROVIDER.lower()  # "groq", "openai", "ollama"
        self._client = None
        
        if self.provider == "groq":
            self.model = settings.GROQ_MODEL
            self._api_key = settings.GROQ_API_KEY
            self._base_url = settings.GROQ_BASE_URL
        elif self.provider == "openai":
            self.model = settings.OPENAI_MODEL
            self._api_key = settings.OPENAI_API_KEY
            self._base_url = None  # Default OpenAI endpoint
        else:
            self.model = settings.OLLAMA_MODEL
            
        self.default_temperature = settings.AI_TEMPERATURE
        self.default_max_tokens = settings.AI_MAX_TOKENS
        self.default_top_p = settings.AI_TOP_P
        
        logger.info(f"LLM Engine initialized: provider={self.provider}, model={self.model}")
    
    def _get_openai_client(self):
        """Lazy-init OpenAI-compatible client (used for Groq and OpenAI)."""
        if self._client is None:
            from openai import AsyncOpenAI
            kwargs = {"api_key": self._api_key}
            if self._base_url:
                kwargs["base_url"] = self._base_url
            self._client = AsyncOpenAI(**kwargs)
        return self._client
    
    def _get_ollama_client(self):
        """Lazy-init Ollama client."""
        if self._client is None:
            from ollama import AsyncClient
            self._client = AsyncClient(host=settings.OLLAMA_BASE_URL)
        return self._client
    
    # ── OpenAI-compatible methods (Groq / OpenAI) ──────────────────────
    
    async def _openai_generate(
        self,
        prompt: str,
        system: Optional[str] = None,
        temperature: Optional[float] = None,
        max_tokens: Optional[int] = None,
        format: Optional[str] = None,
    ) -> str:
        client = self._get_openai_client()
        messages = []
        if system:
            messages.append({"role": "system", "content": system})
        messages.append({"role": "user", "content": prompt})
        
        kwargs: Dict[str, Any] = {
            "model": self.model,
            "messages": messages,
            "temperature": temperature or self.default_temperature,
            "max_tokens": max_tokens or self.default_max_tokens,
            "top_p": self.default_top_p,
        }
        if format == "json":
            kwargs["response_format"] = {"type": "json_object"}
        
        response = await client.chat.completions.create(**kwargs)
        return response.choices[0].message.content or ""
    
    async def _openai_generate_stream(
        self,
        prompt: str,
        system: Optional[str] = None,
        history: Optional[List[Dict[str, str]]] = None,
        temperature: Optional[float] = None,
        max_tokens: Optional[int] = None,
    ) -> AsyncGenerator[str, None]:
        client = self._get_openai_client()
        messages = []
        if system:
            messages.append({"role": "system", "content": system})
        if history:
            messages.extend(history)
        messages.append({"role": "user", "content": prompt})
        
        stream = await client.chat.completions.create(
            model=self.model,
            messages=messages,
            temperature=temperature or self.default_temperature,
            max_tokens=max_tokens or self.default_max_tokens,
            top_p=self.default_top_p,
            stream=True,
        )
        async for chunk in stream:
            delta = chunk.choices[0].delta if chunk.choices else None
            if delta and delta.content:
                yield delta.content
    
    # ── Ollama methods ─────────────────────────────────────────────────
    
    async def _ollama_generate(
        self,
        prompt: str,
        system: Optional[str] = None,
        temperature: Optional[float] = None,
        max_tokens: Optional[int] = None,
        format: Optional[str] = None,
    ) -> str:
        client = self._get_ollama_client()
        messages = []
        if system:
            messages.append({"role": "system", "content": system})
        messages.append({"role": "user", "content": prompt})
        
        options = {
            "temperature": temperature or self.default_temperature,
            "top_p": self.default_top_p,
            "num_predict": max_tokens or self.default_max_tokens,
        }
        
        kwargs: Dict[str, Any] = {
            "model": self.model,
            "messages": messages,
            "options": options,
            "stream": False,
        }
        if format:
            kwargs["format"] = format
        
        response = await client.chat(**kwargs)
        return response["message"]["content"]
    
    async def _ollama_generate_stream(
        self,
        prompt: str,
        system: Optional[str] = None,
        history: Optional[List[Dict[str, str]]] = None,
        temperature: Optional[float] = None,
        max_tokens: Optional[int] = None,
    ) -> AsyncGenerator[str, None]:
        client = self._get_ollama_client()
        messages = []
        if system:
            messages.append({"role": "system", "content": system})
        if history:
            messages.extend(history)
        messages.append({"role": "user", "content": prompt})
        
        options = {
            "temperature": temperature or self.default_temperature,
            "top_p": self.default_top_p,
            "num_predict": max_tokens or self.default_max_tokens,
        }
        
        stream = await client.chat(
            model=self.model,
            messages=messages,
            options=options,
            stream=True,
        )
        async for chunk in stream:
            token = chunk["message"]["content"]
            if token:
                yield token
    
    # ── Tool Calling (Groq / OpenAI) ─────────────────────────────────

    async def generate_with_tools(
        self,
        messages: List[Dict[str, Any]],
        tools: List[Dict[str, Any]],
        temperature: Optional[float] = None,
        max_tokens: Optional[int] = None,
    ) -> Dict[str, Any]:
        """
        Call LLM with function calling tools (Groq/OpenAI only).
        Returns dict with 'content' and/or 'tool_calls'.
        """
        if self.provider not in ("groq", "openai"):
            # Ollama does not reliably support tool calling
            return {"content": None, "tool_calls": None}

        client = self._get_openai_client()
        try:
            response = await client.chat.completions.create(
                model=self.model,
                messages=messages,
                tools=tools,
                tool_choice="auto",
                temperature=temperature or self.default_temperature,
                max_tokens=max_tokens or 512,  # Small for tool decision
            )
            msg = response.choices[0].message

            if msg.tool_calls:
                return {
                    "content": msg.content,
                    "tool_calls": [
                        {
                            "id": tc.id,
                            "type": tc.type,
                            "function": {
                                "name": tc.function.name,
                                "arguments": tc.function.arguments,
                            },
                        }
                        for tc in msg.tool_calls
                    ],
                }
            return {"content": msg.content, "tool_calls": None}
        except Exception as e:
            logger.warning(f"Tool calling failed ({self.provider}): {e}")
            return {"content": None, "tool_calls": None}

    async def generate_stream_from_messages(
        self,
        messages: List[Dict[str, Any]],
        temperature: Optional[float] = None,
        max_tokens: Optional[int] = None,
    ) -> AsyncGenerator[str, None]:
        """
        Stream response from a full messages list.
        Used after tool calling to generate the final response
        with tool results included in the conversation.
        """
        try:
            if self.provider in ("groq", "openai"):
                client = self._get_openai_client()
                stream = await client.chat.completions.create(
                    model=self.model,
                    messages=messages,
                    temperature=temperature or self.default_temperature,
                    max_tokens=max_tokens or self.default_max_tokens,
                    top_p=self.default_top_p,
                    stream=True,
                )
                async for chunk in stream:
                    delta = chunk.choices[0].delta if chunk.choices else None
                    if delta and delta.content:
                        yield delta.content
            else:
                # Ollama: extract system/history/prompt from messages
                system = None
                history = []
                prompt = ""
                for m in messages:
                    if m["role"] == "system":
                        system = m["content"]
                    elif m["role"] == "user":
                        prompt = m["content"]
                    elif m["role"] in ("assistant", "tool"):
                        history.append(m)
                async for token in self._ollama_generate_stream(
                    prompt, system, history, temperature, max_tokens
                ):
                    yield token
        except Exception as e:
            logger.error(f"Stream from messages error ({self.provider}): {e}")
            raise

    # ── Public interface (same as before) ──────────────────────────────
    
    async def generate(
        self,
        prompt: str,
        system: Optional[str] = None,
        temperature: Optional[float] = None,
        max_tokens: Optional[int] = None,
        format: Optional[str] = None,
    ) -> str:
        """Generate a single response from the LLM."""
        try:
            if self.provider in ("groq", "openai"):
                return await self._openai_generate(prompt, system, temperature, max_tokens, format)
            else:
                return await self._ollama_generate(prompt, system, temperature, max_tokens, format)
        except Exception as e:
            logger.error(f"LLM generation error ({self.provider}): {e}")
            raise
    
    async def generate_stream(
        self,
        prompt: str,
        system: Optional[str] = None,
        history: Optional[List[Dict[str, str]]] = None,
        temperature: Optional[float] = None,
        max_tokens: Optional[int] = None,
    ) -> AsyncGenerator[str, None]:
        """Stream response tokens from the LLM."""
        try:
            if self.provider in ("groq", "openai"):
                gen = self._openai_generate_stream(prompt, system, history, temperature, max_tokens)
            else:
                gen = self._ollama_generate_stream(prompt, system, history, temperature, max_tokens)
            async for token in gen:
                yield token
        except Exception as e:
            logger.error(f"LLM stream error ({self.provider}): {e}")
            raise
    
    async def generate_structured(
        self,
        prompt: str,
        system: Optional[str] = None,
        temperature: float = 0.3,
    ) -> str:
        """Generate JSON-structured output from the LLM."""
        return await self.generate(
            prompt=prompt,
            system=system,
            temperature=temperature,
            format="json",
        )
    
    async def health_check(self) -> Dict[str, Any]:
        """Check if the LLM provider is reachable."""
        try:
            if self.provider in ("groq", "openai"):
                # Quick test: list models
                client = self._get_openai_client()
                models = await client.models.list()
                model_names = [m.id for m in models.data[:10]]
                return {
                    "status": "healthy",
                    "provider": self.provider,
                    "model": self.model,
                    "available_models": model_names,
                }
            else:
                # Ollama health check
                client = self._get_ollama_client()
                models_response = await client.list()
                if isinstance(models_response, dict):
                    models_list = models_response.get("models", [])
                else:
                    models_list = getattr(models_response, "models", [])
                
                model_names = []
                for m in models_list:
                    name = m.get("name", "") if isinstance(m, dict) else getattr(m, "model", getattr(m, "name", ""))
                    if name:
                        model_names.append(name)
                
                is_model_loaded = any(self.model in name for name in model_names)
                return {
                    "status": "healthy",
                    "provider": "ollama",
                    "ollama_url": settings.OLLAMA_BASE_URL,
                    "model": self.model,
                    "model_loaded": is_model_loaded,
                    "available_models": model_names,
                }
        except Exception as e:
            return {
                "status": "unhealthy",
                "provider": self.provider,
                "error": str(e),
            }


# Singleton instance
llm_engine = LLMEngine()
