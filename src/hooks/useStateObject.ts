import {StateObject} from "../stateObject";
import {useState} from "react";
import {ValidState} from "../implementations/validState";

/**
 * Hook that initializes a StateObject with the given initial value.
 *
 * @template T - The type of the value to be stored in the state.
 * @param initialState - The initial value of the state.
 * @returns A StateObject representing the initialized state.
 */
export function useStateObject<T>(initialState: T): StateObject<T> {
    const [state, setState] = useState<T>(initialState);
    return new ValidState<T>(state, setState);  // Returns a new ValidState object with the initial state value.
}