import * as React from 'react';
import * as ReactDOM from 'react-dom';
import 'antd/dist/antd.less';
import './style.less'
import {
  Spin,
  message, Alert,
} from 'antd';
import { useEffect, useState } from "react";
import axios from 'axios';
import Auth from "../Auth";
import Workplace from '../Workplace'

export const ProfileContext = React.createContext(null);

const App = () => {
  let [statusLog, setStatusLog] = useState<false | true | undefined | Error>();
  let [position, setPosition] = useState<'courier' | 'manager' | 'admin' | undefined>();
  let [personalData, setPersonalData] = useState<any>();

  useEffect(() => {
    axios.get('/account/islog/')
      .then(res => {
        if (res.data.logged === true) {
          setStatusLog(true)
        } else {
          setStatusLog(false)
        }

        if (res.data.position) {
          setPosition(res.data.position)
        }
        setPersonalData(res.data)
      })
      .catch(error => {
        setStatusLog(error);
        console.log(error);
        message.error(error.message)
      })
  }, []);

  return <ProfileContext.Provider value={personalData}>
    <div className={'App-root'}>
      {statusLog === undefined && <div className="App-root__load">
        <Spin size={'large'}/>
      </div>}
      {statusLog === true && <div className="App-root__loaded">
        <Workplace position={position}/>
      </div>}
      {
        statusLog === false
        && <Auth onStatusChange={(status: true, position: 'courier' | 'manager' | 'admin' | undefined, data) => {
          setStatusLog(status);
          setPosition(position)
          setPersonalData(data)
        }}/>
      }
      {
        statusLog instanceof Error && (
          <Alert
            message={statusLog.message}
            type="error"
            style={{ marginBottom: 24 }}
          />
        )
      }
    </div>
  </ProfileContext.Provider>
};

ReactDOM.render(<App/>, document.getElementById('root'));