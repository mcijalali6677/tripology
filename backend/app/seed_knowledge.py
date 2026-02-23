"""
Seed Knowledge Base with comprehensive travel data for RAG.
Run: python -m app.seed_knowledge
"""
import asyncio
import logging
from app.database import async_session, init_db
from app.ai.embeddings import embedding_engine
from app.models.chat import KnowledgeBase

logger = logging.getLogger(__name__)

KNOWLEDGE_ENTRIES = [
    # ==================== IRAN DESTINATIONS ====================
    # Tehran
    {
        "title": "تهران - راهنمای کامل سفر",
        "content": """تهران پایتخت ایران، شهری مدرن با تاریخ غنی. بهترین زمان سفر: بهار (فروردین-اردیبهشت) و پاییز (مهر-آبان).
جاذبه‌های اصلی: کاخ گلستان (یونسکو)، برج میلاد، پل طبیعت، بازار بزرگ تهران، موزه ملی ایران، دربند و درکه برای کوهنوردی.
حمل‌ونقل: مترو (۶ خط فعال)، BRT، اسنپ و تپسی. فرودگاه امام خمینی (IKA) برای پروازهای بین‌المللی.
غذاهای محلی: دیزی، آش رشته، جگر و دل‌وقلوه در بازار، کافه‌های مدرن در ولیعصر و اندرزگو.
هزینه تقریبی: هتل ۳ ستاره ۲-۴ میلیون تومان/شب، غذا ۵۰۰ هزار-۱ میلیون/وعده، مترو ۵۰ هزار تومان/مسیر.""",
        "category": "destination",
        "destination": "Tehran",
        "country": "Iran",
        "tags": ["city", "capital", "history", "modern"],
    },
    {
        "title": "تهران - محله‌های برتر و اقامت",
        "content": """محله‌های برتر تهران برای گردشگران:
- **ولیعصر/ونک**: مرکز شهر، دسترسی عالی به مترو، کافه‌ها و رستوران‌های مدرن. هتل‌های ۳-۴ ستاره فراوان.
- **دربند/تجریش**: شمال تهران، نزدیک کوه، هوای تمیز، بازار تجریش. مناسب برای طبیعت‌دوستان.
- **بازار/پانزده خرداد**: قلب تاریخی، نزدیک کاخ گلستان. ارزان‌تر ولی شلوغ.
- **اندرزگو/الهیه**: شیک‌ترین محله، رستوران‌های بین‌المللی، گالری‌ها. گران‌ترین گزینه.
نکته: ترافیک تهران سنگین است. حتماً از مترو استفاده کنید.""",
        "category": "accommodation",
        "destination": "Tehran",
        "country": "Iran",
        "tags": ["neighborhood", "hotel", "tips"],
    },
    # Isfahan
    {
        "title": "اصفهان - نصف جهان",
        "content": """اصفهان زیباترین شهر تاریخی ایران با معماری اسلامی خیره‌کننده. بهترین زمان: بهار و پاییز.
جاذبه‌ها: میدان نقش جهان (یونسکو) - دومین میدان بزرگ جهان، مسجد شیخ لطف‌الله، کاخ عالی قاپو، سی‌وسه پل و خواجو، جلفا (محله ارمنی)، مسجد جامع اصفهان (یونسکو).
صنایع دستی: مینیاتور، قلمزنی، خاتم‌کاری، گز اصفهان.
غذا: بریانی اصفهان، خورشت مسما، گز و پولکی. رستوران شهرزاد و باغ پرندگان.
هزینه: هتل سنتی ۳-۵ میلیون/شب، غذا ۴۰۰-۸۰۰ هزار/وعده.
حمل‌ونقل: تاکسی، اسنپ، اتوبوس. فرودگاه شهید بهشتی. ۵ ساعت رانندگی از تهران.
برنامه ۳ روزه پیشنهادی: روز ۱ میدان نقش جهان، روز ۲ جلفا و پل‌ها، روز ۳ مسجد جامع و بازار.""",
        "category": "destination",
        "destination": "Isfahan",
        "country": "Iran",
        "tags": ["city", "history", "architecture", "unesco"],
    },
    # Shiraz
    {
        "title": "شیراز - شهر شعر و گل",
        "content": """شیراز مهد فرهنگ و ادب فارسی، شهر حافظ و سعدی. بهترین زمان: فروردین-اردیبهشت (فصل بهار نارنج).
جاذبه‌ها: ارگ کریمخان، نارنجستان قوام، باغ ارم (یونسکو)، مسجد نصیرالملک (مسجد صورتی)، حافظیه، سعدیه، شاهچراغ.
تخت جمشید: ۶۰ کیلومتری شیراز، ضروری‌ترین بازدید. نقش رستم هم نزدیک است.
غذا: کلم‌پلو شیرازی، فالوده شیرازی، آش سبزی. رستوران هفت‌خان و شرزه.
خرید: بازار وکیل (یکی از بهترین بازارهای ایران)، صنایع دستی، عرقیات گیاهی.
هزینه: هتل ۲-۴ میلیون/شب، تخت جمشید ورودی ۵۰۰ هزار تومان.
نکته ویژه: شیراز بهترین نقطه شروع برای تور فارس (شیراز-اصفهان-یزد).""",
        "category": "destination",
        "destination": "Shiraz",
        "country": "Iran",
        "tags": ["city", "poetry", "garden", "persepolis"],
    },
    # Yazd
    {
        "title": "یزد - شهر بادگیرها",
        "content": """یزد شهر خشتی و کاهگلی با معماری منحصربه‌فرد، ثبت یونسکو. بهترین زمان: بهار و پاییز (تابستان بسیار گرم).
جاذبه‌ها: بافت تاریخی یزد (یونسکو)، مسجد جامع یزد، باغ دولت‌آباد (بلندترین بادگیر جهان)، آتشکده زرتشتیان، دخمه سکوت، آب انبارها.
تجربه‌ها: شب‌نشینی روی بام‌های خشتی، تور کویر (مصر و گرمه ۲ ساعت)، دوچرخه‌سواری در بافت قدیم.
غذا: شولم‌آش، قتاب، باقلا پلو. شیرینی یزدی و پشمک مشهور.
خرید: ترمه، زیلو، حلوا ارده.
هزینه: اقامتگاه بوم‌گردی ۱.۵-۳ میلیون/شب، تور کویر ۱-۲ میلیون/نفر.
نکته: یزد سومین شهر قدیمی جهان است و حتماً ۲ شب بمانید.""",
        "category": "destination",
        "destination": "Yazd",
        "country": "Iran",
        "tags": ["city", "desert", "unesco", "zoroastrian"],
    },
    # Tabriz
    {
        "title": "تبریز - شهر اولین‌ها",
        "content": """تبریز بزرگ‌ترین شهر شمال‌غرب ایران، با بازار تاریخی یونسکویی. بهترین زمان: تابستان (زمستان بسیار سرد).
جاذبه‌ها: بازار تبریز (بزرگ‌ترین بازار سرپوشیده جهان - یونسکو)، مسجد کبود، ارگ علیشاه، موزه قاجار.
کندوان: ۵۰ کیلومتری تبریز، روستای صخره‌ای منحصربه‌فرد (کاپادوکیای ایران).
غذا: کوفته تبریزی (بزرگ‌ترین کوفته جهان!)، آش عدسی، قیمه‌نخود. رستوران‌های سنتی بازار.
خرید: فرش تبریز، نقره، سوغات آذربایجان.
هزینه: هتل ۱.۵-۳ میلیون/شب. غذا ۳۰۰-۶۰۰ هزار/وعده.
ترکیب سفر: تبریز + جلفا + کلیساهای ارمنی (یونسکو) = ۴-۵ روز عالی.""",
        "category": "destination",
        "destination": "Tabriz",
        "country": "Iran",
        "tags": ["city", "bazaar", "unesco", "azerbaijani"],
    },
    # Kerman & Dasht-e Lut
    {
        "title": "کرمان و کویر لوت - ماجراجویی در گرم‌ترین نقطه زمین",
        "content": """کرمان دروازه کویر لوت، گرم‌ترین نقطه ثبت‌شده روی زمین (یونسکو). بهترین زمان: آبان تا اسفند.
جاذبه‌ها: کویر لوت (کلوت‌های شنی بی‌نظیر)، بازار گنجعلی‌خان، مجموعه گنجعلی‌خان (حمام، مسجد، کاروانسرا).
ماهان: باغ شاهزاده (۳۵ کیلومتری کرمان)، یکی از زیباترین باغ‌های ایران.
بم: ارگ بم (در حال بازسازی پس از زلزله)، ۲۰۰ کیلومتری کرمان.
تجربه: ستاره‌شناسی در کویر، شتر سواری، تور ۴×۴ لوت.
غذا: کشک بادمجان کرمانی، جوادیه. پسته کرمان بهترین سوغات.
هزینه: تور کویر ۲-۴ میلیون/نفر (شامل اقامت و غذا).""",
        "category": "destination",
        "destination": "Kerman",
        "country": "Iran",
        "tags": ["desert", "adventure", "unesco", "lut"],
    },
    # Qeshm & Hormozgan
    {
        "title": "قشم و هرمزگان - بهشت استوایی ایران",
        "content": """جزیره قشم بزرگ‌ترین جزیره خلیج فارس، با ژئوپارک یونسکو. بهترین زمان: آبان تا اسفند.
جاذبه‌ها: دره ستارگان، جنگل حرا (مانگرو)، غار نمکی، سواحل صخره‌ای.
هرمز: جزیره رنگین‌کمان، خاک سرخ، ساحل نقره‌ای. ۱ روز کافی.
کیش: جزیره مدرن، بازار آزاد، شهر زیرزمینی.
هنگام: دلفین‌ها و لاک‌پشت‌ها، ساحل بیولومینسانس (شب‌تاب).
غذا: ماهی خلیج فارس، میگو، قلیه ماهی. غذاهای محلی بندری.
هزینه: هتل قشم ۲-۴ میلیون/شب، تور هرمز ۱ میلیون/نفر.
نکته: منطقه آزاد = خرید ارزان‌تر. آب‌وهوا مرطوب اما لباس پوشیده بپوشید.""",
        "category": "destination",
        "destination": "Qeshm",
        "country": "Iran",
        "tags": ["island", "beach", "geopark", "nature"],
    },
    # Gilan & Rasht
    {
        "title": "گیلان و رشت - پایتخت غذای ایران",
        "content": """رشت شهر خلاق خوراک‌شناسی یونسکو، با طبیعت سرسبز گیلان. بهترین زمان: بهار و تابستان.
جاذبه‌ها: ماسوله (روستای پلکانی)، قلعه رودخان، تالاب انزلی، جنگل‌های هیرکانی (یونسکو)، بندر انزلی.
غذا: میرزا قاسمی، فسنجان، باقلا قاتق، سیرابیج، تورشه‌تره. رشت بهشت غذا.
اقامت: ویلا جنگلی، اقامتگاه بوم‌گردی ماسوله. هتل‌های شهری رشت.
فومن: صومعه‌سرا و جاده‌های جنگلی شمال.
هزینه: ویلا جنگلی ۲-۵ میلیون/شب، غذای محلی ۳۰۰-۷۰۰ هزار/وعده.
نکته: باران زیاد می‌بارد! چتر و لباس بارانی ببرید. رانندگی جنگلی فوق‌العاده.""",
        "category": "destination",
        "destination": "Rasht",
        "country": "Iran",
        "tags": ["city", "food", "nature", "forest", "caspian"],
    },
    # Kashan
    {
        "title": "کاشان - شهر گلاب و خانه‌های تاریخی",
        "content": """کاشان شهری خوش‌آب‌وهوا بین تهران و اصفهان (۳ ساعت از تهران). بهترین زمان: بهار (جشن گلاب‌گیری اردیبهشت!).
جاذبه‌ها: خانه طباطبایی‌ها، خانه بروجردی‌ها، خانه عباسیان، باغ فین (یونسکو)، بازار کاشان.
ابیانه: ۸۰ کیلومتری کاشان، روستای سرخ رنگ با لباس‌های سنتی.
نیاسر: آبشار و غار نیاسر، چشمه آب‌گرم.
گلاب‌گیری: اردیبهشت، مراسم سنتی تقطیر گلاب در قمصر. بسیار زیبا و معطر!
غذا: آش و کشک، گلاب‌پلو. فالوده کاشانی.
هزینه: اقامتگاه سنتی ۲-۴ میلیون/شب. ورودی خانه‌ها ۲۰۰-۵۰۰ هزار.
نکته: کاشان بهترین مکان برای حس معماری سنتی ایرانی. ۱-۲ شب.""",
        "category": "destination",
        "destination": "Kashan",
        "country": "Iran",
        "tags": ["city", "architecture", "rosewater", "traditional"],
    },
    # General Iran Travel Tips
    {
        "title": "نکات عمومی سفر به ایران",
        "content": """راهنمای جامع سفر به ایران:
**ویزا**: اکثر کشورها ویزای فرودگاهی ۳۰ روزه. آمریکایی‌ها و بریتانیایی‌ها نیاز به ویزای قبلی.
**ارز**: تومان. کارت‌های بین‌المللی کار نمی‌کنند! حتماً ارز نقد ببرید (یورو یا دلار) و در صرافی تبدیل کنید.
**اینترنت**: VPN لازم برای اینستاگرام و واتساپ. سیم‌کارت ایرانسل یا همراه اول بگیرید.
**پوشش**: زنان حجاب (روسری + مانتو). مردان شلوار بلند.
**حمل‌ونقل**: هواپیما داخلی ارزان. قطار (رجا) عالی برای مسیرهای بلند. اتوبوس VIP راحت.
**بهترین مسیرها**:
- کلاسیک (۱۰ روز): تهران → کاشان → اصفهان → یزد → شیراز
- طبیعت (۷ روز): رشت → ماسوله → تالاب انزلی → رامسر → مازندران
- کویر (۵ روز): کرمان → کویر لوت → ماهان → بم
- جزایر (۵ روز): بندرعباس → قشم → هرمز → هنگام
**امنیت**: ایران بسیار امن برای گردشگران. مردم فوق‌العاده مهمان‌نواز.""",
        "category": "tips",
        "destination": "Iran",
        "country": "Iran",
        "tags": ["general", "visa", "transport", "safety", "routes"],
    },
    {
        "title": "بهترین غذاهای ایران برای گردشگران",
        "content": """غذاهای ایرانی که حتماً باید امتحان کنید:
**چلوکباب**: غذای ملی. کباب کوبیده، برگ، سلطانی، جوجه. بهترین: رستوران نایب تهران.
**دیزی/آبگوشت**: پختنی سنتی در دیزی سنگی. تکه نان بزن توش!
**قورمه‌سبزی**: خورشت سبزیجات. ملکه خورشت‌های ایرانی.
**فسنجان**: خورشت گردو و انار. شمالی اصل‌ترینه.
**زرشک‌پلو با مرغ**: برنج با زرشک و مرغ. ساده و خوشمزه.
**کله‌پاچه**: صبحانه سنتی (سر و پای گوسفند). جسارت می‌خواد!
**آش**: انواع سوپ غلیظ ایرانی. آش رشته، آش شلغم.
شیرینی: باقلوا یزدی/قزوینی، گز اصفهانی، سوهان قم، پشمک، فالوده شیرازی.
نوشیدنی: دوغ (ماست+آب+نعنا)، شربت بالنگ، آب‌لیمو، چای ایرانی.
هزینه: رستوران معمولی ۳۰۰-۶۰۰ هزار/نفر، رستوران لوکس ۱-۲ میلیون.""",
        "category": "food",
        "destination": "Iran",
        "country": "Iran",
        "tags": ["food", "cuisine", "traditional", "restaurant"],
    },
    # ==================== INTERNATIONAL DESTINATIONS ====================
    # Paris
    {
        "title": "Paris - Complete Travel Guide",
        "content": """Paris, the City of Light. Best time: April-June, September-October.
Top Attractions: Eiffel Tower (book tickets online!), Louvre Museum (needs 4+ hours), Notre-Dame (rebuilding), Sacré-Cœur, Champs-Élysées, Arc de Triomphe, Musée d'Orsay, Versailles (day trip).
Neighborhoods: Le Marais (trendy), Montmartre (artistic), Saint-Germain (classic), Latin Quarter (student), Bastille (nightlife).
Food: Croissants, crêpes, coq au vin, duck confit, macarons (Ladurée/Pierre Hermé). Markets: Rue Mouffetard.
Transport: Métro (best option), RER, Vélib bikes. Paris Museum Pass saves money.
Budget: Hotel 3-star €100-200/night, meal €15-40, Museum Pass €62/4 days.
Tips: Buy Métro carnet (10 tickets). Avoid restaurants directly facing monuments. Learn "Bonjour" — it matters!
Suggested 4-day plan: Day 1 Eiffel+Seine cruise, Day 2 Louvre+Tuileries, Day 3 Montmartre+Sacré-Cœur, Day 4 Versailles.""",
        "category": "destination",
        "destination": "Paris",
        "country": "France",
        "tags": ["city", "europe", "culture", "food", "art"],
    },
    # Istanbul
    {
        "title": "Istanbul - Where East Meets West",
        "content": """Istanbul spans two continents. Best time: April-May, September-November.
Must-See: Hagia Sophia, Blue Mosque, Topkapi Palace, Grand Bazaar, Spice Bazaar, Basilica Cistern, Galata Tower.
Areas: Sultanahmet (historic), Beyoğlu/Taksim (modern), Kadiköy (Asian side, local vibe), Balat (colorful houses).
Food: Kebab, lahmacun, pide, balik ekmek (fish sandwich at Eminönü), Turkish breakfast (kahvalti), baklava, Turkish delight.
Transport: Istanbul Card for metro+tram+ferry. Ferry across Bosphorus is a must!
Budget: Hotel $40-100/night, meal $5-20, Museum Pass €95.
Shopping: Grand Bazaar (negotiate!), ceramics, rugs, Turkish lamps.
Day trips: Princes' Islands (1-hour ferry), Bursa (2 hours).
Suggested 3 days: Day 1 Sultanahmet (Hagia Sophia, Blue Mosque, Cistern), Day 2 Topkapi + Grand Bazaar + Spice Bazaar, Day 3 Galata + Bosphorus cruise + Kadiköy.""",
        "category": "destination",
        "destination": "Istanbul",
        "country": "Turkey",
        "tags": ["city", "history", "food", "shopping"],
    },
    # Dubai
    {
        "title": "Dubai - City of the Future",
        "content": """Dubai, a futuristic city in the desert. Best time: November-March (summer is 45°C+!).
Attractions: Burj Khalifa (book At the Top), Dubai Mall, Palm Jumeirah, Dubai Marina, Old Dubai (Al Fahidi), Gold Souk, Desert Safari.
Free/Budget: Dubai Fountain show, JBR Beach Walk, Global Village (winter), Dubai Creek abra ride (AED 1).
Luxury: Burj Al Arab tea, Atlantis Aquaventure, yacht cruise, helicopter tour.
Food: Shawarma, manakish, Arabic mezze, Friday brunch culture. Al Dhiyafah Road for cheap eats.
Transport: Metro (Red+Green lines), taxi, ride-hailing. No alcohol without license.
Budget: Hotel 3-star AED 200-400/night, meal AED 30-80, Desert Safari AED 150-300.
Tips: Weekend is Friday-Saturday. Dress modestly in malls. Ramadan = no eating in public during day.""",
        "category": "destination",
        "destination": "Dubai",
        "country": "UAE",
        "tags": ["city", "luxury", "shopping", "desert", "modern"],
    },
    # Bali
    {
        "title": "Bali - Island of the Gods",
        "content": """Bali, Indonesia's paradise island. Best time: April-October (dry season).
Areas: Ubud (culture/rice terraces), Seminyak (beach clubs), Canggu (surfer vibe), Uluwatu (cliffs), Nusa Penida (day trip), Amed (diving).
Must-Do: Tegallalang Rice Terraces, Uluwatu Temple + Kecak dance, Tirta Empul water temple, Mt. Batur sunrise trek, snorkeling in Nusa Penida.
Food: Nasi Goreng, Babi Guling (suckling pig), Sate Lilit, smoothie bowls in Canggu. Warung (local restaurant) = cheap & good.
Transport: Scooter rental ($5/day), Grab/Gojek, private driver ($40/day).
Budget: Villa $30-80/night, meal $3-15, activities $20-60.
Tips: Respect temples (wear sarong). Avoid Kuta if you want peace. Ubud + Uluwatu + Nusa Penida = perfect combo.
Yoga/Wellness: Ubud is a world yoga capital. Many retreats available.""",
        "category": "destination",
        "destination": "Bali",
        "country": "Indonesia",
        "tags": ["island", "beach", "culture", "nature", "wellness"],
    },
    # ==================== TRAVEL TIPS ====================
    {
        "title": "How to Plan a Trip - Step by Step",
        "content": """Professional trip planning guide:
1. **Choose Destination**: Based on season, budget, interests. Use our AI to match your personality!
2. **Set Budget**: Include flights (40%), accommodation (30%), food (15%), activities (15%).
3. **Book Flights**: 6-8 weeks ahead for best prices. Use Google Flights + Skyscanner.
4. **Book Accommodation**: Hotels vs Airbnb vs hostels. Location > luxury for short trips.
5. **Plan Activities**: Mix must-sees with local experiences. Don't over-schedule!
6. **Travel Insurance**: Always get it. Cover medical + cancellation + theft.
7. **Prepare Documents**: Passport (6+ months validity), visa, copies of docs.
8. **Pack Smart**: Capsule wardrobe, universal adapter, power bank, medicine kit.
Rule of thumb: Plan 2-3 activities per day max. Leave room for spontaneity!""",
        "category": "tips",
        "destination": "General",
        "country": "Global",
        "tags": ["planning", "budget", "general", "guide"],
    },
    {
        "title": "Budget Travel Tips & Tricks",
        "content": """Save money while traveling:
**Flights**: Be flexible with dates. Use incognito mode. Budget carriers (Ryanair, AirAsia). Consider nearby airports.
**Accommodation**: Hostels ($10-30), Couchsurfing (free), Airbnb (split with friends), house-sitting.
**Food**: Cook some meals. Eat where locals eat. Lunch menus > dinner. Street food is often the best.
**Activities**: Free walking tours (tip-based). Museum free days. Hike instead of paying for tours.
**Transport**: Walk! Use public transit. Overnight bus/train = save a night's hotel.
**Money**: No-fee bank cards (Wise, Revolut). Withdraw local currency at ATMs, not exchange shops.
Average daily budgets:
- Southeast Asia: $30-50/day (backpacker) | $80-150/day (mid-range)
- Europe: $60-100/day (backpacker) | $150-300/day (mid-range)
- Middle East: $40-70/day (backpacker) | $100-200/day (mid-range)""",
        "category": "tips",
        "destination": "General",
        "country": "Global",
        "tags": ["budget", "saving", "backpacker", "tips"],
    },
    {
        "title": "مسیرهای پیشنهادی ایران - کلاسیک تا ماجراجویانه",
        "content": """بهترین مسیرهای سفر داخلی ایران:

**🏛️ مسیر فرهنگی کلاسیک (۱۰-۱۴ روز)**:
تهران (۲ شب) → کاشان (۱ شب) → اصفهان (۳ شب) → یزد (۲ شب) → شیراز (۳ شب)
مناسب: همه! اولین سفر ایران. با قطار یا اتوبوس VIP.

**🏔️ مسیر طبیعت شمال (۷-۱۰ روز)**:
رشت (۲ شب) → ماسوله (۱ شب) → فومن → رامسر (۲ شب) → چالوس → مازندران → جنگل ابر
مناسب: طبیعت‌دوستان. بهار و تابستان.

**🏜️ مسیر کویر و جنوب (۷-۱۰ روز)**:
کرمان (۱ شب) → کویر لوت (۲ شب تور) → بم → بندرعباس → قشم (۲ شب) → هرمز (۱ شب)
مناسب: ماجراجویان. پاییز و زمستان.

**⛰️ مسیر شمال‌غربی (۷ روز)**:
تبریز (۲ شب) → کندوان (۱ شب) → جلفا و کلیساها → اردبیل (۲ شب) → سرعین (چشمه آب‌گرم)
مناسب: فرهنگ‌دوستان و طبیعت. تابستان.

**🌊 مسیر خلیج فارس (۵ روز)**:
قشم (۲ شب) → هنگام (۱ شب) → هرمز (۱ شب) → کیش (۱ شب)
مناسب: ساحل‌دوستان. پاییز و زمستان.""",
        "category": "itinerary",
        "destination": "Iran",
        "country": "Iran",
        "tags": ["route", "itinerary", "suggested", "multi-city"],
    },
    {
        "title": "حمل‌ونقل در ایران - راهنمای کامل",
        "content": """راهنمای حمل‌ونقل برای سفر در ایران:

**✈️ هواپیما**: ارزان‌ترین و سریع‌ترین. ایران‌ایر، ماهان، کیش‌ایر. رزرو از فلایتیو یا علی‌بابا. تهران-شیراز ۱.۵ ساعت.
**🚂 قطار**: فدک (لوکس تهران-اصفهان)، ۵ ستاره (تهران-مشهد). رزرو از رجا. راحت و منظره‌ای.
**🚌 اتوبوس VIP**: رویال سفر، سیروسفر. ارزان، راحت، شبانه = صرفه‌جویی هتل. تهران-اصفهان ۶ ساعت.
**🚗 اجاره ماشین**: مناسب برای مسیرهای روستایی و طبیعت. اسنپ‌باکس. رانندگی در شهرها = استرس!
**🚕 تاکسی**: اسنپ و تپسی (اوبر ایرانی). ارزان و قابل اعتماد. حتماً نصب کنید.
**🚇 مترو**: تهران (۶ خط)، اصفهان (۱ خط)، شیراز (۱ خط). ارزان و سریع.

نکات مهم:
- تعطیلات نوروز (۱-۱۳ فروردین): بلیط از ۲ ماه قبل رزرو کنید
- جاده‌های شمال (هراز/چالوس): ترافیک سنگین آخرهفته
- بنزین: بسیار ارزان در ایران. پمپ‌بنزین فراوان.""",
        "category": "tips",
        "destination": "Iran",
        "country": "Iran",
        "tags": ["transport", "domestic", "flight", "train", "bus"],
    },
]


async def seed_knowledge_base():
    """Seed the knowledge base with travel data."""
    await init_db()
    
    async with async_session() as db:
        # Check if already seeded
        from sqlalchemy import select, func
        count_result = await db.execute(
            select(func.count()).select_from(KnowledgeBase)
        )
        existing_count = count_result.scalar() or 0
        
        if existing_count >= len(KNOWLEDGE_ENTRIES):
            print(f"Knowledge base already has {existing_count} entries. Skipping seed.")
            return
        
        print(f"Seeding {len(KNOWLEDGE_ENTRIES)} knowledge base entries...")
        
        # Check embedding engine health
        health = await embedding_engine.health_check()
        if health.get("status") != "healthy":
            print(f"⚠️  Embedding engine not healthy: {health}")
            print("Will seed without embeddings (RAG search won't work until re-indexed)")
            use_embeddings = False
        else:
            print(f"✅ Embedding engine: {health.get('model', 'unknown')}")
            use_embeddings = True
        
        for i, entry in enumerate(KNOWLEDGE_ENTRIES):
            print(f"  [{i+1}/{len(KNOWLEDGE_ENTRIES)}] {entry['title'][:60]}...")
            
            embedding = None
            if use_embeddings:
                try:
                    text_to_embed = f"{entry['title']} {entry['content'][:500]}"
                    embedding = await embedding_engine.embed_text(text_to_embed)
                except Exception as e:
                    print(f"    ⚠️  Embedding failed: {e}")
            
            kb_entry = KnowledgeBase(
                title=entry["title"],
                content=entry["content"],
                source="seed",
                category=entry.get("category", "general"),
                destination=entry.get("destination", ""),
                country=entry.get("country", ""),
                tags=entry.get("tags", []),
                embedding=embedding,
            )
            db.add(kb_entry)
        
        await db.commit()
        print(f"✅ Successfully seeded {len(KNOWLEDGE_ENTRIES)} knowledge base entries!")


if __name__ == "__main__":
    asyncio.run(seed_knowledge_base())
