export function createHooks(callback) {
  let _val = [];
  let currentStateKey = 0;
  let _memoVal;
  let _memoRefs = [];
  const useState = (initState) => {
    if (_val.length === currentStateKey) {
      _val.push(initState);
    }
    let state = _val[currentStateKey];

    const setState = (newState) => {
      if (newState === state) return;
      _val[currentStateKey] = newState;

      callback();
    };
    currentStateKey += 1;
    return [state, setState];
  };

  const useMemo = (fn, refs) => {
    if (refs.every((item, idx) => item === _memoRefs[idx])) {
      return _memoVal;
    }
    _memoRefs = refs;
    _memoVal = fn();
    return fn();
  };

  const resetContext = () => {
    currentStateKey = 0;
  };

  return { useState, useMemo, resetContext };
}
