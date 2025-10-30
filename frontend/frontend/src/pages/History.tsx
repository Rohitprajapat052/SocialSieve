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

  useEffect(() => {
    loadHistory();
  }, []);

const loadHistory = async () => {
  setLoading(true);
  try {
    const [voice, text] = await Promise.all([
      voiceAPI.getHistory(),
      textAPI.getHistory(),
    ]);
    
    const voiceWithIds = voice.map((item: any) => ({
      ...item,
      id: item._id  
    }));
    
    const textWithIds = text.map((item: any) => ({
      ...item,
      id: item._id  
    }));
    
    setVoiceHistory(voiceWithIds);
    setTextHistory(textWithIds);
  } catch (error) {
    console.error('Failed to load history:', error);
  } finally {
    setLoading(false);
  }
};

 const handleDeleteVoice = async (id: string) => {
  if (!id || id === 'undefined') {
    alert('Invalid ID');
    return;
  }
  
  if (!confirm('Delete this voice analysis?')) return;
  
  try {
    await voiceAPI.delete(id);
    setVoiceHistory(voiceHistory.filter((item) => item.id !== id));
  } catch (error: any) {
    console.error('Delete error:', error);
    alert('Failed to delete: ' + (error.response?.data?.detail || 'Unknown error'));
  }
};

const handleDeleteText = async (id: string) => {
  if (!id || id === 'undefined') {
    alert('Invalid ID');
    return;
  }
  
  if (!confirm('Delete this text analysis?')) return;
  
  try {
    await textAPI.delete(id);
    setTextHistory(textHistory.filter((item) => item.id !== id));
  } catch (error: any) {
    console.error('Delete error:', error);
    alert('Failed to delete: ' + (error.response?.data?.detail || 'Unknown error'));
  }
};


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold">History</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex bg-white rounded-lg shadow mb-6 p-1">
          <button
            onClick={() => setActiveTab('voice')}
            className={`flex-1 py-3 rounded-md transition flex items-center justify-center gap-2 ${
              activeTab === 'voice'
                ? 'bg-blue-50 text-blue-600 font-medium'
                : 'text-gray-600'
            }`}
          >
            <Mic size={20} />
            Voice Analyses ({voiceHistory.length})
          </button>
          <button
            onClick={() => setActiveTab('text')}
            className={`flex-1 py-3 rounded-md transition flex items-center justify-center gap-2 ${
              activeTab === 'text'
                ? 'bg-blue-50 text-blue-600 font-medium'
                : 'text-gray-600'
            }`}
          >
            <FileText size={20} />
            Text Analyses ({textHistory.length})
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : (
          <>
            {/* Voice History */}
            {activeTab === 'voice' && (
              <div className="space-y-4">
                {voiceHistory.length === 0 ? (
                  <div className="bg-white rounded-lg shadow p-12 text-center">
                    <Mic className="mx-auto text-gray-400 mb-4" size={48} />
                    <p className="text-gray-600">No voice analyses yet</p>
                    <button
                      onClick={() => navigate('/voice')}
                      className="mt-4 text-blue-600 hover:underline"
                    >
                      Analyze your first audio
                    </button>
                  </div>
                ) : (
                  voiceHistory.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">
                            {item.file_name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {new Date(item.created_at).toLocaleString()} •{' '}
                            {item.duration_seconds}s • {item.language}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteVoice(item.id)}
                          className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">
                            Summary:
                          </p>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {item.summary}
                          </p>
                        </div>

                        {item.action_items.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">
                              Action Items: {item.action_items.length}
                            </p>
                          </div>
                        )}

                        <audio controls className="w-full mt-2">
                          <source src={item.audio_url} />
                        </audio>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Text History */}
            {activeTab === 'text' && (
              <div className="space-y-4">
                {textHistory.length === 0 ? (
                  <div className="bg-white rounded-lg shadow p-12 text-center">
                    <FileText className="mx-auto text-gray-400 mb-4" size={48} />
                    <p className="text-gray-600">No text analyses yet</p>
                    <button
                      onClick={() => navigate('/text')}
                      className="mt-4 text-blue-600 hover:underline"
                    >
                      Analyze your first text
                    </button>
                  </div>
                ) : (
                  textHistory.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-sm text-gray-500">
                            {new Date(item.analyzed_at).toLocaleString()} •{' '}
                            {item.character_count} characters
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteText(item.id)}
                          className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">
                            Original Text:
                          </p>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {item.text}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">
                            Summary:
                          </p>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {item.summary}
                          </p>
                        </div>

                        {item.action_items.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">
                              Action Items: {item.action_items.length}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}