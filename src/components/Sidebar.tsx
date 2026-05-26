import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useApp } from '../context/AppContext'
import { HEADER_V_PADDING, SELECTOR_BLOCK_H } from '../layout'

export function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
        checked ? 'bg-black' : 'bg-gray-300'
      }`}
    >
      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
        checked ? 'translate-x-4' : 'translate-x-0.5'
      }`} />
    </button>
  )
}

export function SidebarContent() {
  const { t } = useTranslation()
  const { showMinorVariants, setShowMinorVariants, showRelative, setShowRelative, showNeighbours, setShowNeighbours } = useApp()

  return (
    <div className="flex flex-col gap-3">
      <label className="flex items-center justify-between gap-4 cursor-pointer select-none">
        <span className="text-sm text-gray-700">{t('sidebar.minor_variants')}</span>
        <Toggle checked={showMinorVariants} onChange={setShowMinorVariants} />
      </label>
      <label className="flex items-center justify-between gap-4 cursor-pointer select-none">
        <span className="text-sm text-gray-700">{t('sidebar.relative')}</span>
        <Toggle checked={showRelative} onChange={setShowRelative} />
      </label>
      <label className="flex items-center justify-between gap-4 cursor-pointer select-none">
        <span className="text-sm text-gray-700">{t('sidebar.neighbours')}</span>
        <Toggle checked={showNeighbours} onChange={setShowNeighbours} />
      </label>
    </div>
  )
}

export function Sidebar() {
  const [expanded, setExpanded] = useState(true)

  return (
    // Outer div: containing block for the tab button, no overflow-hidden
    <div className="hidden lg:block relative shrink-0">

      {/* Clip container: overflow-hidden clips the sidebar content during collapse.
          The tab button is a SIBLING (not a child) so it is NOT clipped. */}
      <div className={`overflow-hidden transition-[width] duration-200 h-full ${
        expanded ? 'w-52' : 'w-0'
      }`}>
        <div className="w-52 h-full border-r border-gray-100">
          {/* Invisible spacers matching header + TonalitySelector height */}
          <div className={`${HEADER_V_PADDING} invisible`}>
            <div className="text-xl">x</div>
          </div>
          <div className={`${SELECTOR_BLOCK_H} invisible`} />
          <div className="px-4">
            <SidebarContent />
          </div>
        </div>
      </div>

      {/* Tab button — sibling of clip container, follows right edge as sidebar animates */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="absolute top-32 left-full z-10 w-4 h-8 flex items-center justify-center bg-white border-y border-r border-gray-200 rounded-r-md shadow-sm text-gray-400 hover:text-gray-700 text-[10px]"
        aria-label={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
      >
        {expanded ? '‹' : '›'}
      </button>
    </div>
  )
}
