export const fun1 = jest.mock('mapbox-gl/dist/mapbox-gl', () => ({
    GeolocateControl: jest.fn(),
    Map: jest.fn(() => ({
      addControl: jest.fn(),
      on: jest.fn(),
      remove: jest.fn()
    })),
    NavigationControl: jest.fn()
  }));

  export const fun2 = jest.mock('mapbox-gl-draw-circle', () => ({
    Map: () => ({})

  }));


