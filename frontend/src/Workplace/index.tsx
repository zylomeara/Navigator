import * as React from 'react';
import './style.less'
import {
  Layout,
} from 'antd';
import Courier from './Courier';
import Manager from './Manager';

interface Props {
  position: 'courier' | 'manager' | undefined | 'admin'
}

const Workplace = (props: Props) => {

  return (
    <Layout className="Workplace-layout">
      {props.position === 'courier' && (
        <Courier/>
      )}
      {props.position === 'manager' && (
        <Manager/>
      )}
    </Layout>
  )
};

export default Workplace;