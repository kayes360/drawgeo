import { POLYGON_ADDED, POLYGON_COLOR_EDITED, POLYGON_DELETED } from "./actionTypes";

export const polygon_added = (polygon) => {
  return {
    type: POLYGON_ADDED,
    payload: polygon,
  };
};
export const polygon_color_edited = (id, colorType, colorValue) => {
    return {
      type: POLYGON_COLOR_EDITED,
      payload: { id, colorType, colorValue },
    };
  };
export const polygon_deleted = (polygonId) => {
  return {
    type: POLYGON_DELETED,
    payload: polygonId,
  };
};
