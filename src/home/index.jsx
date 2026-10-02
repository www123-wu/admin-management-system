import React, { Component } from 'react'
import { Layout, Flex } from 'antd';
import Head from './header';
import Middle from "./middle"
import Following from './following';
import Business from './business';
import Popular from './popular';
import './index.css';

const { Header, Footer, Content } = Layout;
const Home = ()=> {
  
    return (
    
        <Flex gap="middle" wrap="wrap">
        <Layout >
        <Content><Middle/></Content>
         <Header><Head/></Header>
          <Following/>
          <Business/>
          <Popular/>
        </Layout>
        
      </Flex>
    )
}

export default Home;