import { useNavigate } from "react-router-dom"

function Dashboard() {
  const navigate = useNavigate()
  
  const setupAcc = () => {
    navigate("/setup")
  }
  return (
    <div>
        <div>Dashboard Page</div>
        <div>
          <div>Setup your account</div>
          <button type="button" onClick={setupAcc}>Setup account</button>
        </div>
    </div>
  )
}

export default Dashboard