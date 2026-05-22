import { TonalitySelector } from './components/TonalitySelector'
import { ChromaticTemplate } from './components/ChromaticTemplate'
import { Settings } from './components/Settings'

function App() {
  return (
    <div className="min-h-screen bg-white p-4 md:p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-black">Music Kindling</h1>
        <Settings />
      </div>
      <TonalitySelector />
      <ChromaticTemplate />
    </div>
  )
}

export default App
