import React, { useState, useEffect, useRef } from 'react';
import "./index.css";

const Img = () => {
  const [imageInfoArray, setImageInfoArray] = useState([]);
  const [loading, setLoading] = useState(true);

  const [bingIamge, setBingIamege] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [elementPosition, setElementPosition] = useState(0);
  const photoElementRef = useRef(null);
  const baseUrl = 'http://localhost:3000';

  // 获取后端轮播数据
  const getPhotoData = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/photoList?page=1&pageSize=100`);
      const json = await res.json();
      if (json.code === 200) {
        setImageInfoArray(json.data);
        if(json.data.length > 0){
          setBingIamege(json.data[0].url);
        }
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPhotoData();
  }, []);

  const updateImageAndIndex = (index) => {
    if(!imageInfoArray[index]) return;
    setCurrentIndex(index);
    setBingIamege(imageInfoArray[index].url);
    if(index > 8){
      setElementPosition(-712)
    }else{
      setElementPosition(index * -89);
    }
  };

  const handleCarouselChange = (index) => {
    updateImageAndIndex(index);
  };

  const offsetimg = () => {
    const nextIndex = (currentIndex + 1) % imageInfoArray.length;
    updateImageAndIndex(nextIndex);
  };

  useEffect(() => {
    if(imageInfoArray.length === 0) return;
    const intervalId = setInterval(() => {
      offsetimg();
    }, 4000);
    return () => clearInterval(intervalId);
  }, [currentIndex, imageInfoArray]);

  // 上一张
  const prevImage = () => {
    const prevIndex = currentIndex === 0 ? imageInfoArray.length - 1 : currentIndex - 1;
    updateImageAndIndex(prevIndex);
  };

  // 下一张
  const goToNext = () => {
    const nextIndex = (currentIndex + 1) % imageInfoArray.length;
    updateImageAndIndex(nextIndex);
  };

  if(loading) return <div>加载中...</div>
  if(imageInfoArray.length === 0) return <div>暂无轮播图片，请去后台上传照片</div>

  return (
    <div className='maddle-whole'>
      <div className='maddle-img'>
        <img className='maddimg' src={imageInfoArray[currentIndex]?.url2} alt="轮播大图"/>
        <div className="image-text-container">
          <img src={imageInfoArray[currentIndex]?.url} alt="小标题图"/>
          <p className="main-image-p">{imageInfoArray[currentIndex]?.big_title}</p>
          <span className="main-image-title">{imageInfoArray[currentIndex]?.small_title}</span>
          <div className='image-text-containerline'></div>
          <span className="main-image-introduce">{imageInfoArray[currentIndex]?.description}</span>
          <a className='image-text-container-a'href={imageInfoArray[currentIndex]?.link}></a>
        </div>

  

        <button className="prev-btn" onClick={prevImage}></button>
        <div className='madding-bar' ref={photoElementRef}>
  <div className='w1' style={{ transform: `translate(${elementPosition}px)` }}>
    {imageInfoArray.map((image, index) => {
      return (
        <li className='image-container' key={index}>
          <img
            src={image.url}
            alt={`Image ${index + 1}`}
            className={`madding-barimg ${currentIndex === index ? 'active' : ''}`}
            onClick={() => handleCarouselChange(index)}
          />
        </li>
      );
    })}
  </div>
</div>
        <button className="next-btn" onClick={goToNext}></button>
      </div>
      <div className='middle-bg-wrap'>
        <img className='belowimg' src='./bg34.jpg'/>
        <img  className='video-maskimg'src='./video_mask.png'></img>
        <div className='line'></div>
      </div>
    </div>
  );
};
export default Img;
