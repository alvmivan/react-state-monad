import {StateObject} from "../stateObject";
import {ValidFieldFrom} from "./types";

/**
 * Hook that derives a field from the state object and creates a new StateObject for the field's value.
 *
 * @template TOriginal - The type of the original state object.
 * @template TField - The type of the field value to be derived.
 * @param state - The StateObject containing the original state.
 * @param field - The field name to be derived from the state.
 * @returns A new StateObject for the derived field.
 */
export function useFieldState<TOriginal, TField>(
    state: StateObject<TOriginal>,
    field: ValidFieldFrom<TOriginal, TField>
): StateObject<TField> {
    return state.map(
        (original) => original[field] as TField,  // Extracts the field value.
        (newField, original) => ({...original, [field]: newField} as TOriginal)  // Updates the field with the new value.
    );
}

/**
 * Hook that remaps the keys of an object within a StateObject to a Map of StateObjects,
 * allowing for independent updates of each key while keeping the overall object state synchronized.
 *
 * @template TOriginal - The type of the original state object.
 * @param state - The StateObject containing the original object.
 * @returns A Map where each key is mapped to a new StateObject representing the value of that key,
 *          allowing individual updates while keeping the object state synchronized.
 */

export function useRemapKeysState<TOriginal extends object, TField>(state: StateObject<TOriginal>): Map<string, StateObject<TField>> {
    // si state no tiene valor, retornar un invalid

    if (!state.hasValue) {
        return new Map<string, StateObject<TField>>();
    }

    if (Array.isArray(state.value)) {
        console.warn('useRemapKeysState should be used with objects, use useRemapArray for arrays');
        return new Map<string, StateObject<TField>>();
    }

    const keys = Object.keys(state.value);

    const map = new Map<string, StateObject<TField>>();

    keys.forEach((key) => {
        map.set(key, useFieldState(state, key as ValidFieldFrom<TOriginal, TField>));
    });

    return map;
}

 

    