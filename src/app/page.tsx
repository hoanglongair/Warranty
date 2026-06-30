import { HeroSection } from "@/components/sections/hero-section";
import { HowItWorks } from "@/components/sections/how-it-works";
import { CategoriesSection } from "@/components/sections/categories-section";
import { FeaturedJobs } from "@/components/sections/featured-jobs";
import { FeaturedFreelancers } from "@/components/sections/featured-freelancers";
import { BenefitsSection } from "@/components/sections/benefits-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { FAQSection } from "@/components/sections/faq-section";
import { CTASection } from "@/components/sections/cta-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <HowItWorks />
      <CategoriesSection />
      <FeaturedJobs />
      <FeaturedFreelancers />
      <BenefitsSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
    </>
  );
}
