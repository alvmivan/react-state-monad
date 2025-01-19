# React State Monad

A set of hooks to manage/transform/filter states with monads in React.

## Description

`react-state-monad` provides a set of monadic state management utilities, specifically designed to work seamlessly with
React's state hooks. It allows you to manage, transform, and filter states in a functional and declarative way using
monads like `Maybe` and `Option`.

This library leverages the power of monads to encapsulate state changes, enabling a cleaner, more predictable way to
handle various state conditions in React.

## Features

- Manage state using monads like `Maybe` and `Option`.
- Simplify handling of undefined or null values in state.
- Leverage functional programming patterns in React state management.
- Support for TypeScript with full type definitions.

## Installation

You can install `react-state-monad` using npm or yarn:

```bash
npm install react-state-monad
```

or

```bash
yarn add react-state-monad
```

## Usage

Here's an example of how you can use the hooks in your React components:

### `useStateObject<T>`

This hook initializes a StateObject with the provided initial value. It uses React's useState hook to manage the
internal state and returns a StateObject that represents the current state.

Parameters: `initialState`: The initial value of the state. This value can be of any type, determined by the generic
type `T`.

Returns a `StateObject` of type `T` representing the initialized state. This `StateObject` is an instance
of `ValidState`, which
encapsulates the state value and provides a `setValue` function to update it.

### `useEmptyState<T>`

This hook initializes a `StateObject` with an empty state. It is useful as a fallback when no valid state is available.

Parameters: None.

Returns a `StateObject` of type `T` representing an empty state. This `StateObject` is an instance of `EmptyState`,
which encapsulates the absence of a state value.

### `useElementState<T>`

This hook allows you to derive and update a specific element in an array within a `StateObject`. It is useful for
managing state at a granular level within an array.

Parameters:

- `state`: The `StateObject` containing an array.
- `index`: The index of the element to be derived.

Returns a `StateObject` of type `T` representing the element at the given index. If the index is out of bounds or the
state is empty, it returns an instance of `EmptyState`. Otherwise, it returns an instance of `ValidState`, which
encapsulates the element value and provides a `setValue` function to update it.

### `useFieldState<TOriginal, TField>`

This hook derives a field from the state object and creates a new `StateObject` for the field's value. It is useful for
managing state at a granular level within an object.

Parameters:

- `state`: The `StateObject` containing the original state.
- `field`: The field name to be derived from the state.

Returns a `StateObject` of type `TField` representing the derived field. This `StateObject` is an instance
of `ValidState`, which encapsulates the field value and provides a `setValue` function to update it.

For example:

```jsx
import React from 'react';
import {useStateObject, useFieldState} from 'react-state-monad';

const MyComponent = () => {
    const userState = useStateObject({
        name: 'John Doe',
        age: 30,
    });

    const nameState = useFieldState(userState, 'name');
    const ageState = useFieldState(userState, 'age');

    return (
        <div>
            <input
                type="text"
                value={nameState.value}
                onChange={(e) => nameState.value = e.target.value}
            />
            <input
                type="number"
                value={ageState.value}
                onChange={(e) => ageState.value = parseInt(e.target.value, 10)}
            />
        </div>
    );
};

export default MyComponent;
```

### `useRemapArray<T>`

This hook maps each element in an array within a `StateObject` to a new `StateObject`, allowing for independent updates
of each element while keeping the overall array state synchronized.

Parameters:

- `state`: The `StateObject` containing an array.

Returns an array of new `StateObject`s, each representing an element in the original array. This allows individual
updates while keeping the array state synchronized. If the state has no value, it returns an empty array.

### Complete Example

Here's a more complete example demonstrating the usage of `useStateObject`, `useFieldState`, `useElementState`,
and `useRemapArray` hooks in a React component:

```tsx

const AgeField = (props: { ageState: StateObject<number> }) => <div>
    <label>Age:</label>
    <input
        type="number"
        value={props.ageState.value}
        onChange={x => props.ageState.value = parseInt(x.target.value, 10)}
    />
</div>;


const NameField = (props: { nameState: StateObject<string> }) => {
    return <div>
        <label>Name:</label>
        <input
            type="text"
            value={props.nameState.value}
            onChange={x => props.nameState.value = x.target.value}
        />
    </div>;
}

const HobbyField = (props: { hobbyState: StateObject<string> }) => {
    return <div>
        <input
            type="text"
            value={props.hobbyState.value}
            onChange={x => props.hobbyState.value = x.target.value}
        />
    </div>;
}

const HobbiesField = (props: { hobbiesState: StateObject<string[]> }) => {

    const hobbyStates: StateObject<string>[] = useRemapArray(props.hobbiesState);

    const addHobby = () => {
        // Always use the setter to update arrays, do not modify them directly to ensure React state consistency.
        // Immutability is key 💗
        props.hobbiesState.value = [...props.hobbiesState.value, ''];
    }

    return <div>
        <label>Hobbies:</label>
        {
            hobbyStates.map((hobbyState, index) => <HobbyField key={index} hobbyState={hobbyState}/>)
        }
        <button onClick={addHobby}>Add Hobby</button>
    </div>;


};

export const UserProfile = () => {

    type DudeData = {
        name: string;
        age: number;
        hobbies: string[];
    }
    // Initialize state with an object containing user details and an array of hobbies
    const userState: StateObject<DudeData> = useStateObject({
        name: 'John Doe',
        age: 30,
        hobbies: ['Reading', 'Traveling', 'Cooking'],
    });

    // Derive state for individual fields
    const nameState: StateObject<string> = useFieldState(userState, 'name');
    const ageState: StateObject<number> = useFieldState(userState, 'age');

    // Derive state for hobbies array
    const hobbiesState: StateObject<string[]> = useFieldState(userState, 'hobbies');


    return (
        <div>
            <h1>User Profile</h1>
            <NameField nameState={nameState}/>
            <AgeField ageState={ageState}/>
            <HobbiesField hobbiesState={hobbiesState}/>
        </div>
    );
};
```

## Contributing

Contributions are welcome! If you'd like to contribute to this library, please fork the repository and submit a pull
request.

How to Contribute
Fork the repository.

* Create a new branch for your feature `git checkout -b feature-name`
* Commit your changes `git commit -am 'Add new feature'`
* Push to the branch `git push origin feature-name`
* Open a pull request. I'll be happy to review it!

## License

This project is licensed under the GPL-3.0 License.

## Author

`Marcos Alvarez`

[<img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" width="38" height="38">](https://github.com/alvmivan)
[<img src="https://www.linkedin.com/favicon.ico" width="40" height="40">](https://www.linkedin.com/in/marcos-alvarez-40651b150/)
[<img src="https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico" width="40" height="40">](mailto:alvmivan@gmail.com)