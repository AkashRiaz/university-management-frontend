import { Button } from "@/components/ui/button";
import Hero from "./_components/HomePage/hero/Hero";
import StatsSection from "./_components/HomePage/StatsSection";
import FeaturesSection from "./_components/HomePage/FeaturesSection";
import HowItWorks from "./_components/HomePage/HowItWorks";
import RolesSection from "./_components/HomePage/RolesSection";
import CTASection from "./_components/HomePage/CTASection";
import StudentExperience from "./_components/HomePage/StudentExperience";
import CampusPreview from "./_components/HomePage/campus/CampusPreview";

export default function Home() {
  return (
     <main className="min-h-screen">
      <Hero />
      <StatsSection />
      <FeaturesSection />
      <HowItWorks />
      <StudentExperience />
      <RolesSection />
      <CampusPreview />
      <CTASection />
    </main>
  );
}
