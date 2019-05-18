import * as React from 'react';
import './style.less';
import { Breadcrumb, Layout, Menu, Row, Col, Button, message, Modal } from "antd";
import axios from 'axios';


const {
  Header,
  Content,
  Footer
} = Layout;

interface Props {
  tab: import('../').MainTabs
  setTab(tab: import('../').MainTabs): void;
}

const HeaderComponent = (props: Props) => {
  function showConfirm() {
    Modal.confirm({
      title: 'Выйти из учетной записи?',
      content: 'Вы действительно хотите выйти из учетной записи? Все несохраненные данные будут утеряны',
      onOk() {
        return axios.get('/account/logout/').then(() => location.reload());
      },
      onCancel() {
      },
    });
  }

  return (
    <Header className={'Workplace-Header'}>
      <Row>
        <Col span={3}>
          <div className="logo">
            <img src="/media/images/2.png" alt="" style={{width: '100%', height: '100%'}}/>
          </div>
        </Col>
        <Col span={19}>

          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['2']}
            style={{ lineHeight: '64px' }}
            onSelect={(obj) => props.setTab((obj.key as Props['tab']))}
            // onSelect={({ item, key, keyPath, selectedKeys, domEvent }) => console.log()}
            selectedKeys={[props.tab]}
          >
            <Menu.Item key="workplace">Рабочее место</Menu.Item>
            <Menu.Item key="person_data">Личные данные</Menu.Item>
            <Menu.Item key="employees">Сотрудники</Menu.Item>
          </Menu>
        </Col>
        <Col span={2}>
          <Button
            type={'link'}
            onClick={showConfirm}>
            Выход
          </Button>
        </Col>
      </Row>
    </Header>
  )
};

export default HeaderComponent;