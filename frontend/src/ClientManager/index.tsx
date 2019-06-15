import * as React from 'react';
import './style.less';
import { Button, Divider, Icon, Input, message, Popconfirm, Table, Tooltip } from 'antd';
import { useEffect, useState } from "react";
import axios from 'axios';
import ClientForm from './ClientForm';
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
    let request = axios.get('/api/client/')
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

const ClientManager = (props: any) => {
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
      title: 'Имя',
      dataIndex: 'first_name',
      key: 'first_name',
      ...getColumnSearchProps('first_name')
    },
    {
      title: 'Фамилия',
      dataIndex: 'last_name',
      key: 'last_name',
      ...getColumnSearchProps('last_name')
    },
    {
      title: 'Отчество',
      dataIndex: 'middle_name',
      key: 'middle_name',
      ...getColumnSearchProps('middle_name')
    },
    {
      title: 'Телефон',
      dataIndex: 'phone_number',
      key: 'phone_number',
      ...getColumnSearchProps('phone_number')
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
            <Popconfirm title={'Удалить клиента?'} onConfirm={() => deleteItem(rowItem.id)}>
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
    axios.delete(`/api/client/${id}/`, {
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
      <Tooltip placement={'left'} title={'Добавить клиента'}>
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
      className={'ClientManager'}
      size={'small'}
      style={{
        height: 'calc( 100% - 50px )',
        background: 'white'
      }}
      dataSource={Array.isArray(data) ? data.sort((a, b) => a.id - b.id) : undefined}
      columns={columns}
      loading={Array.isArray(data) && !loading ? undefined : true}
      bordered
      {...TABLE_STATIC_PROPS}
    />
    {editItem !== undefined && (
      <ClientForm
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
        onCancel={() => {
          setEditItem(undefined)
        }}
        data={
          typeof editItem === 'number'
            ? data.find((item: any) => item.id === editItem)
            : null
        }
      />
    )}
  </div>
};

export default ClientManager;