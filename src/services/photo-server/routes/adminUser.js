const jwt = require('jsonwebtoken')
const SECRET_KEY = 'my-admin-secret-202609'
const express = require('express')
const router = express.Router()
const pool = require('../db')

// 中间件：校验token，并且把解析出来的用户信息挂载到 req.user
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader) return res.json({ code: 401, msg: '未登录' })
  const token = authHeader.split(' ')[1]
  try {
    // 解析token，拿到payload
    const decoded = jwt.verify(token, SECRET_KEY)
    req.user = decoded // ✅ 把用户信息挂载到 req.user
    next()
  } catch (err) {
    return res.json({ code: 401, msg: '登录超时' })
  }
}


// 获取管理员列表（分页，搜索）
router.get('/list', verifyToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const pageSize = parseInt(req.query.pageSize) || 5
    const offset = (page - 1) * pageSize
    const keyword = req.query.keyword || '' // 获取搜索关键词

    let sql = 'SELECT id,username,nickname,role FROM admin_user'
    let countSql = 'SELECT COUNT(*) AS total FROM admin_user'
    const params = []
    const countParams = []

    // 关键词同时匹配账号、昵称
    if(keyword){
      sql += ' WHERE username LIKE ? OR nickname LIKE ?'
      countSql += ' WHERE username LIKE ? OR nickname LIKE ?'
      params.push(`%${keyword}%`, `%${keyword}%`)
      countParams.push(`%${keyword}%`, `%${keyword}%`)
    }
    sql += ' LIMIT ?,?'
    params.push(offset, pageSize)

    const [rows] = await pool.query(sql, params)
    const [countResult] = await pool.query(countSql, countParams)
    const total = countResult[0].total
    res.json({ code: 200, data: rows, total })
  } catch (e) {
    console.log(e)
    res.json({ code: 500, msg: e.message })
  }
})



// 新增管理员
router.post('/add', verifyToken, async (req, res) => {
  const { username, password, role } = req.body
  if (!username || !password) return res.json({ code:400, msg:'账号密码不能为空' })
  try {
    await pool.query('INSERT INTO admin_user (username,password,role) VALUES (?,?,?)',[username,password, role || 'user'])
    res.json({ code:200, msg:'添加成功' })
  }catch(e){
    res.json({ code:500, msg:e.message })
  }
})

// 修改管理员
router.post('/edit', verifyToken, async (req, res) => {
  const { id, username, password, role } = req.body
  if (!id || !username) return res.json({ code:400, msg:'参数不全' })
  try {
    if(password){
      await pool.query('UPDATE admin_user SET username=?, password=?, role=? WHERE id=?',[username,password, role, id])
    }else{
      await pool.query('UPDATE admin_user SET username=?, role=? WHERE id=?',[username, role, id])
    }
    res.json({ code:200, msg:'修改成功' })
  }catch(e){
    res.json({ code:500, msg:e.message })
  }
})

// 删除管理员 ✅ 加上 verifyToken
router.post('/del', verifyToken, async (req, res) => {
  try {
    const { id } = req.body
    const currentUser = req.user;

    const [targetUser] = await pool.query('SELECT * FROM admin_user WHERE id = ?', [id])
    if(targetUser.length === 0){
      return res.json({code:400, msg:'用户不存在'})
    }
    const target = targetUser[0]

    // 禁止删除当前登录账号
    if(target.username === currentUser.username){
      return res.json({code:400, msg:'不能删除当前登录账号！'})
    }
    // 禁止删除超级管理员 role=admin
    if(target.role === 'admin'){
      return res.json({code:400, msg:'超级管理员账号不允许删除！'})
    }

    await pool.query('DELETE FROM admin_user WHERE id = ?', [id])
    return res.json({code:200, msg:'删除成功'})
  } catch (err) {
    console.log(err)
    return res.json({code:500, msg:'服务器错误'})
  }
})
module.exports = router
