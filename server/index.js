import express from 'express';
import cors from 'cors';
import ytdl from '@distube/ytdl-core';
import { createWriteStream, unlinkSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import { Readable } from 'stream';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Ensure temp directory exists
const tempDir = join(__dirname, 'temp');
if (!existsSync(tempDir)) {
  mkdirSync(tempDir, { recursive: true });
}

// Simple pitch detection based on common piano notes
const NOTE_FREQUENCIES = {
  'C3': 130.81, 'C#3': 138.59, 'D3': 146.83, 'D#3': 155.56, 'E3': 164.81,
  'F3': 174.61, 'F#3': 185.00, 'G3': 196.00, 'G#3': 207.65, 'A3': 220.00,
  'A#3': 233.08, 'B3': 246.94,
  'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13, 'E4': 329.63,
  'F4': 349.23, 'F#4': 369.99, 'G4': 392.00, 'G#4': 415.30, 'A4': 440.00,
  'A#4': 466.16, 'B4': 493.88,
  'C5': 523.25, 'C#5': 554.37, 'D5': 587.33, 'D#5': 622.25, 'E5': 659.25,
  'F5': 698.46, 'F#5': 739.99, 'G5': 783.99, 'G#5': 830.61, 'A5': 880.00,
  'A#5': 932.33, 'B5': 987.77,
  'C6': 1046.50
};

// Finger assignment based on note position (simplified algorithm)
const assignFinger = (note, previousNote) => {
  const noteOrder = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const noteName = note.replace(/[#0-9]/g, '');
  const noteIndex = noteOrder.indexOf(noteName);

  // Simple finger assignment based on scale position
  if (noteName === 'C') return 1; // Thumb
  if (noteName === 'D') return 2; // Index
  if (noteName === 'E') return 3; // Middle
  if (noteName === 'F') return 1; // Thumb (cross under)
  if (noteName === 'G') return 2; // Index
  if (noteName === 'A') return 3; // Middle
  if (noteName === 'B') return 4; // Ring

  // For sharps, use nearby fingers
  if (note.includes('#')) {
    if (noteName === 'C') return 2;
    if (noteName === 'D') return 3;
    if (noteName === 'F') return 2;
    if (noteName === 'G') return 3;
    if (noteName === 'A') return 4;
  }

  return 3; // Default to middle finger
};

// Extract video info
app.get('/api/video-info', async (req, res) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    if (!ytdl.validateURL(url)) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    const info = await ytdl.getInfo(url);

    res.json({
      title: info.videoDetails.title,
      duration: info.videoDetails.lengthSeconds,
      thumbnail: info.videoDetails.thumbnails[0]?.url,
      author: info.videoDetails.author.name
    });
  } catch (error) {
    console.error('Error fetching video info:', error);
    res.status(500).json({ error: 'Failed to fetch video information' });
  }
});

// Process YouTube video and extract notes
app.post('/api/process-video', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    if (!ytdl.validateURL(url)) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    console.log('Processing video:', url);

    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title;
    const duration = parseInt(info.videoDetails.lengthSeconds);

    // For demo purposes, we'll generate notes based on common piano tutorials
    // In production, you'd use actual audio analysis with ML models
    const notes = generateNotesFromTitle(title, duration);

    res.json({
      name: title,
      duration,
      notes
    });
  } catch (error) {
    console.error('Error processing video:', error);
    res.status(500).json({ error: 'Failed to process video' });
  }
});

// Generate notes based on common songs (pattern matching)
const generateNotesFromTitle = (title, duration) => {
  const titleLower = title.toLowerCase();

  // Check for common songs in title
  if (titleLower.includes('twinkle')) {
    return generateTwinkle();
  }
  if (titleLower.includes('mary') && titleLower.includes('lamb')) {
    return generateMaryHadALittleLamb();
  }
  if (titleLower.includes('ode to joy') || titleLower.includes('beethoven')) {
    return generateOdeToJoy();
  }
  if (titleLower.includes('happy birthday')) {
    return generateHappyBirthday();
  }
  if (titleLower.includes('fur elise') || titleLower.includes('für elise')) {
    return generateFurElise();
  }
  if (titleLower.includes('chopsticks')) {
    return generateChopsticks();
  }
  if (titleLower.includes('jingle bells')) {
    return generateJingleBells();
  }

  // Default: generate a simple C major scale exercise
  return generateScaleExercise();
};

const generateTwinkle = () => [
  { note: 'C4', duration: 500, finger: 1 },
  { note: 'C4', duration: 500, finger: 1 },
  { note: 'G4', duration: 500, finger: 5 },
  { note: 'G4', duration: 500, finger: 5 },
  { note: 'A4', duration: 500, finger: 1 },
  { note: 'A4', duration: 500, finger: 1 },
  { note: 'G4', duration: 1000, finger: 5 },
  { note: 'F4', duration: 500, finger: 4 },
  { note: 'F4', duration: 500, finger: 4 },
  { note: 'E4', duration: 500, finger: 3 },
  { note: 'E4', duration: 500, finger: 3 },
  { note: 'D4', duration: 500, finger: 2 },
  { note: 'D4', duration: 500, finger: 2 },
  { note: 'C4', duration: 1000, finger: 1 },
  { note: 'G4', duration: 500, finger: 5 },
  { note: 'G4', duration: 500, finger: 5 },
  { note: 'F4', duration: 500, finger: 4 },
  { note: 'F4', duration: 500, finger: 4 },
  { note: 'E4', duration: 500, finger: 3 },
  { note: 'E4', duration: 500, finger: 3 },
  { note: 'D4', duration: 1000, finger: 2 },
];

const generateMaryHadALittleLamb = () => [
  { note: 'E4', duration: 500, finger: 3 },
  { note: 'D4', duration: 500, finger: 2 },
  { note: 'C4', duration: 500, finger: 1 },
  { note: 'D4', duration: 500, finger: 2 },
  { note: 'E4', duration: 500, finger: 3 },
  { note: 'E4', duration: 500, finger: 3 },
  { note: 'E4', duration: 1000, finger: 3 },
  { note: 'D4', duration: 500, finger: 2 },
  { note: 'D4', duration: 500, finger: 2 },
  { note: 'D4', duration: 1000, finger: 2 },
  { note: 'E4', duration: 500, finger: 3 },
  { note: 'G4', duration: 500, finger: 5 },
  { note: 'G4', duration: 1000, finger: 5 },
  { note: 'E4', duration: 500, finger: 3 },
  { note: 'D4', duration: 500, finger: 2 },
  { note: 'C4', duration: 500, finger: 1 },
  { note: 'D4', duration: 500, finger: 2 },
  { note: 'E4', duration: 500, finger: 3 },
  { note: 'E4', duration: 500, finger: 3 },
  { note: 'E4', duration: 500, finger: 3 },
  { note: 'E4', duration: 500, finger: 3 },
  { note: 'D4', duration: 500, finger: 2 },
  { note: 'D4', duration: 500, finger: 2 },
  { note: 'E4', duration: 500, finger: 3 },
  { note: 'D4', duration: 500, finger: 2 },
  { note: 'C4', duration: 1000, finger: 1 },
];

const generateOdeToJoy = () => [
  { note: 'E4', duration: 500, finger: 3 },
  { note: 'E4', duration: 500, finger: 3 },
  { note: 'F4', duration: 500, finger: 4 },
  { note: 'G4', duration: 500, finger: 5 },
  { note: 'G4', duration: 500, finger: 5 },
  { note: 'F4', duration: 500, finger: 4 },
  { note: 'E4', duration: 500, finger: 3 },
  { note: 'D4', duration: 500, finger: 2 },
  { note: 'C4', duration: 500, finger: 1 },
  { note: 'C4', duration: 500, finger: 1 },
  { note: 'D4', duration: 500, finger: 2 },
  { note: 'E4', duration: 500, finger: 3 },
  { note: 'E4', duration: 750, finger: 3 },
  { note: 'D4', duration: 250, finger: 2 },
  { note: 'D4', duration: 1000, finger: 2 },
  { note: 'E4', duration: 500, finger: 3 },
  { note: 'E4', duration: 500, finger: 3 },
  { note: 'F4', duration: 500, finger: 4 },
  { note: 'G4', duration: 500, finger: 5 },
  { note: 'G4', duration: 500, finger: 5 },
  { note: 'F4', duration: 500, finger: 4 },
  { note: 'E4', duration: 500, finger: 3 },
  { note: 'D4', duration: 500, finger: 2 },
  { note: 'C4', duration: 500, finger: 1 },
  { note: 'C4', duration: 500, finger: 1 },
  { note: 'D4', duration: 500, finger: 2 },
  { note: 'E4', duration: 500, finger: 3 },
  { note: 'D4', duration: 750, finger: 2 },
  { note: 'C4', duration: 250, finger: 1 },
  { note: 'C4', duration: 1000, finger: 1 },
];

const generateHappyBirthday = () => [
  { note: 'G4', duration: 300, finger: 5 },
  { note: 'G4', duration: 300, finger: 5 },
  { note: 'A4', duration: 600, finger: 1 },
  { note: 'G4', duration: 600, finger: 5 },
  { note: 'C5', duration: 600, finger: 3 },
  { note: 'B4', duration: 1200, finger: 2 },
  { note: 'G4', duration: 300, finger: 5 },
  { note: 'G4', duration: 300, finger: 5 },
  { note: 'A4', duration: 600, finger: 1 },
  { note: 'G4', duration: 600, finger: 5 },
  { note: 'D5', duration: 600, finger: 4 },
  { note: 'C5', duration: 1200, finger: 3 },
  { note: 'G4', duration: 300, finger: 5 },
  { note: 'G4', duration: 300, finger: 5 },
  { note: 'G5', duration: 600, finger: 5 },
  { note: 'E5', duration: 600, finger: 3 },
  { note: 'C5', duration: 600, finger: 1 },
  { note: 'B4', duration: 600, finger: 4 },
  { note: 'A4', duration: 1200, finger: 3 },
];

const generateFurElise = () => [
  { note: 'E5', duration: 300, finger: 5 },
  { note: 'D#5', duration: 300, finger: 4 },
  { note: 'E5', duration: 300, finger: 5 },
  { note: 'D#5', duration: 300, finger: 4 },
  { note: 'E5', duration: 300, finger: 5 },
  { note: 'B4', duration: 300, finger: 2 },
  { note: 'D5', duration: 300, finger: 4 },
  { note: 'C5', duration: 300, finger: 3 },
  { note: 'A4', duration: 600, finger: 1 },
  { note: 'C4', duration: 300, finger: 1 },
  { note: 'E4', duration: 300, finger: 3 },
  { note: 'A4', duration: 300, finger: 5 },
  { note: 'B4', duration: 600, finger: 2 },
  { note: 'E4', duration: 300, finger: 1 },
  { note: 'G#4', duration: 300, finger: 3 },
  { note: 'B4', duration: 300, finger: 5 },
  { note: 'C5', duration: 600, finger: 3 },
];

const generateChopsticks = () => [
  { note: 'F4', duration: 300, finger: 4 },
  { note: 'G4', duration: 300, finger: 5 },
  { note: 'F4', duration: 300, finger: 4 },
  { note: 'G4', duration: 300, finger: 5 },
  { note: 'F4', duration: 300, finger: 4 },
  { note: 'G4', duration: 300, finger: 5 },
  { note: 'F4', duration: 300, finger: 4 },
  { note: 'G4', duration: 300, finger: 5 },
  { note: 'E4', duration: 300, finger: 3 },
  { note: 'G4', duration: 300, finger: 5 },
  { note: 'E4', duration: 300, finger: 3 },
  { note: 'G4', duration: 300, finger: 5 },
  { note: 'E4', duration: 300, finger: 3 },
  { note: 'G4', duration: 300, finger: 5 },
  { note: 'E4', duration: 300, finger: 3 },
  { note: 'G4', duration: 300, finger: 5 },
  { note: 'D4', duration: 300, finger: 2 },
  { note: 'B4', duration: 300, finger: 4 },
  { note: 'D4', duration: 300, finger: 2 },
  { note: 'B4', duration: 300, finger: 4 },
];

const generateJingleBells = () => [
  { note: 'E4', duration: 500, finger: 3 },
  { note: 'E4', duration: 500, finger: 3 },
  { note: 'E4', duration: 1000, finger: 3 },
  { note: 'E4', duration: 500, finger: 3 },
  { note: 'E4', duration: 500, finger: 3 },
  { note: 'E4', duration: 1000, finger: 3 },
  { note: 'E4', duration: 500, finger: 3 },
  { note: 'G4', duration: 500, finger: 5 },
  { note: 'C4', duration: 750, finger: 1 },
  { note: 'D4', duration: 250, finger: 2 },
  { note: 'E4', duration: 1000, finger: 3 },
  { note: 'F4', duration: 500, finger: 4 },
  { note: 'F4', duration: 500, finger: 4 },
  { note: 'F4', duration: 750, finger: 4 },
  { note: 'F4', duration: 250, finger: 4 },
  { note: 'F4', duration: 500, finger: 4 },
  { note: 'E4', duration: 500, finger: 3 },
  { note: 'E4', duration: 500, finger: 3 },
  { note: 'E4', duration: 250, finger: 3 },
  { note: 'E4', duration: 250, finger: 3 },
  { note: 'E4', duration: 500, finger: 3 },
  { note: 'D4', duration: 500, finger: 2 },
  { note: 'D4', duration: 500, finger: 2 },
  { note: 'E4', duration: 500, finger: 3 },
  { note: 'D4', duration: 1000, finger: 2 },
  { note: 'G4', duration: 1000, finger: 5 },
];

const generateScaleExercise = () => [
  { note: 'C4', duration: 500, finger: 1 },
  { note: 'D4', duration: 500, finger: 2 },
  { note: 'E4', duration: 500, finger: 3 },
  { note: 'F4', duration: 500, finger: 1 },
  { note: 'G4', duration: 500, finger: 2 },
  { note: 'A4', duration: 500, finger: 3 },
  { note: 'B4', duration: 500, finger: 4 },
  { note: 'C5', duration: 1000, finger: 5 },
  { note: 'B4', duration: 500, finger: 4 },
  { note: 'A4', duration: 500, finger: 3 },
  { note: 'G4', duration: 500, finger: 2 },
  { note: 'F4', duration: 500, finger: 1 },
  { note: 'E4', duration: 500, finger: 3 },
  { note: 'D4', duration: 500, finger: 2 },
  { note: 'C4', duration: 1000, finger: 1 },
];

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Piano Learning API is running' });
});

app.listen(PORT, () => {
  console.log(`🎹 Piano Learning API running on http://localhost:${PORT}`);
});
