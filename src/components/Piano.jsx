import { useEffect, useRef } from 'react';
import * as Tone from 'tone';
import { generatePianoKeys, FINGER_NAMES } from '../utils/noteMapping';

const Piano = ({
  activeNote = null,
  targetNote = null,
  targetFinger = null,
  onKeyClick = () => {},
  showFingers = true
}) => {
  const synthRef = useRef(null);
  const keys = generatePianoKeys(3, 5);

  useEffect(() => {
    synthRef.current = new Tone.Synth().toDestination();
    return () => {
      if (synthRef.current) {
        synthRef.current.dispose();
      }
    };
  }, []);

  const playNote = (note) => {
    if (synthRef.current) {
      synthRef.current.triggerAttackRelease(note, '8n');
    }
    onKeyClick(note);
  };

  const getKeyStyle = (key) => {
    const isActive = activeNote === key.note;
    const isTarget = targetNote === key.note;

    if (key.isBlack) {
      return {
        width: '30px',
        height: '100px',
        backgroundColor: isActive ? '#4ade80' : isTarget ? '#fbbf24' : '#1a1a1a',
        color: '#fff',
        position: 'absolute',
        zIndex: 2,
        borderRadius: '0 0 4px 4px',
        border: isTarget ? '2px solid #f59e0b' : '1px solid #333',
        boxShadow: isActive ? '0 0 10px #4ade80' : 'none',
        transition: 'all 0.1s ease'
      };
    }

    return {
      width: '40px',
      height: '160px',
      backgroundColor: isActive ? '#86efac' : isTarget ? '#fef3c7' : '#fff',
      border: isTarget ? '3px solid #f59e0b' : '1px solid #ccc',
      borderRadius: '0 0 6px 6px',
      boxShadow: isActive ? '0 0 15px #4ade80' : '0 2px 4px rgba(0,0,0,0.2)',
      transition: 'all 0.1s ease'
    };
  };

  const getBlackKeyOffset = (note) => {
    const offsets = {
      'C#': 25,
      'D#': 65,
      'F#': 145,
      'G#': 185,
      'A#': 225
    };
    const noteName = note.replace(/[0-9]/g, '');
    return offsets[noteName] || 0;
  };

  const renderOctave = (octaveKeys, octaveNum) => {
    const whiteKeys = octaveKeys.filter(k => !k.isBlack);
    const blackKeys = octaveKeys.filter(k => k.isBlack);

    return (
      <div key={octaveNum} style={{ position: 'relative', display: 'inline-block' }}>
        {/* White keys */}
        <div style={{ display: 'flex' }}>
          {whiteKeys.map(key => (
            <button
              key={key.note}
              onClick={() => playNote(key.note)}
              style={getKeyStyle(key)}
            >
              <div style={{
                position: 'absolute',
                bottom: '10px',
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '10px',
                color: '#666'
              }}>
                {key.note}
              </div>
              {showFingers && targetNote === key.note && targetFinger && (
                <div style={{
                  position: 'absolute',
                  top: '40%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: '#f59e0b',
                  color: '#fff',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}>
                  {targetFinger}
                </div>
              )}
            </button>
          ))}
        </div>
        {/* Black keys */}
        {blackKeys.map(key => {
          const offset = getBlackKeyOffset(key.note);
          return (
            <button
              key={key.note}
              onClick={() => playNote(key.note)}
              style={{
                ...getKeyStyle(key),
                left: `${offset}px`
              }}
            >
              {showFingers && targetNote === key.note && targetFinger && (
                <div style={{
                  position: 'absolute',
                  top: '30%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: '#f59e0b',
                  color: '#fff',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '12px'
                }}>
                  {targetFinger}
                </div>
              )}
            </button>
          );
        })}
      </div>
    );
  };

  // Group keys by octave
  const octaves = {};
  keys.forEach(key => {
    const octave = key.note.match(/\d+/)[0];
    if (!octaves[octave]) octaves[octave] = [];
    octaves[octave].push(key);
  });

  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#2a2a2a',
      borderRadius: '10px',
      display: 'inline-block'
    }}>
      <div style={{ display: 'flex' }}>
        {Object.entries(octaves).map(([octaveNum, octaveKeys]) =>
          renderOctave(octaveKeys, octaveNum)
        )}
      </div>
      {showFingers && targetFinger && (
        <div style={{
          marginTop: '15px',
          textAlign: 'center',
          color: '#f59e0b',
          fontSize: '16px'
        }}>
          Use your <strong>{FINGER_NAMES[targetFinger]}</strong> (finger {targetFinger})
        </div>
      )}
    </div>
  );
};

export default Piano;
