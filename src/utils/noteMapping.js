// Piano note frequencies and mappings
export const NOTES = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
];

export const NOTE_FREQUENCIES = {
  'C2': 65.41, 'C#2': 69.30, 'D2': 73.42, 'D#2': 77.78, 'E2': 82.41,
  'F2': 87.31, 'F#2': 92.50, 'G2': 98.00, 'G#2': 103.83, 'A2': 110.00,
  'A#2': 116.54, 'B2': 123.47,
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
export const FINGER_NAMES = {
  1: 'Thumb',
  2: 'Index',
  3: 'Middle',
  4: 'Ring',
  5: 'Pinky'
};

// Hand indicators
export const HAND_NAMES = {
  'left': 'Left Hand (L)',
  'right': 'Right Hand (R)',
  'both': 'Both Hands'
};

// Generate piano keys for a range
export const generatePianoKeys = (startOctave = 2, endOctave = 5) => {
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
  if (!frequency || frequency < 60) return null;

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

// Helper to normalize note data (supports both old and new format)
export const normalizeNoteData = (noteData) => {
  // If it's already an array of notes (chord), return as is
  if (Array.isArray(noteData.notes)) {
    return noteData;
  }
  // Convert single note to array format
  return {
    ...noteData,
    notes: [noteData.note],
    fingers: [noteData.finger],
    hand: noteData.hand || 'right'
  };
};

// Sample songs with finger positions and hand indicators
// New format: notes (array for chords), fingers (array), hand ('left', 'right', 'both')
export const SAMPLE_SONGS = {
  'twinkle': {
    name: 'Twinkle Twinkle Little Star',
    difficulty: 'Easy',
    notes: [
      { notes: ['C4'], fingers: [1], hand: 'right', duration: 500 },
      { notes: ['C4'], fingers: [1], hand: 'right', duration: 500 },
      { notes: ['G4'], fingers: [5], hand: 'right', duration: 500 },
      { notes: ['G4'], fingers: [5], hand: 'right', duration: 500 },
      { notes: ['A4'], fingers: [1], hand: 'right', duration: 500 },
      { notes: ['A4'], fingers: [1], hand: 'right', duration: 500 },
      { notes: ['G4'], fingers: [5], hand: 'right', duration: 1000 },
      { notes: ['F4'], fingers: [4], hand: 'right', duration: 500 },
      { notes: ['F4'], fingers: [4], hand: 'right', duration: 500 },
      { notes: ['E4'], fingers: [3], hand: 'right', duration: 500 },
      { notes: ['E4'], fingers: [3], hand: 'right', duration: 500 },
      { notes: ['D4'], fingers: [2], hand: 'right', duration: 500 },
      { notes: ['D4'], fingers: [2], hand: 'right', duration: 500 },
      { notes: ['C4'], fingers: [1], hand: 'right', duration: 1000 },
    ]
  },
  'mary': {
    name: 'Mary Had a Little Lamb',
    difficulty: 'Easy',
    notes: [
      { notes: ['E4'], fingers: [3], hand: 'right', duration: 500 },
      { notes: ['D4'], fingers: [2], hand: 'right', duration: 500 },
      { notes: ['C4'], fingers: [1], hand: 'right', duration: 500 },
      { notes: ['D4'], fingers: [2], hand: 'right', duration: 500 },
      { notes: ['E4'], fingers: [3], hand: 'right', duration: 500 },
      { notes: ['E4'], fingers: [3], hand: 'right', duration: 500 },
      { notes: ['E4'], fingers: [3], hand: 'right', duration: 1000 },
      { notes: ['D4'], fingers: [2], hand: 'right', duration: 500 },
      { notes: ['D4'], fingers: [2], hand: 'right', duration: 500 },
      { notes: ['D4'], fingers: [2], hand: 'right', duration: 1000 },
      { notes: ['E4'], fingers: [3], hand: 'right', duration: 500 },
      { notes: ['G4'], fingers: [5], hand: 'right', duration: 500 },
      { notes: ['G4'], fingers: [5], hand: 'right', duration: 1000 },
    ]
  },
  'ode': {
    name: 'Ode to Joy',
    difficulty: 'Easy',
    notes: [
      { notes: ['E4'], fingers: [3], hand: 'right', duration: 500 },
      { notes: ['E4'], fingers: [3], hand: 'right', duration: 500 },
      { notes: ['F4'], fingers: [4], hand: 'right', duration: 500 },
      { notes: ['G4'], fingers: [5], hand: 'right', duration: 500 },
      { notes: ['G4'], fingers: [5], hand: 'right', duration: 500 },
      { notes: ['F4'], fingers: [4], hand: 'right', duration: 500 },
      { notes: ['E4'], fingers: [3], hand: 'right', duration: 500 },
      { notes: ['D4'], fingers: [2], hand: 'right', duration: 500 },
      { notes: ['C4'], fingers: [1], hand: 'right', duration: 500 },
      { notes: ['C4'], fingers: [1], hand: 'right', duration: 500 },
      { notes: ['D4'], fingers: [2], hand: 'right', duration: 500 },
      { notes: ['E4'], fingers: [3], hand: 'right', duration: 500 },
      { notes: ['E4'], fingers: [3], hand: 'right', duration: 750 },
      { notes: ['D4'], fingers: [2], hand: 'right', duration: 250 },
      { notes: ['D4'], fingers: [2], hand: 'right', duration: 1000 },
    ]
  },
  'happyBirthday': {
    name: 'Happy Birthday',
    difficulty: 'Easy',
    notes: [
      { notes: ['G4'], fingers: [5], hand: 'right', duration: 300 },
      { notes: ['G4'], fingers: [5], hand: 'right', duration: 300 },
      { notes: ['A4'], fingers: [1], hand: 'right', duration: 600 },
      { notes: ['G4'], fingers: [5], hand: 'right', duration: 600 },
      { notes: ['C5'], fingers: [3], hand: 'right', duration: 600 },
      { notes: ['B4'], fingers: [2], hand: 'right', duration: 1200 },
      { notes: ['G4'], fingers: [5], hand: 'right', duration: 300 },
      { notes: ['G4'], fingers: [5], hand: 'right', duration: 300 },
      { notes: ['A4'], fingers: [1], hand: 'right', duration: 600 },
      { notes: ['G4'], fingers: [5], hand: 'right', duration: 600 },
      { notes: ['D5'], fingers: [4], hand: 'right', duration: 600 },
      { notes: ['C5'], fingers: [3], hand: 'right', duration: 1200 },
    ]
  },
  'furElise': {
    name: 'Für Elise (Simplified)',
    difficulty: 'Medium',
    notes: [
      { notes: ['E5'], fingers: [5], hand: 'right', duration: 300 },
      { notes: ['D#5'], fingers: [4], hand: 'right', duration: 300 },
      { notes: ['E5'], fingers: [5], hand: 'right', duration: 300 },
      { notes: ['D#5'], fingers: [4], hand: 'right', duration: 300 },
      { notes: ['E5'], fingers: [5], hand: 'right', duration: 300 },
      { notes: ['B4'], fingers: [2], hand: 'right', duration: 300 },
      { notes: ['D5'], fingers: [4], hand: 'right', duration: 300 },
      { notes: ['C5'], fingers: [3], hand: 'right', duration: 300 },
      { notes: ['A4'], fingers: [1], hand: 'right', duration: 600 },
      { notes: ['C4'], fingers: [1], hand: 'left', duration: 300 },
      { notes: ['E4'], fingers: [3], hand: 'left', duration: 300 },
      { notes: ['A4'], fingers: [5], hand: 'left', duration: 300 },
      { notes: ['B4'], fingers: [2], hand: 'right', duration: 600 },
      { notes: ['E4'], fingers: [1], hand: 'left', duration: 300 },
      { notes: ['G#4'], fingers: [3], hand: 'left', duration: 300 },
      { notes: ['B4'], fingers: [5], hand: 'left', duration: 300 },
      { notes: ['C5'], fingers: [3], hand: 'right', duration: 600 },
    ]
  },
  'chopsticks': {
    name: 'Chopsticks',
    difficulty: 'Easy',
    notes: [
      { notes: ['F4', 'G4'], fingers: [1, 2], hand: 'right', duration: 300 },
      { notes: ['F4', 'G4'], fingers: [1, 2], hand: 'right', duration: 300 },
      { notes: ['F4', 'G4'], fingers: [1, 2], hand: 'right', duration: 300 },
      { notes: ['F4', 'G4'], fingers: [1, 2], hand: 'right', duration: 300 },
      { notes: ['E4', 'G4'], fingers: [1, 3], hand: 'right', duration: 300 },
      { notes: ['E4', 'G4'], fingers: [1, 3], hand: 'right', duration: 300 },
      { notes: ['E4', 'G4'], fingers: [1, 3], hand: 'right', duration: 300 },
      { notes: ['E4', 'G4'], fingers: [1, 3], hand: 'right', duration: 300 },
      { notes: ['D4', 'B4'], fingers: [1, 5], hand: 'right', duration: 300 },
      { notes: ['D4', 'B4'], fingers: [1, 5], hand: 'right', duration: 300 },
      { notes: ['D4', 'B4'], fingers: [1, 5], hand: 'right', duration: 300 },
      { notes: ['D4', 'B4'], fingers: [1, 5], hand: 'right', duration: 300 },
      { notes: ['C4', 'E4', 'G4'], fingers: [1, 3, 5], hand: 'right', duration: 600 },
    ]
  },
  'jingleBells': {
    name: 'Jingle Bells',
    difficulty: 'Easy',
    notes: [
      { notes: ['E4'], fingers: [3], hand: 'right', duration: 500 },
      { notes: ['E4'], fingers: [3], hand: 'right', duration: 500 },
      { notes: ['E4'], fingers: [3], hand: 'right', duration: 1000 },
      { notes: ['E4'], fingers: [3], hand: 'right', duration: 500 },
      { notes: ['E4'], fingers: [3], hand: 'right', duration: 500 },
      { notes: ['E4'], fingers: [3], hand: 'right', duration: 1000 },
      { notes: ['E4'], fingers: [3], hand: 'right', duration: 500 },
      { notes: ['G4'], fingers: [5], hand: 'right', duration: 500 },
      { notes: ['C4'], fingers: [1], hand: 'right', duration: 750 },
      { notes: ['D4'], fingers: [2], hand: 'right', duration: 250 },
      { notes: ['E4'], fingers: [3], hand: 'right', duration: 1000 },
      { notes: ['F4'], fingers: [4], hand: 'right', duration: 500 },
      { notes: ['F4'], fingers: [4], hand: 'right', duration: 500 },
      { notes: ['F4'], fingers: [4], hand: 'right', duration: 750 },
      { notes: ['F4'], fingers: [4], hand: 'right', duration: 250 },
      { notes: ['F4'], fingers: [4], hand: 'right', duration: 500 },
      { notes: ['E4'], fingers: [3], hand: 'right', duration: 500 },
      { notes: ['E4'], fingers: [3], hand: 'right', duration: 500 },
      { notes: ['E4'], fingers: [3], hand: 'right', duration: 250 },
      { notes: ['E4'], fingers: [3], hand: 'right', duration: 250 },
      { notes: ['E4'], fingers: [3], hand: 'right', duration: 500 },
      { notes: ['D4'], fingers: [2], hand: 'right', duration: 500 },
      { notes: ['D4'], fingers: [2], hand: 'right', duration: 500 },
      { notes: ['E4'], fingers: [3], hand: 'right', duration: 500 },
      { notes: ['D4'], fingers: [2], hand: 'right', duration: 1000 },
      { notes: ['G4'], fingers: [5], hand: 'right', duration: 1000 },
    ]
  },
  'twinkleTwoHands': {
    name: 'Twinkle Twinkle (Two Hands)',
    difficulty: 'Medium',
    notes: [
      { notes: ['C3', 'C4'], fingers: [5, 1], hand: 'both', duration: 500 },
      { notes: ['C4'], fingers: [1], hand: 'right', duration: 500 },
      { notes: ['G3', 'G4'], fingers: [1, 5], hand: 'both', duration: 500 },
      { notes: ['G4'], fingers: [5], hand: 'right', duration: 500 },
      { notes: ['A3', 'A4'], fingers: [5, 1], hand: 'both', duration: 500 },
      { notes: ['A4'], fingers: [1], hand: 'right', duration: 500 },
      { notes: ['G3', 'G4'], fingers: [1, 5], hand: 'both', duration: 1000 },
      { notes: ['F3', 'F4'], fingers: [2, 4], hand: 'both', duration: 500 },
      { notes: ['F4'], fingers: [4], hand: 'right', duration: 500 },
      { notes: ['E3', 'E4'], fingers: [3, 3], hand: 'both', duration: 500 },
      { notes: ['E4'], fingers: [3], hand: 'right', duration: 500 },
      { notes: ['D3', 'D4'], fingers: [4, 2], hand: 'both', duration: 500 },
      { notes: ['D4'], fingers: [2], hand: 'right', duration: 500 },
      { notes: ['C3', 'C4'], fingers: [5, 1], hand: 'both', duration: 1000 },
    ]
  },
  'odeWithChords': {
    name: 'Ode to Joy (With Chords)',
    difficulty: 'Hard',
    notes: [
      { notes: ['C3', 'E4'], fingers: [5, 3], hand: 'both', duration: 500 },
      { notes: ['E4'], fingers: [3], hand: 'right', duration: 500 },
      { notes: ['C3', 'F4'], fingers: [5, 4], hand: 'both', duration: 500 },
      { notes: ['G3', 'G4'], fingers: [1, 5], hand: 'both', duration: 500 },
      { notes: ['G4'], fingers: [5], hand: 'right', duration: 500 },
      { notes: ['G3', 'F4'], fingers: [1, 4], hand: 'both', duration: 500 },
      { notes: ['C3', 'E4'], fingers: [5, 3], hand: 'both', duration: 500 },
      { notes: ['G3', 'D4'], fingers: [1, 2], hand: 'both', duration: 500 },
      { notes: ['C3', 'E3', 'G3', 'C4'], fingers: [5, 3, 1, 1], hand: 'both', duration: 500 },
      { notes: ['C4'], fingers: [1], hand: 'right', duration: 500 },
      { notes: ['G3', 'D4'], fingers: [1, 2], hand: 'both', duration: 500 },
      { notes: ['C3', 'E4'], fingers: [5, 3], hand: 'both', duration: 500 },
      { notes: ['E4'], fingers: [3], hand: 'right', duration: 750 },
      { notes: ['G3', 'D4'], fingers: [1, 2], hand: 'both', duration: 250 },
      { notes: ['G3', 'B3', 'D4'], fingers: [1, 3, 2], hand: 'both', duration: 1000 },
    ]
  },
  'cMajorScale': {
    name: 'C Major Scale (Two Hands)',
    difficulty: 'Medium',
    notes: [
      { notes: ['C3', 'C4'], fingers: [5, 1], hand: 'both', duration: 500 },
      { notes: ['D3', 'D4'], fingers: [4, 2], hand: 'both', duration: 500 },
      { notes: ['E3', 'E4'], fingers: [3, 3], hand: 'both', duration: 500 },
      { notes: ['F3', 'F4'], fingers: [2, 1], hand: 'both', duration: 500 },
      { notes: ['G3', 'G4'], fingers: [1, 2], hand: 'both', duration: 500 },
      { notes: ['A3', 'A4'], fingers: [3, 3], hand: 'both', duration: 500 },
      { notes: ['B3', 'B4'], fingers: [2, 4], hand: 'both', duration: 500 },
      { notes: ['C4', 'C5'], fingers: [1, 5], hand: 'both', duration: 1000 },
      { notes: ['B3', 'B4'], fingers: [2, 4], hand: 'both', duration: 500 },
      { notes: ['A3', 'A4'], fingers: [3, 3], hand: 'both', duration: 500 },
      { notes: ['G3', 'G4'], fingers: [1, 2], hand: 'both', duration: 500 },
      { notes: ['F3', 'F4'], fingers: [2, 1], hand: 'both', duration: 500 },
      { notes: ['E3', 'E4'], fingers: [3, 3], hand: 'both', duration: 500 },
      { notes: ['D3', 'D4'], fingers: [4, 2], hand: 'both', duration: 500 },
      { notes: ['C3', 'C4'], fingers: [5, 1], hand: 'both', duration: 1000 },
    ]
  }
};
