/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import {
  Container, Row, Col, Navbar, Button,
} from 'react-bootstrap';

const Map = ({ deleteArea, handleShapeChange, data }) => (
  <Container fluid>
    <Navbar>
      <Navbar.Brand href="#home">Simple Mapbox App</Navbar.Brand>
    </Navbar>
    <Row noGutters>
      <Col>

        <div id="map" />
        <div className="trash" role="button" onClick={deleteArea}>
          <i className="fas fa-trash" />
        </div>
        <div className="shape-btns-group">
          <Button className="shape-btn" id="rectangle" variant="outline-light" onClick={handleShapeChange}>Bounding Box</Button>
          <Button className="shape-btn" id="circle" variant="outline-light" onClick={handleShapeChange}>Circle </Button>
          <Button className="shape-btn" id="polygon" variant="outline-light" onClick={handleShapeChange}>Polygon </Button>
        </div>
        <div className="sidebar">

          <p><i className="fas fa-hand-pointer" /> Select an option to draw on the map.
          </p>

          {Object.keys(data).length && data.shape === 'rectangle' ? (
            <>
              <span> Upper Left Coordinates: {data.upperLeft} </span><br />
              <span> Lower Right Coordinates: {data.lowerRight} </span>
            </>
          ) : (
            null
          )}
          {Object.keys(data).length && data.shape === 'circle' ? (
            <>
              <span> Radius in KM: {data.radius} </span><br />
              <span> Center: {data.center} </span>
            </>
          ) : (
            null
          )}
          {Object.keys(data).length && data.shape === 'polygon' ? (
            <>
              <span> Coordinates: {data.coordinates} </span>
            </>
          ) : (
            null
          )}

        </div>
      </Col>
    </Row>

  </Container>
);
export default Map;
