import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader } from 'lucide-react';
import { textAPI } from '../../services/api';
import type { TextAnalysis } from '../../types';

export default function TextAnalysisPage() {
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TextAnalysis | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    setError('');

    try {
      const response = await textAPI.analyze({ text });
      setResult(response);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to analyze text');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50">
      {/* HEADER */}
      <header className="w-full bg-white border-b">
        <div className="w-full px-8 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl">Text Analysis</h1>
        </div>
      </header>

      {/* MAIN */}
      <main className="w-full px-8 py-8">
        {/* INPUT FORM */}
        {!result && (
          <div className="bg-white rounded-lg shadow p-8 w-full">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Paste Your Text
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste your meeting notes, email, article, or any text you want to analyze..."
                  className="w-full h-72 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  required
                />
                <p className="text-sm text-gray-500 mt-2">
                  {text.length} / 10,000 characters
                </p>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={!text.trim() || loading}
                className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin" size={20} />
                    Analyzing...
                  </>
                ) : (
                  'Analyze Text'
                )}
              </button>
            </form>
          </div>
        )}

        {/* RESULTS */}
        {result && (
          <div className="space-y-6 w-full">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800">
                ✅ Analysis Complete!
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg mb-3">Summary</h2>
              <div className="text-gray-700 whitespace-pre-wrap">
                {result.summary}
              </div>
            </div>

            {result.action_items.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg mb-3">Action Items</h2>
                <ul className="space-y-2">
                  {result.action_items.map((item, index) => (
                    <li key={index} className="flex gap-2">
                      <span className="text-purple-600">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg mb-3">Original Text</h2>
              <p className="text-gray-600 text-sm whitespace-pre-wrap">
                {result.text}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {result.character_count} characters
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setResult(null);
                  setText('');
                }}
                className="flex-1 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700"
              >
                Analyze Another
              </button>

              <button
                onClick={() => navigate('/history')}
                className="flex-1 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700"
              >
                View History
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
