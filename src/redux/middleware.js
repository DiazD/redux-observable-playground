import { of } from "rxjs";
import { delay } from "rxjs/operators";

const phases = [
  { type: "JOB/INC", name: "inc" },
  { type: "JOB/X2", name: "x2" },
  { type: "JOB/TO_STRING", name: "toString" },
  { type: "JOB/TO_DOLLAR", lastStep: true, name: "toDollar" }
]
let currentJob = 0;

const updateCurrentJob = (phase, ) => {
  if (!phase.lastStep) {
    currentJob += 1;
  } else {
    currentJob = 0;
  }
}

const startNextPhase = (dispatch, phase) => {
  dispatch({ type: "JOB/SET_IN_PROGRESS", payload: { phase: phase.name } });
  of(phase)
    .pipe(delay(2000))
    .subscribe((phase) => dispatch(phase));
}

const jobDispatchMiddleWare = (store) => (next) => (action) => {
  const { type } = action;

  if (type === "JOB/START") {
    const phase = phases[0];

    // update current job
    updateCurrentJob(phase);

    // set next action in progress
    startNextPhase(store.dispatch, phase);

  } else if (type === "JOB/CONTINUE") {
    const phase = phases[currentJob];

    // update current job
    updateCurrentJob(phase);

    // set next phase as in progress
    startNextPhase(store.dispatch, phase)
  }

  next(action);
};

export default jobDispatchMiddleWare;
