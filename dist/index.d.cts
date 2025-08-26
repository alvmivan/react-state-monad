/**
 * Helper type that ensures a field is a valid key of an object and that the field's type matches the expected type.
 *
 * @template TObject - The object type.
 * @template TField - The expected type of the field.
 */
type ValidFieldFrom<TObject, TField> = {
    [Key in keyof TObject]: TObject[Key] extends TField ? Key : never;
}[keyof TObject];

/**
 * Represents a state object that holds a value of type T, allowing various state operations.
 * This is the main interface for managing state, with operations like `map`, `filter`, and `flatMap`.
 * initialize with useStateObject<T>(initialState: T) hook
 * @template T - The type of the value stored in the state object.
 */
type StateObject<T> = {
    /**
     * The current value of the state.
     */
    get value(): T;
    /**
     * Returns true if the state has a valid value, false otherwise.
     */
    get hasValue(): boolean;
    /**
     * Performs an action on the current state value.
     *
     * @param action - A function that accepts the current state value and performs some operation.
     */
    do(action: (t: T) => void): void;
    /**
     * Sets a new value for the state.
     *
     * @param newState - The new state value to set.
     */
    set value(newState: T);
    /**
     * Transforms the current state into another state object by applying a mapping function.
     *
     * @template U - The type of the new state value.
     * @param mappingFunction - A function that transforms the current state value into a new value.
     * @param inverseMappingFunction - A function that transforms a new value back to the original state type.
     * @returns A new StateObject with the transformed value.
     */
    map<U>(mappingFunction: (t: T) => U, inverseMappingFunction: (u: U, t: T) => T): StateObject<U>;
    /**
     * Filters the state based on a predicate, returning an empty state if the predicate is not satisfied.
     *
     * @param predicate - A function that tests the current state value.
     * @returns A new StateObject with the original value or an empty state.
     */
    filter(predicate: (t: T) => boolean): StateObject<T>;
    /**
     * Returns the current state value if it exists; otherwise, returns the provided alternative value.
     *
     * @param orElse - The value to return if the state does not have a valid value.
     * @returns The current state value or the provided fallback value.
     */
    orElse(orElse: T): T;
    /**
     * Transforms the current state into another state object by applying a mapping function that returns a new state.
     *
     * @template U - The type of the new state value.
     * @param mappingFunction - A function that transforms the current state value into another state object.
     * @returns A new StateObject based on the result of the mapping function.
     */
    flatMap<U>(mappingFunction: (t: T) => StateObject<U>): StateObject<U>;
    /**
     * derives a field from the state object and creates a new StateObject for the field's value.
     *
     * formerly hook: `useFieldState(state, field)`
     
    
    * @template TField - The type of the field value to be derived.
    * @param state - The StateObject containing the original state.
    * @param field - The field name to be derived from the state.
    * @returns A new StateObject for the derived field.
    */
    getField<TField>(field: ValidFieldFrom<T, TField>): StateObject<TField>;
    /**
     * Remaps the keys of a state object to a record of StateObjects.
     *
     * @template TField - The type of the field value to be derived.
     * @param state - The StateObject containing the original state.
     * @returns A record where each key is mapped to a new StateObject for the corresponding field.
    */
    getFieldsByKeys<TField>(keys: (keyof T)[]): Record<keyof T, StateObject<TField>>;
};

/**
 * (DEPRECATED) -> it doesn't need to be a hook, and that complicates its usage
 * Hook that derives a field from the state object and creates a new StateObject for the field's value.
 *
 * @deprecated do stateObject.getField() instead
 * @template TOriginal - The type of the original state object.
 * @template TField - The type of the field value to be derived.
 * @param state - The StateObject containing the original state.
 * @param field - The field name to be derived from the state.
 * @returns A new StateObject for the derived field.
 */
declare function useFieldState<TOriginal, TField>(state: StateObject<TOriginal>, field: ValidFieldFrom<TOriginal, TField>): StateObject<TField>;
/**
 * (DEPRECATED) -> it doesn't need to be a hook, and that complicates its usage
 * Hook that remaps the keys of a state object to a record of StateObjects.
 *
 * @deprecated do stateObject.getFieldsByKeys() instead
 * @template TOriginal - The type of the original state object.
 * @template TField - The type of the field value to be derived.
 * @param state - The StateObject containing the original state.
 * @returns A record where each key is mapped to a new StateObject for the corresponding field.
 */
declare function useRemapKeysState<TOriginal extends object, TField>(state: StateObject<TOriginal>): Record<keyof TOriginal, StateObject<TField>>;

/**
 * (DEPRECATED) -> it doesn't need to be a hook, and that complicates its usage
 *
 * Hook that allows you to derive and update a specific element in an array within a StateObject.
 *
 * @deprecated use TransformState.elementAt instead
 * @template T - The type of the array elements.
 * @param state - The StateObject containing an array.
 * @param index - The index of the element to be derived.
 * @returns A new StateObject representing the element at the given index.
 */
declare function useElementState<T>(state: StateObject<T[]>, index: number): StateObject<T>;

/**
 * (DEPRECATED) -> it doesn't need to be a hook, and that complicates its usage
 * Hook that initializes a StateObject with an empty state.
 * This is useful as a fallback when no valid state is available.
 *
 * @deprecated use CreateState.emptyState instead
 * @template T - The type of the value that could be held by the state.
 * @returns A StateObject representing an empty state.
 */
declare function useEmptyState<T>(): StateObject<T>;

/**
 * (DEPRECATED) -> it doesn't need to be a hook, and that complicates its usage
 *
 * Hook that maps each element in an array within a StateObject to a new StateObject,
 * allowing for independent updates of each element while keeping the overall array state synchronized.
 *
 * @deprecated use TransformState.remapArray instead
 * @template T - The type of the array elements.
 * @param state - The StateObject containing an array.
 * @returns An array of new StateObjects, each representing an element in the original array,
 *          allowing individual updates while keeping the array state synchronized.
 */
declare function useRemapArray<T>(state: StateObject<T[]>): StateObject<T>[];
/**
 * Hook that takes an array of StateObjects and returns a new StateObject containing that array,
 * allowing for updates to the entire array while keeping it synchronized within a single StateObject.
 *
 * @template T - The type of the elements in the array.
 * @param states - The array of StateObjects.
 * @returns A new StateObject containing the array of StateObjects, allowing for updates to the whole array.
 */
declare function useArrayState<T>(states: StateObject<T>[]): StateObject<T[]>;

/**
 * Hook that initializes a StateObject with the given initial value.
 *
 * @template T - The type of the value to be stored in the state.
 * @param initialState - The initial value of the state.
 * @returns A StateObject representing the initialized state.
 */
declare function useStateObject<T>(initialState: T): StateObject<T>;
/**
 * Function that initializes a new StateObject responding to the given state and setState.
 *
 * @template T - The type of the value to be stored in the state.
 * @param state current state
 * @param setState function to modify the current state
 * @returns A StateObject representing the state.
 */
declare function newStateObject$1<T>(state: T, setState: (newState: T) => void): StateObject<T>;

/**
 * Hook that ensures a StateObject contains a defined, non-null value.
 * If the StateObject's value is `undefined` or `null`, it returns an EmptyState.
 * Otherwise, it returns a ValidState with the value and a setter to update the value.
 *
 * @template TOrigin - The type of the value contained in the StateObject.
 * @param state - The StateObject which may contain a value, `undefined`, or `null`.
 * @returns A new StateObject containing the value if it is defined and non-null,
 *          otherwise an EmptyState.
 */
declare function useNullSafety<TOrigin>(state: StateObject<TOrigin | undefined | null>): StateObject<TOrigin>;

declare function emptyState<T>(): StateObject<T>;
/**
 * Function that initializes a new StateObject responding to the given state and setState.
 *
 * @template T - The type of the value to be stored in the state.
 * @param state current state
 * @param setState function to modify the current state
 * @returns A StateObject representing the state.
 */
declare function newStateObject<T>(state: T, setState: (newState: T) => void): StateObject<T>;
declare const CreateState: {
    newStateObject: typeof newStateObject;
    emptyState: typeof emptyState;
};

/**
 * Function that ensures a StateObject contains a defined, non-null value.
 * If the StateObject's value is `undefined` or `null`, it returns an EmptyState.
 * Otherwise, it returns a ValidState with the value and a setter to update the value.
 *
 * formerly hook: `useNullSafety(state)`
 *
 * @template TOrigin - The type of the value contained in the StateObject.
 * @param state - The StateObject which may contain a value, `undefined`, or `null`.
 * @returns A new StateObject containing the value if it is defined and non-null,
 *          otherwise an EmptyState.
 */
declare function nullSafety<TOrigin>(state: StateObject<TOrigin | undefined | null>): StateObject<TOrigin>;
/**
 * Function that allows you to derive and update a specific element in an array within a StateObject.
 *
 * formerly hook: `useElementState(state, index)`
 *
 * @template T - The type of the array elements.
 * @param state - The StateObject containing an array.
 * @param index - The index of the element to be derived.
 * @returns A new StateObject representing the element at the given index.
 */
declare function elementAt<T>(state: StateObject<T[]>, index: number): StateObject<T>;
/**
 * Function that maps each element in an array within a StateObject to a new StateObject,
 * allowing for independent updates of each element while keeping the overall array state synchronized.
 *
 * formerly hook: `useRemapArray`
 *
 * @template T - The type of the array elements.
 * @param state - The StateObject containing an array.
 * @returns An array of new StateObjects, each representing an element in the original array,
 *          allowing individual updates while keeping the array state synchronized.
 */
declare function remapArray<T>(state: StateObject<T[]>): StateObject<T>[];
declare const TransformState: {
    nullSafety: typeof nullSafety;
    elementAt: typeof elementAt;
    remapArray: typeof remapArray;
};

declare const _default: undefined;

export { CreateState, type StateObject, TransformState, _default as default, newStateObject$1 as newStateObject, remapArray, useArrayState, useElementState, useEmptyState, useFieldState, useNullSafety, useRemapArray, useRemapKeysState, useStateObject };
