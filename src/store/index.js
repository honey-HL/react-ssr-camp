// 首页de逻辑
// import axios from 'axios'
// import request from './request'



// actionType
const GET_LIST = 'INDEX/GET_LIST';



// actionCreator
const changeList = list => ({
    type: GET_LIST,
    list
})



export const getIndexList = server => {
    return (dispatch, getState, $axios) => {// http://localhost:9090
        return  $axios.get("/api/course/list")
        .then(res => {
            const {list} = res.data;
            console.log('24 list=>',list)
            dispatch(changeList(list))
        })
    }
}


const defaultState = {
    list: []
}
export default (state = defaultState, action) => {
    switch(action.type){
        case GET_LIST:
            const newState = {
                ...state,
                list: action.list
            }
            return newState
        default:
            return state
    }
}