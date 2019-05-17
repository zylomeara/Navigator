import * as React from 'react';
import { Alert, Button, Form, Icon, Input, InputNumber, message, Select } from "antd";
import { getCookie } from "../../UI/utils";
import axios from "axios";
import { useState } from "react";

interface Props {
  switchMode(mode: 'auth' | 'register'): void;
}

const Register = (props: Props) => {
  const { getFieldDecorator } = props.form;
  let [isWrongUserCredentialsWasProvided, setIsWrongUserCredentialsWasProvided] = useState<boolean>(false);
  let [loading, setLoading] = useState<boolean>(false);
  let [position, setPosition] = useState<'manager' | 'courier'>('courier');



  function handleSubmit(e: any) {
    e.preventDefault();
    props.form.validateFields((err: Error, values: { username: string; password: string }) => {
      if (!err) {
        setLoading(true);
        let csrftoken = getCookie('csrftoken');
        console.log('Received values of form: ', values);
        axios('/account/register/', {
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
            message.success(`Пользователь ${values.username} успешно зарегистрирован`);
            props.switchMode('auth')
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

      <Form.Item label="Выберите должность">
          {getFieldDecorator('position', {
            initialValue: position,
            rules: [
              {
                required: true,
                message: 'Choose',
              },
            ],
          })(<Select onChange={(value: typeof position) => setPosition(value)}>
            <Select.Option value={'manager'}>Менеджер</Select.Option>
            <Select.Option value={'courier'}>Курьер</Select.Option>
          </Select>)}
        </Form.Item>

      <Form.Item label={'Введите логин'}>
        {getFieldDecorator('username', {
          rules: [{ required: true, message: 'Please input your username!' }],
        })(
          <Input
            // prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }}/>}
            placeholder="Username"
            onPressEnter={handleSubmit}
          />,
        )}
      </Form.Item>
      <Form.Item label={'Введите пароль'}>
        {getFieldDecorator('password', {
          rules: [{ required: true, message: 'Please input your Password!' }],
        })(
          <Input
            // prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }}/>}
            type="password"
            placeholder="Password"
            onPressEnter={handleSubmit}
          />,
        )}
      </Form.Item>

      <Form.Item label={'Введите номер телефона'}>
        {getFieldDecorator('phone_number', {
          rules: [{ required: true, message: 'Please input your phone number!' }],
        })(
          <Input
            // prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }}/>}
            // type="password"
            // placeholder="Password"
            onPressEnter={handleSubmit}
          />,
        )}
      </Form.Item>

      {
        position === 'courier' && (
          <Form.Item label={'Введите название транспорта'}>
        {getFieldDecorator('transport', {
          rules: [{ required: true, message: 'Please input your phone number!' }],
        })(
          <Input
            // prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }}/>}
            // type="password"
            // placeholder="Password"
            onPressEnter={handleSubmit}
          />,
        )}
      </Form.Item>
        )
      }

      {
        position === 'manager' && (
          <Form.Item label={'Введите место работы'}>
        {getFieldDecorator('work_place', {
          rules: [{ required: true, message: 'Please input your phone number!' }],
        })(
          <Input
            // prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }}/>}
            // type="password"
            // placeholder="Password"
            onPressEnter={handleSubmit}
          />,
        )}
      </Form.Item>
        )
      }

      <Button onClick={() => props.switchMode('auth')}>Назад</Button>
      <Button onClick={handleSubmit} type={'primary'}>Регистрация</Button>
    </Form>
  )
};

const WrappedNormalLoginForm = Form.create({})(Register);

export default WrappedNormalLoginForm;