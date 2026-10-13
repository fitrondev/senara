import { FeaturesStepsSection } from "@/components/landing/features-steps-section";
import { HeroSection } from "@/components/landing/hero-section";
import { TemplatesPricingSection } from "@/components/landing/templates-pricing-section";
import { TestimonialsFaqSection } from "@/components/landing/testimonials-faq-section";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <FeaturesStepsSection />
      <TemplatesPricingSection />
      <TestimonialsFaqSection />
    </div>
  );
}
