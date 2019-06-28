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
              <Layout>
                  <Sider style={{height:screenHeight}}>
                      <CustomMenu/>
                  </Sider>
                  <Layout>
                      {/*<Header>Header</Header>*/}
                      <Content style={{height:screenHeight}}>
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
