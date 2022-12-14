import React, {useEffect, useRef, useState} from 'react';
import styles from './App.module.css';
import {useAppDispatch, useAppSelector} from './redux/store';
import {
    createConnection,
    destroyConnection,
    sendMessage,
    setClientName,
    typeMessage
} from './redux/chat-reducer';

function App() {
    const messages = useAppSelector(state => state.chat.messages)
    const typingUsers = useAppSelector(state => state.chat.typingUsers)
    const dispatch = useAppDispatch()

    const [message, setMessage] = useState('hello')
    const [name, setName] = useState('Denis')
    const [isAutoScrollActive, setIsAutoScrollActive] = useState(true)
    const [lastScrollTop, setLastScrollTop] = useState(0)

    useEffect(() => {
        dispatch(createConnection())
        return () => {
            dispatch(destroyConnection())
        }
    }, [])

    useEffect(() => {
        if (isAutoScrollActive) {
            messagesAnchorRef.current?.scrollIntoView({behavior: 'smooth'});
        }
    }, [messages])

    const messagesAnchorRef = useRef<HTMLDivElement>(null)

    return (
        <div className={styles.App}>
            <div>
                <div
                    className={styles.mainBlock}
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
                    {typingUsers.map(tu => {
                        return <div key={tu.id}>
                            <b>{tu.name}: </b> ...
                        </div>
                    })}
                    <div ref={messagesAnchorRef}>
                    </div>
                </div>
                <div className={styles.nameBlock}>
                    <input className={styles.enterName} value={name}
                           onChange={(e) => setName(e.currentTarget.value)}/>
                    <button
                        className={styles.sendButton}
                        onClick={() => {
                        dispatch(setClientName(name))
                    }}>send name
                    </button>
                </div>
                <div className={styles.newMessageBlock}>
                <textarea
                    className={styles.enterMessage}
                    value={message}
                    onChange={(e) => setMessage(e.currentTarget.value)}>
            </textarea>
                    <button
                        className={styles.sendButton}
                        onKeyUp={() => {
                            dispatch(typeMessage())
                        }}
                        onClick={() => {
                            dispatch(sendMessage(message))
                            setMessage('')
                        }}>Send
                    </button>
                </div>
            </div>
        </div>
    );
}

export default App;
