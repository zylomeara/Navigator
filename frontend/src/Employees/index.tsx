import * as React from 'react';
import { Table, Tabs } from "antd";
import { useEffect, useState } from "react";
import axios from 'axios';
import './style.less';

type Emp = 'courier' | 'manager';

let managerColumns = [
  {
    title: 'Id',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Логин',
    dataIndex: 'username',
    key: 'username',
  },
  {
    title: 'Имя',
    dataIndex: 'first_name',
    key: 'first_name',
  },
  {
    title: 'Фамилия',
    dataIndex: 'last_name',
    key: 'last_name',
  },
  {
    title: 'Номер телефона',
    dataIndex: 'phone_number',
    key: 'phone_number',
  },
  {
    title: 'Место работы',
    dataIndex: 'work_place',
    key: 'work_place',
  },
];

let courierColumns = [
  {
    title: 'Id',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Логин',
    dataIndex: 'username',
    key: 'username',
  },
  {
    title: 'Имя',
    dataIndex: 'first_name',
    key: 'first_name',
  },
  {
    title: 'Фамилия',
    dataIndex: 'last_name',
    key: 'last_name',
  },
  {
    title: 'Номер телефона',
    dataIndex: 'phone_number',
    key: 'phone_number',
  },
  {
    title: 'Транспорт',
    dataIndex: 'transport',
    key: 'transport',
  },
];

const Employees = (props: any) => {
  let [tab, setTab] = useState<Emp>('courier');
  let [couriers, setCouriers] = useState<undefined | any[]>();
  let [managers, setManagers] = useState<undefined | any[]>();
  let [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      axios.get('/account/courier/').then((res) => setCouriers(res.data)),
      axios.get('/account/manager/').then((res) => setManagers(res.data))
    ])
      .then(() => setLoading(false));
  }, []);

  return (
    <Tabs activeKey={tab} onChange={setTab} className={'Employees'} style={{background: 'white'}}>
      <Tabs.TabPane tab={'Курьеры'} key={'courier'}>
        <Table
          dataSource={managers}
          columns={managerColumns}
          loading={loading}
          size={'small'}
        />
      </Tabs.TabPane>
      <Tabs.TabPane tab={'Менеджеры'} key={'manager'}>
        <Table
          dataSource={couriers}
          columns={courierColumns}
          loading={loading}
          size={'small'}
        />
      </Tabs.TabPane>
    </Tabs>
  )
};

export default Employees;