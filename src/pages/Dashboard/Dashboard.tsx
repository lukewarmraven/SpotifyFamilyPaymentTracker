import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { fetchAccountData } from "../../contexts/fetchData"
import { formatDate, formatName } from "../../contexts/useFormat"

function Dashboard() {
  const navigate = useNavigate()
  const [accsetup,setAccsetup] = useState<any>([])
  
  useEffect(()=>{
    const fetchAccSetup = async () => {
      const accsetupdata = await fetchAccountData()
      setAccsetup(accsetupdata)
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
                  accsetup.map((m: any,index: number) => (
                    <div key={index}>
                      <br />
                      <div> Spotify Family Owner: {m.owner} </div>
                      <div> <br />
                        Family Members:
                        <div> {m.members.map((v:any,ix:number) => (
                          <div key={ix}>
                            <div>Name: {formatName(v.name)}</div>
                            <div>Last Payment: {formatDate(v.lastPaid)}</div> <br />
                          </div>
                        ))} </div> <br />
                      </div>                      
                    </div>
                  ))
                }
                <div>
                  <button type="button" onClick={handleNext}>Edit Members</button>
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