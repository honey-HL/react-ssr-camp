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
import path from 'path'
import fs from 'fs'




const store = getServerStore()
const app = express();
app.use(express.static('public'))




// 客户端来的api开头的请求
app.use(
    '/api',
    proxy({ target: 'http://localhost:9090', changeOrigin: true })
);




// csr渲染函数
function csrRender(res) {
    // 读取文件 返回
    const filename = path.resolve(process.cwd(), 'public/index.csr.html')
    const html = fs.readFileSync(filename, 'utf-8')
    return res.send(html)
}

app.get('*', (req, res) => {
    /*  我们可以：1、配置开关  开启CSR   2、服务器负载过高 开启CSR  **/
    if (req.query.mode == 'csr') {
        console.log('url参数开启CSR降级')
        return csrRender(res)
    }

    // inside a request
    const promises = [];
    routes.some(route => {
        const match = matchPath(req.path, route)
        if (match) {
             // 获取根据路由渲染出来的组件  并且拿到loadData方法  获取数据
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

    /*
    Promise.all等待所有网络请求结束后在渲染
    */
    Promise.all(promises).then(results => {
        // babel把jsx解析成虚拟dom   renderToString把react组建解析成html
        // var success = results.filter(x => x.status === "fulfilled");
        // if (success) {
            const context = {
                css: []
            }
            const content = renderToString(
                <Provider store={store}>
                    <StaticRouter location={req.url} context={context}>
                        {/* {App} */}
                        <Header></Header>
                        <Switch>
                            {routes.map(route => <Route key={route.key} {...route}></Route>)}
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

            const css = context.css.join('\n')
            // 字符串模板
            res.send(`
                <html>
                    <head>  
                        <meta charset="utf-8"/>
                        <title>react ssr</title>
                        <style>
                            ${css}
                        </style>
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