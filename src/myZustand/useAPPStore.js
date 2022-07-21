import create from 'zustand';
import {persist} from 'zustand/middleware';
const useStore = create(
    persist(
        (set) => ({
            mode: 'dark',
        }),
        {name: 'zacharyptt-maplestory-tools-storge'}
    )
);
export default useStore;
