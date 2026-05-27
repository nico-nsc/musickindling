import { Note, Scale } from 'tonal'
import type { Mode, EnharmonicDisplay } from '../context/AppContext'
import { CHROMATIC_BOTH_NAMES, CHROMATIC_SHARP_NAMES, CHROMATIC_FLAT_NAMES } from '../data/chromatic'
import {
  DEGREE_LABELS_MAJOR,
  DEGREE_LABELS_NATURAL_MINOR,
  DEGREE_LABELS_HARMONIC_MINOR,
  DEGREE_LABELS_MELODIC_MINOR,
  CHORD_QUALITIES_MAJOR,
  CHORD_QUALITIES_NATURAL_MINOR,
  CHORD_QUALITIES_HARMONIC_MINOR,
  CHORD_QUALITIES_MELODIC_MINOR,
} from '../data/degrees'

export type MinorVariant = 'harmonic minor' | 'melodic minor'

export interface CellData {
  semitones: number
  noteName: string
  degreeLabel: string | null
  isInScale: boolean
  isNoteInMain: boolean
  isChordInMain: boolean
}

export function getRelativeTonic(tonic: string, mode: Mode): { tonic: string; mode: Mode } {
  const raw = Note.transpose(tonic, mode === 'major' ? '6M' : '3m')
  return {
    tonic: Note.get(raw).pc ?? raw,
    mode: mode === 'major' ? 'natural minor' : 'major',
  }
}

export function getNeighbourTonics(tonic: string): { left: string; right: string } {
  return {
    left:  Note.get(Note.transpose(tonic, '4P')).pc ?? Note.transpose(tonic, '4P'),
    right: Note.get(Note.transpose(tonic, '5P')).pc ?? Note.transpose(tonic, '5P'),
  }
}

function getTonalScaleName(mode: Mode): string {
  return mode === 'major' ? 'major' : 'minor'
}

export function getScaleNotes(tonic: string, mode: Mode): string[] {
  return Scale.get(`${tonic} ${getTonalScaleName(mode)}`).notes
}

function getChromaticNames(enharmonicDisplay: EnharmonicDisplay) {
  return enharmonicDisplay === 'sharp' ? CHROMATIC_SHARP_NAMES
       : enharmonicDisplay === 'flat'  ? CHROMATIC_FLAT_NAMES
       : CHROMATIC_BOTH_NAMES
}

function buildDegreeIndexByChroma(notes: string[]): Record<number, number> {
  const map: Record<number, number> = {}
  for (let i = 0; i < notes.length; i++) {
    map[Note.get(notes[i]).chroma ?? 0] = i
  }
  return map
}

export function buildChromaticRowData(
  tonic: string,
  mode: Mode,
  enharmonicDisplay: EnharmonicDisplay = 'both'
): CellData[] {
  const scaleNotes = getScaleNotes(tonic, mode)
  const tonicChroma = Note.get(tonic).chroma ?? 0
  const chromaticNames = getChromaticNames(enharmonicDisplay)
  const degreeIndexByChroma = buildDegreeIndexByChroma(scaleNotes)
  const degreeLabels = mode === 'major' ? DEGREE_LABELS_MAJOR : DEGREE_LABELS_NATURAL_MINOR
  const cells: CellData[] = []

  for (let semitones = 0; semitones <= 12; semitones++) {
    const absoluteChroma = (tonicChroma + semitones) % 12
    const isOctave = semitones === 12
    const isInScale = absoluteChroma in degreeIndexByChroma

    let noteName: string
    if (isOctave) {
      noteName = Note.get(tonic).pc ?? tonic
    } else if (isInScale) {
      noteName = Note.get(scaleNotes[degreeIndexByChroma[absoluteChroma]]).pc ?? scaleNotes[degreeIndexByChroma[absoluteChroma]]
    } else {
      noteName = chromaticNames[absoluteChroma]
    }

    const degreeLabel = (isInScale && !isOctave)
      ? (degreeLabels[degreeIndexByChroma[absoluteChroma]] ?? null)
      : null

    cells.push({ semitones, noteName, degreeLabel, isInScale, isNoteInMain: true, isChordInMain: true })
  }

  return cells
}

export function buildVariantRowData(
  tonic: string,
  variant: MinorVariant,
  enharmonicDisplay: EnharmonicDisplay = 'both'
): CellData[] {
  const naturalMinorNotes = Scale.get(`${tonic} minor`).notes
  const naturalMinorDegreeIndexByChroma = buildDegreeIndexByChroma(naturalMinorNotes)

  const variantNotes = Scale.get(`${tonic} ${variant}`).notes
  const variantDegreeIndexByChroma = buildDegreeIndexByChroma(variantNotes)
  const degreeLabels = variant === 'harmonic minor' ? DEGREE_LABELS_HARMONIC_MINOR : DEGREE_LABELS_MELODIC_MINOR
  const variantQualities = variant === 'harmonic minor' ? CHORD_QUALITIES_HARMONIC_MINOR : CHORD_QUALITIES_MELODIC_MINOR

  const tonicChroma = Note.get(tonic).chroma ?? 0
  const chromaticNames = getChromaticNames(enharmonicDisplay)
  const cells: CellData[] = []

  for (let semitones = 0; semitones <= 12; semitones++) {
    const absoluteChroma = (tonicChroma + semitones) % 12
    const isOctave = semitones === 12
    const isInScale = isOctave || absoluteChroma in variantDegreeIndexByChroma
    const isNoteInMain = isOctave || absoluteChroma in naturalMinorDegreeIndexByChroma

    let isChordInMain = isNoteInMain
    if (!isOctave && isInScale && isNoteInMain) {
      const variantIdx = variantDegreeIndexByChroma[absoluteChroma]
      const mainIdx = naturalMinorDegreeIndexByChroma[absoluteChroma]
      isChordInMain = variantQualities[variantIdx] === CHORD_QUALITIES_NATURAL_MINOR[mainIdx]
    }

    let noteName: string
    if (isOctave) {
      noteName = Note.get(tonic).pc ?? tonic
    } else if (isInScale) {
      noteName = Note.get(variantNotes[variantDegreeIndexByChroma[absoluteChroma]]).pc ?? variantNotes[variantDegreeIndexByChroma[absoluteChroma]]
    } else {
      noteName = chromaticNames[absoluteChroma]
    }

    const degreeLabel = (isInScale && !isOctave)
      ? (degreeLabels[variantDegreeIndexByChroma[absoluteChroma]] ?? null)
      : null

    cells.push({ semitones, noteName, degreeLabel, isInScale, isNoteInMain, isChordInMain })
  }

  return cells
}

export function buildSecondaryDominantRowData(
  tonic: string,
  mode: Mode,
  enharmonicDisplay: EnharmonicDisplay = 'both'
): CellData[] {
  const scaleNotes = getScaleNotes(tonic, mode)
  const mainDegreeIndexByChroma = buildDegreeIndexByChroma(scaleNotes)
  const modeQualities = mode === 'major' ? CHORD_QUALITIES_MAJOR : CHORD_QUALITIES_NATURAL_MINOR
  const degreeLabels = mode === 'major' ? DEGREE_LABELS_MAJOR : DEGREE_LABELS_NATURAL_MINOR
  const tonicChroma = Note.get(tonic).chroma ?? 0
  const chromaticNames = getChromaticNames(enharmonicDisplay)

  // For each scale degree chroma, precompute its secondary dominant root
  const sdByDegreeChroma: Record<number, { noteName: string; sdChroma: number }> = {}
  for (const note of scaleNotes) {
    const degChroma = Note.get(note).chroma ?? 0
    const sdRoot = Note.transpose(note, '5P')
    sdByDegreeChroma[degChroma] = {
      noteName: Note.get(sdRoot).pc ?? sdRoot,
      sdChroma: Note.get(sdRoot).chroma ?? 0,
    }
  }

  const cells: CellData[] = []

  for (let semitones = 0; semitones <= 12; semitones++) {
    const absoluteChroma = (tonicChroma + semitones) % 12
    const isOctave = semitones === 12
    // Aligned with main scale degrees: isInScale follows the same positions as the main scale
    const isInScale = isOctave || absoluteChroma in mainDegreeIndexByChroma

    if (!isInScale) {
      cells.push({ semitones, noteName: chromaticNames[absoluteChroma], degreeLabel: null, isInScale: false, isNoteInMain: false, isChordInMain: false })
      continue
    }

    const sd = sdByDegreeChroma[absoluteChroma]
    const sdChroma = sd.sdChroma
    const isNoteInMain = sdChroma in mainDegreeIndexByChroma
    const isChordInMain = isNoteInMain && modeQualities[mainDegreeIndexByChroma[sdChroma]] === 'M'

    const degreeIdx = mainDegreeIndexByChroma[absoluteChroma] ?? 0
    const degreeLabel = isOctave ? null : `V/${degreeLabels[degreeIdx]}`

    cells.push({ semitones, noteName: sd.noteName, degreeLabel, isInScale, isNoteInMain, isChordInMain })
  }

  return cells
}

export function buildNeighbourRowData(
  neighbourTonic: string,
  mode: Mode,
  mainTonic: string,
  enharmonicDisplay: EnharmonicDisplay = 'both'
): CellData[] {
  const mainNotes = Scale.get(`${mainTonic} ${getTonalScaleName(mode)}`).notes
  const mainDegreeIndexByChroma = buildDegreeIndexByChroma(mainNotes)

  const neighbourNotes = Scale.get(`${neighbourTonic} ${getTonalScaleName(mode)}`).notes
  const neighbourDegreeIndexByChroma = buildDegreeIndexByChroma(neighbourNotes)
  const degreeLabels = mode === 'major' ? DEGREE_LABELS_MAJOR : DEGREE_LABELS_NATURAL_MINOR
  const modeQualities = mode === 'major' ? CHORD_QUALITIES_MAJOR : CHORD_QUALITIES_NATURAL_MINOR

  const tonicChroma = Note.get(neighbourTonic).chroma ?? 0
  const chromaticNames = getChromaticNames(enharmonicDisplay)
  const cells: CellData[] = []

  for (let semitones = 0; semitones <= 12; semitones++) {
    const absoluteChroma = (tonicChroma + semitones) % 12
    const isOctave = semitones === 12
    const isInScale = isOctave || absoluteChroma in neighbourDegreeIndexByChroma
    const isNoteInMain = isOctave || absoluteChroma in mainDegreeIndexByChroma

    let isChordInMain = isNoteInMain
    if (!isOctave && isInScale && isNoteInMain) {
      const neighbourIdx = neighbourDegreeIndexByChroma[absoluteChroma]
      const mainIdx = mainDegreeIndexByChroma[absoluteChroma]
      isChordInMain = modeQualities[neighbourIdx] === modeQualities[mainIdx]
    }

    let noteName: string
    if (isOctave) {
      noteName = Note.get(neighbourTonic).pc ?? neighbourTonic
    } else if (isInScale) {
      noteName = Note.get(neighbourNotes[neighbourDegreeIndexByChroma[absoluteChroma]]).pc ?? neighbourNotes[neighbourDegreeIndexByChroma[absoluteChroma]]
    } else {
      noteName = chromaticNames[absoluteChroma]
    }

    const degreeLabel = (isInScale && !isOctave)
      ? (degreeLabels[neighbourDegreeIndexByChroma[absoluteChroma]] ?? null)
      : null

    cells.push({ semitones, noteName, degreeLabel, isInScale, isNoteInMain, isChordInMain })
  }

  return cells
}
