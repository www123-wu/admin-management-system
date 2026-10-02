import React, { useState, useEffect } from 'react';
import { Table, Button, message, Space, Input } from 'antd';
// 接收role 和 当前登录用户名
const AdminUserManage = ({ role, username }) => {
    const [userList, setUserList] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editInfo, setEditInfo] = useState(null);
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [selectRole, setSelectRole] = useState('user');
    const [nickname, setNickname] = useState(''); // 昵称state
    const [keyword, setKeyword] = useState(''); // 搜索关键词
    const token = localStorage.getItem('token');
    const baseUrl = 'http://localhost:3000/api';
    const isAdmin = role === 'admin';
    // 分页状态
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(0);
    // 获取用户列表【分页+搜索】
    const getList = async () => {
        try {
            const res = await fetch(`${baseUrl}/List?page=${page}&pageSize=${pageSize}&keyword=${keyword}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            const data = await res.json()
            if (data.code === 200) {
                setUserList(data.data)
                setTotal(data.total)
            } else {
                message.warning(data.msg)
            }
        } catch (err) {
            message.error('获取列表失败')
        }
    }
    // 分页切换 或者 关键词变化触发重新请求
    useEffect(() => {
        getList()
    }, [page, pageSize, keyword])
    // 搜索按钮事件
    const handleSearch = () => {
        setPage(1); //搜索重置到第一页
        getList();
    }
    // 重置按钮事件
    const handleReset = () => {
        setKeyword('');
        setPage(1);
        getList();
    }
    // 打开新增弹窗，预设角色
    const openAdd = (presetRole) => {
        setEditInfo(null)
        setName('')
        setPassword('')
        setSelectRole(presetRole)
        setNickname('') // 清空昵称
        setModalOpen(true)
    }
    // 打开编辑弹窗
    const openEdit = (record) => {
        setEditInfo(record)
        setName(record.username)
        setPassword('')
        setSelectRole(record.role)
        setNickname(record.nickname || '') // 回填昵称
        setModalOpen(true)
    }
    // 提交保存
    const handleSubmit = async () => {
        if (!name) {
            message.warning('账号不能为空')
            return
        }
        let url, body
        if (editInfo) {
            // 修改账号
            url = `${baseUrl}/editUser`
            body = {
                id: editInfo.id,
                username: name,
                password,
                role: selectRole,
                nickname: nickname ?? '' // 兜底防止null
            }
        } else {
            // 新增账号
            if (!password) {
                message.warning('密码不能为空')
                return
            }
            url = `${baseUrl}/addUser`
            body = {
                username: name,
                password,
                role: selectRole,
                nickname: nickname ?? '' // 兜底防止null
            }
        }
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(body)
        })
        const data = await res.json()
        if (data.code === 200) {
            message.success(data.msg)
            setModalOpen(false)
            getList()
        } else {
            message.warning(data.msg)
        }
    }
    // 删除用户【前端增加超级管理员拦截】
    const handleDel = async (record) => {
        const id = Number(record.id)
        if (id === 1) {
            message.warning('不能删除超级管理员账号！')
            return
        }
        if (!window.confirm('确定删除？')) return
        const res = await fetch(`${baseUrl}/adminUser/del`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ id: record.id })
        })
        const data = await res.json()
        if (data.code === 200) {
            message.success('删除成功')
            getList()
        } else {
            message.warning(data.msg)
        }
    }
    const columns = [
        {
            title: '序号',
            render: (text, record, index) => (page - 1) * pageSize + index + 1
        },
        { title: '昵称', dataIndex: 'nickname' },
        {
            title: '角色',
            dataIndex: 'role',
            render: (val) => val === 'admin' ? '管理员' : '普通用户'
        },
        { title: '账号', dataIndex: 'username' },
        {
            title: '操作',
            render: (record) => {
                // 账号是admin，就是超级管理员，隐藏编辑删除
                const isSuperAdmin = record.username === 'admin'
                return (
                    <Space>
                        {!isSuperAdmin && <Button disabled={!isAdmin} onClick={() => openEdit(record)}>编辑</Button>}
                        {!isSuperAdmin && (
                            <Button danger disabled={!isAdmin} onClick={() => handleDel(record)}>删除</Button>
                        )}
                    </Space>
                )
            }
        }

    ]
    return (
        <div style={{ padding: '20px' }}>
            {/* 顶部栏：左边添加按钮，右边搜索 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Space>
                    <Button type="primary" disabled={!isAdmin} onClick={() => openAdd('admin')}>添加管理员</Button>
                    <Button type="primary" disabled={!isAdmin} onClick={() => openAdd('user')}>添加用户</Button>
                </Space>
                <Space>
                    <Input
                        placeholder="输入账号或昵称搜索"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        style={{ width: 260 }}
                        onPressEnter={handleSearch}
                    />
                    <Button type="primary" onClick={handleSearch}>搜索</Button>
                    <Button onClick={handleReset}>重置</Button>
                </Space>
            </div>
            <Table
                columns={columns}
                dataSource={userList}
                rowKey="id"
                pagination={{
                    current: page,
                    pageSize: pageSize,
                    total: total,
                    showSizeChanger: true,
                    pageSizeOptions: ['5', '10', '20'],
                    showTotal: (total) => `共 ${total} 条`,
                    onChange: (p, ps) => {
                        setPage(p)
                        setPageSize(ps)
                    }
                }}
            />
            {modalOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div style={{ background: '#fff', padding: '24px', width: '400px' }}>
                        <h3>{editInfo ? '编辑账号' : '新增账号'}</h3>
                        <div style={{ margin: '10px 0' }}>
                            <label>昵称（展示名称）：</label>
                            <input value={nickname} onChange={e => setNickname(e.target.value)} style={{ width: '100%', padding: '6px' }} />
                        </div>
                        <div style={{ margin: '10px 0' }}>
                            <label>用户名（登录账号）：</label>
                            <input value={name} onChange={e => setName(e.target.value)} style={{ width: '100%', padding: '6px' }} />
                        </div>
                        <div style={{ margin: '10px 0' }}>
                            <label>密码：{editInfo && <span style={{ color: '#999' }}>留空则不修改密码</span>}</label>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: '6px' }} />
                        </div>
                        <div style={{ margin: '10px 0' }}>
                            <label>角色：</label>
                            <select value={selectRole} onChange={e => setSelectRole(e.target.value)} style={{ width: '100%', padding: '6px' }}>
                                <option value="user">普通用户</option>
                                <option value="admin">管理员</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                            <Button onClick={() => setModalOpen(false)}>取消</Button>
                            <Button type="primary" onClick={handleSubmit}>保存</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
export default AdminUserManage
