import {StateObject} from "../stateObject";

/**
 * Represents a state that holds no value and is considered "empty".
 * This is used as a fallback or default when there is no valid state.
 * you should NEVER use this class directly, use the `StateObject` interface instead.
 * and create instances by using the hooks
 * @template T - The type of the value that could be held by the state.
 */
export class EmptyState<T> implements StateObject<T> {
    // No value stored, returns an error when accessed.
    get value(): T {
        throw new Error("Not implemented");
    }

    get hasValue(): boolean {
        return false;
    }

    orElse(orElse: T): T {
        return orElse;  // Returns the fallback value when the state is empty.
    }

    do() {
        // No operation for empty state.
    }

    filter(): StateObject<T> {
        return this;  // The empty state remains unchanged when filtered.
    }

    set value(_: T) {
        // No operation for setting a value in the empty state.
    }

    flatMap<U>(): StateObject<U> {
        return new EmptyState<U>();  // Returns an empty state when flatMapped.
    }

    map<U>(): StateObject<U> {
        return new EmptyState<U>();  // Returns an empty state when mapped.
    }
}