import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { fetchAccountData, fetchLogs } from "../../contexts/fetchData"
import { formatDate, formatName, formatOrdinal } from "../../contexts/useFormat"
import { useUser } from "../../contexts/useUser"
import { supabase } from "../../client/supabaseClient"
import { getMonthDiff } from "../../contexts/getFunction"
import "./Dashboard.css"

function Dashboard() {
  const navigate = useNavigate()
  const [accsetup,setAccsetup] = useState<any>([])
  const [logs,setLogs] = useState<any[]>([])
  const {user} = useUser()
  
  useEffect(()=>{
    const fetchAccSetup = async () => {
      const accsetupdata = await fetchAccountData()
      const current = accsetupdata?.find(v=>v.email === user?.email)
      // console.log(current);
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
    
    setLogs(prev=>prev.filter((v:any)=>v.id !== i))
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
    <div className="dash-main">
        <div className="dash-title">Dashboard Page</div>
        <div>
          {
            accsetup ? (
              <div>
                {
                  <div>
                    <div className="dash-heading-msg">
                      <div className="dash-heading-title">
                        <span className="dash-owner-name">
                          {accsetup.owner}
                        </span>
                       's Spotify Family </div>
                      <div className="dash-heading-submsg">
                        bills <b>₱{parseFloat(accsetup.price).toFixed(2)}</b> every {formatOrdinal(new Date(accsetup.billing_date).getDate())} of the month {accsetup?.members?.length > 0 && (
                          <span>
                            (₱{Math.round(accsetup.price / accsetup?.members?.length)} per member as of {formatDate(new Date(accsetup.price_changedate))})
                          </span>
                          )}  
                        <div>Note: Price per member is rounded up.</div>                       
                      </div>
                    </div>
                    <div> <br />
                    
                    {accsetup.members?.length > 0 && (
                      <div className="inner-dash-con">
                        <div className="inner-dash-title">
                          Family Members
                        </div>
                        <div className="members-con">  
                          {accsetup.members.map((v: any, ix: number) => (
                            <div className="family-members-con" key={ix}>
                              <div>Name: {formatName(v.name)}</div>
                              <div>Last Payment: {formatDate(v.lastPaid)}</div>
                            </div>
                          ))}
                        </div>

                        <div>
                          <button className="general-btn edit-family-btn" type="button" onClick={handleNext}>{accsetup?.members?.length > 0 ? "Edit": "Add"} Family Information</button>
                        </div>

                        <table className="dash-table">
                          <thead>
                            <tr>
                              <th>Member</th>
                              <th>Amount</th>
                              <th>Payment Date</th>
                              <th>Paid Until</th>
                              <th>Months Paid</th>
                              <th>Method</th>
                              <th className="empty-th"></th>
                            </tr>
                          </thead>

                          <tbody>
                            {logs.length > 0 ? (
                              logs.map((v: any) => (
                                <tr key={v.id}>
                                  <td>{formatName(v.member)}</td>
                                  <td>{v.amount}</td>
                                  <td>{formatDate(v.paymentDate)}</td>
                                  <td>{formatDate(v.paid_until)}</td>
                                  <td>{getMonthDiff(new Date(v.paymentDate),new Date(v.paid_until))}</td>
                                  <td>{v.method}</td>
                                  <td>
                                    <button className="general-btn" type="button" onClick={() => deleteLog(v.id)}>Delete</button>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={6} style={{ textAlign: "center" }}>No logs fetched! Add a new one in the logs tab!</td>
                              </tr>
                            )}
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