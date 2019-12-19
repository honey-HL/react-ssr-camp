// 首页de逻辑
import axios from 'axios'



// actionType
const GET_LIST = 'INDEX/USER_INFO';



// actionCreator
const changeUserInfo = data => ({
    type: GET_LIST,
    data
})



export const getUserInfo = server => {
    return (dispatch, getState, $axios) => {
        return $axios.get("/api/user/info")
        .then(res => {
            const {data} = res.data;
            dispatch(changeUserInfo(data))
        })
    }
}


const defaultState = {
    userinfo: {}
}
export default (state = defaultState, action) => {
    switch(action.type){
        case GET_LIST:
            console.log(action.type, state)
            const newState = {
                ...state,
                userinfo: action.data
            }
            return newState
        default:
            return state
    }
}