import { CallToAction } from "@/components/CallToAction";
import { Footer } from "@/components/Footer";

import { Hero } from "@/components/Hero";
import { ProductShowcase } from "@/components/ProductShowCase";
import { Testimonials } from "@/components/Testimonials";

export default function Home() {
  return (
    <main>
      <Hero />
      <ProductShowcase />
      <Testimonials />
      <CallToAction />
      <Footer />
    </main>
  );
}
