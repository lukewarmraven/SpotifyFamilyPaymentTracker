import { useEffect, useState } from "react"
import { fetchAccountData } from "../../contexts/fetchData"
import { useUser } from "../../contexts/useUser"
import { formatName } from "../../contexts/useFormat"
import { supabase } from "../../client/supabaseClient"
import { useNavigate } from "react-router-dom"

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
        <div>
            <div>Log your Spotify Family Plan Payments here...</div>
            <div>
                <form action={handleSubmit}>
                    <div>
                        <label htmlFor="member">Member: </label>
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
                        {error.mem && (error.mem)}
                    </div>

                    <div>
                        <label htmlFor="paymentDate">Payment Date: </label>
                        <input value={paymentDate} onChange={(e)=> (
                            setPaymentdate(e.target.value)
                        )} type="date" name="paymentDate" id="paymentDate" max={new Date().toISOString().split("T")[0]}/>
                        {error.paymentDate && (error.paymentDate)}
                    </div>
                    <div>
                        <label htmlFor="paiduntil">Paid Until: </label>
                        <input value={paidUntil} onChange={(e)=> (
                            setPaidUntil(e.target.value)
                        )} type="date" name="paiduntil" id="paiduntil" min={new Date().toISOString().split("T")[0]}/>
                        {error.paidUntil && (error.paidUntil)}
                    </div>
                    <div>
                        <label htmlFor="method">Method: </label>
                        <select value={method} name="method" id="method" onChange={(e)=>(
                            setMethod(e.target.value)
                        )}>
                            <option value="" hidden>Select here...</option>
                            <option value="GCash" >GCash</option>
                            <option value="Cash" >Cash</option>
                            
                        </select>
                        {error.method && (error.method)}
                    </div>

                    <div>
                        <button type="submit">Log!</button>
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