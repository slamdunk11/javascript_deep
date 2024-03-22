import { createHooks } from "./hooks";
import { render as updateElement } from "./render";

function MyReact() {
  const options = {
    root: null,
    rootComponent: null,
  };
  const _render = () => {
    if (!options.root || !options.rootComponent) return;
    // options.root.innerHTML = options.rootComponent();
    updateElement(options.root, options.rootComponent());
    // resetHookContext();
  };
  function render($root, rootComponent) {
    options.root = $root;
    options.rootComponent = rootComponent;
    _render();
  }

  const {
    useState,
    useMemo,
    resetContext: resetHookContext,
  } = createHooks(_render);

  return { render, useState, useMemo };
}

export default MyReact();
