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

/**
 * Function that initializes a new StateObject responding to the given state and setState.
 *
 * @template T - The type of the value to be stored in the state.
 * @param state current state
 * @param setState function to modify the current state
 * @returns A StateObject representing the state.
 */
export function newStateObject<T>(state:T, setState : (newState:T)=>void ) : StateObject<T>{
    return new ValidState<T>(state, setState);  // Returns a new ValidState object with the initial state value.   
}
