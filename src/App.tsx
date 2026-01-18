import { Routes, Route } from 'react-router-dom'
import TableView from './pages/TableView'
import DetailView from './pages/DetailView'

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        <Route path="/" element={<TableView />} />
        <Route path="/pokemon/:id" element={<DetailView />} />
      </Routes>
    </div>
  )
}

export default App
