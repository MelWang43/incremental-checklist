import { useState } from 'react'
import './App.css'
import Viewport from './pages/Viewport'

import { Routes , Route} from 'react-router-dom'

// Components
import Navbar from './components/Navbar'

// Pages
import Home from './pages/Home'
import ProjectPage from './pages/ProjectPage'
import SignInPage from './pages/SignInPage'

function App() {

  return (
    <>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<ProjectPage />} />
          <Route path="/login" element={<SignInPage />} />
        </Routes>
      </main>
    </>
  )
}

export default App
