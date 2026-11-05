import React, { useState } from 'react'
import { FiCheck, FiCreditCard, FiClock, FiZap } from 'react-icons/fi'

const ServerUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:8000'

const PLANS = [
  {
    name: 'Free',
    price: '₹0',
    description: 'For trying out your AI assistant.',
    features: [
      'Basic AI assistant',
      'Limited messages',
      'Basic customization',
      'Website embedding'
    ],
    button: 'Current Plan',
    popular: false
  },
  {
    name: 'Pro',
    price: '₹599',
    period: '/90 days',
    description: 'For growing businesses and websites.',
    features: [
      'Higher message limits',
      'Custom assistant themes',
      'Website navigation support',
      'Priority AI responses',
      'Advanced customization'
    ],
    button: 'Upgrade to Pro',
    popular: true
  },
  {
    name: 'Business',
    price: '₹999',
    period: '/month',
    description: 'For businesses with higher usage.',
    features: [
      'Higher usage limits',
      'Custom assistant branding',
      'Advanced customization',
      'Business-focused support',
      'All Pro features'
    ],
    button: 'Coming Soon',
    popular: false,
    unavailable: true
  }
]

function Billing({ user }) {
  const [loading, setLoading] = useState(false)

  const currentPlan = (user?.plan || 'free').toLowerCase()
  const requestLimit = user?.requestLimit || 0
  const totalMessages = user?.totalMessages || 0

  const remainingMessages = Math.max(0, requestLimit - totalMessages)

  const usagePercentage = requestLimit > 0
    ? Math.min(100, (totalMessages / requestLimit) * 100)
    : 0

  const remainingDays = user?.proExpiresAt
    ? Math.max(
        0,
        Math.ceil(
          (new Date(user.proExpiresAt) - new Date()) /
          (1000 * 60 * 60 * 24)
        )
      )
    : 0

  // Load Razorpay Checkout
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true)
        return
      }

      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'

      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)

      document.body.appendChild(script)
    })
  }

  const handlePlanSelect = async (plan) => {
    if (
      loading ||
      plan.unavailable ||
      plan.name.toLowerCase() === currentPlan
    ) {
      return
    }

    if (plan.name.toLowerCase() !== 'pro') {
      return
    }

    setLoading(true)

    try {
      // Load Razorpay Checkout
      const loaded = await loadRazorpay()

      if (!loaded) {
        throw new Error('Unable to load Razorpay Checkout')
      }

      // Create an order through your backend
      const orderResponse = await fetch(`${ServerUrl}/api/billing/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ plan: 'pro' })
      })

      const orderData = await orderResponse.json()

      if (!orderResponse.ok || !orderData.success) {
        throw new Error(orderData.message || 'Unable to create payment order')
      }

      const order = orderData.order

      const key = import.meta.env.VITE_RAZORPAY_KEY_ID

      if (!key) {
        throw new Error('Razorpay key is missing from frontend environment variables')
      }

      // Open Razorpay Checkout
      const options = {
        key,
        amount: order.amount,
        currency: order.currency || 'INR',
        name: 'Shifra AI',
        description: 'Pro Plan - 90 Days',
        order_id: order.id,

        prefill: {
          name: user?.name || '',
          email: user?.email || ''
        },

        theme: {
          color: '#9333ea'
        },

        handler: async (paymentResponse) => {
          try {
            const verifyResponse = await fetch(
              `${ServerUrl}/api/billing/verify`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                  razorpay_order_id: paymentResponse.razorpay_order_id,
                  razorpay_payment_id: paymentResponse.razorpay_payment_id,
                  razorpay_signature: paymentResponse.razorpay_signature
                })
              }
            )

            const verifyData = await verifyResponse.json()

            if (!verifyResponse.ok || !verifyData.success) {
              throw new Error(
                verifyData.message || 'Payment verification failed'
              )
            }

            alert('Payment successful! Your Pro plan is now active.')

            // Refresh user data and current plan
            window.location.reload()
          } catch (error) {
            console.error('Payment verification error:', error)
            alert(error.message || 'Unable to verify payment.')
          }
        },

        modal: {
          ondismiss: () => {
            setLoading(false)
          }
        }
      }

      const checkout = new window.Razorpay(options)

      checkout.on('payment.failed', (response) => {
        console.error('Payment failed:', response.error)
        alert(response.error?.description || 'Payment failed. Please try again.')
        setLoading(false)
      })

      checkout.open()
    } catch (error) {
      console.error('Billing error:', error)
      alert(error.message || 'Unable to start payment. Please try again.')
      setLoading(false)
    } finally {
      // Checkout remains responsible for its own payment lifecycle.
      // Re-enable the button if Checkout was not opened.
    }
  }

  // Your current backend does not expose a billing-history endpoint yet.
  const billingHistory = []

  return (
    <div className="min-h-screen bg-[#f7f8fc] px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-7">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-[#081028]">
            Billing & Plans
          </h1>
          <p className="text-gray-500 mt-1">
            Manage your subscription, usage and payments.
          </p>
        </div>

        {/* Current Plan */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-sm text-gray-400">Your Current Plan</p>

              <div className="flex items-center gap-3 mt-2">
                <h2 className="text-3xl font-bold text-[#081028] capitalize">
                  {currentPlan}
                </h2>

                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
                  {currentPlan === 'pro' && remainingDays === 0
                    ? 'Expired'
                    : 'Active'}
                </span>
              </div>

              <p className="text-sm text-gray-500 mt-2">
                Assistant: {user?.assistantName || 'My Assistant'}
              </p>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <FiCreditCard size={24} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-7">
            <div className="rounded-2xl bg-[#f8fafc] border border-gray-100 p-5">
              <p className="text-sm text-gray-400">Total Messages</p>
              <h3 className="text-2xl font-bold text-[#081028] mt-2">
                {totalMessages}
              </h3>
            </div>

            <div className="rounded-2xl bg-[#f8fafc] border border-gray-100 p-5">
              <p className="text-sm text-gray-400">Messages Remaining</p>
              <h3 className="text-2xl font-bold text-[#081028] mt-2">
                {currentPlan === 'free' ? remainingMessages : 'Unlimited*'}
              </h3>
            </div>

            <div className="rounded-2xl bg-[#f8fafc] border border-gray-100 p-5">
              <p className="text-sm text-gray-400">
                {currentPlan === 'free' ? 'Usage' : 'Days Remaining'}
              </p>

              <h3 className="text-2xl font-bold text-[#081028] mt-2">
                {currentPlan === 'free'
                  ? `${Math.round(usagePercentage)}%`
                  : `${remainingDays} days`}
              </h3>
            </div>
          </div>

          {currentPlan === 'free' && requestLimit > 0 && (
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">Message usage</span>
                <span className="font-semibold text-[#081028]">
                  {totalMessages} / {requestLimit}
                </span>
              </div>

              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 to-emerald-500 transition-all"
                  style={{ width: `${usagePercentage}%` }}
                />
              </div>
            </div>
          )}

          <p className="text-xs text-gray-400 mt-4">
            *Usage limits depend on your subscription configuration.
          </p>
        </div>

        {/* Available Plans */}
        <div>
          <div className="mb-5">
            <h2 className="text-xl font-bold text-[#081028]">
              Choose Your Plan
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Upgrade your assistant as your business grows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PLANS.map((plan) => {
              const isCurrent = currentPlan === plan.name.toLowerCase()
              const disabled = isCurrent || plan.unavailable || loading

              return (
                <div
                  key={plan.name}
                  className={`relative bg-white rounded-3xl border shadow-sm p-6 flex flex-col ${
                    plan.popular
                      ? 'border-purple-400 ring-2 ring-purple-100'
                      : 'border-gray-100'
                  }`}
                >
                  {plan.popular && (
                    <span className="absolute -top-3 left-6 rounded-full bg-purple-600 text-white text-xs font-semibold px-3 py-1">
                      Most Popular
                    </span>
                  )}

                  <h3 className="text-lg font-bold text-[#081028]">
                    {plan.name}
                  </h3>

                  <p className="text-sm text-gray-500 mt-2 min-h-10">
                    {plan.description}
                  </p>

                  <div className="flex items-baseline mt-5">
                    <span className="text-3xl font-bold text-[#081028]">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-sm text-gray-400 ml-1">
                        {plan.period}
                      </span>
                    )}
                  </div>

                  <div className="border-t border-gray-100 my-5" />

                  <ul className="space-y-3 flex-1">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 text-sm text-gray-600"
                      >
                        <FiCheck
                          className="text-emerald-500 mt-0.5 shrink-0"
                          size={17}
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => handlePlanSelect(plan)}
                    className={`w-full mt-7 py-3 rounded-full text-sm font-semibold transition-all ${
                      disabled
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : plan.popular
                        ? 'bg-gradient-to-r from-purple-500 to-emerald-500 text-white hover:opacity-90'
                        : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {isCurrent
                      ? 'Current Plan'
                      : loading && plan.name === 'Pro'
                      ? 'Processing...'
                      : plan.button}
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        {/* Billing History */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-7">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <FiClock size={20} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-[#081028]">
                Billing History
              </h2>
              <p className="text-sm text-gray-400">
                View your previous payments and invoices.
              </p>
            </div>
          </div>

          {billingHistory.length === 0 ? (
            <div className="text-center py-10 rounded-2xl bg-[#f8fafc] border border-dashed border-gray-200">
              <FiCreditCard
                size={28}
                className="mx-auto text-gray-300 mb-3"
              />
              <p className="font-semibold text-gray-700">
                No billing history yet
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Payment history will appear here when a billing-history API is added.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-100">
                    <th className="py-3 pr-4">Date</th>
                    <th className="py-3 pr-4">Plan</th>
                    <th className="py-3 pr-4">Amount</th>
                    <th className="py-3">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {billingHistory.map((item) => (
                    <tr
                      key={item._id}
                      className="border-b border-gray-50 last:border-0"
                    >
                      <td className="py-4 pr-4">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 pr-4">{item.plan}</td>
                      <td className="py-4 pr-4">₹{item.amount}</td>
                      <td className="py-4">
                        <span className="rounded-full px-3 py-1 text-xs bg-emerald-50 text-emerald-700">
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Upgrade Prompt */}
        {currentPlan === 'free' && (
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div>
              <div className="flex items-center gap-2">
                <FiZap size={22} />
                <h2 className="text-xl font-bold">Ready for more?</h2>
              </div>
              <p className="text-sm text-purple-100 mt-2">
                Upgrade your plan to unlock more capabilities for your assistant.
              </p>
            </div>

            <button
              type="button"
              disabled={loading}
              onClick={() => handlePlanSelect(PLANS[1])}
              className="shrink-0 px-6 py-3 bg-white text-purple-700 rounded-full text-sm font-semibold hover:bg-purple-50 transition-colors disabled:opacity-60"
            >
              {loading ? 'Processing...' : 'Upgrade to Pro'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Billing