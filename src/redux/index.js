import { combineEpics, ofType, } from "redux-observable";
import { combineReducers } from "redux";
import { map, tap, withLatestFrom, mergeMap } from "rxjs/operators"
import { of } from "rxjs";

// epics
const incJob = (action$, state$) =>
  action$.pipe(
    ofType("JOB/INC"),
    tap((action) => console.log("ACTION", action)),
    withLatestFrom(state$),
    mergeMap(([_, state]) => {
      return of(
        { type: "SAVE", payload: state.number + 1 },
        { type: "JOB/SET_FINISHED", payload: { phase: "inc" } },
        { type: "JOB/CONTINUE" },
      )
    }));

const x2 = (action$, state$) =>
  action$.pipe(
    ofType("JOB/X2"),
    tap((action) => console.log("ACTION", action)),
    withLatestFrom(state$),
    mergeMap(([_, state]) => {
      return of(
        { type: "SAVE", payload: state.number * 2 },
        { type: "JOB/SET_FINISHED", payload: { phase: "x2" } },
        { type: "JOB/CONTINUE" },
      )
    })
  );

const toString = (action$, state$) =>
  action$.pipe(
    ofType("JOB/TO_STRING"),
    tap((action) => console.log("ACTION", action)),
    withLatestFrom(state$),
    mergeMap(([_, state]) => {
      return of(
        { type: "SAVE", payload: `${state.number}` },
        { type: "JOB/SET_FINISHED", payload: { phase: "toString" } },
        { type: "JOB/CONTINUE" },
      )
    })
  );

const toDollar = (action$, state$) =>
  action$.pipe(
    ofType("JOB/TO_DOLLAR"),
    tap((action) => console.log("ACTION", action)),
    withLatestFrom(state$),
    mergeMap(([_, state]) => {
      return of(
        { type: "SAVE", payload: `$${state.number}` },
        { type: "JOB/SET_FINISHED", payload: { phase: "toDollar" } }
      )
    })
  );

// reducers
const reducer = (state = 10, action) => {
  switch (action.type) {
    case "SAVE": return action.payload;
    default: return state;
  }
};

const phases = {
  inc: { inprogress: false, finished: false },
  x2: { inprogress: false, finished: false },
  toString: { inprogress: false, finished: false },
  toDollar: { inprogress: false, finished: false }
};

const phasesReducer = (state = phases, { type, payload }) => {
  switch (type) {
    case "JOB/SET_IN_PROGRESS": {
      const { phase } = payload;
      return {
        ...state,
        [phase]: {
          ...state[phase],
          inprogress: true,
        }
      }
    }
    case "JOB/SET_FINISHED": {
      const { phase } = payload;
      return {
        ...state,
        [phase]: {
          ...state[phase],
          inprogress: false,
          finished: true
        }
      }
    }
    default: return state;
  };
}

export const rootEpic = combineEpics(
  incJob,
  x2,
  toString,
  toDollar
);

export const rootReducer = combineReducers(
  { number: reducer, phases: phasesReducer }
);
