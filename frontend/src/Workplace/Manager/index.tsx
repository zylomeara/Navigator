import * as React from 'react';
import { Breadcrumb, Layout, Menu, Icon, Table, Tabs } from "antd";
import { useState } from "react";

import ClientManager from '../../ClientManager';
import OrderManager from '../../OrderManager';
import TransportationManager from "../../TransportationManager";
import TaskManager from "../../TaskManager";

const {
  Header,
  Content,
  Footer,
  Sider
} = Layout;

const { SubMenu } = Menu;

type Tabs = 'clients' | 'orders' | 'transportations' | 'tasks'

const Manager = (props: any) => {
  let [tab, setTab] = useState<Tabs>('clients');

  return (
    <Layout style={{height: '100%'}}>
      <Sider width={200} style={{ background: '#fff' }}>
        <Menu
          mode="inline"
          onSelect={(obj) => {setTab((obj.key as Tabs))}}
          selectedKeys={[tab]}
          style={{ height: '100%' }}
        >
          <Menu.Item key="clients">Клиенты</Menu.Item>
          <Menu.Item key="orders">Заказы</Menu.Item>
          <Menu.Item key="transportations">Перевозки</Menu.Item>
          <Menu.Item key="tasks">Задачи</Menu.Item>
        </Menu>
      </Sider>

      {/*<Content style={{ padding: '0 50px' }}>*/}
      {/*  <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>Hello manager</div>*/}
      {/*</Content>*/}
      <Tabs activeKey={tab} renderTabBar={() => <></>}>
        <Tabs.TabPane key={'clients'}>
          <ClientManager />
          {/*1*/}
        </Tabs.TabPane>
        <Tabs.TabPane key={'orders'}>
          <OrderManager />
          {/*1*/}
        </Tabs.TabPane>
        <Tabs.TabPane key={'transportations'}>
          <TransportationManager />
          {/*1*/}
        </Tabs.TabPane>
        <Tabs.TabPane key={'tasks'}>
          <TaskManager />
          {/*1*/}
        </Tabs.TabPane>
      </Tabs>

    </Layout>
  )
};

export default Manager;