import { createStore } from "redux";
import { persistStore, persistReducer } from "redux-persist";
// import AsyncStorage from "@callstack/async-storage";

import rootReducer from "./reducer/index";
import AsyncStorage from "@react-native-async-storage/async-storage";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
// Redux persist
const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  stateReconciler: autoMergeLevel2,
};
const pReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(pReducer);
export const persistor = persistStore(store);

// const persistedReducer = persistReducer(persistConfig, rootReducer);

// // Creates the Redux store using our reducer and the logger and saga middlewares
// export const store = createStore(persistedReducer);
// export const persistor = persistStore(store);
