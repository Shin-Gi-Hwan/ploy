/**
 * AuthLayout
 * Clean SaaS auth shell — cream/mint gradient, no photos or decorations.
 * Used by: Login, Register, ForgotPassword, ResetPassword, Invite, etc.
 */

import { motion } from 'framer-motion'

interface AuthLayoutProps {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div
      className="
        min-h-screen flex items-center justify-center px-5 py-12
        bg-[#f5f8f5]
        dark:bg-[#0c0f0c]
      "
    >
      {/* Very faint mint blobs — brand color in background, barely perceptible */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0"
        style={{
          background: `
            radial-gradient(ellipse 55% 55% at 88% 8%,  rgba(61,217,179,0.07) 0%, transparent 60%),
            radial-gradient(ellipse 45% 45% at 12% 90%, rgba(61,217,179,0.05) 0%, transparent 58%)
          `,
        }}
      />

      {/* Form column */}
      <motion.div
        className="relative z-10 w-full max-w-[400px]"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* Card */}
        <div
          className="
            w-full rounded-2xl px-9 py-10
            bg-white border border-[#e6eae6]
            dark:bg-[#161b16] dark:border-[#252e25]
          "
          style={{
            boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.05)',
          }}
        >
          {children}
        </div>
      </motion.div>
    </div>
  )
}
