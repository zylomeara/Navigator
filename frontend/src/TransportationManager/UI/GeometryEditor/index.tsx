import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import olProj from "ol/proj";
import olGeoJSONFormat from "ol/format/geojson";
import olMap from "ol/map";
import olGeometry from "ol/geom/geometry";
import olInteraction from "ol/interaction";
import olTileLayer from "ol/layer/tile";
import olOSMSource from "ol/source/osm";
import olView from "ol/view";
import olSimpleGeometry from "ol/geom/simplegeometry";
import olDrawinteraction from "ol/interaction/draw";
import { goToGeom, rightAngleOlGeomFunction } from "../../../mapUtils/features";
import olConditionEvents from "ol/events/condition";
import olCollection from "ol/collection";
import olFeature from "ol/feature";
import olVectorLayer from "ol/layer/vector";
import olVectorSource from "ol/source/vector";
import olModifyInteraction from "ol/interaction/modify";
import {
  Button,
  Modal,
  Dropdown,
  Menu,
  Icon
} from "antd";
import { GeometryEditorImportDialog } from '../GeometryEditorImport'
// import { getProjection } from "../../../../lib/mapUtils";


function getProjection(srid) {
  return (
    olProj.get('EPSG:' + srid) || olProj.get('CUSTOM:' + srid) || undefined
  );
}

function goToGeom(geom, map, duration = 400) {
  if (!geom) {
    return;
  }

  let view = map.getView();

  // если геометрия - GeoJSON-объект
  if (!(geom instanceof olSimpleGeometry || Array.isArray(geom))) {
    geom = new olGeoJSONFormat().readGeometry(geom);
  }

  // если геометрия - Point
  if (geom.getType !== undefined && geom.getType() === 'Point') {
    view.animate({
      zoom: 10,
      // zoom: Math.max(view.getZoom(), 17),
      center: geom.getCoordinates(),
      duration,
    });

    return;
  }

  // если геометрия - не Point, либо если геометрия - Extent
  view.fit(geom, { duration: duration });
}


interface Props {
  /** Геометрия для редактирования */
  geom?: any;
  /** Callback, вызываемый по сохранению */
  onSave?(geom: any, srid?: any): void;
  onCancel?(): void;
  visible?: boolean;
  srid: number;

  /** Признак не_рисования футера (нижних кнопок) редактора */
  // apiService: import('../../../APIService').default;
  // apiSettings: import('../../../APIService/resources/Settings').APISettings;
}

const geomOptions: Array<{ alias: string; value: ol.geom.GeometryType }> = [
  // { alias: 'Полигон', value: 'Polygon' },
  { alias: 'Точка', value: 'Point' },
  // { alias: 'Линия', value: 'LineString' },
  // { alias: 'Мультиполигон', value: 'MultiPolygon' },
  // { alias: 'Мультиточка', value: 'MultiPoint' },
  // { alias: 'Мультилиния', value: 'MultiLineString' },
];

let format = new olGeoJSONFormat();

export const GeometryEditor = (props: Props) => {
  let [mapDiv, setMapDiv] = useState<HTMLDivElement | null>(null);
  let [map, setMap] = useState<olMap | undefined>();
  let [layer, setLayer] = useState<olVectorLayer | undefined>();
  let [geom, setGeom] = useState<olGeometry | undefined>();
  let [interaction, setInteraction] = useState<olInteraction.Interaction | undefined>();
  let [shiftKeyIsDown, setShiftKeyIsDown] = useState<boolean>(false);
  let [geomTypeEdit, setGeomTypeEdit] = useState<ol.geom.GeometryType | undefined>();

  let [importDialogVisible, setImportDialogVisible] = useState(false);

  let prevInteraction = useRef(interaction);

  let dataProjection = props.srid && getProjection(props.srid).getCode();
  // let dataProjection = olProj.get('EPSG:4326');
  let editorProjection = olProj.get('EPSG:4326');
  // let editorProjection = olProj.get('EPSG:3857');


  useLayoutEffect(() => {
    let current = mapDiv;

    if (current) {
      let layer = new olVectorLayer({
        source: new olVectorSource(),
      });

      let map = new olMap({
        target: current,
        layers: [
          new olTileLayer({
            source: new olOSMSource(),
          }),
          layer
        ],
        controls: [],
        view: new olView({
          // projection: 'EPSG:4326',
          projection: editorProjection,
          center: olProj.transform([33.65, 44.6], 'EPSG:4326', editorProjection),
          zoom: 10,
        })
      });
      setMap(map);
      setLayer(layer);

      if (geom instanceof olSimpleGeometry) {
        map.getView().fit(geom);
      } else {
        let ext = [39.574878215789795, 47.179133892059326, 39.87637996673584, 47.31893062591553];
        // let ext = props.apiSettings.project.defaultMapExtent;

        ext = olProj.transformExtent(ext, 'EPSG:4326', editorProjection);

        map.getView().fit(ext);
      }
    } else {
      if (map) {
        map.setTarget('');
      }
      setMap(undefined);
    }

    return () => {
      setMap(undefined);
      setLayer(undefined);
    }
  }, [mapDiv]);

  useEffect(() => {
    let geom = props.geom;

    if (geom) {
      let olGeom = format.readGeometry(geom);
      olGeom && dataProjection && olGeom.transform(dataProjection, editorProjection);
      setGeom(olGeom);
    }

    return () => setGeom(undefined)
  }, [props.geom, mapDiv]);

  useEffect(() => {
    if (geom && props.srid) {
      onSave();
    }
  }, [props.srid]);

  useEffect(() => {
    if (interaction) {
      if (interaction instanceof olDrawinteraction) {
        setGeomTypeEdit(interaction.type_)
      } else {
        setGeomTypeEdit(undefined)
      }

      if (prevInteraction.current !== interaction) {
        map
        && prevInteraction.current
        && map.removeInteraction(prevInteraction.current);
      }
      prevInteraction.current = interaction;
      map && map.addInteraction(interaction);
    } else {
      setGeomTypeEdit(undefined);
      map
      && prevInteraction.current
      && map.removeInteraction(prevInteraction.current);
    }
  }, [interaction]);

  useEffect(() => {
    if (layer) {
      if (geom) {
        let features = new olCollection([new olFeature(geom)]);

        layer.getSource().clear();
        layer.getSource().addFeatures(features.getArray());

        let inter = new olModifyInteraction({ features });

        setInteraction(inter);
        goToGeom(geom, map);
      } else {
        layer.getSource().clear();
        // setInteraction(undefined);
      }
    }
  }, [geom, layer]);

  /** Включение рисования */
  function enableDraw(geomType: ol.geom.GeometryType) {
    setGeom(undefined);

    let inter = (
      new olDrawinteraction({
        type: geomType,
        // geometryFunction: rightAngleOlGeomFunction(
        //   geomType,
        //   () => shiftKeyIsDown,
        // ),
        freehandCondition: olConditionEvents.never,
        condition: olConditionEvents.always,
      })
    );
    setInteraction(inter);

    document.addEventListener('keydown', onDrawFeatureKeydown);
    document.addEventListener('keyup', onDrawFeatureKeyup);

    inter.on('drawend', (event: any) => {
      document.removeEventListener('keydown', onDrawFeatureKeydown);
      document.removeEventListener('keyup', onDrawFeatureKeyup);

      setGeom(event.feature.getGeometry());
    });
  }


  function onDrawFeatureKeydown(event: any) {
    if (event.key === 'Shift') {
      setShiftKeyIsDown(true);
    }
  }

  function onDrawFeatureKeyup(event: any) {
    if (event.key === 'Shift') {
      setShiftKeyIsDown(false);
    }
  }

  function showModal() {
    setImportDialogVisible(true)
  }

  function hideModal() {
    setImportDialogVisible(false)
  }

  function clearMap() {
    setGeom(undefined);
    setInteraction(undefined);
  }

  function onSave() {
    if (typeof props.onSave === 'function') {
      if (geom && dataProjection) {
        geom.transform(editorProjection, dataProjection);
        let serializedGeom = format.writeGeometry(geom);
        props.onSave(JSON.parse(serializedGeom));
      } else {
        props.onSave(null);
      }
    }
  }

  let optionName = geomOptions.find(opt => opt.value === geomTypeEdit);

  return <Modal
    title={'Геометрия файла'}
    visible={props.visible}
    onOk={onSave}
    onCancel={props.onCancel}
    width={'60%'}
    destroyOnClose
  >
    <div className="geometry-controls"
         style={{
           padding: '10px',
           textAlign: 'center'
         }}
    >
      <Dropdown
        overlay={<Menu>
          {geomOptions.map(({ value, alias }) => (
            <Menu.Item key={value} onClick={() => enableDraw(value)}>
              {alias}
            </Menu.Item>
          ))}
        </Menu>}
      >
        <Button>
          {
            geomTypeEdit === undefined || !optionName
              ? 'Нарисовать'
              : optionName.alias
          }
          <Icon type="down"/>
        </Button>
      </Dropdown>
      <Button onClick={clearMap}>Очистить</Button>
      <Button onClick={showModal}>Импортировать из JSON</Button>
    </div>
    <div className="geometry-editor">
      <div ref={setMapDiv}/>
    </div>
    <GeometryEditorImportDialog
      visible={importDialogVisible}
      onCancel={hideModal}
      onConfirm={(geometry) => {
        setGeom(geometry);
        hideModal()
      }}
    />
  </Modal>
};