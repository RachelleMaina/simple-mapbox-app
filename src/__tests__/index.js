import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { testSetup } from '../data/testSetup'
import Map from '../components/Map';
import MapView from '../containers/MapView';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import {
  CircleMode,
  DragCircleMode,
  DirectMode,
  SimpleSelectMode,
} from 'mapbox-gl-draw-circle';
import DrawRectangle from 'mapbox-gl-draw-rectangle-mode';

configure({ adapter: new Adapter() });
window.URL.createObjectURL = jest.fn();

describe('Map component', () => {
  let props={
    deleteArea: jest.fn(),
     handleShapeChange:jest.fn(),
     data: {},
  }

  it('renders correctly', () => {
    let component = mount(<Map {...props}/>);
    expect(component.length).toBe(1);
  });
});

describe('MapView container', () => {
 
    let draw = new MapboxDraw({
      defaultMode: 'simple_select',
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
    });

   let component = mount(<MapView /> );

  it('renders correctly', () => {
    expect(component.length).toBe(1);
  });

  it('call class methods', () => {
    const spy1 = jest.spyOn(component.instance(), 'createMap');
    const spy2 = jest.spyOn(component.instance(), 'initializeDrawToolbox');
    const spy3 = jest.spyOn(component.instance(), 'deleteArea');
    const spy6 = jest.spyOn(component.instance(), 'handleShapeChange');
    const spy7 = jest.spyOn(component.instance(), 'updateArea');
   
    spy6.mockImplementation((draw) => {draw});
    spy7.mockImplementation((draw) => {draw})
    const event = { target: { id: 'rectangle' } };
    const choice = component.find('#rectangle').at(1);
    component.instance().handleShapeChange(event);

    component.instance().createMap();
    component.instance().initializeDrawToolbox('simple_select');
    component.instance().deleteArea();
    component.instance().updateArea();

    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledTimes(1);
    expect(spy3).toHaveBeenCalledTimes(1);
     expect(spy6).toHaveBeenCalledTimes(1);
     expect(spy7).toHaveBeenCalledTimes(1);

  });
});
