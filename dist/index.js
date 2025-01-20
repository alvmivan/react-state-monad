// src/hooks/useFieldState.ts
function useFieldState(state, field) {
  return state.map(
    (original) => original[field],
    // Extracts the field value.
    (newField, original) => ({ ...original, [field]: newField })
    // Updates the field with the new value.
  );
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
import { useState } from "react";
function useStateObject(initialState) {
  const [state, setState] = useState(initialState);
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

// src/index.ts
var index_default = void 0;
export {
  index_default as default,
  useArrayState,
  useElementState,
  useEmptyState,
  useFieldState,
  useRemapArray,
  useStateObject
};
