import React, {useEffect, useRef, useState} from 'react';
import './App.css';
import io from 'socket.io-client'

// const socket = io('http://localhost:3009');
const socket = io('https://chat-websocket-back.herokuapp.com');

function App() {

    const [messages, setMessages] = useState<Array<any>>([])

    const [message, setMessage] = useState('hello')
    const [name, setName] = useState('Denis')
    const [isAutoScrollActive, setIsAutoScrollActive] = useState(true)
    const [lastScrollTop, setLastScrollTop] = useState(0)

    useEffect(() => {
        socket.on('init-messages-published', (messages) => {
            setMessages(messages)
        })

        socket.on('new-message-sent', (message) => {
            setMessages((messages) => [...messages, message])
        })
    }, [])

    useEffect(() => {
        if (isAutoScrollActive) {
            messagesAnchorRef.current?.scrollIntoView({behavior: 'smooth'});
        }
    }, [messages])

    const messagesAnchorRef = useRef<HTMLDivElement>(null)

    return (
        <div className="App">
            <div>
                <div
                    className={'mainBlock'}
                    onScroll={(e) => {
                        let element = e.currentTarget
                        let maxScrollPosition = element.scrollHeight - element.clientHeight

                        if (element.scrollTop > lastScrollTop && Math.abs(maxScrollPosition - element.scrollTop) < 10) {
                            setIsAutoScrollActive(true)
                        } else {
                            setIsAutoScrollActive(false)
                        }
                        setLastScrollTop(element.scrollTop)
                    }}
                >
                    {messages.map(m => {
                        return <div key={m.id}>
                            <b>{m.user.name}: </b> {m.message}
                            <hr/>
                        </div>
                    })}
                    <div ref={messagesAnchorRef}>
                    </div>
                </div>
                <div>
                    <input className={'input'} value={name}
                           onChange={(e) => setName(e.currentTarget.value)}/>
                    <button onClick={() => {
                        socket.emit('client-name-sent', name)
                    }}>send name
                    </button>
                </div>
                <div className={'newMessage'}>
                <textarea
                    className={'textArea'}
                    value={message}
                    onChange={(e) => setMessage(e.currentTarget.value)}>
            </textarea>
                    <button
                        className={'sendButton'}
                        onClick={() => {
                            socket.emit('client-message-sent', message)
                            setMessage('')
                        }}>Send
                    </button>
                </div>
            </div>
        </div>
    );
}

export default App;
