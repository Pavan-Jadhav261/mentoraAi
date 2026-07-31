import NavPill from '@/components/nav-pill'
import SiteFooter from '@/components/site-footer'
import HeroSection from '@/components/landing/hero-section'
import FeaturesSection from '@/components/landing/features-section'
import HowItWorks from '@/components/landing/how-it-works'
import CtaBand from '@/components/landing/cta-band'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavPill />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorks />
        <CtaBand />
      </main>
      <SiteFooter />
    </div>
  )
}
