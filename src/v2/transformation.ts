import { StateObject } from "../stateObject";
import { EmptyState } from "../implementations/emptyState";
import { ValidState } from "../implementations/validState";



// En el nuevo esquema del state object, no vamos a usar hooks para las transformaciones, 
// solo para crear state objects cuando se requiere usar internamente un useState


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
function nullSafety<TOrigin>(state: StateObject<TOrigin | undefined | null>): StateObject<TOrigin> {

    if (!state.hasValue) return new EmptyState<TOrigin>();

    if (state.value === undefined) return new EmptyState<TOrigin>();

    if (state.value === null) return new EmptyState<TOrigin>();

    return new ValidState<TOrigin>(state.value, (value: TOrigin) => state.value = value);
}

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

function elementAt<T>(state: StateObject<T[]>, index: number): StateObject<T> {
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
export function remapArray<T>(state: StateObject<T[]>): StateObject<T>[] {
    if (!state.hasValue) return []  // Returns an empty array if the state has no value.

    const count = state.value.length
    const result: StateObject<T>[] = []

    for (let i = 0; i < count; i++) {
        result.push(
            new ValidState<T>(
                state.value[i],  // The current value of the element at index i.
                (newElement) => {  // Setter to update the element at index i in the array.
                    const arrayCopy = [...state.value];  // Create a copy of the original array.
                    arrayCopy[i] = newElement;  // Replace the element at index i with the new element.
                    state.value = arrayCopy;  // Update the state with the new array, triggering a re-render.
                }
            )
        )
    }

    return result  // Return the array of StateObjects representing each element.
}


export const TransformState = {
    nullSafety,
    elementAt,
    remapArray,
}