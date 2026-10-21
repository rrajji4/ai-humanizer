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
        // FIX: Yahan 'prompt' ko 'text' naam se bheja ja raha hai taaki backend ise read kar sake
        body: JSON.stringify({ text: prompt }),
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
    <main style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#f1f5f9', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px', fontFamily: 'sans-serif' }}>
      <header style={{ width: '100%', maxWidth: '800px', textAlign: 'center', margin: '32px 0' }}>
        <h1 style={{ fontSize: '36px', fontWeight: '800', background: 'linear-gradient(to right, #2dd4bf, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          HumanAI Writer
        </h1>
        <p style={{ marginTop: '12px', color: '#94a3b8', fontSize: '18px' }}>
          Generate 100% undetectable, human-like content automatically.
        </p>
      </header>

      <div style={{ width: '100%', maxWidth: '800px', backgroundColor: '#1e293b', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)' }}>
        
        <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <label style={{ fontSize: '14px', fontWeight: '600', color: '#cbd5e1' }}>What do you want to write today?</label>
          <div style={{ display: 'flex', gap: '12px' }}>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Write an engaging blog about healthy habits..."
              style={{ flex: 1, backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '12px', padding: '12px 16px', color: '#e2e8f0', fontSize: '16px', outline: 'none' }}
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              style={{ backgroundColor: '#2dd4bf', color: '#0f172a', fontWeight: '600', padding: '12px 24px', borderRadius: '12px', border: 'none', cursor: 'pointer', transition: '0.2s', opacity: loading ? 0.5 : 1 }}
            >
              {loading ? 'Writing...' : 'Write'}
            </button>
          </div>
        </form>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#cbd5e1' }}>100% Human Output:</span>
          </div>
          <div style={{ width: '100%', minHeight: '200px', backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '12px', padding: '16px', color: '#cbd5e1', overflowY: 'auto', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
            {output ? output : <span style={{ color: '#475569', fontStyle: 'italic' }}>Your humanized text will appear here...</span>}
          </div>
        </div>

      </div>
    </main>
  );
}
