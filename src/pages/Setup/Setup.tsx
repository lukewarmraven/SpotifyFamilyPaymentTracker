import { useState } from "react";

function Setup() {
  const [name,setName] = useState("") 
  const [lastpaid,setLastPaid] = useState(new Date())

  const handleSubmit = async () => {
    console.log("Setting up...");
  }

  return (
    <div>
        <div>Setup Page</div>
        <div>
          <div>Enter your Spotify Family plan members below:</div>
          <form action={handleSubmit}>
            <div>
              <label htmlFor="name">Name:</label>
              <input type="text" id="name" value={name} onChange={(e)=>{
                setName(e.target.value)
              }}/>
            </div>
            {/* <div>
              <label htmlFor="lastpaid">Last Paid Date:</label>
              <input type="date" id="lastpaid" value={lastpaid} onChange={(e)=>{
                setLastPaid(new Date(e.target.value))
              }}/>
            </div> */}

            <button type="submit">Setup</button>
          </form>
        </div>
    </div>
  )
}

export default Setup