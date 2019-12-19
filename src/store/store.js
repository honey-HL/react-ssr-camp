// 存储的入口
import {createStore, applyMiddleware, combineReducers} from 'redux';
import thunk from 'redux-thunk';
import indexReducer from './index';
import userReducer from './user'
import axios from 'axios'




const reducer = combineReducers({
    user: userReducer,
    index: indexReducer
})

const serverAxios = axios.create({
    baseURL: 'http://localhost:9090'
})
const clientAxios = axios.create({
    baseURL:'/'
})



// 创建store
// const store = createStore(reducer, applyMiddleware(thunk))


// export default store;

// 服务端的store
export const getServerStore = () => {
    return createStore(reducer, applyMiddleware(thunk.withExtraArgument(serverAxios)))
}


// 客户端的store
export const getClientStore = () => {
    // 通过window.__context获取数据
    const defaultState = window.__context ? window.__context: {}
    return createStore(reducer, defaultState, applyMiddleware(thunk.withExtraArgument(clientAxios)))
}