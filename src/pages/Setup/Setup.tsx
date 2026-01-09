import { useEffect, useState } from "react";
import { type Member } from "../../types/Types";
import { supabase } from "../../client/supabaseClient";
import { useUser } from "../../contexts/useUser";
import { formatName } from "../../contexts/useFormat";
import { fetchAccountData } from "../../contexts/fetchData";
import { useLocation, useNavigate } from "react-router-dom";

function Setup() {
  const {user} = useUser()
  const [name,setName] = useState("") 
  const [lastpaid,setLastPaid] = useState("")
  const [entries,setEntries] = useState<Member[]>([])
  const [error,setError] = useState({
    name: "",
    lastpaid: "",
    members: ""
  })
  const [accsetup,setAccsetup] = useState<any>([])
  const location = useLocation()
  const {activity} = location.state
  const [entriesErrors, setEntriesErrors] = useState<{ name?: string; lastPaid?: string }[]>([])
  const MAX_MEMBERS = 6
  const maxReached = entries.length >= MAX_MEMBERS
  const navigate = useNavigate()

  useEffect(()=>{
    const fetchAccSetup = async () => {
      const accsetupdata = await fetchAccountData()
      setAccsetup(accsetup)
      const current = accsetupdata?.find((acc:any) => acc.email === user?.email)

      if (activity === "edit") {
        setEntries(current.members.map((m: any)=> ({
          name: m.name,
          lastPaid: new Date(m.lastPaid)
        })))

        // console.log(current);
      }
    }
    fetchAccSetup()
  },[activity,user])

  const validateForms = () => {
    const newError = {
      name: "",
      lastpaid: "",
      members: ""
    }
    if(!name) newError.name = "Required" 
    if(!lastpaid) newError.lastpaid = "Required" 

    setError(newError)

    if(newError.name || newError.lastpaid) return false
    
    return true
  }

  const handleSubmit = async () => {
    if (!validateEntries()) return

    console.log("Setting up...");
    if(entries.length === 0) setError(prev=> ({...prev, members: "Add at least one field..."}))

    const {error} = await supabase
    .from("account_setup")
    .update({
      members: entries
    })
    .eq("email",user?.email)

    if(error) console.error("Error in updating members in account_setup table");

    navigate("/dashboard")
  }

  const addField = () => {
    if(!validateForms()) return
    if (entries.length >= MAX_MEMBERS) return

    const newEntry: Member = {
      name,
      lastPaid: new Date(lastpaid)
    }

    setEntries(prev=>[...prev,newEntry])

    setName("")
    setLastPaid("")
  }

  const validateEntries = (): boolean => {
    let hasError = false
    const newEntriesErrors = entries.map((entry) => {
      const entryError: { name?: string; lastPaid?: string } = {}
      if (!entry.name.trim()) {
        entryError.name = "Required"
        hasError = true
      }
      if (!entry.lastPaid) {
        entryError.lastPaid = "Required"
        hasError = true
      }
      return entryError
    })

    setEntriesErrors(newEntriesErrors)
    return !hasError
  }

  return (
    <div>
        <div>Setup Page</div>
        {
          activity === "edit" ? (
            <div>
              Edit your Spotify Family Members

              <div>
                <div>Enter your Spotify Family plan members below:</div>
                <form action={handleSubmit}>
                  <div>
                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" value={name} onChange={(e)=>{
                      setName(e.target.value)
                    }}/>
                    {error.name && (
                      error.name
                    )}
                  </div>
                  <div>
                    <label htmlFor="lastpaid">Last Paid Date:</label>
                    <input type="date" id="lastpaid" value={lastpaid} onChange={(e)=>{
                      setLastPaid(e.target.value)
                    }}/>
                    {error.lastpaid && (
                      error.lastpaid
                    )}
                  </div>
                  <div>
                    <button disabled={maxReached} type="button" onClick={addField}>{entries.length >= MAX_MEMBERS ? "Maximum" : "Add"}</button>
                  </div>
                  <br />

                  {
                    entries.map((m,i)=>(
                      <div key={i}>
                        <div>
                          <label htmlFor="name">Name:</label>
                          <input type="text" id="name" value={m.name} onChange={(e)=>{
                            const newEntries = [...entries]
                            newEntries[i].name = e.target.value
                            setEntries(newEntries)
                          }}/>
                          {entriesErrors[i]?.name && <span>{entriesErrors[i].name}</span>}
                        </div>
                        <div>
                          <label htmlFor="lastpaid">Last Paid Date:</label>
                          <input type="date" id="lastpaid" value={m.lastPaid.toISOString().split("T")[0]} onChange={(e)=>{
                            const newEntries = [...entries]
                            newEntries[i].lastPaid = new Date(e.target.value)
                            setEntries(newEntries)
                          }}/>
                          {entriesErrors[i]?.lastPaid && <span>{entriesErrors[i].lastPaid}</span>}
                        </div>                      

                          <button type="button" onClick={()=>(
                            setEntries(prev=>prev.filter((_,index)=>index !== i))
                          )}>Remove</button>
                      </div>
                    ))
                  }
                  {error.members && (
                    error.members
                  )}
                  <div>
                    <button type="submit">Setup</button>
                  </div>
                </form>
              </div>   
            </div>
          ) : (
            //ANCHOR - CREATING AND NOT EDITING ===========================
            <div>
              <div>Enter your Spotify Family plan members below:</div>
              <form action={handleSubmit}>
                <div>
                  <label htmlFor="name">Name:</label>
                  <input type="text" id="name" value={name} onChange={(e)=>{
                    setName(e.target.value)
                  }}/>
                  {error.name && (
                    error.name
                  )}
                </div>
                <div>
                  <label htmlFor="lastpaid">Last Paid Date:</label>
                  <input type="date" id="lastpaid" value={lastpaid} onChange={(e)=>{
                    setLastPaid(e.target.value)
                  }}/>
                  {error.lastpaid && (
                    error.lastpaid
                  )}
                </div>
                <div>
                  <button type="button" onClick={addField}>Add</button>
                </div>

                {
                  entries.map((m,i)=>(
                    <div key={i}>
                      <ul>
                        <li>Name: {formatName(m.name)}</li>
                        <li> Last Paid: {m.lastPaid.toDateString()}</li>
                        <button type="button" onClick={()=>(
                          setEntries(prev=>prev.filter((_,index)=>index !== i))
                        )}>Remove</button>
                      </ul>
                    </div>
                  ))
                }
                {error.members && (
                  error.members
                )}
                <div>
                  <button type="submit">Setup</button>
                </div>
              </form>
            </div>   
          )
        }
    </div>
  )
}

export default Setup