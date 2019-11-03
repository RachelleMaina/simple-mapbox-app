import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl';
import {
  CircleMode,
  DragCircleMode,
  DirectMode,
  SimpleSelectMode,
} from 'mapbox-gl-draw-circle';
import DrawRectangle from 'mapbox-gl-draw-rectangle-mode';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import bbox from '@turf/bbox';
import Map from '../components/Map';
import styles from '../data';

export default class MapView extends Component {
  constructor(props) {
    super(props);
    this.map = null;
    this.draw = null;
    this.state = {
      lng: 36.817245,
      lat: -1.283253,
      zoom: 13,
      shape: '',
      geojson: [],
      data: {},
    };
  }

  componentDidMount() {
    this.createMap();
    this.initializeDrawToolbox('simple_select');
  }

   createMap=() => {
     const { lng, lat, zoom } = this.state;
     mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
     this.map = new mapboxgl.Map({
       container: 'map',
       style: 'mapbox://styles/rachellemaina/ck2ha8dq51rls1dmtspp0yxdm',
       center: [lng, lat],
       zoom,
     });

     this.map.addControl(new mapboxgl.NavigationControl());
   }

   initializeDrawToolbox=(defaultMode) => {
     this.draw = new MapboxDraw({
       defaultMode,
       userProperties: true,
       modes: {
         ...MapboxDraw.modes,
         draw_circle: CircleMode,
         drag_circle: DragCircleMode,
         direct_select: DirectMode,
         simple_select: SimpleSelectMode,
         draw_rectangle: DrawRectangle,
       },
       displayControlsDefault: false,
       styles,
     });

     this.map.addControl(this.draw, 'top-left');
     this.map.on('draw.create', this.updateArea);
     this.map.on('draw.delete', this.deleteArea);
     this.map.on('draw.update', this.updateArea);
   }

   updateArea=() => {
     const { shape } = this.state;
     const geojson = this.draw.getAll();
     let data = {};
     if (geojson.features.length > 0) {
       if (shape === 'rectangle') {
         data = {
           shape,
           upperLeft: this.getBoundAreaCoordinates(geojson).upperLeft.join(', '),
           lowerRight: this.getBoundAreaCoordinates(geojson).lowerRight.join(', '),
         };
         this.fitToBoundingBox(geojson);
       } else if (shape === 'circle') {
         data = {
           shape,
           center: [geojson.features[0].properties.center[0].toFixed(2),
             geojson.features[0].properties.center[1].toFixed(2)].join(', '),
           radius: geojson.features[0].properties.radiusInKm.toFixed(2),

         };
       } else if (shape === 'polygon') {
         let allPoints = '';
         const coordinates = geojson.features[0].geometry.coordinates;
         for (let i = 0; i < coordinates.length; i++) {
           allPoints = coordinates[i].join(',');
         }
         const coordinatesArr = allPoints.split(',');
         const point = coordinatesArr.map((item) => parseFloat(item, 10).toFixed(2));
         data = {
           shape,
           coordinates: point.join(', '),
         };
       }
       this.setState({ data, geojson });
     }
   }

   deleteArea=() => {
     const { geojson } = this.state;

     if (geojson.features && geojson.features.length > 0) {
       this.setState({ data: {} });
       this.draw.deleteAll();
     }
   }

   fitToBoundingBox = (geojson) => {
     const bounds = bbox(geojson);
     this.map.fitBounds(bounds, { padding: 20 });
   }

   getBoundAreaCoordinates=(geojson) => {
     let allPoints = '';
     let sortedPoints;
     if (geojson.features && geojson.features.length > 0) {
       const coordinates = geojson.features[0].geometry.coordinates;
       for (let i = 0; i < coordinates.length; i++) {
         allPoints = coordinates[i].join(',');
       }
       const uniquePoints = [...new Set(allPoints.split(','))];
       sortedPoints = uniquePoints.sort();
     }

     return {
       upperLeft: [parseFloat(sortedPoints[3], 10).toFixed(2),
         parseFloat(sortedPoints[0], 10).toFixed(2)],
       lowerRight: [parseFloat(sortedPoints[0], 10).toFixed(2),
         parseFloat(sortedPoints[3], 10).toFixed(2)],
     };
   }

   handleShapeChange =(e) => {
     const shape = e.target.id;
     let defaultMode = '';
     if (shape === 'rectangle') defaultMode = 'draw_rectangle';
     else if (shape === 'circle') defaultMode = 'draw_circle';
     else if (shape === 'polygon') defaultMode = 'draw_polygon';
     this.setState({ shape, data: {} });

     this.draw.deleteAll();
     this.draw.changeMode(defaultMode);
   }

   render() {
     const { data } = this.state;
     
     return (
       <Map
         fitToBoundingBox={this.fitToBoundingBox}
         handleShapeChange={this.handleShapeChange}
         deleteArea={this.deleteArea}
         data={data}
       />
     );
   }
}
