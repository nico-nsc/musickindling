// Tonic options for the key selector dropdown.
// Each entry: label shown to the user, value passed to Tonal.js.
// For enharmonic tonics (e.g., F#/Gb), the label shows both names
// and the value uses the convention that produces the most readable scale spellings.
// To add alternatives (e.g., C# as a separate option from Db), add a new entry here.

export const TONIC_OPTIONS: { label: string; value: string }[] = [
  { label: 'C',     value: 'C'  },
  { label: 'C#/Db', value: 'Db' },
  { label: 'D',     value: 'D'  },
  { label: 'D#/Eb', value: 'Eb' },
  { label: 'E',     value: 'E'  },
  { label: 'F',     value: 'F'  },
  { label: 'F#/Gb', value: 'F#' },
  { label: 'G',     value: 'G'  },
  { label: 'G#/Ab', value: 'Ab' },
  { label: 'A',     value: 'A'  },
  { label: 'A#/Bb', value: 'Bb' },
  { label: 'B',     value: 'B'  },
]
