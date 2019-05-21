import * as React from 'react';
import { Button, Form, Input, message, Modal, Switch, Typography } from "antd";
import { useState } from "react";
import { getCookie } from "../../UI/utils";
import axios from "axios";
import RelatedSelect from "../RelatedSelect";
import { GeometryEditor } from "../UI/GeometryEditor";

const { Text } = Typography;

interface Props {
  mode: 'create' | 'edit';
  data: object | null;
  onSubmit(): void;
  onCancel(): void;
}

interface Transportation {
  id?: number;
  parcel?: string;
  order?: number;
  start_location?: { type: 'Point'; coordinates: number[] }
  end_location?: { type: 'Point'; coordinates: number[] }
}

const TransportationForm = (props: Props) => {
  let [data, setData] = useState<Transportation>({ ...props.data });
  let [loading, setLoading] = useState<boolean>(false);
  let [modal, setModal] = useState<undefined | 'start' | 'end'>();


  function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    let csrftoken = getCookie('csrftoken');
    axios(`/api/transportation/${props.mode === 'create' ? '' : data.id + '/'}`, {
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
          key={'parcel'}
          label={'Посылка'}
        >
          <Input.TextArea
            required
            value={data.parcel}
            onChange={(event) => setData({
              ...data,
              parcel: event.target.value
            })}
          />
        </Form.Item>
        <Form.Item
          key={'order'}
          label={'Заказ'}
          required
        >
          <RelatedSelect
            value={data.order}
            onChange={(value) => setData({
              ...data,
              order: value
            })}
          />
        </Form.Item>
        <Form.Item
          key={'start_location'}
          label={'Начало'}
          required
        >
          <>
            <Button
              onClick={() => setModal('start')}
            >
              {
                data.start_location
                  ? "Редактировать"
                  : 'Добавить'
              }
            </Button><br/>
            <GeometryEditor
              visible={modal === 'start'}
              onCancel={() => setModal(undefined)}
              onSave={value => {
                setModal(undefined);
                setData({
                  ...data,
                  start_location: value ? value : null
                });
              }}
              geom={data.start_location}
              srid={4326}
            />
          </>
        </Form.Item>
        <Form.Item
          key={'end_location'}
          label={'Конец'}
          required
        >
          <>
            <Button
              onClick={() => setModal('end')}
            >
              {
                data.end_location
                  ? "Редактировать"
                  : 'Добавить'
              }
            </Button><br/>
            <GeometryEditor
              visible={modal === 'end'}
              onCancel={() => setModal(undefined)}
              onSave={value => {
                setModal(undefined);
                setData({
                  ...data,
                  end_location: value ? value : null
                });
              }}
              geom={data.end_location}
              srid={4326}
            />
          </>
        </Form.Item>
      </Form>
    </Modal>
  )
};

export default TransportationForm;