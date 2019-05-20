import * as React from 'react';
import './style.less';
import { message, Table } from 'antd';
import { useEffect, useState } from "react";
import axios from 'axios';

const columns = [
  {
    title: 'Id',
    dataIndex: 'id',
    key: 'id',
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
    title: 'Отчество',
    dataIndex: 'middle_name',
    key: 'middle_name',
  },
  {
    title: 'Телефон',
    dataIndex: 'phone_number',
    key: 'phone_number',
  },
];

const TABLE_STATIC_PROPS = {
  rowKey: 'id',
  // scroll: { x: true, y: true },
  pagination: {
    pageSizeOptions: ['10', '30', '60'],
    pageSize: 10,
    // showQuickJumper: true,
    showSizeChanger: true,
    showTotal: (total: number) => `Всего: ${total}`,
  },
};

function useAPITableData() {
  let [result, setResult] = useState();

  useEffect(() => {
    let request = axios.get('/api/client/')
      .then((res) => {
        setResult(res.data)
      })
      .catch((error) => {
        setResult(error);
        message.error(error.message);
      });
    setResult(request);
  }, []);

  return result;
}

const ClientManager = (props: any) => {
  let data = useAPITableData();

  return <div style={{height: '100%'}}>
    <Table
      className={'ClientManager'}
      size={'small'}
      style={{
        // height: '100%',
        // background: 'white'
      }}
      dataSource={Array.isArray(data) ? data : undefined}
      columns={columns}
      loading={Array.isArray(data) ? undefined : true}
      bordered
      {...TABLE_STATIC_PROPS}
    />
  </div>
};

export default ClientManager;