// Interval nomenclature options.
// 13 labels per option — one per chromatic position, from root (index 0) to octave (index 12).
// To modify a nomenclature or add a new one, edit this file only.
// Never hardcode interval labels inside component code.

export type IntervalNomenclature = 'anglo' | 'academic' | 'french'

export const INTERVAL_LABELS: Record<IntervalNomenclature, string[]> = {
  // Guitar / Pop / Jazz shorthand — default
  // Reference: C  C#/Db  D  D#/Eb  E  F  F#/Gb  G  G#/Ab  A  A#/Bb  B  C
  anglo:   ['1', 'b2', '2', 'b3', '3', '4', 'b5', '5', 'b6', '6', 'b7', '7', '8'],

  // Academic International (conservatory standard)
  // P = Perfect, m = minor, M = major, d = diminished, A = augmented
  academic: ['P1', 'm2', 'M2', 'm3', 'M3', 'P4', 'd5/A4', 'P5', 'm6', 'M6', 'm7', 'M7', 'P8'],

  // French Solfège (French pedagogical convention — not an official standard)
  // j = juste, m = mineur, M = majeur, dim = diminué
  french:  ['1', '2m', '2M', '3m', '3M', '4j', '5dim', '5j', '6m', '6M', '7m', '7M', '8v'],
}

export const DEFAULT_NOMENCLATURE: IntervalNomenclature = 'anglo'
