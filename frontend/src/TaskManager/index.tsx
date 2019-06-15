import * as React from 'react';
// import './style.less';
import { Button, Divider, Icon, message, Popconfirm, Table, Tooltip, Input } from 'antd';
import { useEffect, useState } from "react";
import axios from 'axios';
import TaskForm from './TaskForm';
import { getCookie } from "../UI/utils";



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
    let requestTask = axios.get('/api/task/');
    let requestTransportation = axios.get('/api/transportation/');
    let requestCourier = axios.get('/account/courier/');
    Promise.all([requestTask, requestTransportation, requestCourier])
      .then(([requestTask, requestTransportation, requestCourier]) => {
        let tasks = requestTask.data;
        let transportations = requestTransportation.data;
        let couriers = requestCourier.data;

        tasks = tasks.map(task => {
          let foundTransportation = transportations.find(transportation => transportation.id === task.transportation)
          let foundCourier = couriers.find(courier => courier.id === task.courier)

          task.transportation_display = `${foundTransportation.id}: ${foundTransportation.status ? 'Выполнен' : 'В процессе'}, ${foundTransportation.parcel}`
          task.courier_display = `${foundCourier.id}: ${foundCourier.username} (${foundCourier.first_name} ${foundCourier.last_name})`

          return task;
        })
        setResult(tasks);
      })
      .catch((error) => {
        setResult(error);
        message.error(error.message);
      });
    setResult(requestTask);
  }, [...deps]);

  return result;
}

const TaskManager = (props: any) => {
  let [forceUpdate, setForceUpdate] = useState<boolean>(false);
  let data = useAPITableData([forceUpdate]);
  let [editItem, setEditItem] = useState<undefined | null | number>();
  let [loading, setLoading] = useState<boolean>(false);

  let [searchText, setSearchText] = useState<string>('');

  const columns = [
  {
    title: 'Id',
    dataIndex: 'id',
    key: 'id',
    ...getColumnSearchProps('id')
  },
  {
    title: 'Статус',
    dataIndex: 'status',
    key: 'status',
    render: (text, rowItem) => {

      return rowItem.status === true
        ? 'Выполнен'
        : 'В процессе'
    }
  },
  {
    title: 'Перевозка',
    dataIndex: 'transportation_display',
    key: 'transportation_display',
    ...getColumnSearchProps('transportation_display')
  },
  {
    title: 'Курьер',
    dataIndex: 'courier_display',
    key: 'courier_display',
    ...getColumnSearchProps('courier_display')
  },
  {
    key: 'actions',
    title: 'Действия',
    width: 100,
    align: 'center',
    // fixed: 'right',
    render: (text, rowItem) => {
      return <>
        <Tooltip title={'Редактировать'} placement={'bottom'}>
          <Icon
            type={'edit'}
            style={{ cursor: 'pointer' }}
            onClick={() => setEditItem(rowItem.id)}
          />
        </Tooltip>
        <Divider type={'vertical'}/>
        <Tooltip title={'Удалить'} placement={'bottom'}>
          <Popconfirm title={'Удалить задачу?'} onConfirm={() => deleteItem(rowItem.id)}>
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
    axios.delete(`/api/task/${id}/`, {
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
      className={'TaskManager'}
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
      <TaskForm
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
  </div>
};

export default TaskManager;