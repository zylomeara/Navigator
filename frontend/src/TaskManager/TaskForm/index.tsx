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
  transportation?: number;
  courier?: number;
}

const TaskForm = (props: Props) => {
  let [data, setData] = useState<Client>({ ...props.data });
  let [loading, setLoading] = useState<boolean>(false);


  function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    let csrftoken = getCookie('csrftoken');
    axios(`/api/task/${props.mode === 'create' ? '' : data.id+'/'}`, {
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
        <Form.Item
          key={'transportation'}
          label={'Перевозка'}
          required
        >
          <RelatedSelect
            type={'transportation'}
            value={data.transportation}
            onChange={(value) => setData({
              ...data,
              transportation: value
            })}
          />
        </Form.Item>
        <Form.Item
          key={'courier'}
          label={'Курьер'}
          required
        >
          <RelatedSelect
            type={'courier'}
            value={data.courier}
            onChange={(value) => setData({
              ...data,
              courier: value
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

export default TaskForm;