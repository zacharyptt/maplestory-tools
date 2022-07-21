import useZState from './useZState';
import armorData from './armorData';
import weaponData from './weaponData';
import {useMemo} from 'react';
const data = {
    weaponData,
    armorData,
};
const useDrawData = () => {
    const [nowDataKey] = useZState('nowDataKey'); //武器卷 or 飾品/防具卷
    const drawData = useMemo(() => {
        return data[nowDataKey];
    }, [nowDataKey]);
    return drawData;
};
export default useDrawData;
