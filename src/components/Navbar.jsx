import { useEffect, useState } from 'react'
import '../css/Navbar.css'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { useAuth } from '../contexts/AuthContext'

function Navbar() {
    const {user} = useAuth()

    useEffect(() => {
        
    }, [])

    async function handleLogout() {
        const { error } = await supabase.auth.signOut()

        if (error) {
            console.error(error.message)
        }
    }

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/">Increment</Link>
            </div>

            <div className="navbar-links">
                <Link to="/" className="nav-link">
                    Home
                </Link>



                {/* Temporary log in visuals made by chatGPT */}
                {user ? (
                    <>
                        <span className="nav-link">
                            {user.email}
                        </span>

                        <button
                            onClick={handleLogout}
                            className="nav-link"
                        >
                            Log out
                        </button>
                    </>
                ) : (
                    <Link to="/login" className="nav-link">
                        Log in
                    </Link>

                    
                )}
            </div>
        </nav>
    )
}

export default Navbar