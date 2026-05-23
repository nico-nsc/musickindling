import { TonalitySelector } from './components/TonalitySelector'
import { ChromaticTemplate } from './components/ChromaticTemplate'
import { Settings } from './components/Settings'
import { Sidebar } from './components/Sidebar'
import { ToggleDrawer } from './components/ToggleDrawer'
import { HEADER_V_PADDING } from './layout'

function App() {
  return (
    <div className="min-h-screen bg-white flex">
      <Sidebar />
      <div className="flex-1 min-w-0 px-4 md:px-8 pb-24 lg:pb-8">
        <div className="max-w-5xl mx-auto">
          <header className={`flex justify-between items-center ${HEADER_V_PADDING}`}>
            <h1 className="text-xl font-bold text-black">Music Kindling</h1>
            <Settings />
          </header>
          <TonalitySelector />
          <ChromaticTemplate />
        </div>
      </div>
      <ToggleDrawer />
    </div>
  )
}

export default App
