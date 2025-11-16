// Piano note frequencies and mappings
export const NOTES = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
];

export const NOTE_FREQUENCIES = {
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

// Finger numbering: 1=thumb, 2=index, 3=middle, 4=ring, 5=pinky
// For right hand
export const FINGER_NAMES = {
  1: 'Thumb',
  2: 'Index',
  3: 'Middle',
  4: 'Ring',
  5: 'Pinky'
};

// Generate piano keys for a range
export const generatePianoKeys = (startOctave = 3, endOctave = 5) => {
  const keys = [];
  for (let octave = startOctave; octave <= endOctave; octave++) {
    for (const note of NOTES) {
      if (octave === endOctave && note !== 'C') continue;
      const noteName = `${note}${octave}`;
      keys.push({
        note: noteName,
        isBlack: note.includes('#'),
        frequency: NOTE_FREQUENCIES[noteName]
      });
    }
  }
  return keys;
};

// Convert frequency to note name
export const frequencyToNote = (frequency) => {
  if (!frequency || frequency < 100) return null;

  let minDiff = Infinity;
  let closestNote = null;

  for (const [note, freq] of Object.entries(NOTE_FREQUENCIES)) {
    const diff = Math.abs(frequency - freq);
    if (diff < minDiff) {
      minDiff = diff;
      closestNote = note;
    }
  }

  // Allow some tolerance (about 2% of the frequency)
  const tolerance = NOTE_FREQUENCIES[closestNote] * 0.02;
  if (minDiff <= tolerance) {
    return closestNote;
  }

  return null;
};

// Sample songs with finger positions
export const SAMPLE_SONGS = {
  'twinkle': {
    name: 'Twinkle Twinkle Little Star',
    notes: [
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
    ]
  },
  'mary': {
    name: 'Mary Had a Little Lamb',
    notes: [
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
    ]
  },
  'ode': {
    name: 'Ode to Joy',
    notes: [
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
    ]
  }
};
