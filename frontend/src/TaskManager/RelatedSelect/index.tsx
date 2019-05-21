import * as React from 'react';
import { Select } from "antd";
import { useEffect, useState } from "react";
import axios, { AxiosError } from 'axios';

interface Props {
  onChange(id: number): void;
  value: number | undefined;
  type: string;
}

function useAPIDataSelect(type: string) {
  let [result, setResult] = useState<undefined | Array<any> | Promise<any> | AxiosError>();

  useEffect(() => {
    let API = type === 'courier' ? '/account/courier/' : '/api/transportation/';
    let request = axios.get(API)
      .then((res) => {
        setResult(res.data.sort((a, b) => a.id - b.id));
      })
      .catch((error) => {
        setResult(error);
      });

    setResult(request);
  }, []);

  return result;
}

const RelatedSelect = (props: Props) => {
  // let [current, setCurrent] = useState(props.value);
  let list = useAPIDataSelect(props.type);

  return (
    <Select
      loading={Array.isArray(list) ? undefined : true}
      onChange={props.onChange}
      value={props.value}
    >
      {
        Array.isArray(list)
        && list.map((item) => (
          props.type === 'courier'
            ? (<Select.Option
              key={item.id}
              value={item.id}
            >{item.id}: {item.username}: ({item.first_name} {item.last_name})</Select.Option>)
            : (<Select.Option
              key={item.id}
              value={item.id}
            >{item.id}: {item.status === true ? 'Выполнен' : 'В процессе'}, {item.parcel}</Select.Option>)
        ))
      }
    </Select>
  )
};

export default RelatedSelect;