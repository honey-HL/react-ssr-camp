import React from 'react';
import {Route} from 'react-router-dom'


function Status({code, children}) {
    return <Route render={({staticContext}) => {
        if (staticContext) {
            staticContext.statuscode = code; // 404
        }
        return children
    }}></Route>
}

function Notfound (props) {
    console.log('not found', props)
    // 渲染了这个组件就给staticContext赋值 statuscode = 404
    return <Status code={404}>
        <div>
            <h1>今天也要加油鸭</h1>
            <img id="img-404" src="404.jpg" alt='' />
        </div>
    </Status>
}

export default Notfound;