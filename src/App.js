import React, { Component } from 'react';
import { Layout } from 'antd';
import { BrowserRouter } from 'react-router-dom';
import CustomMenu from "./components/custommenu";
import ContentMain from "./components/contentmain";
import './App.css';

const { Sider, Content } = Layout;
let screenHeight= window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;


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
                      {/*<Footer>Footer</Footer>*/}
                  </Layout>
              </Layout>
          </BrowserRouter>
      </div>
    );
  }
}

export default App;
