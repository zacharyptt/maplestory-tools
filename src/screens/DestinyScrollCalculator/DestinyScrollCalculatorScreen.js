import {Box, Button, Container, Divider, TextField, Typography} from '@mui/material';
import Header from 'components/Header';
import produce from 'immer';
import {useEffect, useMemo, useRef, useState} from 'react';
import {CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';
import SetDataKeyAndShowChance from './SetDataKeyAndShowChance';
import useDrawData from './useDrawData';
import useZState from './useZState';
const draw = (drawData) => {
    const random = Math.random();
    let count = 0;
    for (let i = 0; i < drawData.length; i++) {
        const thisData = drawData[i];
        if (random >= count && random <= count + thisData.chance / 100) {
            return thisData.add;
        } else {
            count = count + thisData.chance / 100;
        }
    }
};
const checkNumberInput = (value) => {
    if (/^[0-9]\d*$/.test(value) || value === '') {
        return true;
    }
    return false;
};

export default function DestinyScrollCalculatorScreen() {
    const [nowDataKey] = useZState('nowDataKey'); //武器卷 or 飾品/防具卷
    const [targetNums, setTargetNums] = useZState('targetNums'); //目標卷數
    const [minAttack, setMinAttack] = useZState('minAttack'); //最小增加攻擊
    const [expectTotal, setExpectTotal] = useZState('expectTotal'); //攻屬總和
    const [scrollPrice, setScrollPrice] = useZState('scrollPrice'); //卷軸價格
    const [restoreCardPrice, setRestoreCardPrice] = useZState('restoreCardPrice'); //恢復卡價格
    const [existScroll, setExistScroll] = useZState('existScroll'); //已衝卷數
    const [existScrollTotalAttack, setExistScrollTotalAttack] = useZState('existScrollTotalAttack'); //已衝卷數總攻擊
    const [existScrollTotalAttribute, setExistScrollTotalAttribute] = useZState('existScrollTotalAttribute'); //已衝卷數總屬性
    const [repeat, setRepeat] = useZState('repeat'); //執行幾次
    const [resultList, setResultList] = useState([]);
    const [resultList2, setResultList2] = useState([]);
    const [total, setTotal] = useState(0); //總共衝了幾次
    const [numsData, setNumsData] = useState({}); //衝完卷軸所需次數資料
    const [averageAttackData, setAverageAttackData] = useState({}); //卷軸平均攻擊
    const drawData = useDrawData();
    const _first = useRef(true);

    useEffect(() => {
        if (_first.current === false) {
            setTotal(0);
            setResultList([]);
            setResultList2([]);
            setMinAttack(drawData[3].add);
            setExpectTotal(drawData[3].add * 2);
        }
        _first.current = false;
    }, [drawData, setExpectTotal, setMinAttack]);

    const getGreaterThanMinAttackOnce = (index) => {
        if (drawData[drawData.length - 1].add < minAttack) {
            alert('最小攻擊超出範圍');
            return;
        }
        const array = [];
        const array2 = [];
        let count = 0;
        while (array.length < targetNums) {
            count++;
            const result = draw(drawData);
            const result2 = draw(drawData);
            if (result >= minAttack) {
                array.push(result);
                array2.push(result2);
            }
        }
        if (repeat < 2) {
            setResultList(array);
            setResultList2(array2);
            setTotal(count);
        } else {
            const average =
                Math.round(
                    (array.reduce((a, b) => a + b, parseInt(existScrollTotalAttack)) /
                        (array.length + parseInt(existScroll))) *
                        100
                ) / 100;
            setNumsData(
                produce((draft) => {
                    draft[count] = (draft[count] || 0) + 1;
                })
            );
            setAverageAttackData(
                produce((draft) => {
                    const temp = Math.round(average * 100);
                    draft[temp] = (draft[temp] || 0) + 1;
                })
            );
        }
    };
    const cleanResult = () => {
        setResultList([]);
        setResultList2([]);
        setAverageAttackData({});
        setNumsData({});
    };
    const getGreaterThanMinAttack = () => {
        cleanResult();
        for (let i = 0; i < repeat; i++) {
            getGreaterThanMinAttackOnce(i);
        }
    };
    const getGreaterThanExpectTotalAttack = () => {
        cleanResult();
        if (drawData[drawData.length - 1].add * 2 < expectTotal) {
            alert('最小屬攻總和超出範圍');
            return;
        }
        const array = [];
        const array2 = [];
        let count = 0;
        while (array.length < targetNums) {
            count++;
            const result = draw(drawData);
            const result2 = draw(drawData);
            if (result + result2 >= expectTotal) {
                array.push(result);
                array2.push(result2);
            }
        }
        setResultList(array);
        setResultList2(array2);
        setTotal(count);
    };
    const chartData = useMemo(() => {
        return {
            nums: Object.keys(numsData).map((value) => ({
                total: parseInt(value), //張數
                count: numsData[value], //次數
            })),
            averageAttack: Object.keys(averageAttackData).map((value) => ({
                average: value / 100,
                count: averageAttackData[value], //次數
            })),
        };
    }, [numsData, averageAttackData]);
    const _chartPosition = useRef();
    useEffect(() => {
        if (chartData.nums.length > 0) {
            _chartPosition.current.scrollIntoView({behavior: 'smooth'});
        }
    }, [chartData]);
    return (
        <div>
            <Header title="恢復卡衝命運卷成本預估" />
            <Container sx={{mt: 5, display: 'flex', flexDirection: 'column', pb: 10}}>
                <SetDataKeyAndShowChance />
                <Box sx={{display: 'flex', justifyContent: 'center'}}>
                    <Box
                        sx={{
                            display: 'flex',
                            flex: 1,
                            mr: 3,
                            alignItems: 'flex-end',
                            flexDirection: 'column',
                            '& > :not(style)': {
                                m: 1,
                                width: {xs: '18ch', sm: '25ch'},
                            },
                        }}
                    >
                        <TextField
                            label="目標卷數"
                            value={targetNums}
                            onChange={(event) => {
                                if (!checkNumberInput(event.target.value)) {
                                    return;
                                }
                                setTargetNums(event.target.value);
                            }}
                        />
                        <TextField
                            label="最小增加攻擊"
                            value={minAttack}
                            onChange={(event) => {
                                if (!checkNumberInput(event.target.value)) {
                                    return;
                                }
                                setMinAttack(event.target.value);
                            }}
                        />
                        {nowDataKey === 'weaponData' && (
                            <TextField
                                label="最小屬攻總合"
                                value={expectTotal}
                                onChange={(event) => {
                                    if (!checkNumberInput(event.target.value)) {
                                        return;
                                    }
                                    setExpectTotal(event.target.value);
                                }}
                            />
                        )}
                        <TextField
                            label="卷軸價格"
                            value={scrollPrice}
                            onChange={(event) => {
                                if (!checkNumberInput(event.target.value)) {
                                    return;
                                }
                                setScrollPrice(event.target.value);
                            }}
                        />
                        <TextField
                            label="恢復卡價格"
                            value={restoreCardPrice}
                            onChange={(event) => {
                                if (!checkNumberInput(event.target.value)) {
                                    return;
                                }
                                setRestoreCardPrice(event.target.value);
                            }}
                        />
                        <Divider />
                        <TextField
                            label="已衝卷數"
                            value={existScroll}
                            onChange={(event) => {
                                if (!checkNumberInput(event.target.value)) {
                                    return;
                                }
                                setExistScroll(event.target.value);
                            }}
                        />
                        <TextField
                            label="已衝卷數增加總攻擊"
                            value={existScrollTotalAttack}
                            onChange={(event) => {
                                if (!checkNumberInput(event.target.value)) {
                                    return;
                                }
                                setExistScrollTotalAttack(event.target.value);
                            }}
                        />
                        {nowDataKey === 'weaponData' && (
                            <TextField
                                label="已衝卷數增加總屬性"
                                value={existScrollTotalAttribute}
                                onChange={(event) => {
                                    if (!checkNumberInput(event.target.value)) {
                                        return;
                                    }
                                    setExistScrollTotalAttribute(event.target.value);
                                }}
                            />
                        )}
                        {resultList.length > 0 && existScroll > 0 && (
                            <>
                                <Typography>包含已衝卷軸</Typography>
                                <Typography gutterBottom>
                                    {resultList.length + parseInt(existScroll) > 0 &&
                                        `平均 ${
                                            Math.round(
                                                (resultList.reduce((a, b) => a + b, parseInt(existScrollTotalAttack)) /
                                                    (resultList.length + parseInt(existScroll))) *
                                                    100
                                            ) / 100
                                        }攻`}
                                    {nowDataKey === 'weaponData' &&
                                        resultList2.length + parseInt(existScroll) > 0 &&
                                        ` ${
                                            Math.round(
                                                (resultList2.reduce(
                                                    (a, b) => a + b,
                                                    parseInt(existScrollTotalAttribute)
                                                ) /
                                                    (resultList.length + parseInt(existScroll))) *
                                                    100
                                            ) / 100
                                        }屬`}
                                </Typography>
                            </>
                        )}
                    </Box>
                    <Box sx={{display: 'flex', flex: 1, flexDirection: 'column', alignItems: 'flex-start'}}>
                        <TextField
                            sx={{m: 1}}
                            label="執行次數"
                            value={repeat}
                            onChange={(event) => {
                                if (!checkNumberInput(event.target.value)) {
                                    return;
                                }
                                setRepeat(event.target.value);
                            }}
                        />
                        <Button onClick={getGreaterThanMinAttack}>只留指定攻擊以上</Button>
                        {nowDataKey === 'weaponData' && (
                            <Button sx={{display: 'block'}} onClick={getGreaterThanExpectTotalAttack}>
                                只留最小攻屬總和以上
                            </Button>
                        )}
                        {resultList.length > 0 && (
                            <>
                                <Typography gutterBottom>
                                    {`總共增加: ${resultList.reduce((a, b) => a + b, 0)}攻`}
                                    {nowDataKey === 'weaponData' && ` ${resultList2.reduce((a, b) => a + b, 0)}屬`}
                                </Typography>
                                <Typography gutterBottom>
                                    {`平均: ${
                                        Math.round((resultList.reduce((a, b) => a + b, 0) / resultList.length) * 100) /
                                        100
                                    }攻`}
                                    {nowDataKey === 'weaponData' &&
                                        ` ${
                                            Math.round(
                                                (resultList2.reduce((a, b) => a + b, 0) / resultList.length) * 100
                                            ) / 100
                                        }屬`}
                                </Typography>
                                <Typography gutterBottom>{`花費: ${total}張恢復卡與命運卷`}</Typography>
                                <Typography gutterBottom>{`預估花費: ${
                                    total * restoreCardPrice + total * scrollPrice
                                }台幣`}</Typography>
                                <Box sx={{display: 'flex'}}>
                                    <Box>
                                        攻擊
                                        {resultList.map((value, index) => {
                                            return <div key={index}>+{value}</div>;
                                        })}
                                    </Box>
                                    {nowDataKey === 'weaponData' && (
                                        <>
                                            <Box sx={{ml: 4}}>
                                                屬性
                                                {resultList2.map((value, index) => {
                                                    return <div key={index}>+{value}</div>;
                                                })}
                                            </Box>
                                            <Box sx={{ml: 4}}>
                                                總合
                                                {resultList.map((value, index) => {
                                                    return <div key={index}>+{value + resultList2[index]}</div>;
                                                })}
                                            </Box>
                                        </>
                                    )}
                                </Box>
                            </>
                        )}
                    </Box>
                </Box>
                <div ref={_chartPosition} />
                {chartData.nums.length > 0 && (
                    <>
                        <Typography align="center">衝完卷數所需命運卷張數分佈圖</Typography>
                        <ResponsiveContainer width="100%" height={400}>
                            <LineChart width={500} height={400} data={chartData.nums}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="total" unit="張" />
                                <YAxis dataKey="count" unit="次" />
                                <Tooltip
                                    labelStyle={{color: 'black'}}
                                    labelFormatter={(value) =>
                                        `${value}張(${value * scrollPrice + value * restoreCardPrice}元)`
                                    }
                                />
                                <Line type="monotone" dataKey="count" name="次數" stroke="#8884d8" fill="#8884d8" />
                            </LineChart>
                        </ResponsiveContainer>
                        <Typography align="center">均攻分佈圖</Typography>
                        <ResponsiveContainer width="100%" height={400}>
                            <LineChart width={500} height={400} data={chartData.averageAttack}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="average" unit="攻" />
                                <YAxis dataKey="count" unit="次" />
                                <Tooltip labelStyle={{color: 'black'}} labelFormatter={(value) => `${value}攻`} />
                                <Line type="monotone" dataKey="count" name="次數" stroke="#8884d8" fill="#8884d8" />
                            </LineChart>
                        </ResponsiveContainer>
                    </>
                )}
            </Container>
        </div>
    );
}
