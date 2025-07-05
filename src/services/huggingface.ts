const HF_API_KEY = import.meta.env.VITE_HUGGINGFACE_API_KEY || 'hf_your_api_key_here'; // Replace with your actual API key
const HF_API_URL = 'https://api-inference.huggingface.co/models/openai/whisper-large-v3-turbo';

export interface TranscriptionResponse {
  text: string;
}

export const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.wav');

    const response = await fetch(HF_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_API_KEY}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
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
      throw new Error('Unexpected response format from Hugging Face API');
    }
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw new Error('Failed to transcribe audio. Please try again.');
  }
};