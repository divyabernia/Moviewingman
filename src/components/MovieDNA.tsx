import React, { useState, useEffect } from 'react';
import { X, Dna, TrendingUp, Star, Calendar, Brain, Heart, Zap, Eye, Clock, AlertTriangle } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  ArcElement,
} from 'chart.js';
import { Radar, Doughnut, Line } from 'react-chartjs-2';
import { aiSommelier, MovieDNA as MovieDNAType } from '../services/openai';
import { Movie } from '../types/movie';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  ArcElement
);

interface MovieDNAProps {
  watchlist: Movie[];
  onClose: () => void;
}

export const MovieDNA: React.FC<MovieDNAProps> = ({ watchlist, onClose }) => {
  const [dnaData, setDnaData] = useState<MovieDNAType | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'personality' | 'genres' | 'timeline' | 'insights'>('personality');
  const [showApiWarning, setShowApiWarning] = useState(true);

  useEffect(() => {
    const analyzeDNA = async () => {
      setLoading(true);
      try {
        const analysis = await aiSommelier.analyzeMovieDNA(watchlist);
        setDnaData(analysis);
      } catch (error) {
        console.error('Error analyzing movie DNA:', error);
      } finally {
        setLoading(false);
      }
    };

    analyzeDNA();
  }, [watchlist]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Dna className="w-8 h-8 text-white animate-spin" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Analyzing Your Movie DNA</h3>
          <p className="text-gray-300">Discovering your cinematic personality...</p>
        </div>
      </div>
    );
  }

  if (!dnaData) {
    return (
      <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Analysis Failed</h3>
          <p className="text-gray-300 mb-4">Unable to analyze your movie DNA</p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  // Personality Radar Chart
  const personalityData = {
    labels: ['Adventurous', 'Intellectual', 'Emotional', 'Nostalgic', 'Mainstream'],
    datasets: [
      {
        label: 'Your Movie Personality',
        data: [
          dnaData.personality.adventurous,
          dnaData.personality.intellectual,
          dnaData.personality.emotional,
          dnaData.personality.nostalgic,
          dnaData.personality.mainstream,
        ],
        backgroundColor: 'rgba(147, 51, 234, 0.2)',
        borderColor: 'rgba(147, 51, 234, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(147, 51, 234, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(147, 51, 234, 1)',
      },
    ],
  };

  const personalityOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      r: {
        angleLines: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        pointLabels: {
          color: 'rgba(255, 255, 255, 0.8)',
          font: {
            size: 12,
          },
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.5)',
          backdropColor: 'transparent',
        },
        min: 0,
        max: 100,
      },
    },
  };

  // Genres Doughnut Chart
  const genresData = {
    labels: Object.keys(dnaData.genres),
    datasets: [
      {
        data: Object.values(dnaData.genres),
        backgroundColor: [
          '#8B5CF6',
          '#EC4899',
          '#F59E0B',
          '#10B981',
          '#3B82F6',
          '#EF4444',
          '#6366F1',
          '#84CC16',
        ],
        borderWidth: 0,
      },
    ],
  };

  const genresOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: 'rgba(255, 255, 255, 0.8)',
          usePointStyle: true,
          padding: 20,
        },
      },
    },
  };

  // Ratings Distribution
  const ratingsData = {
    labels: Object.keys(dnaData.ratings),
    datasets: [
      {
        data: Object.values(dnaData.ratings),
        backgroundColor: [
          '#EF4444',
          '#F59E0B',
          '#10B981',
          '#8B5CF6',
        ],
        borderWidth: 0,
      },
    ],
  };

  const getPersonalityInsight = () => {
    const personality = dnaData.personality;
    const dominant = Object.entries(personality).reduce((a, b) => 
      personality[a[0] as keyof typeof personality] > personality[b[0] as keyof typeof personality] ? a : b
    );

    const insights = {
      adventurous: "You love action-packed adventures and thrilling experiences!",
      intellectual: "You appreciate complex narratives and thought-provoking cinema.",
      emotional: "You connect deeply with character-driven stories and emotional journeys.",
      nostalgic: "You have a soft spot for classics and timeless storytelling.",
      mainstream: "You enjoy popular, crowd-pleasing entertainment."
    };

    return insights[dominant[0] as keyof typeof insights];
  };

  const tabs = [
    { id: 'personality', label: 'Personality', icon: Brain },
    { id: 'genres', label: 'Genres', icon: Star },
    { id: 'timeline', label: 'Timeline', icon: Calendar },
    { id: 'insights', label: 'Insights', icon: Eye },
  ];

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 overflow-y-auto">
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="bg-gradient-to-br from-purple-950/90 to-blue-950/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl border border-purple-800/30">
            
            {/* API Warning Banner */}
            {showApiWarning && (
              <div className="bg-gradient-to-r from-orange-600/20 to-red-600/20 border-b border-orange-500/30 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-orange-400" />
                    <span className="text-orange-200 text-sm">
                      Demo Mode: Enhanced AI analysis available with OpenAI API configuration
                    </span>
                  </div>
                  <button
                    onClick={() => setShowApiWarning(false)}
                    className="text-orange-300 hover:text-orange-100 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <Dna className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-black text-white">Your Movie DNA</h1>
                    <p className="text-purple-100">Cinematic personality analysis based on {watchlist.length} movies</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 mt-6">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 ${
                        activeTab === tab.id
                          ? 'bg-white/20 text-white'
                          : 'text-purple-200 hover:bg-white/10'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              {activeTab === 'personality' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-6">Personality Profile</h3>
                    <div className="h-80">
                      <Radar data={personalityData} options={personalityOptions} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-6">Insights</h3>
                    <div className="space-y-4">
                      <div className="bg-purple-900/30 border border-purple-800/30 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <Heart className="w-6 h-6 text-pink-400" />
                          <h4 className="font-bold text-white">Dominant Trait</h4>
                        </div>
                        <p className="text-purple-200">{getPersonalityInsight()}</p>
                      </div>
                      
                      {Object.entries(dnaData.personality).map(([trait, score]) => (
                        <div key={trait} className="bg-purple-900/20 border border-purple-800/20 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-white font-semibold capitalize">{trait}</span>
                            <span className="text-purple-300 font-bold">{score}%</span>
                          </div>
                          <div className="w-full bg-purple-900/50 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-1000"
                              style={{ width: `${score}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'genres' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-6">Genre Distribution</h3>
                    <div className="h-80">
                      <Doughnut data={genresData} options={genresOptions} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-6">Rating Preferences</h3>
                    <div className="h-80">
                      <Doughnut data={ratingsData} options={genresOptions} />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'timeline' && (
                <div>
                  <h3 className="text-2xl font-bold text-white mb-6">Decade Preferences</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {Object.entries(dnaData.decades).map(([decade, percentage]) => (
                      <div key={decade} className="bg-purple-900/30 border border-purple-800/30 rounded-xl p-6 text-center">
                        <div className="text-3xl font-black text-white mb-2">{percentage}%</div>
                        <div className="text-purple-200 font-semibold">{decade}</div>
                        <div className="w-full bg-purple-900/50 rounded-full h-2 mt-3">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'insights' && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-white mb-6">Detailed Analysis</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-800/30 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <TrendingUp className="w-6 h-6 text-green-400" />
                        <h4 className="font-bold text-white">Viewing Patterns</h4>
                      </div>
                      <ul className="space-y-2 text-purple-200">
                        <li>• You have {watchlist.length} movies in your collection</li>
                        <li>• Average rating: {(watchlist.reduce((sum, m) => sum + m.vote_average, 0) / watchlist.length).toFixed(1)}/10</li>
                        <li>• Most recent addition: {watchlist[watchlist.length - 1]?.title || 'None'}</li>
                      </ul>
                    </div>

                    <div className="bg-gradient-to-br from-pink-900/30 to-purple-900/30 border border-pink-800/30 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Zap className="w-6 h-6 text-yellow-400" />
                        <h4 className="font-bold text-white">Recommendations</h4>
                      </div>
                      <ul className="space-y-2 text-pink-200">
                        <li>• Try exploring {Object.keys(dnaData.genres)[0]} movies</li>
                        <li>• Consider classics from the {Object.keys(dnaData.decades)[0]}</li>
                        <li>• Your taste suggests you'd enjoy indie films</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-800/20 rounded-xl p-8 text-center">
                    <Clock className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                    <h4 className="text-xl font-bold text-white mb-2">Total Watch Time</h4>
                    <p className="text-purple-200">
                      Approximately {Math.round(watchlist.length * 2)} hours of cinematic experiences
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};