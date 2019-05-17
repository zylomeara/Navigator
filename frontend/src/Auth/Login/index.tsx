import * as React from 'react';
import { useState } from "react";
import { getCookie } from "../../UI/utils";
import axios from "axios";
import { Alert, Button, Form, Icon, Input, message, Modal, Tabs } from "antd";

interface Props {
  onStatusChange(status: true, position: 'courier' | 'manager' | undefined): void;
  switchMode(mode: 'auth' | 'register'): void;

  form?: any;
}

const Login = (props: Props) => {
  const { getFieldDecorator } = props.form;
  let [isWrongUserCredentialsWasProvided, setIsWrongUserCredentialsWasProvided] = useState<boolean>(false);
  let [loading, setLoading] = useState<boolean>(false);

  // let [error, setError] = useState<Error | undefined>();

  function handleSubmit(e: any) {
    e.preventDefault();
    props.form.validateFields((err: Error, values: { username: string; password: string }) => {
      if (!err) {
        setLoading(true);
        let csrftoken = getCookie('csrftoken');
        console.log('Received values of form: ', values);
        axios('/account/login/', {
          data: values,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken || '',
          },
          method: "POST",
        })
          .then(res => {
            setLoading(false);
            if (res.data.logged === true) {
              setIsWrongUserCredentialsWasProvided(false);
              props.onStatusChange && props.onStatusChange(true, res.data.position);
            } else {
              setIsWrongUserCredentialsWasProvided(true)
            }
          })
          .catch(error => {
            setLoading(false);
            message.error(error.message);
            console.log(error);
          })
      }
    });
  }

  return (
    <Form className="login-form">
      {/*<Form onSubmit={handleSubmit} className="login-form">*/}
      {isWrongUserCredentialsWasProvided && (
        <Alert
          message="Пароль или имя пользователя не верны"
          type="error"
          style={{ marginBottom: 24 }}
        />
      )}

      <Form.Item>
        {getFieldDecorator('username', {
          rules: [{ required: true, message: 'Please input your username!' }],
        })(
          <Input
            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }}/>}
            placeholder="Username"
            onPressEnter={handleSubmit}
          />,
        )}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator('password', {
          rules: [{ required: true, message: 'Please input your Password!' }],
        })(
          <Input
            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }}/>}
            type="password"
            placeholder="Password"
            onPressEnter={handleSubmit}
          />,
        )}
      </Form.Item>
      <Button loading={loading} onClick={handleSubmit} type={'primary'}>Войти</Button>
      <Button onClick={() => props.switchMode('register')}>Register</Button>
      {/*<Form.Item>*/}
      {/*{getFieldDecorator('remember', {*/}
      {/*  valuePropName: 'checked',*/}
      {/*  initialValue: true,*/}
      {/*})(<Checkbox>Remember me</Checkbox>)}*/}
      {/*<a className="login-form-forgot" href="">*/}
      {/*  Forgot password*/}
      {/*</a>*/}
      {/*<Button type="primary" htmlType="submit" className="login-form-button">*/}
      {/*  Log in*/}
      {/*</Button>*/}
      {/*Or <a href="">register now!</a>*/}
      {/*</Form.Item>*/}
    </Form>
  );
};

const WrappedNormalLoginForm = Form.create({})(Login);

export default WrappedNormalLoginForm;