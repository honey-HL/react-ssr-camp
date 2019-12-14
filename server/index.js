// 这里的node代码会用babel处理
import React from "react";
import { renderToString } from "react-dom/server";
import express from "express";
import routes from '../src/App';
import {StaticRouter, matchPath, Route} from 'react-router-dom';
import {Provider} from 'react-redux'
import {getServerStore} from '../src/store/store'
import Header from '../src/component/Header'

const store = getServerStore()
const app = express();
app.use(express.static('public'))


app.get('*', (req, res) => {
    // 获取根据路由渲染出来的组件  并且拿到loadData方法  获取数据

    // inside a request
    const promises = [];
    routes.some(route => {
        const match = matchPath(req.path, route)
        if (match) {
            const {loadData} = route.component
            if (loadData) {
                promises.push(loadData(store))
            }
        }
    })
    // use `some` to imitate `<Switch>` behavior of selecting only
    // the first to match
    // routes.some(route => {
    //     // use `matchPath` here
    //     const match = matchPath(req.path, route);
    //     if (match) promises.push(route.loadData(match));
    //     return match;
    // });

    // const Page = <App title="开课吧"></App>

    const reflect = p => p.then(v => 
        ({v, status: "fulfilled" }),e => ({e, status: "rejected" })
    );

    // 等待所有网络请求结束后在渲染
    // Promise.all(promises).map(p => p.catch(e => e))
    // .then (res => {
        
    // })
    // .catch(e => {
    //     res.send('此处暂无数据')
    // })
    // .finally(() => {
    //     res.send('正在加载')
    // })
    Promise.all(promises.map(reflect)).then(results => {
        // babel把jsx解析成虚拟dom   renderToString把react组建解析成html
        var success = results.filter(x => x.status === "fulfilled");
        if (success) {
            const content = renderToString(
                <Provider store={store}>
                    <StaticRouter location={req.url}>
                        {/* {App} */}
                        <Header></Header>
                        {routes.map(route => <Route {...route}></Route>)}
                    </StaticRouter>
                </Provider>
            )
            res.send(`
                <html>
                    <head>  
                        <meta charset="utf-8"/>
                        <title>react ssr</title>
                    </head>
                    <body>
                        <div id="root">${content}</div>
                        <script>
                            window.__context = ${JSON.stringify(store.getState())}
                        </script>
                        <script src="/bundle.js"></script>
                    </body>
                </html>
            `)
        } else {
            res.send('数据不见了')
        }
         
    })
    .catch(error => {
        res.send('报错啦')
    })

   
})

app.listen(9093, ()=> {
    console.log('监听完毕');
})