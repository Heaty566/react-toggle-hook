![npm](https://img.shields.io/npm/v/react-toggle-hook) ![npm](https://img.shields.io/npm/dw/react-toggle-hook) ![npm bundle size](https://img.shields.io/bundlephobia/min/react-toggle-hook)

[![NPM](https://nodei.co/npm/react-toggle-hook.png)](https://nodei.co/npm/react-toggle-hook/)

# react-toggle-hook

A simple React hook to manage toggle state over multiple components easier and cleaner.

## Installation

NPM:

```sh
npm install react-toggle-hook
```

Yarn:

```sh
yarn add react-toggle-hook
```

## Usage

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

## License

MIT
