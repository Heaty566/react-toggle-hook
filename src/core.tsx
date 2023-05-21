import * as React from 'react';
export interface ToggleHookOptions {
    extraCloseAction?: () => void;
}

export interface IToggleItem {
    value: any;
    isOpen: boolean;
    queryKey: string;
    options?: ToggleHookOptions;
}

export interface IToggleContext {
    toggles: Record<string, IToggleItem>;
    handleOpenToggle: (key: string, value: any) => void;
    handleCloseToggle: (key: string) => void;
    isOpen: (key: string) => boolean;
    handleAddOption: (key: string, options: ToggleHookOptions) => void;
}

export const ToggleContext = React.createContext<IToggleContext>({
    toggles: {},
    handleOpenToggle: () => {},
    handleCloseToggle: () => {},
    isOpen: () => false,
    handleAddOption: () => {}
});

interface ToggleProviderProps {
    children: React.ReactNode;
}

export const ToggleProvider: React.FC<ToggleProviderProps> = ({ children }) => {
    const [toggles, setToggles] = React.useState<Record<string, IToggleItem>>({});

    const handleAddOption = (key: string, options: ToggleHookOptions) => {
        setToggles((pre) => ({
            ...pre,
            [key]: {
                isOpen: pre[key]?.isOpen || false,
                value: pre[key]?.value,
                queryKey: new Date().getTime().toString(),
                options
            }
        }));
    };

    const handleOpenToggle = (key: string, value: any) => {
        setToggles((pre) => ({
            ...pre,
            [key]: {
                isOpen: true,
                value,
                queryKey: new Date().getTime().toString(),
                options: pre[key]?.options
            }
        }));
    };

    const handleCloseToggle = (key: string) => {
        setToggles((pre) => ({
            ...pre,
            [key]: {
                isOpen: false,
                value: undefined,
                queryKey: new Date().getTime().toString(),
                options: pre[key]?.options
            }
        }));
    };

    const isOpen = (key: string) => toggles[key]?.isOpen || false;

    return <ToggleContext.Provider value={{ isOpen, handleCloseToggle, handleOpenToggle, toggles, handleAddOption }}>{children}</ToggleContext.Provider>;
};

export const useToggleContext = <T,>(key: string, otp?: ToggleHookOptions) => {
    const context = React.useContext(ToggleContext);
    const [isFireAction, setIsFireAction] = React.useState(false);

    const open = (value?: T) => context.handleOpenToggle(key, value);
    const close = () => {
        if (context.isOpen(key)) {
            context.handleCloseToggle(key);
            setIsFireAction(true);
        }
    };

    React.useEffect(() => {
        if (isFireAction) {
            context.toggles[key]?.options?.extraCloseAction?.();
            setIsFireAction(false);
        }
    }, [isFireAction, context.toggles[key]]);

    React.useEffect(() => {
        if (!context.toggles[key]) {
            context.handleAddOption(key, otp || {});
        }
    }, [context, key, otp]);

    return {
        value: context.toggles[key]?.value as T,
        queryKey: context.toggles[key]?.queryKey,
        isOpen: context.isOpen(key),
        open,
        close
    };
};
