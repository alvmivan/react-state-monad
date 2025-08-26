import {StateObject} from "../stateObject";
import {ValidState} from "../implementations/validState";
import {useStateObject} from "./useStateObject";

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
export function useRemapArray<T>(state: StateObject<T[]>): StateObject<T>[] {
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


/**
 * Hook that takes an array of StateObjects and returns a new StateObject containing that array,
 * allowing for updates to the entire array while keeping it synchronized within a single StateObject.
 *
 * @template T - The type of the elements in the array.
 * @param states - The array of StateObjects.
 * @returns A new StateObject containing the array of StateObjects, allowing for updates to the whole array.
 */
export function useArrayState<T>(states: StateObject<T>[]): StateObject<T[]> {

    return useStateObject(states.filter(state => state.hasValue).map(state => state.value));

}
