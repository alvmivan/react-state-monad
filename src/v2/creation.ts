import { StateObject } from "../stateObject";
import { EmptyState } from "../implementations/emptyState";
import { ValidState } from "../implementations/validState";






// state creation


/**
 * Function that initializes a StateObject with an empty state.
 * This is useful as a fallback when no valid state is available.
 *  
 * formerly hook: `useEmptyState`
 * 
 * @template T - The type of the value that could be held by the state.
 * @returns A StateObject representing an empty state.
 */

const genericEmptyState = Object.freeze(new EmptyState<any>());

function emptyState<T>(): StateObject<T> {
    //returns always the same empty state as it's stateless and inmutable
    return genericEmptyState;
}


/**
 * Function that initializes a new StateObject responding to the given state and setState.
 *
 * @template T - The type of the value to be stored in the state.
 * @param state current state
 * @param setState function to modify the current state
 * @returns A StateObject representing the state.
 */
function newStateObject<T>(state:T, setState : (newState:T)=>void ) : StateObject<T>{
    return new ValidState<T>(state, setState);  // Returns a new ValidState object with the initial state value.   
}


export const CreateState = {
    newStateObject,
    emptyState

}