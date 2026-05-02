import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Categories from "@/components/sections/Categories";
import TrendingMedicines from "@/components/sections/TrendingMedicines";
import TrustBadges from "@/components/sections/TrustBadges";
import Stats from "@/components/sections/Stats";
import Testimonials from "@/components/sections/Testimonials";
import Newsletter from "@/components/sections/Newsletter";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Categories />
      <TrendingMedicines />
      <TrustBadges />
      <Stats />
      <Testimonials />
      <Newsletter />
      <Footer />
    </main>
  );
}
