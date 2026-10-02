import React, { useState, useEffect } from 'react'
import "./index.css"
import GameMenu from '../header/GameMenu'

const Popular = () => {
  const [imageInfoArray, setImageInfoArray] = useState([])
  const baseUrl = 'http://localhost:3000'

  const getPhotoData = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/photoList?page=1&pageSize=9`)
      const data = await res.json()
      // console.log('后端完整返回：', data)
      // ✅ 直接取 data.data，因为后端data就是数组
      setImageInfoArray(data.data || [])
    } catch (err) {
      // console.error('获取图片数据失败：', err)
    }
  }

  useEffect(() => {
    getPhotoData()
  }, [])

  const showList = imageInfoArray.slice(0,9)
  return (
    <div className='popular-all'>
        <img src='./title4.png' className='pop-title' alt="title"></img>
        <div className='pop-wrap'>
          {
            showList.map((item, index) => (
              <div className='pop-item' key={index}>
                <a href='#'> 
                  {/* 注意：后端字段是 item.url */}
                  <img className='pop-img1' src={item.url2} alt={item.small_title} />
                </a>
                <div className='pop-item-title'>
                  {/* 第二张图 item.url2 */}
                  <img src={item.url} alt="" />
                  <div className='pop-item-title-all'>
                    <span className='pop-item-title-span'>{item.big_title}</span>
                    <p className='pop-item-title-p'>{item.small_title}</p>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
        <GameMenu  className='GameMenu2'/>
        <div className='pop-sq'>
          <img src='./popsq.png' alt="" />
        </div>
    </div>
  )
}
export default Popular;
