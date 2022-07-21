import {Home} from '@mui/icons-material';
import {AppBar, IconButton, Toolbar, Typography} from '@mui/material';
import {useLayoutEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import ThemeToggleButton from './ThemeToggleButton';

const Header = ({title, children}) => {
    const navigate = useNavigate();
    useLayoutEffect(() => {
        document.title = title;
    }, [title]);
    return (
        <AppBar position="static">
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    sx={{mr: 2}}
                    onClick={() => {
                        navigate('/');
                    }}
                >
                    <Home />
                </IconButton>
                <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                    {title}
                </Typography>
                {children}
                <ThemeToggleButton />
            </Toolbar>
        </AppBar>
    );
};
export default Header;
