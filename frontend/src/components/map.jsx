import React from 'react';
import {APIProvider, Map, Marker} from '@vis.gl/react-google-maps';

const containerStyle = {
  width: '100%',
  height: '400px',
}

const  map = (center) => {
    return (
      <div className='map'>
        <APIProvider apiKey={process.env.REACT_APP_MAPSAPIKEY}>
          <div style={containerStyle}>
          <Map
              defaultZoom={15}
              defaultCenter={center.center}
              >
                <Marker position={center.center}/>
          </Map>
          </div>
        </APIProvider>
        </div>
    )
}
export default map