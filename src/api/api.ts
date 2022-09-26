import io, {Socket} from 'socket.io-client';

export const api = {
    socket: null as null | Socket,

    createConnection() {
        this.socket = io('https://chat-websocket-back.herokuapp.com');
    },
    subscribe(initMessagesHandler: (messages: any, fn: () => void) => void,
              newMessageSentHandler: (message: any) => void,
              userTypingHandler: (user: any) => void
    ) {
        this.socket?.on('init-messages-published', initMessagesHandler)
        this.socket?.on('new-message-sent', newMessageSentHandler)
        this.socket?.on('user-typing', userTypingHandler)
    },
    destroyConnection() {
        this.socket?.disconnect()
        this.socket = null
    },
    sendName(name: string) {
        this.socket?.emit('client-name-sent', name)
    },
    sendMessage(message: string) {
        this.socket?.emit('client-message-sent', message, (error: string | null) => {
            if (error) alert(error)
        })
    },
    typeMessage() {
        this.socket?.emit('client-typed')
    }
}