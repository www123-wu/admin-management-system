const express = require('express')
const router = express.Router()
const pool = require('../db')
const jwt = require('jsonwebtoken')
// 和登录接口密钥完全一致
const SECRET_KEY = 'my-admin-secret-202609'

// 鉴权中间件
const authMid = (req, res, next) => {
    // 放行OPTIONS预检请求
    if (req.method === 'OPTIONS') {
        res.status(204).end()
        return
    }

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
        // 不需要角色校验就注释掉下面这行
        // if (decoded.role !== 'admin') {
        //     return res.json({ code: 403, msg: '权限不足' })
        // }
        req.currentUser = decoded
        next()
    })
}

// ========== 1. 前台公开接口：无需登录，仅返回已通过 ==========
router.get('/', async (req, res) => {
    try {
        const sql = `SELECT * FROM game_nav WHERE status='pass' ORDER BY sort ASC`
        const [rows] = await pool.query(sql)
        res.json({
            code: 200,
            data: rows
        })
    } catch (err) {
        console.error(err)
        res.json({ code: 500, msg: '服务器错误' })
    }
})

// ========== 2. 后台管理接口：需登录，全量所有状态（分页+筛选+搜索） ==========
router.get('/manage', authMid, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1
        const pageSize = parseInt(req.query.pageSize) || 3
        const offset = (page - 1) * pageSize
        const category = req.query.category
        const gameName = req.query.gameName

        // 拼接查询条件
        let whereSql = ' WHERE 1=1 '
        let params = []
        if (category) {
            whereSql += ' AND category = ? '
            params.push(category)
        }
        if (gameName) {
            whereSql += ' AND game_name LIKE ? '
            params.push(`%${gameName}%`)
        }

        const listSql = `SELECT * FROM game_nav ${whereSql} ORDER BY id DESC LIMIT ?,?`
        const countSql = `SELECT COUNT(*) AS total FROM game_nav ${whereSql}`
        params.push(offset, pageSize)

        const [rows] = await pool.query(listSql, params)
        const [totalResult] = await pool.query(countSql, params.slice(0, params.length - 2))
        const total = totalResult[0].total
        const totalPage = Math.ceil(total / pageSize)

        res.json({
            code: 200,
            data: rows,
            total,
            totalPage
        })
    } catch (err) {
        console.error(err)
        res.json({ code: 500, msg: '服务器错误' })
    }
})

// ========== 3. 提交申请接口 ==========
// 新增申请
router.post('/apply', authMid, async (req, res) => {
    try {
        const { category, game_name, link } = req.body
        const [result] = await pool.query(
            'INSERT INTO game_nav(category, game_name, link, status) VALUES (?,?,?,?)',
            [category, game_name, link, 'pending']
        )

        // 写入操作日志
        await pool.query(`INSERT INTO admin_log(admin_id,admin_username,module_name,operate_type,target_id,content,status) 
        VALUES (?,?,?,?,?,?,?)`, [
            req.currentUser.id,
            req.currentUser.username,
            'gameNav',
            'add',
            result.insertId,
            `新增游戏【${game_name}】分类：${category}`,
            'pending'
        ])

        res.json({ code: 200, msg: '新增申请已提交，等待管理员审核', insertId: result.insertId })
    } catch (err) {
        console.error('新增报错：', err)
        res.json({ code: 500, msg: '新增失败' })
    }
})

// 编辑申请
router.put('/apply/:id', authMid, async (req, res) => {
    try {
        const { category, game_name, link } = req.body
        const { id } = req.params
        const [result] = await pool.query(
            'INSERT INTO game_nav(category, game_name, link, status, target_id) VALUES (?,?,?,?,?)',
            [category, game_name, link, 'pending', id]
        )

        await pool.query(`INSERT INTO admin_log(admin_id,admin_username,module_name,operate_type,target_id,content,status) 
        VALUES (?,?,?,?,?,?,?)`, [
            req.currentUser.id,
            req.currentUser.username,
            'gameNav',
            'edit',
            result.insertId,
            `申请编辑游戏【${game_name}】，原记录ID:${id}`,
            'pending'
        ])

        res.json({ code: 200, msg: '编辑申请已提交，等待管理员审核', insertId: result.insertId })
    } catch (err) {
        console.error('编辑报错：', err)
        res.json({ code: 500, msg: '提交编辑申请失败' })
    }
})

// 删除申请
router.delete('/apply/:id', authMid, async (req, res) => {
    try {
        const { id } = req.params
        const [result] = await pool.query(
            'INSERT INTO game_nav(category, game_name, link, status, target_id) SELECT category, game_name, link, "pending", id FROM game_nav WHERE id=?',
            [id]
        )

        await pool.query(`INSERT INTO admin_log(admin_id,admin_username,module_name,operate_type,target_id,content,status) 
        VALUES (?,?,?,?,?,?,?)`, [
            req.currentUser.id,
            req.currentUser.username,
            'gameNav',
            'del',
            result.insertId,
            `申请删除游戏记录ID:${id}`,
            'pending'
        ])

        res.json({ code: 200, msg: '删除申请已提交，等待管理员审核', insertId: result.insertId })
    } catch (err) {
        console.error('删除报错：', err)
        res.json({ code: 500, msg: '提交删除申请失败' })
    }
})

// ========== 4. 审核接口 ==========
router.put('/audit/:id', authMid, async (req, res) => {
    try {
        const { id } = req.params
        const { status } = req.body
        const adminInfo = req.currentUser

        if (!['pass', 'reject'].includes(status)) {
            return res.json({ code: 400, msg: '状态参数错误' })
        }

        await pool.query('UPDATE game_nav SET status = ? WHERE id = ?', [status, id])
        await pool.query(`INSERT INTO audit_log(type, target_id, status, audit_admin_id, audit_admin_name) 
        VALUES (?,?,?,?,?)`, ['gameNav', id, status, adminInfo.id, adminInfo.username])

        res.json({ code: 200, msg: '审核操作成功' })
    } catch (err) {
        console.error(err)
        res.json({ code: 500, msg: '审核失败' })
    }
})

// 获取待审核列表
router.get('/auditList', authMid, async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM game_nav WHERE status = "pending" ORDER BY id DESC')
        res.json({ code: 200, data: rows })
    } catch (err) {
        console.error(err)
        res.json({ code: 500, msg: '获取待审核列表失败' })
    }
})

// 获取全部审核日志
router.get('/auditLogList', authMid, async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM audit_log ORDER BY create_time DESC')
        res.json({ code: 200, data: rows })
    } catch (err) {
        console.error(err)
        res.json({ code: 500, msg: '获取审核日志失败' })
    }
})

module.exports = router
