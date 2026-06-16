type SpinnerSize = 'sm' | 'md' | 'lg'

interface SpinnerProps {
  size?: SpinnerSize
  fullPage?: boolean
  label?: string
}

export default function Spinner({ size = 'md', fullPage = false, label = 'Loading…' }: SpinnerProps) {
  const el = (
    <div
      role="status"
      aria-label={label}
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
