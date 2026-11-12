import Hero from "./_components/HomePage/hero/Hero";
import StatsSection from "./_components/HomePage/StatsSection";
import FeaturesSection from "./_components/HomePage/FeaturesSection";
import HowItWorks from "./_components/HomePage/HowItWorks";
import RolesSection from "./_components/HomePage/RolesSection";
import CTASection from "./_components/HomePage/CTASection";
import StudentExperience from "./_components/HomePage/StudentExperience";
import CampusPreview from "./_components/HomePage/campus/CampusPreview";
import NewsTicker from "./_components/HomePage/NewsTicker";
import HeritageBand from "./_components/HomePage/HeritageBand";
import CampusGallery from "./_components/HomePage/CampusGallery";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <NewsTicker />
      <StatsSection />
      <HeritageBand />
      <CampusGallery />
      <FeaturesSection />
      <HowItWorks />
      <StudentExperience />
      <RolesSection />
      <CampusPreview />
      <CTASection />
    </main>
  );
}
