import Refresh from '@mui/icons-material/Refresh';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import axios from 'axios';
import {useEffect, useState} from 'react';
import useStore from './useStore';

const GrabArea = () => {
    const setZState = useStore((state) => state.setZState);
    const experimentMode = useStore((state) => state.experimentMode);
    const grabNavListLoading = useStore((state) => state.grabNavListLoading);
    const navList = useStore((state) => state.navList);
    const cleanResult = useStore((state) => state.cleanResult);
    const setDrawData = (value) => {
        setZState({
            drawData: value,
        });
    };
    const fetchHtml = (url) => {
        const formData = new FormData();

        formData.append('url', url);
        return axios.post(
            'https://script.google.com/macros/s/AKfycbw8MvCvFRharDBbQJTBojzjXk04ilw-Mp2uTykytkBUskhgshzaq6oPgyLz1cHUIXNj/exec',
            formData
        );
    };
    const getNavList = () => {
        setZState({
            grabNavListLoading: true,
        });
        fetchHtml('https://tw.beanfun.com/beanfuncommon/EventAD_Mobile/EventAD.aspx?EventADID=8369')
            .then(({data: html}) => {
                var parser = new DOMParser();
                var doc = parser.parseFromString(html, 'text/html');
                const alist = doc.querySelector('.nav').querySelectorAll('a');
                const list = [];
                alist.forEach((a) => {
                    list.push({
                        name: a.textContent.trim(),
                        href: a.href,
                    });
                });
                setZState({
                    navList: list,
                });
                // setNavList(list);
            })
            .catch(() => {})
            .then(() => {
                setZState({
                    grabNavListLoading: false,
                });
            });
    };
    useEffect(() => {
        if (useStore.getState().navList.length === 0 && experimentMode === true) {
            getNavList();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [experimentMode]);
    const parseAndSetData = (href) => {
        setFetchLoading(true);
        fetchHtml(href)
            .then(({data: html}) => {
                var parser = new DOMParser();
                var doc = parser.parseFromString(html, 'text/html');
                const tds = doc.querySelector('table').querySelectorAll('tr');
                const list = [];
                tds.forEach((tr, index) => {
                    const tds = tr.querySelectorAll('td:not([rowspan])');
                    const chanceText = tds[1].textContent.trim();
                    const item = {
                        id: index,
                        name: tds[0].textContent.trim(),
                        chance: parseFloat(chanceText.slice(0, -1)),
                    };
                    list.push(item);
                });
                list.shift();
                setDrawData(list);
                cleanResult();
                useStore.setState((state) => {
                    state.grabData[href] = list;
                });
            })
            .catch(() => {})
            .then(() => {
                setFetchLoading(false);
            });
    };
    const [fetchLoading, setFetchLoading] = useState(false);

    return (
        <>
            <FormGroup>
                <FormControlLabel
                    checked={experimentMode}
                    onChange={(event) => {
                        setZState({experimentMode: event.target.checked});
                    }}
                    control={<Switch />}
                    label="實驗性功能"
                />
            </FormGroup>
            {experimentMode ? (
                <>
                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                        <Typography sx={{my: 2}}>直接抓取官網機率(有些還無法正常使用)</Typography>
                        <div>
                            {grabNavListLoading ? (
                                <CircularProgress sx={{ml: 2}} />
                            ) : (
                                <IconButton sx={{ml: 2}} onClick={getNavList}>
                                    <Refresh />
                                </IconButton>
                            )}
                        </div>
                    </Box>
                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                        <Button
                            variant="contained"
                            onClick={() => {
                                useStore.setState({grabData: {}});
                            }}
                        >
                            清除快取
                        </Button>
                        {fetchLoading && <Typography sx={{ml: 2}}>抓取中...</Typography>}
                    </Box>
                    <Grid container sx={{mt: 2}}>
                        {navList.map(({name, href}) => (
                            <Grid key={name} item xs={4}>
                                <Button
                                    disabled={fetchLoading}
                                    onClick={() => {
                                        const existData = useStore.getState().grabData[href];
                                        if (existData === undefined) {
                                            parseAndSetData(href);
                                        } else {
                                            setDrawData(existData);
                                        }
                                    }}
                                >
                                    {name}
                                </Button>
                            </Grid>
                        ))}
                    </Grid>
                </>
            ) : (
                <></>
            )}
        </>
    );
};
export default GrabArea;
