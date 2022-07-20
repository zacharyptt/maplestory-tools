import {Brightness4Outlined, Brightness5Outlined} from '@mui/icons-material';
import {Box, Container, IconButton, Link} from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {useMemo} from 'react';
import {Link as RouterLink, Route, Routes} from 'react-router-dom';
import DestinyScrollCalculatorScreen from './screens/DestinyScrollCalculator/DestinyScrollCalculatorScreen';
import VirtualDrawScreen from './screens/VirtualDraw/VirtualDrawScreen';
import useStore from './zustand/useStore';
function Home() {
    return (
        <Container sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', p: 7}}>
            楓之谷小工具
            <Box sx={{display: 'flex', flexDirection: 'column'}}>
                <Link component={RouterLink} to="/destiny-scroll-calculator">
                    計算武器使用恢復卡衝命運卷成本
                </Link>
                <Link component={RouterLink} to="/virtual-draw">
                    模擬抽獎
                </Link>
            </Box>
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
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/destiny-scroll-calculator" element={<DestinyScrollCalculatorScreen />} />
                <Route path="/virtual-draw" element={<VirtualDrawScreen />} />
            </Routes>
        </ThemeProvider>
    );
}

export default App;
