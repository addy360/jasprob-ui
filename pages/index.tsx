/* eslint-disable react-hooks/exhaustive-deps */
import { CompatClient, Stomp } from '@stomp/stompjs'
import type { NextPage } from 'next'
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react'
import SockJS, { } from "sockjs-client"

export interface SysInfo {
  availableProcessor: number;
  freeMemory: number;
  maxMemory: number;
  totalMemory: number;
  time: Date
}


const Home: NextPage = () => {


  const [compatClient, setCompatClient] = useState<CompatClient | undefined>()
  const [messages, setMessages] = useState<string[]>([])
  const [value, setValue] = useState<string>("")
  const [sysInfo, setSysInfo] = useState<SysInfo>()


  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    compatClient?.send("/app/hi", {}, JSON.stringify({ message: value }))
    setValue("")
  }

  const getSystemInfo = () => {
    compatClient?.send("/app/sys")
  }

  const handleConnect = () => {
    const client = new SockJS("http://localhost:8080/getData")
    const c = Stomp.over(client)
    setCompatClient(c)
    c.connect({}, (data: any) => {
      console.log({ data })

      c.subscribe("/message/greetings", (message) => {
        setMessages(smss => [JSON.parse(message.body).message, ...smss])
      })

      c.subscribe("/message/system/info", (message) => {
        setSysInfo(JSON.parse(message.body))
      })

    })

  }

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  const handleDisconnect = (event: any) => {
    if (compatClient) {
      compatClient.disconnect((data: any) => {
        console.log({ data })
      })
    }
  }
  return (
    <div style={{
      display: "grid",
      placeContent: "center"
    }}>
      <div style={{
        display: "flex",
        gap: "1rem"
      }}>
        <div style={{
          display: "grid",
          placeContent: "center",
          gap: "1rem"
        }}>
          <h4>Hi there</h4>
          <button onClick={handleConnect}>Connect</button>
          <button onClick={handleDisconnect} >Disconnect</button>
          <button onClick={getSystemInfo} >Get System info</button>
          <form onSubmit={handleSubmit}>
            <input value={value} onChange={handleOnChange} type="text" />
            <button type='submit' disabled={compatClient == undefined}>Send</button>
          </form>
        </div>
        <div style={{
          padding: "2rem"
        }}>
          <table>
            <thead>
              <tr>
                <th>message</th>
              </tr>
            </thead>
            <tbody>
              {messages?.map((sms, x) => (
                <tr key={x}>
                  <td>
                    {sms}
                  </td>
                </tr>
              ))}

            </tbody>
          </table>

          <div style={{
            marginTop: "1rem"
          }}>
            <p><strong>Available Processors</strong> : {sysInfo?.availableProcessor}</p>
            <p><strong>Total Memory (GB)</strong> : {sysInfo?.totalMemory}</p>
            <p><strong>Max memory (GB)</strong> : {sysInfo?.maxMemory}</p>
            <p><strong>Free memory (GB)</strong> : {sysInfo?.freeMemory}</p>
            <p><><strong>Time</strong> : {sysInfo?.time}</></p>

          </div>
        </div>
      </div>

    </div>

  )
}

export default Home
