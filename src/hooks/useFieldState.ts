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
 * Hook that remaps the keys of a state object to a record of StateObjects.
 *
 * @template TOriginal - The type of the original state object.
 * @template TField - The type of the field value to be derived.
 * @param state - The StateObject containing the original state.
 * @returns A record where each key is mapped to a new StateObject for the corresponding field.
 */

export function useRemapKeysState<TOriginal extends object, TField>(state: StateObject<TOriginal>): Record<keyof TOriginal, StateObject<TField>> {
    // si state no tiene valor, retornar un invalid

    if (!state.hasValue) {
        return {} as Record<keyof TOriginal, StateObject<TField>>;
    }

    if (Array.isArray(state.value)) {
        console.warn('useRemapKeysState should be used with objects, use useRemapArray for arrays');
        return {} as Record<keyof TOriginal, StateObject<TField>>;
    }

    const keys = Object.keys(state.value) as (keyof TOriginal)[];
    
    return keys.reduce((acc, key) => {
            acc[key] = useFieldState(state, key as ValidFieldFrom<TOriginal, TField>);
            return acc;
        }
        , {} as Record<keyof TOriginal, StateObject<TField>>);
}

 

    