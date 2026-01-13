import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../../client/supabaseClient"
import "./Login.css"

function Login() {
  const [email,setEmail] = useState("")
  const [pass,setPass] = useState("")
  const [error,setError] = useState({
    pass: "",
    email: "",
  })
  const navigate = useNavigate()

  const formValidation = () => {
    const newError = {
      pass: "",
      email: "",
    }

    if (!pass.trim()) newError.pass = "Password is required"
    if (!email.trim()) newError.email = "Email is required"

    setError(newError)

    return !(newError.email || newError.pass)
  }

  const handleSubmit = async () => {
    if (!formValidation()) return

    console.log("Logging in...");
    
    const {error:loginErr} = await supabase.auth.signInWithPassword({
      email: email,
      password: pass
    })
    if (loginErr) console.error("Error logging in: ", loginErr);

    navigate("/dashboard")

    setError({
      pass: "",
      email: "",
    })
  }
  
  return (
    <div className="login-main">
      <div className="login-title">Login Page</div>
      <div>
        <form action={handleSubmit}>          
          <div className="login-form-con">
            <div>
              <label className="login-label" htmlFor="email">Email:</label>
              <input placeholder="Enter your email..." type="email" id="email" value={email} onChange={
                (e) => (
                  setEmail(e.target.value)
                )
              }/>
              {error.email && (
                error.email
              )}
            </div>
            
            <div>
              <label className="login-label" htmlFor="password">Password:</label>
              <input placeholder="Enter your password..." type="password" id="password" value={pass} onChange={
                (e) => (
                  setPass(e.target.value)
                )
              }/>
              {error.pass && (
                error.pass
              )}
            </div>
          </div>
          

          <button type="submit">Log in</button>
        </form>
      </div>
    </div>
  )
}

export default Login