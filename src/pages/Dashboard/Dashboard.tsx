import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { fetchAccountData, fetchLogs } from "../../contexts/fetchData"
import { formatDate, formatName, formatOrdinal } from "../../contexts/useFormat"
import { useUser } from "../../contexts/useUser"
import { supabase } from "../../client/supabaseClient"

function Dashboard() {
  const navigate = useNavigate()
  const [accsetup,setAccsetup] = useState<any>([])
  const [logs,setLogs] = useState<any[]>([])
  const {user} = useUser()
  
  useEffect(()=>{
    const fetchAccSetup = async () => {
      const accsetupdata = await fetchAccountData()
      const current = accsetupdata?.find(v=>v.email === user?.email)
      setAccsetup(current)
    }
    fetchAccSetup()

    const fetchLogData = async () => {
      const logdata = await fetchLogs()
      const current = logdata?.filter(v=>v.owner_key === user?.email)
      setLogs(current ?? [])
      // console.log(current);
      
    }
    fetchLogData()
  },[])
  
  const deleteLog = async (i:number) => {
    setLogs(prev=>prev.filter((v:any)=>v.id === i))
    const {error} = await supabase
    .from('logs')
    .delete()
    .eq("id",i)

    if(error) console.error("Error in deleting from logs table: " ,error);
    
  }
  const handleNext = () => {
    navigate("/setup",{
      state: {
        activity: "edit"
      }
    })
  }

  const setupAcc = () => {
    navigate("/setup")
  }
  return (
    <div>
        <div>Dashboard Page</div>
        <div>
          {
            accsetup ? (
              <div>
                {
                  <div>
                    <br />
                    <div> Spotify Family Owner: {accsetup.owner} </div>
                    <div>
                      bills ₱{parseFloat(accsetup.price).toFixed(2)} every {formatOrdinal(new Date(accsetup.billing_date).getDate())} of the month                          
                    </div>
                    <div>
                      <button type="button" onClick={handleNext}>{accsetup?.members?.length > 0 ? "Edit": "Add"} Family Information</button>
                    </div>
                    <div> <br />
                    
                    {accsetup.members?.length > 0 && (
                      <div>
                        <br />
                        Family Members:
                        {accsetup.members.map((v: any, ix: number) => (
                          <div key={ix}>
                            <br />
                            <div>Name: {formatName(v.name)}</div>
                            <div>Last Payment: {formatDate(v.lastPaid)}</div>
                            <br />
                          </div>
                        ))}

                        <table>
                          <thead>
                            <tr>
                              <th>Member</th>
                              <th>Amount</th>
                              <th>Payment Date</th>
                              <th>Paid Until</th>
                              <th>Method</th>
                              <th></th>
                            </tr>
                          </thead>

                          <tbody>
                            {
                              logs.length > 0 && 
                              (logs.map((v:any,i:number) => (
                                <tr key={i}>
                                  <td>{formatName(v.member)}</td>
                                  <td>{v.amount}</td>
                                  <td>{formatDate(v.paymentDate)}</td>
                                  <td>{formatDate(v.paid_until)}</td>
                                  <td>{v.method}</td>
                                  <td><button type="button" onClick={()=> deleteLog(v.id)}>Delete</button></td>
                                </tr>
                              )))
                            }
                          </tbody>
                        </table>
                        
                      </div>
                    )}
                    </div>                      
                  </div>
                }
              </div>
            ) : (
              <div>
                  <div>Setup your account</div>
                  <button type="button" onClick={setupAcc}>Setup account</button>
              </div>
            )
          }
          
        </div>
    </div>
  )
}

export default Dashboard