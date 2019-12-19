// 这里的node代码会用babel处理
import React from "react";
import { renderToString } from "react-dom/server";
import express from "express";
import routes from '../src/App';
import {StaticRouter, matchPath, Route, Switch} from 'react-router-dom';
import {Provider} from 'react-redux'
import {getServerStore} from '../src/store/store'
import Header from '../src/component/Header'
import proxy from 'http-proxy-middleware';

const store = getServerStore()
const app = express();
app.use(express.static('public'))

// 客户端来的api开头的请求
app.use(
    '/api',
    proxy({ target: 'http://localhost:9090', changeOrigin: true })
  );
app.get('*', (req, res) => {
    // 获取根据路由渲染出来的组件  并且拿到loadData方法  获取数据

    // if (req.url.startsWith('/api/')) {
    //     // 不渲染页面使用axios转发
    // }

    // inside a request
    const promises = [];
    routes.some(route => {
        const match = matchPath(req.path, route)
        if (match) {
            const {loadData} = route.component
            if (loadData) {
                 // 包装promise 规避报错 然后push包装后的promise
                // const promise = new Promise((resolve, reject) => {
                //     loadData(store).then(resolve).catch(resolve)
                // })
                // promises.push(promise)
                promises.push(loadData(store))
            }
        }
    })


    // const Page = <App title="开课吧"></App>


    /***
     * 规避Promise.all方法涉及到的报错阻塞（一个接口报错，后续都无法进行，页面崩溃）
     * 方法-：reflect映射
     * 方法二：Promise.allSettled
     * https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled
     * 方法二：包装promise
     * ***/ 

    /*reflect映射*/
    // const reflect = p => p.then(v => 
    //     ({v, status: "fulfilled" }),e => ({e, status: "rejected" })
    // );
    // Promise.all(promises.map(reflect)).then(res => {
    //     var success = results.filter(x => x.status === "fulfilled");
    //     if (success) {}
    // })

    /*Promise.allSettled*/
    // const promise1 = Promise.resolve(3);
    // const promise2 = new Promise((resolve, reject) => setTimeout(reject, 100, 'foo'));
    // const promises = [promise1, promise2];
    // Promise.allSettled(promises).
    // then((results) => results.forEach((result) => console.log(result.status)));

    /**包装promise*/
    // const promise = new Promise((resolve, reject) => {
    //     loadData(store).then(resolve).catch(resolve)
    // })
    // promises.push(promise)


    /*
    Promise.all等待所有网络请求结束后在渲染
    */
    Promise.all(promises).then(results => {
        // babel把jsx解析成虚拟dom   renderToString把react组建解析成html
        // var success = results.filter(x => x.status === "fulfilled");
        // if (success) {
            const context = {}
            const content = renderToString(
                <Provider store={store}>
                    <StaticRouter location={req.url} context={context}>
                        {/* {App} */}
                        <Header></Header>
                        <Switch>
                            {routes.map(route => <Route {...route}></Route>)}
                        </Switch>
                    </StaticRouter>
                </Provider>
            )

            console.log('context =>',context)
            if (context.statuscode) {
                // 状态的跳转和页面的切换
                res.status(context.statuscode)
            }
            if (context.action == "REPLACE") {
                res.redirect(301, context.url)
            }

            // 字符串模板
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

        // } else {
        //     res.send('数据不见了')
        // }
         
    })
    .catch(error => {
        res.send('报错啦')
    })

   
})

app.listen(9093, ()=> {
    console.log('server.js 9093监听完毕');
})