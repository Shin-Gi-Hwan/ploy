import { motion } from 'framer-motion'

interface AuthLayoutProps {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 20px',
        backgroundColor: '#f7f8f7',
        colorScheme: 'light',           // force light mode — no system dark override
      }}
    >
      {/* Faint mint accent blobs */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          background: `
            radial-gradient(ellipse 60% 50% at 90% 5%,  rgba(61,217,179,0.09) 0%, transparent 60%),
            radial-gradient(ellipse 50% 45% at 10% 92%, rgba(61,217,179,0.06) 0%, transparent 60%)
          `,
        }}
      />

      {/* Card */}
      <motion.div
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: 400,
          backgroundColor: '#ffffff',
          border: '1px solid #e4e9e4',
          borderRadius: 20,
          padding: '40px 36px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.04), 0 12px 40px rgba(0,0,0,0.06)',
        }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {children}
      </motion.div>
    </div>
  )
}
