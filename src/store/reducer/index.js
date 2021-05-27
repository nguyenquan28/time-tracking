import { combineReducers } from "redux";
import loginReducer from "./login";
import CheckIn from "./checkIn";

const rootReducer = combineReducers({
  login: loginReducer,
  checkIn: CheckIn,
});
export default rootReducer;
