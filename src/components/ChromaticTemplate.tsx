import { useTranslation } from 'react-i18next'
import { useApp } from '../context/AppContext'
import { buildChromaticRowData, buildVariantRowData, getRelativeTonic } from '../music/scaleUtils'
import { INTERVAL_LABELS } from '../data/intervals'

const CELL_CLASS = 'w-14 shrink-0 text-center text-xs py-1 px-0.5'
// Title column: sticky at left-0, width driven by showBlockTitles
const TITLE_CELL_CLASS = 'sticky left-0 z-20 bg-white shrink-0 overflow-hidden flex items-center justify-start pl-2 text-xs font-bold text-gray-700 transition-[width] duration-200'
// Scale name column: sticky after the title column
const LABEL_CLASS = 'sticky z-10 bg-white w-24 shrink-0 flex items-center justify-end pr-3 text-xs text-gray-400 transition-[left] duration-200'

export function ChromaticTemplate() {
  const { t } = useTranslation()
  const { selectedTonic, selectedMode, enharmonicDisplay, intervalNomenclature, showMinorVariants, showBlockTitles, showRelative } = useApp()

  const cells = buildChromaticRowData(selectedTonic, selectedMode, enharmonicDisplay)
  const intervalLabels = INTERVAL_LABELS[intervalNomenclature]

  const showVariants = selectedMode === 'natural minor' && showMinorVariants
  const harmonicCells = showVariants ? buildVariantRowData(selectedTonic, 'harmonic minor', enharmonicDisplay) : []
  const melodicCells  = showVariants ? buildVariantRowData(selectedTonic, 'melodic minor',  enharmonicDisplay) : []

  const relative = getRelativeTonic(selectedTonic, selectedMode)
  const relativeCells = showRelative ? buildChromaticRowData(relative.tonic, relative.mode, enharmonicDisplay) : []

  const titleW = showBlockTitles ? '5rem' : '0px'

  return (
    <div className="overflow-x-auto">
      <div className="w-fit mx-auto">

        {/* Intervals row — title and scale name cells empty */}
        <div className="flex gap-1 border-b border-gray-200">
          <div className={TITLE_CELL_CLASS} style={{ width: titleW }} />
          <div className={LABEL_CLASS} style={{ left: titleW }} />
          {cells.map((cell) => (
            <div key={`interval-${cell.semitones}`} className={`${CELL_CLASS} text-gray-400`}>
              {intervalLabels[cell.semitones]}
            </div>
          ))}
        </div>

        {/* Degree row — block title "Tonalité" on this row */}
        <div className="flex gap-1 border-b border-gray-200">
          <div className={TITLE_CELL_CLASS} style={{ width: titleW }}>
            {t('block_labels.tonality')}
          </div>
          <div className={LABEL_CLASS} style={{ left: titleW }} />
          {cells.map((cell) => (
            <div
              key={`degree-${cell.semitones}`}
              className={`${CELL_CLASS} font-bold ${cell.isInScale ? 'text-black' : 'text-gray-200'}`}
            >
              {cell.degreeLabel ?? ' '}
            </div>
          ))}
        </div>

        {/* Notes row */}
        <div className="flex gap-1 pt-1 pb-1 border-b border-gray-200">
          <div className={TITLE_CELL_CLASS} style={{ width: titleW }} />
          <div className={LABEL_CLASS} style={{ left: titleW }}>
            {t(selectedMode === 'major' ? 'scale_labels.major' : 'scale_labels.natural_minor')}
          </div>
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

        {/* Minor variants */}
        {showVariants && (<>

          {/* Harmonic degree row — block title "Variantes" on this row */}
          <div className="flex gap-1 mt-3">
            <div className={TITLE_CELL_CLASS} style={{ width: titleW }}>
              {t('block_labels.minor_variants')}
            </div>
            <div className={LABEL_CLASS} style={{ left: titleW }} />
            {harmonicCells.map((cell) => (
              <div
                key={`harm-deg-${cell.semitones}`}
                className={`${CELL_CLASS} font-bold ${cell.isInVariant ? 'text-black' : 'text-gray-200'}`}
              >
                {cell.degreeLabel ?? ' '}
              </div>
            ))}
          </div>

          {/* Harmonic notes row */}
          <div className="flex gap-1 pt-1 pb-1">
            <div className={TITLE_CELL_CLASS} style={{ width: titleW }} />
            <div className={LABEL_CLASS} style={{ left: titleW }}>
              {t('scale_labels.harmonic_minor')}
            </div>
            {harmonicCells.map((cell) => (
              <div
                key={`harm-note-${cell.semitones}`}
                className={`${CELL_CLASS} rounded-md font-medium border ${
                  cell.isHighlighted
                    ? 'bg-yellow-100 text-black border-yellow-300'
                    : cell.isInVariant
                    ? 'bg-white text-black border-gray-300 shadow-sm'
                    : 'bg-gray-100 text-gray-400 border-gray-200'
                }`}
              >
                {cell.noteName}
              </div>
            ))}
          </div>

          {/* Melodic degree row */}
          <div className="flex gap-1 mt-3">
            <div className={TITLE_CELL_CLASS} style={{ width: titleW }} />
            <div className={LABEL_CLASS} style={{ left: titleW }} />
            {melodicCells.map((cell) => (
              <div
                key={`mel-deg-${cell.semitones}`}
                className={`${CELL_CLASS} font-bold ${cell.isInVariant ? 'text-black' : 'text-gray-200'}`}
              >
                {cell.degreeLabel ?? ' '}
              </div>
            ))}
          </div>

          {/* Melodic notes row */}
          <div className="flex gap-1 pt-1">
            <div className={TITLE_CELL_CLASS} style={{ width: titleW }} />
            <div className={LABEL_CLASS} style={{ left: titleW }}>
              {t('scale_labels.melodic_minor')}
            </div>
            {melodicCells.map((cell) => (
              <div
                key={`mel-note-${cell.semitones}`}
                className={`${CELL_CLASS} rounded-md font-medium border ${
                  cell.isHighlighted
                    ? 'bg-yellow-100 text-black border-yellow-300'
                    : cell.isInVariant
                    ? 'bg-white text-black border-gray-300 shadow-sm'
                    : 'bg-gray-100 text-gray-400 border-gray-200'
                }`}
              >
                {cell.noteName}
              </div>
            ))}
          </div>

        </>)}

        {/* Relative block */}
        {showRelative && (<>

          {/* Relative degree row */}
          <div className="flex gap-1 mt-3">
            <div className={TITLE_CELL_CLASS} style={{ width: titleW }}>
              {t('block_labels.relative')}
            </div>
            <div className={LABEL_CLASS} style={{ left: titleW }} />
            {relativeCells.map((cell) => (
              <div
                key={`rel-deg-${cell.semitones}`}
                className={`${CELL_CLASS} font-bold ${cell.isInScale ? 'text-black' : 'text-gray-200'}`}
              >
                {cell.degreeLabel ?? ' '}
              </div>
            ))}
          </div>

          {/* Relative notes row */}
          <div className="flex gap-1 pt-1">
            <div className={TITLE_CELL_CLASS} style={{ width: titleW }} />
            <div className={LABEL_CLASS} style={{ left: titleW }}>
              {t(relative.mode === 'major' ? 'scale_labels.major' : 'scale_labels.natural_minor')}
            </div>
            {relativeCells.map((cell) => (
              <div
                key={`rel-note-${cell.semitones}`}
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

        </>)}

      </div>
    </div>
  )
}
