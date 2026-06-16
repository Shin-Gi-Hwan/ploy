import Layout from '../components/layout/Layout'
import HeroSection from '../components/home/HeroSection'
import HowItWorksSection from '../components/home/HowItWorksSection'
import ServicesSection from '../components/home/ServicesSection'
import ReviewMarquee from '../components/home/ReviewMarquee'
import CtaSection from '../components/home/CtaSection'
import { MOCK_REVIEWS } from '../lib/mock'

export default function Home() {
  return (
    <Layout>
      <HeroSection />
      <HowItWorksSection />
      <ServicesSection />
      {/* Pass MOCK_REVIEWS now; swap for API data later without changing ReviewMarquee */}
      <ReviewMarquee reviews={MOCK_REVIEWS} />
      <CtaSection />
    </Layout>
  )
}
