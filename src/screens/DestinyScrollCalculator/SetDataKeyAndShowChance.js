import {Box, FormControl, FormControlLabel, Radio, RadioGroup} from '@mui/material';
import useDrawData from './useDrawData';
import useZState from './useZState';
const SetDataKeyAndShowChance = () => {
    const [nowDataKey, setNowDataKey] = useZState('nowDataKey'); //武器卷 or 飾品/防具卷
    const drawData = useDrawData();
    return (
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
                        {nowDataKey === '' && <FormControlLabel value="" control={<Radio />} label="自訂資料" />}
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
    );
};
export default SetDataKeyAndShowChance;
