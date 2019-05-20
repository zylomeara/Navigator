import * as React from 'react';
import { Select } from "antd";
import { useEffect, useState } from "react";
import axios, { AxiosError } from 'axios';

interface Props {
  onChange(id: number): void;
  value: number | undefined;
}

function useAPIDataSelect() {
  let [result, setResult] = useState<undefined | Array<any> | Promise<any> | AxiosError>();

  useEffect(() => {
    let request = axios.get('/api/client/')
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
  let list = useAPIDataSelect();

  return (
    <Select
      loading={Array.isArray(list) ? undefined : true}
      onChange={props.onChange}
      value={props.value}
    >
      {
        Array.isArray(list)
        && list.map((item) => (
          <Select.Option key={item.id} value={item.id}>{item.id}: {item.last_name} {item.first_name} {item.middle_name}</Select.Option>
        ))
      }
    </Select>
  )
};

export default RelatedSelect;