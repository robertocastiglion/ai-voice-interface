import React from 'react';
import { Mic, MicOff, Sparkles, Loader2, Volume2, VolumeX, MessageSquarePlus, StopCircle } from 'lucide-react';
import { useVoiceAssistant } from '../hooks/useVoiceAssistant';
import type { VoiceSettings } from '../types';

interface VoiceInterfaceProps {
  isRecording: boolean;
  onToggleRecording: () => void;
  onTranscriptReceived: (transcript: string) => void;
  settings: VoiceSettings;
  onSettingsChange: (settings: VoiceSettings) => void;
  onTransferToNotes: (text: string) => void;
}

export const VoiceInterface = ({ 
  isRecording, 
  onToggleRecording,
  onTranscriptReceived,
  settings,
  onSettingsChange,
  onTransferToNotes
}: VoiceInterfaceProps) => {
  const { 
    transcript, 
    aiResponse, 
    isProcessing,
    startListening, 
    stopListening,
    stopAudio
  } = useVoiceAssistant(settings);

  const handleToggleRecording = () => {
    if (isRecording) {
      stopListening();
    } else {
      startListening();
    }
    onToggleRecording();
  };

  const toggleAudioResponse = () => {
    if (settings.useAudioResponse) {
      stopAudio();
    }
    onSettingsChange({ ...settings, useAudioResponse: !settings.useAudioResponse });
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-purple-500/20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-white flex items-center">
          <Sparkles className="w-5 h-5 mr-2 text-purple-400" />
          AI Assistant
        </h2>
        <div className="flex gap-2">
          {settings.useAudioResponse && (
            <button
              onClick={stopAudio}
              className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors"
              title="Stop audio"
            >
              <StopCircle className="w-5 h-5 text-red-400" />
            </button>
          )}
          <button
            onClick={toggleAudioResponse}
            className="p-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 transition-colors"
            title={settings.useAudioResponse ? "Disable voice response" : "Enable voice response"}
          >
            {settings.useAudioResponse ? (
              <Volume2 className="w-5 h-5 text-purple-400" />
            ) : (
              <VolumeX className="w-5 h-5 text-purple-400" />
            )}
          </button>
        </div>
      </div>
      
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
        <button
          onClick={handleToggleRecording}
          disabled={isProcessing}
          className="relative w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-medium py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
        >
          {isRecording ? (
            <>
              <MicOff className="w-6 h-6" />
              <span>Stop Recording</span>
            </>
          ) : (
            <>
              <Mic className="w-6 h-6" />
              <span>Start Recording</span>
            </>
          )}
        </button>
      </div>

      <div className="mt-6 space-y-4">
        <div className="bg-black/20 rounded-lg p-4 h-32 overflow-y-auto text-white">
          <p className="text-gray-400 mb-2">You said:</p>
          <p className="whitespace-pre-wrap">{transcript}</p>
        </div>

        <div className="bg-black/20 rounded-lg p-4 h-32 overflow-y-auto text-white relative group">
          <div className="flex justify-between items-center mb-2">
            <p className="text-gray-400">AI Response:</p>
            {aiResponse && (
              <button
                onClick={() => onTransferToNotes(aiResponse)}
                className="p-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 transition-colors"
                title="Transfer to notes"
              >
                <MessageSquarePlus className="w-4 h-4 text-purple-400" />
              </button>
            )}
          </div>
          {isProcessing ? (
            <div className="flex items-center justify-center h-16">
              <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
            </div>
          ) : (
            <p className="whitespace-pre-wrap">{aiResponse}</p>
          )}
        </div>
      </div>
    </div>
  );
};