"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Clock, User, ChevronRight, Search, Tag, TrendingUp,
  Heart, Shield, Apple, Brain, Stethoscope, Leaf,
  BookOpen, ArrowRight, Sparkles, Mail, Rss
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { cn } from "@/lib/utils";

/* ─── Types ─── */
interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  authorRole: string;
  date: string;
  readTime: number;
  emoji: string;
  bgGradient: string;
  cardColor: string;
  featured?: boolean;
  tags: string[];
}

/* ─── Article data ─── */
const ARTICLES: Article[] = [
  {
    id: "immunity-boost",
    title: "10 Foods That Naturally Boost Your Immunity",
    excerpt: "From citrus fruits to garlic, nature provides us with powerful tools to strengthen our immune response. Discover the science-backed foods that can help keep you healthy year-round.",
    category: "Wellness",
    author: "Dr. Priya Sharma",
    authorRole: "Nutrition & Wellness Specialist",
    date: "Apr 28, 2025",
    readTime: 5,
    emoji: "🍊",
    bgGradient: "from-orange-400 to-amber-500",
    cardColor: "from-orange-50 to-amber-50",
    featured: true,
    tags: ["Nutrition", "Immunity", "Diet"],
  },
  {
    id: "prescription-guide",
    title: "Understanding Your Prescription: A Patient's Complete Guide",
    excerpt: "Medical jargon can be intimidating. This guide breaks down every symbol, abbreviation, and instruction you'll find on a prescription — so you never have to guess again.",
    category: "Pharmacy",
    author: "PharmD. Rajesh Kumar",
    authorRole: "Chief Pharmacist",
    date: "Apr 24, 2025",
    readTime: 4,
    emoji: "💊",
    bgGradient: "from-blue-400 to-cyan-500",
    cardColor: "from-blue-50 to-cyan-50",
    tags: ["Pharmacy", "Medicine", "Safety"],
  },
  {
    id: "vitamin-d",
    title: "The Silent Epidemic: Vitamin D Deficiency and How to Fix It",
    excerpt: "Over 1 billion people worldwide are vitamin D deficient. Learn the surprising signs, risks, and proven strategies to restore healthy levels without over-supplementation.",
    category: "Nutrition",
    author: "Dr. Sarah Chen",
    authorRole: "Endocrinologist",
    date: "Apr 21, 2025",
    readTime: 6,
    emoji: "☀️",
    bgGradient: "from-yellow-400 to-orange-400",
    cardColor: "from-yellow-50 to-orange-50",
    tags: ["Vitamins", "Bone Health", "Supplements"],
  },
  {
    id: "diabetes-management",
    title: "Managing Type 2 Diabetes: Beyond Medication",
    excerpt: "Lifestyle interventions can be as powerful as medication for Type 2 diabetes management. Explore the evidence-based strategies that are transforming patient outcomes.",
    category: "Disease Management",
    author: "Dr. Michael Torres",
    authorRole: "Diabetologist",
    date: "Apr 18, 2025",
    readTime: 8,
    emoji: "🩸",
    bgGradient: "from-rose-400 to-pink-500",
    cardColor: "from-rose-50 to-pink-50",
    tags: ["Diabetes", "Lifestyle", "Blood Sugar"],
  },
  {
    id: "anxiety-awareness",
    title: "Recognizing Anxiety: When Worry Becomes a Medical Issue",
    excerpt: "We all experience worry, but when does it cross the line into an anxiety disorder? A mental health expert explains the key differences and when to seek professional help.",
    category: "Mental Health",
    author: "Dr. Aisha Williams",
    authorRole: "Psychiatrist",
    date: "Apr 15, 2025",
    readTime: 7,
    emoji: "🧠",
    bgGradient: "from-violet-400 to-purple-500",
    cardColor: "from-violet-50 to-purple-50",
    tags: ["Mental Health", "Anxiety", "Wellness"],
  },
  {
    id: "medication-storage",
    title: "Are You Storing Your Medications Correctly?",
    excerpt: "Improper storage can reduce the effectiveness of your medications — or worse, make them harmful. Learn the golden rules of safe medication storage at home.",
    category: "Pharmacy",
    author: "PharmD. Lisa Park",
    authorRole: "Clinical Pharmacist",
    date: "Apr 12, 2025",
    readTime: 3,
    emoji: "🗄️",
    bgGradient: "from-teal-400 to-green-500",
    cardColor: "from-teal-50 to-green-50",
    tags: ["Storage", "Safety", "Pharmacy"],
  },
  {
    id: "probiotics",
    title: "The Power of Probiotics: Gut Health and Beyond",
    excerpt: "New research is revealing that the trillions of bacteria in your gut influence far more than digestion — from mental health to immunity. Here's what the science actually says.",
    category: "Nutrition",
    author: "Dr. Priya Sharma",
    authorRole: "Nutrition & Wellness Specialist",
    date: "Apr 9, 2025",
    readTime: 5,
    emoji: "🦠",
    bgGradient: "from-green-400 to-emerald-500",
    cardColor: "from-green-50 to-emerald-50",
    tags: ["Gut Health", "Probiotics", "Microbiome"],
  },
  {
    id: "heart-health",
    title: "Heart Health at Any Age: Prevention Is Your Best Medicine",
    excerpt: "Cardiovascular disease remains the world's leading cause of death — but up to 80% of cases are preventable. Here's your age-by-age guide to protecting your heart.",
    category: "Wellness",
    author: "Dr. David Nguyen",
    authorRole: "Cardiologist",
    date: "Apr 5, 2025",
    readTime: 6,
    emoji: "❤️",
    bgGradient: "from-red-400 to-rose-500",
    cardColor: "from-red-50 to-rose-50",
    tags: ["Heart", "Prevention", "Cardiology"],
  },
];

const CATEGORIES = [
  { name: "All",               icon: Rss,          color: "text-gray-600"    },
  { name: "Wellness",          icon: Heart,         color: "text-rose-500"    },
  { name: "Nutrition",         icon: Apple,         color: "text-green-500"   },
  { name: "Pharmacy",          icon: Stethoscope,   color: "text-blue-500"    },
  { name: "Disease Management",icon: Shield,        color: "text-orange-500"  },
  { name: "Mental Health",     icon: Brain,         color: "text-violet-500"  },
];

/* ─── Article card ─── */
function ArticleCard({ article: a, index = 0 }: { article: Article; index?: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
    >
      {/* Thumbnail */}
      <Link href={`/blog/${a.id}`} className="block">
        <div className={`h-40 bg-gradient-to-br ${a.cardColor} flex items-center justify-center relative overflow-hidden`}>
          <div className={`absolute inset-0 bg-gradient-to-br ${a.bgGradient} opacity-10`} />
          <motion.span
            className="text-6xl relative z-10 select-none"
            whileHover={{ scale: 1.15, y: -4 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {a.emoji}
          </motion.span>
          <div className="absolute top-3 left-3">
            <span className={cn(
              "text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/80 backdrop-blur-sm",
              "text-gray-700"
            )}>
              {a.category}
            </span>
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <Link href={`/blog/${a.id}`}>
          <h3 className="font-black text-gray-900 text-sm leading-snug line-clamp-2 group-hover:text-green-700 transition-colors mb-2">
            {a.title}
          </h3>
        </Link>
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-3 flex-1">{a.excerpt}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {a.tags.slice(0, 2).map(tag => (
            <span key={tag} className="text-[9px] font-semibold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{tag}</span>
          ))}
        </div>

        {/* Meta */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
          <div className="flex items-center gap-2 min-w-0">
            <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${a.bgGradient} flex items-center justify-center text-white text-xs font-black flex-shrink-0`}>
              {a.author[0]}
            </div>
            <span className="text-xs text-gray-600 truncate font-medium">{a.author.split(" ")[0]} {a.author.split(" ")[1]}</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-gray-400 flex-shrink-0">
            <Clock size={10} />
            <span>{a.readTime} min</span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

/* ─── Featured article ─── */
function FeaturedArticle({ article: a }: { article: Article }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group bg-white rounded-3xl border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-400 overflow-hidden"
    >
      <div className="grid md:grid-cols-2">
        {/* Image */}
        <Link href={`/blog/${a.id}`} className="block relative">
          <div className={`h-72 md:h-full min-h-[280px] bg-gradient-to-br ${a.cardColor} flex items-center justify-center relative overflow-hidden`}>
            <div className={`absolute inset-0 bg-gradient-to-br ${a.bgGradient} opacity-15`} />
            <motion.span
              className="text-9xl relative z-10 select-none"
              animate={{ y: [-4, 4, -4] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              {a.emoji}
            </motion.span>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            <div className="absolute bottom-4 left-4">
              <span className="text-[10px] font-black text-white/90 uppercase tracking-widest flex items-center gap-1.5 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <Sparkles size={10} /> Featured
              </span>
            </div>
          </div>
        </Link>

        {/* Content */}
        <div className="p-8 flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-xs font-bold text-green-600 uppercase tracking-widest">{a.category}</span>
            <Link href={`/blog/${a.id}`}>
              <h2 className="text-2xl font-black text-gray-900 leading-snug group-hover:text-green-700 transition-colors">{a.title}</h2>
            </Link>
            <p className="text-gray-500 leading-relaxed">{a.excerpt}</p>
            <div className="flex flex-wrap gap-2">
              {a.tags.map(tag => (
                <span key={tag} className="text-xs font-semibold bg-green-50 text-green-700 border border-green-100 px-3 py-1 rounded-full">{tag}</span>
              ))}
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${a.bgGradient} flex items-center justify-center text-white font-black`}>
                {a.author[0]}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{a.author}</p>
                <p className="text-xs text-gray-400">{a.authorRole}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span className="flex items-center gap-1"><Clock size={11} /> {a.readTime} min read</span>
                <span className="flex items-center gap-1"><User size={11} /> {a.date}</span>
              </div>
              <Link
                href={`/blog/${a.id}`}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-green-500 to-teal-500 text-white text-sm font-bold hover:shadow-lg hover:shadow-green-200 transition-all"
              >
                Read More <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

/* ─── Page ─── */
export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const featured = ARTICLES.find(a => a.featured);
  const filtered = ARTICLES.filter(a => {
    const matchCat = activeCategory === "All" || a.category === activeCategory;
    const matchSearch = !searchQuery || a.title.toLowerCase().includes(searchQuery.toLowerCase()) || a.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchSearch && !a.featured;
  });

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar />

      {/* Hero */}
      <div className="bg-gradient-to-br from-green-50 via-teal-50 to-cyan-50 border-b border-green-100">
        <div className="max-w-3xl mx-auto px-4 py-14 sm:py-20 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center shadow-lg shadow-green-200">
                <BookOpen size={20} className="text-white" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-3">
              MediCart{" "}
              <span className="bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">Health Blog</span>
            </h1>
            <p className="text-gray-500 text-lg max-w-xl mx-auto mb-8">
              Evidence-based health insights from doctors, pharmacists, and wellness experts — written for real patients.
            </p>

            {/* Search */}
            <div className="relative max-w-md mx-auto">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search articles, topics..."
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white border-2 border-gray-100 focus:border-green-400 outline-none text-sm shadow-sm transition-all"
              />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-10 xl:px-14 py-10">
        {/* Category tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <motion.button
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0",
                activeCategory === cat.name
                  ? "bg-green-500 text-white shadow-md shadow-green-200"
                  : "bg-white border border-gray-100 text-gray-600 hover:border-green-200 hover:text-green-600"
              )}
            >
              <cat.icon size={14} className={activeCategory === cat.name ? "text-white" : cat.color} />
              {cat.name}
            </motion.button>
          ))}
        </div>

        {/* Featured */}
        {activeCategory === "All" && !searchQuery && featured && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={16} className="text-green-500" />
              <h2 className="text-lg font-black text-gray-900">Featured Article</h2>
            </div>
            <FeaturedArticle article={featured} />
          </div>
        )}

        {/* Articles grid */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Tag size={15} className="text-gray-400" />
              <h2 className="text-lg font-black text-gray-900">
                {searchQuery ? `Results for "${searchQuery}"` : activeCategory === "All" ? "Latest Articles" : activeCategory}
              </h2>
              <span className="text-sm text-gray-400">({filtered.length})</span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {filtered.length === 0 ? (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                <BookOpen size={40} className="text-gray-200 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No articles found.</p>
                <button onClick={() => { setSearchQuery(""); setActiveCategory("All"); }} className="mt-4 text-sm text-green-600 font-semibold hover:underline">
                  Clear filters
                </button>
              </motion.div>
            ) : (
              <motion.div key="grid" className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filtered.map((a, i) => <ArticleCard key={a.id} article={a} index={i} />)}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Newsletter CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 relative overflow-hidden rounded-3xl bg-gradient-to-r from-gray-900 to-gray-800 p-8 sm:p-12 text-center text-white shadow-2xl"
        >
          <div className="absolute inset-0 opacity-5">
            {Array.from({ length: 20 }, (_, i) => <div key={i} className="absolute w-8 h-8 rounded-full bg-white" style={{ left: `${i * 6}%`, top: `${(i % 4) * 30}%` }} />)}
          </div>
          <div className="relative z-10">
            <Mail size={28} className="mx-auto mb-3 text-green-400" />
            <h2 className="text-2xl sm:text-3xl font-black mb-2">Stay Informed. Stay Healthy.</h2>
            <p className="text-gray-400 mb-6 max-w-md mx-auto text-sm">
              Get expert health articles, medicine guides, and wellness tips delivered to your inbox every week.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-5 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:bg-white/20 transition-all text-sm backdrop-blur-sm"
              />
              <button className="px-6 py-3 rounded-2xl bg-gradient-to-r from-green-500 to-teal-500 text-white font-black text-sm hover:shadow-lg hover:shadow-green-900/30 transition-all flex items-center gap-2 justify-center">
                <Leaf size={15} /> Subscribe Free
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-3">No spam · Unsubscribe anytime · Written by real doctors</p>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
