import React, { useState, useEffect } from 'react'
import TimeFormat from '../../../components/TimeFormat'
import './index.css'
const ShowPhotoTable = () => {
  const [photoList, setPhotoList] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [selectedFile2, setSelectedFile2] = useState(null)
  const [bigTitle, setBigTitle] = useState('')
  const [smallTitle, setSmallTitle] = useState('')
  const [description, setDescription] = useState('')
  // ==========新增link状态==========
  const [link, setLink] = useState('')
  const [editId, setEditId] = useState(null)
  const baseUrl = 'http://localhost:3000'
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(4)
  const [total, setTotal] = useState(0)
  const [totalPage, setTotalPage] = useState(1)

  const getPhotoList = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/photoList?page=${page}&pageSize=${pageSize}`)
      const json = await res.json()
      if (json.code === 200) {
        const data = json.data.map(item => ({
          ...item,
          url: `${baseUrl}${item.img_path}`,
          url2: `${baseUrl}${item.img_path2}`
        }))
        setPhotoList(data)
        setTotal(json.total || 0)
        setTotalPage(json.totalPage || 1)
      }
    } catch (err) {
      alert('获取展示图片列表失败，请检查后端服务是否启动！')
      console.error(err)
    }
  }

  useEffect(() => {
    getPhotoList()
  }, [page, pageSize])

  const openAddModal = () => {
    setShowModal(true)
    setSelectedFile(null)
    setSelectedFile2(null)
    setBigTitle('')
    setSmallTitle('')
    setDescription('')
    setLink('') // 新增清空link
    setEditId(null)
  }

  const openEditModal = (item) => {
    setShowModal(true)
    setSelectedFile(null)
    setSelectedFile2(null)
    setBigTitle(item.big_title)
    setSmallTitle(item.small_title)
    setDescription(item.description || '')
    setLink(item.link || '') // 编辑回填link
    setEditId(item.id)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedFile(null)
    setSelectedFile2(null)
    setBigTitle('')
    setSmallTitle('')
    setDescription('')
    setLink('') // 关闭弹窗清空link
    setEditId(null)
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) setSelectedFile(file)
  }
  const handleFileChange2 = (e) => {
    const file = e.target.files[0]
    if (file) setSelectedFile2(file)
  }

  const handleSubmit = async () => {
    if (!bigTitle.trim()) {
      alert('请输入名称！')
      return
    }
    if (!smallTitle.trim()) {
      alert('请输入标题！')
      return
    }
    if (!editId && !selectedFile) {
      alert('请选择图标图片！')
      return
    }
    const formData = new FormData()
    formData.append('bigTitle', bigTitle)
    formData.append('smallTitle', smallTitle)
    formData.append('description', description)
    formData.append('link', link) // 提交link到后端
    if (selectedFile) formData.append('img', selectedFile)
    if (selectedFile2) formData.append('img2', selectedFile2)
    try {
      let res
      if (editId) {
        res = await fetch(`${baseUrl}/api/photo/${editId}`, {
          method: 'PUT',
          body: formData
        })
      } else {
        res = await fetch(`${baseUrl}/api/upload`, {
          method: 'POST',
          body: formData
        })
      }
      const json = await res.json()
      if (json.code === 200) {
        alert(editId ? '修改成功！' : '上传成功！')
        closeModal()
        setPage(1)
        getPhotoList()
      } else {
        alert(json.msg)
      }
    } catch (err) {
      alert('操作失败，请确认后端已启动！')
      console.error(err)
    }
  }

  const handleDelete = async (delId) => {
    if (!window.confirm('确定要删除这条记录吗？')) return
    try {
      const res = await fetch(`${baseUrl}/api/photo/${delId}`, {
        method: 'DELETE'
      })
      const json = await res.json()
      if (json.code === 200) {
        alert('删除成功')
        getPhotoList()
      }
    } catch (err) {
      alert('删除失败！')
      console.error(err)
    }
  }

  const prevPage = () => {
    if (page > 1) setPage(page - 1)
  }
  const nextPage = () => {
    if (page < totalPage) setPage(page + 1)
  }
  const goPage = (num) => {
    setPage(num)
  }
  const pageNumbers = []
  for (let i = 1; i <= totalPage; i++) {
    pageNumbers.push(i)
  }

  return (
    <div className="photo-table-container">
      <h2>展示页图片管理</h2>
      <button className="add-btn" onClick={openAddModal}>添加展示照片</button>
      {showModal && (
        <div className="modal-mask">
          <div className="modal-box">
            <h3>{editId ? '修改展示照片' : '新增展示照片'}</h3>
            <div className="input-item">
              <label>名称：</label>
              <input type="text" value={bigTitle} onChange={(e) => setBigTitle(e.target.value)} />
            </div>
            <div className="input-item">
              <label>标题：</label>
              <input type="text" value={smallTitle} onChange={(e) => setSmallTitle(e.target.value)} />
            </div>
            <div className="input-item">
              <label>描述文字：</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="请输入图片描述..."
              />
            </div>
            {/* ==========新增跳转链接输入框========== */}
            <div className="input-item">
              <label>跳转链接：</label>
              <input
                type="text"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://xxx.com，留空则不跳转"
              />
            </div>
            <div className="input-item">
              <label>图标</label>
              <input type="file" accept="image/*" onChange={handleFileChange} />
              {selectedFile && <p>已选：{selectedFile.name}</p>}
              {editId && !selectedFile && <p style={{ color: '#777' }}>不选则保留原图</p>}
            </div>
            <div className="input-item">
              <label>展示图片：</label>
              <input type="file" accept="image/*" onChange={handleFileChange2} />
              {selectedFile2 && <p>已选：{selectedFile2.name}</p>}
              {editId && !selectedFile2 && <p style={{ color: '#777' }}>不选则保留原图</p>}
            </div>
            <div className="modal-footer">
              <button onClick={closeModal}>取消</button>
              <button onClick={handleSubmit}>提交</button>
            </div>
          </div>
        </div>
      )}
      <table className="photo-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>图标</th>
            <th>展示图片</th>
            <th>名称</th>
            <th>标题</th>
            <th>描述</th>
            <th>创建时间</th>
            <th>更新时间</th>
            <th>跳转链接</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {photoList.map((item, index) => (
            <tr key={item.id}>
              <td>{(page - 1) * pageSize + index + 1}</td>
              <td>{item.url ? <img src={item.url} style={{ width: 100 }} alt="" /> : '无'}</td>
              <td>{item.url2 ? <img src={item.url2} style={{ width: 100 }} alt="" /> : '无'}</td>
              <td>{item.big_title}</td>
              <td>{item.small_title}</td>
              <td>{item.description || '-'}</td>
              <td><TimeFormat utcStr={item.create_time} /></td>
              <td><TimeFormat utcStr={item.update_time} /></td>
              {/* 跳转链接单元格 */}
              <td>
                {item.link ? (
                  <a href={item.link} target="_blank" rel="noreferrer">打开链接</a>
                ) : (
                  <span>无</span>
                )}
              </td>
              <td>
                <button className="edit-btn" onClick={() => openEditModal(item)}>修改</button>
                <button className="del-btn" onClick={() => handleDelete(item.id)}>删除</button>
              </td>
            </tr>
          ))}
          {/* 修正colSpan，总共10列 */}
          {photoList.length === 0 && <tr><td colSpan={10}>暂无数据</td></tr>}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={prevPage} disabled={page === 1}>上一页</button>
        {pageNumbers.map(num => (
          <button key={num} onClick={() => goPage(num)} className={page === num ? 'active' : ''}>
            {num}
          </button>
        ))}
        <button onClick={nextPage} disabled={page >= totalPage}>下一页</button>
        <span className="page-info">共 {total} 条</span>
      </div>
    </div>
  )
}
export default ShowPhotoTable;
