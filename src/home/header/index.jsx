import React, { useState, useEffect, useRef } from 'react'
import './index.css'
import GameMenu from './GameMenu' // 引入游戏菜单组件
const Head = () => {
  const [showModal, setShowModal] = useState(false);
  const boxRef = useRef(null);

  // 点击菜单外部关闭弹窗
  const handleClickOutside = (e) => {
    if (boxRef.current && !boxRef.current.contains(e.target)) {
      setShowModal(false)
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const openModal = (e) => {
    e.stopPropagation();
    setShowModal(!showModal);
  }

  return (
    <div className='box_top'>
      <div className='bo-x' id='box_id'>
        <img className='box_top_logo' src='/logo.png' alt="logo" />
        <div className='head-navigation'>
          <ul className='box-ul'>
            <li><a href="#">首页</a></li>
            <li ref={boxRef}>
              <a id='clickOpen' onClick={openModal} >游戏</a>
              {/* 头部下拉弹窗：mode="popup" */}
              {showModal && <GameMenu mode="popup" />}
            </li>
            <li><a href="#">新闻</a></li>
            <li><a href="#">自助服务</a></li>
            <li><a href="#">联系我们</a></li>
            <li><a href="#">集团</a></li>
            <li className='box-check-li'>
              <a className='on'>中</a>
              /
              <a href="#">EN</a>
              /
              <a style={{ width: '60px' }} href="#">한글</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
export default Head
