import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import {getUserInfo} from '../store/user'
import {Redirect} from 'react-router-dom' 


function User (props) {

    //  useEffect(() => {
    //     // 异步数据 首页显示
    //     console.log('user props', props) // props的userinfo来源于store
    //     let keys = Object.keys(props.userinfo);
    //      // 如果props里面没有userinfo，就从客户端发起请求去获取数据
    //     if (!keys.length) {
    //         props.getUserInfo()
    //     }
    // }, [])


    // 比如没登录 需要跳转到登录页 页面上只要有Redirect就会走到 server的res.redirect(301, context.url)中去
    return <Redirect to="/login"></Redirect>
    // return <div>
    //     <h1>
    //         你好{props.userinfo.name},你们最棒的是{props.userinfo.best}
    //     </h1>
    // </div>
}




// loadData挂载为了方便服务端随时调用 获取数据
User.loadData = (store) => {
    return store.dispatch(getUserInfo())
}


export default connect( 
    state => {
        console.log(123, state)
        return {
            userinfo: state.user.userinfo
        }
    },
    // ({userinfo: state.user.userinfo}),
    {getUserInfo}
)(User);