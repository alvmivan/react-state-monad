import {StateObject} from "../stateObject";
import {EmptyState} from "../implementations/emptyState";
import {ValidState} from "../implementations/validState";

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
export function useElementState<T>(state: StateObject<T[]>, index: number): StateObject<T> {
    if (!state.hasValue || index < 0 || index >= state.value.length) {
        return new EmptyState<T>();  // Returns an empty state if the index is out of bounds or state is empty.
    }

    return new ValidState<T>(
        state.value[index],
        (newElement) => {
            const arrayCopy = [...state.value];
            arrayCopy[index] = newElement;
            state.value = arrayCopy;
        }
    );
}