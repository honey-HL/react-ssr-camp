import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import {getIndexList} from '../store/index'
import styles from './Index.css'
import withStyle from '../withStyle.js'

// console.log(styles._getCss())

function Index (props) { 

    /*styles._getCss()中_getCss()是服务端获取css的方法*/
    // if (props.staticContext) {
    //     props.staticContext.css.push(styles._getCss())
    // }

    // console.log('props==>',props)
    const [count, setCount] = useState(1)
    console.log('index props', props)

    /*
    useEffect的作用：
    为了解决项目启动加载的第一个页面是about，然后跳到首页index时
    尽管首页用了服务端渲染并且查看网页源代码也能看到此数据
    但是页面上依然看不到数据的情况
    */
    useEffect(() => {
        // 异步数据 首页显示
         // 如果props里面没有list，就从客户端发起请求去获取数据
        if (!props.list.length) {
            props.getIndexList()
        }
    }, [])
    return <div className={styles.container}>
        <h1 className={styles.title}>哈罗 {props.title} ! {count}</h1>
        <button onClick={() => setCount(count + 1)}>累加</button>
        <hr></hr>
        <ul>
            {props.list.map(item => {
                return <li key={item.id}>{item.title}</li>
            })}
        </ul>
    </div>
}

Index.loadData = (store) => {
    return store.dispatch(getIndexList())
}


export default connect( 
    state => ({list: state.index.list}),
    {getIndexList}
)(withStyle(Index, styles));
// withStyle(Index, styles)



// let NewIndex = connect( 
//     state => ({list: state.index.list}),
//     {getIndexList}
// )(withStyle(Index, styles));
// NewIndex.loadData = (store) => {
//     return store.dispatch(getIndexList())
// }
// export default NewIndex