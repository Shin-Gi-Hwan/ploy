// Mock data for the Review Marquee.
// When the backend review API is ready, replace this with an API call
// in ReviewMarquee.tsx — the component interface stays identical.

export interface Review {
  id: number
  author: string
  role: string
  service: string
  text: string
  rating: 5 | 4 | 3
}

export const MOCK_REVIEWS: Review[] = [
  {
    id: 1,
    author: 'Sarah K.',
    role: 'Yoga Studio Owner',
    service: 'Business Card',
    text: 'I sent over a few Pinterest boards and got back something I actually felt proud to hand out. Three days, start to finish.',
    rating: 5,
  },
  {
    id: 2,
    author: 'Daniel P.',
    role: 'Co-founder, NovaSeed',
    service: 'Presentation',
    text: 'Our pitch deck was holding us back. The new one got us three follow-up meetings in a single week.',
    rating: 5,
  },
  {
    id: 3,
    author: 'Marcus L.',
    role: 'Freelance Photographer',
    service: 'Website',
    text: 'Clean, fast, and exactly my style. No back-and-forth guesswork — they just nailed it.',
    rating: 5,
  },
  {
    id: 4,
    author: 'Priya M.',
    role: 'UX Consultant',
    service: 'Presentation',
    text: 'Turned my rough notes into a polished deck I was proud to present at a conference. Highly recommend.',
    rating: 5,
  },
  {
    id: 5,
    author: 'James R.',
    role: 'Real Estate Agent',
    service: 'Business Card',
    text: "Everyone asks where I got my card made. The quality difference is immediately obvious.",
    rating: 5,
  },
  {
    id: 6,
    author: 'Lena T.',
    role: 'Independent Coach',
    service: 'Website',
    text: "I'd been putting off building a site for two years. Ploy had it done in a week and it looks better than I imagined.",
    rating: 5,
  },
  {
    id: 7,
    author: 'Chris W.',
    role: 'Product Manager',
    service: 'Presentation',
    text: 'Used it for an internal proposal. Got approved first try. The visuals made all the difference.',
    rating: 5,
  },
  {
    id: 8,
    author: 'Aiko N.',
    role: 'Fashion Designer',
    service: 'Business Card',
    text: 'The card reflects my brand perfectly. Minimal, luxe, and unforgettable.',
    rating: 5,
  },
  {
    id: 9,
    author: 'Tom B.',
    role: 'SaaS Founder',
    service: 'Presentation',
    text: 'Investor deck looked amateur before. This version closed our pre-seed. Worth every penny.',
    rating: 5,
  },
  {
    id: 10,
    author: 'Rachel G.',
    role: 'Interior Designer',
    service: 'Website',
    text: 'My portfolio site now converts inquiries I used to miss. Clean design = client confidence.',
    rating: 5,
  },
]
