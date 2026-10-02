const express = require('express')
const router = express.Router()
const pool = require('../db')
const multer = require('multer')
const fs = require('fs')
const path = require('path')
// multer上传配置
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync('uploads')) fs.mkdirSync('uploads')
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    const filename = Date.now() + '-' + file.originalname
    cb(null, filename)
  }
})
const upload = multer({ storage })
// 分页列表接口
router.get('/photoList', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const pageSize = parseInt(req.query.pageSize) || 4
    const offset = (page - 1) * pageSize
    const [rows] = await pool.query('SELECT * FROM photo_info ORDER BY id ASC LIMIT ?, ?', [offset, pageSize])
    const [totalResult] = await pool.query('SELECT COUNT(*) AS total FROM photo_info')
    const total = totalResult[0].total
    const totalPage = Math.ceil(total / pageSize)
    const data = rows.map(item => ({
      ...item,
      url: `http://localhost:3000${item.img_path}`,
      url2: `http://localhost:3000${item.img_path2}`
    }))
    res.json({
      code: 200,
      data,
      total,
      page,
      pageSize,
      totalPage
    })
  } catch (err) {
    console.error(err)
    res.json({ code: 500, msg: '数据库查询失败' })
  }
})
// 新增上传接口（增加 link）
router.post('/upload', upload.fields([{name:'img'},{name:'img2'}]), async (req,res)=>{
  try {
    const { bigTitle, smallTitle, description, link } = req.body
    let img_path = ''
    let img_path2 = ''
    if(req.files.img){
      img_path = '/uploads/' + req.files.img[0].filename
    }
    if(req.files.img2){
      img_path2 = '/uploads/' + req.files.img2[0].filename
    }
    // SQL增加link字段
    await pool.query('INSERT INTO photo_info(big_title,small_title,description,link,img_path,img_path2) VALUES(?,?,?,?,?,?)',[bigTitle,smallTitle,description,link,img_path,img_path2])
    res.json({code:200,msg:'添加成功'})
  } catch(err){
    console.error(err)
    res.json({code:500, msg:'新增失败'})
  }
})
// 删除图片记录
router.delete('/photo/:id', async (req, res) => {
  try {
    const id = req.params.id
    const [rows] = await pool.query('SELECT img_path, img_path2 FROM photo_info WHERE id=?', [id])
    if (rows.length === 0) return res.json({ code: 400, msg: '找不到记录' })
    const imgPath = rows[0].img_path
    const imgPath2 = rows[0].img_path2
    // 删除第一张图
    if(imgPath){
      const filePath = path.join(__dirname, '../', imgPath)
      fs.unlink(filePath, err => {
        if (err) console.log('第一张图片删除失败', err)
      })
    }
    // 删除第二张图
    if(imgPath2){
      const filePath2 = path.join(__dirname, '../', imgPath2)
      fs.unlink(filePath2, err => {
        if (err) console.log('第二张图片删除失败', err)
      })
    }
    await pool.query('DELETE FROM photo_info WHERE id=?', [id])
    res.json({ code: 200, msg: '删除成功' })
  } catch (err) {
    console.error(err)
    res.json({ code: 500, msg: '删除失败' })
  }
})
// 修改接口（同步增加 link）
router.put('/photo/:id', upload.fields([{name:'img'},{name:'img2'}]), async (req,res)=>{
  try{
    const {id} = req.params
    const { bigTitle, smallTitle, description, link } = req.body
    // 查询旧数据
    const [oldData] = await pool.query('SELECT * FROM photo_info WHERE id=?',[id])
    if(oldData.length === 0) return res.json({code:400,msg:'找不到记录'})
    let img_path = oldData[0].img_path
    let img_path2 = oldData[0].img_path2
    // 如果上传新图，先删除旧文件
    if(req.files.img){
      const oldFilePath = path.join(__dirname, '../', img_path)
      fs.unlink(oldFilePath, e=>{if(e)console.log('删除旧图1失败',e)})
      img_path = '/uploads/' + req.files.img[0].filename
    }
    if(req.files.img2){
      const oldFilePath2 = path.join(__dirname, '../', img_path2)
      fs.unlink(oldFilePath2, e=>{if(e)console.log('删除旧图2失败',e)})
      img_path2 = '/uploads/' + req.files.img2[0].filename
    }
    await pool.query('UPDATE photo_info SET big_title=?,small_title=?,description=?,link=?,img_path=?,img_path2=? WHERE id=?',[bigTitle,smallTitle,description,link,img_path,img_path2,id])
    res.json({code:200,msg:'修改成功'})
  }catch(err){
    console.error(err)
    res.json({code:500,msg:'修改失败'})
  }
})
module.exports = router
