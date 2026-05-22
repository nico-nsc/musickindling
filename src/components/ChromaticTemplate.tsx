import { useApp } from '../context/AppContext'
import { buildChromaticRowData } from '../music/scaleUtils'
import { INTERVAL_LABELS } from '../data/intervals'

// Width of each cell in the 13-column grid.
// Must be wide enough to display enharmonic pairs like "C#/Db" (6 chars).
const CELL_CLASS = 'w-14 shrink-0 text-center text-xs py-1 px-0.5'

export function ChromaticTemplate() {
  const { selectedTonic, selectedMode, enharmonicDisplay, intervalNomenclature } = useApp()
  const cells = buildChromaticRowData(selectedTonic, selectedMode, enharmonicDisplay)
  const intervalLabels = INTERVAL_LABELS[intervalNomenclature]

  return (
    <div className="overflow-x-auto">
      <div className="w-fit mx-auto">

        {/* Row 1 — Chromatic intervals */}
        <div className="flex gap-1 border-b border-gray-200">
          {cells.map((cell) => (
            <div key={`interval-${cell.semitones}`} className={`${CELL_CLASS} text-gray-400`}>
              {intervalLabels[cell.semitones]}
            </div>
          ))}
        </div>

        {/* Row 2 — Scale degrees (empty = note outside scale) */}
        <div className="flex gap-1 border-b border-gray-200">
          {cells.map((cell) => (
            <div
              key={`degree-${cell.semitones}`}
              className={`${CELL_CLASS} font-bold ${
                cell.isInScale ? 'text-black' : 'text-gray-200'
              }`}
            >
              {/* Non-breaking space keeps the row height consistent when the cell is empty */}
              {cell.degreeLabel ?? ' '}
            </div>
          ))}
        </div>

        {/* Row 3 — Note names (greyed out = outside scale) */}
        <div className="flex gap-1 pt-1">
          {cells.map((cell) => (
            <div
              key={`note-${cell.semitones}`}
              className={`${CELL_CLASS} rounded-md font-medium border ${
                cell.isInScale
                  ? 'bg-white text-black border-gray-300 shadow-sm'
                  : 'bg-gray-100 text-gray-400 border-gray-200'
              }`}
            >
              {cell.noteName}
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
