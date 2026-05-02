import { PRODUCTS } from "./products";

export interface SearchSuggestion {
  type: "product" | "brand" | "category" | "condition" | "trending";
  text: string;
  subtitle?: string;
  icon?: string;
  productId?: string;
  price?: number;
  discount?: number;
}

export interface SearchResult {
  suggestions: SearchSuggestion[];
  didYouMean?: string;
  totalResults: number;
}

const TYPO_CORRECTIONS: Record<string, string> = {
  "parasetamol": "paracetamol", "paraceatmol": "paracetamol", "parcetamol": "paracetamol",
  "ibuprofin": "ibuprofen", "ibuprufen": "ibuprofen",
  "amoxicilin": "amoxicillin", "amoxicillan": "amoxicillin",
  "omeprazal": "omeprazole", "omeprazol": "omeprazole",
  "metformine": "metformin", "metfromin": "metformin",
  "vitamine": "vitamin", "vitamins d": "vitamin d",
  "omega3": "omega-3", "omega 3": "omega-3",
  "ashwangandha": "ashwagandha", "ashwaganda": "ashwagandha",
  "probiotics": "probiotic", "prebiotic": "probiotic",
  "cetirizin": "cetirizine", "cetrizine": "cetirizine",
  "azithromicin": "azithromycin",
};

const TRENDING_SEARCHES = [
  "Vitamin D3", "Omega-3", "Paracetamol", "Ashwagandha", "Probiotic",
  "Blood Pressure Monitor", "Collagen", "Multivitamin", "Protein Powder", "Cetirizine",
];

const CONDITION_MAP: Record<string, string[]> = {
  "cold": ["Paracetamol", "Cetirizine"],
  "fever": ["Paracetamol", "Ibuprofen"],
  "headache": ["Paracetamol", "Ibuprofen"],
  "allergy": ["Cetirizine"],
  "diabetes": ["Metformin", "Glucometer Starter Kit"],
  "blood pressure": ["Digital Blood Pressure Monitor", "Atorvastatin"],
  "sleep": ["Magnesium Glycinate", "Ashwagandha"],
  "immunity": ["Vitamin C", "Vitamin D3", "Probiotic"],
  "pain": ["Ibuprofen", "Paracetamol", "Diclofenac"],
  "acidity": ["Omeprazole"],
  "anxiety": ["Ashwagandha", "Magnesium Glycinate"],
  "hair loss": ["Biotin", "Collagen Peptides"],
  "weight loss": ["Whey Protein", "Creatine"],
  "skin": ["Retinol", "Hyaluronic Acid", "Collagen"],
  "asthma": ["Salbutamol Inhaler"],
  "cholesterol": ["Atorvastatin", "Omega-3"],
};

function correctTypo(query: string): string | undefined {
  const lower = query.toLowerCase().trim();
  return TYPO_CORRECTIONS[lower];
}

function scoreMatch(text: string, query: string): number {
  const t = text.toLowerCase();
  const q = query.toLowerCase();
  if (t === q) return 100;
  if (t.startsWith(q)) return 90;
  if (t.includes(q)) return 70;
  if (q.split(" ").every((w) => t.includes(w))) return 60;
  return 0;
}

export function getSearchSuggestions(query: string): SearchResult {
  const q = query.trim();

  if (!q || q.length < 2) {
    return {
      suggestions: TRENDING_SEARCHES.slice(0, 6).map((text) => ({
        type: "trending", text, icon: "🔥",
      })),
      totalResults: 0,
    };
  }

  const corrected = correctTypo(q);
  const effectiveQuery = corrected || q;

  const productSuggestions: SearchSuggestion[] = [];
  const brandSet = new Set<string>();
  const categorySet = new Set<string>();

  for (const p of PRODUCTS) {
    const score = Math.max(
      scoreMatch(p.name, effectiveQuery),
      scoreMatch(p.brand, effectiveQuery),
      scoreMatch(p.genericName || "", effectiveQuery),
      scoreMatch(p.subcategory, effectiveQuery),
      p.tags.reduce((max, t) => Math.max(max, scoreMatch(t, effectiveQuery)), 0),
      p.uses.reduce((max, u) => Math.max(max, scoreMatch(u, effectiveQuery)), 0)
    );

    if (score >= 60) {
      productSuggestions.push({
        type: "product",
        text: p.name,
        subtitle: `${p.brand} · ${p.form} · $${p.price}`,
        icon: p.image,
        productId: p.id,
        price: p.price,
        discount: p.discount,
      });
    }

    if (scoreMatch(p.brand, effectiveQuery) >= 70) brandSet.add(p.brand);
    if (scoreMatch(p.category, effectiveQuery) >= 70) categorySet.add(p.category);
  }

  const conditionSuggestions: SearchSuggestion[] = [];
  for (const [condition, medicines] of Object.entries(CONDITION_MAP)) {
    if (condition.includes(effectiveQuery.toLowerCase()) || effectiveQuery.toLowerCase().includes(condition)) {
      conditionSuggestions.push({
        type: "condition",
        text: `${condition.charAt(0).toUpperCase() + condition.slice(1)} medicines`,
        subtitle: medicines.slice(0, 3).join(", "),
        icon: "🩺",
      });
    }
  }

  const suggestions: SearchSuggestion[] = [
    ...productSuggestions.slice(0, 5),
    ...Array.from(brandSet).slice(0, 2).map((b) => ({
      type: "brand" as const, text: b, subtitle: "Brand", icon: "🏷️",
    })),
    ...Array.from(categorySet).slice(0, 2).map((c) => ({
      type: "category" as const, text: c, subtitle: "Category", icon: "📂",
    })),
    ...conditionSuggestions.slice(0, 2),
  ].slice(0, 8);

  return {
    suggestions,
    didYouMean: corrected,
    totalResults: productSuggestions.length,
  };
}
