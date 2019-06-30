import React, { Component } from 'react';
import { Layout } from 'antd';
import { BrowserRouter } from 'react-router-dom';
import CustomMenu from "./components/custommenu";
import ContentMain from "./components/contentmain";
import './App.css';

const { Sider, Content, Footer} = Layout;


class App extends Component {
  render() {
    return (
      <div>
          <BrowserRouter>
              <Layout style={{ minHeight: '100vh' }}>
                  <Sider>
                      <CustomMenu/>
                  </Sider>
                  <Layout>
                      {/*<Header>Header</Header>*/}
                      <Content>
                          <ContentMain/>
                      </Content>
                      <Footer style={{ textAlign: 'center' }}>DBS Lab03 ©2019 Created by XZQ</Footer>
                  </Layout>
              </Layout>
          </BrowserRouter>
      </div>
    );
  }
}

export default App;
