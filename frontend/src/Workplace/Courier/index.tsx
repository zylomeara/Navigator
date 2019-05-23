import * as React from 'react';
import { Breadcrumb, Icon, Layout, Menu, Tabs } from "antd";
import ClientManager from "../../ClientManager";
import OrderManager from "../../OrderManager";
import TransportationManager from "../../TransportationManager";
import TaskManager from "../../TaskManager";
import { useState } from "react";

const {
  Header,
  Content,
  Footer,
  Sider
} = Layout;

type Tabs = 'transportations' | 'tasks'

const Courier = (props: any) => {
  let [tab, setTab] = useState<Tabs>('tasks');

  return (
<Layout style={{height: '100%'}}>
      <Sider width={200} style={{ background: '#fff' }}>
        <Menu
          mode="inline"
          onSelect={(obj) => {setTab((obj.key as Tabs))}}
          selectedKeys={[tab]}
          style={{ height: '100%' }}
        >
          <Menu.Item key="tasks"><Icon type={'solution'}/>Задачи</Menu.Item>
          <Menu.Item key="transportations"><Icon type={'car'}/>Перевозки</Menu.Item>
        </Menu>
      </Sider>

      {/*<Content style={{ padding: '0 50px' }}>*/}
      {/*  <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>Hello manager</div>*/}
      {/*</Content>*/}
      <Tabs activeKey={tab} renderTabBar={() => <></>}>
        <Tabs.TabPane key={'transportations'}>
          <TransportationManager />
          {/*1*/}
        </Tabs.TabPane>
        <Tabs.TabPane key={'tasks'}>
          <TaskManager />
          {/*1*/}
        </Tabs.TabPane>
      </Tabs>

    </Layout>  )
};

export default Courier;