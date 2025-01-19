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