import React, { useState, useEffect } from 'react'
import './index.css'

const baseUrl = 'http://localhost:3000'

const GameMenu = ({ className, isHeader = true }) => {
  const [menuData, setMenuData] = useState([])

  const getMenuData = async () => {
    try {
      // 前台公开接口：无需token，仅返回已审核通过(status=pass)的数据
      const res = await fetch(`${baseUrl}/api/gameNav?page=1&pageSize=999`)
      const json = await res.json()
      if (json.code === 200) {
        setMenuData(json.data || [])
      } else {
        console.error('菜单加载失败：', json.msg)
      }
    } catch (err) {
      console.error('菜单加载失败', err)
    }
  }

  useEffect(() => {
    getMenuData()
  }, [])

  // 映射分类名称对应css class
  const getClassByCategory = (cateName) => {
    if (cateName === '客户端游戏') return 'box_listgame_p'
    if (cateName === '手机游戏') return 'box_listgame_pp'
    if (cateName === '游戏平台') return 'box_listgame_ppp'
    return 'box_listgame_p'
  }

  // 去重拿到所有分类
  const categoryList = [...new Map(menuData.map(item => [item.category, item.category])).values()]

  return (
    <div className={`${isHeader ? "box_list" : "box_list_static"} ${className || ''}`}>
      <div className='box_listgame'>
        <div className='box_listgame_title'>
          {
            categoryList.map(categoryName => {
              const gameList = menuData.filter(item => item.category === categoryName)
              const currentClass = getClassByCategory(categoryName)
              return (
                <div key={categoryName} className={currentClass}>
                  <div className='box_categoryName'>
                    <span>{categoryName}</span>
                  </div>
                  <ul>
                    {gameList.map(item => (
                      <li key={item.id}>
                        <a href={item.link || '#'}>{item.game_name}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}

export default GameMenu
