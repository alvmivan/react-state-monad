/**
 * Represents a state object that holds a value of type T, allowing various state operations.
 * This is the main interface for managing state, with operations like `map`, `filter`, and `flatMap`.
 * initialize with useStateObject<T>(initialState: T) hook
 * @template T - The type of the value stored in the state object.
 */
export type StateObject<T> = {
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
    map<U>(
        mappingFunction: (t: T) => U,
        inverseMappingFunction: (u: U, t: T) => T
    ): StateObject<U>;

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
    flatMap<U>(
        mappingFunction: (t: T) => StateObject<U>
    ): StateObject<U>;
}