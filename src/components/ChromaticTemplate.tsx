import { useTranslation } from 'react-i18next'
import { useApp } from '../context/AppContext'
import { buildChromaticRowData, buildVariantRowData, getRelativeTonic, getNeighbourTonics, buildNeighbourRowData } from '../music/scaleUtils'
import type { CellData } from '../music/scaleUtils'
import { INTERVAL_LABELS } from '../data/intervals'

const CELL_CLASS = 'w-14 shrink-0 text-center text-xs py-1 px-0.5'
const TITLE_CELL_CLASS = 'sticky left-0 z-20 bg-white shrink-0 overflow-hidden flex items-center justify-start pl-2 text-xs font-bold text-gray-700 transition-[width] duration-200'
const LABEL_CLASS = 'sticky z-10 bg-white w-24 shrink-0 flex items-center justify-end pr-3 text-xs text-gray-400 transition-[left] duration-200'

// Note absent from main scale entirely
const CELL_NOTE_ABSENT  = 'bg-yellow-200 text-black border-yellow-400'
// Note present in main scale but chord quality differs
const CELL_CHORD_DIFFERS = 'bg-yellow-50 text-black border-yellow-200'

function DegreeRow({ cells, titleW, title, label, spacing = true }: {
  cells: CellData[]
  titleW: string
  title?: string
  label?: string
  spacing?: boolean
}) {
  return (
    <div className={`flex gap-1${spacing ? ' mt-3' : ''}`}>
      <div className={TITLE_CELL_CLASS} style={{ width: titleW }}>{title}</div>
      <div className={LABEL_CLASS} style={{ left: titleW }}>{label}</div>
      {cells.map((cell) => (
        <div key={cell.semitones} className={`${CELL_CLASS} font-bold ${cell.isInScale ? 'text-black' : 'text-gray-200'}`}>
          {cell.degreeLabel ?? ' '}
        </div>
      ))}
    </div>
  )
}

function NotesRow({ cells, titleW, label, closing = false }: {
  cells: CellData[]
  titleW: string
  label?: string
  closing?: boolean
}) {
  return (
    <div className={`flex gap-1 pt-1 pb-1${closing ? ' border-b border-gray-200' : ''}`}>
      <div className={TITLE_CELL_CLASS} style={{ width: titleW }} />
      <div className={LABEL_CLASS} style={{ left: titleW }}>{label}</div>
      {cells.map((cell) => (
        <div key={cell.semitones} className={`${CELL_CLASS} rounded-md font-medium border ${
          cell.isInScale && !cell.isNoteInMain
            ? CELL_NOTE_ABSENT
            : cell.isInScale && !cell.isChordInMain
            ? CELL_CHORD_DIFFERS
            : cell.isInScale
            ? 'bg-white text-black border-gray-300 shadow-sm'
            : 'bg-gray-100 text-gray-400 border-gray-200'
        }`}>
          {cell.noteName}
        </div>
      ))}
    </div>
  )
}

export function ChromaticTemplate() {
  const { t } = useTranslation()
  const { selectedTonic, selectedMode, enharmonicDisplay, intervalNomenclature, showMinorVariants, showBlockTitles, showRelative, showNeighbours } = useApp()

  const cells = buildChromaticRowData(selectedTonic, selectedMode, enharmonicDisplay)
  const intervalLabels = INTERVAL_LABELS[intervalNomenclature]

  const showVariants = selectedMode === 'natural minor' && showMinorVariants
  const harmonicCells = showVariants ? buildVariantRowData(selectedTonic, 'harmonic minor', enharmonicDisplay) : []
  const melodicCells  = showVariants ? buildVariantRowData(selectedTonic, 'melodic minor',  enharmonicDisplay) : []

  const relative = getRelativeTonic(selectedTonic, selectedMode)
  const relativeCells = showRelative ? buildChromaticRowData(relative.tonic, relative.mode, enharmonicDisplay) : []

  const neighbours = getNeighbourTonics(selectedTonic)
  const leftCells  = showNeighbours ? buildNeighbourRowData(neighbours.left,  selectedMode, selectedTonic, enharmonicDisplay) : []
  const rightCells = showNeighbours ? buildNeighbourRowData(neighbours.right, selectedMode, selectedTonic, enharmonicDisplay) : []

  const titleW = showBlockTitles ? '5rem' : '0px'
  const scaleLabel = t(selectedMode === 'major' ? 'scale_labels.major' : 'scale_labels.natural_minor')

  return (
    <div className="overflow-x-auto">
      <div className="w-fit mx-auto">

        {/* Intervals row */}
        <div className="flex gap-1 border-b border-gray-200">
          <div className={TITLE_CELL_CLASS} style={{ width: titleW }} />
          <div className={LABEL_CLASS} style={{ left: titleW }} />
          {cells.map((cell) => (
            <div key={cell.semitones} className={`${CELL_CLASS} text-gray-400`}>
              {intervalLabels[cell.semitones]}
            </div>
          ))}
        </div>

        {/* Tonality block */}
        <DegreeRow cells={cells} titleW={titleW} title={t('block_labels.tonality')} spacing={false} />
        <NotesRow  cells={cells} titleW={titleW} label={scaleLabel} closing />

        {/* Minor variants block */}
        {showVariants && (<>
          <DegreeRow cells={harmonicCells} titleW={titleW} title={t('block_labels.minor_variants')} />
          <NotesRow  cells={harmonicCells} titleW={titleW} label={t('scale_labels.harmonic_minor')} />
          <DegreeRow cells={melodicCells}  titleW={titleW} />
          <NotesRow  cells={melodicCells}  titleW={titleW} label={t('scale_labels.melodic_minor')} closing />
        </>)}

        {/* Relative block */}
        {showRelative && (<>
          <DegreeRow cells={relativeCells} titleW={titleW} title={t('block_labels.relative')} />
          <NotesRow  cells={relativeCells} titleW={titleW} label={t(relative.mode === 'major' ? 'scale_labels.major' : 'scale_labels.natural_minor')} closing />
        </>)}

        {/* Neighbours block */}
        {showNeighbours && (<>
          <DegreeRow cells={leftCells}  titleW={titleW} title={t('block_labels.neighbours')} label="←" />
          <NotesRow  cells={leftCells}  titleW={titleW} label={scaleLabel} />
          <DegreeRow cells={rightCells} titleW={titleW} label="→" />
          <NotesRow  cells={rightCells} titleW={titleW} label={scaleLabel} closing />
        </>)}

      </div>
    </div>
  )
}
