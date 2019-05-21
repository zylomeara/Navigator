import * as React from 'react';
import { Form, Icon, Input, Button, Checkbox, Modal, message, Alert, Tabs } from 'antd';
import axios from 'axios';
import { getCookie } from "../UI/utils";
import { useState } from "react";
import './style.less';

import Login from './Login';
import Register from "./Register";

interface Props {
  form: any;
  onStatusChange(status: true): void;
}

const Auth = (props: Props) => {
  const { getFieldDecorator } = props.form;
  let [isWrongUserCredentialsWasProvided, setIsWrongUserCredentialsWasProvided] = useState<boolean>(false);
  let [tab, setTab] = useState<'auth' | 'register'>('auth');
  // let [error, setError] = useState<Error | undefined>();


  return (
    <Modal
      visible
      title={'Авторизация'}
      centered
      closable={false}
      cancelButtonProps={{ style: { display: 'none' } }}
      // onOk={handleSubmit}
      okButtonProps={{ style: { display: 'none' } }}
      // footer={null}
      // footer={[
      //   <Button
      //     key={'submit'}
      //     type={'primary'}
      //   >Вход</Button>
      // ]}
    >
      <Tabs activeKey={tab} renderTabBar={() => <></>}>
        <Tabs.TabPane key={'auth'}>
          <Login
            onStatusChange={props.onStatusChange}
            switchMode={setTab}
          />
        </Tabs.TabPane>
        <Tabs.TabPane key={'register'}>
          <Register
            switchMode={setTab}
          />
        </Tabs.TabPane>
      </Tabs>

    </Modal>
    );
};

const WrappedNormalLoginForm = Form.create({})(Auth);

export default WrappedNormalLoginForm;