import { useTranslation } from 'react-i18next'
import { useApp } from '../context/AppContext'
import { TONIC_OPTIONS } from '../data/tonics'
import type { Mode } from '../context/AppContext'

const MODE_OPTIONS: { value: Mode; labelKey: string }[] = [
  { value: 'major',         labelKey: 'selector.mode_major' },
  { value: 'natural minor', labelKey: 'selector.mode_natural_minor' },
]

export function TonalitySelector() {
  const { t } = useTranslation()
  const { selectedTonic, selectedMode, setSelectedTonic, setSelectedMode } = useApp()

  return (
    <div className="flex flex-wrap gap-4 items-center mb-6">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700">
          {t('selector.tonic_label')}
        </label>
        <select
          value={selectedTonic}
          onChange={(e) => setSelectedTonic(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-1.5 text-sm bg-white text-black focus:outline-none focus:ring-2 focus:ring-black"
        >
          {TONIC_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-1">
        {MODE_OPTIONS.map(({ value, labelKey }) => (
          <button
            key={value}
            onClick={() => setSelectedMode(value)}
            className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
              selectedMode === value
                ? 'bg-black text-white border-black'
                : 'bg-white text-black border-gray-300 hover:border-gray-500'
            }`}
          >
            {t(labelKey)}
          </button>
        ))}
      </div>
    </div>
  )
}
