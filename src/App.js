import CssBaseline from '@mui/material/CssBaseline';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import useStore from 'myZustand/useAPPStore';
import {useMemo} from 'react';
import {Route, Routes} from 'react-router-dom';
import DestinyScrollCalculatorScreen from 'screens/DestinyScrollCalculator/DestinyScrollCalculatorScreen';
import Home from 'screens/Home';
import VirtualDrawScreen from 'screens/VirtualDraw/VirtualDrawScreen';
function App() {
    const mode = useStore((state) => state.mode);
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
                <Route
                    path="/destiny-scroll-calculator"
                    title="命運卷恢復卡成本估算"
                    element={<DestinyScrollCalculatorScreen />}
                />
                <Route path="/virtual-draw" element={<VirtualDrawScreen />} />
            </Routes>
        </ThemeProvider>
    );
}

export default App;
