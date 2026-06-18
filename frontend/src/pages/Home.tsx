import Layout from '../components/layout/Layout'
import HeroSection from '../components/home/HeroSection'
import HowItWorksSection from '../components/home/HowItWorksSection'
import ServicesSection from '../components/home/ServicesSection'
import ReviewMarquee from '../components/home/ReviewMarquee'
import PortfolioShowcase from '../components/home/PortfolioShowcase'
import FaqSection from '../components/home/FaqSection'
import CtaSection from '../components/home/CtaSection'
import { MOCK_PORTFOLIO } from '../lib/mock'

export default function Home() {
  return (
    <Layout>
      <HeroSection />
      <PortfolioShowcase items={MOCK_PORTFOLIO} />
      {/* realReviews omitted — component fills with Korean placeholder reviews */}
      <ReviewMarquee />
      <ServicesSection />
      <HowItWorksSection />
      <CtaSection />
      <FaqSection />
    </Layout>
  )
}
