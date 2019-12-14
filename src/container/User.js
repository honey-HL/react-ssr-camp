import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import {getUserInfo} from '../store/user'



function User (props) {
    return <div>
        <h1>
            你好{props.userinfo.name},你们最棒的是{props.userinfo.best}
        </h1>
    </div>
}

User.loadData = (store) => {
    return store.dispatch(getUserInfo())
}


export default connect( 
    state => {
        console.log(123, state)
        return {
            userinfo: state.user.userinfo
        }
    }
    // ({userinfo: state.user.userinfo}),
    // {getUserInfo}
)(User);