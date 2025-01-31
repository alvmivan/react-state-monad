"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  default: () => index_default,
  useArrayState: () => useArrayState,
  useElementState: () => useElementState,
  useEmptyState: () => useEmptyState,
  useFieldState: () => useFieldState,
  useNullSafety: () => useNullSafety,
  useRemapArray: () => useRemapArray,
  useRemapKeysState: () => useRemapKeysState,
  useStateObject: () => useStateObject
});
module.exports = __toCommonJS(index_exports);

// src/hooks/useFieldState.ts
function useFieldState(state, field) {
  return state.map(
    (original) => original[field],
    // Extracts the field value.
    (newField, original) => ({ ...original, [field]: newField })
    // Updates the field with the new value.
  );
}
function useRemapKeysState(state) {
  if (!state.hasValue) {
    return {};
  }
  if (Array.isArray(state.value)) {
    console.warn("useRemapKeysState should be used with objects, use useRemapArray for arrays");
    return {};
  }
  const keys = Object.keys(state.value);
  return keys.reduce((acc, key) => {
    acc[key] = useFieldState(state, key);
    return acc;
  }, {});
}

// src/implementations/emptyState.ts
var EmptyState = class _EmptyState {
  // No value stored, returns an error when accessed.
  get value() {
    throw new Error("Not implemented");
  }
  get hasValue() {
    return false;
  }
  orElse(orElse) {
    return orElse;
  }
  do() {
  }
  filter() {
    return this;
  }
  set value(_) {
  }
  flatMap() {
    return new _EmptyState();
  }
  map() {
    return new _EmptyState();
  }
};

// src/implementations/validState.ts
var ValidState = class _ValidState {
  state;
  setter;
  constructor(state, setter) {
    this.state = state;
    this.setter = setter;
  }
  get value() {
    return this.state;
  }
  do(action) {
    action(this.state);
  }
  orElse() {
    return this.state;
  }
  set value(newState) {
    this.setter(newState);
  }
  map(mappingFunction, inverseMappingFunction) {
    const derivedState = mappingFunction(this.state);
    const derivedSetter = (newState) => {
      this.setter(inverseMappingFunction(newState, this.state));
    };
    return new _ValidState(derivedState, derivedSetter);
  }
  flatMap(mappingFunction) {
    return mappingFunction(this.state);
  }
  get hasValue() {
    return true;
  }
  filter(predicate) {
    return predicate(this.state) ? this : new EmptyState();
  }
};

// src/hooks/useElementState.ts
function useElementState(state, index) {
  if (!state.hasValue || index < 0 || index >= state.value.length) {
    return new EmptyState();
  }
  return new ValidState(
    state.value[index],
    (newElement) => {
      const arrayCopy = [...state.value];
      arrayCopy[index] = newElement;
      state.value = arrayCopy;
    }
  );
}

// src/hooks/useEmptyState.ts
function useEmptyState() {
  return new EmptyState();
}

// src/hooks/useStateObject.ts
var import_react = require("react");
function useStateObject(initialState) {
  const [state, setState] = (0, import_react.useState)(initialState);
  return new ValidState(state, setState);
}

// src/hooks/useRemapArray.ts
function useRemapArray(state) {
  if (!state.hasValue) return [];
  const count = state.value.length;
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(
      new ValidState(
        state.value[i],
        // The current value of the element at index i.
        (newElement) => {
          const arrayCopy = [...state.value];
          arrayCopy[i] = newElement;
          state.value = arrayCopy;
        }
      )
    );
  }
  return result;
}
function useArrayState(states) {
  return useStateObject(states.filter((state) => state.hasValue).map((state) => state.value));
}

// src/hooks/useNullSafety.ts
function useNullSafety(state) {
  if (!state.hasValue) return new EmptyState();
  if (state.value === void 0) return new EmptyState();
  if (state.value === null) return new EmptyState();
  return new ValidState(state.value, (value) => state.value = value);
}

// src/index.ts
var index_default = void 0;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useArrayState,
  useElementState,
  useEmptyState,
  useFieldState,
  useNullSafety,
  useRemapArray,
  useRemapKeysState,
  useStateObject
});
