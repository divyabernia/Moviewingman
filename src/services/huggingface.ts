const HF_API_KEY = import.meta.env.VITE_HUGGINGFACE_API_KEY;
const HF_API_URL = 'https://api-inference.huggingface.co/models/openai/whisper-large-v3-turbo';

export interface TranscriptionResponse {
  text: string;
}

export const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
  // Check if API key is available
  if (!HF_API_KEY || HF_API_KEY === 'hf_your_api_key_here') {
    throw new Error('Hugging Face API key is not configured. Please add your API key to the .env file.');
  }

  try {
    // Convert blob to the correct format for Hugging Face API
    const arrayBuffer = await audioBlob.arrayBuffer();
    
    const response = await fetch(HF_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_API_KEY}`,
        'Content-Type': 'audio/wav',
      },
      body: arrayBuffer,
    });

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      
      try {
        const errorData = await response.json();
        if (errorData.error) {
          errorMessage = `API Error: ${errorData.error}`;
        }
      } catch {
        // If we can't parse the error response, use the status code
        if (response.status === 400) {
          errorMessage = 'Invalid request. Please check your API key and try again.';
        } else if (response.status === 401) {
          errorMessage = 'Invalid API key. Please check your Hugging Face API key.';
        } else if (response.status === 503) {
          errorMessage = 'Model is currently loading. Please try again in a few moments.';
        }
      }
      
      throw new Error(errorMessage);
    }

    const result = await response.json();
    
    // Handle different response formats from Hugging Face
    if (typeof result === 'string') {
      return result;
    } else if (result.text) {
      return result.text;
    } else if (Array.isArray(result) && result[0]?.text) {
      return result[0].text;
    } else {
      console.error('Unexpected response format:', result);
      throw new Error('Unexpected response format from Hugging Face API');
    }
  } catch (error) {
    console.error('Error transcribing audio:', error);
    
    // Re-throw the error with the original message if it's already a meaningful error
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('Failed to transcribe audio. Please try again.');
  }
};