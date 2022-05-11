import { Stomp } from '@stomp/stompjs'
import type { NextPage } from 'next'
import { FormEvent } from 'react'
import SockJS, { } from "sockjs-client"


const Home: NextPage = () => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.log(typeof event)
  }
  const handleConnect = () => {
    const client = new SockJS("http://localhost:8080/getData")
    const compatClient = Stomp.over(client)
    compatClient.connect({}, (data: any) => {
      console.log({ data })
    })

  }

  const handleDisconnect = (event: any) => {
  }
  return (
    <div style={{
      display: "grid",
      placeContent: "center",
      gap: "1rem"
    }}>
      <h4>Hi there</h4>
      <button onClick={handleConnect}>Connect</button>
      <button onClick={handleDisconnect} >Disconnect</button>
      <form onSubmit={handleSubmit}>
        <input type="text" />
        <button>Send</button>
      </form>
    </div>
  )
}

export default Home
