import type { Review } from '../../lib/mock'

interface ReviewMarqueeProps {
  reviews: Review[]
}

// Duplicate reviews for seamless infinite loop
function buildRows(reviews: Review[]) {
  const doubled = [...reviews, ...reviews]
  const mid = Math.ceil(doubled.length / 2)
  return {
    row1: doubled.slice(0, mid),
    row2: doubled.slice(mid),
  }
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="review-stars" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 14 14" fill={i < rating ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1" aria-hidden="true">
          <path d="M7 1l1.545 3.13 3.455.502-2.5 2.437.59 3.44L7 8.885 3.91 10.51l.59-3.44L2 4.632l3.455-.502L7 1z" />
        </svg>
      ))}
    </div>
  )
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="review-card" aria-label={`Review by ${review.author}`}>
      <StarRating rating={review.rating} />
      <p className="review-text">"{review.text}"</p>
      <footer className="review-footer">
        <span className="review-author">{review.author}</span>
        <span className="review-meta">{review.role}</span>
        <span className="review-service-badge">{review.service}</span>
      </footer>
    </article>
  )
}

export default function ReviewMarquee({ reviews }: ReviewMarqueeProps) {
  const { row1, row2 } = buildRows(reviews)

  return (
    <section id="reviews" className="reviews" aria-labelledby="reviews-title">
      <div className="container" style={{ marginBottom: 'var(--space-10)' }}>
        <div className="section-header" style={{ marginBottom: 0 }}>
          <span className="section-label">Reviews</span>
          <h2 id="reviews-title" className="section-title">
            What clients say
          </h2>
          <p className="section-desc">
            Real feedback from freelancers and business owners who've worked with us.
          </p>
        </div>
      </div>

      {/* Row 1 — left to right */}
      <div className="marquee-container" aria-hidden="true">
        <div className="marquee-track row-1">
          {row1.map((r, i) => <ReviewCard key={`r1-${r.id}-${i}`} review={r} />)}
        </div>
      </div>

      {/* Row 2 — right to left */}
      <div className="marquee-container" aria-hidden="true" style={{ marginTop: 'var(--space-5)' }}>
        <div className="marquee-track row-2">
          {row2.map((r, i) => <ReviewCard key={`r2-${r.id}-${i}`} review={r} />)}
        </div>
      </div>
    </section>
  )
}
