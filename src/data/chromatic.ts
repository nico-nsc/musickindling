// Chromatic note display names for out-of-scale positions.
// Indexed by chroma value: 0 = C, 1 = C#/Db, 2 = D, ..., 11 = B.
// Three variants corresponding to the EnharmonicDisplay setting (Step 2).
// Used only for notes that fall outside the selected scale (greyed cells).
// In-scale notes are always spelled by Tonal.js according to the key signature.

// Both enharmonic names — default
export const CHROMATIC_BOTH_NAMES: string[] = [
  'C',       // chroma 0
  'C#/Db',   // chroma 1
  'D',       // chroma 2
  'D#/Eb',   // chroma 3
  'E',       // chroma 4
  'F',       // chroma 5
  'F#/Gb',   // chroma 6
  'G',       // chroma 7
  'G#/Ab',   // chroma 8
  'A',       // chroma 9
  'A#/Bb',   // chroma 10
  'B',       // chroma 11
]

// Sharp names only
export const CHROMATIC_SHARP_NAMES: string[] = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B',
]

// Flat names only
export const CHROMATIC_FLAT_NAMES: string[] = [
  'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B',
]
