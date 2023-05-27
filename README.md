![npm](https://img.shields.io/npm/v/react-toggle-hook) ![npm](https://img.shields.io/npm/dw/react-toggle-hook) ![npm bundle size](https://img.shields.io/bundlephobia/min/react-toggle-hook)

[![NPM](https://nodei.co/npm/react-toggle-hook.png)](https://nodei.co/npm/react-toggle-hook/)

# react-toggle-hook

A simple React hook to manage toggle state over multiple components easier and cleaner.

## Why?

When you have a toggle state that needs to be shared over multiple components, you need to pass the state and actions as props to all the components. This can be a pain when you have a lot of
components. This hook allows you to manage the toggle state in a single place and access it from any component and allows extra actions to be called after open and close actions.

## Installation

NPM:

```sh
npm install react-toggle-hook
```

Yarn:

```sh
yarn add react-toggle-hook
```

## Basic Usage

```jsx
// example/example1.tsx

import * as React from 'react';
import { ToggleProvider, useToggleContext } from 'react-toggle-hook';
import { useQuery } from 'react-query';

const Drawer: React.FC<any> = () => {
    const { close, isOpen, value } = useToggleContext<string>('key');

    return (
        <>
            {isOpen && (
                <div>
                    <button onClick={close}>Close</button>
                    <div>{value}</div>
                </div>
            )}
        </>
    );
};

const Container: React.FC<any> = () => {
    const userQuery = useQuery(['userName'], () => {
        return 'userName + ' + new Date().getTime().toString();
    });
    const { open } = useToggleContext<string>('key', {
            // extraOpenAction is called after close action
            extraCloseAction: () => {
                userQuery.refetch();
            }
        });

    return (
        <div>
            <div>
                {/* pass data to drawer */}
                <button onClick={() => open(userQuery.data)}>Open</button>
                <Drawer />
            </div>
        </div>
    );
};

const App: React.FC<any> = () => {
    return (
        <ToggleProvider>
            <Container />
        </ToggleProvider>
    );
};

export default App;
```

## API

-   `ToggleProvider` - Provider component to wrap your app with or container component which avoid duplicate toggle keys.
    -   props:
        -   children: React.ReactNode - children to be wrapped
-   `useToggleContext` - Hook to access toggle state and actions.
    -   key: string - key to identify toggle state to allow multiple toggles
    -   options:
        -   extraOpenAction: () => void - extra action to be called after open action
        -   extraCloseAction: () => void - extra action to be called after close action
    -   returns:
        -   isOpen: boolean - toggle state
        -   value: any - value passed to open action
        -   open: (value: any) => void - action to open toggle and pass value
        -   close: () => void - close action
        -   queryKey: string - query key to be used with react-query

## License

MIT
