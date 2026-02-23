/**
 * Paris destination data — extracted from custom-trip page for better code splitting.
 * This data is only loaded when the custom-trip page is opened,
 * not bundled with the homepage or other pages.
 */

export interface ParisItem {
  id: string
  title: string
  description: string
  image: string
  duration: string
  cost: number
  rating: number
  reviews: number
  popular?: boolean
  cuisine?: string
  date?: string
  dayNum?: number
  tags?: string[]
  officialSite?: string
  category?: string
}

export interface ParisCategory {
  title: string
  icon: string // Icon name instead of component reference — resolved in page
  color: string
  description: string
  items: ParisItem[]
}

export const parisData = {
  destination: "Paris",
  country: "France",
  
  categories: {
    activities: {
      title: "Activities & Sightseeing",
      icon: "Camera",
      color: "bg-blue-500",
      description: "27 experiences available",
      items: [
        { id: "a1", title: "Eiffel Tower Summit", description: "Skip-the-line access to the top with panoramic views", image: "/paris-eiffel-tower-sunset.jpg", duration: "2-3 hours", cost: 35, rating: 4.9, reviews: 12453, popular: true, tags: ["landmark", "views"], officialSite: "toureiffel.paris" },
        { id: "a2", title: "Louvre Museum", description: "See Mona Lisa and 35,000 artworks", image: "/paris-louvre-museum.jpg", duration: "3-4 hours", cost: 17, rating: 4.8, reviews: 28934, popular: true, tags: ["museum", "art"], officialSite: "louvre.fr" },
        { id: "a3", title: "Sacre-Coeur & Montmartre", description: "Explore the artistic hilltop neighborhood", image: "/paris-montmartre-streets.jpg", duration: "2-3 hours", cost: 0, rating: 4.7, reviews: 8234, tags: ["landmark", "free"] },
        { id: "a4", title: "Palace of Versailles", description: "Day trip to the Sun King's palace", image: "/paris-versailles-palace.jpg", duration: "Full day", cost: 20, rating: 4.8, reviews: 15678, popular: true, tags: ["landmark", "history"], officialSite: "chateauversailles.fr" },
        { id: "a5", title: "Seine River Cruise", description: "1-hour boat tour past major landmarks", image: "/paris-seine-river.jpg", duration: "1 hour", cost: 18, rating: 4.6, reviews: 9823, tags: ["cruise", "views"], officialSite: "bateaux-mouches.fr" },
        { id: "a6", title: "Musee d'Orsay", description: "Impressionist masterpieces in a former train station", image: "/paris-louvre-museum.jpg", duration: "2-3 hours", cost: 16, rating: 4.8, reviews: 11234, tags: ["museum", "art"], officialSite: "musee-orsay.fr" },
        { id: "a7", title: "Notre-Dame & Ile de la Cite", description: "Gothic cathedral and historic island", image: "/paris-seine-river.jpg", duration: "1-2 hours", cost: 0, rating: 4.5, reviews: 6789, tags: ["landmark", "free"] },
        { id: "a8", title: "Arc de Triomphe Rooftop", description: "Climb for Champs-Elysees views", image: "/paris-eiffel-tower-sunset.jpg", duration: "1 hour", cost: 13, rating: 4.6, reviews: 5432, tags: ["landmark", "views"], officialSite: "paris-arc-de-triomphe.fr" },
        { id: "a9", title: "Catacombs of Paris", description: "Underground tunnels with 6 million bones", image: "/paris-montmartre-streets.jpg", duration: "1.5 hours", cost: 15, rating: 4.4, reviews: 7654, tags: ["history", "unique"], officialSite: "catacombes.paris.fr" },
        { id: "a10", title: "Luxembourg Gardens", description: "Beautiful royal gardens with boat pond", image: "/paris-versailles-palace.jpg", duration: "1-2 hours", cost: 0, rating: 4.7, reviews: 4321, tags: ["nature", "free"] },
        { id: "a11", title: "Centre Pompidou", description: "Modern art in an inside-out building", image: "/paris-louvre-museum.jpg", duration: "2-3 hours", cost: 15, rating: 4.5, reviews: 6543, tags: ["museum", "art"], officialSite: "centrepompidou.fr" },
        { id: "a12", title: "Sainte-Chapelle", description: "Stunning 13th-century stained glass", image: "/paris-versailles-palace.jpg", duration: "45 min", cost: 11, rating: 4.9, reviews: 8765, tags: ["landmark", "history"], officialSite: "sainte-chapelle.fr" },
        { id: "a13", title: "Le Marais Walking Tour", description: "Historic Jewish quarter and trendy boutiques", image: "/paris-montmartre-streets.jpg", duration: "2-3 hours", cost: 0, rating: 4.6, reviews: 3456, tags: ["walking", "free"] },
        { id: "a14", title: "Moulin Rouge Show", description: "Iconic cabaret experience", image: "/paris-montmartre-streets.jpg", duration: "2 hours", cost: 95, rating: 4.7, reviews: 4567, tags: ["show", "nightlife"], officialSite: "moulinrouge.fr" },
        { id: "a15", title: "Cooking Class", description: "Learn to make croissants and macarons", image: "/paris-cafe-terrace.jpg", duration: "3 hours", cost: 85, rating: 4.9, reviews: 2345, tags: ["food", "experience"] },
        { id: "a16", title: "Wine Tasting Experience", description: "French wine regions in one cellar", image: "/paris-cafe-terrace.jpg", duration: "2 hours", cost: 65, rating: 4.8, reviews: 1876, tags: ["food", "experience"] },
        { id: "a17", title: "Rodin Museum & Gardens", description: "The Thinker and beautiful sculpture garden", image: "/paris-versailles-palace.jpg", duration: "1.5 hours", cost: 14, rating: 4.7, reviews: 3456, tags: ["museum", "art"], officialSite: "musee-rodin.fr" },
        { id: "a18", title: "Pere Lachaise Cemetery", description: "Visit Jim Morrison and Oscar Wilde", image: "/paris-montmartre-streets.jpg", duration: "2 hours", cost: 0, rating: 4.5, reviews: 4321, tags: ["history", "free"] },
        { id: "a19", title: "Canal Saint-Martin", description: "Trendy canal-side neighborhood", image: "/paris-seine-river.jpg", duration: "2 hours", cost: 0, rating: 4.4, reviews: 2345, tags: ["walking", "free"] },
        { id: "a20", title: "Champs-Elysees Shopping", description: "World's most famous avenue", image: "/paris-louvre-museum.jpg", duration: "2-3 hours", cost: 0, rating: 4.3, reviews: 5678, tags: ["shopping", "free"] },
      ]
    },
    
    liveEvents: {
      title: "Live Events & Shows",
      icon: "Music",
      color: "bg-purple-500",
      description: "12 events during your stay",
      items: [
        { id: "e1", title: "Jazz at New Morning", description: "Live jazz club experience", image: "/paris-montmartre-streets.jpg", duration: "3 hours", cost: 25, rating: 4.8, reviews: 1234, tags: ["music", "nightlife"], officialSite: "newmorning.com" },
        { id: "e2", title: "Opera at Palais Garnier", description: "La Traviata performance", image: "/paris-versailles-palace.jpg", duration: "3 hours", cost: 85, rating: 4.9, reviews: 2345, tags: ["show", "culture"], officialSite: "operadeparis.fr" },
        { id: "e3", title: "Impressionist Exhibition", description: "New temporary exhibition opening", image: "/paris-louvre-museum.jpg", duration: "2 hours", cost: 22, rating: 4.7, reviews: 876, tags: ["art", "culture"] },
        { id: "e4", title: "Seine River Party Cruise", description: "DJ set on the water", image: "/paris-seine-river.jpg", duration: "4 hours", cost: 55, rating: 4.6, reviews: 987, tags: ["party", "nightlife"] },
        { id: "e5", title: "Belleville Street Art Festival", description: "Urban art and live painting", image: "/paris-montmartre-streets.jpg", duration: "6 hours", cost: 0, rating: 4.5, reviews: 654, tags: ["art", "free"] },
        { id: "e6", title: "French Film Night", description: "Classic cinema at MK2", image: "/paris-louvre-museum.jpg", duration: "2.5 hours", cost: 12, rating: 4.4, reviews: 432, tags: ["film", "culture"] },
        { id: "e7", title: "Sunset Yoga at Trocadero", description: "Free outdoor yoga session", image: "/paris-eiffel-tower-sunset.jpg", duration: "1.5 hours", cost: 0, rating: 4.7, reviews: 321, tags: ["wellness", "free"] },
        { id: "e8", title: "Wine & Cheese Night", description: "Sommelier-led pairing event", image: "/paris-cafe-terrace.jpg", duration: "2.5 hours", cost: 75, rating: 4.8, reviews: 543, tags: ["food", "experience"] },
      ]
    },
    
    restaurants: {
      title: "Restaurants & Dining",
      icon: "Utensils",
      color: "bg-orange-500",
      description: "40 dining experiences",
      items: [
        { id: "r1", title: "Pink Mamma", description: "Trendy Italian with 5 floors", image: "/paris-cafe-terrace.jpg", duration: "2 hours", cost: 45, rating: 4.8, reviews: 8765, cuisine: "Italian", popular: true, tags: ["italian", "trendy"] },
        { id: "r2", title: "Le Bouillon Chartier", description: "Historic brasserie since 1896", image: "/paris-cafe-terrace.jpg", duration: "1.5 hours", cost: 25, rating: 4.6, reviews: 12345, cuisine: "French", popular: true, tags: ["french", "historic"] },
        { id: "r3", title: "L'As du Fallafel", description: "Best falafel in Le Marais", image: "/paris-cafe-terrace.jpg", duration: "30 min", cost: 12, rating: 4.7, reviews: 9876, cuisine: "Middle Eastern", tags: ["quick", "budget"] },
        { id: "r4", title: "Cafe de Flore", description: "Iconic literary cafe", image: "/paris-cafe-terrace.jpg", duration: "1 hour", cost: 35, rating: 4.5, reviews: 6543, cuisine: "French", tags: ["iconic", "cafe"] },
        { id: "r5", title: "Frenchie", description: "Michelin-starred modern French", image: "/paris-cafe-terrace.jpg", duration: "2.5 hours", cost: 95, rating: 4.9, reviews: 2345, cuisine: "Fine Dining", popular: true, tags: ["fine-dining", "special"] },
        { id: "r6", title: "Breizh Cafe", description: "Gourmet Breton crepes", image: "/paris-cafe-terrace.jpg", duration: "1 hour", cost: 22, rating: 4.8, reviews: 5678, cuisine: "Crepes", tags: ["crepes", "local"] },
        { id: "r7", title: "Holybelly", description: "Best brunch in Paris", image: "/paris-cafe-terrace.jpg", duration: "1.5 hours", cost: 28, rating: 4.8, reviews: 4321, cuisine: "Brunch", tags: ["brunch", "trendy"] },
        { id: "r8", title: "Le Train Bleu", description: "Belle Epoque restaurant in station", image: "/paris-versailles-palace.jpg", duration: "2 hours", cost: 55, rating: 4.7, reviews: 4567, cuisine: "French", tags: ["historic", "special"] },
        { id: "r9", title: "Pierre Herme", description: "World's best macarons", image: "/paris-cafe-terrace.jpg", duration: "20 min", cost: 15, rating: 4.9, reviews: 7654, cuisine: "Pastry", tags: ["pastry", "quick"] },
        { id: "r10", title: "Du Pain et des Idees", description: "Artisan bakery with escargot pastry", image: "/paris-cafe-terrace.jpg", duration: "20 min", cost: 10, rating: 4.9, reviews: 5432, cuisine: "Bakery", tags: ["bakery", "local"] },
        { id: "r11", title: "Candelaria", description: "Tacos + hidden speakeasy", image: "/paris-cafe-terrace.jpg", duration: "2 hours", cost: 30, rating: 4.6, reviews: 3456, cuisine: "Mexican", tags: ["mexican", "cocktails"] },
        { id: "r12", title: "Angelina", description: "Famous hot chocolate and Mont Blanc", image: "/paris-cafe-terrace.jpg", duration: "1 hour", cost: 28, rating: 4.7, reviews: 8765, cuisine: "Tea Room", tags: ["tea", "dessert"] },
      ]
    },
    
    cafes: {
      title: "Cafes & Coffee",
      icon: "Coffee",
      color: "bg-amber-600",
      description: "15 coffee spots",
      items: [
        { id: "c1", title: "Cafe de Flore", description: "Iconic literary cafe", image: "/paris-cafe-terrace.jpg", duration: "1 hour", cost: 8, rating: 4.6, reviews: 8765, tags: ["iconic", "historic"] },
        { id: "c2", title: "Les Deux Magots", description: "Sartre and Hemingway's spot", image: "/paris-cafe-terrace.jpg", duration: "1 hour", cost: 9, rating: 4.5, reviews: 7654, tags: ["iconic", "historic"] },
        { id: "c3", title: "Telescope Coffee", description: "Specialty coffee pioneer", image: "/paris-cafe-terrace.jpg", duration: "30 min", cost: 5, rating: 4.8, reviews: 2345, tags: ["specialty", "modern"] },
        { id: "c4", title: "Boot Cafe", description: "Tiny cafe in a shoe repair shop", image: "/paris-cafe-terrace.jpg", duration: "30 min", cost: 4, rating: 4.7, reviews: 1876, tags: ["unique", "hidden"] },
        { id: "c5", title: "Coutume Cafe", description: "Best flat white in Paris", image: "/paris-cafe-terrace.jpg", duration: "45 min", cost: 5, rating: 4.8, reviews: 3456, tags: ["specialty", "modern"] },
        { id: "c6", title: "Ten Belles", description: "Canal Saint-Martin favorite", image: "/paris-cafe-terrace.jpg", duration: "30 min", cost: 5, rating: 4.8, reviews: 3456, tags: ["specialty", "trendy"] },
        { id: "c7", title: "Shakespeare & Company Cafe", description: "Next to famous bookshop", image: "/paris-cafe-terrace.jpg", duration: "1 hour", cost: 6, rating: 4.6, reviews: 4321, tags: ["books", "unique"] },
      ]
    },
    
    transport: {
      title: "Getting Around",
      icon: "Train",
      color: "bg-green-500",
      description: "6 transport options",
      items: [
        { id: "t1", title: "Paris Navigo Week Pass", description: "Unlimited metro, bus, RER for the week", image: "/paris-seine-river.jpg", duration: "7 days", cost: 30, rating: 4.9, reviews: 15678, popular: true, tags: ["metro", "essential"], officialSite: "ratp.fr" },
        { id: "t2", title: "Velib Bike Share", description: "Electric and classic bikes across Paris", image: "/paris-montmartre-streets.jpg", duration: "Daily", cost: 5, rating: 4.5, reviews: 8765, tags: ["bike", "eco"], officialSite: "velib-metropole.fr" },
        { id: "t3", title: "Batobus River Pass", description: "Hop-on hop-off boat on the Seine", image: "/paris-seine-river.jpg", duration: "1 day", cost: 19, rating: 4.4, reviews: 3456, tags: ["boat", "scenic"], officialSite: "batobus.com" },
        { id: "t4", title: "Walking Tour Guide", description: "Local guide for neighborhood walks", image: "/paris-montmartre-streets.jpg", duration: "3 hours", cost: 25, rating: 4.8, reviews: 2345, tags: ["walking", "guide"] },
        { id: "t5", title: "Tootbus Hop-On Pass", description: "Open-top bus sightseeing", image: "/paris-eiffel-tower-sunset.jpg", duration: "2 days", cost: 42, rating: 4.3, reviews: 4567, tags: ["bus", "sightseeing"], officialSite: "tootbus.com" },
        { id: "t6", title: "Airport Transfer CDG", description: "Private car to/from airport", image: "/paris-louvre-museum.jpg", duration: "1 hour", cost: 65, rating: 4.7, reviews: 1876, tags: ["airport", "private"] },
      ]
    },
    
    experiences: {
      title: "Local Experiences",
      icon: "Heart",
      color: "bg-pink-500",
      description: "8 unique experiences",
      items: [
        { id: "x1", title: "Picnic at Champ de Mars", description: "Wine, cheese, and Eiffel Tower views", image: "/paris-eiffel-tower-sunset.jpg", duration: "2 hours", cost: 0, rating: 4.9, reviews: 5678, popular: true, tags: ["romantic", "free"] },
        { id: "x2", title: "French Cooking Class", description: "Learn to make croissants", image: "/paris-cafe-terrace.jpg", duration: "3 hours", cost: 85, rating: 4.9, reviews: 2345, tags: ["food", "hands-on"] },
        { id: "x3", title: "Perfume Workshop", description: "Create your own scent in Le Marais", image: "/paris-montmartre-streets.jpg", duration: "2 hours", cost: 95, rating: 4.8, reviews: 1234, tags: ["unique", "creative"] },
        { id: "x4", title: "Hidden Passages Tour", description: "Discover secret covered arcades", image: "/paris-louvre-museum.jpg", duration: "2.5 hours", cost: 35, rating: 4.7, reviews: 1876, tags: ["walking", "hidden"] },
        { id: "x5", title: "Sunrise at Trocadero", description: "Empty Eiffel Tower photos", image: "/paris-eiffel-tower-sunset.jpg", duration: "1 hour", cost: 0, rating: 4.8, reviews: 987, tags: ["photo", "free"] },
        { id: "x6", title: "Local Market with Chef", description: "Shop and cook with a Parisian", image: "/paris-cafe-terrace.jpg", duration: "4 hours", cost: 120, rating: 4.9, reviews: 654, tags: ["food", "local"] },
        { id: "x7", title: "Night Photography Walk", description: "Capture Paris after dark", image: "/paris-eiffel-tower-sunset.jpg", duration: "3 hours", cost: 45, rating: 4.6, reviews: 432, tags: ["photo", "nightlife"] },
        { id: "x8", title: "Cheese & Wine Pairing", description: "Learn from a sommelier", image: "/paris-cafe-terrace.jpg", duration: "2 hours", cost: 65, rating: 4.8, reviews: 1543, tags: ["food", "experience"] },
      ]
    },

    shopping: {
      title: "Shopping & Markets",
      icon: "ShoppingBag",
      color: "bg-violet-500",
      description: "10 shopping spots",
      items: [
        { id: "sh1", title: "Galeries Lafayette", description: "Iconic department store with stained-glass dome", image: "/paris-louvre-museum.jpg", duration: "2-3 hours", cost: 0, rating: 4.7, reviews: 14567, popular: true, tags: ["luxury", "iconic"], officialSite: "galerieslafayette.com" },
        { id: "sh2", title: "Le Bon Marche", description: "Paris's oldest department store", image: "/paris-louvre-museum.jpg", duration: "2 hours", cost: 0, rating: 4.6, reviews: 6789, tags: ["luxury", "food-hall"], officialSite: "lebonmarche.com" },
        { id: "sh3", title: "Marche aux Puces de Saint-Ouen", description: "World's largest antique flea market", image: "/paris-montmartre-streets.jpg", duration: "3-4 hours", cost: 0, rating: 4.5, reviews: 8934, popular: true, tags: ["vintage", "antiques"] },
        { id: "sh4", title: "Rue Cler Market Street", description: "Charming open-air food market", image: "/paris-cafe-terrace.jpg", duration: "1.5 hours", cost: 0, rating: 4.8, reviews: 4321, tags: ["food", "local"] },
        { id: "sh5", title: "Merci Concept Store", description: "Trendy lifestyle boutique in Le Marais", image: "/paris-montmartre-streets.jpg", duration: "1 hour", cost: 0, rating: 4.6, reviews: 3456, tags: ["fashion", "design"] },
        { id: "sh6", title: "Shakespeare & Company", description: "Legendary English-language bookshop", image: "/paris-louvre-museum.jpg", duration: "45 min", cost: 0, rating: 4.9, reviews: 12345, popular: true, tags: ["books", "iconic"], officialSite: "shakespeareandcompany.com" },
        { id: "sh7", title: "Marche d'Aligre", description: "Authentic Parisian outdoor market", image: "/paris-cafe-terrace.jpg", duration: "1.5 hours", cost: 0, rating: 4.7, reviews: 2345, tags: ["food", "local"] },
        { id: "sh8", title: "Le BHV Marais", description: "Home goods and fashion near Hotel de Ville", image: "/paris-louvre-museum.jpg", duration: "2 hours", cost: 0, rating: 4.4, reviews: 3456, tags: ["department-store", "home"] },
      ]
    },

    nightlife: {
      title: "Nightlife & Bars",
      icon: "Wine",
      color: "bg-fuchsia-500",
      description: "9 nightlife spots",
      items: [
        { id: "n1", title: "Le Caveau de la Huchette", description: "Jazz and swing dancing in a 16th-century cellar", image: "/paris-montmartre-streets.jpg", duration: "3-4 hours", cost: 15, rating: 4.8, reviews: 5678, popular: true, tags: ["jazz", "dancing"], officialSite: "caveaudelahuchette.fr" },
        { id: "n2", title: "Harry's New York Bar", description: "Birthplace of the Bloody Mary since 1911", image: "/paris-cafe-terrace.jpg", duration: "2 hours", cost: 18, rating: 4.6, reviews: 4321, tags: ["cocktails", "historic"], officialSite: "harrysbar.fr" },
        { id: "n3", title: "Le Baron Rouge", description: "Legendary wine bar near Marche d'Aligre", image: "/paris-cafe-terrace.jpg", duration: "1.5 hours", cost: 8, rating: 4.7, reviews: 3456, tags: ["wine", "local"] },
        { id: "n4", title: "Concrete", description: "Floating techno club on the Seine", image: "/paris-seine-river.jpg", duration: "5-6 hours", cost: 20, rating: 4.5, reviews: 2345, tags: ["techno", "club"] },
        { id: "n5", title: "Little Red Door", description: "Award-winning speakeasy cocktail bar", image: "/paris-montmartre-streets.jpg", duration: "2 hours", cost: 16, rating: 4.8, reviews: 1876, tags: ["cocktails", "speakeasy"] },
        { id: "n6", title: "Rosa Bonheur sur Seine", description: "Trendy floating bar with river views", image: "/paris-seine-river.jpg", duration: "3 hours", cost: 12, rating: 4.6, reviews: 3456, tags: ["bar", "views"] },
        { id: "n7", title: "La Bellevilloise", description: "Cultural venue with rooftop bar", image: "/paris-montmartre-streets.jpg", duration: "3 hours", cost: 10, rating: 4.5, reviews: 2345, tags: ["bar", "live-music"] },
        { id: "n8", title: "Experimental Cocktail Club", description: "Speakeasy-style craft cocktails", image: "/paris-cafe-terrace.jpg", duration: "2 hours", cost: 18, rating: 4.7, reviews: 1654, tags: ["cocktails", "speakeasy"] },
      ]
    },

    wellness: {
      title: "Wellness & Relaxation",
      icon: "Dumbbell",
      color: "bg-cyan-500",
      description: "7 wellness experiences",
      items: [
        { id: "w1", title: "Hammam de la Mosquee", description: "Traditional hammam in the Grand Mosque", image: "/paris-versailles-palace.jpg", duration: "2-3 hours", cost: 45, rating: 4.8, reviews: 4567, popular: true, tags: ["spa", "traditional"], officialSite: "mosqueedeparis.net" },
        { id: "w2", title: "Spa at Le Bristol", description: "Luxury hotel spa with pool", image: "/paris-versailles-palace.jpg", duration: "3 hours", cost: 180, rating: 4.9, reviews: 1234, tags: ["luxury", "spa"] },
        { id: "w3", title: "Yoga at Jardin du Luxembourg", description: "Outdoor yoga in beautiful gardens", image: "/paris-versailles-palace.jpg", duration: "1.5 hours", cost: 15, rating: 4.7, reviews: 876, tags: ["yoga", "outdoor"] },
        { id: "w4", title: "Les Bains du Marais", description: "Relaxing hammam and spa in Le Marais", image: "/paris-montmartre-streets.jpg", duration: "2 hours", cost: 55, rating: 4.6, reviews: 2345, tags: ["spa", "hammam"] },
        { id: "w5", title: "Seine-side Morning Run", description: "Guided jogging tour along the river", image: "/paris-seine-river.jpg", duration: "1 hour", cost: 20, rating: 4.5, reviews: 654, tags: ["fitness", "outdoor"] },
        { id: "w6", title: "Nuxe Spa", description: "Natural French skincare treatments", image: "/paris-cafe-terrace.jpg", duration: "2 hours", cost: 95, rating: 4.7, reviews: 1543, tags: ["spa", "beauty"], officialSite: "nuxe.com" },
        { id: "w7", title: "Aqua Studio Float Spa", description: "Sensory deprivation float experience", image: "/paris-louvre-museum.jpg", duration: "1.5 hours", cost: 65, rating: 4.6, reviews: 432, tags: ["unique", "relax"] },
      ]
    },

    tours: {
      title: "Guided Tours",
      icon: "Compass",
      color: "bg-indigo-500",
      description: "9 guided tours",
      items: [
        { id: "to1", title: "Skip-the-Line Louvre Tour", description: "Expert guide through masterpieces", image: "/paris-louvre-museum.jpg", duration: "3 hours", cost: 65, rating: 4.9, reviews: 8765, popular: true, tags: ["museum", "guided"] },
        { id: "to2", title: "Versailles Full-Day Tour", description: "Transport + guide + priority access", image: "/paris-versailles-palace.jpg", duration: "8 hours", cost: 89, rating: 4.8, reviews: 6543, popular: true, tags: ["day-trip", "guided"] },
        { id: "to3", title: "Montmartre Art Walk", description: "Follow in the footsteps of Picasso and Renoir", image: "/paris-montmartre-streets.jpg", duration: "2.5 hours", cost: 30, rating: 4.7, reviews: 3456, tags: ["walking", "art"] },
        { id: "to4", title: "Paris by Night Bike Tour", description: "See illuminated landmarks by bicycle", image: "/paris-eiffel-tower-sunset.jpg", duration: "3 hours", cost: 40, rating: 4.8, reviews: 2345, tags: ["bike", "night"] },
        { id: "to5", title: "Food & Wine Tour Le Marais", description: "6 tastings with a local foodie guide", image: "/paris-cafe-terrace.jpg", duration: "3.5 hours", cost: 95, rating: 4.9, reviews: 1876, tags: ["food", "walking"] },
        { id: "to6", title: "Catacombs VIP Tour", description: "Small group with restricted areas access", image: "/paris-montmartre-streets.jpg", duration: "2 hours", cost: 75, rating: 4.8, reviews: 1234, tags: ["history", "unique"] },
        { id: "to7", title: "Seine River Dinner Cruise", description: "3-course dinner on the water", image: "/paris-seine-river.jpg", duration: "2.5 hours", cost: 110, rating: 4.7, reviews: 4567, tags: ["cruise", "dining"] },
        { id: "to8", title: "D-Day Beaches Day Trip", description: "Full-day excursion to Normandy", image: "/paris-versailles-palace.jpg", duration: "14 hours", cost: 165, rating: 4.9, reviews: 2345, tags: ["day-trip", "history"] },
      ]
    },
  }
}
