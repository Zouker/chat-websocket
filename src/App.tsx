import React, {useEffect, useState} from 'react';
import './App.css';
import io from 'socket.io-client'

// const socket = io('http://localhost:3009');
const socket = io('https://chat-websocket-back.herokuapp.com');

function App() {

    const [messages, setMessages] = useState<Array<any>>([])

    const [message, setMessage] = useState('hello')

    useEffect(() => {
        socket.on('init-messages-published', (messages) => {
            setMessages(messages)
        })

        socket.on('new-message-sent', (message) => {
            setMessages((messages) => [...messages, message])
        })
    }, [])

    return (
        <div className="App">
            <div>
                <div style={{
                    border: '1px solid black',
                    padding: '10px',
                    height: '300px',
                    width: '300px',
                    overflowY: 'scroll'
                }}>
                    {messages.map(m => {
                        return <div key={m.id}>
                            <b>{m.user.name}: </b> {m.message}
                            <hr/>
                        </div>
                    })}
                </div>
                <textarea value={message}
                          onChange={(e) => setMessage(e.currentTarget.value)}>
            </textarea>
                <button onClick={() => {
                    socket.emit('client-message-sent', message)
                    setMessage('')
                }}>Send
                </button>
            </div>
        </div>
    );
}

export default App;
