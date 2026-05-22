import { Note, Scale } from 'tonal'
import type { Mode, EnharmonicDisplay } from '../context/AppContext'
import { CHROMATIC_BOTH_NAMES, CHROMATIC_SHARP_NAMES, CHROMATIC_FLAT_NAMES } from '../data/chromatic'

// Maps our mode names to Tonal.js scale names
function getTonalScaleName(mode: Mode): string {
  return mode === 'major' ? 'major' : 'minor'
}

// Returns the 7 notes of the selected scale, spelled according to the key signature.
// Example: getScaleNotes('G', 'major') → ['G', 'A', 'B', 'C', 'D', 'E', 'F#']
// Example: getScaleNotes('D', 'natural minor') → ['D', 'E', 'F', 'G', 'A', 'Bb', 'C']
export function getScaleNotes(tonic: string, mode: Mode): string[] {
  const scaleName = getTonalScaleName(mode)
  const scale = Scale.get(`${tonic} ${scaleName}`)
  return scale.notes
}

// Degree labels for each mode, ordered from root (index 0) to 7th degree (index 6).
// Uppercase Roman numeral = major chord. Lowercase = minor. ° = diminished.
export const DEGREE_LABELS_MAJOR: string[] = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°']
export const DEGREE_LABELS_NATURAL_MINOR: string[] = ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII']

// Data for one cell in the 13-column chromatic template
export interface ChromaticCellData {
  semitones: number          // distance from root: 0 (root) to 12 (octave)
  noteName: string           // display name for the note row
  degreeLabel: string | null // display label for the degree row, null = not in scale or octave position
  isInScale: boolean         // false = cell is greyed out
}

// Builds the full 13-cell data array for the chromatic template.
// Each cell knows its note name, degree label, and whether it belongs to the scale.
// enharmonicDisplay controls how out-of-scale notes are named (both, sharp only, flat only).
export function buildChromaticRowData(
  tonic: string,
  mode: Mode,
  enharmonicDisplay: EnharmonicDisplay = 'both'
): ChromaticCellData[] {
  const scaleNotes = getScaleNotes(tonic, mode)
  const tonicChroma = Note.get(tonic).chroma ?? 0

  // Pick the chromatic names array based on the enharmonic display preference
  const chromaticNames =
    enharmonicDisplay === 'sharp' ? CHROMATIC_SHARP_NAMES :
    enharmonicDisplay === 'flat'  ? CHROMATIC_FLAT_NAMES  :
    CHROMATIC_BOTH_NAMES

  // Build a lookup from chroma value to the scale's note name (for in-scale cells)
  const scaleNoteNameByChroma: Record<number, string> = {}
  for (const scaleNote of scaleNotes) {
    const chroma = Note.get(scaleNote).chroma ?? 0
    scaleNoteNameByChroma[chroma] = Note.get(scaleNote).pc ?? scaleNote
  }

  const degreeLabels =
    mode === 'major' ? DEGREE_LABELS_MAJOR : DEGREE_LABELS_NATURAL_MINOR

  const cells: ChromaticCellData[] = []

  for (let semitones = 0; semitones <= 12; semitones++) {
    const absoluteChroma = (tonicChroma + semitones) % 12
    const isOctave = semitones === 12
    const isInScale = absoluteChroma in scaleNoteNameByChroma

    // Note name: use the scale spelling for in-scale notes, enharmonic name for out-of-scale
    let noteName: string
    if (isOctave) {
      noteName = Note.get(tonic).pc ?? tonic
    } else if (isInScale) {
      noteName = scaleNoteNameByChroma[absoluteChroma]
    } else {
      noteName = chromaticNames[absoluteChroma]
    }

    // Degree label: only shown for in-scale notes that are not the octave repetition
    let degreeLabel: string | null = null
    if (isInScale && !isOctave) {
      const degreeIndex = scaleNotes.findIndex(
        (n) => (Note.get(n).chroma ?? 0) === absoluteChroma
      )
      if (degreeIndex !== -1) {
        degreeLabel = degreeLabels[degreeIndex] ?? null
      }
    }

    cells.push({ semitones, noteName, degreeLabel, isInScale })
  }

  return cells
}
