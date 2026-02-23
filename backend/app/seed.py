"""
Seed script — Populate database with initial travel data for testing.
Run: python -m app.seed
"""
import asyncio
import logging
from uuid import uuid4
from app.database import async_session, init_db
from app.models.user import User, UserRole
from app.models.itinerary import Itinerary, TripDay, Activity, ChecklistItem, Accommodation, PlanType, DifficultyLevel, BudgetLevel, ActivityType, TimePeriod
from app.models.chat import KnowledgeBase
from app.core.security import hash_password
from app.ai.embeddings import embedding_engine

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def seed():
    """Seed database with sample data."""
    await init_db()
    
    async with async_session() as db:
        # Check if already seeded
        from sqlalchemy import select, func
        count = await db.execute(select(func.count(User.id)))
        if count.scalar() > 0:
            logger.info("Database already seeded, skipping.")
            return
        
        logger.info("Seeding database...")
        
        # ===== Create Users =====
        admin = User(
            email="admin@tripology.com",
            username="admin",
            hashed_password=hash_password("463310817hH*h"),
            full_name="Tripology Admin",
            role=UserRole.ADMIN,
            is_active=True,
            is_verified=True,
        )
        
        creator1 = User(
            email="sarah@tripology.com",
            username="sarah_travels",
            hashed_password=hash_password("Creator123!"),
            full_name="Sarah Chen",
            role=UserRole.CREATOR,
            is_active=True,
            is_verified=True,
            country="Canada",
            bio="Canadian travel blogger. 45 countries and counting!",
            travel_styles=["Cultural", "Budget", "Adventure"],
            trips_shared=3,
        )
        
        traveler1 = User(
            email="mike@example.com",
            username="mike_adventures",
            hashed_password=hash_password("Traveler123!"),
            full_name="Mike Johnson",
            role=UserRole.TRAVELER,
            is_active=True,
            country="USA",
            travel_styles=["Romantic", "Luxury"],
            personality_scores={
                "adventure": "medium",
                "culinary": "high",
                "budget": "low",
                "relaxation": "high",
                "cultural": "high",
                "nature": "medium",
            },
        )
        
        db.add_all([admin, creator1, traveler1])
        await db.flush()
        
        # ===== Create Itinerary: Paris Romantic Getaway =====
        paris_itin = Itinerary(
            creator_id=creator1.id,
            title="Paris Romantic Getaway",
            slug="paris-romantic-getaway-" + uuid4().hex[:8],
            description="A beautiful 5-day journey through Paris, exploring iconic landmarks, charming cafes, and artistic neighborhoods.",
            highlight="Iconic landmarks, charming cafes, art museums, Seine river walks",
            cover_image="/paris-eiffel-tower-sunset.jpg",
            destination="Paris",
            country="France",
            city="Paris",
            coordinates={"lat": 48.8566, "lng": 2.3522},
            duration=5,
            budget_min=1200,
            budget_max=1800,
            budget_level=BudgetLevel.BUDGET,
            currency="CAD",
            difficulty=DifficultyLevel.EASY,
            best_season="April - June, September - October",
            suitable_for=["Couple", "Solo"],
            travel_styles=["Romantic", "Cultural", "Budget"],
            plan_type=PlanType.AI_OPTIMIZED,
            price=0,
            is_premium=False,
            is_published=True,
            is_verified=True,
            rating=4.8,
            review_count=342,
            views_count=5840,
            purchases_count=287,
            personality_scores={
                "adventure": "low",
                "culinary": "high",
                "budget": "low",
                "relaxation": "high",
                "cultural": "high",
                "nature": "low",
            },
            ai_travelers_count=2847,
            ai_last_updated="January 2026",
        )
        db.add(paris_itin)
        await db.flush()
        
        # Day 1
        day1 = TripDay(
            itinerary_id=paris_itin.id,
            day_number=1,
            title="Arrival & Montmartre",
            description="Explore the artistic heart of Paris",
        )
        db.add(day1)
        await db.flush()
        
        activities_day1 = [
            Activity(
                trip_day_id=day1.id,
                title="Check-in at Hotel",
                description="Settle into your accommodation in Le Marais",
                location="Le Marais",
                coordinates={"lat": 48.8566, "lng": 2.3522},
                activity_type=ActivityType.ACCOMMODATION,
                time_period=TimePeriod.MORNING,
                sort_order=0,
                image="/paris-cafe-terrace.jpg",
                duration="45 min",
                tips="Ask for a room with courtyard view",
                transport_options=[
                    {"type": "metro", "duration": "25 min", "cost": 2.15, "description": "Metro Line 1 + Line 12"},
                    {"type": "taxi", "duration": "15 min", "cost": 18, "description": "Direct taxi ride"},
                ],
            ),
            Activity(
                trip_day_id=day1.id,
                title="Lunch at Cafe des Deux Moulins",
                description="Famous Amelie filming location with authentic French cuisine",
                location="Montmartre",
                coordinates={"lat": 48.8847, "lng": 2.3334},
                activity_type=ActivityType.FOOD,
                time_period=TimePeriod.AFTERNOON,
                sort_order=1,
                image="/paris-cafe-terrace.jpg",
                cost=25,
                duration="1-1.5 hours",
                tips="Try the creme brulee - it's the best!",
                alternatives=[
                    {"title": "La Maison Rose", "description": "Pink corner cafe", "cost": 22},
                    {"title": "Le Consulat", "description": "Historic artists' cafe", "cost": 28},
                ],
            ),
            Activity(
                trip_day_id=day1.id,
                title="Sacre-Coeur Basilica",
                description="Stunning white church with panoramic Paris views from the dome",
                location="Montmartre",
                coordinates={"lat": 48.8867, "lng": 2.3431},
                activity_type=ActivityType.ACTIVITY,
                time_period=TimePeriod.AFTERNOON,
                sort_order=2,
                image="/paris-montmartre-streets.jpg",
                duration="1.5-2 hours",
                tips="Climb the dome for 360° views (300 steps)",
            ),
            Activity(
                trip_day_id=day1.id,
                title="Dinner at Pink Mamma",
                description="Trendy Italian restaurant with amazing pasta and rooftop terrace",
                location="10th Arr.",
                coordinates={"lat": 48.8711, "lng": 2.3702},
                activity_type=ActivityType.FOOD,
                time_period=TimePeriod.EVENING,
                sort_order=3,
                image="/paris-cafe-terrace.jpg",
                cost=45,
                duration="2 hours",
                tips="No reservations, arrive by 7pm to avoid long waits",
            ),
        ]
        db.add_all(activities_day1)
        
        # Day 2
        day2 = TripDay(
            itinerary_id=paris_itin.id,
            day_number=2,
            title="Iconic Paris",
            description="Visit the must-see landmarks",
        )
        db.add(day2)
        await db.flush()
        
        activities_day2 = [
            Activity(
                trip_day_id=day2.id,
                title="Eiffel Tower Sunrise",
                description="Beat the crowds with early access to the iconic tower",
                location="Champ de Mars",
                coordinates={"lat": 48.8584, "lng": 2.2945},
                activity_type=ActivityType.ACTIVITY,
                time_period=TimePeriod.EARLY_MORNING,
                sort_order=0,
                image="/paris-eiffel-tower-sunset.jpg",
                cost=35,
            ),
            Activity(
                trip_day_id=day2.id,
                title="Seine River Cruise",
                description="See Paris from the water, pass under historic bridges",
                location="Seine River",
                coordinates={"lat": 48.8599, "lng": 2.2937},
                activity_type=ActivityType.ACTIVITY,
                time_period=TimePeriod.AFTERNOON,
                sort_order=1,
                image="/paris-seine-river.jpg",
                cost=18,
            ),
        ]
        db.add_all(activities_day2)
        
        # Checklist
        checklist_items = [
            ChecklistItem(itinerary_id=paris_itin.id, category="documents", title="Valid passport", description="Check expiry date - must be valid for 6+ months", priority="high"),
            ChecklistItem(itinerary_id=paris_itin.id, category="documents", title="Travel insurance", description="Medical and trip cancellation coverage", priority="high"),
            ChecklistItem(itinerary_id=paris_itin.id, category="booking", title="Book Eiffel Tower tickets", description="Book online 2-3 weeks in advance", priority="high"),
            ChecklistItem(itinerary_id=paris_itin.id, category="booking", title="Reserve Louvre time slot", description="Required for entry", priority="high"),
            ChecklistItem(itinerary_id=paris_itin.id, category="essential", title="Download offline Paris map", description="Google Maps or Citymapper", priority="medium"),
            ChecklistItem(itinerary_id=paris_itin.id, category="packing", title="Comfortable walking shoes", description="You'll walk 10-15km daily", priority="high"),
            ChecklistItem(itinerary_id=paris_itin.id, category="packing", title="Power adapter (EU type)", description="France uses Type E plugs", priority="high"),
        ]
        db.add_all(checklist_items)
        
        # Accommodations
        accommodations = [
            Accommodation(
                itinerary_id=paris_itin.id,
                name="Hotel Le Marais Charm",
                accommodation_type="hotel",
                image="/paris-cafe-terrace.jpg",
                price_per_night=145,
                rating=4.7,
                review_count=234,
                neighborhood="Le Marais",
                amenities=["WiFi", "Breakfast", "AC", "24h Reception"],
                popular_with=["Couples", "First-timers"],
            ),
            Accommodation(
                itinerary_id=paris_itin.id,
                name="Montmartre Artist Loft",
                accommodation_type="airbnb",
                image="/paris-montmartre-streets.jpg",
                price_per_night=98,
                rating=4.9,
                review_count=156,
                neighborhood="Montmartre",
                amenities=["WiFi", "Kitchen", "Washer", "Balcony"],
                popular_with=["Solo travelers", "Artists"],
            ),
        ]
        db.add_all(accommodations)
        
        # ===== Create Iranian Creator =====
        creator_iran = User(
            email="maryam@tripology.com",
            username="maryam_safar",
            hashed_password=hash_password("Creator123!"),
            full_name="Maryam Rezaei",
            role=UserRole.CREATOR,
            is_active=True,
            is_verified=True,
            country="Iran",
            bio="Iranian travel blogger. Exploring the beauty of Persia!",
            travel_styles=["Cultural", "Adventure", "Nature"],
            trips_shared=6,
        )
        
        traveler_iran = User(
            email="ali@example.com",
            username="ali_travels",
            hashed_password=hash_password("Traveler123!"),
            full_name="Ali Mohammadi",
            role=UserRole.TRAVELER,
            is_active=True,
            country="Iran",
            travel_styles=["Cultural", "Budget", "Nature"],
            personality_scores={
                "adventure": "high",
                "culinary": "high",
                "budget": "medium",
                "relaxation": "medium",
                "cultural": "high",
                "nature": "high",
            },
        )
        
        db.add_all([creator_iran, traveler_iran])
        await db.flush()
        
        # ===== Create Itinerary: Isfahan Cultural Heritage =====
        isfahan_itin = Itinerary(
            creator_id=creator_iran.id,
            title="Isfahan Cultural Heritage",
            slug="isfahan-cultural-heritage-" + uuid4().hex[:8],
            description="A stunning 4-day journey through Isfahan, the jewel of Iran. Explore magnificent mosques, historic bazaars, and ancient bridges along the Zayandeh River.",
            highlight="Naqsh-e Jahan Square, Si-o-se-pol Bridge, Vank Cathedral, Traditional bazaars",
            cover_image="/iran-isfahan.jpg",
            destination="Isfahan",
            country="Iran",
            city="Isfahan",
            coordinates={"lat": 32.6546, "lng": 51.6680},
            duration=4,
            budget_min=5000000,
            budget_max=15000000,
            budget_level=BudgetLevel.BUDGET,
            currency="IRR",
            difficulty=DifficultyLevel.EASY,
            best_season="March - May, September - November",
            suitable_for=["Couple", "Solo", "Family"],
            travel_styles=["Cultural", "Historical", "Photography"],
            plan_type=PlanType.AI_OPTIMIZED,
            price=0,
            is_premium=False,
            is_published=True,
            is_verified=True,
            rating=4.9,
            review_count=456,
            views_count=7200,
            purchases_count=380,
            personality_scores={
                "adventure": "low",
                "culinary": "high",
                "budget": "low",
                "relaxation": "medium",
                "cultural": "high",
                "nature": "low",
            },
            ai_travelers_count=3100,
            ai_last_updated="January 2026",
        )
        db.add(isfahan_itin)
        await db.flush()
        
        # Isfahan Day 1
        isf_day1 = TripDay(
            itinerary_id=isfahan_itin.id,
            day_number=1,
            title="Arrival & Naqsh-e Jahan Square",
            description="Discover the heart of Isfahan",
        )
        db.add(isf_day1)
        await db.flush()
        
        isf_activities_day1 = [
            Activity(
                trip_day_id=isf_day1.id,
                title="Check-in at Abbasi Hotel",
                description="Settle into the historic Abbasi Hotel, a 300-year-old caravanserai turned luxury hotel",
                location="Chaharbagh Abbasi St",
                coordinates={"lat": 32.6539, "lng": 51.6729},
                activity_type=ActivityType.ACCOMMODATION,
                time_period=TimePeriod.MORNING,
                sort_order=0,
                image="/iran-isfahan.jpg",
                duration="45 min",
                tips="Request a room overlooking the courtyard garden",
            ),
            Activity(
                trip_day_id=isf_day1.id,
                title="Lunch at Shahrzad Restaurant",
                description="Traditional Isfahan cuisine with beautiful interior design",
                location="Abbas Abad St",
                coordinates={"lat": 32.6580, "lng": 51.6710},
                activity_type=ActivityType.FOOD,
                time_period=TimePeriod.AFTERNOON,
                sort_order=1,
                image="/iran-isfahan.jpg",
                cost=800000,
                duration="1.5 hours",
                tips="Try Beryani — Isfahan's signature dish!",
                alternatives=[
                    {"title": "Azam Beryani", "description": "Best Beryani in Isfahan", "cost": 400000},
                    {"title": "Herend Restaurant", "description": "Modern Iranian cuisine", "cost": 1200000},
                ],
            ),
            Activity(
                trip_day_id=isf_day1.id,
                title="Naqsh-e Jahan Square",
                description="One of the largest squares in the world, UNESCO World Heritage site with stunning Islamic architecture",
                location="Naqsh-e Jahan Square",
                coordinates={"lat": 32.6575, "lng": 51.6774},
                activity_type=ActivityType.ACTIVITY,
                time_period=TimePeriod.AFTERNOON,
                sort_order=2,
                image="/iran-isfahan.jpg",
                duration="3-4 hours",
                tips="Visit Sheikh Lotfollah Mosque and Imam Mosque for incredible tilework",
            ),
            Activity(
                trip_day_id=isf_day1.id,
                title="Dinner at Bastani Traditional Restaurant",
                description="Rooftop dining with views of the illuminated square",
                location="Naqsh-e Jahan Square",
                coordinates={"lat": 32.6570, "lng": 51.6770},
                activity_type=ActivityType.FOOD,
                time_period=TimePeriod.EVENING,
                sort_order=3,
                image="/iran-isfahan.jpg",
                cost=1000000,
                duration="2 hours",
                tips="Go at sunset for magical views of the lit-up square",
            ),
        ]
        db.add_all(isf_activities_day1)
        
        # Isfahan Day 2
        isf_day2 = TripDay(
            itinerary_id=isfahan_itin.id,
            day_number=2,
            title="Bridges & Armenian Quarter",
            description="Walk the historic bridges and explore Jolfa",
        )
        db.add(isf_day2)
        await db.flush()
        
        isf_activities_day2 = [
            Activity(
                trip_day_id=isf_day2.id,
                title="Si-o-se-pol Bridge at Sunrise",
                description="The iconic 33-arch bridge over Zayandeh River, built in 1602",
                location="Si-o-se-pol",
                coordinates={"lat": 32.6449, "lng": 51.6690},
                activity_type=ActivityType.ACTIVITY,
                time_period=TimePeriod.EARLY_MORNING,
                sort_order=0,
                image="/iran-isfahan.jpg",
                duration="1 hour",
            ),
            Activity(
                trip_day_id=isf_day2.id,
                title="Vank Cathedral",
                description="Beautiful Armenian cathedral with stunning frescoes and a museum",
                location="Jolfa (Armenian Quarter)",
                coordinates={"lat": 32.6390, "lng": 51.6610},
                activity_type=ActivityType.ACTIVITY,
                time_period=TimePeriod.MORNING,
                sort_order=1,
                image="/iran-isfahan.jpg",
                cost=500000,
                duration="1.5 hours",
            ),
        ]
        db.add_all(isf_activities_day2)
        
        # Isfahan Checklist
        isf_checklist = [
            ChecklistItem(itinerary_id=isfahan_itin.id, category="documents", title="Valid ID/Passport", description="Carry your national ID or passport", priority="high"),
            ChecklistItem(itinerary_id=isfahan_itin.id, category="essential", title="Download Snapp or Tapsi", description="Ride-hailing apps — Iran's Uber", priority="medium"),
            ChecklistItem(itinerary_id=isfahan_itin.id, category="packing", title="Comfortable walking shoes", description="You'll walk 10-15km daily on cobblestones", priority="high"),
            ChecklistItem(itinerary_id=isfahan_itin.id, category="packing", title="Headscarf for women", description="Required inside mosques and religious sites", priority="high"),
            ChecklistItem(itinerary_id=isfahan_itin.id, category="booking", title="Book Abbasi Hotel early", description="Very popular — book 2+ weeks in advance", priority="high"),
        ]
        db.add_all(isf_checklist)
        
        # Isfahan Accommodations
        isf_accommodations = [
            Accommodation(
                itinerary_id=isfahan_itin.id,
                name="Abbasi Hotel",
                accommodation_type="hotel",
                image="/iran-isfahan.jpg",
                price_per_night=8000000,
                rating=4.8,
                review_count=320,
                neighborhood="Chaharbagh",
                amenities=["WiFi", "Breakfast", "Pool", "Garden", "Restaurant"],
                popular_with=["Couples", "Families", "Heritage lovers"],
            ),
            Accommodation(
                itinerary_id=isfahan_itin.id,
                name="Bekhradi House",
                accommodation_type="guesthouse",
                image="/iran-isfahan.jpg",
                price_per_night=4000000,
                rating=4.9,
                review_count=210,
                neighborhood="Old Town",
                amenities=["WiFi", "Breakfast", "Courtyard", "Traditional decor"],
                popular_with=["Solo travelers", "Budget travelers"],
            ),
        ]
        db.add_all(isf_accommodations)
        
        # ===== Create Itinerary: Shiraz Poetry & Gardens =====
        shiraz_itin = Itinerary(
            creator_id=creator_iran.id,
            title="Shiraz Poetry & Gardens",
            slug="shiraz-poetry-gardens-" + uuid4().hex[:8],
            description="A magical 5-day trip through Shiraz, the city of poetry, wine, and roses. Visit the tombs of Hafez and Saadi, stunning gardens, and the ancient ruins of Persepolis.",
            highlight="Hafez Tomb, Persepolis, Eram Garden, Nasir al-Mulk Mosque",
            cover_image="/iran-shiraz.jpg",
            destination="Shiraz",
            country="Iran",
            city="Shiraz",
            coordinates={"lat": 29.5918, "lng": 52.5836},
            duration=5,
            budget_min=6000000,
            budget_max=18000000,
            budget_level=BudgetLevel.BUDGET,
            currency="IRR",
            difficulty=DifficultyLevel.EASY,
            best_season="March - May, October - November",
            suitable_for=["Couple", "Solo", "Family"],
            travel_styles=["Cultural", "Historical", "Romantic"],
            plan_type=PlanType.AI_OPTIMIZED,
            price=0,
            is_premium=False,
            is_published=True,
            is_verified=True,
            rating=4.8,
            review_count=389,
            views_count=6500,
            purchases_count=310,
            personality_scores={
                "adventure": "low",
                "culinary": "medium",
                "budget": "low",
                "relaxation": "high",
                "cultural": "high",
                "nature": "medium",
            },
            ai_travelers_count=2700,
            ai_last_updated="January 2026",
        )
        db.add(shiraz_itin)
        await db.flush()
        
        shiraz_day1 = TripDay(
            itinerary_id=shiraz_itin.id,
            day_number=1,
            title="Arrival & Pink Mosque",
            description="Discover the colorful heart of Shiraz",
        )
        db.add(shiraz_day1)
        await db.flush()
        
        shiraz_activities_day1 = [
            Activity(
                trip_day_id=shiraz_day1.id,
                title="Nasir al-Mulk Mosque (Pink Mosque)",
                description="Witness the stunning stained-glass light show at sunrise inside the Pink Mosque",
                location="Nasir al-Mulk",
                coordinates={"lat": 29.6048, "lng": 52.5481},
                activity_type=ActivityType.ACTIVITY,
                time_period=TimePeriod.EARLY_MORNING,
                sort_order=0,
                image="/iran-shiraz.jpg",
                cost=300000,
                duration="1.5 hours",
                tips="Arrive right at opening (7:30 AM) for the best light through stained glass",
            ),
            Activity(
                trip_day_id=shiraz_day1.id,
                title="Vakil Bazaar",
                description="Navigate the historic covered bazaar dating back to the 18th century",
                location="Vakil Bazaar",
                coordinates={"lat": 29.6091, "lng": 52.5447},
                activity_type=ActivityType.ACTIVITY,
                time_period=TimePeriod.MORNING,
                sort_order=1,
                image="/iran-shiraz.jpg",
                duration="2 hours",
                tips="Buy spices, traditional textiles, and handwoven carpets",
            ),
            Activity(
                trip_day_id=shiraz_day1.id,
                title="Hafez Tomb",
                description="Pay respects at the tomb of Iran's most beloved poet in a beautiful garden",
                location="Hafeziyeh",
                coordinates={"lat": 29.6200, "lng": 52.5600},
                activity_type=ActivityType.ACTIVITY,
                time_period=TimePeriod.EVENING,
                sort_order=2,
                image="/iran-shiraz.jpg",
                cost=200000,
                duration="1.5 hours",
                tips="Visit in the evening when locals gather to recite poetry",
            ),
        ]
        db.add_all(shiraz_activities_day1)
        
        # ===== Create Itinerary: Yazd Desert & Wind Towers =====
        yazd_itin = Itinerary(
            creator_id=creator_iran.id,
            title="Yazd Desert & Wind Towers",
            slug="yazd-desert-wind-towers-" + uuid4().hex[:8],
            description="A unique 3-day experience in Yazd, the world's oldest mud-brick city. Explore ancient wind towers, Zoroastrian fire temples, and the magical Dasht-e Kavir desert.",
            highlight="Old Town, Zoroastrian Fire Temple, Desert stargazing, Qanats",
            cover_image="/iran-yazd.jpg",
            destination="Yazd",
            country="Iran",
            city="Yazd",
            coordinates={"lat": 31.8974, "lng": 54.3569},
            duration=3,
            budget_min=4000000,
            budget_max=12000000,
            budget_level=BudgetLevel.BUDGET,
            currency="IRR",
            difficulty=DifficultyLevel.MODERATE,
            best_season="March - May, October - November",
            suitable_for=["Couple", "Solo", "Adventure"],
            travel_styles=["Adventure", "Cultural", "Photography"],
            plan_type=PlanType.RAW,
            price=0,
            is_premium=False,
            is_published=True,
            is_verified=True,
            rating=4.7,
            review_count=267,
            views_count=4800,
            purchases_count=220,
            personality_scores={
                "adventure": "high",
                "culinary": "medium",
                "budget": "medium",
                "relaxation": "low",
                "cultural": "high",
                "nature": "high",
            },
            ai_travelers_count=1800,
            ai_last_updated="December 2025",
        )
        db.add(yazd_itin)
        await db.flush()
        
        yazd_day1 = TripDay(
            itinerary_id=yazd_itin.id,
            day_number=1,
            title="Old Town & Wind Towers",
            description="Wander through the UNESCO-listed old town",
        )
        db.add(yazd_day1)
        await db.flush()
        
        yazd_activities_day1 = [
            Activity(
                trip_day_id=yazd_day1.id,
                title="Yazd Old Town Walking Tour",
                description="Explore the narrow alleys of the mud-brick old town, a UNESCO World Heritage site",
                location="Yazd Old Town",
                coordinates={"lat": 31.8950, "lng": 54.3550},
                activity_type=ActivityType.ACTIVITY,
                time_period=TimePeriod.MORNING,
                sort_order=0,
                image="/iran-yazd.jpg",
                duration="3 hours",
                tips="Get lost in the alleys — that's the best part!",
            ),
            Activity(
                trip_day_id=yazd_day1.id,
                title="Zoroastrian Fire Temple",
                description="Visit the Atash Behram fire temple where a flame has burned for 1,500+ years",
                location="Atash Behram",
                coordinates={"lat": 31.8940, "lng": 54.3520},
                activity_type=ActivityType.ACTIVITY,
                time_period=TimePeriod.AFTERNOON,
                sort_order=1,
                image="/iran-yazd.jpg",
                cost=300000,
                duration="1 hour",
            ),
        ]
        db.add_all(yazd_activities_day1)
        
        # ===== Create Itinerary: Tehran Modern & Historical =====
        tehran_itin = Itinerary(
            creator_id=traveler_iran.id,
            title="Tehran Modern & Historical",
            slug="tehran-modern-historical-" + uuid4().hex[:8],
            description="A 3-day exploration of Tehran, blending history with modernity. From the magnificent Golestan Palace to the vibrant Darband trail and bustling Grand Bazaar.",
            highlight="Golestan Palace, National Museum, Darband, Grand Bazaar",
            cover_image="/iran-tehran.jpg",
            destination="Tehran",
            country="Iran",
            city="Tehran",
            coordinates={"lat": 35.6892, "lng": 51.3890},
            duration=3,
            budget_min=5000000,
            budget_max=15000000,
            budget_level=BudgetLevel.BUDGET,
            currency="IRR",
            difficulty=DifficultyLevel.EASY,
            best_season="April - June, September - November",
            suitable_for=["Solo", "Family", "Friends"],
            travel_styles=["Cultural", "Urban", "Food"],
            plan_type=PlanType.RAW,
            price=0,
            is_premium=False,
            is_published=True,
            is_verified=True,
            rating=4.6,
            review_count=198,
            views_count=3900,
            purchases_count=150,
            personality_scores={
                "adventure": "medium",
                "culinary": "high",
                "budget": "medium",
                "relaxation": "low",
                "cultural": "high",
                "nature": "medium",
            },
            ai_travelers_count=1500,
            ai_last_updated="December 2025",
        )
        db.add(tehran_itin)
        await db.flush()
        
        tehran_day1 = TripDay(
            itinerary_id=tehran_itin.id,
            day_number=1,
            title="Historical Tehran",
            description="Explore Tehran's rich historical treasures",
        )
        db.add(tehran_day1)
        await db.flush()
        
        tehran_activities_day1 = [
            Activity(
                trip_day_id=tehran_day1.id,
                title="Golestan Palace",
                description="UNESCO World Heritage site — a stunning complex of royal buildings from the Qajar dynasty",
                location="Golestan Palace",
                coordinates={"lat": 35.6801, "lng": 51.4188},
                activity_type=ActivityType.ACTIVITY,
                time_period=TimePeriod.MORNING,
                sort_order=0,
                image="/iran-tehran.jpg",
                cost=500000,
                duration="2.5 hours",
                tips="Don't miss the Mirror Hall and Marble Throne",
            ),
            Activity(
                trip_day_id=tehran_day1.id,
                title="Tehran Grand Bazaar",
                description="One of the oldest and largest bazaars in the Middle East",
                location="Grand Bazaar",
                coordinates={"lat": 35.6716, "lng": 51.4222},
                activity_type=ActivityType.ACTIVITY,
                time_period=TimePeriod.AFTERNOON,
                sort_order=1,
                image="/iran-tehran.jpg",
                duration="2-3 hours",
                tips="Try Dizi (traditional lamb stew) at the bazaar restaurants",
            ),
            Activity(
                trip_day_id=tehran_day1.id,
                title="Darband Trail & Dinner",
                description="Hike the scenic mountain trail in north Tehran, ending with kebab at trailside restaurants",
                location="Darband",
                coordinates={"lat": 35.8120, "lng": 51.4205},
                activity_type=ActivityType.ACTIVITY,
                time_period=TimePeriod.EVENING,
                sort_order=2,
                image="/iran-tehran.jpg",
                cost=800000,
                duration="3 hours",
                tips="Go in the evening for cooler weather and beautiful sunset views",
            ),
        ]
        db.add_all(tehran_activities_day1)
        
        # ===== Create Itinerary: Tabriz Bazaar & Culture =====
        tabriz_itin = Itinerary(
            creator_id=creator_iran.id,
            title="Tabriz: World's Largest Covered Bazaar",
            slug="tabriz-bazaar-culture-" + uuid4().hex[:8],
            description="A 4-day adventure in Tabriz, exploring the UNESCO-listed Grand Bazaar, the stunning Blue Mosque, and the extraordinary cave village of Kandovan.",
            highlight="Grand Bazaar (UNESCO), Blue Mosque, Kandovan Cave Village, El Goli Park",
            cover_image="https://images.unsplash.com/photo-1590595978583-3f3d10e88e69?w=800&q=80",
            destination="Tabriz",
            country="Iran",
            city="Tabriz",
            coordinates={"lat": 38.0803, "lng": 46.2919},
            duration=4,
            budget_min=5000000,
            budget_max=12000000,
            budget_level=BudgetLevel.BUDGET,
            currency="IRR",
            difficulty=DifficultyLevel.EASY,
            best_season="May - October",
            suitable_for=["Solo", "Couple", "Family"],
            travel_styles=["Cultural", "Historical", "Food"],
            plan_type=PlanType.AI_OPTIMIZED,
            price=0,
            is_premium=False,
            is_published=True,
            is_verified=True,
            rating=4.8,
            review_count=312,
            views_count=5200,
            purchases_count=260,
            personality_scores={
                "adventure": "medium",
                "culinary": "high",
                "budget": "low",
                "relaxation": "medium",
                "cultural": "high",
                "nature": "medium",
            },
            ai_travelers_count=2800,
            ai_last_updated="February 2026",
        )
        db.add(tabriz_itin)
        await db.flush()
        
        tabriz_day1 = TripDay(
            itinerary_id=tabriz_itin.id,
            day_number=1,
            title="Grand Bazaar & Blue Mosque",
            description="Explore Tabriz's cultural heart",
        )
        db.add(tabriz_day1)
        await db.flush()
        
        tabriz_activities = [
            Activity(
                trip_day_id=tabriz_day1.id,
                title="Tabriz Grand Bazaar",
                description="Walk through the world's largest covered bazaar — a UNESCO World Heritage site dating back to 15th century",
                location="Tabriz Grand Bazaar",
                coordinates={"lat": 38.0803, "lng": 46.2919},
                activity_type=ActivityType.ACTIVITY,
                time_period=TimePeriod.MORNING,
                sort_order=0,
                duration="3 hours",
                tips="Visit the spice, carpet and gold sections",
            ),
            Activity(
                trip_day_id=tabriz_day1.id,
                title="Blue Mosque (Masjed-e Kabud)",
                description="Marvel at the 15th-century mosque with stunning blue-turquoise tilework",
                location="Blue Mosque",
                coordinates={"lat": 38.0744, "lng": 46.2966},
                activity_type=ActivityType.ACTIVITY,
                time_period=TimePeriod.AFTERNOON,
                sort_order=1,
                cost=200000,
                duration="1 hour",
            ),
            Activity(
                trip_day_id=tabriz_day1.id,
                title="El Goli Park",
                description="Relax at the historic park with its beautiful lakeside palace pavilion",
                location="El Goli",
                coordinates={"lat": 38.0440, "lng": 46.3560},
                activity_type=ActivityType.ACTIVITY,
                time_period=TimePeriod.EVENING,
                sort_order=2,
                duration="2 hours",
                tips="Visit at sunset for spectacular views",
            ),
        ]
        db.add_all(tabriz_activities)
        
        # ===== Create Itinerary: Kashan Historic Houses & Desert =====
        kashan_itin = Itinerary(
            creator_id=creator_iran.id,
            title="Kashan: Dream Houses & Fin Garden",
            slug="kashan-dream-houses-" + uuid4().hex[:8],
            description="A 3-day journey through Kashan, home to Iran's most beautiful historic houses, the legendary Fin Garden (UNESCO), the red village of Abyaneh, and stargazing in Maranjab Desert.",
            highlight="Tabatabaei House, Fin Garden (UNESCO), Abyaneh Village, Maranjab Desert",
            cover_image="https://images.unsplash.com/photo-1565108781645-65b9b28d1b88?w=800&q=80",
            destination="Kashan",
            country="Iran",
            city="Kashan",
            coordinates={"lat": 33.9836, "lng": 51.4439},
            duration=3,
            budget_min=4000000,
            budget_max=10000000,
            budget_level=BudgetLevel.BUDGET,
            currency="IRR",
            difficulty=DifficultyLevel.EASY,
            best_season="March - June, September - November",
            suitable_for=["Couple", "Solo", "Photography"],
            travel_styles=["Cultural", "Photography", "Romantic"],
            plan_type=PlanType.AI_OPTIMIZED,
            price=0,
            is_premium=False,
            is_published=True,
            is_verified=True,
            rating=4.9,
            review_count=287,
            views_count=4800,
            purchases_count=230,
            personality_scores={
                "adventure": "medium",
                "culinary": "medium",
                "budget": "low",
                "relaxation": "high",
                "cultural": "high",
                "nature": "medium",
            },
            ai_travelers_count=2200,
            ai_last_updated="February 2026",
        )
        db.add(kashan_itin)
        await db.flush()
        
        kashan_day1 = TripDay(
            itinerary_id=kashan_itin.id,
            day_number=1,
            title="Historic Houses & Fin Garden",
            description="Discover architectural masterpieces",
        )
        db.add(kashan_day1)
        await db.flush()
        
        kashan_activities = [
            Activity(
                trip_day_id=kashan_day1.id,
                title="Tabatabaei Historical House",
                description="Masterpiece of Qajar-era architecture with stunning mirrors, stained glass, and reflecting pools",
                location="Tabatabaei House",
                coordinates={"lat": 33.9836, "lng": 51.4439},
                activity_type=ActivityType.ACTIVITY,
                time_period=TimePeriod.MORNING,
                sort_order=0,
                cost=300000,
                duration="1.5 hours",
                tips="Visit in morning for beautiful light through the stained glass",
            ),
            Activity(
                trip_day_id=kashan_day1.id,
                title="Borujerdi Historical House",
                description="Another architectural gem with the most elaborate windcatcher in Iran",
                location="Borujerdi House",
                coordinates={"lat": 33.9840, "lng": 51.4430},
                activity_type=ActivityType.ACTIVITY,
                time_period=TimePeriod.MORNING,
                sort_order=1,
                cost=300000,
                duration="1 hour",
            ),
            Activity(
                trip_day_id=kashan_day1.id,
                title="Fin Garden (Bagh-e Fin)",
                description="Iran's oldest surviving garden (UNESCO), with natural springs and historic hammam",
                location="Fin Garden",
                coordinates={"lat": 33.9728, "lng": 51.4472},
                activity_type=ActivityType.ACTIVITY,
                time_period=TimePeriod.AFTERNOON,
                sort_order=2,
                cost=400000,
                duration="2 hours",
                tips="Don't miss the Fin Hammam where Amir Kabir was assassinated",
            ),
        ]
        db.add_all(kashan_activities)
        
        kashan_day2 = TripDay(
            itinerary_id=kashan_itin.id,
            day_number=2,
            title="Abyaneh Village & Maranjab Desert",
            description="Red village and desert stargazing",
        )
        db.add(kashan_day2)
        await db.flush()
        
        kashan_activities_day2 = [
            Activity(
                trip_day_id=kashan_day2.id,
                title="Abyaneh Village",
                description="Explore the 1,500-year-old red village where locals still wear traditional clothes and speak Pahlavi",
                location="Abyaneh",
                coordinates={"lat": 33.5500, "lng": 51.4000},
                activity_type=ActivityType.ACTIVITY,
                time_period=TimePeriod.MORNING,
                sort_order=0,
                cost=100000,
                duration="3 hours",
                tips="Chat with locals — they speak ancient Pahlavi language!",
            ),
            Activity(
                trip_day_id=kashan_day2.id,
                title="Maranjab Desert & Stargazing",
                description="Camp under billions of stars in the salt desert, visit the Maranjab caravanserai",
                location="Maranjab Desert",
                coordinates={"lat": 34.3000, "lng": 51.8000},
                activity_type=ActivityType.ACTIVITY,
                time_period=TimePeriod.EVENING,
                sort_order=1,
                cost=2000000,
                duration="Overnight",
                tips="Bring wide-angle camera lens for astrophotography",
            ),
        ]
        db.add_all(kashan_activities_day2)
        
        # ===== Create Itinerary: Hormozgan Islands =====
        hormozgan_itin = Itinerary(
            creator_id=traveler_iran.id,
            title="Qeshm & Hormoz Islands: Colorful Paradise",
            slug="hormozgan-islands-" + uuid4().hex[:8],
            description="A 5-day island adventure exploring the surreal Rainbow Valley of Hormoz, the Hara Mangrove Forests, Stars Valley, and pristine beaches of Qeshm — Iran's hidden tropical gem.",
            highlight="Rainbow Valley, Hara Mangrove Forest, Stars Valley, Salt Caves",
            cover_image="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
            destination="Qeshm & Hormoz",
            country="Iran",
            city="Bandar Abbas",
            coordinates={"lat": 26.9500, "lng": 56.2700},
            duration=5,
            budget_min=6000000,
            budget_max=15000000,
            budget_level=BudgetLevel.BUDGET,
            currency="IRR",
            difficulty=DifficultyLevel.EASY,
            best_season="November - March",
            suitable_for=["Solo", "Couple", "Friends"],
            travel_styles=["Adventure", "Nature", "Photography"],
            plan_type=PlanType.RAW,
            price=0,
            is_premium=False,
            is_published=True,
            is_verified=True,
            rating=4.7,
            review_count=198,
            views_count=3500,
            purchases_count=160,
            personality_scores={
                "adventure": "high",
                "culinary": "medium",
                "budget": "medium",
                "relaxation": "high",
                "cultural": "medium",
                "nature": "high",
            },
            ai_travelers_count=1600,
            ai_last_updated="January 2026",
        )
        db.add(hormozgan_itin)
        await db.flush()
        
        hormoz_day1 = TripDay(
            itinerary_id=hormozgan_itin.id,
            day_number=1,
            title="Hormoz Rainbow Island",
            description="Discover the most surreal island in Iran",
        )
        db.add(hormoz_day1)
        await db.flush()
        
        hormoz_activities = [
            Activity(
                trip_day_id=hormoz_day1.id,
                title="Rainbow Valley (Hormoz)",
                description="Walk through a valley of 70+ different colored soils — feels like another planet!",
                location="Hormoz Island",
                coordinates={"lat": 27.0580, "lng": 56.4500},
                activity_type=ActivityType.ACTIVITY,
                time_period=TimePeriod.MORNING,
                sort_order=0,
                duration="2.5 hours",
                tips="Wear shoes you don't mind getting stained — the soil stains everything!",
            ),
            Activity(
                trip_day_id=hormoz_day1.id,
                title="Red Beach of Hormoz",
                description="Surreal beach where the sand is bright red, meeting turquoise waters",
                location="Red Beach, Hormoz",
                coordinates={"lat": 27.0650, "lng": 56.4600},
                activity_type=ActivityType.ACTIVITY,
                time_period=TimePeriod.AFTERNOON,
                sort_order=1,
                duration="1.5 hours",
            ),
        ]
        db.add_all(hormoz_activities)
        
        # ===== Seed Knowledge Base ====
        knowledge_items = [
            {
                "title": "Best time to visit Paris",
                "content": "The best time to visit Paris is April to June and September to October. Spring brings cherry blossoms and pleasant temperatures (15-20°C). Fall offers beautiful foliage and fewer crowds. Summer (July-August) is peak tourist season with temperatures up to 35°C. Winter is cold but magical with Christmas markets.",
                "category": "tip",
                "destination": "Paris",
                "country": "France",
                "tags": ["season", "weather", "timing"],
            },
            {
                "title": "Paris Metro Guide",
                "content": "The Paris Metro is the fastest way to get around. Buy a Navigo Easy card (€2) and load t+ tickets (€2.15 each) or a weekly Navigo Decouverte pass (€30.75 for unlimited travel). Metro runs from 5:30am to 1:15am (2:15am on weekends). Key tips: keep your ticket until you exit, watch for pickpockets at tourist stations like Chatelet.",
                "category": "transport",
                "destination": "Paris",
                "country": "France",
                "tags": ["metro", "transport", "navigo"],
            },
            {
                "title": "Paris Budget Tips",
                "content": "Paris can be affordable: 1) Many museums are free on first Sundays. 2) Picnic with baguette, cheese, and wine from a supermarket (~€10). 3) Use Velib bike-share (€5/day). 4) Free walking tours available daily. 5) Lunch prix fixe menus are cheaper than dinner (€15-20 for 3 courses). 6) Tap water is free in restaurants (ask for carafe d'eau).",
                "category": "tip",
                "destination": "Paris",
                "country": "France",
                "tags": ["budget", "money", "savings"],
            },
            {
                "title": "Eiffel Tower Visit Guide",
                "content": "Book tickets online 2-3 weeks in advance at toureiffel.paris. Summit tickets cost €35.30 (lift) or €14.20 (stairs to 2nd floor). Best time: early morning or evening for sunset. The tower sparkles every hour on the hour after dark for 5 minutes. Best photo spot: Trocadero esplanade across the Seine.",
                "category": "activity",
                "destination": "Paris",
                "country": "France",
                "tags": ["eiffel", "landmark", "booking"],
            },
            {
                "title": "Le Marais Neighborhood Guide",
                "content": "Le Marais (3rd-4th arr.) is Paris's trendiest neighborhood. Must-visit: Place des Vosges (oldest square), Merci concept store, L'As du Fallafel (best falafel), Musée Carnavalet (free!). It's the LGBTQ+ center of Paris. Best explored on foot on a Sunday when Rue des Rosiers is car-free.",
                "category": "neighborhood",
                "destination": "Paris",
                "country": "France",
                "tags": ["marais", "neighborhood", "walking"],
            },
            {
                "title": "French Food Essentials",
                "content": "Must-try in Paris: 1) Croissant from a local boulangerie (not chain). 2) Croque Monsieur (ham & cheese sandwich). 3) Steak Tartare (raw beef). 4) Crème Brûlée. 5) Escargots (snails in garlic butter). 6) Duck Confit. Don't tip more than 5-10% — service is included. Say 'Bonjour' when entering any shop.",
                "category": "food",
                "destination": "Paris",
                "country": "France",
                "tags": ["food", "dining", "culture"],
            },
            # ===== Iranian Knowledge Base =====
            {
                "title": "Best time to visit Isfahan",
                "content": "The best time to visit Isfahan is March-May (spring) and September-November (autumn). Spring brings Nowruz celebrations and pleasant 18-25°C weather. Autumn has mild temperatures and fewer crowds. Summer can reach 40°C. Winter is cold but offers snow-capped views of Zagros mountains and fewer tourists.",
                "category": "tip",
                "destination": "Isfahan",
                "country": "Iran",
                "tags": ["season", "weather", "timing", "isfahan"],
            },
            {
                "title": "Isfahan Transport Guide",
                "content": "Getting around Isfahan: 1) Use Snapp or Tapsi apps (Iran's Uber) for affordable rides. 2) The city bus system covers major routes. 3) Walking is the best way to explore the old town and bazaar. 4) Rent a bicycle for Zayandeh River path. 5) Metro line under construction. 6) Inter-city buses from Kaveh or Sofeh terminals.",
                "category": "transport",
                "destination": "Isfahan",
                "country": "Iran",
                "tags": ["transport", "snapp", "taxi", "bus"],
            },
            {
                "title": "Isfahan Must-See Attractions",
                "content": "Must-visit in Isfahan: 1) Naqsh-e Jahan Square — one of the largest squares in the world (UNESCO). 2) Sheikh Lotfollah Mosque — stunning tilework. 3) Imam Mosque — masterpiece of Islamic architecture. 4) Si-o-se-pol (33 arches bridge). 5) Khaju Bridge. 6) Vank Cathedral in Armenian Quarter. 7) Chehel Sotoun Palace. 8) Isfahan Grand Bazaar.",
                "category": "activity",
                "destination": "Isfahan",
                "country": "Iran",
                "tags": ["attractions", "sightseeing", "mosque", "bridge"],
            },
            {
                "title": "Isfahan Food Guide",
                "content": "Must-try in Isfahan: 1) Beryani — Isfahan's signature minced lamb dish. 2) Gaz — famous Isfahan nougat candy. 3) Poolaki — thin sugar candy. 4) Khoresht Mast — yogurt-based dessert. 5) Biryani rice dishes. Traditional restaurants: Shahrzad, Azam Beryani, and rooftop restaurants around Naqsh-e Jahan Square. Tea houses under the bridges are a must-experience.",
                "category": "food",
                "destination": "Isfahan",
                "country": "Iran",
                "tags": ["food", "beryani", "gaz", "cuisine"],
            },
            {
                "title": "Best time to visit Shiraz",
                "content": "The best time to visit Shiraz is March-May when the Eram Garden roses bloom and weather is perfect (20-28°C). The Nowruz period (late March) is festive. Autumn (October-November) is also pleasant. The Pink Mosque light show is best in early morning year-round. Visit Persepolis early morning to avoid midday heat.",
                "category": "tip",
                "destination": "Shiraz",
                "country": "Iran",
                "tags": ["season", "weather", "shiraz"],
            },
            {
                "title": "Shiraz Must-See Attractions",
                "content": "Must-visit in Shiraz: 1) Nasir al-Mulk (Pink Mosque) — arrive at 7:30 AM for the stained-glass light show. 2) Persepolis — ancient capital of the Achaemenid Empire (60km from city). 3) Hafez Tomb — gather poetry readings in the evening. 4) Saadi Tomb. 5) Eram Garden (UNESCO). 6) Vakil Bazaar and Mosque. 7) Qavam House (Narenjestan).",
                "category": "activity",
                "destination": "Shiraz",
                "country": "Iran",
                "tags": ["attractions", "persepolis", "hafez", "mosque"],
            },
            {
                "title": "Yazd Desert Experience",
                "content": "Yazd offers unique desert experiences: 1) Old Town walking tour through mud-brick alleys (UNESCO). 2) Wind tower (badgir) architecture — ancient air conditioning. 3) Zoroastrian Fire Temple with 1,500-year-old flame. 4) Towers of Silence (Dakhma). 5) Desert stargazing tours. 6) Qanat underground water channels. 7) Fahadan neighborhood. Best visited in spring or autumn — summers exceed 45°C.",
                "category": "activity",
                "destination": "Yazd",
                "country": "Iran",
                "tags": ["desert", "architecture", "yazd", "zoroastrian"],
            },
            {
                "title": "Tehran City Guide",
                "content": "Tehran essentials: 1) Golestan Palace (UNESCO) — Qajar dynasty royal complex. 2) National Museum of Iran — 8,000 years of Persian history. 3) Tehran Grand Bazaar — one of the largest in the Middle East. 4) Darband trail — mountain hiking with restaurants. 5) Milad Tower — panoramic city views. 6) Sa'dabad Palace complex. 7) Tajrish Bazaar. Use Snapp/Tapsi and Metro for transport. Traffic is legendary — avoid rush hours.",
                "category": "activity",
                "destination": "Tehran",
                "country": "Iran",
                "tags": ["tehran", "city", "palace", "bazaar"],
            },
            {
                "title": "Iran Travel Tips",
                "content": "Essential Iran travel tips: 1) VPN needed for WhatsApp, Instagram, and Google services. 2) International credit cards DON'T work — bring cash (USD/EUR) and exchange locally. 3) Dress code: women must wear headscarf in public; loose clothing for both genders. 4) Taarof (Persian politeness) — offers of free items/rides are usually polite gestures, insist on paying. 5) Tipping 10% is appreciated. 6) Farsi basic phrases go a long way. 7) People are extremely hospitable — you'll be invited to many homes!",
                "category": "tip",
                "destination": "Iran",
                "country": "Iran",
                "tags": ["tips", "culture", "etiquette", "money"],
            },
            {
                "title": "Iranian Cuisine Guide",
                "content": "Must-try Iranian dishes: 1) Chelo Kebab — the national dish (saffron rice + kebab). 2) Ghormeh Sabzi — herb stew with lamb. 3) Tahdig — crispy saffron rice. 4) Dizi (Abgoosht) — lamb and chickpea stew. 5) Zereshk Polo — barberry rice with chicken. 6) Ash Reshteh — thick noodle soup. 7) Fesenjān — pomegranate walnut stew. 8) Iranian tea is a constant — always served with sugar cubes (nabat).",
                "category": "food",
                "destination": "Iran",
                "country": "Iran",
                "tags": ["food", "kebab", "cuisine", "persian"],
            },
            {
                "title": "Tabriz Grand Bazaar Guide",
                "content": "Tabriz Grand Bazaar is the world's largest covered bazaar (UNESCO since 2010). Dating to the 15th century, it spans 7km of covered passages. Must-visit sections: 1) Mozaffarieh — gold and jewelry. 2) Amir Bazaar — carpets and rugs. 3) Spice section — saffron, dried fruits. Try: Tebrizli kebab, Kalle Pache for breakfast, Qurabiya cookies. Nearby: Blue Mosque (Masjed-e Kabud), Azerbaijan Museum, El Goli Park. Visit Kandovan cave village (60km away) — a living Cappadocia!",
                "category": "activity",
                "destination": "Tabriz",
                "country": "Iran",
                "tags": ["bazaar", "tabriz", "unesco", "shopping"],
            },
            {
                "title": "Kashan Historic Houses & Rosewater",
                "content": "Kashan is a hidden gem 2.5hrs from Tehran. Must-visit: 1) Tabatabaei House — Qajar masterpiece with mirrors & reflecting pools. 2) Borujerdi House — most elaborate windcatcher. 3) Abbasi House. 4) Fin Garden — oldest surviving Persian garden (UNESCO). 5) Sultan Amir Ahmad Bathhouse — roof with city views. Visit May for the famous Golab-giri (rosewater distillation festival) in nearby Niassar and Qamsar villages. Day trip to Abyaneh red village (1,500 years old, Pahlavi-speaking locals) and Maranjab Desert for stargazing.",
                "category": "activity",
                "destination": "Kashan",
                "country": "Iran",
                "tags": ["kashan", "historical", "rosewater", "architecture"],
            },
            {
                "title": "Hormozgan Islands: Qeshm & Hormoz",
                "content": "Iran's tropical paradise in the Persian Gulf. Hormoz Island: 1) Rainbow Valley — 70+ colors of soil. 2) Red Beach — surreal red sand meeting turquoise water. 3) Silence Valley. Explore by bicycle (rent for $2/day). Qeshm Island (largest in Persian Gulf): 1) Stars Valley (Darre Setareh) — erosion-carved formations. 2) Hara Mangrove Forest — boat tours through Iran's only mangrove. 3) Namakdan Salt Caves — longest in the world. 4) Portuguese Castle. Best season: November to March (summers are 45°C+). Ferry from Bandar Abbas (30min to Hormoz, 1hr to Qeshm).",
                "category": "activity",
                "destination": "Qeshm",
                "country": "Iran",
                "tags": ["island", "hormoz", "qeshm", "beach", "nature"],
            },
            {
                "title": "Gilan & Masuleh Hidden Gems",
                "content": "Gilan province is Iran's green paradise on the Caspian Sea coast. Must-visit: 1) Masuleh — a 1,000-year-old stepped village where roofs are streets. 2) Rudkhan Castle — 1,000-year-old fortress in the forest, 1km+ walls (1,100 steps to reach). 3) Visadar Waterfall — stunning jungle waterfall. 4) Anzali Lagoon — boat tours. 5) Rasht — UNESCO Creative City of Gastronomy. Must-try foods: Mirza Ghasemi (smoky eggplant), Baghala Ghatogh (fava beans), Torsh Tareh (sour herb stew), Reshteh Khoshkar (Gilani cookie). Best season: May-September.",
                "category": "activity",
                "destination": "Gilan",
                "country": "Iran",
                "tags": ["masuleh", "gilan", "nature", "food", "village"],
            },
            {
                "title": "Alamut Castle & Ovan Lake Trek",
                "content": "Alamut Valley in Qazvin province holds the legendary Assassins' Castle: 1) Alamut Castle (Qal'eh-ye Alamot) — Hassan Sabbah's famous stronghold at 2,163m altitude. 2) Ovan Lake — a stunning turquoise high-altitude lake surrounded by mountains. 3) Evan Lake — perfect for camping. The trek from Alamut to Ovan takes 4-5 hours (moderate difficulty). Best combined with a visit to Oushin waterfall. Bring camping gear for overnight at the lake. Best season: May-September. Access from Tehran: 3.5 hours drive to Ghazor Khan village.",
                "category": "activity",
                "destination": "Alamut",
                "country": "Iran",
                "tags": ["alamut", "trekking", "castle", "lake", "adventure"],
            },
        ]
        
        for item in knowledge_items:
            try:
                content_text = f"{item['title']}. {item['content']}"
                embedding = await embedding_engine.embed_text(content_text)
                kb = KnowledgeBase(
                    title=item["title"],
                    content=item["content"],
                    source="manual",
                    category=item["category"],
                    destination=item["destination"],
                    country=item["country"],
                    tags=item["tags"],
                    embedding=embedding,
                )
                db.add(kb)
            except Exception as e:
                logger.warning(f"Could not embed knowledge '{item['title']}': {e}")
                # Add without embedding
                kb = KnowledgeBase(
                    title=item["title"],
                    content=item["content"],
                    source="manual",
                    category=item["category"],
                    destination=item["destination"],
                    country=item["country"],
                    tags=item["tags"],
                )
                db.add(kb)
        
        await db.commit()
        logger.info("✅ Database seeded successfully!")
        logger.info("   - 5 users (admin, 2 creators, 2 travelers)")
        logger.info("   - 8 itineraries (1 Paris + 7 Iranian: Isfahan, Shiraz, Yazd, Tehran, Tabriz, Kashan, Hormozgan)")
        logger.info(f"   - {len(knowledge_items)} knowledge base entries")


if __name__ == "__main__":
    asyncio.run(seed())
