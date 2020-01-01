const express = require('express')
const app = express()
const axios = require('axios')
const puppeteer = require('puppeteer')




app.get('*', async function(req, res){
    console.log(req.url)
    // 遍历所有路由 都写成html 或者都缓存上
    // 1.加缓存 2.lru缓存算法
    if (urlCache[url]) {
        return res.send(urlCache[url])
    }
    if (req.url == '/favicon.ico') {
        // 对seo没有影响
        return res.send({code:0})
    }
    const url = 'http://localhost:9093' + req.url;
    const browser = await puppeteer.launch();
    const page = await browser.newPage()
    await page.goto(url, {
        waitUntil: ['networkidle0']
    })
    const html = await page.content()
    console.log(html)
    // res.send({code: 1})
    urlCache[url] = html;
    res.send(html)
})

app.listen(8081, () => {
    console.log('ssr server start')
})