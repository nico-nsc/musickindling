import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useApp } from '../context/AppContext'
import type { EnharmonicDisplay, Instrument } from '../context/AppContext'
import type { IntervalNomenclature } from '../data/intervals'

// Generic row of option buttons — reused for each setting section
function OptionRow<T extends string>({
  options,
  selected,
  onSelect,
}: {
  options: { value: T; label: string }[]
  selected: T
  onSelect: (value: T) => void
}) {
  return (
    <div className="flex flex-wrap gap-1">
      {options.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onSelect(value)}
          className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
            selected === value
              ? 'bg-black text-white border-black'
              : 'bg-white text-black border-gray-300 hover:border-gray-500'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

export function Settings() {
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useTranslation()
  const {
    enharmonicDisplay, setEnharmonicDisplay,
    intervalNomenclature, setIntervalNomenclature,
    selectedInstrument, setSelectedInstrument,
  } = useApp()

  const enharmonicOptions: { value: EnharmonicDisplay; label: string }[] = [
    { value: 'both',  label: t('settings.enharmonic.both')  },
    { value: 'sharp', label: t('settings.enharmonic.sharp') },
    { value: 'flat',  label: t('settings.enharmonic.flat')  },
  ]

  const nomenclatureOptions: { value: IntervalNomenclature; label: string }[] = [
    { value: 'anglo',    label: t('settings.nomenclature.anglo')    },
    { value: 'academic', label: t('settings.nomenclature.academic') },
    { value: 'french',   label: t('settings.nomenclature.french')   },
  ]

  const instrumentOptions: { value: Instrument; label: string }[] = [
    { value: 'guitar', label: t('settings.instrument.guitar') },
    { value: 'piano',  label: t('settings.instrument.piano')  },
  ]

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-md border border-gray-200 hover:border-gray-400 transition-colors text-gray-500 hover:text-black"
        aria-label={t('settings.title')}
      >
        ⚙
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl p-6 w-[90vw] max-w-sm max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-base font-bold text-black">{t('settings.title')}</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-black text-lg leading-none"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-5">

              <div>
                <p className="text-xs font-medium text-gray-500 mb-2">
                  {t('settings.enharmonic.label')}
                </p>
                <OptionRow
                  options={enharmonicOptions}
                  selected={enharmonicDisplay}
                  onSelect={setEnharmonicDisplay}
                />
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500 mb-2">
                  {t('settings.nomenclature.label')}
                </p>
                <OptionRow
                  options={nomenclatureOptions}
                  selected={intervalNomenclature}
                  onSelect={setIntervalNomenclature}
                />
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500 mb-2">
                  {t('settings.instrument.label')}
                </p>
                <OptionRow
                  options={instrumentOptions}
                  selected={selectedInstrument}
                  onSelect={setSelectedInstrument}
                />
              </div>

            </div>
          </div>
        </>
      )}
    </>
  )
}
