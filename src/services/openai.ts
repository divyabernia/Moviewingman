// OpenAI service placeholder - not yet implemented
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
    // Mock implementation - replace with OpenAI when API key is provided
    console.warn('OpenAI API key not configured. Using mock Movie DNA analysis.');
    
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

    return this.fallbackMovieDNA(watchlist);
  }

  private fallbackMovieDNA(watchlist: any[]): MovieDNA {
    const dna: MovieDNA = {
      genres: { "Action": 25, "Drama": 30, "Comedy": 20, "Thriller": 15, "Romance": 10 },
      decades: { "2020s": 40, "2010s": 35, "2000s": 15, "1990s": 10 },
      ratings: { "High (8-10)": 30, "Good (7-8)": 45, "Average (5-7)": 20, "Low (0-5)": 5 },
      themes: { "Adventure": 30, "Character Study": 25, "Romance": 20, "Mystery": 15, "Comedy": 10 },
      directors: { "Christopher Nolan": 15, "Quentin Tarantino": 10, "Martin Scorsese": 8 },
      personality: {
        adventurous: Math.floor(Math.random() * 40) + 60,
        intellectual: Math.floor(Math.random() * 40) + 40,
        emotional: Math.floor(Math.random() * 40) + 50,
        nostalgic: Math.floor(Math.random() * 30) + 30,
        mainstream: Math.floor(Math.random() * 50) + 40,
      }
    };

    return dna;
  }

  async getRecommendations(
    watchlist: any[],
    mood?: string,
    context?: string
  ): Promise<{ recommendations: MovieRecommendation[]; message: string }> {
    console.warn('OpenAI API key not configured. Using mock recommendations.');
    
    // Mock recommendations
    const mockRecommendations: MovieRecommendation[] = [
      {
        title: "The Shawshank Redemption",
        reason: "A timeless classic that appeals to all movie lovers with its powerful story of hope and friendship",
        confidence: 95,
        mood: mood || "uplifting",
        genre: ["Drama"]
      },
      {
        title: "Inception",
        reason: "Mind-bending thriller perfect for those who love complex narratives and stunning visuals",
        confidence: 88,
        mood: mood || "intellectual",
        genre: ["Sci-Fi", "Thriller"]
      },
      {
        title: "Parasite",
        reason: "Award-winning masterpiece that combines social commentary with thrilling storytelling",
        confidence: 92,
        mood: mood || "thoughtful",
        genre: ["Thriller", "Drama"]
      }
    ];

    return {
      message: this.personality.greeting + " Here are some fantastic recommendations based on your taste! (Note: AI features require OpenAI API key configuration)",
      recommendations: mockRecommendations
    };
  }

  async chatWithSommelier(message: string, watchlist: any[]): Promise<string> {
    console.warn('OpenAI API key not configured. Using mock chat response.');
    
    const responses = [
      "That's a great question about movies! I'd love to help you with personalized recommendations once the OpenAI API is configured.",
      "I can see you're passionate about cinema! With full AI capabilities, I could provide much more detailed insights.",
      "Interesting perspective! Once connected to OpenAI, I'll be able to have much more engaging conversations about your movie preferences.",
      "I appreciate your interest in movie recommendations! The full AI experience will be available once the API key is set up."
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  }

  getPersonality(): SommelierPersonality {
    return this.personality;
  }

  switchPersonality(index: number): void {
    this.personality = SOMMELIER_PERSONALITIES[index];
    this.conversationHistory = [];
  }
}

export const aiSommelier = new AISommelier(0);