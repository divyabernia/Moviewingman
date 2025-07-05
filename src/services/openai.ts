import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export interface MovieRecommendation {
  title: string;
  reason: string;
  confidence: number;
  mood: string;
  genre: string[];
}

export interface MovieDNA {
  genres: { [key: string]: number };
  decades: { [key: string]: number };
  ratings: { [key: string]: number };
  themes: { [key: string]: number };
  directors: { [key: string]: number };
  personality: {
    adventurous: number;
    intellectual: number;
    emotional: number;
    nostalgic: number;
    mainstream: number;
  };
}

export interface SommelierPersonality {
  name: string;
  avatar: string;
  greeting: string;
  style: 'professional' | 'friendly' | 'quirky';
}

export const SOMMELIER_PERSONALITIES: SommelierPersonality[] = [
  {
    name: "Cinephile Charlie",
    avatar: "🎭",
    greeting: "Ah, a fellow connoisseur of cinematic excellence! *adjusts digital monocle*",
    style: "quirky"
  },
  {
    name: "Movie Maven",
    avatar: "🎬",
    greeting: "Hey there, movie lover! Ready to discover your next obsession?",
    style: "friendly"
  },
  {
    name: "The Film Critic",
    avatar: "🏆",
    greeting: "Based on sophisticated analysis of your viewing patterns...",
    style: "professional"
  }
];

export class AISommelier {
  private personality: SommelierPersonality;
  private conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = [];

  constructor(personalityIndex: number = 0) {
    this.personality = SOMMELIER_PERSONALITIES[personalityIndex];
  }

  async analyzeMovieDNA(watchlist: any[]): Promise<MovieDNA> {
    if (watchlist.length === 0) {
      return {
        genres: {},
        decades: {},
        ratings: {},
        themes: {},
        directors: {},
        personality: {
          adventurous: 50,
          intellectual: 50,
          emotional: 50,
          nostalgic: 50,
          mainstream: 50,
        }
      };
    }

    try {
      const prompt = `Analyze this movie watchlist and create a detailed "Movie DNA" profile:

Movies: ${watchlist.map(m => `${m.title} (${m.release_date}) - Rating: ${m.vote_average}`).join(', ')}

Return a JSON object with:
1. genres: percentage breakdown of genres
2. decades: percentage breakdown by decade
3. ratings: percentage breakdown by rating ranges (0-5, 5-7, 7-8, 8-10)
4. themes: common themes/moods (action, romance, drama, comedy, thriller, etc.)
5. directors: if recognizable patterns
6. personality: scores 0-100 for adventurous, intellectual, emotional, nostalgic, mainstream

Be creative and insightful. Return only valid JSON.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 1000,
      });

      const content = response.choices[0]?.message?.content;
      if (content) {
        return JSON.parse(content);
      }
    } catch (error) {
      console.error('Error analyzing movie DNA:', error);
    }

    // Fallback analysis
    return this.fallbackMovieDNA(watchlist);
  }

  private fallbackMovieDNA(watchlist: any[]): MovieDNA {
    const dna: MovieDNA = {
      genres: {},
      decades: {},
      ratings: { "High (8-10)": 0, "Good (7-8)": 0, "Average (5-7)": 0, "Low (0-5)": 0 },
      themes: {},
      directors: {},
      personality: {
        adventurous: 50,
        intellectual: 50,
        emotional: 50,
        nostalgic: 50,
        mainstream: 50,
      }
    };

    watchlist.forEach(movie => {
      // Analyze ratings
      const rating = movie.vote_average;
      if (rating >= 8) dna.ratings["High (8-10)"]++;
      else if (rating >= 7) dna.ratings["Good (7-8)"]++;
      else if (rating >= 5) dna.ratings["Average (5-7)"]++;
      else dna.ratings["Low (0-5)"]++;

      // Analyze decades
      const year = parseInt(movie.release_date);
      if (year >= 2020) dna.decades["2020s"] = (dna.decades["2020s"] || 0) + 1;
      else if (year >= 2010) dna.decades["2010s"] = (dna.decades["2010s"] || 0) + 1;
      else if (year >= 2000) dna.decades["2000s"] = (dna.decades["2000s"] || 0) + 1;
      else if (year >= 1990) dna.decades["1990s"] = (dna.decades["1990s"] || 0) + 1;
      else dna.decades["Classic"] = (dna.decades["Classic"] || 0) + 1;
    });

    // Convert to percentages
    const total = watchlist.length;
    Object.keys(dna.ratings).forEach(key => {
      dna.ratings[key] = Math.round((dna.ratings[key] / total) * 100);
    });
    Object.keys(dna.decades).forEach(key => {
      dna.decades[key] = Math.round((dna.decades[key] / total) * 100);
    });

    return dna;
  }

  async getRecommendations(
    watchlist: any[],
    mood?: string,
    context?: string
  ): Promise<{ recommendations: MovieRecommendation[]; message: string }> {
    try {
      const watchlistTitles = watchlist.map(m => m.title).join(', ');
      const moodContext = mood ? `Current mood: ${mood}. ` : '';
      const additionalContext = context ? `Additional context: ${context}. ` : '';

      const prompt = `You are ${this.personality.name}, an AI movie sommelier with a ${this.personality.style} personality.

${this.personality.greeting}

Watchlist: ${watchlistTitles || 'Empty - new user'}
${moodContext}${additionalContext}

Provide 3-5 movie recommendations with:
1. A personalized message in your character
2. For each movie: title, detailed reason, confidence (0-100), mood it fits, genres

Respond in JSON format:
{
  "message": "Your personalized message",
  "recommendations": [
    {
      "title": "Movie Title",
      "reason": "Why this movie fits perfectly",
      "confidence": 85,
      "mood": "adventurous",
      "genre": ["Action", "Adventure"]
    }
  ]
}`;

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          ...this.conversationHistory,
          { role: "user", content: prompt }
        ],
        temperature: 0.8,
        max_tokens: 1500,
      });

      const content = response.choices[0]?.message?.content;
      if (content) {
        const result = JSON.parse(content);
        this.conversationHistory.push(
          { role: "user", content: `Mood: ${mood || 'general'}, Context: ${context || 'none'}` },
          { role: "assistant", content: result.message }
        );
        return result;
      }
    } catch (error) {
      console.error('Error getting recommendations:', error);
    }

    // Fallback recommendations
    return {
      message: this.personality.greeting + " I'm having trouble accessing my recommendation engine right now, but here are some popular picks!",
      recommendations: [
        {
          title: "The Shawshank Redemption",
          reason: "A timeless classic that appeals to all movie lovers",
          confidence: 90,
          mood: "uplifting",
          genre: ["Drama"]
        },
        {
          title: "Inception",
          reason: "Mind-bending thriller for those who love complex narratives",
          confidence: 85,
          mood: "intellectual",
          genre: ["Sci-Fi", "Thriller"]
        }
      ]
    };
  }

  async chatWithSommelier(message: string, watchlist: any[]): Promise<string> {
    try {
      const watchlistContext = watchlist.length > 0 
        ? `User's watchlist: ${watchlist.map(m => m.title).slice(0, 10).join(', ')}`
        : 'User has no movies in watchlist yet';

      const prompt = `You are ${this.personality.name}, an AI movie sommelier. ${this.personality.greeting}

${watchlistContext}

User says: "${message}"

Respond in character with helpful movie advice, recommendations, or insights. Be conversational and engaging.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          ...this.conversationHistory,
          { role: "user", content: prompt }
        ],
        temperature: 0.8,
        max_tokens: 500,
      });

      const content = response.choices[0]?.message?.content || "I'm having trouble processing that right now. Try asking about movie recommendations!";
      
      this.conversationHistory.push(
        { role: "user", content: message },
        { role: "assistant", content: content }
      );

      // Keep conversation history manageable
      if (this.conversationHistory.length > 10) {
        this.conversationHistory = this.conversationHistory.slice(-8);
      }

      return content;
    } catch (error) {
      console.error('Error in chat:', error);
      return "I'm having some technical difficulties right now. Try asking me about movie recommendations!";
    }
  }

  getPersonality(): SommelierPersonality {
    return this.personality;
  }

  switchPersonality(index: number): void {
    this.personality = SOMMELIER_PERSONALITIES[index];
    this.conversationHistory = []; // Reset conversation when switching
  }
}

export const aiSommelier = new AISommelier(0); // Default to quirky personality