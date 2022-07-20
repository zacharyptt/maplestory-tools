import {Home} from '@mui/icons-material';
import {AppBar, IconButton, Toolbar, Typography} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import ThemeToggleButton from './ThemeToggleButton';

const Header = ({title, children}) => {
    const navigate = useNavigate();
    return (
        <AppBar position="static">
            <Toolbar>
                <IconButton
                    onClick={() => {
                        navigate('/');
                    }}
                >
                    <Home />
                </IconButton>
                <Typography variant="h6" component="div" sx={{flexGrow: 1, ml: 1}}>
                    {title}
                </Typography>
                {children}
                <ThemeToggleButton />
            </Toolbar>
        </AppBar>
    );
};
export default Header;
