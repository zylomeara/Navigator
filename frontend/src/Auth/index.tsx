import * as React from 'react';
import { Form, Icon, Input, Button, Checkbox, Modal, message, Alert } from 'antd';
import axios from 'axios';
import { getCookie } from "../ui/utils";
import { useState } from "react";

interface Props {
  form: any;
  onStatusChange(status: true): void;
}

const Auth = (props: Props) => {
  const { getFieldDecorator } = props.form;
  let [isWrongUserCredentialsWasProvided, setIsWrongUserCredentialsWasProvided] = useState<boolean>(false);
  let [loading, setLoading] = useState<boolean>();
  // let [error, setError] = useState<Error | undefined>();

  function handleSubmit (e: any) {
    e.preventDefault();
    setLoading(true);
    props.form.validateFields((err: Error, values: {username: string; password: string}) => {
      if (!err) {
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
            console.log(res.headers.logged);
            setLoading(false);
            if (res.headers.logged === 'true') {
              setIsWrongUserCredentialsWasProvided(false);
              props.onStatusChange && props.onStatusChange(true);
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
    <Modal
      visible
      title={'Авторизация'}
      centered
      closable={false}
      cancelButtonProps={{ style: { display: 'none' } }}
      onOk={handleSubmit}
      okButtonProps={{ loading: loading }}
      // footer={null}
      // footer={[
      //   <Button
      //     key={'submit'}
      //     type={'primary'}
      //   >Вход</Button>
      // ]}
    >
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
    </Modal>
    );
};

const WrappedNormalLoginForm = Form.create({})(Auth);

export default WrappedNormalLoginForm;