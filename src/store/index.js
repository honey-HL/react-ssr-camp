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
    let postData = {
        category: "frontend",
        order: "heat",
        offset: 0,
        limit: 30
    }
    return (dispatch, getState, $axios) => {// http://localhost:9090
        return  $axios.post("/api/resources/gold", postData)
        .then(res => {
            console.log('res', res)
            const {data} = res.data;
            console.log('24 list=>',data)
            dispatch(changeList(data))
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