import React, { useState } from 'react';
import olFeature from 'ol/feature';
import olGeoJSONFormat from 'ol/format/geojson';
import olGeometry from 'ol/geom/geometry';
// import { getSrid, getProjection } from '../../../mapUtils';
// import { RelatedSelect } from '../../Form/RelatedSelect'
import {
  Input,
  Modal,
  Form,
  message
} from 'antd';

interface Props {
  /** Callback, вызываемый для закрытия диалога */
  onCancel(): void;
  /** Callback, вызываемый по завершению импорта */
  onConfirm(geometry: olGeometry): void;
  /** Ожидаемый тип геометрии */
  geomType?: ol.geom.GeometryType | 'Geometry';
  // apiService: import('../../../APIService').default;
  visible: boolean;
}

interface State {
  /** value инпута */
  inputText: string;
  /** проекция данных */
  dataProjection: ol.ProjectionLike;
}

/** Диалог импорта геометрии для редактора геометрии */
export const GeometryEditorImportDialog = (props: Props) => {
  let [inputText, setInputText] = useState<State['inputText']>('');
  let [dataProjection, setDataProjection] = useState<State['dataProjection']>('EPSG:4326');


  function onConfirm() {
    let text = inputText.trim();

    if (!text.startsWith('{')) {
      text = '{' + text;
    }

    if (!text.endsWith('}')) {
      text += '}';
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      message.error('Не удалось распознать JSON');

      return;
    }

    let format = new olGeoJSONFormat();

    // пытаемся прочитать коллекцию геометрий
    // если не получается, пытаемся прочитать одну фичу
    // если не получается, пытаемся прочитать геометрию
    // если все еще не получается, то ¯\_(ツ)_/¯
    let geometry, feature, featureCollection;
    try {
      if (data.type === 'FeatureCollection' || Array.isArray(data.features)) {
        featureCollection = format.readFeatures(data);
      } else if (
        data.type === 'Feature' ||
        typeof data.geometry === 'object' ||
        typeof data.properties === 'object'
      ) {
        feature = format.readFeature(data);
      } else {
        geometry = format.readGeometry(data);
      }
    } catch (e) {
      message.error('Не удалось распознать JSON');

      return;
    }

    if (Array.isArray(featureCollection)) {
      feature = featureCollection[0];
    }

    if (feature instanceof olFeature) {
      geometry = feature.getGeometry();
    }

    if (geometry instanceof olGeometry) {
      const geomType = props.geomType;
      if (
        geomType !== undefined &&
        geomType !== 'Geometry' &&
        geomType !== geometry.getType()
      ) {
        message.error('Недопустимый тип геометрии. Требуется ');
      } else {
        geometry.transform(dataProjection, 'EPSG:3857');

        typeof props.onConfirm === 'function' &&
        props.onConfirm(geometry);
      }
    } else {
      message.error('Не удалось распознать геометрию');
    }
  }


  return (
    <Modal
      title="Импорт GeoJSON"
      visible={props.visible}
      onCancel={props.onCancel}
      onOk={onConfirm}
      destroyOnClose
    >
      {/*<Form layout={'inline'}>*/}
      {/*  <Form.Item label="Проекция данных">*/}
      {/*    <RelatedSelect*/}
      {/*      disabled={false}*/}
      {/*      fieldType={'srid'}*/}
      {/*      value={getSrid(dataProjection)}*/}
      {/*      onChange={(value: string) => setDataProjection(getProjection(value).getCode())}*/}
      {/*      onError={error => message.error(error.message)}*/}
      {/*    />*/}
      {/*  </Form.Item>*/}
      {/*</Form>*/}
      {/*<br/>*/}
      <Input.TextArea
        autosize={{
          minRows: 4,
          maxRows: 8
        }}
        onChange={event => setInputText(event.target.value)}
        value={inputText}
        autoFocus
      />
    </Modal>
  );
};