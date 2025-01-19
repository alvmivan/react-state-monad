import {EmptyState} from "./emptyState";
import {StateObject} from "../stateObject";

/**
 * Represents a state that holds a valid value of type T.
 * you should NEVER use this class directly, use the `StateObject` interface instead.
 * and create instances by using the hooks
 * @template T - The type of the value stored in the state.
 */
export class ValidState<T> implements StateObject<T> {
    private readonly state: T;
    private readonly setter: (state: T) => void;

    constructor(state: T, setter: (state: T) => void) {
        this.state = state;
        this.setter = setter;
    }

    get value(): T {
        return this.state;
    }

    do(action: (t: T) => void) {
        action(this.state);  // Performs the given action on the state value.
    }

    orElse() {
        return this.state;  // Returns the state value as it is valid.
    }

    set value(newState: T) {
        this.setter(newState);  // Sets a new value for the state.
    }

    map<U>(
        mappingFunction: (t: T) => U,
        inverseMappingFunction: (u: U, t: T) => T
    ): StateObject<U> {
        const derivedState = mappingFunction(this.state);
        const derivedSetter = (newState: U) => {
            this.setter(inverseMappingFunction(newState, this.state));  // Updates the state with the inverse mapping.
        };

        return new ValidState<U>(derivedState, derivedSetter);  // Returns a new state object with the transformed value.
    }

    flatMap<U>(
        mappingFunction: (t: T) => StateObject<U>
    ): StateObject<U> {
        return mappingFunction(this.state);  // Applies the mapping function and returns the result.
    }

    get hasValue(): boolean {
        return true;
    }

    filter(predicate: (t: T) => boolean): StateObject<T> {
        return predicate(this.state) ? (this as StateObject<T>) : new EmptyState<T>();  // Filters the state based on the predicate.
    }
}