const express = require('express')
const router = express.Router()
const pool = require('../db')
const jwt = require('jsonwebtoken')
const SECRET_KEY = 'my-admin-secret-202609'

// token校验中间件
const authMid = async (req, res, next) => {
  // 放行预检请求
  if (req.method === 'OPTIONS') {
    res.status(204).end()
    return
  }
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.json({ code: 401, msg: '未登录，请先登录' })
  }
  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, SECRET_KEY)
    req.admin = decoded
    next()
  } catch (err) {
    return res.json({ code: 401, msg: 'token失效，请重新登录' })
  }
}

// 新增日志接口
router.post('/addLog', authMid, async (req, res) => {
  try {
    const { module_name, operate_type, target_id, content } = req.body
    const sql = `INSERT INTO admin_log(admin_id,admin_username,module_name,operate_type,target_id,content,status) VALUES (?,?,?,?,?,?,?)`
    const [result] = await pool.query(sql,[
      req.admin.id,
      req.admin.username,
      module_name,
      operate_type,
      target_id,
      content,
      'pending'
    ])
    res.json({code:200, msg:'日志保存成功', insertId: result.insertId})
  } catch (err) {
    console.log(err)
    res.json({code:500, msg:'日志写入失败'})
  }
})

// 获取日志列表
router.get('/logList', authMid, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const pageSize = parseInt(req.query.pageSize) || 6
    const offset = (page - 1) * pageSize
    const status = req.query.status
    let sql = `SELECT * FROM admin_log`
    const params = []
    if(status){
      sql += ` WHERE status = ?`
      params.push(status)
    }
    sql += ` ORDER BY create_time DESC LIMIT ?, ?`
    params.push(offset, pageSize)
    const [rows] = await pool.query(sql, params)

    let countSql = `SELECT COUNT(*) AS total FROM admin_log`
    const countParams = []
    if(status){
      countSql += ` WHERE status = ?`
      countParams.push(status)
    }
    const [countRes] = await pool.query(countSql, countParams)
    const total = countRes[0].total
    const totalPage = Math.ceil(total / pageSize)

    res.json({
      code:200,
      data: rows,
      total,
      totalPage
    })
  } catch (err) {
    console.log(err)
    res.json({code:500, msg:'查询日志失败'})
  }
})

// 修改日志状态（审核通过/驳回）
router.put('/logStatus/:id', authMid, async (req, res) => {
  try {
    const logId = req.params.id
    const { status, audit_note } = req.body
    const audit_admin_id = req.admin.id
    const audit_admin_username = req.admin.username

    if(!['pass','reject'].includes(status)){
      return res.json({code:400, msg:'状态参数错误'})
    }

    // 查出日志详情
    const [logInfo] = await pool.query(`SELECT module_name, operate_type, target_id, content FROM admin_log WHERE id=?`,[logId])
    if(logInfo.length === 0) return res.json({code:400, msg:'日志不存在'})
    const {module_name, operate_type, target_id} = logInfo[0]

    // 更新日志审核信息
    await pool.query(`UPDATE admin_log SET status=?, audit_admin_id=?, audit_admin_username=?, audit_time=NOW(), audit_note=? WHERE id=?`,
      [status, audit_admin_id, audit_admin_username, audit_note || '', logId])

    // 执行业务操作
    if(status === 'pass' && module_name === 'gameNav'){
      if(operate_type === 'add'){
        // 新增审核通过：把pending状态改成pass
        await pool.query(`UPDATE game_nav SET status='pass' WHERE id=?`, [target_id])
      }else if(operate_type === 'edit'){
        // 编辑审核通过：读取待审核临时记录，更新原记录
        const [pendingRecord] = await pool.query('SELECT category, game_name, link, target_id AS original_id FROM game_nav WHERE id = ?', [target_id])
        if(pendingRecord.length > 0){
          const { category, game_name, link, original_id } = pendingRecord[0]
          // 覆盖原记录
          await pool.query(`UPDATE game_nav SET category=?, game_name=?, link=?, status='pass' WHERE id=?`, 
            [category, game_name, link, original_id])
          // 删除临时待审核记录
          await pool.query('DELETE FROM game_nav WHERE id = ?', [target_id])
        }
      }else if(operate_type === 'del'){
        // 删除审核通过：删除原记录，同时清理临时申请记录
        await pool.query(`DELETE FROM game_nav WHERE id=?`, [target_id])
      }
    }

    // 驳回时清理gameNav对应的pending临时记录（新增、编辑都清理）
    if(status === 'reject' && module_name === 'gameNav'){
      await pool.query(`DELETE FROM game_nav WHERE id=?`, [target_id])
    }

    res.json({code:200, msg:'审核完成'})
  } catch (err) {
    console.log(err)
    res.json({code:500, msg:'审核失败'})
  }
})

module.exports = router
