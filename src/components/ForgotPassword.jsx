import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

const ForgotPassword = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('https://case-bud-backend-bzgqfka6daeracaj.centralus-01.azurewebsites.net/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (response.ok) {
        setIsSuccess(true)
        localStorage.setItem('resetPasswordEmail', email)
        // Show success message for 2 seconds before redirecting
        setTimeout(() => {
          navigate('/reset-password', { 
            state: { 
              email,
              requestSent: true // Flag to indicate first step is complete
            }
          })
        }, 2000)
      } else {
        setError(data.message || 'Failed to initiate password reset')
      }
    } catch (err) {
      setError('Network error. Please check your connection.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0E0E0E] flex items-center justify-center">
      <div className="bg-[#181818] p-8 rounded-lg w-96">
        <h2 className="text-2xl text-white mb-6 text-center">Reset Password</h2>
        {!isSuccess ? (
          <>
            <p className="text-gray-400 text-center mb-6">
              Enter your email address to receive password reset instructions
            </p>
            {error && (
              <div className="bg-red-500 text-white p-3 rounded mb-4 text-center text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Email"
                className="w-full bg-[#201f1f] text-white p-3 rounded mb-6"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                className="w-full bg-green-500 text-white p-3 rounded hover:bg-green-600 mb-4 flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                ) : null}
                {isLoading ? 'Sending...' : 'Send Reset Instructions'}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <div className="text-green-500 text-5xl mb-4">✓</div>
            <p className="text-white mb-6">
              Reset instructions sent! Please check your email.
            </p>
            <p className="text-gray-400 mb-6 text-sm">
              Don't forget to check your spam folder if you don't see the email.
            </p>
          </div>
        )}
        <p className="text-white text-center">
          <Link to="/login" className="text-green-500 hover:text-green-400">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default ForgotPassword
