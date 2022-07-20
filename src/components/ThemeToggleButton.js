import {Brightness4Outlined, Brightness5Outlined} from '@mui/icons-material';
import {IconButton} from '@mui/material';
import useStore from '../zustand/useStore';

const ThemeToggleButton = () => {
    const mode = useStore((state) => state.mode);
    const toggleTheme = () => {
        useStore.setState({
            mode: mode === 'light' ? 'dark' : 'light',
        });
    };
    return (
        <IconButton onClick={toggleTheme} size="large">
            {mode === 'dark' ? <Brightness4Outlined /> : <Brightness5Outlined />}
        </IconButton>
    );
};
export default ThemeToggleButton;
