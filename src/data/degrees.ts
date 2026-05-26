// Degree labels per scale, index 0 = tonic, index 6 = 7th degree.
// Uppercase = major chord, lowercase = minor, ° = diminished, + = augmented.
// Edit here — never compute these in component or logic code.

export const DEGREE_LABELS_MAJOR: string[] =
  ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°']

export const DEGREE_LABELS_NATURAL_MINOR: string[] =
  ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII']

export const DEGREE_LABELS_HARMONIC_MINOR: string[] =
  ['i', 'ii°', 'III+', 'iv', 'V', 'VI', 'vii°']

export const DEGREE_LABELS_MELODIC_MINOR: string[] =
  ['i', 'ii', 'III+', 'IV', 'V', 'vi°', 'vii°']

// Chord qualities per scale: M=major, m=minor, d=diminished, A=augmented.
// Index matches degree label arrays above.
export const CHORD_QUALITIES_MAJOR: string[] =
  ['M', 'm', 'm', 'M', 'M', 'm', 'd']

export const CHORD_QUALITIES_NATURAL_MINOR: string[] =
  ['m', 'd', 'M', 'm', 'm', 'M', 'M']

export const CHORD_QUALITIES_HARMONIC_MINOR: string[] =
  ['m', 'd', 'A', 'm', 'M', 'M', 'd']

export const CHORD_QUALITIES_MELODIC_MINOR: string[] =
  ['m', 'm', 'A', 'M', 'M', 'd', 'd']
