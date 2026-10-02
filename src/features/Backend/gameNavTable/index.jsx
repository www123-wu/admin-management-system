import React, { useState, useEffect } from 'react'
import TimeFormat from '../../../components/TimeFormat'
const GameNavTable = () => {
  const [gameList, setGameList] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState(null)
  // 表单数据
  const [category, setCategory] = useState('客户端游戏')
  const [gameName, setGameName] = useState('')
  const [link, setLink] = useState('')
  // 分页
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(3)
  const [total, setTotal] = useState(0)
  const [totalPage, setTotalPage] = useState(1)
  // 切换分类选项
  const categoryOptions = [
    { label: '全部', value: '' },
    { label: '客户端游戏', value: '客户端游戏' },
    { label: '手机游戏', value: '手机游戏' },
    { label: '游戏平台', value: '游戏平台' },
  ]
  const [selectedCategory, setSelectedCategory] = useState('')
  // ========== 新增搜索状态 ==========
  const [searchVal, setSearchVal] = useState('')
  const [searchKey, setSearchKey] = useState('') // 真正传给后端的关键词
  const baseUrl = 'http://localhost:3000'

  // 获取列表接口
  const getGameList = async () => {
    
    const token = localStorage.getItem('token')
    console.log('当前请求token：', token)
    try {
      const query = new URLSearchParams()
      query.append('page', page)
      query.append('pageSize', pageSize)
      if (selectedCategory) query.append('category', selectedCategory)
      if (searchKey) query.append('gameName', searchKey) // 传给后端搜索字段
      const token = localStorage.getItem('token')
      const res = await fetch(`${baseUrl}/api/gameNav/manage?${query.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const json = await res.json()
      if (json.code === 200) {
        setGameList(json.data)
        setTotal(json.total)
        setTotalPage(json.totalPage)
      } else {
        alert(json.msg)
      }
    } catch (err) {
      console.error('获取游戏导航失败', err)
    }
  }
  useEffect(() => {
    getGameList()
  }, [page, pageSize, selectedCategory, searchKey]) // searchKey变化重新请求

  // ========== 搜索点击事件 ==========
  const handleSearch = () => {
    setSearchKey(searchVal)
    setPage(1) // 搜索后重置到第一页
  }
  // 清空搜索
  const handleClearSearch = () => {
    setSearchVal('')
    setSearchKey('')
    setPage(1)
  }
  // 打开新增弹窗
  const openAddModal = () => {
    setEditId(null)
    setCategory('客户端游戏')
    setGameName('')
    setLink('')
    setShowModal(true)
  }
  // 打开编辑弹窗
  const openEditModal = (record) => {
    setEditId(record.id)
    setCategory(record.category|| '客户端游戏')
    setGameName(record.game_name|| '')
    setLink(record.link|| '')
    setShowModal(true)
  }
  // 提交新增/编辑
  const handleSubmit = async () => {
    try {
      const body = { category, game_name: gameName, link }
      let res
      const token = localStorage.getItem('token')
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
      if (editId) {
        // 编辑申请
        res = await fetch(`${baseUrl}/api/gameNav/apply/${editId}`, {
          method: 'PUT',
          headers: headers,
          body: JSON.stringify(body)
        })
      } else {
        // 新增申请
        res = await fetch(`${baseUrl}/api/gameNav/apply`, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(body)
        })
      }
      const json = await res.json()
      if (json.code === 200) {
        alert(json.msg) // 弹出：提交成功，等待管理员审核
        setShowModal(false)
        getGameList()
      } else {
        alert(json.msg || '操作失败')
      }
    } catch (err) {
      console.error('提交失败', err)
      alert('网络异常，提交失败')
    }
  }
  // 删除
  const handleDelete = async (id, game_name) => {
    if (!window.confirm('确定提交删除申请？提交后等待管理员审核')) return
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${baseUrl}/api/gameNav/apply/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const json = await res.json()
      if (json.code === 200) {
        alert(json.msg)
        getGameList()
      }
    } catch (err) {
      console.error('删除申请失败', err)
      alert('提交删除申请失败')
    }
  }
  // 分页切换
  const changePage = (num) => {
    if (num < 1 || num > totalPage) return
    setPage(num)
  }
  return (
    <div className="photo-table-container">
      <div className="upload-area" style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
        <button className="open-modal-btn" onClick={openAddModal}>新增游戏导航</button>
        <div>
          <span>分类筛选：</span>
          <select value={selectedCategory} onChange={(e) => {
            setSelectedCategory(e.target.value)
            setPage(1) // 切换分类重置到第一页
          }} style={{ padding: '6px' }}>
            {categoryOptions.map(item => (
              <option key={item.value} value={item.value}>{item.label}</option>
            ))}
          </select>
        </div>
        {/* ========== 新增搜索区域 ========== */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            type="text"
            placeholder="输入游戏名称搜索"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            style={{ padding: '6px' }}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSearch() }}
          />
          <button className="open-modal-btn" onClick={handleSearch}>搜索</button>
          <button style={{ padding: '6px' }} onClick={handleClearSearch}>重置</button>
        </div>
      </div>
      <table className="photo-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>分类</th>
            <th>游戏名称</th>
            <th>跳转链接</th>
            <th>状态</th>
            <th>创建时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {gameList.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.category}</td>
              <td>{item.game_name}</td>
              <td>{item.link || <span style={{ color: '#999' }}>空</span>}</td>
              <td>
                {item.status === 'pending' ? <span style={{ color: 'orange' }}>待审核</span> : ''}
                {item.status === 'pass' ? <span style={{ color: 'green' }}>已通过</span> : ''}
                {item.status === 'reject' ? <span style={{ color: 'red' }}>已驳回</span> : ''}
              </td>
              <td><TimeFormat utcStr={item.create_time}/></td>
              <td>
                <button className="open-modal-btn" style={{ background: '#67c23a' }} onClick={() => openEditModal(item)}>编辑</button>
                <button className="del-btn" onClick={() => handleDelete(item.id, item.game_name)}>删除申请</button>
                {/* 移除审核按钮！审核放到单独的审核日志页面 */}

              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* 分页 */}
      <div style={{ marginTop: 16, display: 'flex', gap: 8, alignItems: 'center' }}>
        <button onClick={() => changePage(page - 1)} disabled={page <= 1}>上一页</button>
        <span>第{page}页 / 共{totalPage}页，总共{total}条</span>
        <button onClick={() => changePage(page + 1)} disabled={page >= totalPage}>下一页</button>
      </div>
      {/* 弹窗 */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999
        }}>
          <div style={{ background: 'white', padding: 24, width: 420, borderRadius: 8 }}>
            <h3>{editId ? '编辑导航' : '新增导航'}</h3>
            <div style={{ margin: '12px 0' }}>
              <label>分类：</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: '100%', padding: 6, marginTop: 4 }}>
                <option value="客户端游戏">客户端游戏</option>
                <option value="手机游戏">手机游戏</option>
                <option value="游戏平台">游戏平台</option>
              </select>
            </div>
            <div style={{ margin: '12px 0' }}>
              <label>游戏名称：</label>
              <input
                type="text" value={gameName} onChange={(e) => setGameName(e.target.value)}
                style={{ width: '100%', padding: 6, marginTop: 4 }} placeholder="输入游戏名称"
              />
            </div>
            <div style={{ margin: '12px 0' }}>
              <label>跳转链接：</label>
              <input
                type="text" value={link} onChange={(e) => setLink(e.target.value)}
                style={{ width: '100%', padding: 6, marginTop: 4 }} placeholder="留空则不跳转"
              />
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 20 }}>
              <button onClick={() => setShowModal(false)}>取消</button>
              <button className="open-modal-btn" onClick={handleSubmit}>提交申请</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
export default GameNavTable
