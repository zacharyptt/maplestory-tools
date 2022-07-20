import create from 'zustand';
import {persist} from 'zustand/middleware';
import {immer} from 'zustand/middleware/immer';
const useStore = create(
    persist(
        immer((set, get) => ({
            total: 0,
            sum: 0,
            average: 0,
            nowDataKey: 'data8369',
            drawNums: 1,
            drawData: [],
            navList: [],
            resultList: [],
            text: '',
            drawerOpen: false,
            cleanResult: () =>
                set((state) => ({
                    average: 0,
                    total: 0,
                    sum: 0,
                    text: '',
                    resultList: [],
                    drawData: state.drawData.map(({count, ...other}) => other),
                })),
            grabNavListLoading: false,
            grabData: {},
            experimentMode: false,
            setZState: (value) => set(value),
            getRandomIndexFromDrawData: () => {
                const random = Math.random();
                let count = 0;
                for (let i = 0; i < get().drawData.length; i++) {
                    const thisData = get().drawData[i];
                    if (random >= count && random <= count + thisData.chance / 100) {
                        return {index: i, ...thisData};
                    } else {
                        count = count + thisData.chance / 100;
                    }
                }
            },
            draw: () => {
                if (get().drawData.length === 0) {
                    return;
                }
                for (let i = 0; i < get().drawNums; i++) {
                    const result = get().getRandomIndexFromDrawData();
                    if (result === undefined) {
                        //機率未滿100% 沒抽到東西時
                        set((state) => ({
                            resultList: [...state.resultList, '沒抽到'],
                        }));
                        continue;
                    }
                    set((draft) => {
                        draft.total = draft.total + 1;
                        draft.resultList.push(result.name);
                        if (draft.resultList.length > 0) {
                            draft.sum = draft.sum + parseInt(result.name);
                            draft.average = draft.sum / draft.total;
                        }
                        draft.drawData[result.index].count = (draft.drawData[result.index].count || 0) + 1;
                        if (draft.resultList.length > 100) {
                            //為了程式效能只放100筆
                            draft.resultList.shift();
                        }
                    });
                }
            },
        })),
        {
            name: 'zacharyptt-maplestory-virtual-draw-storage',
        }
    )
);
export default useStore;
