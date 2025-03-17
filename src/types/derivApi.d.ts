// types/derivApi.d.ts

export interface TickData {
    ticks?: {
        symbol: string;
        tick: number;
        time: number;
    }[];
}
