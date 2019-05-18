import * as React from 'react';
import { Breadcrumb, Layout, Menu, Icon, } from "antd";

const {
  Header,
  Content,
  Footer,
  Sider
} = Layout;

const { SubMenu } = Menu;

const Manager = (props: any) => {

  return (
    <Layout>
      <Sider width={200} style={{ background: '#fff' }}>
        <Menu
          mode="inline"
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          style={{ height: '100%', borderRight: 0 }}
        >
          <Menu.Item key="1">Клиенты</Menu.Item>
          <Menu.Item key="2">Заказы</Menu.Item>
          <Menu.Item key="3">Перевозки</Menu.Item>
          <Menu.Item key="4">Посылки</Menu.Item>
        </Menu>
      </Sider>

      <Content style={{ padding: '0 50px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
          <Breadcrumb.Item>App</Breadcrumb.Item>
        </Breadcrumb>
        <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>Hello manager</div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
    </Layout>
  )
};

export default Manager;