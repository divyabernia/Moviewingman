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
    console.log('Starting transcription with Hugging Face API...');
    console.log('Audio blob size:', audioBlob.size, 'bytes');
    console.log('Audio blob type:', audioBlob.type);
    
    // Convert webm to wav format for better compatibility
    const audioBuffer = await convertToWav(audioBlob);
    
    const response = await fetch(HF_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_API_KEY}`,
        'Content-Type': 'audio/wav',
      },
      body: audioBuffer,
    });

    console.log('Hugging Face API response status:', response.status);

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      
      try {
        const errorData = await response.json();
        console.log('Error response from Hugging Face:', errorData);
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
    console.log('Transcription result:', result);
    
    // Handle different response formats from Hugging Face
    if (typeof result === 'string') {
      console.log('Transcription successful:', result);
      return result;
    } else if (result.text) {
      console.log('Transcription successful:', result.text);
      return result.text;
    } else if (Array.isArray(result) && result[0]?.text) {
      console.log('Transcription successful:', result[0].text);
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

// Convert audio blob to WAV format for better API compatibility
const convertToWav = async (audioBlob: Blob): Promise<ArrayBuffer> => {
  try {
    // Create audio context
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Convert blob to array buffer
    const arrayBuffer = await audioBlob.arrayBuffer();
    
    // Decode audio data
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    
    // Convert to WAV format
    const wavBuffer = audioBufferToWav(audioBuffer);
    
    return wavBuffer;
  } catch (error) {
    console.error('Error converting audio to WAV:', error);
    // Fallback: return original array buffer
    return await audioBlob.arrayBuffer();
  }
};

// Convert AudioBuffer to WAV format
const audioBufferToWav = (buffer: AudioBuffer): ArrayBuffer => {
  const length = buffer.length;
  const numberOfChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const bytesPerSample = 2;
  const blockAlign = numberOfChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = length * blockAlign;
  const bufferSize = 44 + dataSize;
  
  const arrayBuffer = new ArrayBuffer(bufferSize);
  const view = new DataView(arrayBuffer);
  
  // WAV header
  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };
  
  writeString(0, 'RIFF');
  view.setUint32(4, bufferSize - 8, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numberOfChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bytesPerSample * 8, true);
  writeString(36, 'data');
  view.setUint32(40, dataSize, true);
  
  // Convert audio data
  let offset = 44;
  for (let i = 0; i < length; i++) {
    for (let channel = 0; channel < numberOfChannels; channel++) {
      const sample = Math.max(-1, Math.min(1, buffer.getChannelData(channel)[i]));
      view.setInt16(offset, sample * 0x7FFF, true);
      offset += 2;
    }
  }
  
  return arrayBuffer;
};