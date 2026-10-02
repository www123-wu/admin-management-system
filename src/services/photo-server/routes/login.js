const express = require('express')
const router = express.Router()
const pool = require('../db')
const jwt = require('jsonwebtoken')
// 密钥，自己随便改，项目里不要泄露
const SECRET_KEY = 'my-admin-secret-202609'

// 登录接口
// 登录接口
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body
        if (!username || !password) {
            return res.json({ code: 400, msg: '账号密码不能为空' })
        }
        const [rows] = await pool.query('SELECT * FROM admin_user WHERE username=? AND password=?', [username, password])
        if (rows.length > 0) {
            // 生成JWT token，【这里加上nickname】
            const token = jwt.sign(
                { id: rows[0].id, username: rows[0].username, role: rows[0].role, nickname: rows[0].nickname },
                SECRET_KEY,
                { expiresIn: '1d' }
            )
            return res.json({
                code: 200,
                msg: '登录成功',
                token: token,
                user: {
                    id: rows[0].id,
                    username: rows[0].username,
                    nickname: rows[0].nickname,
                    role: rows[0].role
                }
            })
        } else {
            return res.json({ code: 401, msg: '账号或密码错误' })
        }
    } catch (err) {
        console.log(err)
        return res.json({ code: 500, msg: '服务器错误' })
    }
})


// token校验接口
// verify接口
router.get('/verify', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]
        if (!token) return res.json({ code: 401, msg: '未登录' })
        const decode = jwt.verify(token, SECRET_KEY)
        // 返回用户信息，包含nickname
        return res.json({
            code: 200,
            user: {
                username: decode.username,
                nickname: decode.nickname,
                role: decode.role
            }
        })
    } catch (e) {
        return res.json({ code: 401, msg: 'token失效' })
    }
})


// ========== 权限校验中间件（只有管理员能通过）==========
const checkAdmin = (req, res, next) => {
    let token = req.headers.authorization
    if (!token) {
        return res.json({ code: 401, msg: '未登录' })
    }
    if (token.startsWith('Bearer ')) {
        token = token.slice(7)
    }
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.json({ code: 401, msg: 'token失效' })
        }
        if (decoded.role !== 'admin') {
            return res.json({ code: 403, msg: '权限不足，只有管理员可以操作账号' })
        }
        // 把用户信息挂载到req
        req.currentUser = decoded
        next()
    })
}

// 获取全部用户列表（管理员才能查看）
router.get('/userList', checkAdmin, async (req, res) => {
    try {
        const [rows] = await pool.query(`
        SELECT id,username,nickname,role,sort 
         FROM admin_user 
         ORDER BY sort ASC
        `)
        const newList = rows.map(item => { // ✅ 改成 rows.map
            return {
                ...item,
                roleText: item.role === 'admin' ? '管理员' : '普通用户',
                nickname: item.nickname || '未设置昵称'
            }
        })
        return res.json({ code: 200, data: newList })
    } catch (err) {
        console.log(err)
        return res.json({ code: 500, msg: '服务器错误' })
    }
})





// 新增用户（管理员）
router.post('/addUser', checkAdmin, async (req, res) => {
    const { username, password, role, nickname } = req.body
    if (!username || !password) {
        return res.json({ code: 400, msg: '账号密码不能为空' })
    }
    const userRole = (role === 'admin') ? 'admin' : 'user'
    let sortVal = 0;
    if (userRole === 'admin') {
        const [adminMax] = await pool.query('SELECT MAX(sort) as maxSort FROM admin_user WHERE role="admin"')
        sortVal = adminMax[0].maxSort ? adminMax[0].maxSort + 1 : 1;
    }
    else {
        // 如果是普通用户，排在管理员后面
        const [allAdminCount] = await pool.query('SELECT COUNT(*) as count FROM admin_user WHERE role="admin"')
        sortVal = allAdminCount[0].count + 1;
    }
    try {
        await pool.query('INSERT INTO admin_user(username,password,role,nickname,sort) VALUES (?,?,?,?,?)', [username, password, userRole, nickname || '', sortVal])
        return res.json({ code: 200, msg: '新增成功' })
    } catch (err) {
        console.log(err)
        return res.json({ code: 500, msg: '新增失败' })
    }
})

// 修改用户密码/角色（管理员）
router.post('/editUser', checkAdmin, async (req, res) => {
    const { id, username, password, role, nickname } = req.body
    try {
        let sql, params
        if (password) {
            // 有密码：更新账号、密码、角色、昵称
            sql = 'UPDATE admin_user SET username=?,password=?,role=?,nickname=? WHERE id=?'
            params = [username, password, role, nickname, id]
        } else {
            // 密码留空：只更新账号、角色、昵称
            sql = 'UPDATE admin_user SET username=?,role=?,nickname=? WHERE id=?'
            params = [username, role, nickname, id]
        }
        await pool.query(sql, params)
        return res.json({ code: 200, msg: '修改成功' })
    } catch (err) {
        console.log(err)
        return res.json({ code: 500, msg: '修改失败' })
    }
})
router.post('/adminUser/del', checkAdmin, async (req, res) => {
    const { id } = req.body
    // 当前登录管理员的id，挂载在 req.currentUser
    const loginUserId = req.currentUser.id
    try {
        // 禁止删除超级管理员id=1
        if (Number(id) === 1) {
            return res.json({ code: 400, msg: '不能删除初始超级管理员账号！' })
        }
        // 禁止删除当前登录的自己
        if (Number(id) === loginUserId) {
            return res.json({ code: 400, msg: '不能删除当前登录账号！' })
        }
        await pool.query('DELETE FROM admin_user WHERE id=?', [id])
        return res.json({ code: 200, msg: '删除成功' })
    } catch (err) {
        console.log(err)
        return res.json({ code: 500, msg: '删除失败' })
    }
})

module.exports = router
