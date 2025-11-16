# Piano Learning App

A web-based piano learning application similar to Yousician. Learn to play piano with real-time pitch detection and visual feedback.

## Features

- **Interactive Piano Keyboard**: Visual representation of a 3-octave piano
- **Note Sheet Display**: Shows upcoming notes with finger position indicators
- **Real-time Pitch Detection**: Listens to your piano/keyboard via microphone
- **YouTube Integration**: Load songs from YouTube URLs (matches common piano tutorial titles)
- **Finger Position Guidance**: Numbers on keys indicate which finger to use (1-5)
- **Progress Tracking**: Score system and song completion counter
- **Sample Songs**: Includes Twinkle Twinkle, Mary Had a Little Lamb, Ode to Joy

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- A microphone (for pitch detection)

### Installation

```bash
npm install
```

### Running the Application

You need to run both the backend server and frontend:

**Option 1: Run both together**
```bash
npm run dev:all
```

**Option 2: Run separately (in two terminals)**

Terminal 1 - Backend Server:
```bash
npm run dev:server
```

Terminal 2 - Frontend:
```bash
npm run dev
```

The frontend runs on `http://localhost:5173` and the backend API on `http://localhost:3001`.

### Building for Production

```bash
npm run build
```

## How to Use

1. **Select a Song**: Choose from sample songs or enter a YouTube URL
2. **Click Start**: The app will request microphone access
3. **Follow the Notes**: The piano highlights which key to press with finger numbers
4. **Play Your Piano**: The app listens and advances when you play the correct note
5. **Track Progress**: Watch your score increase and complete songs

## YouTube Integration

The app supports YouTube URLs for piano tutorials. It matches video titles to generate appropriate notes for:

- Twinkle Twinkle Little Star
- Mary Had a Little Lamb
- Ode to Joy (Beethoven)
- Happy Birthday
- Für Elise
- Chopsticks
- Jingle Bells
- And more...

If no match is found, it generates a C Major scale exercise.

## Technical Stack

- **Frontend**: React + Vite
- **Backend**: Express.js
- **Audio Processing**: Web Audio API + pitchy library
- **YouTube Processing**: @distube/ytdl-core
- **Sound Synthesis**: Tone.js

## Project Structure

```
piano-learning/
├── src/
│   ├── components/
│   │   ├── Piano.jsx        # Interactive piano keyboard
│   │   ├── NoteSheet.jsx    # Note display component
│   │   └── SongSelector.jsx # Song selection UI
│   ├── hooks/
│   │   └── usePitchDetection.js # Audio input hook
│   ├── utils/
│   │   └── noteMapping.js   # Note frequencies and songs
│   ├── App.jsx              # Main application
│   └── main.jsx             # Entry point
├── server/
│   └── index.js             # Backend API server
└── package.json
```

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/video-info?url=<youtube-url>` - Get YouTube video info
- `POST /api/process-video` - Process YouTube video and extract notes

## Future Enhancements

- Actual audio-to-MIDI transcription using ML models
- MIDI keyboard support
- More sophisticated finger position algorithms
- Rhythm/timing detection
- Multiple difficulty levels
- User accounts and progress saving
