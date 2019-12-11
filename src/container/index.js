import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import {getIndexList} from '../store/index'



function Index (props) {
    console.log('props==>',props)
    const [count, setCount] = useState(1)
    useEffect(() => {
        // 异步数据 首页显示
        props.getIndexList()
    }, [])
    return <div>
        <h1>哈罗 {props.title} ! {count}</h1>
        <button onClick={() => setCount(count + 1)}>累加</button>
        <hr></hr>
        <ul>
            {props.list.map(item => {
                return <li key={item.id}>{item.name}</li>
            })}
        </ul>
    </div>
}

export default connect( 
    state => ({list: state.index.list}),
    {getIndexList}
)(Index);