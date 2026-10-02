import React, { useState, useEffect } from 'react';
import { Layout, Menu, Avatar, Space, Segmented, Card, theme, Button, message } from 'antd';
import { GithubFilled, InfoCircleFilled, QuestionCircleFilled, PictureOutlined, SmileOutlined, NotificationOutlined, LineChartOutlined, RedditOutlined, AppstoreOutlined } from '@ant-design/icons';
import PhotoTable from './middlebackend/index'; // 图片管理组件
import GameNavTable from './gameNavTable/index'; //游戏导航管理组件
import AdminUserManage from './AdminUserManage/adminusermanage';
import AdminLog from './AdminLog'; // ✅引入日志审核组件
const { Header, Sider, Content } = Layout;
const Backend = () => {
  const baseUrl = 'http://localhost:3000'
  const [layoutMode, setLayoutMode] = useState('mix');
  const [pathname, setPathname] = useState('/welcome');
  const [collapsed, setCollapsed] = useState(false);
  const [role, setRole] = useState(''); // 新增角色state
  const [nickname, setNickname] = useState(''); // ✅ 修改为昵称state
  // ✅欢迎页：时间、天气、待审核日志
  const [nowTime, setNowTime] = useState(new Date())
  const [weatherInfo, setWeatherInfo] = useState('福州：晴 26℃')
  const [pendingLogList, setPendingLogList] = useState([])
  const { token } = theme.useToken();

  // 审核接口函数
  const handleAuditApi = async (logId, auditStatus) => {
    const tip = auditStatus === 'pass' ? '确定审核通过？' : '确定驳回这条申请？'
    if (!window.confirm(tip)) return
    const token = localStorage.getItem('token')
    try {
      const res = await fetch(`${baseUrl}/api/logStatus/${logId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: auditStatus })
      })
      const json = await res.json()
      if (json.code === 200) {
        message.success(json.msg)
        getPendingLog() // 审核成功，刷新待审核列表
      } else {
        message.error(json.msg)
      }
    } catch (err) {
      message.error('审核请求失败')
      console.error(err)
    }
  }

  // 实时时钟
  useEffect(()=>{
    const timer = setInterval(()=>{
      setNowTime(new Date())
    },1000)
    return ()=> clearInterval(timer)
  },[])

  // 获取待审核日志（欢迎页加载）
  const getPendingLog = async ()=>{
    const token = localStorage.getItem('token')
    if(!token) return
    try{
      const res = await fetch(`${baseUrl}/api/logList?status=pending`,{
        headers:{ Authorization: `Bearer ${token}` }
      })
      const json = await res.json()
      if(json.code ===200){
        setPendingLogList(json.data)
      }
    }catch(err){
      console.log('获取待审核日志失败',err)
    }
  }

  useEffect(()=>{
    if(pathname === '/welcome'){
      getPendingLog()
    }
  },[pathname])

  // 挂载读取本地存储的昵称
  useEffect(() => {
    const name = localStorage.getItem('adminNickname')
    if (name) {
      setNickname(name)
    }
  }, [])

  // 登录鉴权：请求后端verify接口校验JWT
  useEffect(() => {
    let hasAlert = false; // 用普通变量防止重复弹窗，不用state
    const checkLogin = async () => {
      if (hasAlert) return
      const userToken = localStorage.getItem('token')
      console.log('本地token：', userToken)
      if (!userToken) {
        hasAlert = true
        const ok = window.confirm('提示：还没登录，请先登录！')
        if (ok) {
          window.location.href = '/login'
        }
        return
      }
      try {
        const res = await fetch(`${baseUrl}/api/verify`, {
          headers: {
            'Authorization': `Bearer ${userToken}`
          }
        })
        const json = await res.json()
        console.log('verify返回结果：', json)
        if (json.code !== 200) {
          console.log('触发401：', json.msg)
          hasAlert = true
          localStorage.removeItem('token')
          localStorage.removeItem('adminNickname')
          const ok = window.confirm(`登录超时：${json.msg}\n点击确定前往登录页`)
          if (ok) {
            window.location.href = '/login'
          }
        } else {
          setNickname(json.user.nickname) // ✅ 设置昵称
          localStorage.setItem('adminNickname', json.user.nickname)
          setRole(json.user.role) // 保存角色
        }
      } catch (err) {
        console.log('请求异常：', err)
        hasAlert = true
        const ok = window.confirm('网络异常，请重新登录')
        if (ok) {
          localStorage.removeItem('token')
          localStorage.removeItem('adminNickname')
          window.location.href = '/login'
        }
      }
    }
    // 页面加载立刻校验
    checkLogin()
    // 每60秒轮询一次
    const timer = setInterval(() => {
      checkLogin()
    }, 60000)
    // 组件销毁清除定时器
    return () => clearInterval(timer)
  }, [])

  // 退出登录函数
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('adminNickname') // ✅ 清除昵称
    setNickname('') // 清空页面昵称
    setRole('') //清空角色
    message.info('已退出登录')
    window.location.href = '/login'
  }

  // 菜单 ✅新增日志菜单
  const menuItems = [
    {
      key: '/welcome',
      icon: <SmileOutlined />,
      label: '欢迎',
    },
    {
      key: '/photo',
      icon: <NotificationOutlined />,
      label: '展示页管理',
    },
    {
      key: '/gameNav',
      icon: <AppstoreOutlined />,
      label: '游戏导航管理',
    },
    {
      key: '/notice',
      icon: <NotificationOutlined />,
      label: '游戏网站管理',
    },
    {
      key: '/lineChartOutlined',
      icon: <LineChartOutlined />,
      label: '新闻动态管理',
    },
    {
      key: '/adminLog',
      icon: <LineChartOutlined />,
      label: '内容审核日志',
    },
    {
      key: '/adminUser', // 修改key
      icon: <RedditOutlined />,
      label: '用户管理',
    },
  ];

  const renderContent = () => {
    switch (pathname) {
      case '/photo':
        return <PhotoTable />;
      case '/gameNav':
        return <GameNavTable />;
      case '/notice':
        return (
          <div
            style={{
              height: 500,
              overflow: 'auto',
              border: `1px solid ${token.colorBorderSecondary}`,
              borderRadius: token.borderRadius,
            }}
          >
            <Card title="游戏网站管理">
              <Space orientation="vertical" size={12} style={{ width: '100%' }}>
                <Space>
                  <span>layout 导航模式：</span>
                  <Segmented
                    value={layoutMode}
                    onChange={setLayoutMode}
                    options={[
                      { label: '侧栏 side', value: 'side' },
                      { label: '顶部 top', value: 'top' },
                      { label: '混合 mix', value: 'mix' },
                    ]}
                  />
                </Space>
              </Space>
              <div style={{ marginTop: 16 }}>
                当前配置：layout=<b>{layoutMode}</b>
              </div>
            </Card>
          </div>
        );
      case '/lineChartOutlined':
        return <Card>新闻动态管理页面</Card>;
      case '/adminUser': // 新增用户管理case
        return <AdminUserManage role={role} username={nickname}/>;
      case '/adminLog':
        return <AdminLog />
      default:
        // ==========欢迎页：左侧时间天气，右侧待审核日志==========
        return (
          <div style={{display:'flex', gap:'20px'}}>
            <Card style={{width:'35%'}} title="系统信息">
              <div style={{fontSize:22, margin:'12px 0'}}>
                当前时间：{nowTime.toLocaleString()}
              </div>
              <div style={{fontSize:18}}>
                {weatherInfo}
              </div>
            </Card>
            <Card style={{flex:1}} title="待审核操作日志">
              <div style={{maxHeight:450, overflow:'auto'}}>
                {pendingLogList.length ===0 ? (
                  <p>暂无待审核记录</p>
                ): (
                  pendingLogList.map(item=>(
                    <div key={item.id} style={{borderBottom:'1px solid #eee', padding:'10px 0'}}>
                      <p>模块：{item.module_name === 'gameNav' ? '游戏导航管理' : '图片管理'}</p>
                      <p>操作：{item.operate_type==='add'?'新增':item.operate_type==='edit'?'编辑':'删除'}</p>
                      <p>详情：{item.content}</p>
                      <p>操作人：{item.admin_username}</p>
                      {/* 只有超级管理员才显示审核按钮 */}
                      {role === 'admin' && (
                        <div style={{marginTop:8}}>
                          <Button type="primary" size="small" onClick={()=>handleAuditApi(item.id, 'pass')}>通过</Button>
                          <Button danger size="small" style={{marginLeft:8}} onClick={()=>handleAuditApi(item.id, 'reject')}>驳回</Button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        );
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 侧边栏 */}
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div style={{ height: 32, margin: 16, color: '#fff', textAlign: 'center' }}>完美页面后台</div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[pathname]}
          items={menuItems}
          onClick={({ key }) => setPathname(key)}
        />
      </Sider>
      <Layout>
        {/* 顶部头部 */}
        <Header style={{ background: '#fff', padding: '0 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space>
            <span>导航模式：</span>
            <Segmented
              value={layoutMode}
              onChange={setLayoutMode}
              options={[
                { label: '侧栏 side', value: 'side' },
                { label: '顶部 top', value: 'top' },
                { label: '混合 mix', value: 'mix' },
              ]}
            />
          </Space>
          {/* 头像区域，显示昵称 */}
          <Space>
            <InfoCircleFilled />
            <Avatar size="small" src="https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg"></Avatar>
            <span style={{ fontWeight: 500, marginLeft: 6 }}>{nickname}</span>
            <Button danger size="small" onClick={handleLogout}>退出登录</Button>
          </Space>
        </Header>
        {/* 主内容区 */}
        <Content style={{ margin: '16px' }}>
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};
export default Backend;
