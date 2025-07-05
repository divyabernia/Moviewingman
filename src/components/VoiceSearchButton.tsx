import React, { useState } from 'react';
import { Mic, MicOff, Loader2, Volume2, AlertCircle } from 'lucide-react';
import { useVoiceRecording } from '../hooks/useVoiceRecording';
import { transcribeAudio } from '../services/huggingface';

interface VoiceSearchButtonProps {
  onTranscription: (text: string) => void;
  disabled?: boolean;
}

export const VoiceSearchButton: React.FC<VoiceSearchButtonProps> = ({
  onTranscription,
  disabled = false,
}) => {
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionError, setTranscriptionError] = useState<string | null>(null);
  
  const {
    isRecording,
    isProcessing,
    error: recordingError,
    startRecording,
    stopRecording,
    clearError,
  } = useVoiceRecording();

  const handleVoiceSearch = async () => {
    if (isRecording) {
      // Stop recording and transcribe
      try {
        console.log('Stopping recording and starting transcription...');
        setIsTranscribing(true);
        setTranscriptionError(null);
        
        const audioBlob = await stopRecording();
        
        if (audioBlob) {
          console.log('Audio blob received for transcription:', audioBlob.size, 'bytes');
          const transcription = await transcribeAudio(audioBlob);
          console.log('Transcription received:', transcription);
          if (transcription.trim()) {
            console.log('Calling onTranscription with:', transcription.trim());
            onTranscription(transcription.trim());
          } else {
            setTranscriptionError('No speech detected. Please try again.');
          }
          // Clear any previous errors on successful transcription
          setTranscriptionError(null);
        } else {
          setTranscriptionError('No audio recorded. Please try again.');
        }
      } catch (error) {
        console.error('Transcription error:', error);
        setTranscriptionError(error instanceof Error ? error.message : 'Failed to transcribe audio');
      } finally {
        setIsTranscribing(false);
      }
    } else {
      // Start recording
      console.log('Starting voice recording...');
      clearError();
      setTranscriptionError(null);
      await startRecording();
    }
  };

  const isLoading = isProcessing || isTranscribing;
  const hasError = recordingError || transcriptionError;

  return (
    <div className="relative flex-shrink-0">
      <button
        onClick={handleVoiceSearch}
        disabled={disabled || isLoading}
        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-200 transform hover:scale-105 border flex-shrink-0 ${
          isRecording
            ? 'bg-gradient-to-r from-red-600 to-red-500 text-white border-red-500/50 animate-pulse shadow-lg shadow-red-500/25'
            : hasError
            ? 'bg-gradient-to-r from-red-600/20 to-red-500/20 text-red-400 border-red-500/30 hover:from-red-600/30 hover:to-red-500/30'
            : 'bg-gradient-to-r from-red-600/20 to-red-500/20 text-red-400 border-red-500/30 hover:from-red-600/30 hover:to-red-500/30 hover:text-red-300'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        title={isRecording ? 'Click to stop recording' : 'Click to start voice search'}
      >
        {isLoading ? (
          <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
        ) : isRecording ? (
          <MicOff className="w-3 h-3 sm:w-4 sm:h-4" />
        ) : hasError ? (
          <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
        ) : (
          <Mic className="w-3 h-3 sm:w-4 sm:h-4" />
        )}
        
        {/* Recording indicator */}
        {isRecording && (
          <div className="absolute -top-0.5 -right-0.5 w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-pulse"></div>
        )}
      </button>

      {/* Status tooltip */}
      {(isRecording || isTranscribing || hasError) && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 sm:px-3 py-1 sm:py-2 bg-black/90 backdrop-blur-sm text-white text-xs sm:text-sm rounded-lg border border-red-800/30 whitespace-nowrap z-20 max-w-48">
          {isRecording && (
            <div className="flex items-center gap-2">
              <Volume2 className="w-3 h-3 sm:w-4 sm:h-4 text-red-400" />
              <span>Listening...</span>
            </div>
          )}
          {isTranscribing && (
            <div className="flex items-center gap-2">
              <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin text-blue-400" />
              <span>Transcribing...</span>
            </div>
          )}
          {hasError && (
            <div className="flex items-center gap-2 text-red-300">
              <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="truncate">{recordingError || transcriptionError}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};