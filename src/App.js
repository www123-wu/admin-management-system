import './App.css';
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from '../src/home/index'
import Backend from '../src/features/Backend/index'
import Middebackend from '../src/features/Backend/middlebackend'
import Login from './features/Backend/login/login'
import { ConfigProvider } from 'antd';
function App() {

    return (
        <ConfigProvider theme={{ token: { colorPrimary: '#00b96b' } }}>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/backend' element={<Backend />} />
                <Route path='/backend_middebackend' element={<Middebackend />} />
                <Route path='/login' element={<Login/>} />
            </Routes>
        </ConfigProvider>

    )

}

export default App;
