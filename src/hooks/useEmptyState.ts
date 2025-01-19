import {StateObject} from "../stateObject";
import {EmptyState} from "../implementations/emptyState";

/**
 * Hook that initializes a StateObject with an empty state.
 * This is useful as a fallback when no valid state is available.
 *
 * @template T - The type of the value that could be held by the state.
 * @returns A StateObject representing an empty state.
 */
export function useEmptyState<T>(): StateObject<T> {
    return new EmptyState<T>();  // Returns a new EmptyState object.
}