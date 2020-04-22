## RTS Labs coding challenge

Problem statement:

- Build an application that lets the user search the Hacker News Algolia API and displays a list of results (https://hn.algolia.com/api)

- Save the user's search terms in the Redux state (don't need to persist across sessions). We're looking to see if what you know in React and Redux and querying an API. We're interested in whether you can write clean code and have the ability to learn/understand new technologies. We don't care about design/UI (for this project)

## Points of Interest in My Solution

### TypeScript

I bootstrapped the project with [Create React App](https://github.com/facebook/create-react-app) and a TypeScript CRA template. You will see TS throughout my solution.

### Redux "Ducks" Module

For the Redux state structure, I chose a pattern similar to the "ducks" pattern. The "ducks" pattern suggests that a given reducer and it's associated action types, action creators, and selectors should be colocated in a single file with the reducer function exported by default. This makes it abundantly clear what actions interact with a given slice of the store and how those actions affect the state. The Redux module for this application's state can be found [here](./src/store/hnSearch/hnSearch.ts). This Redux module is also tested with Jest [here](./src/store/hnSearch/hnSearch.test.ts).

### React Hooks

Despite using Redux, I thought it would be nice to illustrate some usage of the hooks api. This can be seen in the [App](./src/App.tsx) component, where the built-in `useState` hook is used to track the value of the search input field and two custom hooks are used to control the searching and Algolia API calls.

### `useHnSearch` Custom Hook

[This](./src/hooks/hnSearch/useHnSearch.ts) custom hook is used to call out to the Algolia API and make subsequent updates to the Redux store. It takes a search string as an argument. Whenever the search string argument changes, a new API request is made. Following each API request, an action from the [hnSearch Redux module](./src/store/hnSearch/hnSearch.ts) is dispatched to update the application state.

I could have used a side effect library like redux-thunk to achieve a similar outcome (updates to the search input would dispatch a thunk action, which would take care of the API request and `hnSearch` action dispatches), but wanted to showcase a different approach that takes cues from both a traditional Redux approach and a more modern React-centric approach. If you'd like to see an alternative solution using redux-trunk, that can be found in [this branch](https://github.com/wpultz/rtslabs-hna-challenge/tree/wpultz/thunk).

## The information generated by Create React App...

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
