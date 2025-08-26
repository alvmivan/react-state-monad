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
  return keys.reduce(
    (acc, key) => {
      acc[key] = state.getField(key);
      return acc;
    },
    {}
  );
}

// src/implementations/emptyState.ts
var EmptyState = class {
  // No value stored, returns an error when accessed.
  get value() {
    throw new Error("The state is empty");
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
    return this;
  }
  map() {
    return this;
  }
  getField() {
    return this;
  }
  getFieldsByKeys() {
    return {};
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
  getField(field) {
    if (!this.state) {
      throw new Error("State is invalid");
    }
    if (typeof this.state !== "object") {
      throw new Error("State is not an object");
    }
    if (!this.state.hasOwnProperty(field)) {
      throw new Error("Field does not exist");
    }
    return this.map(
      (original) => original[field],
      // Extracts the field value.
      (newField, original) => ({ ...original, [field]: newField })
      // Updates the field with the new value.
    );
  }
  getFieldsByKeys() {
    const state = this;
    if (!state.hasValue) {
      return {};
    }
    if (Array.isArray(state.value)) {
      console.warn("getFieldsByKeys should be used with objects, use remapArray for arrays");
      return {};
    }
    const keys = Object.keys(state.value);
    return keys.reduce(
      (acc, key) => {
        acc[key] = state.getField(key);
        return acc;
      },
      {}
    );
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
function newStateObject(state, setState) {
  return new ValidState(state, setState);
}

// src/hooks/useArrayState.ts
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

// src/v2/creation.ts
var genericEmptyState = Object.freeze(new EmptyState());
function emptyState() {
  return genericEmptyState;
}
function newStateObject2(state, setState) {
  return new ValidState(state, setState);
}
var CreateState = {
  newStateObject: newStateObject2,
  emptyState
};

// src/v2/transformation.ts
function nullSafety(state) {
  if (!state.hasValue) return new EmptyState();
  if (state.value === void 0) return new EmptyState();
  if (state.value === null) return new EmptyState();
  return new ValidState(state.value, (value) => state.value = value);
}
function elementAt(state, index) {
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
function remapArray(state) {
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
var TransformState = {
  nullSafety,
  elementAt,
  remapArray
};

// src/index.ts
var index_default = void 0;
export {
  CreateState,
  TransformState,
  index_default as default,
  newStateObject,
  remapArray,
  useArrayState,
  useElementState,
  useEmptyState,
  useFieldState,
  useNullSafety,
  useRemapArray,
  useRemapKeysState,
  useStateObject
};
