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
  setSelectedTonic: (tonic: string) => void
  setSelectedMode: (mode: Mode) => void
  setEnharmonicDisplay: (value: EnharmonicDisplay) => void
  setIntervalNomenclature: (value: IntervalNomenclature) => void
  setSelectedInstrument: (value: Instrument) => void
}

// localStorage key for persisted settings
const STORAGE_KEY = 'musickindling_settings'

interface PersistedSettings {
  enharmonicDisplay: EnharmonicDisplay
  intervalNomenclature: IntervalNomenclature
  selectedInstrument: Instrument
}

const DEFAULT_SETTINGS: PersistedSettings = {
  enharmonicDisplay: 'both',
  intervalNomenclature: 'anglo',
  selectedInstrument: 'guitar',
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

  // Persist settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      enharmonicDisplay,
      intervalNomenclature,
      selectedInstrument,
    }))
  }, [enharmonicDisplay, intervalNomenclature, selectedInstrument])

  return (
    <AppContext.Provider
      value={{
        selectedTonic, selectedMode, enharmonicDisplay, intervalNomenclature, selectedInstrument,
        setSelectedTonic, setSelectedMode, setEnharmonicDisplay, setIntervalNomenclature, setSelectedInstrument,
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
