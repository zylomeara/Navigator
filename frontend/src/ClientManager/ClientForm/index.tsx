import * as React from 'react';
import { Form, Input, message, Modal } from "antd";
import { useState } from "react";
import { getCookie } from "../../UI/utils";
import axios from "axios";

interface Props {
  mode: 'create' | 'edit';
  data: object | null;
  onSubmit(): void;
  onCancel(): void;
}

interface Client {
  id?: number;
  first_name?: string;
  last_name?: string;
  middle_name?: string;
  phone_number?: string;
}

const ClientForm = (props: Props) => {
  let [data, setData] = useState<Client>({ ...props.data });
  let [loading, setLoading] = useState<boolean>(false);


  function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    let csrftoken = getCookie('csrftoken');
    axios(`/api/client/${props.mode === 'create' ? '' : data.id+'/'}`, {
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
          key={'first_name'}
          label={'Имя'}
          required
        >
          <Input
            required
            value={data.first_name}
            onChange={(event) => setData({
              ...data,
              first_name: event.target.value
            })}
          />
        </Form.Item>
        <Form.Item
          key={'last_name'}
          label={'Фамилия'}
          required
        >
          <Input
            required
            value={data.last_name}
            onChange={(event) => setData({
              ...data,
              last_name: event.target.value
            })}
          />
        </Form.Item>
        <Form.Item
          key={'middle_name'}
          label={'Отчество'}
          required
        >
          <Input
            required
            value={data.middle_name}
            onChange={(event) => setData({
              ...data,
              middle_name: event.target.value
            })}
          />
        </Form.Item>
        <Form.Item
          key={'phone_number'}
          label={'Телефон'}
          required
        >
          <Input
            required
            value={data.phone_number}
            onChange={(event) => setData({
              ...data,
              phone_number: event.target.value
            })}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
};

export default ClientForm;