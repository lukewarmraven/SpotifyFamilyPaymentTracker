import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { fetchAccountData } from "../../contexts/fetchData"
import { formatDate, formatName } from "../../contexts/useFormat"
import { useUser } from "../../contexts/useUser"

function Dashboard() {
  const navigate = useNavigate()
  const [accsetup,setAccsetup] = useState<any>([])
  const {user} = useUser()
  
  useEffect(()=>{
    const fetchAccSetup = async () => {
      const accsetupdata = await fetchAccountData()
      const current = accsetupdata?.find(v=>v.email === user?.email)
      setAccsetup(current)
    }
    fetchAccSetup()
  },[])
  
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
                      <div> <br />
                      
                      {accsetup.members?.length > 0 && (
                        <div>
                          Family Members:
                          {accsetup.members.map((v: any, ix: number) => (
                            <div key={ix}>
                              <div>Name: {formatName(v.name)}</div>
                              <div>Last Payment: {formatDate(v.lastPaid)}</div>
                              <br />
                            </div>
                          ))}
                        </div>
                      )}
                      </div>                      
                    </div>
                  
                }
                <div>
                  <button type="button" onClick={handleNext}>{accsetup?.members?.length > 0 ? "Edit": "Add"} Members</button>
                </div>
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