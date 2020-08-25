import { createStore, applyMiddleware } from "redux";
import { createEpicMiddleware } from "redux-observable";

import { rootEpic, rootReducer } from "./index";

// middleware
import jobMiddleware from "./middleware";

// RObservable-middleware
const epicMiddleware = createEpicMiddleware();

// store
const store = createStore(
  rootReducer,
  applyMiddleware(epicMiddleware, jobMiddleware)
);

// run our epics
epicMiddleware.run(rootEpic);

export default store;
