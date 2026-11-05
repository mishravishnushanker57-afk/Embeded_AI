import React from 'react'
import { useNavigate } from 'react-router-dom'
import AssistantPreview from '../Components/AssistantPreview'

const steps = [
  {
    step: "01",
    title: "Sign up for free",
    description: "Create your account in seconds with zero commitment. No credit card required to get started.",
  },
  {
    step: "02",
    title: "Customize assistant",
    description: "Personalize the appearance, voice styles, and color schemes to seamlessly match your brand.",
  },
  {
    step: "03",
    title: "Train your assistant",
    description: "Provide URLs, documents, or custom knowledge bases to teach your AI agent how your business works.",
  },
  {
    step: "04",
    title: "Embed anywhere",
    description: "Paste a single line of JavaScript into any website, CMS, or application to go live immediately.",
  },
]

function Home({ user }) {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className='relative overflow-hidden px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 lg:pt-24 pb-20'>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-emerald-50" />
        <div className="absolute top-0 left-1/4 w-[320px] h-[320px] bg-purple-200/40 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[320px] h-[320px] bg-emerald-200/40 blur-3xl rounded-full" />

        <div className="relative max-w-6xl mx-auto">
          <div className='flex justify-center'>
            <span className='inline-flex items-center gap-2 bg-white border border-purple-100 shadow-sm text-purple-600 text-xs sm:text-sm font-semibold px-4 py-2 rounded-full'>
              <span className='w-2 h-2 bg-emerald-400 rounded-full' />
              Voice AI for modern websites
            </span>
          </div>

          <div className='text-center mt-10 sm:mt-12'>
            <h1 className='max-w-5xl mx-auto text-[42px] leading-[52px] sm:text-6xl sm:leading-[72px] lg:text-7xl lg:leading-[88px] font-black tracking-[-0.04em] text-[#081028]'>
              Add a{" "}
              <span className="inline-block px-2">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-emerald-500">
                  Virtual Assistant
                </span>
              </span>
              <br className="hidden sm:block" />
              to your website
            </h1>

            <p className="mt-6 max-w-2xl mx-auto text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed font-normal">
              Build, train, and deploy an intelligent conversational assistant to your website in less than two minutes.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-3">
              <button
                onClick={() => navigate("/builder")}
                className="px-8 py-3.5 text-base sm:text-lg font-semibold text-white rounded-full bg-gradient-to-r from-purple-500 to-emerald-500 hover:opacity-95 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
              >
                Build your AI assistant
              </button>
              <p className="text-xs sm:text-sm text-gray-500 font-medium">
                Free plan provides 200 responses
              </p>
            </div>
          </div>
          <AssistantPreview />
        </div>
      </section>

      {/* Steps Section */}
      <section className='px-4 sm:px-6 lg:px-8 py-20 bg-white'>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className='text-3xl sm:text-4xl font-bold text-[#081028]'>
              Get started in minutes.
            </h2>
            <p className='text-gray-500 mt-3 text-sm sm:text-base'>
              Simple setup. Easy Integration.
            </p>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8'>
            {steps.map((item) => (
              <div
                key={item.step}
                className='relative p-6 sm:p-7 rounded-3xl bg-slate-50/70 border border-slate-100 hover:border-purple-200 hover:shadow-xl hover:shadow-purple-500/5 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between'
              >
                <div>
                  <span className='text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-emerald-500'>
                    {item.step}
                  </span>
                  <h3 className='text-lg font-bold text-gray-900 mt-3 mb-2'>
                    {item.title}
                  </h3>
                  <p className='text-sm text-gray-600 leading-relaxed font-normal'>
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rectangular Block Footer */}
      <footer className='px-4 sm:px-6 lg:px-8 pb-10 bg-white mt-auto'>
        <div className='max-w-6xl mx-auto bg-slate-900 border border-slate-800 text-white rounded-2xl px-6 sm:px-10 py-6 sm:py-7 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl'>
          
          {/* Left Side: Brand & Tagline */}
          <div className='flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4 text-center sm:text-left'>
            <h2 className='font-bold text-xl tracking-tight'>
              AV <span className='text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-emerald-400'>AI</span>
            </h2>
            <span className='hidden sm:inline-block w-px h-4 bg-slate-700' />
            <p className='text-xs sm:text-sm text-slate-400'>
              Voice assistant for websites
            </p>
          </div>

          {/* Right Side: Copyright */}
          <p className='text-xs sm:text-sm text-slate-400 text-center sm:text-right'>
            © 2026 AV AI. All rights reserved.
          </p>

        </div>
      </footer>
    </div>
  )
}

export default Home