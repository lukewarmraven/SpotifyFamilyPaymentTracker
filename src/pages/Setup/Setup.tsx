import { useEffect, useRef, useState } from "react";
import { type Member } from "../../types/Types";
import { supabase } from "../../client/supabaseClient";
import { useUser } from "../../contexts/useUser";
import { formatName } from "../../contexts/useFormat";
import { fetchAccountData } from "../../contexts/fetchData";
import { useLocation, useNavigate } from "react-router-dom";
import "./Setup.css"

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
    billing: "",
    price: ""
  })
  const [accsetup,setAccsetup] = useState<any>([])
  const [billing,setBilling] = useState("")
  const [price,setPrice] = useState(0)
  const [origprice,setOrigPrice] = useState(0)
  const location = useLocation()
  const {activity} = location.state
  const [entriesErrors, setEntriesErrors] = useState<{ name?: string; lastPaid?: string }[]>([])
  const MAX_MEMBERS = 6
  const maxReached = entries.length >= MAX_MEMBERS
  const navigate = useNavigate()
  const billingref = useRef<HTMLInputElement>(null)
  const lastpaidRef = useRef<HTMLInputElement>(null)
  const entrieslastpaidRef = useRef<HTMLInputElement>(null)

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
        setPrice(current?.price)
        setOrigPrice(current?.price)

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
      billing: "",
      price: ""
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
      setError(prev=> ({...prev, members: "Add at least one family member..."}))
      return
    }
      console.log("Setting up...");

    const {error} = await supabase
    .from("account_setup")
    .update({
      members: entries,
      billing_date: billing,
      price: price,
      price_changedate: origprice !== price ? new Date() : undefined
    })
    .eq("email",user?.email)

    if(error) {console.error("Error in updating members in account_setup table"); return}

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
    if(!price) {
      setError(prev=>({...prev, price: "Required"}))
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
    <div className="set-main">
        {/* <div>Setup Page</div> */}
        {
          (activity === "edit" && (entries.length > 0 || accsetup?.billing_date)) ? (
            <div className="set-edit-con">
              <div className="set-title">
                Edit your Spotify Family Information
              </div>

              <div className="set-form-con">
                <form action={handleSubmit}>
                  <div className="set-input-con">
                      <div className="set-name-div">
                        <label htmlFor="billing">Start of Monthly Billing:</label>
                        <span>
                          {
                          error.billing && (
                            error.billing
                          )
                        }
                        </span>
                      </div>
                      <input ref={billingref} type="date" value={billing} max={new Date().toISOString().split("T")[0]} onChange={(e)=>{
                        setBilling(e.target.value)
                      }} onFocus={()=>billingref.current?.showPicker?.()}/>                  
                    </div>
                    <div className="set-input-con">
                      <div className="set-name-div">
                        <label htmlFor="price">Monthly Billed Price: </label>
                        <span>
                          {
                          error.price  && (
                            error.price
                          )
                        }
                        </span>
                      </div>
                      <div className="set-input-currency">
                        <span className="currency-symbol">₱</span>
                        <input
                          type="number"
                          name="price"
                          min={0}
                          id="price"
                          value={price}
                          onChange={(e) => setPrice(parseInt(e.target.value))}
                        />
                      </div>
                    </div>
                  
                    <div>Enter your Spotify Family plan members below:</div>
                  
                  <div className="set-input-con">
                    <div className="set-name-div">

                      <label htmlFor="name">Name:</label>
                      <span>
                        {error.name && (
                        error.name
                      )}
                      </span>
                      </div>
                      <input type="text" id="name" value={name} onChange={(e)=>{
                        setName(e.target.value)
                      }}/>
                      
                    </div>
                    <div className="set-input-con">
                      <div className="set-name-div">

                      <label htmlFor="lastpaid">Last Paid Date:</label>
                      <span>
                        {error.lastpaid && (
                        error.lastpaid
                      )}
                      </span>
                      </div>
                      <input ref={lastpaidRef} type="date" id="lastpaid" max={new Date().toISOString().split("T")[0]} value={lastpaid} onChange={(e)=>{
                        setLastPaid(e.target.value)
                      }} onFocus={()=>lastpaidRef.current?.showPicker?.()}/>
                  </div>

                  <div className="set-max-btn-div">
                    <button className={entries.length === 6 ? "set-disabled-btn" : "set-btn set-max-btn"} disabled={maxReached} type="button" onClick={addField}>{entries.length >= MAX_MEMBERS ? "Maxed" : "Add"}</button> 
                    <span className="set-submsg">
                      {maxReached && ("Spotify only allows 6 members maximum per family plan!")}
                    </span>
                  </div>
                  <br />

                  <div className="set-entries-div">
                    {
                      entries.map((m,i)=>(
                        <div className="set-input-con entries-card" key={i}>
                          <div className="set-input-con">
                            <div className="set-name-div">
                              <label htmlFor="name">Name:</label>
                              {entriesErrors[i]?.name && <span>{entriesErrors[i].name}</span>}
                            </div>
                            <input type="text" id="name" value={m.name} onChange={(e)=>{
                              const newEntries = [...entries]
                              newEntries[i].name = e.target.value
                              setEntries(newEntries)
                            }}/>
                            
                          </div>
                          <div className="set-input-con">
                            <div className="set-name-div">
                              <label htmlFor="entrieslastpaid">Last Paid Date:</label>
                              <span>
                                {entriesErrors[i]?.lastPaid && <span>{entriesErrors[i].lastPaid}</span>}
                              </span>
                            </div>
                            <input type="date" id="entrieslastpaid" max={new Date().toISOString().split("T")[0]} value={m.lastPaid.toISOString().split("T")[0]} onChange={(e)=>{
                              const newEntries = [...entries]
                              newEntries[i].lastPaid = new Date(e.target.value)
                              setEntries(newEntries)
                            }} 
                            onMouseDown={(e) => {
                              e.preventDefault()
                              e.currentTarget.showPicker?.()
                            }}
                          />
                            
                          </div>                      

                            <button className="set-btn remove-btn" type="button" onClick={()=>(
                              setEntries(prev=>prev.filter((_,index)=>index !== i))
                            )}>Remove</button>
                        </div>
                      ))
                    }
                  </div>
                  <span className="set-err">
                    {error.members && (
                    error.members
                  )}
                  </span>
                  
                  <div>
                    <button className="set-btn" type="submit">Save</button>
                  </div>
                </form>
              </div>   
            </div>
          ) : (
            //ANCHOR - CREATING AND NOT EDITING ===========================
            <div className="set-form-con">
              <div className="set-create-title">Setup your Spotify Family members here...</div>
              <form action={handleSubmit}>
                <div className="set-create-div">
                  <div className="set-input-con">
                    <div className="set-name-div">
                    <label htmlFor="billing">Start of Monthly Billing: </label>
                    <span>
                      {error.billing && (
                        error.billing
                      )}
                    </span>
                    </div>
                    <input ref={billingref} type="date" max={new Date().toISOString().split("T")[0]} value={billing} id="billing" onChange={(e)=>{
                      setBilling(e.target.value)
                    }} onFocus={()=>billingref.current?.showPicker?.()}/>
                    
                  </div>
                  <div className="set-input-con">
                    <div className="set-name-div">
                    <label htmlFor="price">Monthly Billed Price: </label>
                      <span>
                        {error.price && (
                      error.price
                    )}
                      </span>
                    </div>
                    <div className="set-input-currency">
                      <span className="currency-symbol">₱</span>
                      <input
                        type="number"
                        name="price"
                        min={0}
                        id="price"
                        value={price}
                        onChange={(e) => setPrice(parseInt(e.target.value))}
                      />
                    </div>
                    
                  </div>
                  <div className="set-subtitle">Enter your Spotify Family plan members below:</div>
                  <div className="set-input-con">
                    <div className="set-name-div">
                    <label htmlFor="name">Name:</label>
                      <span>
                        {error.name && (
                          error.name
                        )}
                      </span>
                    </div>
                    <input type="text" id="name" value={name} onChange={(e)=>{
                      setName(e.target.value)
                    }}/>
                    
                  </div>
                  <div className="set-input-con">
                    <div className="set-name-div">
                    <label htmlFor="lastpaid">Last Paid Date:</label>
                      <span>
                        {error.lastpaid && (
                        error.lastpaid
                      )}
                      </span>
                    </div>
                    <input ref={lastpaidRef } type="date" id="lastpaid" max={new Date().toISOString().split("T")[0]} value={lastpaid} onChange={(e)=>{
                      setLastPaid(e.target.value)
                    }} onFocus={()=>lastpaidRef.current?.showPicker?.()}/>
                    
                  </div>
                  <div>
                    <button className={entries.length === 6 ? "set-disabled-btn" : "set-btn"} type="button" onClick={addField} disabled={entries.length === 6}>{entries.length === 6 ? "Maxed" :"Add"}</button>
                  </div>
                </div>

                <div className="set-added-con">
                  {
                    entries.map((m,i)=>(
                      <div className="set-added-inner entries-card" key={i}>
                        <ul>
                          <li>Name: {formatName(m.name)}</li>
                          <li> Last Paid: {m.lastPaid.toDateString()}</li>
                          <button className="set-btn remove-btn" type="button" onClick={()=>(
                            setEntries(prev=>prev.filter((_,index)=>index !== i))
                          )}>Remove</button>
                        </ul>
                      </div>
                    ))
                  }
                  <span className="set-err">  
                    {error.members && (
                      error.members
                    )}
                  </span>
                </div>
                <div>
                  <button className="set-btn" type="submit">Setup</button>
                </div>
              </form>
            </div>   
          )
        }
    </div>
  )
}

export default Setup