import { Link, useNavigate } from "react-router-dom"
import { supabase } from "../../client/supabaseClient"
import type React from "react"
import { useUser } from "../../contexts/useUser"

function Navbar(){
    const navigate = useNavigate()
    const {user} = useUser()
    const logoutUser = async (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault()
        await supabase.auth.signOut()
        navigate("/login")
    }
    return (
        <div>
            <div>
                <div>
                    <Link to="/">Home</Link>
                </div>
                {
                    user ? (
                        <>
                            <div>
                                <Link to="/dashboard">Dashboard</Link>
                            </div>
                            <div>
                                <Link to="/logs">Logs</Link>
                            </div>
                            <div>
                                <a onClick={logoutUser} href="/login">Logout</a>
                            </div>
                        </>
                    ) : (
                        <>
                            <div>
                                <Link to="/login">Login</Link>
                            </div>
                            <div>
                                <Link to="/signup">Signup</Link>
                            </div>
                        </>
                    )
                }
                
            </div>
        </div>
    )
}

export default Navbar