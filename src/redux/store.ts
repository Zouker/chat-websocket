import {
    AnyAction,
    applyMiddleware,
    combineReducers,
    legacy_createStore as createStore
} from 'redux'
import thunk, {ThunkAction, ThunkDispatch} from 'redux-thunk'
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import {chatReducer} from './chat-reducer';

const rootReducer = combineReducers({
    chat: chatReducer
})

export const store = createStore(rootReducer, applyMiddleware(thunk))

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, AnyAction>

export type AppRootStateType = ReturnType<typeof rootReducer>
export type AppDispatch = ThunkDispatch<AppRootStateType, unknown, AnyAction>