import * as React from 'react';
import { Form, Input, message, Modal, Switch } from "antd";
import { useState } from "react";
import { getCookie } from "../../UI/utils";
import axios from "axios";
import RelatedSelect from "../RelatedSelect";

interface Props {
  mode: 'create' | 'edit';
  data: object | null;
  onSubmit(): void;
  onCancel(): void;
}

interface Client {
  id?: number;
  status?: boolean;
  date?: string;
  client?: number;
}

const OrderForm = (props: Props) => {
  let [data, setData] = useState<Client>({ ...props.data });
  let [loading, setLoading] = useState<boolean>(false);


  function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    let csrftoken = getCookie('csrftoken');
    axios(`/api/order/${props.mode === 'create' ? '' : data.id+'/'}`, {
      data: data,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken || '',
      },
      method: props.mode === 'create'
        ? "POST"
        : 'PUT'
      ,
    })
      .then(res => {
        setLoading(false);
        props.onSubmit();
      })
      .catch(error => {
        setLoading(false);
        message.error(error.message);
        console.log(error);
      })
  }


  return (
    <Modal
      visible
      title={props.mode === 'create' ? 'Создать' : 'Редактировать'}
      onOk={handleSubmit}
      onCancel={props.onCancel}
      okButtonProps={{ loading }}
    >
      <Form>
        <Form.Item
          key={'status'}
          label={'Статус'}
          required
        >
          <Switch
            required
            checked={data.status}
            onChange={(value) => setData({
              ...data,
              status: value
            })}
          />
        </Form.Item>
        {props.mode === 'edit' && <Form.Item
          key={'date'}
          label={'Дата'}
        >
          <Input
            disabled
            required
            value={data.date}
            onChange={(event) => setData({
              ...data,
              date: event.target.value
            })}
          />
        </Form.Item>}
        <Form.Item
          key={'client'}
          label={'Клиент'}
          required
        >
          <RelatedSelect
            value={data.client}
            onChange={(value) => setData({
              ...data,
              client: value
            })}
          />
        </Form.Item>
        {/*<Form.Item*/}
        {/*  key={'phone_number'}*/}
        {/*  label={'Телефон'}*/}
        {/*  required*/}
        {/*>*/}
        {/*  <Input*/}
        {/*    required*/}
        {/*    value={data.phone_number}*/}
        {/*    onChange={(event) => setData({*/}
        {/*      ...data,*/}
        {/*      phone_number: event.target.value*/}
        {/*    })}*/}
        {/*  />*/}
        {/*</Form.Item>*/}
      </Form>
    </Modal>
  )
};

export default OrderForm;