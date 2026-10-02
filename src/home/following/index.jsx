import React, { useState, useEffect } from 'react';
import './index.css';
const Following = () => {
    const [followbing, setFollowbing] = useState('');
    const [followbinglabel, setFollowbinglabel] = useState(0);
    const [followtransformY, setFollowtransformY] = useState(0);
    const [displayImageArray, setDisplayImageArray] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [originList, setOriginList] = useState([]); // 原始后端数据
    const baseUrl = 'http://localhost:3000';

    // 请求后端photo_info列表
    const getPhotoData = async () => {
        try {
            const res = await fetch(`${baseUrl}/api/photoList?page=1&pageSize=100`);
            const json = await res.json();
            if (json.code === 200) {
                // 后端返回数据，url是完整大图地址，url2是展示图
                const list = json.data.map(item => ({
                    img: item.url,
                    path: item.url2,
                    title: item.small_title,
                    link: item.link || ''
                }));
                setOriginList(list);
                // 构造循环数组，和你原来逻辑一致
                const newArray = [...list];
                for (let i = 0; i < list.length - 1; i++) {
                    newArray.push(...list);
                }
                setDisplayImageArray(newArray);
                if(list.length > 0){
                    setFollowbing(list[0].path);
                }
            }
        } catch (err) {
            console.error('获取轮播图片失败', err);
        }
    }

    useEffect(() => {
        getPhotoData();
    }, []);

    const followindex = (index) => {
        setFollowbinglabel(index);
        setFollowbing(displayImageArray[index]?.path);
        setFollowtransformY(index * -108);
        setSelectedIndex(index);
    };

    const ChangeFollow = (step) => {
        let newIndex = followbinglabel + step;
        const arrayLength = displayImageArray.length;
        const realLen = originList.length;
        if(realLen === 0) return;

        if (newIndex >= arrayLength - realLen + 1) {
            newIndex = (newIndex - (arrayLength - realLen)) % realLen;
        }
        if (newIndex < 0) {
            newIndex = arrayLength + newIndex;
        }
        followindex(newIndex);
    };

    // 自动轮播定时器
    useEffect(() => {
        if(originList.length === 0) return;
        const timer = setInterval(() => {
            ChangeFollow(1);
        }, 3000);
        return () => {
            clearInterval(timer);
        };
    }, [followbinglabel, originList]);

    // 当前选中项的链接
    const currentLink = displayImageArray[followbinglabel]?.link;

    return (
        <div className='Following'>
            <div className='newfollowing'>
                <img className='newfollowing-img' src='./title/title1.png' alt="title" />
                <div className='newCarousel'>
                    {
                        displayImageArray.map((_, index) => {
                            const isSelected = index === selectedIndex;
                            return (
                                <div
                                    className={`leftnewCarousel ${isSelected ? 'leftnewCarousel-item-selected' : ''}`}
                                    key={`leftnewCarousel${index}`}
                                    onClick={() => ChangeFollow(1)}
                                    style={{
                                        transform: `translateY(${followtransformY}px)`,
                                        transition: 'transform 0.5s ease'
                                    }}
                                >
                                    <img className='leftnewCarouselimg' src={displayImageArray[index]?.img} alt="" />
                                    <p className='leftnewCarouselp'>{displayImageArray[index]?.title}</p>
                                </div>
                            )
                        })
                    }
                </div>
                {/* 大图点击跳转，如果link存在就包a标签 */}
                {currentLink ? (
                    <a href={currentLink} target="_blank" rel="noreferrer">
                        <img className='rightnewCarousel' src={followbing} alt="主图" />
                    </a>
                ) : (
                    <img className='rightnewCarousel' src={followbing} alt="主图" />
                )}
            </div>
        </div>
    )
};
export default Following;
