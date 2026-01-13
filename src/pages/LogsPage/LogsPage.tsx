import { useEffect, useRef, useState } from "react"
import { fetchAccountData } from "../../contexts/fetchData"
import { useUser } from "../../contexts/useUser"
import { formatName } from "../../contexts/useFormat"
import { supabase } from "../../client/supabaseClient"
import { useNavigate } from "react-router-dom"
import "./LogsPage.css"

function Logs() {
    const [accsetup,setAccsetup] = useState<any>([])
    const [members,setMembers] = useState<any>([])
    const {user} = useUser()
    const [mem,setMem] = useState("")
    const [paymentDate,setPaymentdate] = useState("")
    const [paidUntil,setPaidUntil] = useState("")
    const [method,setMethod] = useState("")
    const [error,setError] = useState({
        mem:"",
        paymentDate:"",
        paidUntil:"",
        method:"",
        other:""
    })
    const navigate = useNavigate()
    const paymentDateRef = useRef<HTMLInputElement>(null)
    const paidUntilRef = useRef<HTMLInputElement>(null)

    useEffect(()=>{
        document.title = "Logs"

        const fetchAccSetup = async () => {
            const accsetupdata = await fetchAccountData()
            const current  = accsetupdata?.find(v=>v.email === user?.email) 
            // console.log(current);
            
            setAccsetup(current) 
            if (current.members !== null) setMembers(current.members.map((v:any)=>v.name))
        }
        fetchAccSetup()
      },[])

      const validation = () => {
        const newError = {
            mem:"",
            paymentDate:"",
            paidUntil:"",
            method:"",
            other:""
        }
        if(!mem) newError.mem = "Required"
        if(!method) newError.method = "Required"
        if(!paymentDate) newError.paymentDate = "Required"
        if(!paidUntil) newError.paidUntil = "Required"

        setError(newError)
        if (newError.mem || newError.paidUntil || newError.paymentDate || newError.method) return false

        return true
      }

    const handleSubmit = async () => {
        if (!validation()) return

        const {error} = await supabase
        .from("logs")
        .insert({
            member: mem,
            paymentDate: paymentDate,
            paid_until: paidUntil,
            method: method,
            owner_key: user?.email,
            amount: Math.round(accsetup?.price / accsetup?.members.length)
        })
        if(error) {
            setError(prev=>({...prev,
                other: "Try again!"
            }))
            console.error("Error in inserting to logs table: ", error);
            return 
        }
        
        navigate("/dashboard")
    }

    return (
        <div className="logs-main">
            <div className="logs-title">Log your Spotify Family Plan Payments here...</div>
            <div className="logs-form-con">
                <form action={handleSubmit}>
                    <div className="logs-input-con">
                        <div className="logs-name-div">
                            <label htmlFor="member">Member: </label>
                            <span className="logs-err">
                                {error.mem && (error.mem)}
                            </span>
                        </div>
                        <select value={mem} name="member" id="member" onChange={(e)=>(
                            setMem(e.target.value)
                        )}>
                            <option value="" hidden>Select here...</option>
                            {
                                members.map((v:any,i:number) => (
                                    <optgroup key={i}>
                                        <option value={formatName(v)} >{formatName(v)}</option>
                                    </optgroup>
                                ))
                            }
                        </select>
                        
                    </div>

                    <div className="logs-input-con">
                        <div className="logs-name-div">
                            <label htmlFor="paymentDate">Payment Date: </label>
                            <span className="logs-err">
                                {error.paymentDate && (error.paymentDate)}
                            </span>
                        </div>
                        <input ref={paymentDateRef} value={paymentDate} onChange={(e)=> (
                            setPaymentdate(e.target.value)
                        )} onFocus={()=>paymentDateRef.current?.showPicker?.()} type="date" name="paymentDate" id="paymentDate" max={new Date().toISOString().split("T")[0]}/>
                    </div>
                    <div className="logs-input-con">
                        <div className="logs-name-div">
                            <label htmlFor="paiduntil">Paid Until: </label>
                            <span className="logs-err">
                                {error.paidUntil && (error.paidUntil)}
                            </span>
                        </div>
                        <input ref={paidUntilRef} value={paidUntil} onChange={(e)=> (
                            setPaidUntil(e.target.value)
                        )} onFocus={()=>paidUntilRef.current?.showPicker?.()} type="date" name="paiduntil" id="paiduntil" min={new Date().toISOString().split("T")[0]}/>
                    </div>
                    <div className="logs-input-con">
                        <div className="logs-name-div">
                            <label htmlFor="method">Method: </label>
                            <span className="logs-err">
                                {error.method && (error.method)}
                            </span>
                        </div>
                        <select value={method} name="method" id="method" onChange={(e)=>(
                            setMethod(e.target.value)
                        )}>
                            <option value="" hidden>Select here...</option>
                            <option value="GCash" >GCash</option>
                            <option value="Cash" >Cash</option>
                        </select>
                    </div>

                    <div>
                        <button className="logs-btn" type="submit">Log!</button>
                    </div>
                    {error.other && (
                        error.other
                    )}
                </form>
            </div>
        </div>
    )
}

export default Logs