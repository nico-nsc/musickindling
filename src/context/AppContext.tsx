import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { IntervalNomenclature } from '../data/intervals'
import i18n from '../i18n'

export type Mode = 'major' | 'natural minor'
export type EnharmonicDisplay = 'both' | 'sharp' | 'flat'
export type Instrument = 'guitar' | 'piano'
export type Language = 'fr' | 'en'

interface AppState {
  selectedTonic: string
  selectedMode: Mode
  enharmonicDisplay: EnharmonicDisplay
  intervalNomenclature: IntervalNomenclature
  selectedInstrument: Instrument
  language: Language
  showSecondaryDominants: boolean
  showMinorVariants: boolean
  showBlockTitles: boolean
  showRelative: boolean
  showNeighbours: boolean
  setSelectedTonic: (tonic: string) => void
  setSelectedMode: (mode: Mode) => void
  setEnharmonicDisplay: (value: EnharmonicDisplay) => void
  setIntervalNomenclature: (value: IntervalNomenclature) => void
  setSelectedInstrument: (value: Instrument) => void
  setLanguage: (value: Language) => void
  setShowSecondaryDominants: (value: boolean) => void
  setShowMinorVariants: (value: boolean) => void
  setShowBlockTitles: (value: boolean) => void
  setShowRelative: (value: boolean) => void
  setShowNeighbours: (value: boolean) => void
}

const STORAGE_KEY = 'musickindling_settings'

interface PersistedSettings {
  enharmonicDisplay: EnharmonicDisplay
  intervalNomenclature: IntervalNomenclature
  selectedInstrument: Instrument
  language: Language
  showSecondaryDominants: boolean
  showMinorVariants: boolean
  showBlockTitles: boolean
  showRelative: boolean
  showNeighbours: boolean
}

const DEFAULT_SETTINGS: PersistedSettings = {
  enharmonicDisplay: 'both',
  intervalNomenclature: 'anglo',
  selectedInstrument: 'guitar',
  language: 'fr',
  showSecondaryDominants: true,
  showMinorVariants: true,
  showBlockTitles: true,
  showRelative: true,
  showNeighbours: true,
}

function loadSettings(): PersistedSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) }
  } catch {
    // ignore parse errors — fall back to defaults
  }
  return DEFAULT_SETTINGS
}

const AppContext = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const saved = loadSettings()

  const [selectedTonic, setSelectedTonic] = useState('C')
  const [selectedMode, setSelectedMode] = useState<Mode>('major')
  const [enharmonicDisplay, setEnharmonicDisplay] = useState<EnharmonicDisplay>(saved.enharmonicDisplay)
  const [intervalNomenclature, setIntervalNomenclature] = useState<IntervalNomenclature>(saved.intervalNomenclature)
  const [selectedInstrument, setSelectedInstrument] = useState<Instrument>(saved.selectedInstrument)
  const [language, setLanguage] = useState<Language>(saved.language)
  const [showSecondaryDominants, setShowSecondaryDominants] = useState<boolean>(saved.showSecondaryDominants)
  const [showMinorVariants, setShowMinorVariants] = useState<boolean>(saved.showMinorVariants)
  const [showBlockTitles, setShowBlockTitles] = useState<boolean>(saved.showBlockTitles)
  const [showRelative, setShowRelative] = useState<boolean>(saved.showRelative)
  const [showNeighbours, setShowNeighbours] = useState<boolean>(saved.showNeighbours)

  useEffect(() => {
    i18n.changeLanguage(language)
  }, [language])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      enharmonicDisplay,
      intervalNomenclature,
      selectedInstrument,
      language,
      showSecondaryDominants,
      showMinorVariants,
      showBlockTitles,
      showRelative,
      showNeighbours,
    }))
  }, [enharmonicDisplay, intervalNomenclature, selectedInstrument, language, showSecondaryDominants, showMinorVariants, showBlockTitles, showRelative, showNeighbours])

  return (
    <AppContext.Provider
      value={{
        selectedTonic, selectedMode, enharmonicDisplay, intervalNomenclature, selectedInstrument, language, showSecondaryDominants, showMinorVariants, showBlockTitles, showRelative, showNeighbours,
        setSelectedTonic, setSelectedMode, setEnharmonicDisplay, setIntervalNomenclature, setSelectedInstrument, setLanguage, setShowSecondaryDominants, setShowMinorVariants, setShowBlockTitles, setShowRelative, setShowNeighbours,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp(): AppState {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within AppProvider')
  return context
}
