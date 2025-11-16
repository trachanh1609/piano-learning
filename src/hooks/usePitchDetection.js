import { useState, useEffect, useRef } from 'react';
import { PitchDetector } from 'pitchy';
import { frequencyToNote } from '../utils/noteMapping';

export const usePitchDetection = () => {
  const [isListening, setIsListening] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);
  const [currentFrequency, setCurrentFrequency] = useState(null);
  const [clarity, setClarity] = useState(0);
  const [error, setError] = useState(null);

  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);
  const animationFrameRef = useRef(null);
  const detectorRef = useRef(null);

  const startListening = async () => {
    try {
      setError(null);

      // Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false
        }
      });
      streamRef.current = stream;

      // Create audio context
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioContext;

      // Create analyser
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      analyserRef.current = analyser;

      // Connect microphone to analyser
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      // Create pitch detector
      detectorRef.current = PitchDetector.forFloat32Array(analyser.fftSize);

      setIsListening(true);

      // Start detection loop
      const detectPitch = () => {
        if (!analyserRef.current || !detectorRef.current) return;

        const buffer = new Float32Array(analyserRef.current.fftSize);
        analyserRef.current.getFloatTimeDomainData(buffer);

        const [pitch, clarityValue] = detectorRef.current.findPitch(
          buffer,
          audioContextRef.current.sampleRate
        );

        setClarity(clarityValue);

        if (clarityValue > 0.9 && pitch > 100 && pitch < 2000) {
          setCurrentFrequency(pitch);
          const note = frequencyToNote(pitch);
          setCurrentNote(note);
        } else {
          setCurrentNote(null);
          setCurrentFrequency(null);
        }

        animationFrameRef.current = requestAnimationFrame(detectPitch);
      };

      detectPitch();

    } catch (err) {
      setError(err.message || 'Failed to access microphone');
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
    }

    setIsListening(false);
    setCurrentNote(null);
    setCurrentFrequency(null);
    setClarity(0);
  };

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, []);

  return {
    isListening,
    currentNote,
    currentFrequency,
    clarity,
    error,
    startListening,
    stopListening
  };
};
