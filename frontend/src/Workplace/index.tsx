import * as React from 'react';
import './style.less'
import {
  Layout, Tabs,
} from 'antd';
import Courier from './Courier';
import Manager from './Manager';
import HeaderComponent from './Header';
import { useState } from "react";

interface Props {
  position: 'courier' | 'manager' | undefined | 'admin'
}

export type MainTabs = 'workplace' | 'person_data' | 'employees';

const Workplace = (props: Props) => {
  let [tab, setTab] = useState<MainTabs>('workplace');

  return (
    <Layout className="Workplace-layout">
      <HeaderComponent
        tab={tab}
        setTab={setTab}
      />
      <Tabs activeKey={tab} renderTabBar={() => <></>}>
        <Tabs.TabPane key={'workplace'}>
          {props.position === 'courier' && (
            <Courier/>
          )}
          {props.position === 'manager' && (
            <Manager/>
          )}
        </Tabs.TabPane>
        <Tabs.TabPane key={'person_data'}>
          Personal data
        </Tabs.TabPane>
        <Tabs.TabPane key={'employees'}>
          List employees
        </Tabs.TabPane>
      </Tabs>
    </Layout>
  )
};

export default Workplace;