import * as React from 'react';
import { useEffect, useLayoutEffect, useState } from "react";
import axios from 'axios';

import olConditionEvents from "ol/events/condition";
import olCollection from "ol/collection";
import olFeature from "ol/feature";
import olVectorLayer from "ol/layer/vector";
import olVectorSource from "ol/source/vector";
import olModifyInteraction from "ol/interaction/modify";
import olProj from "ol/proj";
import olGeoJSONFormat from "ol/format/geojson";
import olPolyline from "ol/format/polyline"
import olMap from "ol/map";
import olGeometry from "ol/geom/geometry";
import olInteraction from "ol/interaction";
import olTileLayer from "ol/layer/tile";
import olOSMSource from "ol/source/osm";
import olView from "ol/view";
import olSimpleGeometry from "ol/geom/simplegeometry";
import olDrawinteraction from "ol/interaction/draw";
import olExtent from 'ol/extent'
import olStyle from 'ol/style/style';
import olIcon from 'ol/style/icon'
import olStroke from 'ol/style/stroke'
import { Col, Form, Input, Modal, Row, Select, Tabs } from "antd";

interface Props {
  geoms: undefined | [any, any];
  onOk(): void;
  onCancel(): void;
}

let format = new olGeoJSONFormat();

const TransportationRoute = (props: Props) => {
  let [mapDiv, setMapDiv] = useState<undefined | HTMLDivElement>();
  let [startAddress, setStartAddress] = useState();
  let [endAddress, setEndAddress] = useState();
  let [currentTab, setCurrentTab] = useState('map');

  useLayoutEffect(() => {
    let current = mapDiv;
    let map;

    if (current) {
      let layer = new olVectorLayer({
        source: new olVectorSource(),
        style: (feature, resolution) => {
          let marker = feature.get('marker');

          if (marker) {
            // marker определён - возвращаем стили для точки
            return [new olStyle({
              image: new olIcon({
                anchor: [0.5, 1],
                src: marker
              })
            })];
          } else {
            // marker не определён - возвращаем стили для линии
            return [new olStyle({
              stroke: new olStroke({
                color: 'blue',
                width: 3
              })
            })];
          }
        }
      });

      map = new olMap({
        target: current,
        layers: [
          new olTileLayer({
            source: new olOSMSource(),
          }),
          layer
        ],
        controls: [],
        view: new olView({
          projection: olProj.get('EPSG:4326'),
          center: [33.65, 44.6],
          zoom: 10,
        })
      });

      let ext = olExtent.boundingExtent([props.geoms[0].coordinates, props.geoms[1].coordinates]);
      map.getView().fit(ext, {
        size: map.getSize(),
        padding: [20, 20, 20, 20],
        // constrainResolution: false
      });


      let startGeom = format.readGeometry(props.geoms[0]);
      let endGeom = format.readGeometry(props.geoms[1]);

      let startFeature = new olFeature({
        geometry: startGeom,
        marker: '/media/images/markerStart1.png'
      });
      let endFeature = new olFeature({
        geometry: endGeom,
        marker: '/media/images/markerFinish1.png'
      });

      layer.getSource().addFeatures([startFeature, endFeature]);

      let routeUrl = 'https://router.project-osrm.org/route/v1/driving/'
        + props.geoms[0].coordinates + ';' + props.geoms[1].coordinates
        + '?alternatives=false&steps=false&hints=;&overview=full';

      axios.get(routeUrl)
        .then((res) => {
          let routes = res.data.routes;
          if (routes.length > 0) {
            let route = routes[0];
            // преобразуем геометрию Polyline в формат OpenLayers 3
            let polyGeom = route.geometry;
            let polylineFormat = new olPolyline();
            let olFeature = polylineFormat.readFeature(polyGeom);

            map && map.getView().fit(olFeature.getGeometry().getExtent(), {
              size: map.getSize(),
              padding: [20, 20, 20, 20],
              // constrainResolution: false
            });

            layer.getSource().addFeatures([olFeature]);
          }
        });

      props.geoms.map((geom, index) => {
        let url = 'http://nominatim.openstreetmap.org/reverse?format=json&lon='
                + geom.coordinates[0] + '&lat=' + geom.coordinates[1];

        axios.get(url)
        .then((res) => {
          if (index === 0) {
            setStartAddress(res.data.display_name)
          } else {
            setEndAddress(res.data.display_name)
          }
        })
      });
    }

    return () => {
      map && map.setTarget('');
      setStartAddress(undefined);
      setEndAddress(undefined)
    }
  }, [mapDiv]);

  useEffect(() => {
    if (!!!props.geoms) {
      setCurrentTab('map')
    }
  }, [!!props.geoms]);

  return (
    <Modal
      visible={!!props.geoms}
      // title={'Маршрут'}
      onCancel={props.onCancel}
      onOk={props.onOk}
      destroyOnClose
      width={'60%'}
    >
      <Tabs activeKey={currentTab} onChange={setCurrentTab}>
        <Tabs.TabPane tab={'Карта'} key={'map'}>
          <div ref={setMapDiv} style={{ height: '60vh' }}/>
        </Tabs.TabPane>
        <Tabs.TabPane tab={'Адреса'} key={'address'}>
          <Form.Item label={'Адрес отправки'}>
            <Input.TextArea
              value={startAddress}
              onChange={(event) => {
                setStartAddress(event.target.value)
              }}
            />
          </Form.Item>
          <Form.Item label={'Адрес пункта назначения'}>
            <Input.TextArea
              value={endAddress}
              onChange={(event) => {
                setEndAddress(event.target.value)
              }}
            />
          </Form.Item>
        </Tabs.TabPane>
      </Tabs>
    </Modal>
  )
};

export default TransportationRoute;