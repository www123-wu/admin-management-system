import React, { useState } from 'react'
import './login.css'
const Login = () => {
  const baseUrl = 'http://localhost:3000'
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const handleLogin = async () => {
    if(!username.trim()){
      alert('请输入账号')
      return
    }
    if(!password.trim()){
      alert('请输入密码')
      return
    }
    setLoading(true)
    try{
      const res = await fetch(`${baseUrl}/api/login`,{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body: JSON.stringify({username,password})
      })
      const json = await res.json()
      if(json.code === 200){
        alert('登录成功！')
        // 保存token、昵称、账号
        localStorage.setItem('token', json.token)
        localStorage.setItem('adminNickname', json.user.nickname)
        localStorage.setItem('adminUsername', json.user.username)
        // 跳转到后台首页
        window.location.href = '/backend'
      }else{
        alert(json.msg)
      }
    }catch(err){
      alert('请求失败，请检查后端服务')
      console.log(err)
    }finally{
      setLoading(false)
    }
  }
  return (
    <div className="login-wrap">
      <div className="login-box">
        <h2>后台管理登录</h2>
        <div className="input-item">
          <label>账号</label>
          <input 
            value={username}
            onChange={(e)=>setUsername(e.target.value)}
            placeholder="请输入账号"
          />
        </div>
        <div className="input-item">
          <label>密码</label>
          <input 
            type="password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            placeholder="请输入密码"
          />
        </div>
        <button onClick={handleLogin} disabled={loading} className="login-btn">
          {loading ? '登录中...' : '登录'}
        </button>
      </div>
    </div>
  )
}
export default Login
