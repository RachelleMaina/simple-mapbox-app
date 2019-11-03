/* eslint-disable no-undef */
import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { testSetup } from '../data/testSetup'
import Map from '../components/Map';
import MapView from '../containers/MapView';

configure({ adapter: new Adapter() });
window.URL.createObjectURL = jest.fn();

let props={
  deleteArea: jest.fn(),
   handleShapeChange:jest.fn(),
   data: {},
}

describe('Map component', () => {

  beforeEach(() => {
   
  });

  it('renders correctly', () => {
    let component = mount(<Map {...props}/>);
    expect(component.length).toBe(1);
  });
});



describe('MapView container', () => {

  beforeEach(() => {
   
  });

  it('renders correctly', () => {
    let component = mount(<MapView />);
    expect(component.length).toBe(1);
  });
});