import {StateObject} from "../stateObject";
import {ValidState} from "../implementations/validState";
import {EmptyState} from "../implementations/emptyState";

/**
 * Hook that ensures a StateObject contains a defined, non-null value.
 * If the StateObject's value is `undefined` or `null`, it returns an EmptyState.
 * Otherwise, it returns a ValidState with the value and a setter to update the value.
 *
 * @template TOrigin - The type of the value contained in the StateObject.
 * @param state - The StateObject which may contain a value, `undefined`, or `null`.
 * @returns A new StateObject containing the value if it is defined and non-null,
 *          otherwise an EmptyState.
 */
export function useNullSafety<TOrigin>(state: StateObject<TOrigin | undefined | null>): StateObject<TOrigin> {

    if (!state.hasValue) return new EmptyState<TOrigin>();

    if (state.value === undefined) return new EmptyState<TOrigin>();

    if (state.value === null) return new EmptyState<TOrigin>();

    return new ValidState<TOrigin>(state.value, (value: TOrigin) => state.value = value);
}