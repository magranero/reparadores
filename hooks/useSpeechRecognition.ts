import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import * as Speech from 'expo-speech';

interface SpeechRecognitionHook {
  isListening: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  hasRecognitionSupport: boolean;
  isInitializing: boolean;
}

// Define the SpeechRecognition types for web
interface SpeechRecognition extends EventTarget {
  start(): void;
  stop(): void;
  abort(): void;
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onend: ((event: Event) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onstart: ((event: Event) => void) | null;
}

// Define the global type for web
declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
  }
}

export function useSpeechRecognition(): SpeechRecognitionHook {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [hasRecognitionSupport, setHasRecognitionSupport] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  
  // Web implementation using SpeechRecognition API
  const webSpeechRecognition = Platform.OS === 'web' 
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null;
  
  // Initialize when component mounts
  useEffect(() => {
    // Check for speech recognition support
    const checkSupport = async () => {
      // For web, check if the SpeechRecognition API is available
      if (Platform.OS === 'web' && webSpeechRecognition) {
        setHasRecognitionSupport(true);
      } 
      // For native platforms, we'll say it's supported and provide alternative flow
      else if (Platform.OS !== 'web') {
        setHasRecognitionSupport(true);
      } else {
        setHasRecognitionSupport(false);
      }
      setIsInitializing(false);
    };
    
    checkSupport();
    
    return () => {
      // Clean up
      if (isListening) {
        stopListening();
      }
    };
  }, []);
  
  // Initialize SpeechRecognition on web when needed
  let recognitionInstance: SpeechRecognition | null = null;
  
  if (Platform.OS === 'web' && webSpeechRecognition) {
    if (!recognitionInstance) {
      recognitionInstance = new webSpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';
      
      if (recognitionInstance) {
        recognitionInstance.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('');
          
          setTranscript(transcript);
        };
        
        recognitionInstance.onend = () => {
          setIsListening(false);
        };
        
        recognitionInstance.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };
      }
    }
  }
  
  const startListening = () => {
    setIsListening(true);
    
    if (Platform.OS === 'web' && recognitionInstance) {
      try {
        recognitionInstance.start();
      } catch (error) {
        console.error('Error starting recognition:', error);
      }
    } else if (Platform.OS !== 'web') {
      // For native platforms, we'll simulate listening by showing a "listening" state
      // This is a placeholder as we don't have a direct Speech-to-Text API in expo-speech
      // In a real app, you'd integrate with a platform-specific speech recognition solution
      console.log('Native speech recognition would start here');
    }
  };
  
  const stopListening = () => {
    setIsListening(false);
    
    if (Platform.OS === 'web' && recognitionInstance) {
      recognitionInstance.stop();
    } else if (Platform.OS !== 'web') {
      // Stop native speech recognition
      console.log('Native speech recognition would stop here');
    }
  };
  
  const resetTranscript = () => {
    setTranscript('');
  };
  
  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    hasRecognitionSupport,
    isInitializing,
  };
}