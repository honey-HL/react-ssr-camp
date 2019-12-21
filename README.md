##### react-ssr-camp

##### 启动 npm start

> first homework 
##### 项目入口文件  package.json
    "scripts": { 
        "start": "concurrently \"npm run dev:client\" \"npm run dev:server\" \"npm run dev:start\"", // 三个服务通过一条命令启动
        "dev:client": "webpack --config webpack.client.js --watch", // 客户端配置
        "dev:server": "webpack --config webpack.server.js --watch", // 服务端配置
        "dev:start": "nodemon --watch build --exec node \"./build/bundle.js\""   // 把jsx 、es6变成node的可执行的代码
    },

> fourth homework 
##### 规避Promise.all方法涉及到的报错阻塞（一个接口报错，后续都无法进行，页面崩溃）
##### 方法-：reflect映射
    /*reflect映射*/
    const reflect = p => p.then(v => 
        ({v, status: "fulfilled" }),e => ({e, status: "rejected" })
    );
    Promise.all(promises.map(reflect)).then(res => {
        var success = results.filter(x => x.status === "fulfilled");
        if (success) {}
    })

##### 方法二：Promise.allSettled
##### https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled
    /*Promise.allSettled*/
    const promise1 = Promise.resolve(3);
    const promise2 = new Promise((resolve, reject) => setTimeout(reject, 100, 'foo'));
    const promises = [promise1, promise2];
    Promise.allSettled(promises).
    then((results) => results.forEach((result) => console.log(result.status)));

##### 方法三：包装promise
    /**包装promise*/
    const promise = new Promise((resolve, reject) => {
        loadData(store).then(resolve).catch(resolve)
    })
    promises.push(promise)



> fifth homework 
###### 1.csr实现降级渲染
    if (window.__context) { 
        /*服务端渲染用hydrate  ssr(server side render)*/ 
        ReactDom.hydrate(Page, document.getElementById('root'))
    } else { 
        /*客户端渲染用render csr(client side render)*/ 
        ReactDom.render(Page, document.getElementById('root'))
    }
###### 2.server端实现css组件化渲染 withStyle
###### https://github.com/kriasoft/isomorphic-style-loader/blob/master/src/withStyles.js



