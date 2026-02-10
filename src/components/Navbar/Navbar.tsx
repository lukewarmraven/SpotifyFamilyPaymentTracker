import { Link, useNavigate } from "react-router-dom"
import { supabase } from "../../client/supabaseClient"
import type React from "react"
import { useUser } from "../../contexts/useUser"
import "./Navbar.css"
import spotify from '../../assets/spotify.png'

function Navbar(){
    const navigate = useNavigate()
    const {user} = useUser()
    const logoutUser = async (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault()
        await supabase.auth.signOut()
        navigate("/login")
    }
    return (
        <div className="main">
            <Link className="nav-button no-hover" to="/dashboard">
                <img className="nav-logo" src={spotify} alt="spotify tracker logo" />
            </Link>
        {
            user ? (
                <>
                    <Link className="nav-button" to="/dashboard">Dashboard</Link>
                    <Link className="nav-button" to="/logs">Logs</Link>
                    <a className="nav-button" onClick={logoutUser} href="/login">Logout</a>
                </>
            ) : (
                <>
                    <Link className="nav-button" to="/login">Login</Link>
                    <Link className="nav-button" to="/signup">Signup</Link>
                </>
            )
        }
        
    </div>
    )
}

export default Navbar