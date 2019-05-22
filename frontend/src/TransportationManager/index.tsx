import * as React from 'react';
// import './style.less';
import { Button, Divider, Icon, message, Popconfirm, Table, Tooltip } from 'antd';
import { useEffect, useState } from "react";
import axios from 'axios';
import TransportationForm from './TransportationForm';
import { getCookie } from "../UI/utils";
import TransportationRoute from "./TransportationRoute";



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

function useAPITableData(deps: any[]) {
  let [result, setResult] = useState();

  useEffect(() => {
    let request = axios.get('/api/transportation/')
      .then((res) => {
        setResult(res.data)
      })
      .catch((error) => {
        setResult(error);
        message.error(error.message);
      });
    setResult(request);
  }, [...deps]);

  return result;
}

const TransportationManager = (props: any) => {
  let [forceUpdate, setForceUpdate] = useState<boolean>(false);
  let data = useAPITableData([forceUpdate]);
  let [editItem, setEditItem] = useState<undefined | null | number>();
  let [loading, setLoading] = useState<boolean>(false);
  let [itemRoute, setItemRoute] = useState<undefined | any>(false);

  const columns = [
  {
    title: 'Id',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Посылка',
    dataIndex: 'parcel',
    key: 'parcel'
  },
  {
    title: 'Начало',
    dataIndex: 'start_location',
    key: 'start_location',
    render: (text, obj) => {
      let coords = obj.start_location.coordinates
        ? obj.start_location.coordinates.join(', ')
        // ? '[' + obj.start_location.coordinates.join(', ') + ']'
        : null;

      return coords
    }
  },
  {
    title: 'Конец',
    dataIndex: 'end_location',
    key: 'end_location',
    render: (text, obj) => {
      let coords = obj.end_location.coordinates
        ? obj.end_location.coordinates.join(', ')
        // ? '[' + obj.end_location.coordinates.join(', ') + ']'
        : null;

      return coords
    }
  },
  {
    title: 'Заказ',
    dataIndex: 'order',
    key: 'order',
  },
  {
    key: 'actions',
    title: 'Действия',
    width: 100,
    align: 'center',
    // fixed: 'right',
    render: (text, rowItem) => {
      return <>
        <Tooltip title={'Показать маршрут'} placement={'bottom'}>
          <Icon
            type={'compass'}
            style={{ cursor: 'pointer' }}
            onClick={() => setItemRoute([rowItem.start_location, rowItem.end_location])}
          />
        </Tooltip>
        <Divider type={'vertical'}/>
        <Tooltip title={'Редактировать'} placement={'bottom'}>
          <Icon
            type={'edit'}
            style={{ cursor: 'pointer' }}
            onClick={() => setEditItem(rowItem.id)}
          />
        </Tooltip>
        <Divider type={'vertical'}/>
        <Tooltip title={'Удалить'} placement={'bottom'}>
          <Popconfirm title={'Удалить заказ?'} onConfirm={() => deleteItem(rowItem.id)}>
            <Icon type={'delete'} style={{ cursor: 'pointer' }}/>
          </Popconfirm>
        </Tooltip>
      </>
    }
  }
];

  function deleteItem(id: number) {
    setLoading(true);
    let csrftoken = getCookie('csrftoken');
    axios.delete(`/api/transportation/${id}/`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken || '',
      },
    })
      .then(() => {
        refresh();
        setLoading(false)
      })
      .catch((error) => {
        setLoading(false);
        message.error(error.message);
        console.error(error);
      })
  }

  function refresh() {
    setForceUpdate(!forceUpdate);
  }

  return <div style={{ height: '100%' }}>
    <div className="controls" style={{ textAlign: 'right' }}>
      <Tooltip placement={'left'} title={'Добавить заказ'}>
        <Button
          onClick={() => setEditItem(null)}
          style={{ margin: '8px' }}>
          <Icon type={'plus'}/>
        </Button>
      </Tooltip>
      <Tooltip placement={'left'} title={'Обновить'}>
        <Button
          onClick={refresh}
          style={{ margin: '8px' }}>
          <Icon type={'reload'}/>
        </Button>
      </Tooltip>
    </div>
    <Table
      className={'TransportationManager'}
      size={'small'}
      style={{
        height: 'calc( 100% - 50px )',
        background: 'white'
      }}
      dataSource={Array.isArray(data) ? data.sort((a,b) => a.id - b.id) : undefined}
      columns={columns}
      loading={Array.isArray(data) && !loading ? undefined : true}
      bordered
      {...TABLE_STATIC_PROPS}
    />
    {editItem !== undefined && (
      <TransportationForm
        mode={
          typeof editItem === 'number'
            ? 'edit'
            : 'create'
        }
        onSubmit={() => {
          message.success('Сохранено');
          setEditItem(undefined);
          refresh()
        }}
        onCancel={() => {setEditItem(undefined)}}
        data={
          typeof editItem === 'number'
            ? data.find((item: any) => item.id === editItem)
            : null
        }
      />
    )}
    <TransportationRoute
      geoms={itemRoute}
      onOk={() => setItemRoute(undefined)}
      onCancel={() => setItemRoute(undefined)}
    />
  </div>
};

export default TransportationManager;