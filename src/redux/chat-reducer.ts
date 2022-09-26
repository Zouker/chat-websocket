import {AppThunk} from './store';
import {api, MessageType, UserType} from '../api/api';

const initialState = {
    messages: [] as MessageType[],
    typingUsers: [] as UserType[]
}

export const chatReducer = (state: InitialStateType = initialState, action: ActionType) => {
    switch (action.type) {
        case 'messages-received': {
            return {...state, messages: action.messages}
        }
        case 'new-message-received': {
            return {
                ...state,
                messages: [...state.messages, action.message],
                typingUsers: state.typingUsers.filter(u => u.id !== action.message.user.id)
            }
        }
        case 'typing-user-added': {
            return {
                ...state,
                typingUsers: [...state.typingUsers.filter(u => u.id !== action.user.id), action.user]
            }
        }
        default:
            return state
    }
}

const messagesReceived = (messages: MessageType[]) => ({
    type: 'messages-received',
    messages
} as const)

const newMessageReceived = (message: MessageType) => ({
    type: 'new-message-received',
    message
} as const)

const typingUserAdded = (user: UserType) => ({
    type: 'typing-user-added',
    user
} as const)

export const createConnection = (): AppThunk => (dispatch) => {
    api.createConnection()
    api.subscribe((messages: MessageType[], fn: (data: string) => void) => {
        dispatch(messagesReceived(messages))
        fn('data from front')
    }, (message: MessageType) => {
        dispatch(newMessageReceived(message))
    }, (user: UserType) => {
        dispatch(typingUserAdded(user))
    })

}

export const setClientName = (name: string): AppThunk => () => {
    api.sendName(name)
}

export const sendMessage = (message: string): AppThunk => () => {
    api.sendMessage(message)
}

export const typeMessage = (): AppThunk => () => {
    api.typeMessage()
}

export const destroyConnection = (): AppThunk => () => {
    api.destroyConnection()
}

// types
type InitialStateType = typeof initialState

type ActionType =
    ReturnType<typeof messagesReceived>
    | ReturnType<typeof newMessageReceived>
    | ReturnType<typeof typingUserAdded>
