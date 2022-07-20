import {
    Box,
    Button,
    Container,
    Divider,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
    TextField,
    Typography,
} from '@mui/material';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import useStore from '../../zustand/useStore';
import armorData from './armorData';
import weaponData from './weaponData';

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
const data = {
    weaponData,
    armorData,
};
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
const checkNumberInput = (value) => {
    if (/^[0-9]\d*$/.test(value) || value === '') {
        return true;
    }
    return false;
};
export default function Calculator() {
    const [nowDataKey, setNowDataKey] = useZState('nowDataKey');
    const [targetNums, setTargetNums] = useZState('targetNums'); //目標卷數
    const [min, setMin] = useZState('min'); //最小增加攻擊
    const [expectTotal, setExpectTotal] = useZState('expectTotal'); //攻屬總和
    const [reelPrice, setReelPrice] = useZState('reelPrice'); //卷軸價格
    const [restoreCardPrice, setRestoreCardPrice] = useZState('restoreCardPrice'); //恢復卡價格
    const [existReel, setExistReel] = useZState('existReel'); //已衝卷數
    const [existReelTotalAttack, setExistReelTotalAttack] = useZState('existReelTotalAttack'); //已衝卷數總攻擊
    const [existReelTotalAttribute, setExistReelTotalAttribute] = useZState('existReelTotalAttribute'); //已衝卷數總屬性
    // const [expect, setExpect] = useState(16); //期望均攻
    const [resultList, setResultList] = useState([]);
    const [resultList2, setResultList2] = useState([]);
    const [total, setTotal] = useState(0); //總共衝了幾次
    const drawData = useMemo(() => {
        return data[nowDataKey];
    }, [nowDataKey]);
    const _first = useRef(true);

    useEffect(() => {
        if (_first.current === false) {
            setTotal(0);
            setResultList([]);
            setResultList2([]);
            setMin(drawData[3].add);
            setExpectTotal(drawData[3].add * 2);
        }
        _first.current = false;
    }, [drawData, setExpectTotal, setMin]);
    return (
        <Container>
            <Box sx={{display: 'flex', flexDirection: 'column', pb: 10}}>
                <Typography sx={{textAlign: 'center'}} gutterBottom variant="h4">
                    計算使用恢復卡衝命運卷成本
                </Typography>
                <Box sx={{display: 'flex'}}>
                    <Box sx={{display: 'flex', alignItems: 'flex-end', flexDirection: 'column', flex: 1, mr: 3}}>
                        <FormControl>
                            <RadioGroup
                                value={nowDataKey}
                                onChange={(event) => {
                                    setNowDataKey(event.target.value);
                                }}
                            >
                                <FormControlLabel value="weaponData" control={<Radio />} label="命運武器卷" />
                                <FormControlLabel value="armorData" control={<Radio />} label="命運防具/飾品卷" />
                                {nowDataKey === '' && (
                                    <FormControlLabel value="" control={<Radio />} label="自訂資料" />
                                )}
                            </RadioGroup>
                        </FormControl>
                    </Box>
                    <Box sx={{display: 'flex', alignItems: 'flex-start', flexDirection: 'column', flex: 1}}>
                        <table>
                            <thead>
                                <tr>
                                    <td>增加</td>
                                    <td align="right">機率</td>
                                </tr>
                            </thead>
                            <tbody>
                                {drawData.map(({id, add, chance, count}, index) => (
                                    <tr key={index}>
                                        <td>+{add}</td>
                                        <td align="right">{chance}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Box>
                </Box>
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
                            value={min}
                            onChange={(event) => {
                                if (!checkNumberInput(event.target.value)) {
                                    return;
                                }
                                setMin(event.target.value);
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
                            value={reelPrice}
                            onChange={(event) => {
                                if (!checkNumberInput(event.target.value)) {
                                    return;
                                }
                                setReelPrice(event.target.value);
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
                            value={existReel}
                            onChange={(event) => {
                                if (!checkNumberInput(event.target.value)) {
                                    return;
                                }
                                setExistReel(event.target.value);
                            }}
                        />
                        <TextField
                            label="已衝卷數增加總攻擊"
                            value={existReelTotalAttack}
                            onChange={(event) => {
                                if (!checkNumberInput(event.target.value)) {
                                    return;
                                }
                                setExistReelTotalAttack(event.target.value);
                            }}
                        />
                        {nowDataKey === 'weaponData' && (
                            <TextField
                                label="已衝卷數增加總屬性"
                                value={existReelTotalAttribute}
                                onChange={(event) => {
                                    if (!checkNumberInput(event.target.value)) {
                                        return;
                                    }
                                    setExistReelTotalAttribute(event.target.value);
                                }}
                            />
                        )}
                        {resultList.length > 0 && (
                            <>
                                <Typography>包含已衝卷軸</Typography>
                                <Typography gutterBottom>
                                    {resultList.length + parseInt(existReel) > 0 &&
                                        `平均 ${
                                            Math.round(
                                                (resultList.reduce((a, b) => a + b, parseInt(existReelTotalAttack)) /
                                                    (resultList.length + parseInt(existReel))) *
                                                    100
                                            ) / 100
                                        }攻`}
                                    {nowDataKey === 'weaponData' &&
                                        resultList2.length + parseInt(existReel) > 0 &&
                                        ` ${
                                            Math.round(
                                                (resultList2.reduce(
                                                    (a, b) => a + b,
                                                    parseInt(existReelTotalAttribute)
                                                ) /
                                                    (resultList.length + parseInt(existReel))) *
                                                    100
                                            ) / 100
                                        }屬`}
                                </Typography>
                            </>
                        )}
                    </Box>
                    <Box sx={{display: 'flex', flex: 1, flexDirection: 'column', alignItems: 'flex-start'}}>
                        <Button
                            onClick={() => {
                                if (drawData[drawData.length - 1].add < min) {
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
                                    if (result >= min) {
                                        array.push(result);
                                        array2.push(result2);
                                    }
                                }
                                setResultList(array);
                                setResultList2(array2);
                                setTotal(count);
                            }}
                        >
                            只留指定攻擊以上
                        </Button>
                        {nowDataKey === 'weaponData' && (
                            <Button
                                sx={{display: 'block'}}
                                onClick={() => {
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
                                }}
                            >
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
                                    total * restoreCardPrice + total * reelPrice
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
            </Box>
        </Container>
    );
}
// const test = () => {
//     return (
//         <>
//             <Button
//                 onClick={() => {
//                     const array = [];
//                     let count = 0;
//                     while (array.length < targetNums) {
//                         count++;
//                         const result = draw(drawData);
//                         const calAvg = array.reduce((a, b) => a + b, result) / (array.length + 1);
//                         if (calAvg >= expect) {
//                             array.push(result);
//                         }
//                     }
//                     setResultList(array);
//                     setTotal(count);
//                 }}
//             >
//                 平均大於期望攻擊都留
//             </Button>
//             <Button
//                 onClick={() => {
//                     const array = [];
//                     let count = 0;
//                     while (array.length < targetNums) {
//                         count++;
//                         const result = draw(drawData);
//                         if (result >= min) {
//                             if (
//                                 result < expect &&
//                                 array.reduce((a, b) => a + b, result) / (array.length + 1) < expect
//                             ) {
//                                 continue;
//                             }
//                             array.push(result);
//                         }
//                     }
//                     setResultList(array);
//                     setTotal(count);
//                 }}
//             >
//                 只留指定攻擊 若平均低於期望均攻 則不留
//             </Button>
//             <Button
//                 onClick={() => {
//                     const array = [];
//                     let count = 0;
//                     while (array.length < targetNums) {
//                         count++;
//                         const result = draw(drawData);
//                         if (result >= min) {
//                             if (array.length > targetNums / 2 && result < expect) {
//                                 continue;
//                             }
//                             array.push(result);
//                         }
//                     }
//                     setResultList(array);
//                     setTotal(count);
//                 }}
//             >
//                 最後五張 大於等於期望均攻才留
//             </Button>
//             <Button
//                 onClick={() => {
//                     const array = [];
//                     let count = 0;
//                     let flag = 0;
//                     while (array.length < targetNums) {
//                         count++;
//                         const result = draw(drawData);
//                         if (result >= min) {
//                             if (result === parseInt(min)) {
//                                 if (flag >= 5) {
//                                     continue;
//                                 }
//                                 flag++;
//                             }
//                             array.push(result);
//                         }
//                     }
//                     setResultList(array);
//                     setTotal(count);
//                 }}
//             >
//                 最多留x張最小攻擊
//             </Button>
//         </>
//     );
// };
