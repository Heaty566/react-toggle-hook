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
