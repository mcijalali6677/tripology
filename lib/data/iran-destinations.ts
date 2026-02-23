/**
 * Iranian cities and destinations for the trip planner.
 * Each entry has an English name, Farsi name, province, and type.
 */

export interface IranDestination {
  id: string
  nameEn: string
  nameFa: string
  province: string
  provinceFa: string
  type: "city" | "island" | "village" | "nature"
}

export const iranDestinations: IranDestination[] = [
  // Tehran Province
  { id: "tehran", nameEn: "Tehran", nameFa: "تهران", province: "Tehran", provinceFa: "تهران", type: "city" },
  
  // Isfahan Province
  { id: "isfahan", nameEn: "Isfahan", nameFa: "اصفهان", province: "Isfahan", provinceFa: "اصفهان", type: "city" },
  { id: "kashan", nameEn: "Kashan", nameFa: "کاشان", province: "Isfahan", provinceFa: "اصفهان", type: "city" },
  { id: "natanz", nameEn: "Natanz", nameFa: "نطنز", province: "Isfahan", provinceFa: "اصفهان", type: "city" },
  
  // Fars Province
  { id: "shiraz", nameEn: "Shiraz", nameFa: "شیراز", province: "Fars", provinceFa: "فارس", type: "city" },
  { id: "persepolis", nameEn: "Persepolis", nameFa: "تخت جمشید", province: "Fars", provinceFa: "فارس", type: "nature" },
  { id: "pasargadae", nameEn: "Pasargadae", nameFa: "پاسارگاد", province: "Fars", provinceFa: "فارس", type: "nature" },
  
  // Khorasan Razavi Province
  { id: "mashhad", nameEn: "Mashhad", nameFa: "مشهد", province: "Khorasan Razavi", provinceFa: "خراسان رضوی", type: "city" },
  { id: "neyshabur", nameEn: "Neyshabur", nameFa: "نیشابور", province: "Khorasan Razavi", provinceFa: "خراسان رضوی", type: "city" },
  { id: "torbat-heydarieh", nameEn: "Torbat-e Heydarieh", nameFa: "تربت حیدریه", province: "Khorasan Razavi", provinceFa: "خراسان رضوی", type: "city" },
  
  // East Azerbaijan Province
  { id: "tabriz", nameEn: "Tabriz", nameFa: "تبریز", province: "East Azerbaijan", provinceFa: "آذربایجان شرقی", type: "city" },
  { id: "kandovan", nameEn: "Kandovan", nameFa: "کندوان", province: "East Azerbaijan", provinceFa: "آذربایجان شرقی", type: "village" },
  
  // West Azerbaijan Province
  { id: "urmia", nameEn: "Urmia", nameFa: "ارومیه", province: "West Azerbaijan", provinceFa: "آذربایجان غربی", type: "city" },
  
  // Yazd Province
  { id: "yazd", nameEn: "Yazd", nameFa: "یزد", province: "Yazd", provinceFa: "یزد", type: "city" },
  { id: "meybod", nameEn: "Meybod", nameFa: "میبد", province: "Yazd", provinceFa: "یزد", type: "city" },
  
  // Kerman Province
  { id: "kerman", nameEn: "Kerman", nameFa: "کرمان", province: "Kerman", provinceFa: "کرمان", type: "city" },
  { id: "bam", nameEn: "Bam", nameFa: "بم", province: "Kerman", provinceFa: "کرمان", type: "city" },
  { id: "mahan", nameEn: "Mahan", nameFa: "ماهان", province: "Kerman", provinceFa: "کرمان", type: "city" },
  { id: "shahdad-desert", nameEn: "Shahdad Desert", nameFa: "کویر شهداد", province: "Kerman", provinceFa: "کرمان", type: "nature" },
  
  // Hormozgan Province
  { id: "bandar-abbas", nameEn: "Bandar Abbas", nameFa: "بندرعباس", province: "Hormozgan", provinceFa: "هرمزگان", type: "city" },
  { id: "qeshm", nameEn: "Qeshm Island", nameFa: "جزیره قشم", province: "Hormozgan", provinceFa: "هرمزگان", type: "island" },
  { id: "kish", nameEn: "Kish Island", nameFa: "جزیره کیش", province: "Hormozgan", provinceFa: "هرمزگان", type: "island" },
  { id: "hormuz", nameEn: "Hormuz Island", nameFa: "جزیره هرمز", province: "Hormozgan", provinceFa: "هرمزگان", type: "island" },
  
  // Mazandaran Province
  { id: "sari", nameEn: "Sari", nameFa: "ساری", province: "Mazandaran", provinceFa: "مازندران", type: "city" },
  { id: "ramsar", nameEn: "Ramsar", nameFa: "رامسر", province: "Mazandaran", provinceFa: "مازندران", type: "city" },
  { id: "chalus", nameEn: "Chalus", nameFa: "چالوس", province: "Mazandaran", provinceFa: "مازندران", type: "city" },
  { id: "amol", nameEn: "Amol", nameFa: "آمل", province: "Mazandaran", provinceFa: "مازندران", type: "city" },
  
  // Gilan Province
  { id: "rasht", nameEn: "Rasht", nameFa: "رشت", province: "Gilan", provinceFa: "گیلان", type: "city" },
  { id: "lahijan", nameEn: "Lahijan", nameFa: "لاهیجان", province: "Gilan", provinceFa: "گیلان", type: "city" },
  { id: "bandar-anzali", nameEn: "Bandar-e Anzali", nameFa: "بندر انزلی", province: "Gilan", provinceFa: "گیلان", type: "city" },
  { id: "masouleh", nameEn: "Masuleh", nameFa: "ماسوله", province: "Gilan", provinceFa: "گیلان", type: "village" },
  
  // Golestan Province
  { id: "gorgan", nameEn: "Gorgan", nameFa: "گرگان", province: "Golestan", provinceFa: "گلستان", type: "city" },
  
  // Semnan Province
  { id: "semnan", nameEn: "Semnan", nameFa: "سمنان", province: "Semnan", provinceFa: "سمنان", type: "city" },
  { id: "shahrud", nameEn: "Shahrud", nameFa: "شاهرود", province: "Semnan", provinceFa: "سمنان", type: "city" },
  
  // Khuzestan Province
  { id: "ahvaz", nameEn: "Ahvaz", nameFa: "اهواز", province: "Khuzestan", provinceFa: "خوزستان", type: "city" },
  { id: "shush", nameEn: "Shush (Susa)", nameFa: "شوش", province: "Khuzestan", provinceFa: "خوزستان", type: "city" },
  { id: "shushtar", nameEn: "Shushtar", nameFa: "شوشتر", province: "Khuzestan", provinceFa: "خوزستان", type: "city" },
  
  // Kurdistan Province
  { id: "sanandaj", nameEn: "Sanandaj", nameFa: "سنندج", province: "Kurdistan", provinceFa: "کردستان", type: "city" },
  { id: "marivan", nameEn: "Marivan", nameFa: "مریوان", province: "Kurdistan", provinceFa: "کردستان", type: "city" },
  
  // Kermanshah Province
  { id: "kermanshah", nameEn: "Kermanshah", nameFa: "کرمانشاه", province: "Kermanshah", provinceFa: "کرمانشاه", type: "city" },
  { id: "bisotun", nameEn: "Bisotun", nameFa: "بیستون", province: "Kermanshah", provinceFa: "کرمانشاه", type: "nature" },
  
  // Hamadan Province
  { id: "hamedan", nameEn: "Hamadan", nameFa: "همدان", province: "Hamadan", provinceFa: "همدان", type: "city" },
  { id: "ali-sadr-cave", nameEn: "Ali Sadr Cave", nameFa: "غار علیصدر", province: "Hamadan", provinceFa: "همدان", type: "nature" },
  
  // Lorestan Province
  { id: "khorramabad", nameEn: "Khorramabad", nameFa: "خرم‌آباد", province: "Lorestan", provinceFa: "لرستان", type: "city" },
  
  // Chaharmahal & Bakhtiari Province
  { id: "shahrekord", nameEn: "Shahrekord", nameFa: "شهرکرد", province: "Chaharmahal & Bakhtiari", provinceFa: "چهارمحال و بختیاری", type: "city" },
  
  // Bushehr Province
  { id: "bushehr", nameEn: "Bushehr", nameFa: "بوشهر", province: "Bushehr", provinceFa: "بوشهر", type: "city" },
  
  // Zanjan Province
  { id: "zanjan", nameEn: "Zanjan", nameFa: "زنجان", province: "Zanjan", provinceFa: "زنجان", type: "city" },
  
  // Ardabil Province
  { id: "ardabil", nameEn: "Ardabil", nameFa: "اردبیل", province: "Ardabil", provinceFa: "اردبیل", type: "city" },
  
  // Qom Province
  { id: "qom", nameEn: "Qom", nameFa: "قم", province: "Qom", provinceFa: "قم", type: "city" },
  
  // Qazvin Province
  { id: "qazvin", nameEn: "Qazvin", nameFa: "قزوین", province: "Qazvin", provinceFa: "قزوین", type: "city" },
  { id: "alamut", nameEn: "Alamut Castle", nameFa: "قلعه الموت", province: "Qazvin", provinceFa: "قزوین", type: "nature" },
  
  // Markazi Province
  { id: "arak", nameEn: "Arak", nameFa: "اراک", province: "Markazi", provinceFa: "مرکزی", type: "city" },
  
  // Ilam Province
  { id: "ilam", nameEn: "Ilam", nameFa: "ایلام", province: "Ilam", provinceFa: "ایلام", type: "city" },
  
  // Kohgiluyeh Province
  { id: "yasuj", nameEn: "Yasuj", nameFa: "یاسوج", province: "Kohgiluyeh & Boyer-Ahmad", provinceFa: "کهگیلویه و بویراحمد", type: "city" },
  
  // Sistan Province
  { id: "zahedan", nameEn: "Zahedan", nameFa: "زاهدان", province: "Sistan & Baluchestan", provinceFa: "سیستان و بلوچستان", type: "city" },
  { id: "chabahar", nameEn: "Chabahar", nameFa: "چابهار", province: "Sistan & Baluchestan", provinceFa: "سیستان و بلوچستان", type: "city" },
  
  // South Khorasan Province
  { id: "birjand", nameEn: "Birjand", nameFa: "بیرجند", province: "South Khorasan", provinceFa: "خراسان جنوبی", type: "city" },
  { id: "tabas", nameEn: "Tabas", nameFa: "طبس", province: "South Khorasan", provinceFa: "خراسان جنوبی", type: "city" },
  
  // North Khorasan Province
  { id: "bojnurd", nameEn: "Bojnurd", nameFa: "بجنورد", province: "North Khorasan", provinceFa: "خراسان شمالی", type: "city" },
  
  // Alborz Province
  { id: "karaj", nameEn: "Karaj", nameFa: "کرج", province: "Alborz", provinceFa: "البرز", type: "city" },
  
  // Popular international (Paris kept as default for the demo)
  { id: "paris", nameEn: "Paris", nameFa: "پاریس", province: "France", provinceFa: "فرانسه", type: "city" },
]
