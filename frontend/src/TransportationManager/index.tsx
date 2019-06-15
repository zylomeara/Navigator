import * as React from 'react';
// import './style.less';
import { Button, Divider, Icon, message, Popconfirm, Table, Tooltip, Input } from 'antd';
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
    let requestTransportation = axios.get('/api/transportation/');
    let requestOrder = axios.get('/api/order/');
    Promise.all([requestTransportation, requestOrder])
      .then(([requestTransportation, requestOrder]) => {
        let transportations = requestTransportation.data;
        let orders = requestOrder.data;

        transportations = transportations.map(transportation => {
          let foundOrder = orders.find(order => transportation.order === order.id);

          transportation.order_display = `${foundOrder.id}: ${foundOrder.status ? 'Выполнен' : 'В процессе'}`;

          return transportation
        });
        setResult(transportations);
      })
      .catch((error) => {
        setResult(error);
        message.error(error.message);
      });
    setResult(requestTransportation);
  }, [...deps]);

  return result;
}

const TransportationManager = (props: any) => {
  let [forceUpdate, setForceUpdate] = useState<boolean>(false);
  let data = useAPITableData([forceUpdate]);
  let [editItem, setEditItem] = useState<undefined | null | number>();
  let [loading, setLoading] = useState<boolean>(false);
  let [itemRoute, setItemRoute] = useState<undefined | any>(false);

  let [searchText, setSearchText] = useState<string>('');

  const columns = [
  {
    title: 'Id',
    dataIndex: 'id',
    key: 'id',
    ...getColumnSearchProps('id')
  },
  {
    title: 'Посылка',
    dataIndex: 'parcel',
    key: 'parcel',
    ...getColumnSearchProps('parcel')
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
    dataIndex: 'order_display',
    key: 'order_display',
    ...getColumnSearchProps('order_display')
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

  function handleSearch(selectedKeys, confirm) {
    confirm();
    setSearchText(selectedKeys[0]);
  }

  function handleReset(clearFilters) {
    clearFilters();
    setSearchText('');
  }


  function getColumnSearchProps(dataIndex) {
    return ({
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            // ref={node => {
            //   this.searchInput = node;
            // }}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => handleSearch(selectedKeys, confirm)}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm)}
            icon="search"
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            Найти
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Сбросить
          </Button>
        </div>
      ),
      filterIcon: filtered => (
        <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }}/>
      ),
      onFilter: (value, record) =>
        record[dataIndex]
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase()),
      // onFilterDropdownVisibleChange: visible => {
      //   if (visible) {
      //     setTimeout(() => this.searchInput.select());
      //   }
      // },
      // render: text => (
      //   <Highlighter
      //     highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
      //     searchWords={[this.state.searchText]}
      //     autoEscape
      //     textToHighlight={text.toString()}
      //   />
      // ),
    });
  }

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