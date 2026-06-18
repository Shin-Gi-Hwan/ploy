import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion } from 'framer-motion'

interface FaqItem {
  q: string
  a: string
}

function FaqRow({ item, index }: { item: FaqItem; index: number }) {
  const [open, setOpen] = useState(false)

  return (
    <div className={`faq-item${open ? ' open' : ''}`}>
      <button
        className="faq-question"
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
      >
        <span>{item.q}</span>
        <span className={`faq-chevron${open ? ' rotated' : ''}`} aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key={`faq-answer-${index}`}
            className="faq-answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ overflow: 'hidden' }}
          >
            <div className="faq-answer-inner">{item.a}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FaqSection() {
  const { t } = useTranslation()

  const items: FaqItem[] = t('faq.items', { returnObjects: true }) as FaqItem[]

  return (
    <section id="faq" className="faq-section" aria-labelledby="faq-title">
      <div className="container">
        <div className="section-header">
          <span className="section-label">{t('faq.label')}</span>
          <h2 id="faq-title" className="section-title">{t('faq.title')}</h2>
          <p className="section-desc">{t('faq.subtitle')}</p>
        </div>

        <div className="faq-list">
          {items.map((item, i) => (
            <FaqRow key={i} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
