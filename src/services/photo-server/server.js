const express = require('express')
const cors = require('cors')
const path = require('path')
const app = express()
const port = 3000

// 全局中间件，必须放在所有路由前面
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

// 静态资源托管图片
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// 引入路由
const loginRouter = require('./routes/login')
const photoRouter = require('./routes/middlephoto')
const gameNavRouter = require('./routes/gameNav')
const adminUserRouter = require('./routes/adminUser')
const adminLogRouter = require('./routes/adminLog')
// ✅ 加api前缀，防止路由冲突
app.use('/api', loginRouter)
app.use('/api', photoRouter)
app.use('/api/gameNav', gameNavRouter)
app.use('/api', adminUserRouter)
app.use('/api', adminLogRouter)
// 根路由
app.get('/', (req, res) => {
  res.send('✅ 后端服务启动成功！')
})

app.listen(port, () => {
  console.log(`后端服务启动：http://localhost:${port}`)
})
