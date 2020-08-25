import React from 'react';
import './App.css';
import { useDispatch, useSelector } from "react-redux";

const genClasses = (steps) => {
  return Object.entries(steps).reduce(
    (acc, [stepName, stepData]) => {
      const { inprogress, finished } = stepData;
      if (inprogress) {
        acc[stepName] = "active";
      } else if (finished) {
        acc[stepName] = "finished";
      }
      return acc;
    },
    {}
  );
};

function App() {
  const dispatch = useDispatch();
  const value = useSelector(state => state.number);
  const steps = useSelector(state => state.phases);
  const { inc, x2, toString, toDollar } = genClasses(steps);

  return (
    <div className="App">
      <div>
        <button
          onClick={() => dispatch({ type: "JOB/START", payload: value })}
        >
          Start Job
      </button>
      </div>
      <div>
        <h4>Phases</h4>
        <div className="phases-container">
          <div className={`phase ${inc}`}>inc</div>
          <div className={`phase ${x2}`}>x2</div>
          <div className={`phase ${toString}`}>to string</div>
          <div className={`phase ${toDollar}`}>to dollar</div>
        </div>
      </div>
      <div>
        <span>Number: {value}</span>
      </div>

    </div>
  );
}

export default App;
