import {
  POLYGON_ADDED,
  POLYGON_AREA_EDITED,
  POLYGON_COLOR_EDITED,
  POLYGON_DELETED,
} from "./actionTypes";
const initialState = [{
    "id": 167,
    "latlngs": [
      {
        "lat": 23.890560666225397,
        "lng": 90.42984008789064
      },
      {
        "lat": 23.8795811377908,
        "lng": 90.42657852172853
      },
      {
        "lat": 23.87471847756018,
        "lng": 90.44305801391603
      }
    ],
    "area": "1112445.16"
  },
  {
    "id": 200,
    "latlngs": [
      {
        "lat": 23.87252237757856,
        "lng": 90.42898178100587
      },
      {
        "lat": 23.861698197743152,
        "lng": 90.42469024658203
      },
      {
        "lat": 23.862011954817937,
        "lng": 90.44305801391603
      }
    ],
    "area": "1116396.15"
  },
  {
    "id": 231,
    "latlngs": [
      {
        "lat": 23.89542273111458,
        "lng": 90.39310455322267
      },
      {
        "lat": 23.8816203733226,
        "lng": 90.37885665893556
      },
      {
        "lat": 23.877385230117007,
        "lng": 90.40391921997072
      }
    ],
    "area": "2296464.34"
  }];

const mapReducer = (state = initialState, action) => {
  switch (action.type) {
    case POLYGON_ADDED:
      return Array.isArray(action.payload)
        ? [...state, ...action.payload]
        : [...state, action.payload];

    case POLYGON_AREA_EDITED:
      return state.map((polygon) =>
        polygon.id === action.payload.id
          ? { ...polygon, latlngs: action.payload.latlngs }
          : polygon
      );
    case POLYGON_COLOR_EDITED: {
      const { id, colorType, colorValue } = action.payload;
      return state.map((polygon) =>
        polygon.id === id
          ? {
              ...polygon,
              [colorType === "stroke" ? "strokeColor" : "fillColor"]:
                colorValue,
            }
          : polygon
      );
    }
    case POLYGON_DELETED:
      return state.filter((polygon) => polygon.id !== action.payload);

    default:
      return state;
  }
};
export default mapReducer;
