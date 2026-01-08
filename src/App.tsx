
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './Home/Home'
import Navbar from './components/Navbar/Navbar'

function App() {

  return (
    <>
      <div>Spotify Family Payment Tracker</div>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>} />
      </Routes>
    </>
  )
}

export default App
