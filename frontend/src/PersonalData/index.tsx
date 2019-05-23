import * as React from 'react';
import { ProfileContext } from '../App/index';
import { useContext } from "react";
import { Col, Layout, Row } from "antd";
import './style.less';

const { Content } = Layout;

const PersonalData = (props: any) => {
  let data = useContext(ProfileContext);
  let profile = data && data.profile || {};

  return (
    <div className={'PersonalData'}>
      <Row gutter={8}>
        <Col span={12} className={'title'}>Логин:</Col>
        <Col span={12} className={'description'}>{profile.username}</Col>
      </Row>
      <Row gutter={8}>
        <Col span={12} className={'title'}>Имя:</Col>
        <Col span={12} className={'description'}>{profile.first_name}</Col>
      </Row>
      <Row gutter={8}>
        <Col span={12} className={'title'}>Фамилия:</Col>
        <Col span={12} className={'description'}>{profile.last_name}</Col>
      </Row>
      <Row gutter={8}>
        <Col span={12} className={'title'}>Дата регистрации:</Col>
        <Col span={12} className={'description'}>{profile.date_joined}</Col>
      </Row>
      <Row gutter={8}>
        <Col span={12} className={'title'}>Дата последнего входа:</Col>
        <Col span={12} className={'description'}>{profile.last_login}</Col>
      </Row>
      <Row gutter={8}>
        <Col span={12} className={'title'}>Номер телефона:</Col>
        <Col span={12} className={'description'}>{profile.phone_number}</Col>
      </Row>
      {profile.transport && <Row gutter={8}>
        <Col span={12} className={'title'}>Транспорт:</Col>
        <Col span={12} className={'description'}>{profile.transport}</Col>
      </Row>}
      {profile.work_place && <Row gutter={8}>
        <Col span={12} className={'title'}>Рабочее место:</Col>
        <Col span={12} className={'description'}>{profile.work_place}</Col>
      </Row>}
      <Row gutter={8}>
        <Col span={12} className={'title'}>Должность:</Col>
        <Col span={12} className={'description'}>{
          data.position === 'courier'
            ? 'Курьер'
            : data.position === 'manager'
            ? 'Менеджер'
            : 'Админ'
        }</Col>
      </Row>
      {/*<Row gutter={8}>*/}
      {/*  <Col span={12} className={'title'}></Col>*/}
      {/*  <Col span={12} className={'description'}></Col>*/}
      {/*</Row>*/}
    </div>
  )
};

export default PersonalData;