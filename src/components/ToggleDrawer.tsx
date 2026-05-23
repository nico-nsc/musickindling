import { useState } from 'react'
import { SidebarContent } from './Sidebar'

export function ToggleDrawer() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Floating button — hidden on lg+ where sidebar is visible */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed bottom-5 right-5 w-12 h-12 rounded-full bg-black text-white shadow-lg flex items-center justify-center text-xl z-20"
        aria-label="Sections"
      >
        ☰
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/30 z-20"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Bottom drawer */}
      <div
        className={`lg:hidden fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-xl z-30 px-6 pt-4 pb-8 transform transition-transform duration-200 ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-6" />
        <SidebarContent />
      </div>
    </>
  )
}
