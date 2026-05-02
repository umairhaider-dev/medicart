export type ProductForm = "Tablet" | "Capsule" | "Syrup" | "Injection" | "Powder" | "Cream" | "Drops" | "Gel" | "Spray" | "Patch" | "Device";
export type ProductCategory = "Medicines" | "Vitamins" | "Devices" | "Baby Care" | "Herbal" | "Beauty" | "Fitness" | "Ayurvedic";

export interface Product {
  id: string;
  name: string;
  brand: string;
  genericName?: string;
  category: ProductCategory;
  subcategory: string;
  form: ProductForm;
  strength?: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviews: number;
  stock: number;
  image: string;
  color: string;      // tailwind gradient
  bgColor: string;    // card bg gradient
  tags: string[];
  description: string;
  uses: string[];
  sideEffects?: string[];
  prescription: boolean;
  isNew: boolean;
  isBestSeller: boolean;
  isTrending: boolean;
  inStock: boolean;
  packSize: string;
  manufacturer: string;
  expiryMonths: number;
  sku: string;
}

export const PRODUCTS: Product[] = [
  /* ─── MEDICINES ─── */
  {
    id: "med-001", name: "Paracetamol 500mg", brand: "Panadol", genericName: "Acetaminophen",
    category: "Medicines", subcategory: "Pain & Fever", form: "Tablet", strength: "500mg",
    price: 4.99, originalPrice: 7.99, discount: 38, rating: 4.8, reviews: 12450, stock: 500,
    image: "💊", color: "from-blue-400 to-indigo-500", bgColor: "from-blue-50 to-indigo-50",
    tags: ["OTC", "Best Seller", "Pain Relief"], description: "Fast-acting fever and pain relief. Safe for adults and children over 12.",
    uses: ["Headache", "Fever", "Body Pain", "Toothache"], sideEffects: ["Nausea (rare)"],
    prescription: false, isNew: false, isBestSeller: true, isTrending: true, inStock: true,
    packSize: "Strip of 10", manufacturer: "GSK", expiryMonths: 36, sku: "PAR-500-10",
  },
  {
    id: "med-002", name: "Ibuprofen 400mg", brand: "Brufen", genericName: "Ibuprofen",
    category: "Medicines", subcategory: "Pain & Fever", form: "Tablet", strength: "400mg",
    price: 5.49, originalPrice: 8.99, discount: 39, rating: 4.7, reviews: 9320, stock: 380,
    image: "🔴", color: "from-red-400 to-rose-500", bgColor: "from-red-50 to-rose-50",
    tags: ["OTC", "Anti-inflammatory"], description: "NSAID for pain, inflammation, and fever. Effective for muscle aches and arthritis.",
    uses: ["Arthritis", "Muscle Pain", "Fever", "Menstrual Cramps"],
    prescription: false, isNew: false, isBestSeller: true, isTrending: false, inStock: true,
    packSize: "Strip of 10", manufacturer: "Abbott", expiryMonths: 36, sku: "IBU-400-10",
  },
  {
    id: "med-003", name: "Amoxicillin 500mg", brand: "Amoxil", genericName: "Amoxicillin",
    category: "Medicines", subcategory: "Antibiotics", form: "Capsule", strength: "500mg",
    price: 12.99, originalPrice: 18.99, discount: 32, rating: 4.6, reviews: 5670, stock: 200,
    image: "🟡", color: "from-amber-400 to-orange-500", bgColor: "from-amber-50 to-orange-50",
    tags: ["Prescription", "Antibiotic"], description: "Broad-spectrum antibiotic for bacterial infections of the ear, throat, and lungs.",
    uses: ["Ear Infection", "Throat Infection", "Pneumonia", "UTI"],
    prescription: true, isNew: false, isBestSeller: false, isTrending: false, inStock: true,
    packSize: "10 Capsules", manufacturer: "GSK", expiryMonths: 24, sku: "AMX-500-10",
  },
  {
    id: "med-004", name: "Omeprazole 20mg", brand: "Omez", genericName: "Omeprazole",
    category: "Medicines", subcategory: "Gastro", form: "Capsule", strength: "20mg",
    price: 9.99, originalPrice: 14.99, discount: 33, rating: 4.8, reviews: 7830, stock: 320,
    image: "🟣", color: "from-purple-400 to-violet-500", bgColor: "from-purple-50 to-violet-50",
    tags: ["OTC", "Acidity Relief", "Best Seller"], description: "Proton pump inhibitor for acid reflux, GERD, and peptic ulcers.",
    uses: ["Acid Reflux", "GERD", "Stomach Ulcer", "Heartburn"],
    prescription: false, isNew: false, isBestSeller: true, isTrending: true, inStock: true,
    packSize: "Strip of 10", manufacturer: "Dr. Reddy's", expiryMonths: 30, sku: "OME-20-10",
  },
  {
    id: "med-005", name: "Metformin 500mg", brand: "Glucophage", genericName: "Metformin HCl",
    category: "Medicines", subcategory: "Diabetes", form: "Tablet", strength: "500mg",
    price: 8.49, originalPrice: 12.99, discount: 35, rating: 4.7, reviews: 6210, stock: 450,
    image: "🩵", color: "from-cyan-400 to-teal-500", bgColor: "from-cyan-50 to-teal-50",
    tags: ["Prescription", "Diabetes"], description: "First-line medication for type 2 diabetes. Helps control blood sugar levels.",
    uses: ["Type 2 Diabetes", "Blood Sugar Control", "PCOS"],
    prescription: true, isNew: false, isBestSeller: false, isTrending: false, inStock: true,
    packSize: "Strip of 10", manufacturer: "Merck", expiryMonths: 36, sku: "MET-500-10",
  },
  {
    id: "med-006", name: "Atorvastatin 10mg", brand: "Lipitor", genericName: "Atorvastatin Calcium",
    category: "Medicines", subcategory: "Heart", form: "Tablet", strength: "10mg",
    price: 11.99, originalPrice: 17.99, discount: 33, rating: 4.6, reviews: 4580, stock: 280,
    image: "❤️", color: "from-red-500 to-rose-600", bgColor: "from-red-50 to-pink-50",
    tags: ["Prescription", "Cholesterol"], description: "Statin medication for reducing LDL cholesterol and preventing heart disease.",
    uses: ["High Cholesterol", "Heart Disease Prevention", "Stroke Prevention"],
    prescription: true, isNew: false, isBestSeller: false, isTrending: false, inStock: true,
    packSize: "Strip of 10", manufacturer: "Pfizer", expiryMonths: 36, sku: "ATO-10-10",
  },
  {
    id: "med-007", name: "Cetirizine 10mg", brand: "Zyrtec", genericName: "Cetirizine HCl",
    category: "Medicines", subcategory: "Allergy", form: "Tablet", strength: "10mg",
    price: 6.99, originalPrice: 9.99, discount: 30, rating: 4.8, reviews: 8920, stock: 600,
    image: "🌸", color: "from-pink-400 to-rose-500", bgColor: "from-pink-50 to-rose-50",
    tags: ["OTC", "Allergy", "Trending"], description: "Non-drowsy antihistamine for hay fever, allergic rhinitis, and urticaria.",
    uses: ["Hay Fever", "Allergic Rhinitis", "Hives", "Skin Allergy"],
    prescription: false, isNew: false, isBestSeller: false, isTrending: true, inStock: true,
    packSize: "Strip of 10", manufacturer: "UCB", expiryMonths: 36, sku: "CET-10-10",
  },
  {
    id: "med-008", name: "Azithromycin 500mg", brand: "Zithromax", genericName: "Azithromycin",
    category: "Medicines", subcategory: "Antibiotics", form: "Tablet", strength: "500mg",
    price: 14.99, originalPrice: 22.99, discount: 35, rating: 4.7, reviews: 5340, stock: 150,
    image: "🟠", color: "from-orange-400 to-amber-500", bgColor: "from-orange-50 to-amber-50",
    tags: ["Prescription", "Antibiotic", "Z-Pak"], description: "Macrolide antibiotic for respiratory and skin infections. Take once daily.",
    uses: ["Respiratory Infections", "Skin Infections", "Chlamydia", "Pneumonia"],
    prescription: true, isNew: false, isBestSeller: false, isTrending: false, inStock: true,
    packSize: "3 Tablets", manufacturer: "Pfizer", expiryMonths: 24, sku: "AZI-500-3",
  },
  {
    id: "med-009", name: "Diclofenac Gel 1%", brand: "Voltaren", genericName: "Diclofenac Sodium",
    category: "Medicines", subcategory: "Pain & Fever", form: "Gel", strength: "1%",
    price: 13.49, originalPrice: 19.99, discount: 33, rating: 4.6, reviews: 4120, stock: 180,
    image: "🟢", color: "from-green-400 to-emerald-500", bgColor: "from-green-50 to-emerald-50",
    tags: ["OTC", "Topical", "Joint Pain"], description: "Topical anti-inflammatory gel for joint and muscle pain. Apply directly to affected area.",
    uses: ["Joint Pain", "Muscle Ache", "Arthritis", "Sports Injuries"],
    prescription: false, isNew: false, isBestSeller: false, isTrending: true, inStock: true,
    packSize: "50g Tube", manufacturer: "Novartis", expiryMonths: 30, sku: "DIC-GEL-50",
  },
  {
    id: "med-010", name: "Salbutamol Inhaler", brand: "Ventolin", genericName: "Albuterol",
    category: "Medicines", subcategory: "Respiratory", form: "Spray", strength: "100mcg",
    price: 24.99, originalPrice: 34.99, discount: 29, rating: 4.9, reviews: 7230, stock: 90,
    image: "💨", color: "from-sky-400 to-blue-500", bgColor: "from-sky-50 to-blue-50",
    tags: ["Prescription", "Asthma", "Emergency"], description: "Fast-acting bronchodilator inhaler for asthma and COPD relief.",
    uses: ["Asthma Attack", "COPD", "Bronchospasm", "Exercise-Induced Asthma"],
    prescription: true, isNew: false, isBestSeller: true, isTrending: false, inStock: true,
    packSize: "1 Inhaler (200 doses)", manufacturer: "GSK", expiryMonths: 24, sku: "SAL-INH-200",
  },

  /* ─── VITAMINS & SUPPLEMENTS ─── */
  {
    id: "vit-001", name: "Vitamin D3 5000 IU", brand: "HealthCore", genericName: "Cholecalciferol",
    category: "Vitamins", subcategory: "Vitamins", form: "Tablet", strength: "5000 IU",
    price: 24.99, originalPrice: 34.99, discount: 29, rating: 4.9, reviews: 14820, stock: 400,
    image: "☀️", color: "from-yellow-400 to-orange-400", bgColor: "from-yellow-50 to-orange-50",
    tags: ["Best Seller", "Immunity", "Bone Health"], description: "Premium Vitamin D3 for bone health, immunity, and mood support. Third-party tested.",
    uses: ["Bone Health", "Immunity", "Mood Support", "Muscle Function"],
    prescription: false, isNew: false, isBestSeller: true, isTrending: true, inStock: true,
    packSize: "60 Tablets", manufacturer: "HealthCore Labs", expiryMonths: 36, sku: "VD3-5K-60",
  },
  {
    id: "vit-002", name: "Omega-3 Fish Oil 1000mg", brand: "NaturePlus", genericName: "EPA/DHA",
    category: "Vitamins", subcategory: "Fatty Acids", form: "Capsule", strength: "1000mg",
    price: 19.99, originalPrice: 29.99, discount: 33, rating: 4.8, reviews: 11230, stock: 350,
    image: "🐟", color: "from-blue-400 to-cyan-500", bgColor: "from-blue-50 to-cyan-50",
    tags: ["Heart Health", "Brain Function", "No Fishy Burp"], description: "Triple strength Omega-3 with enteric coating for heart, brain, and joint health.",
    uses: ["Heart Health", "Brain Function", "Joint Health", "Vision"],
    prescription: false, isNew: false, isBestSeller: true, isTrending: false, inStock: true,
    packSize: "90 Softgels", manufacturer: "NaturePlus", expiryMonths: 30, sku: "OMG-1K-90",
  },
  {
    id: "vit-003", name: "Vitamin C 1000mg with Zinc", brand: "ImmunoShield", genericName: "Ascorbic Acid",
    category: "Vitamins", subcategory: "Vitamins", form: "Tablet", strength: "1000mg",
    price: 16.99, originalPrice: 24.99, discount: 32, rating: 4.7, reviews: 9870, stock: 520,
    image: "🍊", color: "from-orange-400 to-amber-500", bgColor: "from-orange-50 to-amber-50",
    tags: ["Immunity Booster", "Antioxidant", "Trending"], description: "High-dose Vitamin C with Zinc for powerful immune support and antioxidant protection.",
    uses: ["Immunity", "Collagen Synthesis", "Antioxidant", "Wound Healing"],
    prescription: false, isNew: false, isBestSeller: false, isTrending: true, inStock: true,
    packSize: "60 Tablets", manufacturer: "ImmunoShield", expiryMonths: 30, sku: "VTC-1K-60",
  },
  {
    id: "vit-004", name: "Magnesium Glycinate 400mg", brand: "SleepWell", genericName: "Magnesium",
    category: "Vitamins", subcategory: "Minerals", form: "Capsule", strength: "400mg",
    price: 28.99, originalPrice: 39.99, discount: 28, rating: 4.9, reviews: 7650, stock: 280,
    image: "🌙", color: "from-indigo-400 to-violet-500", bgColor: "from-indigo-50 to-violet-50",
    tags: ["Sleep Aid", "Stress Relief", "New"], description: "Highly bioavailable magnesium glycinate for sleep quality, muscle recovery, and stress.",
    uses: ["Sleep Quality", "Stress Relief", "Muscle Recovery", "Anxiety"],
    prescription: false, isNew: true, isBestSeller: false, isTrending: true, inStock: true,
    packSize: "120 Capsules", manufacturer: "SleepWell Nutrition", expiryMonths: 36, sku: "MAG-400-120",
  },
  {
    id: "vit-005", name: "Probiotic 50 Billion CFU", brand: "GutGuard", genericName: "Lactobacillus",
    category: "Vitamins", subcategory: "Probiotics", form: "Capsule", strength: "50B CFU",
    price: 39.99, originalPrice: 54.99, discount: 27, rating: 4.7, reviews: 8920, stock: 200,
    image: "🦠", color: "from-green-400 to-teal-500", bgColor: "from-green-50 to-teal-50",
    tags: ["Gut Health", "Best Seller", "10 Strains"], description: "Multi-strain probiotic with 50 billion CFU for digestive health and immunity.",
    uses: ["Digestive Health", "IBS", "Immunity", "Post-Antibiotic Recovery"],
    prescription: false, isNew: false, isBestSeller: true, isTrending: false, inStock: true,
    packSize: "30 Capsules", manufacturer: "GutGuard Biotech", expiryMonths: 18, sku: "PRO-50B-30",
  },
  {
    id: "vit-006", name: "Collagen Peptides Powder", brand: "GlowGenics", genericName: "Hydrolyzed Collagen",
    category: "Vitamins", subcategory: "Protein & Collagen", form: "Powder", strength: "10g/serving",
    price: 44.99, originalPrice: 64.99, discount: 31, rating: 4.8, reviews: 12340, stock: 180,
    image: "✨", color: "from-pink-400 to-rose-500", bgColor: "from-pink-50 to-rose-50",
    tags: ["Beauty", "Anti-Aging", "Best Seller"], description: "Grass-fed hydrolyzed collagen peptides for skin elasticity, hair, and joint health.",
    uses: ["Skin Health", "Hair Growth", "Nail Strength", "Joint Support"],
    prescription: false, isNew: false, isBestSeller: true, isTrending: true, inStock: true,
    packSize: "300g (30 servings)", manufacturer: "GlowGenics", expiryMonths: 24, sku: "COL-300-30",
  },
  {
    id: "vit-007", name: "Ashwagandha KSM-66 600mg", brand: "StressLess", genericName: "Withania Somnifera",
    category: "Herbal", subcategory: "Adaptogens", form: "Capsule", strength: "600mg",
    price: 32.99, originalPrice: 44.99, discount: 27, rating: 4.8, reviews: 9870, stock: 260,
    image: "🌿", color: "from-emerald-400 to-green-500", bgColor: "from-emerald-50 to-green-50",
    tags: ["Organic", "Stress Relief", "Trending"], description: "Clinically studied KSM-66 ashwagandha for stress, anxiety, energy, and testosterone.",
    uses: ["Stress Relief", "Energy", "Testosterone", "Sleep", "Muscle Recovery"],
    prescription: false, isNew: false, isBestSeller: false, isTrending: true, inStock: true,
    packSize: "60 Capsules", manufacturer: "StressLess Herbs", expiryMonths: 30, sku: "ASH-600-60",
  },
  {
    id: "vit-008", name: "Biotin 10000mcg", brand: "HairGrow", genericName: "Biotin (B7)",
    category: "Vitamins", subcategory: "Vitamins", form: "Tablet", strength: "10000mcg",
    price: 21.99, originalPrice: 29.99, discount: 27, rating: 4.6, reviews: 16780, stock: 420,
    image: "💅", color: "from-amber-400 to-yellow-500", bgColor: "from-amber-50 to-yellow-50",
    tags: ["Hair & Nails", "New", "Beauty"], description: "Ultra-strength biotin for hair growth, nail strength, and metabolic support.",
    uses: ["Hair Loss", "Nail Strength", "Skin Health", "Metabolism"],
    prescription: false, isNew: true, isBestSeller: false, isTrending: false, inStock: true,
    packSize: "90 Tablets", manufacturer: "HairGrow Nutrition", expiryMonths: 36, sku: "BIO-10K-90",
  },

  /* ─── DEVICES ─── */
  {
    id: "dev-001", name: "Digital Blood Pressure Monitor", brand: "Omron", genericName: "BP Monitor",
    category: "Devices", subcategory: "Cardiac Monitors", form: "Device",
    price: 59.99, originalPrice: 84.99, discount: 29, rating: 4.8, reviews: 8230, stock: 75,
    image: "🩺", color: "from-blue-500 to-indigo-600", bgColor: "from-blue-50 to-indigo-50",
    tags: ["Best Seller", "Clinically Validated", "Bluetooth"], description: "Automatic upper arm BP monitor with irregular heartbeat detection and app connectivity.",
    uses: ["Blood Pressure Monitoring", "Heart Rate", "Arrhythmia Detection"],
    prescription: false, isNew: false, isBestSeller: true, isTrending: false, inStock: true,
    packSize: "1 Unit + Cuff", manufacturer: "Omron Healthcare", expiryMonths: 0, sku: "BPM-OM-HEM",
  },
  {
    id: "dev-002", name: "Glucometer Starter Kit", brand: "Accu-Chek", genericName: "Blood Glucose Monitor",
    category: "Devices", subcategory: "Diabetes Monitors", form: "Device",
    price: 39.99, originalPrice: 59.99, discount: 33, rating: 4.7, reviews: 6540, stock: 55,
    image: "🩸", color: "from-red-400 to-orange-500", bgColor: "from-red-50 to-orange-50",
    tags: ["Diabetes", "Free Strips Included", "New"], description: "Accurate blood glucose meter with 50 test strips, lancing device, and carrying case.",
    uses: ["Diabetes Management", "Blood Sugar Monitoring"],
    prescription: false, isNew: true, isBestSeller: false, isTrending: true, inStock: true,
    packSize: "Kit (50 strips)", manufacturer: "Roche", expiryMonths: 0, sku: "GLU-ACC-KIT",
  },
  {
    id: "dev-003", name: "Pulse Oximeter SpO2", brand: "ChoiceMMed", genericName: "Oximeter",
    category: "Devices", subcategory: "Respiratory Monitors", form: "Device",
    price: 22.99, originalPrice: 34.99, discount: 34, rating: 4.6, reviews: 11200, stock: 120,
    image: "💉", color: "from-teal-400 to-cyan-500", bgColor: "from-teal-50 to-cyan-50",
    tags: ["SpO2", "Heart Rate", "OLED Display"], description: "Fingertip pulse oximeter with OLED display for SpO2 and heart rate monitoring.",
    uses: ["Oxygen Saturation", "Heart Rate", "COPD Monitoring"],
    prescription: false, isNew: false, isBestSeller: false, isTrending: true, inStock: true,
    packSize: "1 Unit + Batteries", manufacturer: "ChoiceMMed", expiryMonths: 0, sku: "SPO-CM-01",
  },
  {
    id: "dev-004", name: "Digital Thermometer Pro", brand: "Dr. Trust", genericName: "Thermometer",
    category: "Devices", subcategory: "Thermometers", form: "Device",
    price: 18.99, originalPrice: 27.99, discount: 32, rating: 4.7, reviews: 9870, stock: 200,
    image: "🌡️", color: "from-green-400 to-emerald-500", bgColor: "from-green-50 to-emerald-50",
    tags: ["Flexible Tip", "10-Second Reading", "Waterproof"], description: "Flexible tip thermometer with fever alert, memory function, and 10-second reading.",
    uses: ["Fever Monitoring", "Temperature Tracking"],
    prescription: false, isNew: false, isBestSeller: false, isTrending: false, inStock: true,
    packSize: "1 Unit + Case", manufacturer: "Dr. Trust", expiryMonths: 0, sku: "TMP-DRT-01",
  },

  /* ─── BABY CARE ─── */
  {
    id: "baby-001", name: "Infant Gripe Water", brand: "Woodward's", genericName: "Dill Seed Oil",
    category: "Baby Care", subcategory: "Digestive", form: "Syrup",
    price: 8.99, originalPrice: 12.99, discount: 31, rating: 4.7, reviews: 7640, stock: 300,
    image: "👶", color: "from-yellow-300 to-amber-400", bgColor: "from-yellow-50 to-amber-50",
    tags: ["0–12 Months", "Colic Relief", "Alcohol-Free"], description: "Time-tested gripe water for infant colic, gas, and stomach discomfort. Alcohol-free.",
    uses: ["Colic", "Gas", "Stomach Discomfort"],
    prescription: false, isNew: false, isBestSeller: true, isTrending: false, inStock: true,
    packSize: "200ml", manufacturer: "GSK Consumer", expiryMonths: 24, sku: "GRP-WW-200",
  },
  {
    id: "baby-002", name: "Baby Vitamin D Drops", brand: "D-Vi-Sol", genericName: "Cholecalciferol",
    category: "Baby Care", subcategory: "Vitamins", form: "Drops", strength: "400 IU/mL",
    price: 14.99, originalPrice: 19.99, discount: 25, rating: 4.9, reviews: 5430, stock: 180,
    image: "🌟", color: "from-orange-300 to-yellow-400", bgColor: "from-orange-50 to-yellow-50",
    tags: ["0–12 Months", "Pediatrician Recommended", "New"], description: "Pediatric Vitamin D drops for bone development. Only 1 drop per day needed.",
    uses: ["Bone Development", "Immune Support"],
    prescription: false, isNew: true, isBestSeller: false, isTrending: false, inStock: true,
    packSize: "50ml (300 doses)", manufacturer: "Mead Johnson", expiryMonths: 24, sku: "VD3-SOL-50",
  },

  /* ─── HERBAL & AYURVEDIC ─── */
  {
    id: "herb-001", name: "Triphala Churna 500mg", brand: "Dabur", genericName: "Triphala",
    category: "Ayurvedic", subcategory: "Digestive", form: "Powder",
    price: 11.99, originalPrice: 16.99, discount: 29, rating: 4.6, reviews: 8230, stock: 350,
    image: "🌾", color: "from-lime-400 to-green-500", bgColor: "from-lime-50 to-green-50",
    tags: ["Ayurvedic", "Digestive", "3-in-1"], description: "Ancient Ayurvedic formulation with Amla, Haritaki, and Vibhitaki for digestion and immunity.",
    uses: ["Digestion", "Constipation", "Detox", "Eye Health"],
    prescription: false, isNew: false, isBestSeller: false, isTrending: false, inStock: true,
    packSize: "250g", manufacturer: "Dabur India", expiryMonths: 36, sku: "TRP-DAB-250",
  },
  {
    id: "herb-002", name: "Turmeric Curcumin 500mg", brand: "Organic India", genericName: "Curcuma Longa",
    category: "Herbal", subcategory: "Anti-inflammatory", form: "Capsule", strength: "500mg",
    price: 22.99, originalPrice: 32.99, discount: 30, rating: 4.7, reviews: 10540, stock: 300,
    image: "🌕", color: "from-yellow-400 to-amber-500", bgColor: "from-yellow-50 to-amber-50",
    tags: ["Organic", "Anti-inflammatory", "With BioPerine"], description: "Organic turmeric with 95% curcuminoids + BioPerine for 20x better absorption.",
    uses: ["Inflammation", "Joint Health", "Antioxidant", "Immunity"],
    prescription: false, isNew: false, isBestSeller: false, isTrending: true, inStock: true,
    packSize: "60 Capsules", manufacturer: "Organic India", expiryMonths: 30, sku: "TUR-OI-60",
  },

  /* ─── FITNESS ─── */
  {
    id: "fit-001", name: "Whey Protein Isolate 25g", brand: "Optimum Nutrition", genericName: "Whey Protein",
    category: "Fitness", subcategory: "Protein", form: "Powder",
    price: 54.99, originalPrice: 74.99, discount: 27, rating: 4.8, reviews: 23450, stock: 150,
    image: "💪", color: "from-orange-500 to-red-500", bgColor: "from-orange-50 to-red-50",
    tags: ["Best Seller", "Muscle Building", "25g Protein/Serving"], description: "Gold Standard 100% Whey protein isolate. 25g protein, 5.5g BCAAs per serving.",
    uses: ["Muscle Building", "Post-Workout Recovery", "Weight Management"],
    prescription: false, isNew: false, isBestSeller: true, isTrending: true, inStock: true,
    packSize: "2 lbs (28 servings)", manufacturer: "Optimum Nutrition", expiryMonths: 24, sku: "WPI-ON-2LB",
  },
  {
    id: "fit-002", name: "Creatine Monohydrate 5g", brand: "Myprotein", genericName: "Creatine",
    category: "Fitness", subcategory: "Performance", form: "Powder", strength: "5g/serving",
    price: 29.99, originalPrice: 42.99, discount: 30, rating: 4.7, reviews: 15670, stock: 200,
    image: "⚡", color: "from-yellow-400 to-orange-500", bgColor: "from-yellow-50 to-orange-50",
    tags: ["Strength", "Performance", "Micronized"], description: "Micronized creatine monohydrate for strength, power, and lean muscle mass gains.",
    uses: ["Strength Gains", "Power Output", "Muscle Volume", "Athletic Performance"],
    prescription: false, isNew: false, isBestSeller: false, isTrending: true, inStock: true,
    packSize: "500g (100 servings)", manufacturer: "Myprotein", expiryMonths: 36, sku: "CRE-MYP-500",
  },

  /* ─── BEAUTY ─── */
  {
    id: "bty-001", name: "Retinol 0.5% Serum", brand: "CeraVe", genericName: "Retinol",
    category: "Beauty", subcategory: "Anti-Aging", form: "Gel", strength: "0.5%",
    price: 34.99, originalPrice: 49.99, discount: 30, rating: 4.7, reviews: 13240, stock: 140,
    image: "🌙", color: "from-purple-400 to-fuchsia-500", bgColor: "from-purple-50 to-fuchsia-50",
    tags: ["Dermatologist Tested", "Anti-Aging", "Trending"], description: "Encapsulated retinol serum for fine lines, wrinkles, and skin texture. Gentle formula.",
    uses: ["Anti-Aging", "Fine Lines", "Skin Texture", "Pigmentation"],
    prescription: false, isNew: false, isBestSeller: false, isTrending: true, inStock: true,
    packSize: "30ml", manufacturer: "CeraVe", expiryMonths: 24, sku: "RET-CER-30",
  },
  {
    id: "bty-002", name: "Hyaluronic Acid Moisturizer", brand: "The Ordinary", genericName: "Hyaluronic Acid",
    category: "Beauty", subcategory: "Moisturizers", form: "Cream",
    price: 18.99, originalPrice: 26.99, discount: 30, rating: 4.8, reviews: 19870, stock: 220,
    image: "💦", color: "from-sky-400 to-blue-500", bgColor: "from-sky-50 to-blue-50",
    tags: ["Hydrating", "All Skin Types", "Best Seller"], description: "Multi-depth hyaluronic acid with ceramides for 24-hour deep hydration.",
    uses: ["Deep Hydration", "Plumping", "Fine Lines", "Dry Skin"],
    prescription: false, isNew: false, isBestSeller: true, isTrending: false, inStock: true,
    packSize: "50ml", manufacturer: "The Ordinary", expiryMonths: 24, sku: "HA-ORD-50",
  },
];

export const CATEGORIES = ["All", "Medicines", "Vitamins", "Devices", "Baby Care", "Herbal", "Ayurvedic", "Fitness", "Beauty"] as const;
export const BRANDS = [...new Set(PRODUCTS.map((p) => p.brand))].sort();
export const FORMS = ["Tablet", "Capsule", "Syrup", "Gel", "Cream", "Drops", "Spray", "Powder", "Device", "Patch"] as const;

export interface ProductFilters {
  query: string;
  category: string;
  brands: string[];
  priceMin: number;
  priceMax: number;
  rating: number;
  forms: string[];
  inStockOnly: boolean;
  prescriptionFree: boolean;
  discountMin: number;
  sortBy: "featured" | "price_asc" | "price_desc" | "rating" | "newest" | "discount" | "popularity";
  view: "grid" | "list";
}

export const DEFAULT_FILTERS: ProductFilters = {
  query: "", category: "All", brands: [], priceMin: 0, priceMax: 200,
  rating: 0, forms: [], inStockOnly: false, prescriptionFree: false,
  discountMin: 0, sortBy: "featured", view: "grid",
};

export function filterProducts(products: Product[], filters: ProductFilters): Product[] {
  let result = [...products];

  if (filters.query) {
    const q = filters.query.toLowerCase();
    result = result.filter((p) =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.genericName?.toLowerCase().includes(q) ||
      p.subcategory.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q)) ||
      p.uses.some((u) => u.toLowerCase().includes(q))
    );
  }

  if (filters.category !== "All") {
    result = result.filter((p) => p.category === filters.category);
  }

  if (filters.brands.length > 0) {
    result = result.filter((p) => filters.brands.includes(p.brand));
  }

  result = result.filter((p) => p.price >= filters.priceMin && p.price <= filters.priceMax);

  if (filters.rating > 0) {
    result = result.filter((p) => p.rating >= filters.rating);
  }

  if (filters.forms.length > 0) {
    result = result.filter((p) => filters.forms.includes(p.form));
  }

  if (filters.inStockOnly) {
    result = result.filter((p) => p.inStock && p.stock > 0);
  }

  if (filters.prescriptionFree) {
    result = result.filter((p) => !p.prescription);
  }

  if (filters.discountMin > 0) {
    result = result.filter((p) => p.discount >= filters.discountMin);
  }

  switch (filters.sortBy) {
    case "price_asc":   result.sort((a, b) => a.price - b.price); break;
    case "price_desc":  result.sort((a, b) => b.price - a.price); break;
    case "rating":      result.sort((a, b) => b.rating - a.rating); break;
    case "newest":      result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)); break;
    case "discount":    result.sort((a, b) => b.discount - a.discount); break;
    case "popularity":  result.sort((a, b) => b.reviews - a.reviews); break;
    case "featured":
    default:
      result.sort((a, b) => ((b.isBestSeller ? 2 : 0) + (b.isTrending ? 1 : 0)) - ((a.isBestSeller ? 2 : 0) + (a.isTrending ? 1 : 0)));
  }

  return result;
}
