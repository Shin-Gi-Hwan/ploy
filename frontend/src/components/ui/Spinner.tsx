import { useTranslation } from 'react-i18next'

type SpinnerSize = 'sm' | 'md' | 'lg'

interface SpinnerProps {
  size?: SpinnerSize
  fullPage?: boolean
  label?: string
}

export default function Spinner({ size = 'md', fullPage = false, label }: SpinnerProps) {
  const { t } = useTranslation()
  const ariaLabel = label ?? t('common.loading')

  const el = (
    <div
      role="status"
      aria-label={ariaLabel}
      className={`spinner spinner-${size}`}
    />
  )

  if (fullPage) {
    return (
      <div className="spinner-page" aria-busy="true">
        {el}
      </div>
    )
  }

  return el
}
