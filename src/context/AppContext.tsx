import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { IntervalNomenclature } from '../data/intervals'

export type Mode = 'major' | 'natural minor'
export type EnharmonicDisplay = 'both' | 'sharp' | 'flat'
export type Instrument = 'guitar' | 'piano'

interface AppState {
  selectedTonic: string
  selectedMode: Mode
  enharmonicDisplay: EnharmonicDisplay
  intervalNomenclature: IntervalNomenclature
  selectedInstrument: Instrument
  showMinorVariants: boolean
  showBlockTitles: boolean
  showRelative: boolean
  setSelectedTonic: (tonic: string) => void
  setSelectedMode: (mode: Mode) => void
  setEnharmonicDisplay: (value: EnharmonicDisplay) => void
  setIntervalNomenclature: (value: IntervalNomenclature) => void
  setSelectedInstrument: (value: Instrument) => void
  setShowMinorVariants: (value: boolean) => void
  setShowBlockTitles: (value: boolean) => void
  setShowRelative: (value: boolean) => void
}

const STORAGE_KEY = 'musickindling_settings'

interface PersistedSettings {
  enharmonicDisplay: EnharmonicDisplay
  intervalNomenclature: IntervalNomenclature
  selectedInstrument: Instrument
  showMinorVariants: boolean
  showBlockTitles: boolean
  showRelative: boolean
}

const DEFAULT_SETTINGS: PersistedSettings = {
  enharmonicDisplay: 'both',
  intervalNomenclature: 'anglo',
  selectedInstrument: 'guitar',
  showMinorVariants: true,
  showBlockTitles: true,
  showRelative: true,
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
  const [showMinorVariants, setShowMinorVariants] = useState<boolean>(saved.showMinorVariants)
  const [showBlockTitles, setShowBlockTitles] = useState<boolean>(saved.showBlockTitles)
  const [showRelative, setShowRelative] = useState<boolean>(saved.showRelative)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      enharmonicDisplay,
      intervalNomenclature,
      selectedInstrument,
      showMinorVariants,
      showBlockTitles,
      showRelative,
    }))
  }, [enharmonicDisplay, intervalNomenclature, selectedInstrument, showMinorVariants, showBlockTitles, showRelative])

  return (
    <AppContext.Provider
      value={{
        selectedTonic, selectedMode, enharmonicDisplay, intervalNomenclature, selectedInstrument, showMinorVariants, showBlockTitles, showRelative,
        setSelectedTonic, setSelectedMode, setEnharmonicDisplay, setIntervalNomenclature, setSelectedInstrument, setShowMinorVariants, setShowBlockTitles, setShowRelative,
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
