
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home/Home'
import Navbar from './components/Navbar/Navbar'
import Login from './pages/Login/Login'
import Signup from './pages/Signup/Signup'
import AuthLayer from './contexts/AuthLayer'
import Dashboard from './pages/Dashboard/Dashboard'
import Setup from './pages/Setup/Setup'
import Account from './pages/Account/Account'
import { useEffect } from 'react'
import Logs from './pages/LogsPage/LogsPage'

function App() {
  useEffect(()=>{
    document.title = "Spotify Payment Tracker"
  },[])

  return (
    <>
      {/* <div>Spotify Family Payment Tracker</div> */}
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/signup' element={<Signup/>} />

        <Route element={<AuthLayer/>}>
          <Route path='/setup' element={<Setup/>} />
          <Route path='/logs' element={<Logs/>} />
          <Route path='/dashboard' element={<Dashboard/>} />
          <Route path='/account' element={<Account/>} />
        </Route>

      </Routes>
    </>
  )
}

export default App
