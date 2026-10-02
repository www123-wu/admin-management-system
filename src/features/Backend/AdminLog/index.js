import React, { useState, useEffect } from 'react'
import TimeFormat from '../../../components/TimeFormat'
const AuditLog = () => {
  const [pendingList, setPendingList] = useState([]) // 待审核日志
  const [auditLog, setAuditLog] = useState([]) // 已审核日志
  const baseUrl = 'http://localhost:3000'

  // 获取待审核列表
  const getPendingList = async () => {
    const token = localStorage.getItem('token')
    const res = await fetch(`${baseUrl}/api/logList?status=pending`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const json = await res.json()
    if(json.code === 200){
      setPendingList(json.data)
    }
  }

  // 获取已审核日志
  const getAuditLog = async () => {
    const token = localStorage.getItem('token')
    const res = await fetch(`${baseUrl}/api/logList`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const json = await res.json()
    if(json.code === 200){
      // 前端过滤掉pending，只保留已处理记录
      const doneList = json.data.filter(item => item.status !== 'pending')
      setAuditLog(doneList)
    }
  }

  // 审核操作：通过/驳回
  const handleAudit = async (logId, status) => {
    const tip = status === 'pass' ? '确定审核通过？' : '确定驳回？'
    if(!window.confirm(tip)) return
    const token = localStorage.getItem('token')
    const res = await fetch(`${baseUrl}/api/logStatus/${logId}`, {
      method:'PUT',
      headers: {
        'Content-Type':'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status, audit_note: '' })
    })
    const json = await res.json()
    if(json.code === 200){
      alert(json.msg)
      getPendingList()
      getAuditLog()
    }else{
      alert(json.msg)
    }
  }

  useEffect(()=>{
    getPendingList()
    getAuditLog()
  },[])

  return (
    <div className="photo-table-container">
      <h2>待审核操作日志</h2>
      <table className="photo-table">
        <thead>
          <tr>
            <th>日志ID</th>
            <th>模块</th>
            <th>操作类型</th>
            <th>详情</th>
            <th>提交人</th>
            <th>提交时间</th>
            <th>审核操作</th>
          </tr>
        </thead>
        <tbody>
          {pendingList.map(item=>(
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.module_name === 'gameNav' ? '游戏导航管理' : item.module_name}</td>
              <td>
                {item.operate_type === 'add' ? '新增' : item.operate_type === 'edit' ? '编辑' : '删除'}
              </td>
              <td>{item.content}</td>
              <td>{item.admin_username}</td>
              <td></td>
              <td>
                <button style={{background:'green',color:'white', margin:'0 4px'}} onClick={()=>handleAudit(item.id,'pass')}>通过</button>
                <button style={{background:'red',color:'white'}} onClick={()=>handleAudit(item.id,'reject')}>驳回</button>
              </td>
            </tr>
          ))}
          {pendingList.length === 0 && <tr><td colSpan={7}>暂无待审核数据</td></tr>}
        </tbody>
      </table>

      <h2 style={{marginTop:30}}>审核操作日志</h2>
      <table className="photo-table">
        <thead>
          <tr>
            <th>日志ID</th>
            <th>模块</th>
            <th>操作类型</th>
            <th>审核结果</th>
            <th>审核管理员</th>
            <th>审核时间</th>
          </tr>
        </thead>
        <tbody>
          {auditLog.map(item=>(
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.module_name === 'gameNav' ? '游戏导航管理' : item.module_name}</td>
              <td>
                {item.operate_type === 'add' ? '新增' : item.operate_type === 'edit' ? '编辑' : '删除'}
              </td>
              <td>
                {item.status === 'pass' ? <span style={{color:'green'}}>已通过</span> : <span style={{color:'red'}}>已驳回</span>}
              </td>
              <td>{item.audit_admin_username || '-'}</td>
              <td>{<TimeFormat utcStr={item.create_time} /> || '-'}</td>
            </tr>
          ))}
          {auditLog.length === 0 && <tr><td colSpan={6}>暂无审核日志</td></tr>}
        </tbody>
      </table>
    </div>
  )
}
export default AuditLog
