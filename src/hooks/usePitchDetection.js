import { useState, useEffect, useRef } from 'react';
import { PitchDetector } from 'pitchy';
import { frequencyToNote } from '../utils/noteMapping';

export const usePitchDetection = () => {
  const [isListening, setIsListening] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);
  const [detectedNotes, setDetectedNotes] = useState([]); // Recent notes buffer for chord detection
  const [currentFrequency, setCurrentFrequency] = useState(null);
  const [clarity, setClarity] = useState(0);
  const [error, setError] = useState(null);

  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);
  const animationFrameRef = useRef(null);
  const detectorRef = useRef(null);
  const noteHistoryRef = useRef([]); // Keep track of notes over time
  const lastNoteTimeRef = useRef(0);

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

        const now = Date.now();

        if (clarityValue > 0.85 && pitch > 60 && pitch < 2000) {
          setCurrentFrequency(pitch);
          const note = frequencyToNote(pitch);
          setCurrentNote(note);

          if (note) {
            // Add to note history for chord detection
            // Keep notes detected within the last 150ms
            noteHistoryRef.current = noteHistoryRef.current.filter(
              entry => now - entry.time < 150
            );

            // Only add if this note isn't already in the recent history
            if (!noteHistoryRef.current.some(entry => entry.note === note)) {
              noteHistoryRef.current.push({ note, time: now });
            }

            // Update detected notes (unique notes from history)
            const recentNotes = [...new Set(noteHistoryRef.current.map(e => e.note))];
            setDetectedNotes(recentNotes);
            lastNoteTimeRef.current = now;
          }
        } else {
          // Clear notes if no sound detected for a while
          if (now - lastNoteTimeRef.current > 200) {
            setCurrentNote(null);
            setCurrentFrequency(null);
            setDetectedNotes([]);
            noteHistoryRef.current = [];
          }
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
    setDetectedNotes([]);
    setCurrentFrequency(null);
    setClarity(0);
    noteHistoryRef.current = [];
  };

  // Helper to check if all target notes are detected
  const checkNotesMatch = (targetNotes) => {
    if (!targetNotes || targetNotes.length === 0) return false;

    // For single note, just check if it's detected
    if (targetNotes.length === 1) {
      return detectedNotes.includes(targetNotes[0]) || currentNote === targetNotes[0];
    }

    // For chords, check if all target notes are in detected notes
    return targetNotes.every(note => detectedNotes.includes(note));
  };

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, []);

  return {
    isListening,
    currentNote,
    detectedNotes,
    currentFrequency,
    clarity,
    error,
    startListening,
    stopListening,
    checkNotesMatch
  };
};
