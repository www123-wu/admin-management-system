// TimeFormat.jsx
import React from 'react'

/**
 * UTC时间字符串转北京时间组件
 * @param {string} utcStr 后端返回的UTC时间，例如：2026-09-24T11:30:51.000Z
 * @returns {JSX.Element} 格式化后的时间文本
 */
const TimeFormat = ({ utcStr }) => {
  if (!utcStr) return <span>--</span>

  const date = new Date(utcStr)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  const formatTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  return <span>{formatTime}</span>
}

export default TimeFormat
