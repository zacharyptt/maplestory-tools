import {Brightness4Outlined, Brightness5Outlined} from '@mui/icons-material';
import {Container, IconButton, Link} from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {useMemo} from 'react';
import {Link as RouterLink, Route, Routes} from 'react-router-dom';
import DestinyReelCalculator from './screens/DestinyReelCalculator/DestinyReelCalculator';
import useStore from './zustand/useStore';
function Home() {
    return (
        <Container sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', p: 7}}>
            楓之谷小工具
            <nav>
                <Link component={RouterLink} to="/calculator">
                    計算武器使用恢復卡衝命運卷成本
                </Link>
            </nav>
        </Container>
    );
}

function App() {
    const mode = useStore((state) => state.mode);
    const toggleTheme = () => {
        useStore.setState({
            mode: mode === 'light' ? 'dark' : 'light',
        });
    };
    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                },
            }),
        [mode]
    );
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <div>
                <IconButton onClick={toggleTheme} size="large">
                    {mode === 'dark' ? <Brightness4Outlined /> : <Brightness5Outlined />}
                </IconButton>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="calculator" element={<DestinyReelCalculator />} />
                </Routes>
            </div>
        </ThemeProvider>
    );
}

export default App;
