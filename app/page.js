'use client';
import { useState } from 'react';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setOutput('');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      if (data.result) {
        setOutput(data.result);
      } else {
        setOutput(data.error || 'Failed to generate human text.');
      }
    } catch (err) {
      setOutput('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center p-6">
      {/* Header */}
      <header className="w-full max-w-4xl text-center my-8">
        <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500 sm:text-5xl">
          HumanAI Writer
        </h1>
        <p className="mt-3 text-slate-400 text-lg">
          Generate 100% undetectable, human-like content automatically.
        </p>
      </header>

      {/* Main Container */}
      <div className="w-full max-w-4xl bg-slate-800 rounded-2xl shadow-xl border border-slate-700 p-6 flex flex-col gap-6">
        
        {/* Input Form */}
        <form onSubmit={handleGenerate} className="flex flex-col gap-3">
          <label className="text-sm font-semibold text-slate-300">What do you want to write today?</label>
          <div className="flex gap-3">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Write an engaging introduction blog about healthy habits..."
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-400 hover:to-blue-500 text-white font-medium px-6 py-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? 'Humanizing...' : 'Write'}
            </button>
          </div>
        </form>

        {/* Output Section */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-slate-300">100% Human Output:</span>
            {output && (
              <span className="text-xs bg-teal-500/10 text-teal-400 px-2.5 py-1 rounded-full font-medium border border-teal-500/20 animate-pulse">
                ✦ AI Detector Shield Active
              </span>
            )}
          </div>
          <div className="w-full min-h-[250px] bg-slate-950 border border-slate-700 rounded-xl p-4 text-slate-300 overflow-y-auto whitespace-pre-wrap font-sans leading-relaxed">
            {output ? output : <span className="text-slate-600 italic">Your humanized text will appear here...</span>}
          </div>
        </div>

      </div>
    </main>
  );
}
