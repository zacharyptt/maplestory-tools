import {useCallback} from 'react';
import useStore from './useStore';
const useZState = (key) => {
    const value = useStore((state) => state[key]);
    const setValue = useCallback(
        (value) => {
            useStore.setState({
                [key]: value,
            });
        },
        [key]
    );
    return [value, setValue];
};
export default useZState;
