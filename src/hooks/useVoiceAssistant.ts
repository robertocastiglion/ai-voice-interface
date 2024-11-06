import { useState, useCallback, useEffect, useRef } from 'react';
import { openai } from '../lib/openai';
import type { VoiceSettings } from '../types';

export const useVoiceAssistant = (settings: VoiceSettings) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const recognition = typeof window !== 'undefined' && window.webkitSpeechRecognition 
    ? new window.webkitSpeechRecognition()
    : null;

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const speakResponse = async (text: string) => {
    if (settings.useAudioResponse) {
      try {
        stopAudio(); // Stop any playing audio before starting new one
        
        const response = await openai.audio.speech.create({
          model: "tts-1",
          voice: "alloy",
          input: text,
        });

        const audioBlob = await response.arrayBuffer();
        const audioUrl = URL.createObjectURL(new Blob([audioBlob], { type: 'audio/mpeg' }));
        
        if (audioRef.current) {
          audioRef.current.src = audioUrl;
          await audioRef.current.play();
        } else {
          const audio = new Audio(audioUrl);
          audioRef.current = audio;
          await audio.play();
        }
      } catch (error) {
        console.error('Error generating speech:', error);
      }
    }
  };

  useEffect(() => {
    if (recognition) {
      recognition.continuous = true;
      recognition.interimResults = false;
      
      recognition.onresult = async (event) => {
        const finalTranscript = event.results[event.results.length - 1][0].transcript;
        setTranscript(finalTranscript);
        
        try {
          setIsProcessing(true);
          const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: finalTranscript }],
            model: "gpt-3.5-turbo",
          });
          
          const response = completion.choices[0]?.message?.content || "I couldn't process that. Please try again.";
          setAiResponse(response);
          await speakResponse(response);
        } catch (error) {
          console.error('OpenAI API error:', error);
          const errorMessage = "Sorry, I encountered an error. Please try again.";
          setAiResponse(errorMessage);
          await speakResponse(errorMessage);
        } finally {
          setIsProcessing(false);
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      stopAudio();
    };
  }, [recognition, settings.useAudioResponse]);

  const startListening = useCallback(() => {
    if (!recognition) {
      console.error('Speech recognition not supported');
      return;
    }
    
    setTranscript('');
    setAiResponse('');
    recognition.start();
    setIsListening(true);
  }, [recognition]);

  const stopListening = useCallback(() => {
    if (!recognition) return;
    recognition.stop();
    setIsListening(false);
  }, [recognition]);

  return {
    isListening,
    transcript,
    aiResponse,
    isProcessing,
    startListening,
    stopListening,
    stopAudio
  };
};