import React, { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Client_Url, ServerUrl } from '../App'
import { FiCopy } from 'react-icons/fi';

const THEMES = [
  "light",
  "dark",
  "glass",
  "neon"
];

const TONES = [
  "friendly",
  "professionals",
  "sales"
];

function Builder({ user, setUser }) {
  const remainingMessage = Math.max(
    0,
    (user?.requestLimit || 0) - (user?.totalMessages || 0)
  );

  const remainingDays = user?.proExpiresAt
    ? Math.max(
        0,
        Math.ceil((new Date(user.proExpiresAt) - new Date()) / (1000 * 60 * 60 * 24))
      )
    : 0;

  const [EditAssistant, setEditAssistant] = useState(!user?.isSetupComplete);

  const [assistantName, setAssistantName] = useState(user?.assistantName || '')
  const [buisnessName, setBuisnessName] = useState(user?.buisnessName || '')
  const [buisnessType, setBuisnessType] = useState(user?.buisnessType || '')
  const [buisnessDescription, setBuisnessDescription] = useState(user?.buisnessDescription || '')
  const [theme, setTheme] = useState(user?.theme || "dark")
  const [tone, setTone] = useState(user?.tone || "professionals")
  const [geminiApiKey, setGeminiApiKey] = useState(user?.geminiApiKey || "")

  const [pages, setPages] = useState(Array.isArray(user?.pages) ? user.pages : [])
  const [pageName, setPageName] = useState("")
  const [pagePath, setPagePath] = useState("")
  const [pageKeywords, setPageKeywords] = useState("")
  const [loading, setLoading] = useState(false)

  // Add a new navigation page to knowledge base
  const handleAddPage = () => {
    if (!pageName.trim() || !pagePath.trim()) {
        toast.error("Page name and path are required");
        return;
    }

    const newPage = {
        name: pageName.trim(),
        path: pagePath.trim(),
        keywords: pageKeywords
            .split(",")
            .map(keyword => keyword.trim())
            .filter(Boolean)
    };

    setPages(prev => [...prev, newPage]);

    console.log("Pages being added:", newPage);

    setPageName("");
    setPagePath("");
    setPageKeywords("");
};

  // Remove a page
  const handleRemovePage = (indexToRemove) => {
    setPages((prev) => prev.filter((_, idx) => idx !== indexToRemove))
  }

  // Save changes
  const handleSave = async () => {
    setLoading(true)
    try {
      const data = {
        assistantName,
        buisnessName,
        buisnessType,
        buisnessDescription,
        theme,
        tone,
        geminiApiKey,
        pages
      }

      const res = await axios.post(`${ServerUrl}/api/user/save-assistant`, data, {
        withCredentials: true
      })

      setUser(res.data.user)
      setEditAssistant(false)
      toast.success("Assistant settings saved successfully!")
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.message || "Failed to save changes")
    } finally {
      setLoading(false)
    }
  }

   
  const embedCode=`<script src="${Client_Url}/assistant.js" data-user-id= "${user?._id}"></script `;



  return (
    <div className='min-h-screen bg-[#f7f8fc] px-4 py-8 sm:px-6 lg:px-8'>
      <div className='max-w-4xl mx-auto space-y-6'>
        
        {/* Page Header */}
        <div className="mb-8">
          <h2 className='text-3xl font-bold text-[#081028]'>
            Assistant Builder
          </h2>
          <p className='text-gray-500 mt-1'>customize your virtual assistant</p>
        </div>

        {/* Overview Card */}
        {user?.isSetupComplete && !EditAssistant && (
          <div className='space-y-6'>
            <div className='bg-white rounded-3xl border border-gray-100 shadow-sm p-6'> 
              <div className='flex items-start justify-between flex-wrap gap-4'>
                <div>
                  <p className='text-sm text-gray-400'>Assistant</p>
                  <h2 className='text-3xl font-bold text-[#081028] mt-1'>
                    {user?.assistantName || "My Assistant"}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setEditAssistant(true)}
                  className='px-5 py-2.5 text-sm font-semibold text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-full border border-purple-200 transition-colors cursor-pointer'
                >
                  Edit Assistant
                </button>
              </div>

              <p className='text-gray-500 mt-3 leading-7'>
                Your assistant is ready to use on your website.
              </p>

              <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6'>
                <div className='rounded-2xl border border-gray-100 bg-[#f8fafc] p-4'>
                  <p className='text-sm text-gray-400'>Current Plan</p>
                  <h2 className='text-xl font-bold text-[#081028] mt-1 capitalize'>
                    {user?.plan || "Free"}
                  </h2>
                </div>

                <div className='rounded-2xl border border-gray-100 bg-[#f8fafc] p-4'>
                  <p className='text-sm text-gray-400'>Gemini Status</p>
                  <h2 className={`text-xl font-bold mt-1 capitalize ${
                    user?.geminiStatus === "active" ? "text-emerald-600" : "text-amber-500"
                  }`}>
                    {user?.geminiStatus || "Inactive"}
                  </h2>
                </div>

                <div className='rounded-2xl border border-gray-100 bg-[#f8fafc] p-4'>
                  <p className='text-sm text-gray-400'> 
                    {user?.plan === "free" ? "Messages Left" : "Plan Expiry"}
                  </p>
                  <h2 className='text-xl font-bold text-[#081028] mt-1'>
                    {user?.plan === "free" ? remainingMessage : `${remainingDays} Days`}
                  </h2>
                </div>
              </div>
            </div>

            {/* Script Placement Guide */}
            <div className='bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-7'>
              <h3 className='text-lg font-bold text-[#081028] mb-1.5'>
                Where to paste this script?
              </h3>
              <p className='text-sm text-gray-600 mb-4'>
                Paste this script just above your <code className='text-purple-600 font-semibold bg-purple-50 px-1.5 py-0.5 rounded border border-purple-100 font-mono'>&lt;/body&gt;</code> tag of your HTML file.
              </p>

              <div className='rounded-2xl bg-slate-900 border border-slate-800 p-4 sm:p-5 font-mono text-xs sm:text-sm text-slate-300 overflow-x-auto shadow-inner'>
                <pre className='leading-relaxed'>
{`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>My Website</title>
  </head>
  <body>
    <!-- Your website body content here -->
    <h1>Welcome to our website</h1>

    <!-- Paste the assistant script right here -->
    <script 
      src="${Client_Url}/widget.js" 
      data-assistant-id="${user?._id}" 
      defer>
    </script>
  </body>
</html>`}
                </pre>
              </div>

              <p className='text-sm font-medium text-[#081028] mb-3 '> Embed Code</p>
            </div>

            <div className='relative'>
              <textarea value={embedCode}
                readOnly
               className='w-full h-20 bg-[#0b1020] text-emerald-400 rounded-2xl p-4
                text-sm font-mono resize-none outline-none '/>
              <button className='absolute top-4 right-4 w-10 h-10 rounded-xl bg-white
               flex items-center
                justify-center' 
                 onClick={()=>{
                  navigator.clipboard.writeText(embedCode)
                  toast.success("copied")
                 }} >
                  <FiCopy/>
                </button>
            </div>
          </div>
        )}

        {/* Edit Form */}
        {EditAssistant && (
          <div className='space-y-6'>
            {/* Basic Information */}
            <div className='bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-6'>
              <div className='flex items-center justify-between'>
                <h2 className="text-lg font-semibold text-[#081028]">Basic Information</h2>
                {user?.isSetupComplete && (
                  <button
                    type="button"
                    onClick={() => setEditAssistant(false)}
                    className="text-xs text-gray-500 hover:text-gray-700 underline"
                  >
                    Cancel
                  </button>
                )}
              </div>

              <div className='space-y-4'>
                <input 
                  type="text"
                  placeholder='Assistant Name' 
                  onChange={(e) => setAssistantName(e.target.value)}
                  value={assistantName}
                  className='w-full border border-gray-200 bg-slate-50/50 rounded-2xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all'
                />

                <input 
                  type="text"
                  placeholder='Business Name' 
                  onChange={(e) => setBuisnessName(e.target.value)}
                  value={buisnessName}
                  className='w-full border border-gray-200 bg-slate-50/50 rounded-2xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all'
                />

                <input 
                  type="text"
                  onChange={(e) => setBuisnessType(e.target.value)}
                  value={buisnessType}
                  placeholder='Business Type' 
                  className='w-full border border-gray-200 bg-slate-50/50 rounded-2xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all'
                />

                <textarea 
                  rows={4}
                  onChange={(e) => setBuisnessDescription(e.target.value)}
                  value={buisnessDescription}
                  placeholder='Business description' 
                  className='w-full border border-gray-200 bg-slate-50/50 rounded-2xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all resize-none'
                />
              </div>
            </div>
            
            {/* Appearance */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-5 text-[#081028]">Appearance</h2>
              
              <div className='mt-6'>
                <label className='text-sm text-gray-600 mb-3 block font-medium'>Theme</label>
                <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
                  {THEMES.map((item) => (
                    <button 
                      key={item} 
                      type="button"
                      onClick={() => setTheme(item)} 
                      className={`py-3 px-4 rounded-2xl text-sm font-semibold capitalize border transition-all cursor-pointer ${
                        theme === item
                          ? 'border-purple-500 bg-purple-50 text-purple-700 ring-2 ring-purple-500/20 shadow-sm'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {item}
                    </button>   
                  ))}
                </div>
              </div>

              <div className='mt-6'>
                <label className='text-sm text-gray-600 mb-3 block font-medium'>Assistant Tone</label>
                <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
                  {TONES.map((item) => (
                    <button 
                      key={item} 
                      type="button"
                      onClick={() => setTone(item)} 
                      className={`py-3 px-4 rounded-2xl text-sm font-semibold capitalize border transition-all cursor-pointer ${
                        tone === item
                          ? 'border-purple-500 bg-purple-50 text-purple-700 ring-2 ring-purple-500/20 shadow-sm'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {item}
                    </button>   
                  ))}
                </div>
              </div>
            </div>

            {/* Gemini API Key */}
            <div className='bg-white rounded-3xl border border-gray-100 shadow-sm p-6'>
              <div className="flex items-center justify-between mb-5 gap-4 flex-wrap">
                <div>
                  <h2 className='text-lg font-semibold text-[#081028]'>Gemini Api Key</h2>
                  <p className='text-sm text-gray-400 mt-1'>Add your Gemini Api Key to power your Assistant</p>
                </div>

                <a 
                  href="https://aistudio.google.com/app/apikey"
                  target='_blank'
                  rel='noopener noreferrer' 
                  className='px-4 py-2 text-xs font-semibold text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-full border border-purple-200 transition-colors'
                >
                  GET API KEY
                </a>
              </div>

              <input 
                type="password" 
                placeholder='AIzaSy...'
                onChange={(e) => setGeminiApiKey(e.target.value)}
                value={geminiApiKey}
                className='w-full border border-gray-200 bg-slate-50/50 rounded-2xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all'
              />

              <p className='text-xs text-gray-400 mt-2.5 px-1'>
                Your API key is secure and is used only for generating responses
              </p>
            </div>

            {/* Page Navigation & Knowledge Base */}
            <div className='bg-white rounded-3xl border border-gray-100 shadow-sm p-6'>
              <div className="mb-5">
                <h2 className='text-lg font-semibold text-[#081028]'>Website Pages & Navigation</h2>
                <p className='text-sm text-gray-400 mt-1'>Help your assistant redirect and guide users through your website links.</p>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3'>
                <input 
                  type="text"
                  placeholder='Page Name (e.g., Pricing)'
                  value={pageName}
                  onChange={(e) => setPageName(e.target.value)}
                  className='border border-gray-200 bg-slate-50/50 rounded-2xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500'
                />
                <input 
                  type="text"
                  placeholder='Page Path (e.g., /pricing)'
                  value={pagePath}
                  onChange={(e) => setPagePath(e.target.value)}
                  className='border border-gray-200 bg-slate-50/50 rounded-2xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500'
                />
                <input 
                  type="text"
                  placeholder='Keywords (e.g., cost, plan)'
                  value={pageKeywords}
                  onChange={(e) => setPageKeywords(e.target.value)}
                  className='border border-gray-200 bg-slate-50/50 rounded-2xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500'
                />
              </div>

              <div className='flex justify-end mb-5'>
                <button
                  type="button"
                  onClick={handleAddPage}
                  className='px-5 py-2 text-xs font-semibold text-white rounded-full bg-gradient-to-r from-purple-500 to-emerald-500 hover:opacity-95 shadow-sm transition-all cursor-pointer'
                >
                  + Add Page
                </button>
              </div>

              {/* Added Pages List */}
              {Array.isArray(pages) && pages.length > 0 && (
                <div className='divide-y divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden'>
         {pages.map((p, idx) => (
    <div key={idx} className='flex items-center justify-between p-3.5 bg-slate-50/40'>
        <div>
            <span className='font-semibold text-sm text-gray-800 mr-2'>
                {p.name}
            </span>

            <span className='text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md font-mono'>
                {p.path}
            </span>

            {p.keywords?.length > 0 && (
                <p className='text-xs text-gray-400 mt-0.5'>
                    Keywords: {p.keywords.join(", ")}
                </p>
            )}
        </div>

        <button
            type="button"
            onClick={() => handleRemovePage(idx)}
            className='text-xs text-red-500 hover:text-red-700 font-medium px-2 py-1 rounded transition-colors cursor-pointer'
        >
            Delete
        </button>
    </div>
))}
                </div>
              )}
            </div>

            {/* Save Actions */}
            <div className='flex justify-end pt-2 pb-12'>
              <button
                type="button"
                disabled={loading || !assistantName.trim() || !buisnessName.trim() || !buisnessType.trim() || !buisnessDescription.trim() || !geminiApiKey.trim()}
                onClick={handleSave}
                className='px-8 py-3.5 text-sm sm:text-base font-semibold text-white rounded-full bg-gradient-to-r from-purple-500 to-emerald-500 hover:opacity-95 shadow-md hover:shadow-lg disabled:opacity-50 transition-all disabled:cursor-not-allowed'
              >
                {loading ? "Saving..." : user?.isSetupComplete ? "Update Assistant" : "Save Assistant"}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default Builder