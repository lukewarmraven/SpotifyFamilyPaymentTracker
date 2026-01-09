import { useState } from "react"
import { supabase } from "../../client/supabaseClient"
import { useNavigate } from "react-router-dom"

function Signup() {
  const [owner,setOwner] = useState("")
  const [email,setEmail] = useState("")
  const [pass,setPass] = useState("")
  const [error,setError] = useState({
    owner: "",
    pass: "",
    email: "",
  })
  const navigate = useNavigate()

  const formValidation = () => {
    const newError = {
      owner: "",
      pass: "",
      email: "",
    }

    if (!owner.trim()) newError.owner = "Username is required"
    if (!pass.trim()) newError.pass = "Password is required"
    if (!email.trim()) newError.email = "Email is required"

    setError(newError)

    return !(newError.owner || newError.email || newError.pass)
  }

  const handleSubmit = async () => {
    if (!formValidation()) return

    console.log("Signing up...");

    const {data,error:signUpErr} = await supabase.auth.signUp({
      email: email,
      password: pass
    })
    if (signUpErr) console.error("Error signing up: ", signUpErr);

    if (!data?.user?.email) {
      console.error("No user returned from signup, cannot login");
      return;
    }
    
    const {data: loginData,error:loginErr} = await supabase.auth.signInWithPassword({
      email:data.user.email,
      password: pass
    })
    if (loginErr) console.error("Error logging in: ", loginErr);

    if(loginData.session){
      console.log("Setting session...");
      await supabase.auth.setSession(loginData.session)
    }
    
    const {error} = await supabase
    .from("account_setup")
    .insert({
      owner: owner,
      email: data.user?.email
    })
    if (error) console.error("Error inserting to account_setup table: ", error);

    navigate("/setup")

    setError({
      owner: "",
      pass: "",
      email: "",
    })
  }
  
  return (
    <div>
      <div>Signup Page</div>
      <div>
        <form action={handleSubmit}>
          <div>
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" value={owner} onChange={
              (e) => (
                setOwner(e.target.value)
              )
            }/>
            {error.owner && (
              error.owner
            )}
          </div>
          
          <div>
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" value={email} onChange={
              (e) => (
                setEmail(e.target.value)
              )
            }/>
            {error.email && (
              error.email
            )}
          </div>
          
          <div>
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" value={pass} onChange={
              (e) => (
                setPass(e.target.value)
              )
            }/>
            {error.pass && (
              error.pass
            )}
          </div>

          <button type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  )
}

export default Signup