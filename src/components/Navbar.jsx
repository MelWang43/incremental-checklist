import '../css/Navbar.css'
import { Link } from 'react-router-dom'

function Navbar(){
    return(
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/">Increment</Link>
            </div>
            <div className="navbar-links">
                <Link to="/" className="nav-link">Home</Link>
                <Link to="/projects" className="nav-link">Projects</Link>
            </div>
        </nav>
    )
}

export default Navbar