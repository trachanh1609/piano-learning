import { FINGER_NAMES, HAND_NAMES } from '../utils/noteMapping';

const NoteSheet = ({ notes = [], currentIndex = 0 }) => {
  const visibleNotes = notes.slice(
    Math.max(0, currentIndex - 2),
    currentIndex + 8
  );
  const startIndex = Math.max(0, currentIndex - 2);

  const getHandColor = (hand) => {
    if (hand === 'left') return '#3b82f6';
    if (hand === 'right') return '#10b981';
    return '#a855f7'; // both
  };

  return (
    <div style={{
      backgroundColor: '#1e1e1e',
      padding: '20px',
      borderRadius: '10px',
      marginBottom: '20px'
    }}>
      <h3 style={{ margin: '0 0 15px 0', color: '#fff' }}>
        Note Sheet - Progress: {currentIndex}/{notes.length}
      </h3>

      <div style={{
        display: 'flex',
        gap: '10px',
        overflowX: 'auto',
        padding: '10px 0'
      }}>
        {visibleNotes.map((noteData, idx) => {
          const actualIndex = startIndex + idx;
          const isCurrent = actualIndex === currentIndex;
          const isPast = actualIndex < currentIndex;
          const isChord = noteData.notes && noteData.notes.length > 1;

          return (
            <div
              key={actualIndex}
              style={{
                minWidth: isChord ? '100px' : '80px',
                padding: '15px',
                backgroundColor: isCurrent ? '#3b82f6' : isPast ? '#166534' : '#374151',
                borderRadius: '8px',
                textAlign: 'center',
                border: isCurrent ? '3px solid #60a5fa' : '2px solid transparent',
                opacity: isPast ? 0.6 : 1,
                transition: 'all 0.3s ease'
              }}
            >
              {/* Hand indicator */}
              <div style={{
                fontSize: '10px',
                color: getHandColor(noteData.hand),
                marginBottom: '5px',
                fontWeight: 'bold'
              }}>
                {noteData.hand === 'left' ? 'L' : noteData.hand === 'right' ? 'R' : 'L+R'}
              </div>

              {/* Notes display */}
              <div style={{
                fontSize: isChord ? '18px' : '24px',
                fontWeight: 'bold',
                color: '#fff',
                marginBottom: '8px'
              }}>
                {noteData.notes ? (
                  isChord ? (
                    <div style={{ lineHeight: '1.2' }}>
                      {noteData.notes.map((note, i) => (
                        <div key={i}>{note}</div>
                      ))}
                    </div>
                  ) : (
                    noteData.notes[0]
                  )
                ) : (
                  noteData.note
                )}
              </div>

              {/* Finger indicators */}
              <div style={{
                fontSize: '11px',
                color: '#9ca3af'
              }}>
                {noteData.fingers ? (
                  isChord ? (
                    <span>Fingers: {noteData.fingers.join(', ')}</span>
                  ) : (
                    <span>Finger {noteData.fingers[0]}</span>
                  )
                ) : (
                  <span>Finger {noteData.finger}</span>
                )}
              </div>

              {/* Finger names */}
              <div style={{
                fontSize: '9px',
                color: '#6b7280',
                marginTop: '4px'
              }}>
                {noteData.fingers ? (
                  noteData.fingers.map(f => FINGER_NAMES[f]).join(', ')
                ) : (
                  FINGER_NAMES[noteData.finger]
                )}
              </div>

              {isPast && (
                <div style={{
                  marginTop: '8px',
                  color: '#4ade80',
                  fontSize: '20px'
                }}>
                  ✓
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{
        marginTop: '15px',
        height: '6px',
        backgroundColor: '#374151',
        borderRadius: '3px',
        overflow: 'hidden'
      }}>
        <div style={{
          height: '100%',
          width: `${(currentIndex / notes.length) * 100}%`,
          backgroundColor: '#4ade80',
          transition: 'width 0.3s ease'
        }} />
      </div>
    </div>
  );
};

export default NoteSheet;
