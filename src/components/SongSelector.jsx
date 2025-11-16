import { useState } from 'react';
import { SAMPLE_SONGS } from '../utils/noteMapping';

const SongSelector = ({ onSongSelect, onYouTubeSubmit }) => {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [activeTab, setActiveTab] = useState('samples');

  return (
    <div style={{
      backgroundColor: '#1e1e1e',
      padding: '20px',
      borderRadius: '10px',
      marginBottom: '20px'
    }}>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button
          onClick={() => setActiveTab('samples')}
          style={{
            padding: '10px 20px',
            backgroundColor: activeTab === 'samples' ? '#3b82f6' : '#374151',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Sample Songs
        </button>
        <button
          onClick={() => setActiveTab('youtube')}
          style={{
            padding: '10px 20px',
            backgroundColor: activeTab === 'youtube' ? '#3b82f6' : '#374151',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          YouTube URL
        </button>
      </div>

      {activeTab === 'samples' && (
        <div>
          <h3 style={{ color: '#fff', marginBottom: '15px' }}>Choose a Song:</h3>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {Object.entries(SAMPLE_SONGS).map(([key, song]) => (
              <button
                key={key}
                onClick={() => onSongSelect(key)}
                style={{
                  padding: '15px 25px',
                  backgroundColor: '#4b5563',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#6b7280'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#4b5563'}
              >
                {song.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'youtube' && (
        <div>
          <h3 style={{ color: '#fff', marginBottom: '15px' }}>
            Enter YouTube URL:
          </h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '6px',
                border: '1px solid #4b5563',
                backgroundColor: '#374151',
                color: '#fff',
                fontSize: '14px'
              }}
            />
            <button
              onClick={() => onYouTubeSubmit(youtubeUrl)}
              style={{
                padding: '12px 24px',
                backgroundColor: '#ef4444',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Load
            </button>
          </div>
          <p style={{
            color: '#9ca3af',
            fontSize: '12px',
            marginTop: '10px'
          }}>
            Note: YouTube integration requires backend processing to extract notes.
            For now, this will use sample data.
          </p>
        </div>
      )}
    </div>
  );
};

export default SongSelector;
