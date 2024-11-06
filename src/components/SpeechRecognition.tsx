import React, { useState, useEffect, useCallback } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Trash2 } from 'lucide-react';

interface SpeechRecognitionProps {
  onTranscript: (text: string) => void;
  onError: (error: string) => void;
}

const SpeechRecognitionComponent: React.FC<SpeechRecognitionProps> = ({ onTranscript, onError }) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);

  useEffect(() => {
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result) => result.transcript)
          .join('');
        onTranscript(transcript);
      };

      recognitionInstance.onerror = (event: any) => {
        if (event.error === 'no-speech') {
          onError('No speech detected. Please try speaking again.');
        } else if (event.error === 'aborted') {
          onError('Speech recognition was aborted. Please try again.');
        } else {
          onError(`Error: ${event.error}`);
        }
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        if (isListening) {
          recognitionInstance.start();
        }
      };

      setRecognition(recognitionInstance);
    } else {
      onError('Speech recognition is not supported in this browser.');
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [onTranscript, onError]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      recognition?.stop();
      setIsListening(false);
    } else {
      try {
        recognition?.start();
        setIsListening(true);
      } catch (error) {
        onError('Failed to start speech recognition. Please try again.');
      }
    }
  }, [isListening, recognition, onError]);

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
  };

  return (
    <div className="flex gap-4">
      <button
        onClick={toggleListening}
        className={`p-3 rounded-full transition-all duration-300 ${
          isListening
            ? 'bg-red-500 hover:bg-red-600'
            : 'bg-blue-500 hover:bg-blue-600'
        }`}
        title={isListening ? 'Stop listening' : 'Start listening'}
      >
        {isListening ? (
          <MicOff className="w-6 h-6 text-white" />
        ) : (
          <Mic className="w-6 h-6 text-white" />
        )}
      </button>
      <button
        onClick={toggleAudio}
        className={`p-3 rounded-full transition-all duration-300 ${
          audioEnabled
            ? 'bg-green-500 hover:bg-green-600'
            : 'bg-gray-500 hover:bg-gray-600'
        }`}
        title={audioEnabled ? 'Disable audio' : 'Enable audio'}
      >
        {audioEnabled ? (
          <Volume2 className="w-6 h-6 text-white" />
        ) : (
          <VolumeX className="w-6 h-6 text-white" />
        )}
      </button>
    </div>
  );
};

export default SpeechRecognitionComponent;