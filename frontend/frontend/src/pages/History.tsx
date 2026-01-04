import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Mic, FileText } from 'lucide-react';
import { voiceAPI, textAPI } from '../../services/api';
import type { VoiceAnalysis, TextAnalysis } from '../../types';

export default function History() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'voice' | 'text'>('voice');
  const [voiceHistory, setVoiceHistory] = useState<VoiceAnalysis[]>([]);
  const [textHistory, setTextHistory] = useState<TextAnalysis[]>([]);
  const [loading, setLoading] = useState(true);

  // expand state per item + section
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggle = (key: string) => {
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const [voice, text] = await Promise.all([
        voiceAPI.getHistory(),
        textAPI.getHistory(),
      ]);

      setVoiceHistory(voice.map((v: any) => ({ ...v, id: v._id })));
      setTextHistory(text.map((t: any) => ({ ...t, id: t._id })));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVoice = async (id: string) => {
    if (!confirm('Delete this voice analysis?')) return;
    await voiceAPI.delete(id);
    setVoiceHistory(prev => prev.filter(v => v.id !== id));
  };

  const handleDeleteText = async (id: string) => {
    if (!confirm('Delete this text analysis?')) return;
    await textAPI.delete(id);
    setTextHistory(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="bg-white border-b">
        <div className="w-full mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-lg"
              aria-label="Back to dashboard"
            >
              <ArrowLeft size={20} />
            </button>

            <div>
              <h1 className="text-2xl font-semibold">History</h1>
              <p className="text-sm text-gray-500">All your past voice and text analyses</p>
            </div>
          </div>

          <div className="text-sm text-gray-500">Showing recent activity</div>
        </div>
      </header>

      <main className="w-full mx-auto px-6 py-8">
        {/* TABS */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex bg-slate-100 rounded-full p-1 shadow-sm">
            <button
              onClick={() => setActiveTab('voice')}
              className={`px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium transition ${
                activeTab === 'voice'
                  ? 'bg-white text-purple-600 shadow'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <Mic size={16} />
              Voice
            </button>

            <button
              onClick={() => setActiveTab('text')}
              className={`px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium transition ${
                activeTab === 'text'
                  ? 'bg-white text-pink-600 shadow'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <FileText size={16} />
              Text
            </button>
          </div>

          <div className="text-sm text-gray-500">{activeTab === 'voice' ? `${voiceHistory.length} voice` : `${textHistory.length} text`} entries</div>
        </div>

        {loading ? (
          <p className="text-center py-12 text-gray-500">Loading…</p>
        ) : (
          <>
            {/* ================= VOICE ================= */}
            {activeTab === 'voice' && (
              <div className="space-y-4">
                {voiceHistory.length === 0 && (
                  <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
                    <p>No voice analyses yet — record some audio to get started.</p>
                    <button
                      onClick={() => navigate('/voice')}
                      className="mt-3 inline-flex items-center px-3 py-2 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700"
                    >
                      Click here to record
                    </button>
                  </div>
                )}

                {voiceHistory.map(item => (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg shadow p-6 mb-4 hover:shadow-xl transition transform hover:-translate-y-1"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="flex-none w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white flex items-center justify-center">
                          <Mic size={20} />
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold">{item.file_name}</h3>
                          <div className="mt-1 flex flex-wrap gap-2">
                            <span className="text-sm text-gray-500">{new Date(item.created_at).toLocaleString()}</span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-700">{item.duration_seconds}s</span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-700">{item.language}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <button
                          onClick={() => handleDeleteVoice(item.id)}
                          className="text-red-600 hover:bg-red-50 p-2 rounded"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>

                    {/* SUMMARY */}
                    <p
                      className={`text-sm text-gray-700 mt-4 ${
                        expanded[`voice-summary-${item.id}`]
                          ? ''
                          : 'line-clamp-3'
                      }`}
                    >
                      {item.summary}
                    </p>

                    <button
                      onClick={() => toggle(`voice-summary-${item.id}`)}
                      className="text-purple-600 text-sm mt-2 hover:underline"
                    >
                      {expanded[`voice-summary-${item.id}`] ? 'Show less' : 'Show more'}
                    </button>

                    <div className="mt-4">
                      <audio controls className="w-full rounded-md overflow-hidden bg-slate-50">
                        <source src={item.audio_url} />
                      </audio>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ================= TEXT ================= */}
            {activeTab === 'text' && (
              <div className="space-y-4">
                {textHistory.length === 0 && (
                  <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
                    <p>No text analyses yet — paste some text to analyze.</p>
                    <button
                      onClick={() => navigate('/text')}
                      className="mt-3 inline-flex items-center px-3 py-2 bg-pink-600 text-white rounded-md text-sm hover:bg-pink-700"
                    >
                      Click here to analyze text
                    </button>
                  </div>
                )}

                {textHistory.map(item => (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg shadow p-6 mb-4 hover:shadow-xl transition transform hover:-translate-y-1"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold">Text analysis</h3>
                        <p className="text-sm text-gray-500">{new Date(item.analyzed_at).toLocaleString()}</p>
                      </div>

                      <button
                        onClick={() => handleDeleteText(item.id)}
                        className="text-red-600 hover:bg-red-50 p-2 rounded"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Original Text</p>
                      <p className={`text-sm text-gray-600 ${expanded[`text-original-${item.id}`] ? '' : 'line-clamp-4'}`}>{item.text}</p>
                      <button onClick={() => toggle(`text-original-${item.id}`)} className="text-pink-600 text-sm mt-2 hover:underline">
                        {expanded[`text-original-${item.id}`] ? 'Show less' : 'Show more'}
                      </button>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Summary</p>
                      <p className={`text-sm text-gray-600 ${expanded[`text-summary-${item.id}`] ? '' : 'line-clamp-3'}`}>{item.summary}</p>
                      <button onClick={() => toggle(`text-summary-${item.id}`)} className="text-pink-600 text-sm mt-2 hover:underline">
                        {expanded[`text-summary-${item.id}`] ? 'Show less' : 'Show more'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
