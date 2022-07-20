import create from 'zustand';
import {persist} from 'zustand/middleware';
const useStore = create(
    persist(
        (set) => ({
            mode: 'dark',
            nowDataKey: 'weaponData',
            targetNums: 13,
            min: 15,
            reelPrice: 35,
            restoreCardPrice: 75,
            expectTotal: 30,
            existReel: 0,
            existReelTotalAttack: 0,
            existReelTotalAttribute: 0,
        }),
        {name: 'zacharyptt-maplestory-tools-storge'}
    )
);
export default useStore;
