import create from 'zustand';
import {persist} from 'zustand/middleware';
const useStore = create(
    persist(
        (set) => ({
            nowDataKey: 'weaponData',
            targetNums: 13,
            minAttack: 15,
            scrollPrice: 35,
            restoreCardPrice: 75,
            expectTotal: 30,
            existScroll: 0,
            existScrollTotalAttack: 0,
            existScrollTotalAttribute: 0,
            repeat: 1,
        }),
        {name: 'zacharyptt-DestinyScrollCalculator-storage'}
    )
);
export default useStore;
