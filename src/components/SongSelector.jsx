import { useState } from 'react';
import { SAMPLE_SONGS } from '../utils/noteMapping';

const SongSelector = ({ onSongSelect, onYouTubeSubmit }) => {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [activeTab, setActiveTab] = useState('samples');
  const [isLoading, setIsLoading] = useState(false);
  const [videoInfo, setVideoInfo] = useState(null);
  const [error, setError] = useState('');

  const handleLoadVideo = async () => {
    if (!youtubeUrl.trim()) {
      setError('Please enter a YouTube URL');
      return;
    }

    setIsLoading(true);
    setError('');
    setVideoInfo(null);

    try {
      // First get video info
      const infoResponse = await fetch(`/api/video-info?url=${encodeURIComponent(youtubeUrl)}`);
      if (!infoResponse.ok) {
        const errorData = await infoResponse.json();
        throw new Error(errorData.error || 'Failed to fetch video info');
      }
      const info = await infoResponse.json();
      setVideoInfo(info);

      // Then process the video
      const processResponse = await fetch('/api/process-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: youtubeUrl })
      });

      if (!processResponse.ok) {
        const errorData = await processResponse.json();
        throw new Error(errorData.error || 'Failed to process video');
      }

      const songData = await processResponse.json();
      onYouTubeSubmit(songData);
    } catch (err) {
      setError(err.message || 'Failed to load video');
    } finally {
      setIsLoading(false);
    }
  };

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
              disabled={isLoading}
            />
            <button
              onClick={handleLoadVideo}
              disabled={isLoading}
              style={{
                padding: '12px 24px',
                backgroundColor: isLoading ? '#6b7280' : '#ef4444',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontWeight: 'bold'
              }}
            >
              {isLoading ? 'Loading...' : 'Load'}
            </button>
          </div>

          {error && (
            <p style={{
              color: '#ef4444',
              fontSize: '14px',
              marginTop: '10px',
              backgroundColor: '#7f1d1d',
              padding: '10px',
              borderRadius: '6px'
            }}>
              {error}
            </p>
          )}

          {videoInfo && (
            <div style={{
              marginTop: '15px',
              backgroundColor: '#374151',
              padding: '15px',
              borderRadius: '8px',
              display: 'flex',
              gap: '15px',
              alignItems: 'center'
            }}>
              {videoInfo.thumbnail && (
                <img
                  src={videoInfo.thumbnail}
                  alt="Video thumbnail"
                  style={{
                    width: '120px',
                    height: '90px',
                    objectFit: 'cover',
                    borderRadius: '6px'
                  }}
                />
              )}
              <div>
                <h4 style={{ color: '#fff', margin: '0 0 5px 0' }}>
                  {videoInfo.title}
                </h4>
                <p style={{ color: '#9ca3af', margin: '0', fontSize: '14px' }}>
                  by {videoInfo.author}
                </p>
                <p style={{ color: '#9ca3af', margin: '5px 0 0 0', fontSize: '12px' }}>
                  Duration: {Math.floor(videoInfo.duration / 60)}:{String(videoInfo.duration % 60).padStart(2, '0')}
                </p>
              </div>
            </div>
          )}

          <p style={{
            color: '#9ca3af',
            fontSize: '12px',
            marginTop: '10px'
          }}>
            Supported songs: Twinkle Twinkle, Mary Had a Little Lamb, Ode to Joy, Happy Birthday,
            Fur Elise, Chopsticks, Jingle Bells, and more. The app will match the video title to
            generate appropriate notes.
          </p>
        </div>
      )}
    </div>
  );
};

export default SongSelector;
