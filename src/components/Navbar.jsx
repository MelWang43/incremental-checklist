import { useEffect, useState } from 'react'
import '../css/Navbar.css'
import { Link, useRevalidator } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useConfirm } from '../contexts/ConfirmContext'

function Navbar() {
    const {user} = useAuth()

    const {confirm} = useConfirm();
    useEffect(() => {
        
    }, [])

    async function handleLogout() {
        
        
        const confirmed = await confirm({
            title: "Log out",
            message: "Are you sure you want to log out?",
            confirmButtonText: 'Confirm'
        })

        if(!confirmed) return;

        const { error } = await supabase.auth.signOut()

        window.location.href = "/";
        if (error) {
            console.error(error.message)
        }
    }

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/"><img src="/google.svg" alt="logo" width={40}/></Link>
            </div>

            <div className="navbar-links">
                {/* <Link to="/" className="nav-link">
                    Home
                </Link> */}



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
                    <>
                    <a href="/account/login">
                        <button>Log in</button>
                    </a>

                        
                        {/* <Link to="/login" className="nav-link">
                            
                        </Link> */}

                        <a href="/account/signup">
                        <button>Sign up</button>
                        </a>
                        {/* <Link to="/signup" className="nav-link">
                            Sign up
                        </Link> */}
                    </>
                )}
            </div>
        </nav>
    )
}

export default Navbar