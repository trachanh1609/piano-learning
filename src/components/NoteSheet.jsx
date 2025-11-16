import { FINGER_NAMES } from '../utils/noteMapping';

const NoteSheet = ({ notes = [], currentIndex = 0 }) => {
  const visibleNotes = notes.slice(
    Math.max(0, currentIndex - 2),
    currentIndex + 8
  );
  const startIndex = Math.max(0, currentIndex - 2);

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

          return (
            <div
              key={actualIndex}
              style={{
                minWidth: '80px',
                padding: '15px',
                backgroundColor: isCurrent ? '#3b82f6' : isPast ? '#166534' : '#374151',
                borderRadius: '8px',
                textAlign: 'center',
                border: isCurrent ? '3px solid #60a5fa' : '2px solid transparent',
                opacity: isPast ? 0.6 : 1,
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#fff',
                marginBottom: '8px'
              }}>
                {noteData.note}
              </div>
              <div style={{
                fontSize: '12px',
                color: '#9ca3af'
              }}>
                Finger {noteData.finger}
              </div>
              <div style={{
                fontSize: '10px',
                color: '#6b7280',
                marginTop: '4px'
              }}>
                {FINGER_NAMES[noteData.finger]}
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
