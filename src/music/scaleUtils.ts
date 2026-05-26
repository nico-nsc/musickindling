import { Note, Scale } from 'tonal'
import type { Mode, EnharmonicDisplay } from '../context/AppContext'
import { CHROMATIC_BOTH_NAMES, CHROMATIC_SHARP_NAMES, CHROMATIC_FLAT_NAMES } from '../data/chromatic'
import {
  DEGREE_LABELS_MAJOR,
  DEGREE_LABELS_NATURAL_MINOR,
  DEGREE_LABELS_HARMONIC_MINOR,
  DEGREE_LABELS_MELODIC_MINOR,
} from '../data/degrees'

export type MinorVariant = 'harmonic minor' | 'melodic minor'

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

export interface NeighbourCellData {
  semitones: number
  noteName: string
  degreeLabel: string | null
  isInNeighbour: boolean
  isHighlighted: boolean
}

export function buildNeighbourRowData(
  neighbourTonic: string,
  mode: Mode,
  mainTonic: string,
  enharmonicDisplay: EnharmonicDisplay = 'both'
): NeighbourCellData[] {
  const mainScaleChromas = new Set(
    Scale.get(`${mainTonic} ${getTonalScaleName(mode)}`).notes.map(n => Note.get(n).chroma ?? 0)
  )

  const neighbourNotes = Scale.get(`${neighbourTonic} ${getTonalScaleName(mode)}`).notes
  const neighbourNoteByChroma: Record<number, string> = {}
  const degreeLabelByChroma: Record<number, string> = {}
  const degreeLabels = mode === 'major' ? DEGREE_LABELS_MAJOR : DEGREE_LABELS_NATURAL_MINOR

  for (let i = 0; i < neighbourNotes.length; i++) {
    const chroma = Note.get(neighbourNotes[i]).chroma ?? 0
    neighbourNoteByChroma[chroma] = Note.get(neighbourNotes[i]).pc ?? neighbourNotes[i]
    degreeLabelByChroma[chroma] = degreeLabels[i]
  }

  const tonicChroma = Note.get(neighbourTonic).chroma ?? 0
  const chromaticNames =
    enharmonicDisplay === 'sharp' ? CHROMATIC_SHARP_NAMES :
    enharmonicDisplay === 'flat'  ? CHROMATIC_FLAT_NAMES  :
    CHROMATIC_BOTH_NAMES

  const cells: NeighbourCellData[] = []

  for (let semitones = 0; semitones <= 12; semitones++) {
    const absoluteChroma = (tonicChroma + semitones) % 12
    const isOctave = semitones === 12
    const isInNeighbour = isOctave || absoluteChroma in neighbourNoteByChroma
    const isHighlighted = !isOctave && isInNeighbour && !mainScaleChromas.has(absoluteChroma)

    let noteName: string
    if (isOctave) {
      noteName = Note.get(neighbourTonic).pc ?? neighbourTonic
    } else if (isInNeighbour) {
      noteName = neighbourNoteByChroma[absoluteChroma]
    } else {
      noteName = chromaticNames[absoluteChroma]
    }

    const degreeLabel = (!isOctave && isInNeighbour)
      ? (degreeLabelByChroma[absoluteChroma] ?? null)
      : null

    cells.push({ semitones, noteName, degreeLabel, isInNeighbour, isHighlighted })
  }

  return cells
}

function getTonalScaleName(mode: Mode): string {
  return mode === 'major' ? 'major' : 'minor'
}

export function getScaleNotes(tonic: string, mode: Mode): string[] {
  return Scale.get(`${tonic} ${getTonalScaleName(mode)}`).notes
}

export interface ChromaticCellData {
  semitones: number
  noteName: string
  degreeLabel: string | null
  isInScale: boolean
}

export function buildChromaticRowData(
  tonic: string,
  mode: Mode,
  enharmonicDisplay: EnharmonicDisplay = 'both'
): ChromaticCellData[] {
  const scaleNotes = getScaleNotes(tonic, mode)
  const tonicChroma = Note.get(tonic).chroma ?? 0

  const chromaticNames =
    enharmonicDisplay === 'sharp' ? CHROMATIC_SHARP_NAMES :
    enharmonicDisplay === 'flat'  ? CHROMATIC_FLAT_NAMES  :
    CHROMATIC_BOTH_NAMES

  const scaleNoteNameByChroma: Record<number, string> = {}
  for (const scaleNote of scaleNotes) {
    const chroma = Note.get(scaleNote).chroma ?? 0
    scaleNoteNameByChroma[chroma] = Note.get(scaleNote).pc ?? scaleNote
  }

  const degreeLabels = mode === 'major' ? DEGREE_LABELS_MAJOR : DEGREE_LABELS_NATURAL_MINOR
  const cells: ChromaticCellData[] = []

  for (let semitones = 0; semitones <= 12; semitones++) {
    const absoluteChroma = (tonicChroma + semitones) % 12
    const isOctave = semitones === 12
    const isInScale = absoluteChroma in scaleNoteNameByChroma

    let noteName: string
    if (isOctave) {
      noteName = Note.get(tonic).pc ?? tonic
    } else if (isInScale) {
      noteName = scaleNoteNameByChroma[absoluteChroma]
    } else {
      noteName = chromaticNames[absoluteChroma]
    }

    let degreeLabel: string | null = null
    if (isInScale && !isOctave) {
      const degreeIndex = scaleNotes.findIndex(
        (n) => (Note.get(n).chroma ?? 0) === absoluteChroma
      )
      if (degreeIndex !== -1) degreeLabel = degreeLabels[degreeIndex] ?? null
    }

    cells.push({ semitones, noteName, degreeLabel, isInScale })
  }

  return cells
}

export interface VariantCellData {
  semitones: number
  noteName: string
  degreeLabel: string | null
  isInVariant: boolean
  isHighlighted: boolean
}

export function buildVariantRowData(
  tonic: string,
  variant: MinorVariant,
  enharmonicDisplay: EnharmonicDisplay = 'both'
): VariantCellData[] {
  const naturalMinorChromas = new Set(
    Scale.get(`${tonic} minor`).notes.map(n => Note.get(n).chroma ?? 0)
  )

  const variantNotes = Scale.get(`${tonic} ${variant}`).notes
  const variantNoteByChroma: Record<number, string> = {}
  const degreeLabelByChroma: Record<number, string> = {}
  const degreeLabels = variant === 'harmonic minor'
    ? DEGREE_LABELS_HARMONIC_MINOR
    : DEGREE_LABELS_MELODIC_MINOR

  for (let i = 0; i < variantNotes.length; i++) {
    const chroma = Note.get(variantNotes[i]).chroma ?? 0
    variantNoteByChroma[chroma] = Note.get(variantNotes[i]).pc ?? variantNotes[i]
    degreeLabelByChroma[chroma] = degreeLabels[i]
  }

  const tonicChroma = Note.get(tonic).chroma ?? 0
  const chromaticNames =
    enharmonicDisplay === 'sharp' ? CHROMATIC_SHARP_NAMES :
    enharmonicDisplay === 'flat'  ? CHROMATIC_FLAT_NAMES  :
    CHROMATIC_BOTH_NAMES

  const cells: VariantCellData[] = []

  for (let semitones = 0; semitones <= 12; semitones++) {
    const absoluteChroma = (tonicChroma + semitones) % 12
    const isOctave = semitones === 12
    const isInVariant = isOctave || absoluteChroma in variantNoteByChroma
    const isHighlighted = !isOctave && isInVariant && !naturalMinorChromas.has(absoluteChroma)

    let noteName: string
    if (isOctave) {
      noteName = Note.get(tonic).pc ?? tonic
    } else if (isInVariant) {
      noteName = variantNoteByChroma[absoluteChroma]
    } else {
      noteName = chromaticNames[absoluteChroma]
    }

    const degreeLabel = (!isOctave && isInVariant)
      ? (degreeLabelByChroma[absoluteChroma] ?? null)
      : null

    cells.push({ semitones, noteName, degreeLabel, isInVariant, isHighlighted })
  }

  return cells
}
