import { useState, useEffect, useRef } from 'react';
import Piano from './components/Piano';
import NoteSheet from './components/NoteSheet';
import SongSelector from './components/SongSelector';
import { usePitchDetection } from './hooks/usePitchDetection';
import { SAMPLE_SONGS } from './utils/noteMapping';
import './App.css';

function App() {
  const [currentSong, setCurrentSong] = useState(null);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [completedSongs, setCompletedSongs] = useState(0);

  const {
    isListening,
    currentNote,
    detectedNotes,
    clarity,
    error,
    startListening,
    stopListening,
    checkNotesMatch
  } = usePitchDetection();

  const lastCorrectTimeRef = useRef(0);

  // Check if the played note(s) match the target
  useEffect(() => {
    if (!isPlaying || !currentSong || detectedNotes.length === 0) return;

    const targetNoteData = currentSong.notes[currentNoteIndex];
    if (!targetNoteData) return;

    const now = Date.now();
    // Debounce to prevent multiple triggers
    if (now - lastCorrectTimeRef.current < 300) return;

    // Get target notes (support both old and new format)
    const targetNotes = targetNoteData.notes || [targetNoteData.note];

    // Check if all target notes are matched
    const isMatch = checkNotesMatch(targetNotes);

    if (isMatch) {
      lastCorrectTimeRef.current = now;
      // More points for chords
      const pointsEarned = targetNotes.length * 10;
      setScore(prev => prev + pointsEarned);

      if (targetNotes.length > 1) {
        setFeedback(`Chord correct! +${pointsEarned} 🎵`);
      } else {
        setFeedback('Correct! +10 🎵');
      }
      setShowFeedback(true);

      setTimeout(() => setShowFeedback(false), 500);

      // Move to next note
      if (currentNoteIndex < currentSong.notes.length - 1) {
        setCurrentNoteIndex(prev => prev + 1);
      } else {
        // Song completed
        setIsPlaying(false);
        setFeedback('🎉 Song Completed! Great job!');
        setShowFeedback(true);
        setCompletedSongs(prev => prev + 1);
        stopListening();
      }
    }
  }, [detectedNotes, currentNoteIndex, currentSong, isPlaying, checkNotesMatch, stopListening]);

  const handleSongSelect = (songKey) => {
    const song = SAMPLE_SONGS[songKey];
    setCurrentSong(song);
    setCurrentNoteIndex(0);
    setIsPlaying(false);
    setFeedback('');
    setShowFeedback(false);
  };

  const handleYouTubeSubmit = (songData) => {
    // songData comes from the backend API with { name, notes, duration }
    setCurrentSong(songData);
    setCurrentNoteIndex(0);
    setIsPlaying(false);
    setFeedback(`Loaded: ${songData.name} (${songData.notes.length} notes)`);
    setShowFeedback(true);
    setTimeout(() => setShowFeedback(false), 2000);
  };

  const handleStart = async () => {
    if (!currentSong) {
      setFeedback('Please select a song first!');
      setShowFeedback(true);
      return;
    }

    await startListening();
    setIsPlaying(true);
    setCurrentNoteIndex(0);
    setFeedback('Listen to the microphone... Play the highlighted note!');
    setShowFeedback(true);
    setTimeout(() => setShowFeedback(false), 2000);
  };

  const handleStop = () => {
    setIsPlaying(false);
    stopListening();
    setFeedback('Paused');
    setShowFeedback(true);
  };

  const handleReset = () => {
    setCurrentNoteIndex(0);
    setScore(0);
    setIsPlaying(false);
    stopListening();
    setFeedback('Reset!');
    setShowFeedback(true);
    setTimeout(() => setShowFeedback(false), 1000);
  };

  const currentTarget = currentSong?.notes[currentNoteIndex];

  // Get target notes and fingers (support both old and new format)
  const getTargetNotes = () => {
    if (!currentTarget) return [];
    return currentTarget.notes || [currentTarget.note];
  };

  const getTargetFingers = () => {
    if (!currentTarget) return [];
    return currentTarget.fingers || [currentTarget.finger];
  };

  const getTargetHand = () => {
    if (!currentTarget) return 'right';
    return currentTarget.hand || 'right';
  };

  return (
    <div className="app">
      <header className="header">
        <h1>🎹 Piano Learning</h1>
        <div className="stats">
          <span>Score: {score}</span>
          <span>Songs Completed: {completedSongs}</span>
        </div>
      </header>

      <main className="main-content">
        <SongSelector
          onSongSelect={handleSongSelect}
          onYouTubeSubmit={handleYouTubeSubmit}
        />

        {currentSong && (
          <>
            <div className="song-info">
              <h2>Now Playing: {currentSong.name}</h2>
              {currentSong.difficulty && (
                <span className={`difficulty ${currentSong.difficulty.toLowerCase()}`}>
                  {currentSong.difficulty}
                </span>
              )}
              <div className="controls">
                {!isPlaying ? (
                  <button onClick={handleStart} className="btn-start">
                    {currentNoteIndex === 0 ? 'Start' : 'Resume'}
                  </button>
                ) : (
                  <button onClick={handleStop} className="btn-stop">
                    Pause
                  </button>
                )}
                <button onClick={handleReset} className="btn-reset">
                  Reset
                </button>
              </div>
            </div>

            <NoteSheet
              notes={currentSong.notes}
              currentIndex={currentNoteIndex}
            />

            <div className="piano-container">
              <Piano
                activeNotes={detectedNotes}
                targetNotes={getTargetNotes()}
                targetFingers={getTargetFingers()}
                targetHand={getTargetHand()}
                showFingers={true}
              />
            </div>

            {isListening && (
              <div className="listening-indicator">
                <div className="pulse"></div>
                <span>
                  Listening... {detectedNotes.length > 0
                    ? `Detected: ${detectedNotes.join(', ')}`
                    : 'Waiting for input'}
                </span>
                <span className="clarity">Clarity: {(clarity * 100).toFixed(1)}%</span>
              </div>
            )}
          </>
        )}

        {showFeedback && (
          <div className="feedback">
            {feedback}
          </div>
        )}

        {error && (
          <div className="error">
            Error: {error}
          </div>
        )}

        {!currentSong && (
          <div className="welcome">
            <h2>Welcome to Piano Learning!</h2>
            <p>Select a song above to get started.</p>
            <ul>
              <li>The app will highlight which key to press</li>
              <li>Numbers on keys show which finger to use</li>
              <li>L/R indicators show which hand to use</li>
              <li>Chords require playing multiple notes together</li>
              <li>Play the note on your piano or MIDI keyboard</li>
              <li>The app will listen and verify your input</li>
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
