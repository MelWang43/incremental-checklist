import { useState } from 'react'
import './App.css'
import Viewport from './pages/Viewport'

import { Routes , Route} from 'react-router-dom'

// Components
import Navbar from './components/Navbar'

// Pages
import Home from './pages/Home'
import SignInPage from './pages/SignInPage'
import ProjectPage from './pages/ProjectPage'

function App() {

  return (
    <>
      <div className='app'>
      <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<SignInPage />} />
            <Route path="/project/:id" element={<ProjectPage />} />
          </Routes>
        </main>
      </div>
    </>
  )
}

export default App
