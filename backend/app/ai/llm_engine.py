"""
LLM Engine — Self-hosted AI via Ollama.
No external API calls. Everything runs on your own server.
"""
import logging
from typing import AsyncGenerator, Optional, Dict, Any, List
from ollama import AsyncClient
from app.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()


class LLMEngine:
    """Interface to self-hosted LLM via Ollama."""
    
    def __init__(self):
        self.client = AsyncClient(host=settings.OLLAMA_BASE_URL)
        self.model = settings.OLLAMA_MODEL
        self.default_options = {
            "temperature": settings.AI_TEMPERATURE,
            "top_p": settings.AI_TOP_P,
            "num_predict": settings.AI_MAX_TOKENS,
        }
    
    async def generate(
        self,
        prompt: str,
        system: Optional[str] = None,
        temperature: Optional[float] = None,
        max_tokens: Optional[int] = None,
        format: Optional[str] = None,  # "json" for structured output
    ) -> str:
        """Generate a single response from the LLM."""
        messages = []
        if system:
            messages.append({"role": "system", "content": system})
        messages.append({"role": "user", "content": prompt})
        
        options = {**self.default_options}
        if temperature is not None:
            options["temperature"] = temperature
        if max_tokens is not None:
            options["num_predict"] = max_tokens
        
        kwargs: Dict[str, Any] = {
            "model": self.model,
            "messages": messages,
            "options": options,
            "stream": False,
        }
        if format:
            kwargs["format"] = format
        
        try:
            response = await self.client.chat(**kwargs)
            return response["message"]["content"]
        except Exception as e:
            logger.error(f"LLM generation error: {e}")
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
        messages = []
        if system:
            messages.append({"role": "system", "content": system})
        if history:
            messages.extend(history)
        messages.append({"role": "user", "content": prompt})
        
        options = {**self.default_options}
        if temperature is not None:
            options["temperature"] = temperature
        if max_tokens is not None:
            options["num_predict"] = max_tokens
        
        try:
            stream = await self.client.chat(
                model=self.model,
                messages=messages,
                options=options,
                stream=True,
            )
            async for chunk in stream:
                token = chunk["message"]["content"]
                if token:
                    yield token
        except Exception as e:
            logger.error(f"LLM stream error: {e}")
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
        """Check if Ollama is running and model is available."""
        try:
            models_response = await self.client.list()
            # Handle both dict and object response formats from different ollama versions
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
                "ollama_url": settings.OLLAMA_BASE_URL,
                "model": self.model,
                "model_loaded": is_model_loaded,
                "available_models": model_names,
            }
        except Exception as e:
            return {
                "status": "unhealthy",
                "error": str(e),
            }


# Singleton instance
llm_engine = LLMEngine()
