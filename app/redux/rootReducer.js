import { combineReducers } from "redux";
import mapReducer from "./mapCRUD/reducer";

const rootReducer = combineReducers({
  mapData: mapReducer
});
export default rootReducer;
