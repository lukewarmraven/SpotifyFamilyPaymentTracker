import { useEffect, useState } from "react";
import { type Member } from "../../types/Types";
import { supabase } from "../../client/supabaseClient";
import { useUser } from "../../contexts/useUser";
import { formatName } from "../../contexts/useFormat";
import { fetchAccountData } from "../../contexts/fetchData";
import { useLocation, useNavigate } from "react-router-dom";

function Setup() {
  useEffect(()=>{
    document.title = "Account Setup"
  },[])
  const {user} = useUser()
  const [name,setName] = useState("") 
  const [lastpaid,setLastPaid] = useState("")
  const [entries,setEntries] = useState<Member[]>([])
  const [error,setError] = useState({
    name: "",
    lastpaid: "",
    members: "",
    billing: ""
  })
  const [accsetup,setAccsetup] = useState<any>([])
  const [billing,setBilling] = useState("")
  const location = useLocation()
  const {activity} = location.state
  const [entriesErrors, setEntriesErrors] = useState<{ name?: string; lastPaid?: string }[]>([])
  const MAX_MEMBERS = 6
  const maxReached = entries.length >= MAX_MEMBERS
  const navigate = useNavigate()

  useEffect(()=>{
    const fetchAccSetup = async () => {
      const accsetupdata = await fetchAccountData()
      const current = accsetupdata?.find((acc:any) => acc.email === user?.email)
      setAccsetup(current)

      if (activity === "edit" && current.members) {
        setEntries(current.members.map((m: any)=> ({
          name: m.name,
          lastPaid: new Date(m.lastPaid)
        })))
        setBilling(current?.billing_date)

        // console.log(current);
      }
    }
    fetchAccSetup()
  },[activity,user])

  const validateForms = () => {
    const newError = {
      name: "",
      lastpaid: "",
      members: "",
      billing: ""
    }
    if(!name) newError.name = "Required" 
    if(!lastpaid) newError.lastpaid = "Required" 
    // if(!billing) newError.billing = "Required"

    setError(newError)

    if(newError.name || newError.lastpaid) return false
    
    return true
  }

  const handleSubmit = async () => {
    if (!validateEntries()) return
    if(entries.length === 0) {
      setError(prev=> ({...prev, members: "Add at least one field..."}))
      return
    }
      console.log("Setting up...");

    const {error} = await supabase
    .from("account_setup")
    .update({
      members: entries,
      billing_date: billing
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
    if(!billing) {
      setError(prev=>({...prev, billing: "Required"}))
      return false
    }
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

  // console.log(accsetup);
  // console.log(entries.length);
  // console.log(Boolean(accsetup?.billing_date));
  return (
    <div>
        <div>Setup Page</div>
        {
          (activity === "edit" && (entries.length > 0 || accsetup?.billing_date)) ? (
            <div>
              Edit your Spotify Family Information

              <div>
                <form action={handleSubmit}>
                <div>
                  <label htmlFor="billing">Start of Monthly Billing:</label>
                  <input type="date" value={billing} max={new Date().toISOString().split("T")[0]} onChange={(e)=>{
                    setBilling(e.target.value)
                  }}/>
                  {
                    error.billing && (
                      error.billing
                    )
                  }
                </div>
                <div>Enter your Spotify Family plan members below:</div>
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
                    <input type="date" id="lastpaid" max={new Date().toISOString().split("T")[0]} value={lastpaid} onChange={(e)=>{
                      setLastPaid(e.target.value)
                    }}/>
                    {error.lastpaid && (
                      error.lastpaid
                    )}
                  </div>
                  <div>
                    <button disabled={maxReached} type="button" onClick={addField}>{entries.length >= MAX_MEMBERS ? "Maxed" : "Add"}</button> 
                    {maxReached && ("Spotify only allows 6 members maximum per family plan!")}
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
                          <input type="date" id="lastpaid" max={new Date().toISOString().split("T")[0]} value={m.lastPaid.toISOString().split("T")[0]} onChange={(e)=>{
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
                    <button type="submit">Save</button>
                  </div>
                </form>
              </div>   
            </div>
          ) : (
            //ANCHOR - CREATING AND NOT EDITING ===========================
            <div>
              
              <form action={handleSubmit}>
                <div>
                  <label htmlFor="billing">Start of Monthly Billing:</label>
                  <input type="date" max={new Date().toISOString().split("T")[0]} value={billing} onChange={(e)=>{
                    setBilling(e.target.value)
                  }}/>
                  {error.billing && (
                    error.billing
                  )}
                </div>
                <div>Enter your Spotify Family plan members below:</div>
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
                  <input type="date" id="lastpaid" max={new Date().toISOString().split("T")[0]} value={lastpaid} onChange={(e)=>{
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