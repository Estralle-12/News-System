const {createProxyMiddleware} = require('http-proxy-middleware')

// 反向代理
module.exports = function(app){
    app.use(
        'api',
        createProxyMiddleware({
            target:'http://localhost:5000',
            changeOrigin:true,
        })
    )
}