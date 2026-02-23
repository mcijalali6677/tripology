# i18n Text Extraction Report — Tripology

> Comprehensive list of all translatable text strings, organized by file.
> Each entry: **Text** → `suggested.i18n.key`

---

## Table of Contents
1. [app/layout.tsx](#applayout)
2. [app/page.tsx](#apppage)
3. [app/login/page.tsx](#applogin)
4. [app/quiz/page.tsx](#appquiz)
5. [app/custom-trip/page.tsx](#appcustomtrip)
6. [app/custom-trip/loading.tsx](#appcustomtriploading)
7. [app/my-itinerary/page.tsx](#appmyitinerary)
8. [app/submit-trip/page.tsx](#appsubmittrip)
9. [app/submit-trip/loading.tsx](#appsubmittriploading)
10. [app/trip-basket/page.tsx](#apptripbasket)
11. [app/trip-companion/page.tsx](#apptripcompanion)
12. [app/profile/page.tsx](#appprofile)
13. [app/destinations/iran/page.tsx](#appdestinationsiran)
14. [app/itinerary/[id]/page.tsx](#appitinerarypage)
15. [app/itinerary/[id]/client.tsx](#appitineraryclient)
16. [app/itinerary/[id]/raw-trip-client.tsx](#appitineraryrawtripclient)
17. [components/navbar.tsx](#navbar)
18. [components/bottom-nav.tsx](#bottomnav)
19. [components/footer.tsx](#footer)
20. [components/ai-assistant-chat.tsx](#aichat)
21. [components/categories.tsx](#categories)
22. [components/data-monetization-cta.tsx](#datamonetization)
23. [components/exclusive-trips.tsx](#exclusivetrips)
24. [components/faq.tsx](#faq)
25. [components/how-it-works.tsx](#howitworks)
26. [components/itinerary-card.tsx](#itinerarycard)
27. [components/filter-sidebar.tsx](#filtersidebar)
28. [components/personality-cta.tsx](#personalitycta)
29. [components/testimonials.tsx](#testimonials)
30. [components/trip-map.tsx](#tripmap)
31. [components/trust-badges.tsx](#trustbadges)

---

<a id="applayout"></a>
## 1. app/layout.tsx

| Text | Suggested Key |
|------|--------------|
| `Tripology \| Travel Itinerary Marketplace` | `meta.title` |
| `Discover and purchase real travel itineraries from experienced travelers. Get authentic trip plans with tested routes, budgets, and hidden gems - all in CAD.` | `meta.description` |

---

<a id="apppage"></a>
## 2. app/page.tsx

| Text | Suggested Key |
|------|--------------|
| `Real Trip Plans from` | `home.hero.titlePart1` |
| `Real Travelers` | `home.hero.titleHighlight` |
| `Buy tested itineraries with real budgets, tips, and hidden gems.` | `home.hero.subtitle` |
| `Explore Plans` | `home.hero.explorePlans` |
| `Build My Trip` | `home.hero.buildMyTrip` |
| `Paris, France` | `home.marketplace.destinationLabel` |
| `Paris Travel Plans` | `home.marketplace.title` |
| `plans available` | `home.marketplace.plansAvailable` |
| `All` | `home.marketplace.filterAll` |
| `Traveler Plans` | `home.marketplace.filterTraveler` |
| `AI Premium` | `home.marketplace.filterAIPremium` |
| `Filters` | `home.marketplace.filtersButton` |
| `found` | `home.marketplace.found` |
| `Sort by` | `home.marketplace.sortBy` |
| `Most Popular` | `home.marketplace.sortPopular` |
| `Highest Rated` | `home.marketplace.sortRating` |
| `Lowest Price` | `home.marketplace.sortPriceLow` |
| `Highest Price` | `home.marketplace.sortPriceHigh` |
| `Newest` | `home.marketplace.sortNewest` |

---

<a id="applogin"></a>
## 3. app/login/page.tsx

| Text | Suggested Key |
|------|--------------|
| `Back to Home` | `login.backToHome` |
| `Tripology` | `login.brandName` |
| `AI-powered travel planning` | `login.tagline` |
| `Sign In` | `login.signIn` |
| `Sign Up` | `login.signUp` |
| `Email or Username` | `login.emailOrUsername` |
| `you@example.com or username` | `login.emailPlaceholder` |
| `Password` | `login.password` |
| `••••••••` | `login.passwordPlaceholder` |
| `Login failed. Please check your credentials.` | `login.error.loginFailed` |
| `Registration failed. Please try again.` | `login.error.registrationFailed` |
| `Demo: admin@tripology.com / admin123` | `login.demoCredentials` |
| `Full Name` | `login.fullName` |
| `Your name` | `login.fullNamePlaceholder` |
| `Email` | `login.email` |
| `you@example.com` | `login.emailOnlyPlaceholder` |
| `Username` | `login.username` |
| `Choose a username` | `login.usernamePlaceholder` |
| `Min 8 characters` | `login.passwordMinLength` |
| `Create Account` | `login.createAccount` |
| `Your data stays on our servers. No third-party AI APIs.` | `login.privacyNotice` |

---

<a id="appquiz"></a>
## 4. app/quiz/page.tsx

| Text | Suggested Key |
|------|--------------|
| `Tripology` | `quiz.brandName` |
| `Exit` | `quiz.exit` |
| `Question {n} of {total}` | `quiz.questionProgress` |
| `% complete` | `quiz.percentComplete` |
| `Back` | `quiz.back` |
| `See My Results` | `quiz.seeResults` |
| `Your Travel Personality` | `quiz.results.title` |
| `You're a` | `quiz.results.youreA` |
| `Also` | `quiz.results.also` |
| `Your Full Travel Profile` | `quiz.results.fullProfile` |
| `Find Matching Trips` | `quiz.results.findTrips` |
| `Retake Quiz` | `quiz.results.retake` |

---

<a id="appcustomtrip"></a>
## 5. app/custom-trip/page.tsx

### Static UI Text

| Text | Suggested Key |
|------|--------------|
| `Back to Plans` | `customTrip.backToPlans` |
| `Build Your {destination} Trip` | `customTrip.title` |
| `Select activities from each section of your trip and add them to your basket. Then we will arrange your trip according to your preferences with AI.` | `customTrip.subtitle` |
| `AI Accommodation Matching` | `customTrip.infoCard.aiAccommodation.title` |
| `After selecting your activities, we'll find the best accommodation based on real user data and your itinerary.` | `customTrip.infoCard.aiAccommodation.desc` |
| `We're With You During Your Trip` | `customTrip.infoCard.companion.title` |
| `If any planned activity doesn't work out, we'll instantly suggest alternatives. We're your companion throughout the journey!` | `customTrip.infoCard.companion.desc` |
| `Trip Settings` | `customTrip.settings.title` |
| `Hide` | `customTrip.settings.hide` |
| `Edit` | `customTrip.settings.edit` |
| `Destination` | `customTrip.settings.destination` |
| `Start Date` | `customTrip.settings.startDate` |
| `End Date` | `customTrip.settings.endDate` |
| `Travelers` | `customTrip.settings.travelers` |
| `traveler` / `travelers` | `customTrip.settings.travelerLabel` |
| `Budget Level` | `customTrip.settings.budgetLevel` |
| `Budget` | `customTrip.settings.budget` |
| `Under $100/day` | `customTrip.settings.budgetDesc` |
| `Mid-range` | `customTrip.settings.midRange` |
| `$100-250/day` | `customTrip.settings.midRangeDesc` |
| `Luxury` | `customTrip.settings.luxury` |
| `$250+/day` | `customTrip.settings.luxuryDesc` |
| `Accommodation` | `customTrip.accommodation.title` |
| `(Add one or more stays)` | `customTrip.accommodation.addStays` |
| `stay(s) added` | `customTrip.accommodation.staysAdded` |
| `Have you booked your accommodation?` | `customTrip.accommodation.bookingQuestion` |
| `Already Booked` | `customTrip.accommodation.statusBooked` |
| `I'll enter hotel details` | `customTrip.accommodation.statusBookedDesc` |
| `Planning to Book` | `customTrip.accommodation.statusPlanning` |
| `I know the area/type` | `customTrip.accommodation.statusPlanningDesc` |
| `Decide Later` | `customTrip.accommodation.statusUndecided` |
| `AI will suggest` | `customTrip.accommodation.statusUndecidedDesc` |
| `Your Stays` | `customTrip.accommodation.yourStays` |
| `Add your first stay` | `customTrip.accommodation.addFirstStay` |
| `Add another stay` | `customTrip.accommodation.addAnotherStay` |
| `Check-in` | `customTrip.accommodation.checkIn` |
| `Check-out` | `customTrip.accommodation.checkOut` |
| `Arrival time` | `customTrip.accommodation.arrivalTime` |
| `Search hotel name or address...` | `customTrip.accommodation.searchPlaceholder` |
| `No results. Try a different search.` | `customTrip.accommodation.noResults` |
| `Cancel` | `customTrip.accommodation.cancel` |
| `Add accommodation` | `customTrip.accommodation.addAccommodation` |
| `Your itinerary will be optimized based on your {n} stay(s) with arrival times considered.` | `customTrip.accommodation.optimizationNotice` |
| `We'll suggest optimal areas based on your selected activities. You can book after seeing your itinerary.` | `customTrip.accommodation.planningInfo` |
| `No problem! AI will help you decide.` | `customTrip.accommodation.aiHelpTitle` |
| `We'll suggest the best areas and accommodation types based on your activities, budget, and real traveler recommendations.` | `customTrip.accommodation.aiHelpDesc` |
| `Arrival:` | `customTrip.accommodation.arrival` |
| `Popular` | `customTrip.filters.popular` |
| `Filter` | `customTrip.filters.filter` |
| `Price:` | `customTrip.filters.price` |
| `All` | `customTrip.filters.priceAll` |
| `Free` | `customTrip.filters.priceFree` |
| `Under $20` | `customTrip.filters.priceUnder20` |
| `$20-50` | `customTrip.filters.price2050` |
| `$50+` | `customTrip.filters.price50Plus` |
| `options available` | `customTrip.category.optionsAvailable` |
| `MUST DO` | `customTrip.badges.mustDo` |
| `Free` | `customTrip.badges.free` |
| `Buy from official site:` | `customTrip.officialSite` |
| `My Basket` | `customTrip.basket.myBasket` |
| `My Trip Basket` | `customTrip.basket.title` |
| `item(s) selected` | `customTrip.basket.itemsSelected` |
| `Your basket is empty` | `customTrip.basket.empty` |
| `Add activities to start building your trip` | `customTrip.basket.emptyMessage` |
| `Estimated Total` | `customTrip.basket.estimatedTotal` |
| `* Prices are estimates. Tickets should be purchased from official sites.` | `customTrip.basket.priceDisclaimer` |
| `Review & Generate Itinerary` | `customTrip.basket.generateItinerary` |
| `Clear Basket` | `customTrip.basket.clearBasket` |
| `Accommodation TBD` | `customTrip.settings.accommodationTBD` |
| `Planning stay` | `customTrip.settings.planningStay` |
| `stays booked` | `customTrip.settings.staysBooked` |

### Data Arrays — Activities

| Text | Suggested Key Pattern |
|------|----------------------|
| `Activities & Sightseeing` | `customTrip.categories.activities.title` |
| `27 experiences available` | `customTrip.categories.activities.description` |
| `Live Events & Shows` | `customTrip.categories.liveEvents.title` |
| `12 events during your stay` | `customTrip.categories.liveEvents.description` |
| `Restaurants & Dining` | `customTrip.categories.restaurants.title` |
| `40 dining experiences` | `customTrip.categories.restaurants.description` |
| `Cafes & Coffee` | `customTrip.categories.cafes.title` |
| `15 coffee spots` | `customTrip.categories.cafes.description` |
| `Getting Around` | `customTrip.categories.transport.title` |
| `6 transport options` | `customTrip.categories.transport.description` |
| `Local Experiences` | `customTrip.categories.experiences.title` |
| `8 unique experiences` | `customTrip.categories.experiences.description` |

All items inside each category (titles, descriptions) should be keyed as:
`customTrip.data.{categoryKey}.{itemId}.title` / `.description`

Example items (Activities):
- `Eiffel Tower Summit` → `customTrip.data.activities.a1.title`
- `Skip-the-line access to the top with panoramic views` → `customTrip.data.activities.a1.description`
- `Louvre Museum` → `customTrip.data.activities.a2.title`
- etc. (20 activities, 8 events, 12 restaurants, 7 cafes, 6 transport, 8 experiences)

### Filter Labels

| Text | Key |
|------|-----|
| `Activity Type` | `customTrip.filters.activityType.label` |
| `All Activities` | `customTrip.filters.activityType.all` |
| `Landmarks` | `customTrip.filters.activityType.landmark` |
| `Museums` | `customTrip.filters.activityType.museum` |
| `Views & Panoramic` | `customTrip.filters.activityType.views` |
| `History` | `customTrip.filters.activityType.history` |
| `Walking Tours` | `customTrip.filters.activityType.walking` |
| `Shopping` | `customTrip.filters.activityType.shopping` |
| `Food & Drink` | `customTrip.filters.activityType.food` |
| `Shows & Entertainment` | `customTrip.filters.activityType.show` |
| `Cuisine Type` | `customTrip.filters.cuisineType.label` |
| `All Cuisines` | `customTrip.filters.cuisineType.all` |
| `French` | `customTrip.filters.cuisineType.french` |
| `Italian` | `customTrip.filters.cuisineType.italian` |
| `Crepes` | `customTrip.filters.cuisineType.crepes` |
| `Fine Dining` | `customTrip.filters.cuisineType.fineDining` |
| `Brunch` | `customTrip.filters.cuisineType.brunch` |
| `Pastry & Bakery` | `customTrip.filters.cuisineType.pastry` |
| `Quick Bites` | `customTrip.filters.cuisineType.quick` |
| `Trendy Spots` | `customTrip.filters.cuisineType.trendy` |
| `Event Type` | `customTrip.filters.eventType.label` |
| `All Events` | `customTrip.filters.eventType.all` |
| `Music & Concerts` | `customTrip.filters.eventType.music` |
| `Shows & Theater` | `customTrip.filters.eventType.show` |
| `Art & Exhibitions` | `customTrip.filters.eventType.art` |
| `Nightlife & Parties` | `customTrip.filters.eventType.party` |
| `Food & Wine Events` | `customTrip.filters.eventType.food` |
| `Wellness` | `customTrip.filters.eventType.wellness` |
| `Cafe Type` | `customTrip.filters.cafeType.label` |
| `All Cafes` | `customTrip.filters.cafeType.all` |
| `Iconic & Historic` | `customTrip.filters.cafeType.iconic` |
| `Specialty Coffee` | `customTrip.filters.cafeType.specialty` |
| `Unique & Hidden` | `customTrip.filters.cafeType.unique` |
| `Transport Type` | `customTrip.filters.transportType.label` |
| `All Options` | `customTrip.filters.transportType.all` |
| `Metro & Public` | `customTrip.filters.transportType.metro` |
| `Bike & Scooter` | `customTrip.filters.transportType.bike` |
| `Walking Tours` | `customTrip.filters.transportType.walking` |
| `Boat & River` | `customTrip.filters.transportType.boat` |
| `Experience Type` | `customTrip.filters.experienceType.label` |
| `All Experiences` | `customTrip.filters.experienceType.all` |
| `Romantic` | `customTrip.filters.experienceType.romantic` |
| `Food & Cooking` | `customTrip.filters.experienceType.food` |
| `Photography` | `customTrip.filters.experienceType.photo` |
| `Unique & Creative` | `customTrip.filters.experienceType.unique` |

### Paris Accommodation Areas

| Text | Key |
|------|-----|
| `Decide later` | `customTrip.areas.undecided.label` |
| `We'll suggest the best area based on your activities` | `customTrip.areas.undecided.description` |
| `Le Marais` | `customTrip.areas.leMarais.label` |
| `Historic, trendy, central location` | `customTrip.areas.leMarais.description` |
| `Montmartre` | `customTrip.areas.montmartre.label` |
| `Artistic, charming, hilltop views` | `customTrip.areas.montmartre.description` |
| `Latin Quarter` | `customTrip.areas.latinQuarter.label` |
| `Student area, affordable, near Notre-Dame` | `customTrip.areas.latinQuarter.description` |
| `Champs-Elysees` | `customTrip.areas.champsElysees.label` |
| `Upscale, shopping, near Arc de Triomphe` | `customTrip.areas.champsElysees.description` |
| `Saint-Germain` | `customTrip.areas.saintGermain.label` |
| `Elegant, cafes, Left Bank culture` | `customTrip.areas.saintGermain.description` |
| `Bastille` | `customTrip.areas.bastille.label` |
| `Nightlife, local vibe, affordable` | `customTrip.areas.bastille.description` |
| `Near Eiffel Tower` | `customTrip.areas.eiffelTower.label` |
| `Iconic views, quieter residential` | `customTrip.areas.eiffelTower.description` |

---

<a id="appcustomtriploading"></a>
## 6. app/custom-trip/loading.tsx

| Text | Suggested Key |
|------|--------------|
| `Loading your trip planner...` | `customTrip.loading` |

---

<a id="appmyitinerary"></a>
## 7. app/my-itinerary/page.tsx

### Loading & Error States

| Text | Suggested Key |
|------|--------------|
| `Creating Your Perfect Itinerary` | `myItinerary.loading.title` |
| `AI is optimizing your trip schedule...` | `myItinerary.loading.subtitle` |
| `Something went wrong` | `myItinerary.error.title` |
| `Go Back to Basket` | `myItinerary.error.goBack` |

### Header & Tabs

| Text | Suggested Key |
|------|--------------|
| `Paris, France` | `myItinerary.header.destination` |
| `days` | `myItinerary.header.days` |
| `AI Generated` | `myItinerary.header.aiGenerated` |
| `Built from 1,000+ real travel plans shared by travelers like you` | `myItinerary.realDataBadge` |
| `Checklist` | `myItinerary.tabs.checklist` |
| `Itinerary` | `myItinerary.tabs.itinerary` |
| `Stay` | `myItinerary.tabs.stay` |
| `Tips` | `myItinerary.tabs.tips` |

### Checklist Tab

| Text | Suggested Key |
|------|--------------|
| `Pre-Trip Checklist` | `myItinerary.checklist.title` |
| `completed` | `myItinerary.checklist.completed` |
| `Book & Reserve` | `myItinerary.checklist.categories.book` |
| `Register & Notify` | `myItinerary.checklist.categories.register` |
| `Buy & Purchase` | `myItinerary.checklist.categories.buy` |
| `Prepare & Download` | `myItinerary.checklist.categories.prepare` |
| `Pack & Bring` | `myItinerary.checklist.categories.pack` |

### Checklist Items (Data)

| Text | Key Pattern |
|------|------------|
| `Book Eiffel Tower Tickets` | `myItinerary.checklist.items.c1.title` |
| `Skip-the-line summit access - sells out weeks in advance` | `myItinerary.checklist.items.c1.description` |
| `Reserve Louvre Entry` → `myItinerary.checklist.items.c2.title` |
| `Timed entry ticket required` → `myItinerary.checklist.items.c2.description` |
| `Jazz Night Tickets` → `myItinerary.checklist.items.c3.title` |
| `Book Accommodation` → `myItinerary.checklist.items.c4.title` |
| `Register Travel with Embassy` → `myItinerary.checklist.items.c5.title` |
| `Notify Bank of Travel` → `myItinerary.checklist.items.c6.title` |
| `Paris Metro Pass` → `myItinerary.checklist.items.c7.title` |
| `Travel Insurance` → `myItinerary.checklist.items.c8.title` |
| `EU Power Adapter` → `myItinerary.checklist.items.c9.title` |
| `Download Offline Maps` → `myItinerary.checklist.items.c10.title` |
| `Learn Basic French Phrases` → `myItinerary.checklist.items.c11.title` |
| `Check Passport Validity` → `myItinerary.checklist.items.c12.title` |
| `Comfortable Walking Shoes` → `myItinerary.checklist.items.c13.title` |
| `Layers for Weather` → `myItinerary.checklist.items.c14.title` |
| `Small Daypack` → `myItinerary.checklist.items.c15.title` |
(Each has matching `.description`)

### Packing & Local Tips (Data)

| Text | Key Pattern |
|------|------------|
| `Comfortable walking shoes - you'll walk 10+ km daily` | `myItinerary.packingTips.0` |
| `Layers for unpredictable March weather` | `myItinerary.packingTips.1` |
| `Small daypack for museum visits` | `myItinerary.packingTips.2` |
| `Universal power adapter` | `myItinerary.packingTips.3` |
| `Reusable water bottle` | `myItinerary.packingTips.4` |
| `Learn basic French phrases - locals appreciate the effort` | `myItinerary.localTips.0` |
| `Metro is the fastest way to get around` | `myItinerary.localTips.1` |
| `Most museums are free on first Sunday of month` | `myItinerary.localTips.2` |
| `Tipping is not expected but 5-10% is appreciated` | `myItinerary.localTips.3` |
| `Many shops close on Sundays` | `myItinerary.localTips.4` |

### Tips Tab Labels

| Text | Suggested Key |
|------|--------------|
| `Packing Tips` | `myItinerary.tips.packing` |
| `Local Tips for Paris` | `myItinerary.tips.local` |

### Support Card

| Text | Suggested Key |
|------|--------------|
| `We're With You During Your Trip` | `myItinerary.support.title` |
| `If any planned activity doesn't work out — whether it's closed, weather issues, or you simply change your mind — we'll instantly suggest alternatives. You're never alone on your journey! Just reach out through our app anytime.` | `myItinerary.support.description` |
| `Download Trip to App` | `myItinerary.support.downloadApp` |

### Itinerary Tab Labels

| Text | Suggested Key |
|------|--------------|
| `SELECT DAY` | `myItinerary.itinerary.selectDay` |
| `Day` | `myItinerary.itinerary.day` |
| `Swap with AI alternative` | `myItinerary.itinerary.swapAlternative` |
| `Cancel` | `myItinerary.itinerary.cancel` |
| `Choose an alternative:` | `myItinerary.itinerary.chooseAlternative` |

### Time Period Labels

| Text | Key |
|------|-----|
| `Early Morning` | `myItinerary.timePeriod.earlyMorning` |
| `Morning` | `myItinerary.timePeriod.morning` |
| `Midday` | `myItinerary.timePeriod.midday` |
| `Afternoon` | `myItinerary.timePeriod.afternoon` |
| `Evening` | `myItinerary.timePeriod.evening` |

### Accommodation Tab

| Text | Suggested Key |
|------|--------------|
| `Search by name or location...` | `myItinerary.accommodation.searchPlaceholder` |
| `AI Recommendation` | `myItinerary.accommodation.aiRecommendation` |
| `Based on your itinerary, we recommend staying in Le Marais or Montmartre areas...` | `myItinerary.accommodation.aiRecommendationText` |
| `See Photos` | `myItinerary.accommodation.seePhotos` |
| `Other Areas` | `myItinerary.accommodation.otherAreas` |
| `Tip: When you confirm a booking, we'll automatically optimize your daily itinerary based on your accommodation location to minimize travel time.` | `myItinerary.accommodation.optimizeTip` |
| `Optimizing your itinerary based on new accommodation...` | `myItinerary.accommodation.optimizing` |
| `Booked` | `myItinerary.accommodation.booked` |
| `/night` | `myItinerary.accommodation.perNight` |
| `nights total` | `myItinerary.accommodation.nightsTotal` |
| `View` | `myItinerary.accommodation.view` |
| `Confirmed` | `myItinerary.accommodation.confirmed` |
| `I Booked This` | `myItinerary.accommodation.iBookedThis` |

### Day Activity Data

All 11 days of demo itinerary data with themes, activity titles/descriptions/tips should use pattern:
`myItinerary.days.{dayNumber}.theme` / `.activities.{index}.title` / `.description` / `.tips`

---

<a id="appsubmittrip"></a>
## 8. app/submit-trip/page.tsx

### Success Screen

| Text | Suggested Key |
|------|--------------|
| `Trip Submitted Successfully!` | `submitTrip.success.title` |
| `Your trip data has been received...` | `submitTrip.success.message` |
| `Submit Another Trip` | `submitTrip.success.submitAnother` |
| `View My Profile` | `submitTrip.success.viewProfile` |

### Header & Earning Info

| Text | Suggested Key |
|------|--------------|
| `Share Your Trip` | `submitTrip.header.title` |
| `Tell us about your real travel experience` | `submitTrip.header.subtitle` |
| `Earn $10-$50 for your data` | `submitTrip.earning.upfront` |
| `Revenue share up to $200` | `submitTrip.earning.revenueShare` |
| `Helps train AI` | `submitTrip.earning.helpsAI` |

### Step 1 — Trip Setup

| Text | Suggested Key |
|------|--------------|
| `Tell us about your trip` | `submitTrip.step1.title` |
| `Basic info about your travel experience. Keep it simple.` | `submitTrip.step1.subtitle` |
| `City / Destination` | `submitTrip.step1.destination` |
| `e.g., Paris` | `submitTrip.step1.destinationPlaceholder` |
| `Country` | `submitTrip.step1.country` |
| `e.g., France` | `submitTrip.step1.countryPlaceholder` |
| `Trip Length (days)` | `submitTrip.step1.tripLength` |
| `Travel Style` | `submitTrip.step1.travelStyle` |
| `Budget` / `Midrange` / `Luxury` / `Backpacker` | `submitTrip.step1.style.{value}` |
| `Who was this trip for?` | `submitTrip.step1.travelerType` |
| `Solo` / `Couple` / `Friends` / `Family` | `submitTrip.step1.type.{value}` |
| `Approximate Total Budget (Optional)` | `submitTrip.step1.totalBudget` |
| `e.g., 2500` | `submitTrip.step1.budgetPlaceholder` |
| `In CAD - excluding flights` | `submitTrip.step1.budgetNote` |
| `Real Experiences Only` | `submitTrip.step1.realExperiences.title` |
| `We only accept genuine travel experiences you've personally had. AI-generated or fictional content will be rejected.` | `submitTrip.step1.realExperiences.desc` |
| `Continue to Day 1` | `submitTrip.step1.continue` |

### Step 2 — Day Builder

| Text | Suggested Key |
|------|--------------|
| `Day {n}` | `submitTrip.step2.dayNumber` |
| `Date (optional)` | `submitTrip.step2.date` |
| `Time Blocks` | `submitTrip.step2.timeBlocks` |
| `Add Time Block` | `submitTrip.step2.addTimeBlock` |
| `No time blocks yet` | `submitTrip.step2.noBlocks` |
| `Break your day into time blocks to record what you did` | `submitTrip.step2.noBlocksDesc` |
| `Add First Time Block` | `submitTrip.step2.addFirstBlock` |
| `Block {n}` | `submitTrip.step2.blockNumber` |
| `Start Time` | `submitTrip.step2.startTime` |
| `End Time` | `submitTrip.step2.endTime` |
| `Location / Area` | `submitTrip.step2.location` |
| `e.g., Montmartre, Louvre area` | `submitTrip.step2.locationPlaceholder` |
| `What did you do?` | `submitTrip.step2.whatDidYouDo` |
| `Describe what you did during this time. Be honest and specific...` | `submitTrip.step2.descriptionPlaceholder` |
| `Activity Type (optional)` | `submitTrip.step2.activityType` |
| `Select type` | `submitTrip.step2.selectType` |
| `Transportation (optional)` | `submitTrip.step2.transportation` |
| `How did you get there?` | `submitTrip.step2.transportPlaceholder` |
| `Cost (optional)` | `submitTrip.step2.cost` |
| `What was it for?` | `submitTrip.step2.costDescription` |
| `Cheap Win` | `submitTrip.step2.cheapWin` |
| `Expensive Mistake` | `submitTrip.step2.expensiveMistake` |
| `Photos` | `submitTrip.step2.photos` |
| `Add` | `submitTrip.step2.addPhoto` |
| `Daily Insights` | `submitTrip.step2.dailyInsights` |
| `Short, honest, unpolished answers. Help future travelers.` | `submitTrip.step2.insightsDesc` |
| `One mistake you made today` | `submitTrip.step2.mistake` |
| `e.g., Didn't book museum tickets in advance` | `submitTrip.step2.mistakePlaceholder` |
| `One useful tip you learned` | `submitTrip.step2.tip` |
| `e.g., Metro line 1 is super crowded at 6pm` | `submitTrip.step2.tipPlaceholder` |
| `One unexpected thing` | `submitTrip.step2.unexpected` |
| `e.g., Found an amazing bakery with no tourists` | `submitTrip.step2.unexpectedPlaceholder` |
| `How did you feel today?` | `submitTrip.step2.mood` |
| `Energy level` | `submitTrip.step2.energy` |
| `Back to Setup` | `submitTrip.step2.backToSetup` |
| `Review Trip` | `submitTrip.step2.reviewTrip` |

### Activity Types (Data)

Pattern: `submitTrip.activityTypes.{index}` — includes: Sightseeing, Museum, Restaurant, Cafe, Shopping, Walking/Exploring, Transport, Entertainment, Nature/Park, Nightlife, Beach, Market, Cooking Class, Other

### Transport Options (Data)

Pattern: `submitTrip.transportOptions.{index}` — includes: Walking, Metro/Subway, Bus, Taxi/Uber, Bicycle, Tram, Train, Car, Ferry/Boat, Scooter, Other

### Step 3 — Review

| Text | Suggested Key |
|------|--------------|
| `Review Your Trip` | `submitTrip.step3.title` |
| `Make sure everything looks good before submitting` | `submitTrip.step3.subtitle` |
| `Trip Overview` | `submitTrip.step3.overview` |
| `Destination` | `submitTrip.step3.destination` |
| `Duration` | `submitTrip.step3.duration` |
| `Travel Style` | `submitTrip.step3.travelStyle` |
| `Travelers` | `submitTrip.step3.travelers` |
| `Budget` | `submitTrip.step3.budget` |
| `Days Breakdown` | `submitTrip.step3.daysBreakdown` |
| `time blocks` | `submitTrip.step3.timeBlocks` |
| `photos` | `submitTrip.step3.photos` |
| `Time Blocks` | `submitTrip.step3.timeBlocksLabel` |
| `Photos` | `submitTrip.step3.photosLabel` |
| `Tracked` | `submitTrip.step3.tracked` |
| `What happens next?` | `submitTrip.step3.whatHappensNext` |
| `Your trip will be reviewed for quality and uniqueness. If approved, it will be available in our marketplace and you'll earn money when travelers purchase it. We'll notify you of the decision within 48 hours.` | `submitTrip.step3.reviewNotice` |
| `Submit Trip` | `submitTrip.step3.submitTrip` |
| `Submitting...` | `submitTrip.step3.submitting` |

### AI Chat

| Text | Suggested Key |
|------|--------------|
| `Trip AI Assistant` | `submitTrip.aiChat.title` |
| `Describe your experience...` | `submitTrip.aiChat.inputPlaceholder` |
| `Typing...` | `submitTrip.aiChat.typing` |

---

<a id="appsubmittriploading"></a>
## 9. app/submit-trip/loading.tsx

| Text | Suggested Key |
|------|--------------|
| `Loading trip submission...` | `submitTrip.loading` |

---

<a id="apptripbasket"></a>
## 10. app/trip-basket/page.tsx

| Text | Suggested Key |
|------|--------------|
| `Your Trip Basket` | `tripBasket.title` |
| `Paris, France` | `tripBasket.destination` |
| `Clear All` | `tripBasket.clearAll` |
| `Your basket is empty` | `tripBasket.empty.title` |
| `Start adding activities to build your perfect trip` | `tripBasket.empty.subtitle` |
| `Browse Activities` | `tripBasket.empty.browse` |
| `Time Analysis` | `tripBasket.timeAnalysis.title` |
| `You have plenty of free time. Consider adding more activities or enjoying a relaxed pace.` | `tripBasket.timeAnalysis.low` |
| `Perfect balance! You have a good mix of activities with time to explore spontaneously.` | `tripBasket.timeAnalysis.good` |
| `Your schedule is quite full. Make sure to leave buffer time for travel and rest.` | `tripBasket.timeAnalysis.busy` |
| `Warning: Your itinerary is very packed. Consider removing some activities to avoid exhaustion.` | `tripBasket.timeAnalysis.packed` |
| `available` | `tripBasket.timeAnalysis.available` |
| `AI Will Optimize Your Trip` | `tripBasket.aiOptimize.title` |
| `Based on your selections, our AI will find the best accommodation near your activities and arrange everything in an optimal daily schedule. We'll also be with you during your trip to help with any changes needed!` | `tripBasket.aiOptimize.description` |
| `Activities & Sightseeing` | `tripBasket.categories.activities` |
| `Live Events & Shows` | `tripBasket.categories.liveEvents` |
| `Restaurants & Dining` | `tripBasket.categories.restaurants` |
| `Cafes & Coffee` | `tripBasket.categories.cafes` |
| `Getting Around` | `tripBasket.categories.transport` |
| `Local Experiences` | `tripBasket.categories.experiences` |
| `items selected` | `tripBasket.itemsSelected` |
| `Free` | `tripBasket.free` |
| `Trip Summary` | `tripBasket.summary.title` |
| `Destination` | `tripBasket.summary.destination` |
| `Duration` | `tripBasket.summary.duration` |
| `Travelers` | `tripBasket.summary.travelers` |
| `people` | `tripBasket.summary.people` |
| `Total Activities` | `tripBasket.summary.totalActivities` |
| `items` | `tripBasket.summary.items` |
| `Estimated Total` | `tripBasket.summary.estimatedTotal` |
| `for {n} travelers` | `tripBasket.summary.forTravelers` |
| `Generate My Itinerary` | `tripBasket.summary.generateItinerary` |
| `AI will arrange your activities and find perfect accommodation` | `tripBasket.summary.aiNote` |
| `We're With You` | `tripBasket.support.title` |
| `During your trip, if any activity doesn't work out, we'll instantly find alternatives. You're never alone on your journey!` | `tripBasket.support.description` |

---

<a id="apptripcompanion"></a>
## 11. app/trip-companion/page.tsx

| Text | Suggested Key |
|------|--------------|
| `Trip Companion` | `tripCompanion.title` |
| `Day {n} of {total} in {destination}` | `tripCompanion.dayProgress` |
| `Today's Schedule` | `tripCompanion.todaySchedule` |
| `Next:` | `tripCompanion.next` |
| `Based on 12,847 traveler experiences in Paris.` | `tripCompanion.dataSourceNotice` |
| `Find nearby cafe` | `tripCompanion.quickActions.cafe` |
| `Lunch spots` | `tripCompanion.quickActions.lunch` |
| `What's nearby` | `tripCompanion.quickActions.nearby` |
| `Navigate next` | `tripCompanion.quickActions.navigate` |
| `Find me a good cafe nearby` | `tripCompanion.actionMessages.cafe` |
| `Where should I have lunch?` | `tripCompanion.actionMessages.lunch` |
| `What's interesting nearby?` | `tripCompanion.actionMessages.nearby` |
| `How do I get to my next activity?` | `tripCompanion.actionMessages.navigate` |
| `Help me explore` | `tripCompanion.actionMessages.default` |
| `Image attached` | `tripCompanion.imageAttached` |
| `Ask anything about your trip...` | `tripCompanion.inputPlaceholder` |
| `Powered by real traveler data` | `tripCompanion.poweredBy` |
| `Sorry, I'm having trouble connecting. Please check that the backend is running and try again.` | `tripCompanion.error.connectionFailed` |
| `I'm here to help with your trip!` | `tripCompanion.fallback` |

### Mock Schedule Data

| Text | Key Pattern |
|------|------------|
| `Breakfast at hotel` | `tripCompanion.schedule.{index}.activity` |
| `Visit Musée d'Orsay` | etc. |
| `Explore Saint-Germain-des-Prés` | |
| `Seine River Sunset Walk` | |
| `Dinner at Le Comptoir` | |
| `Head to Pont des Arts for sunset` | `tripCompanion.reminder.activity` |
| `Best photos from 17:45-18:15` | `tripCompanion.reminder.tip` |

### Initial Message (Data)

| Text | Key |
|------|-----|
| `Day 3 in Paris! You're near Saint-Germain-des-Pres. Try Cafe de Flore, 200m away - a Hemingway favorite. Want directions or tips?` | `tripCompanion.initialMessage` |

---

<a id="appprofile"></a>
## 12. app/profile/page.tsx

| Text | Suggested Key |
|------|--------------|
| `Back to Explore` | `profile.backToExplore` |
| `Member since` | `profile.memberSince` |
| `Premium` | `profile.premium` |
| `Upgrade to Premium` | `profile.upgradePremium` |
| `Cultural Explorer` | `profile.personality.type` |
| `You love immersing yourself in local culture, history, and authentic experiences.` | `profile.personality.description` |
| `Saved` | `profile.stats.saved` |
| `Purchased` | `profile.stats.purchased` |
| `Countries` | `profile.stats.countries` |
| `Reviews` | `profile.stats.reviews` |
| `Quizzes` | `profile.stats.quizzes` |
| `Upcoming Trip` | `profile.activeTrip.label` |
| `days to go` | `profile.activeTrip.daysToGo` |
| `Trip Companion` | `profile.activeTrip.companionButton` |
| `Overview` | `profile.tabs.overview` |
| `Saved` | `profile.tabs.saved` |
| `Purchases` | `profile.tabs.purchases` |
| `Preferences` | `profile.tabs.preferences` |
| `Your Travel Personality` | `profile.overview.personalityTitle` |
| `Recommended for You` | `profile.overview.recommended` |
| `match` | `profile.overview.match` |
| `View Plan` | `profile.purchases.viewPlan` |
| `Travel Preferences` | `profile.preferences.title` |
| `Budget Range` | `profile.preferences.budgetRange` |
| `Preferred Trip Length` | `profile.preferences.tripLength` |
| `Travel Style` | `profile.preferences.travelStyle` |
| `Interests` | `profile.preferences.interests` |
| `Things to Avoid` | `profile.preferences.avoidances` |
| `Edit Preferences` | `profile.preferences.editPreferences` |

### Traits & Interests (Data)

Pattern: `profile.traits.{index}` — `History Lover`, `Foodie`, `Art Enthusiast`, `Budget-Savvy`

Pattern: `profile.interests.{index}` — `Museums`, `Local Food`, `Walking Tours`, `Photography`, `Cafes`

Pattern: `profile.avoidances.{index}` — `Crowded Tourist Spots`, `Long Bus Tours`

### Personality Scores

| Text | Key |
|------|-----|
| `adventure` | `profile.personality.scores.adventure` |
| `cultural` | `profile.personality.scores.cultural` |
| `relaxation` | `profile.personality.scores.relaxation` |
| `culinary` | `profile.personality.scores.culinary` |
| `budget` | `profile.personality.scores.budget` |
| `nature` | `profile.personality.scores.nature` |

### Recommendations (Data)

| Text | Key |
|------|-----|
| `Rome` | `profile.recommendations.0.destination` |
| `Based on your love for history & culture` | `profile.recommendations.0.reason` |
| `Lisbon` | `profile.recommendations.1.destination` |
| `Great for budget-conscious foodies` | `profile.recommendations.1.reason` |
| `Kyoto` | `profile.recommendations.2.destination` |
| `Perfect blend of culture & nature` | `profile.recommendations.2.reason` |

---

<a id="appdestinationsiran"></a>
## 13. app/destinations/iran/page.tsx

### Page Header

| Text | Suggested Key |
|------|--------------|
| `Discover` | `iran.hero.discover` |
| `Iran` | `iran.hero.iran` |
| `ایران` | `iran.hero.iranLocal` |
| `Ancient Persia, Modern Wonders` | `iran.hero.tagline` |
| `A 5,000-year-old civilization with jaw-dropping architecture, warm hospitality, and landscapes from desert to mountain. One of the world's most underrated destinations.` | `iran.hero.description` |
| `View Tour Packages` | `iran.hero.viewPackages` |
| `Contact Us` | `iran.hero.contactUs` |
| `UNESCO Sites` | `iran.hero.unescoSites` |
| `Average Daily Cost` | `iran.hero.dailyCost` |
| `Safety Rating` | `iran.hero.safetyRating` |
| `Very Safe` | `iran.hero.verySafe` |

### Cities (Data)

| Data | Key Pattern |
|------|------------|
| `Isfahan` | `iran.cities.isfahan.name` |
| `Half of the World` | `iran.cities.isfahan.tagline` |
| `Known for its stunning Islamic architecture...` | `iran.cities.isfahan.description` |
| `Naqsh-e Jahan Square`, `Si-o-se-pol Bridge`, `Sheikh Lotfollah Mosque` | `iran.cities.isfahan.highlights.{index}` |
| `Shiraz` | `iran.cities.shiraz.name` |
| `City of Poetry & Gardens` | `iran.cities.shiraz.tagline` |
| `Yazd` | `iran.cities.yazd.name` |
| `Heart of the Desert` | `iran.cities.yazd.tagline` |
| `Tehran` | `iran.cities.tehran.name` |
| `The Modern Capital` | `iran.cities.tehran.tagline` |

### Tour Packages (Data)

| Text | Key Pattern |
|------|------------|
| `Essential Iran` | `iran.packages.essential.name` |
| `7 Days` | `iran.packages.essential.duration` |
| `Isfahan, Shiraz, Yazd` | Route text |
| `Classic Iran` | `iran.packages.classic.name` |
| `10 Days` | `iran.packages.classic.duration` |
| `Grand Iran` | `iran.packages.grand.name` |
| `14 Days` | `iran.packages.grand.duration` |
| `Adventure Iran` | `iran.packages.adventure.name` |
| `12 Days` | `iran.packages.adventure.duration` |
| `Most Popular` | `iran.packages.mostPopular` |
| `Best Value` | `iran.packages.bestValue` |
| `From` | `iran.packages.from` |
| `/person` | `iran.packages.perPerson` |
| `Select Package` | `iran.packages.selectPackage` |
| `Selected` | `iran.packages.selected` |
| `Request This Tour` | `iran.packages.requestTour` |

### Inclusions

| Text | Key |
|------|-----|
| `Expert Local Guides` | `iran.inclusions.guides.title` |
| `English-speaking certified guides throughout` | `iran.inclusions.guides.desc` |
| `Premium Hotels` | `iran.inclusions.hotels.title` |
| `4-5 star boutique and heritage stays` | `iran.inclusions.hotels.desc` |
| `All Transportation` | `iran.inclusions.transport.title` |
| `Comfortable private vehicles between cities` | `iran.inclusions.transport.desc` |
| `Visa Assistance` | `iran.inclusions.visa.title` |
| `Complete visa application support` | `iran.inclusions.visa.desc` |
| `Daily Meals` | `iran.inclusions.meals.title` |
| `Breakfast + select lunches/dinners` | `iran.inclusions.meals.desc` |
| `Travel Insurance` | `iran.inclusions.insurance.title` |
| `Comprehensive coverage included` | `iran.inclusions.insurance.desc` |

### Section Headers

| Text | Suggested Key |
|------|--------------|
| `What's Included` | `iran.sections.whatsIncluded` |
| `Every tour includes comprehensive services for a worry-free journey through Iran.` | `iran.sections.whatsIncludedDesc` |
| `Practical Information` | `iran.sections.practicalInfo` |
| `Best Time to Visit` | `iran.practicalInfo.bestTime.title` |
| `Spring (Mar-May) and Autumn (Sep-Nov) offer ideal weather across most regions.` | `iran.practicalInfo.bestTime.desc` |
| `Climate` | `iran.practicalInfo.climate.title` |
| `Varied climate from hot deserts to cool mountains. Pack layers!` | `iran.practicalInfo.climate.desc` |
| `Safety` | `iran.practicalInfo.safety.title` |
| `Iran is very safe for tourists with low crime rates and welcoming locals.` | `iran.practicalInfo.safety.desc` |
| `Frequently Asked Questions` | `iran.sections.faq` |

### Iran FAQs (Data)

| Question | Key |
|----------|-----|
| `Do I need a visa for Iran?` | `iran.faq.0.q` |
| `Is Iran safe for tourists?` | `iran.faq.1.q` |
| `What should women wear?` | `iran.faq.2.q` |
| `Can I use credit cards?` | `iran.faq.3.q` |
| `What's the internet like?` | `iran.faq.4.q` |
| `What about alcohol?` | `iran.faq.5.q` |
(Each has corresponding `.a` answer key)

### CTA & Contact Form

| Text | Suggested Key |
|------|--------------|
| `Ready to Explore Iran?` | `iran.cta.title` |
| `Let our team craft your perfect Iranian adventure. Tell us your interests, budget, and travel dates, and we'll handle everything else.` | `iran.cta.description` |
| `Start Planning` | `iran.cta.startPlanning` |
| `Plan Your Iran Trip` | `iran.contactForm.title` |
| `Tell us about your dream Iran adventure. Our team will create a personalized itinerary within 24 hours.` | `iran.contactForm.description` |
| `Your Name` | `iran.contactForm.name` |
| `Email` | `iran.contactForm.email` |
| `Travelers` | `iran.contactForm.travelers` |
| `1 person` / `2 people` / `3-4 people` / `5+ people` | `iran.contactForm.travelerOptions.{n}` |
| `Budget Level` | `iran.contactForm.budget` |
| `Mid-Range` | `iran.contactForm.budgetMidRange` |
| `Trip Duration` | `iran.contactForm.duration` |
| `7-10 days` / `10-14 days` / `14+ days` | `iran.contactForm.durationOptions.{n}` |
| `When?` | `iran.contactForm.when` |
| `Select month` | `iran.contactForm.selectMonth` |
| `March` / `April` / `May` / `September` / `October` / `November` / `Flexible` | `iran.contactForm.months.{name}` |
| `Selected package:` | `iran.contactForm.selectedPackage` |
| `Your Interests & Questions` | `iran.contactForm.interests` |
| `Tell us what you'd like to see, any special interests (architecture, food, adventure), or questions...` | `iran.contactForm.interestsPlaceholder` |
| `Send Request` | `iran.contactForm.sendRequest` |
| `We typically respond within 24 hours with a custom itinerary proposal.` | `iran.contactForm.responseTime` |
| `Request Received!` | `iran.contactForm.success.title` |
| `Our Iran specialist will contact you within 24 hours with a personalized itinerary proposal.` | `iran.contactForm.success.message` |
| `Close` | `iran.contactForm.success.close` |

---

<a id="appitinerarypage"></a>
## 14. app/itinerary/[id]/page.tsx

No translatable UI strings (server page with routing logic only).

---

<a id="appitineraryclient"></a>
## 15. app/itinerary/[id]/client.tsx

### Null/Error State

| Text | Suggested Key |
|------|--------------|
| `Itinerary not found` | `itinerary.notFound` |
| `Back to Home` | `itinerary.backToHome` |

### Hero & Source Card

| Text | Suggested Key |
|------|--------------|
| `Back` | `itinerary.back` |
| `AI-Optimized Plan` | `itinerary.aiOptimizedPlan` |
| `AI-Generated Itinerary` | `itinerary.aiGenerated.title` |
| `Optimized from {n} real traveler experiences. Last updated {date}.` | `itinerary.aiGenerated.description` |
| `data points` | `itinerary.aiGenerated.dataPoints` |
| `reviews` | `itinerary.reviews` |

### Quick Stats

| Text | Suggested Key |
|------|--------------|
| `Est. Budget Range` | `itinerary.stats.budgetRange` |
| `Days Planned` | `itinerary.stats.daysPlanned` |
| `Activities` | `itinerary.stats.activities` |
| `Pro Tips` | `itinerary.stats.proTips` |

### Tab Labels

| Text | Suggested Key |
|------|--------------|
| `Itinerary` | `itinerary.tabs.itinerary` |
| `Accommodation` | `itinerary.tabs.accommodation` |
| `Pre-Trip Checklist` | `itinerary.tabs.checklist` |

### Itinerary Tab

| Text | Suggested Key |
|------|--------------|
| `Day-by-Day Itinerary` | `itinerary.dayByDay.title` |
| `Times are approximate and flexible. Adjust based on your pace and preferences.` | `itinerary.dayByDay.subtitle` |
| `activities` | `itinerary.dayByDay.activities` |
| `Options:` | `itinerary.dayByDay.options` |
| `To next:` | `itinerary.dayByDay.toNext` |
| `Walk` / `Metro` / `Bus` / `Taxi/Uber` / `Train` / `Bike` | `itinerary.transport.{method}` |

### Time Periods

| Text | Key |
|------|-----|
| `Early Morning` | `itinerary.timePeriod.earlyMorning.label` |
| `6:00 - 9:00` | `itinerary.timePeriod.earlyMorning.time` |
| `Late Morning` | `itinerary.timePeriod.lateMorning.label` |
| `9:00 - 12:00` | `itinerary.timePeriod.lateMorning.time` |
| `Afternoon` | `itinerary.timePeriod.afternoon.label` |
| `12:00 - 17:00` | `itinerary.timePeriod.afternoon.time` |
| `Evening` | `itinerary.timePeriod.evening.label` |
| `17:00 - 21:00` | `itinerary.timePeriod.evening.time` |
| `Night` | `itinerary.timePeriod.night.label` |
| `21:00+` | `itinerary.timePeriod.night.time` |

### Accommodation Tab

| Text | Suggested Key |
|------|--------------|
| `Recommended Accommodations` | `itinerary.accommodation.recommended` |
| `Curated options based on location, value, and traveler reviews.` | `itinerary.accommodation.subtitle` |
| `/night` | `itinerary.accommodation.perNight` |
| `View Options` | `itinerary.accommodation.viewOptions` |

### Checklist Tab

| Text | Suggested Key |
|------|--------------|
| `Pre-Trip Checklist` | `itinerary.checklist.title` |
| `Essential tasks to complete before your trip.` | `itinerary.checklist.subtitle` |
| `Important` | `itinerary.checklist.important` |
| `Documents` / `Bookings` / `Packing` / `Apps & Cards` | `itinerary.checklist.category.{name}` |

### Checklist Items (Data) — use pattern `itinerary.checklist.items.{category}.{index}.title` / `.note`

### CTA

| Text | Suggested Key |
|------|--------------|
| `Want a Personalized Version?` | `itinerary.cta.title` |
| `Customize this itinerary for your dates, budget, and interests with our AI trip builder.` | `itinerary.cta.description` |
| `Build My Trip` | `itinerary.cta.buildMyTrip` |

### Floating Button

| Text | Suggested Key |
|------|--------------|
| `During Trip` | `itinerary.floatingButton.duringTrip` |
| `AI is with you` | `itinerary.floatingButton.aiWithYou` |

### Demo AI Trip Days (Data)

All activity titles, descriptions, tips, options in `aiTripDays` array — use:
`itinerary.aiDays.{dayNumber}.title` / `.theme` / `.activities.{index}.title` / `.description` / `.tip` / `.options.{index}`

### Demo Accommodations (Data)

`Hotel Le Marais`, `Montmartre Artist Loft`, `Generator Paris` — each with name/area/highlight:
`itinerary.accommodations.{id}.name` / `.area` / `.highlight`

---

<a id="appitineraryrawtripclient"></a>
## 16. app/itinerary/[id]/raw-trip-client.tsx

### Hero Badges

| Text | Suggested Key |
|------|--------------|
| `Real Traveler Experience` | `rawTrip.badge` |
| `total spent` | `rawTrip.totalSpent` |

### Quick Stats

| Text | Suggested Key |
|------|--------------|
| `Total Spent` | `rawTrip.stats.totalSpent` |
| `Days Documented` | `rawTrip.stats.daysDocumented` |
| `Real Photos` | `rawTrip.stats.realPhotos` |
| `Insider Tips` | `rawTrip.stats.insiderTips` |

### Tab Labels

| Text | Suggested Key |
|------|--------------|
| `Day-by-Day` | `rawTrip.tabs.dayByDay` |
| `Where I Stayed` | `rawTrip.tabs.whereIStayed` |
| `My Checklist` | `rawTrip.tabs.myChecklist` |

### Itinerary Tab

| Text | Suggested Key |
|------|--------------|
| `Day-by-Day Journey` | `rawTrip.dayByDay.title` |
| `HIGHLIGHT` | `rawTrip.dayByDay.highlight` |
| `WHAT I'D DO DIFFERENTLY` | `rawTrip.dayByDay.whatIdDoDifferently` |

### Accommodation Tab

| Text | Suggested Key |
|------|--------------|
| `Where I Stayed` | `rawTrip.accommodation.title` |
| `My honest reviews of each place I stayed.` | `rawTrip.accommodation.subtitle` |
| `Pros` | `rawTrip.accommodation.pros` |
| `Cons` | `rawTrip.accommodation.cons` |
| `nights` | `rawTrip.accommodation.nights` |

### Checklist Tab

| Text | Suggested Key |
|------|--------------|
| `My Pre-Trip Checklist` | `rawTrip.checklist.title` |
| `What worked, what I wish I'd done, and my packing wins.` | `rawTrip.checklist.subtitle` |
| `What I'm Glad I Did` | `rawTrip.checklist.categories.gladIDid` |
| `What I Wish I'd Done` | `rawTrip.checklist.categories.wishIdDone` |
| `Packing Wins` | `rawTrip.checklist.categories.packingWins` |

### Purchase CTA

| Text | Suggested Key |
|------|--------------|
| `Get the Full Trip Details` | `rawTrip.cta.title` |
| `Includes all {n} days, {m}+ activities, real receipts, Google Maps links, and direct contact with {name}.` | `rawTrip.cta.description` |
| `All Photos Included` | `rawTrip.cta.photos` |
| `Exact Costs & Receipts` | `rawTrip.cta.receipts` |
| `Chat with Traveler` | `rawTrip.cta.chat` |
| `Buy This Trip` | `rawTrip.cta.buyTrip` |
| `One-time purchase, yours forever` | `rawTrip.cta.oneTimePurchase` |

### Reviews

| Text | Suggested Key |
|------|--------------|
| `What Buyers Say` | `rawTrip.reviews.title` |

### Review Data

Pattern: `rawTrip.reviews.{index}.name` / `.text` / `.date`

### All Demo Day/Activity/Accommodation/Checklist Data

Use patterns like:
- `rawTrip.days.{dayNumber}.title` / `.date` / `.mistake` / `.highlight`
- `rawTrip.days.{dayNumber}.activities.{index}.title` / `.note` / `.tip`
- `rawTrip.accommodations.{id}.name` / `.review` / `.pros.{index}` / `.cons.{index}`
- `rawTrip.checklist.{category}.items.{index}.title` / `.note`

---

<a id="navbar"></a>
## 17. components/navbar.tsx

| Text | Suggested Key |
|------|--------------|
| `Tripology` | `nav.brand` |
| `Explore` | `nav.explore` |
| `Travel Quiz` | `nav.travelQuiz` |
| `Build My Trip` | `nav.buildMyTrip` |
| `Share Your Trip` | `nav.shareYourTrip` |
| `During Trip` | `nav.duringTrip` |
| `Sign In` | `nav.signIn` |
| `Sign Out` | `nav.signOut` |
| `How it Works` | `nav.howItWorks` |
| `My Profile` | `nav.myProfile` |

---

<a id="bottomnav"></a>
## 18. components/bottom-nav.tsx

| Text | Suggested Key |
|------|--------------|
| `Home` | `bottomNav.home` |
| `Build Trip` | `bottomNav.buildTrip` |
| `Travel AI` | `bottomNav.travelAI` |
| `Share Trip` | `bottomNav.shareTrip` |
| `Profile` | `bottomNav.profile` |

---

<a id="footer"></a>
## 19. components/footer.tsx

| Text | Suggested Key |
|------|--------------|
| `Tripology` | `footer.brand` |
| `Real itineraries from real travelers.` | `footer.tagline` |
| `Explore` | `footer.sections.explore` |
| `Itineraries` | `footer.links.itineraries` |
| `Destinations` | `footer.links.destinations` |
| `Budget Travel` | `footer.links.budgetTravel` |
| `Creators` | `footer.sections.creators` |
| `Sell Itinerary` | `footer.links.sellItinerary` |
| `Guidelines` | `footer.links.guidelines` |
| `Success Stories` | `footer.links.successStories` |
| `Support` | `footer.sections.support` |
| `Help Center` | `footer.links.helpCenter` |
| `Privacy` | `footer.links.privacy` |
| `Terms` | `footer.links.terms` |
| `© {year} Tripology. All rights reserved.` | `footer.copyright` |

---

<a id="aichat"></a>
## 20. components/ai-assistant-chat.tsx

| Text | Suggested Key |
|------|--------------|
| `Tripology AI` | `aiChat.title` |
| `Find your perfect trip` | `aiChat.subtitle` |
| `Hi! I'm your Tripology assistant` | `aiChat.welcomeTitle` |
| `Tell me about your travel preferences, and I'll help you find the perfect itinerary` | `aiChat.welcomeMessage` |
| `I want a budget-friendly beach vacation` | `aiChat.suggestions.beach` |
| `Looking for an adventurous hiking trip` | `aiChat.suggestions.hiking` |
| `I want to experience local culture` | `aiChat.suggestions.culture` |
| `I'm here to help! Ask me about travel destinations, itineraries, or your trip preferences.` | `aiChat.fallback1` |
| `I'm here to help with your travel plans!` | `aiChat.fallback2` |
| `Sorry, I'm having trouble connecting. Please make sure the backend server is running.` | `aiChat.error` |
| `Ask me anything about travel...` | `aiChat.inputPlaceholder` |

---

<a id="categories"></a>
## 21. components/categories.tsx

| Text | Suggested Key |
|------|--------------|
| `Browse by Category` | `categories.title` |
| `Beach` | `categories.beach.name` |
| `Adventure` | `categories.adventure.name` |
| `City` | `categories.city.name` |
| `Cultural` | `categories.cultural.name` |
| `Road Trip` | `categories.roadTrip.name` |
| `Budget` | `categories.budget.name` |
| `trips` | `categories.trips` |

---

<a id="datamonetization"></a>
## 22. components/data-monetization-cta.tsx

| Text | Suggested Key |
|------|--------------|
| `Earn Money` | `dataCta.badge` |
| `Share Your Travel Data, Get Paid` | `dataCta.title` |
| `Upload your travel data with photos and videos. We analyze and pay you for it, then list your itinerary on our marketplace.` | `dataCta.description` |
| `Record trip` | `dataCta.step1` |
| `We analyze` | `dataCta.step2` |
| `$10-$50 upfront` | `dataCta.step3` |
| `Up to $200 total` | `dataCta.step4` |
| `Share Trip & Get Paid` | `dataCta.button` |

---

<a id="exclusivetrips"></a>
## 23. components/exclusive-trips.tsx

### Section Header

| Text | Suggested Key |
|------|--------------|
| `Exclusive Destinations` | `exclusive.badge` |
| `Curated Exclusive Journeys` | `exclusive.title` |
| `Custom tours with expert local guides, premium stays, and insider access.` | `exclusive.subtitle` |

### What's Included

| Text | Key |
|------|-----|
| `Expert Local Guides` | `exclusive.included.guides.label` |
| `Handpicked professionals` | `exclusive.included.guides.desc` |
| `Premium Hotels` | `exclusive.included.hotels.label` |
| `Best in each city` | `exclusive.included.hotels.desc` |
| `Full Support` | `exclusive.included.support.label` |
| `24/7 assistance` | `exclusive.included.support.desc` |
| `Custom Budgets` | `exclusive.included.budgets.label` |
| `Flexible pricing` | `exclusive.included.budgets.desc` |

### Destinations (Data)

| Text | Key Pattern |
|------|------------|
| `Iran` / `ایران` | `exclusive.destinations.iran.name` / `.nameLocal` |
| `Ancient Persia Awaits` | `exclusive.destinations.iran.tagline` |
| `5,000 years of history, stunning architecture, and warm hospitality.` | `exclusive.destinations.iran.description` |
| `Morocco` / `المغرب` | `exclusive.destinations.morocco.name` / `.nameLocal` |
| `Colors of the Maghreb` | `exclusive.destinations.morocco.tagline` |
| `Uzbekistan` / `O'zbekiston` | `exclusive.destinations.uzbekistan.name` / `.nameLocal` |
| `Silk Road Treasures` | `exclusive.destinations.uzbekistan.tagline` |
| `Jordan` / `الأردن` | `exclusive.destinations.jordan.name` / `.nameLocal` |
| `Kingdom of Wonders` | `exclusive.destinations.jordan.tagline` |

Highlights for each destination: `exclusive.destinations.{id}.highlights.{index}`

### Buttons & Labels

| Text | Key |
|------|-----|
| `Featured` | `exclusive.featured` |
| `From` | `exclusive.from` |
| `Explore Iran Trips` | `exclusive.exploreIranTrips` |
| `Request Custom Tour` | `exclusive.requestCustomTour` |
| `Looking for a different destination?` | `exclusive.differentDestination` |
| `Contact us` | `exclusive.contactUs` |
| `and we'll make it happen.` | `exclusive.makeItHappen` |

### Trip Request Dialog

| Text | Key |
|------|-----|
| `Plan Your {destination} Trip` | `exclusive.dialog.title` |
| `Our experts will create a personalized itinerary for you.` | `exclusive.dialog.subtitle` |
| `Your Name` | `exclusive.dialog.name` |
| `Email` | `exclusive.dialog.email` |
| `Number of Travelers` | `exclusive.dialog.travelers` |
| `1 person` / `2 people` / `3-4 people` / `5+ people` | `exclusive.dialog.travelerOptions.{n}` |
| `Budget Range (per person)` | `exclusive.dialog.budget` |
| `Budget ($800-1500)` / `Mid-range ($1500-3000)` / `Luxury ($3000+)` / `Flexible` | `exclusive.dialog.budgetOptions.{n}` |
| `Trip Duration` | `exclusive.dialog.duration` |
| `5-7 days` / `7-10 days` / `10-14 days` / `14+ days` | `exclusive.dialog.durationOptions.{n}` |
| `When do you want to travel?` | `exclusive.dialog.when` |
| `What interests you most?` | `exclusive.dialog.interests` |
| `Travel style, must-see places, special requests...` | `exclusive.dialog.interestsPlaceholder` |
| `Send Request` | `exclusive.dialog.sendRequest` |
| `Response within 24h. No payment required.` | `exclusive.dialog.responseNote` |
| `Request Received!` | `exclusive.dialog.success.title` |
| `Thank you for your interest in {destination}. Our travel experts will contact you within 24 hours to start planning your custom journey.` | `exclusive.dialog.success.message` |
| `Close` | `exclusive.dialog.success.close` |

---

<a id="faq"></a>
## 24. components/faq.tsx

| Text | Suggested Key |
|------|--------------|
| `Frequently Asked Questions` | `faq.title` |
| `Everything you need to know about Tripology` | `faq.subtitle` |

### FAQ Items (Data)

| Question | Key |
|----------|-----|
| `What do I get when I purchase an itinerary?` | `faq.items.0.question` |
| `You receive a complete day-by-day travel plan including accommodations, activities, transportation, cost breakdowns, booking links, local tips, hidden gems, and safety information - all based on real travel experience.` | `faq.items.0.answer` |
| `How does the AI Travel Assistant work?` | `faq.items.1.question` |
| `Our AI analyzes your travel preferences, budget, and style to match you with the most suitable itineraries...` | `faq.items.1.answer` |
| `Are the prices in CAD?` | `faq.items.2.question` |
| `Yes! All itinerary prices and trip budget estimates on Tripology are displayed in Canadian Dollars (CAD)...` | `faq.items.2.answer` |
| `Can I get a refund if I'm not satisfied?` | `faq.items.3.question` |
| `Absolutely. We offer a 7-day money-back guarantee...` | `faq.items.3.answer` |
| `How do I become a creator and sell my itineraries?` | `faq.items.4.question` |
| `Click on 'Become a Creator' in the navigation...` | `faq.items.4.answer` |
| `What does the AI Fit percentage mean?` | `faq.items.5.question` |
| `The AI Fit percentage shows how well an itinerary matches your travel personality...` | `faq.items.5.answer` |

---

<a id="howitworks"></a>
## 25. components/how-it-works.tsx

_(Needs reading — let me include from conversation summary)_

| Text | Suggested Key |
|------|--------------|
| `How It Works` | `howItWorks.title` |
| `Discover` | `howItWorks.step1.title` |
| `Browse real travel itineraries` | `howItWorks.step1.desc` |
| `AI Match` | `howItWorks.step2.title` |
| `Get personalized recommendations` | `howItWorks.step2.desc` |
| `Purchase` | `howItWorks.step3.title` |
| `Buy tested itineraries from $5` | `howItWorks.step3.desc` |
| `Travel` | `howItWorks.step4.title` |
| `Follow your plan with confidence` | `howItWorks.step4.desc` |

---

<a id="itinerarycard"></a>
## 26. components/itinerary-card.tsx

| Text | Suggested Key |
|------|--------------|
| `Real Traveler` | `itineraryCard.badge.realTraveler` |
| `Premium` | `itineraryCard.badge.premium` |
| `AI Optimized` | `itineraryCard.badge.aiOptimized` |
| `Verified` | `itineraryCard.badge.verified` |
| `View Details` | `itineraryCard.viewDetails` |
| `Buy Trip` | `itineraryCard.buyTrip` |
| `Get Free Plan` | `itineraryCard.getFreePlan` |
| `Estimated Travel Budget` | `itineraryCard.estimatedBudget` |
| `day` / `days` | `itineraryCard.days` |
| `reviews` | `itineraryCard.reviews` |
| `AI Fit` | `itineraryCard.aiFit` |
| `Overall Score` | `itineraryCard.overallScore` |
| `Plan Score` | `itineraryCard.planScore` |
| `Value Score` | `itineraryCard.valueScore` |
| `Hotel` / `Airbnb` / `Hostel` / `Mixed` | `itineraryCard.accommodation.{type}` |
| `Solo` / `Couple` / `Family` / `Friends` / `Group` | `itineraryCard.travelerProfile.{type}` |
| `trips shared` | `itineraryCard.tripsShared` |

---

<a id="filtersidebar"></a>
## 27. components/filter-sidebar.tsx

| Text | Suggested Key |
|------|--------------|
| `Filters` | `filters.title` |
| `Destination` | `filters.destination` |
| `Search destinations...` | `filters.destinationPlaceholder` |
| `Travel Dates` | `filters.travelDates` |
| `Total Budget (CAD)` | `filters.totalBudget` |
| `Budget Only` | `filters.budgetOnly` |
| `Advanced` | `filters.advanced` |
| `Nightly Budget` | `filters.nightlyBudget` |
| `Accommodation Type` | `filters.accommodationType` |
| `Minimum Rating` | `filters.minimumRating` |
| `Instant Book` | `filters.instantBook` |
| `Superhost Only` | `filters.superhostOnly` |
| `Amenities` | `filters.amenities` |
| `Travel Style` | `filters.travelStyle` |
| `Trip Level` | `filters.tripLevel` |
| `Suitable For` | `filters.suitableFor` |
| `Minimum Plan Rating` | `filters.minimumPlanRating` |
| `Clear All` | `filters.clearAll` |
| `Apply Filters` | `filters.applyFilters` |

### Filter Option Arrays

Travel Styles: `Adventure`, `Cultural`, `Relaxation`, `Budget`, `Luxury`, `Foodie`, `Photography`, `Eco-Friendly`

Trip Levels: `Easy`, `Moderate`, `Challenging`, `Extreme`

Suitable For: `Solo`, `Couples`, `Families`, `Groups`, `Seniors`, `Disabled`

Accommodation Types: `Hotel`, `Airbnb`, `Hostel`, `Resort`, `Villa`, `Boutique`

Amenities: `WiFi`, `Kitchen`, `Pool`, `Parking`, `AC`, `Washer`

Pattern: `filters.travelStyles.{index}`, `filters.tripLevels.{index}`, `filters.suitableFor.{index}`, `filters.accommodationTypes.{index}`, `filters.amenities.{index}`

---

<a id="personalitycta"></a>
## 28. components/personality-cta.tsx

| Text | Suggested Key |
|------|--------------|
| `60-Second Quiz` | `personalityCta.badge` |
| `Discover Your Travel Personality` | `personalityCta.title` |
| `Take our quick quiz and get AI-matched trips based on your travel style, energy level, and interests` | `personalityCta.description` |
| `Take the Quiz` | `personalityCta.button` |
| `quiz completions` | `personalityCta.stat.completions` |
| `personality types` | `personalityCta.stat.types` |
| `avg completion` | `personalityCta.stat.avgCompletion` |

---

<a id="testimonials"></a>
## 29. components/testimonials.tsx

| Text | Suggested Key |
|------|--------------|
| `Loved by Travelers` | `testimonials.title` |
| `See what our community is saying` | `testimonials.subtitle` |

### Testimonial Data

| Text | Key Pattern |
|------|------------|
| `The Paris itinerary saved us so much time and money. Every restaurant recommendation was spot on!` | `testimonials.items.0.quote` |
| `Sarah M.` | `testimonials.items.0.name` |
| `Toronto, Canada` | `testimonials.items.0.location` |
| `Paris Explorer` | `testimonials.items.0.trip` |
| `As a solo traveler, having a tested budget itinerary gave me confidence to explore Tokyo without breaking the bank.` | `testimonials.items.1.quote` |
| `Mike R.` | `testimonials.items.1.name` |
| `Vancouver, Canada` | `testimonials.items.1.location` |
| `Tokyo Budget Trip` | `testimonials.items.1.trip` |
| `The hidden gems in the Barcelona guide made our honeymoon truly special. Worth every penny!` | `testimonials.items.2.quote` |
| `Emma & James` | `testimonials.items.2.name` |
| `Montreal, Canada` | `testimonials.items.2.location` |
| `Barcelona Romance` | `testimonials.items.2.trip` |

---

<a id="tripmap"></a>
## 30. components/trip-map.tsx

| Text | Suggested Key |
|------|--------------|
| `Trip Route Map` | `tripMap.title` |
| `Pause` | `tripMap.pause` |
| `Play` | `tripMap.play` |
| `Reset` | `tripMap.reset` |
| `days` | `tripMap.days` |
| `CAD` | `tripMap.cad` |

---

<a id="trustbadges"></a>
## 31. components/trust-badges.tsx

| Text | Suggested Key |
|------|--------------|
| `Verified Creators` | `trustBadges.verifiedCreators.title` |
| `Every itinerary is from a verified traveler` | `trustBadges.verifiedCreators.desc` |
| `Secure Payments` | `trustBadges.securePayments.title` |
| `Protected by Stripe encryption` | `trustBadges.securePayments.desc` |
| `Money Back Guarantee` | `trustBadges.moneyBack.title` |
| `7-day refund if not satisfied` | `trustBadges.moneyBack.desc` |
| `24/7 Support` | `trustBadges.support.title` |
| `AI + human help anytime` | `trustBadges.support.desc` |

---

---

<a id="personalityquiz"></a>
## 32. lib/personality-quiz.ts

### Personality Archetype Names & Descriptions (Data)

| Text | Suggested Key |
|------|--------------|
| `BookTripy` | `quiz.archetypes.bookTripy.name` |
| `Quiet moments, deep conversations, and meaningful connections` | `quiz.archetypes.bookTripy.description` |
| `CultureTripy` | `quiz.archetypes.cultureTripy.name` |
| `Museums, history, and the soul of old towns` | `quiz.archetypes.cultureTripy.description` |
| `SocialTripy` | `quiz.archetypes.socialTripy.name` |
| `Bars, meetups, and making friends everywhere` | `quiz.archetypes.socialTripy.description` |
| `ViewTripy` | `quiz.archetypes.viewTripy.name` |
| `Epic views, heights, and capturing the moment` | `quiz.archetypes.viewTripy.description` |
| `FoodTripy` | `quiz.archetypes.foodTripy.name` |
| `Local food, street eats, and market wandering` | `quiz.archetypes.foodTripy.description` |
| `FlowTripy` | `quiz.archetypes.flowTripy.name` |
| `No plans, mood-based, going with the flow` | `quiz.archetypes.flowTripy.description` |
| `ActionTripy` | `quiz.archetypes.actionTripy.name` |
| `Activities, hiking, and pushing boundaries` | `quiz.archetypes.actionTripy.description` |

### Personality Traits (Data)

| Text | Key Pattern |
|------|------------|
| `Reflective` / `Curious` / `Deep thinker` / `Quality over quantity` | `quiz.archetypes.bookTripy.traits.{index}` |
| `Knowledgeable` / `Appreciative` / `Patient` / `Detail-oriented` | `quiz.archetypes.cultureTripy.traits.{index}` |
| `Outgoing` / `Adventurous` / `Spontaneous` / `People-person` | `quiz.archetypes.socialTripy.traits.{index}` |
| `Aesthetic` / `Patient` / `Early riser` / `Photography lover` | `quiz.archetypes.viewTripy.traits.{index}` |
| `Adventurous eater` / `Cultural explorer` / `Sensory-driven` / `Local-focused` | `quiz.archetypes.foodTripy.traits.{index}` |
| `Flexible` / `Present` / `Intuitive` / `Low-stress` | `quiz.archetypes.flowTripy.traits.{index}` |
| `Energetic` / `Thrill-seeker` / `Physically active` / `Goal-oriented` | `quiz.archetypes.actionTripy.traits.{index}` |

### Quiz Questions (Data — 12 questions)

Pattern: `quiz.questions.{id}.title` / `.scenario` / `.options.{index}.text`

| Question Title | Scenario | Options |
|---------------|----------|---------|
| `Eiffel Tower Moment` | `You're under the Eiffel Tower. What feels right?` | `Go all the way up, I want the full moment` / `Sit under it, read / chill / people-watch` / `Talk to someone nearby, share the moment` / `Walk away, the city is calling me` |
| `Arrival Moment` | `You just arrived in a new city. First real move?` | `Drop bags & disappear into streets` / `Sit somewhere quiet and observe` / `Open maps & plan` / `Find food immediately` |
| `Iconic Place` | `You're at a world-famous spot (Colosseum / Times Square / Sagrada Família):` | `Get the classic photo` / `Step aside and feel the place` / `Watch people instead of the landmark` / `Leave fast, too crowded` |
| `First Evening` | `It's your first night in a new city. You:` | `Go out even if tired` / `Short walk then early sleep` / `Sit somewhere cozy` / `Scroll to see what's happening tonight` |
| `Famous Spot Pressure` | `Everyone says 'you MUST see this'. You:` | `Go, no question` / `Go early/late to avoid crowds` / `Skip it completely` / `Only go if it fits your mood` |
| `Lost Scenario` | `You're lost... but not in danger.` | `Love it` / `Mild stress but ok` / `Annoyed, open GPS` / `Ask someone immediately` |
| `Weather Chaos` | `Your plan is ruined by weather.` | `Adapt, new plan` / `Stay in & slow down` / `Find indoor culture` / `Bad mood all day` |
| `Energy Dip` | `Midday, low energy. You:` | `Coffee and push` / `Long break` / `Change activity type` / `Call it a day` |
| `Social Spark` | `A stranger talks to you in a cool place. You feel:` | `Energized` / `Curious but cautious` / `Polite but distant` / `Please no` |
| `Spending Moment` | `You find a unique experience, pricey.` | `Easy yes` / `Think hard, maybe` / `Nope` / `Depends who I'm with` |
| `Memory Style` | `Best travel memories are:` | `Conversations` / `Feelings & atmosphere` / `Photos` / `Stories I tell later` |
| `Silence vs Buzz` | `In iconic places you prefer:` | `Quiet corners` / `Lively energy` / `Balanced vibe` / `Depends on time` |

---

<a id="mockdata"></a>
## 33. lib/mock-data.ts

### Itinerary Card Data (10 itineraries)

Each itinerary has translatable fields: `title`, `destination`, `highlight`, `bestSeason`, `difficulty`, `level`, `travelStyles[]`, `suitableFor[]`

Pattern: `mockData.itineraries.{id}.title` / `.highlight` / etc.

| ID | Title | Highlight |
|----|-------|-----------|
| `1` | `Paris Romantic Getaway` | `Iconic landmarks, charming cafes, art museums, Seine river walks` |
| `2` | `Paris Art & Culture Deep Dive` | `World-class museums, hidden galleries, art workshops, local artists` |
| `3` | `Paris Food & Wine Experience` | `Michelin restaurants, wine tastings, cooking classes, local markets` |
| `4` | `Paris on a Budget - Backpacker` | `Free attractions, street food, local neighborhoods, hostel scene` |
| `5` | `Paris & Versailles Royal Experience` | `Palace tours, royal gardens, historic chateaux, private guides` |
| `6` | `Paris Hidden Gems Explorer` | `Secret spots, local neighborhoods, authentic experiences, street art` |
| `raw-1` | `My 10-Day Paris Solo Adventure` | `Honest budget breakdown, real photos, hidden cafes I discovered, mistakes I made` |
| `raw-2` | `Paris with Kids: Our Family Trip` | `Best playgrounds, kid-approved restaurants, stroller-friendly routes, nap time tips` |
| `raw-3` | `Honeymoon in Paris: Our Love Story` | `Most romantic spots, proposal locations, couple photoshoot tips, intimate restaurants` |
| `raw-4` | `Budget Backpacker: 2 Weeks in Paris` | `How I spent only $40/day, free museums, cheap eats, hostel reviews, money-saving hacks` |

### Travel Style Labels (Data)

`Romantic`, `Cultural`, `Budget`, `Art`, `Mid-range`, `Culinary`, `Luxury`, `Backpacking`, `Adventure`, `Off-beat`, `Local`, `Solo`, `Budget-Conscious`, `Art Lover`, `Family`, `Kid-Friendly`, `Comfortable`, `Honeymoon`, `History`

Pattern: `mockData.travelStyles.{styleName}`

### Suitable For Labels

`Couple`, `Solo`, `Friends`, `Family`
Pattern: `mockData.suitableFor.{label}`

### Trip Day Data (5 days for Itinerary #1)

All activity titles, descriptions, locations, tips, alternative names — use:
`mockData.itinerary1.days.{dayNumber}.title` / `.description` / `.periods.{period}.{index}.title` / `.description` / `.tips`

Example activity strings from Day 1-5:
- `Arrival & Montmartre` / `Explore the artistic heart of Paris`
- `Lunch at Cafe des Deux Moulins` / `Famous Amelie filming location with authentic French cuisine`
- `Sacre-Coeur Basilica` / `Stunning white church with panoramic Paris views from the dome`
- `Artists at Place du Tertre` / `Watch street artists paint and get your portrait done`
- `Dinner at Pink Mamma` / `Trendy Italian restaurant with amazing pasta and rooftop terrace`
- `Eiffel Tower Sunrise` / `Beat the crowds with early access`
- `Trocadero Photo Spot` / `Best Eiffel Tower photo spot`
- `Seine River Cruise` / `See Paris from the water, pass under historic bridges`
- `Louvre Museum` / `See Mona Lisa and ancient treasures`
- `Musee d'Orsay` / `Impressionist masterpieces in a former train station`
- `Marche d'Aligre Market` / `Authentic local market with fresh produce`
- `Canal Saint-Martin` / `Trendy neighborhood with cool boutiques`
- `Belleville Street Art` / `Discover the urban art scene`
- `Breakfast at Cafe de Flore` / `Iconic literary cafe`
- `Luxembourg Gardens` / `Peaceful morning stroll among locals`
- `Check-out & Departure` / `Head to airport`
(+ all alternatives, transport descriptions, tip strings)

### Live Event Titles (Data — 8 events)

`Jazz Night at New Morning`, `Montmartre Art Walk`, `Seine River Night Cruise Party`, `Parisian Food Market`, `Belleville Street Art Festival`, `Sunset Yoga at Buttes-Chaumont`, `Impressionist Exhibition Opening`, `Opera at Palais Garnier`

Pattern: `mockData.events.{eventId}.title` / `.description`

### Accommodation Listing Data (4 listings)

`Hotel Le Marais Charm`, `Montmartre Artist Loft`, `Generator Paris Hostel`, `Maison Souquet`
Each with: name, neighborhood, amenities[], traveler reviews (userName, comment, tripType), popularWith[]

Pattern: `mockData.accommodations.{id}.name` / `.neighborhood` / `.amenities.{index}` / `.reviews.{index}.comment` / `.popularWith.{index}`

### Amenity Labels

`WiFi`, `Breakfast`, `AC`, `24h Reception`, `Kitchen`, `Washer`, `Balcony`, `Bar`, `Lockers`, `Tours`, `Spa`, `Pool`, `Restaurant`, `Concierge`

### Traveler Profile Data (4 travelers)

| Name | Style |
|------|-------|
| `Sarah Chen` | `Solo Explorer` |
| `The Martinez Family` | `Family Travelers` |
| `Emma & James` | `Romantic Getaways` |
| `Alex Nomad` | `Budget Backpacker` |

Pattern: `mockData.travelers.{id}.name` / `.travelStyle` / `.country`

### Checklist Items (12 items)

`Valid passport`, `Travel insurance`, `Book Eiffel Tower tickets`, `Reserve Louvre time slot`, `Seine River Cruise`, `Download offline Paris map`, `Get Navigo transit pass`, `Comfortable walking shoes`, `Power adapter (EU type)`, `Light jacket`, `Reusable water bottle`, `Learn basic French phrases`

Each with description — Pattern: `mockData.checklist.{id}.title` / `.description`

---

## Summary Statistics

| Metric | Count |
|--------|-------|
| **Files analyzed** | 33 |
| **Unique translatable strings** | ~1,000+ |
| **Data-array items** (activities, FAQs, testimonials, quiz questions, mock itineraries, etc.) | ~500+ |
| **Total i18n keys needed** | ~1,500+ |

---

## Notes

1. **Dynamic content** (activity titles/descriptions from the database) will eventually come from the backend and should be translated server-side or fetched per-locale.
2. **Pluralization** is needed for keys like `traveler/travelers`, `item/items`, `night/nights`, `day/days`, `stay/stays`.
3. **Interpolation** is needed for keys containing `{n}`, `{destination}`, `{name}`, `{date}`, `{total}` etc.
4. **Number/currency formatting** should use `Intl.NumberFormat`.
5. Strings marked as "Data" are hardcoded demo/mock data — in production these would come from API, but placeholder translations are still needed.
6. The `lib/personality-quiz.ts` file (not listed but referenced) contains personality archetype names, descriptions, and traits that also need translation.
7. The `lib/mock-data.ts` file contains itinerary mock data with titles, descriptions, destinations that also need translation.
