"use client";

import { useContext, createContext, useState, useEffect } from "react";

interface TickCounterContext {
  tickCounter: number;
  setTickCounter: (tickCounter: number) => void;
  tickHistory: string[];
  setTickHistory: (tickHistory: string[]) => void;
  addToTickHistory: (tick: string) => void;
  digitPercentages: Record<number, number>;
}

const initialValues: TickCounterContext = {
  tickCounter: 0,
  setTickCounter: () => {},
  tickHistory: [],
  setTickHistory: () => {},
  addToTickHistory: () => {},
  digitPercentages: {},
};

const tickCounterContext = createContext<TickCounterContext>(initialValues);
const { Provider } = tickCounterContext;

export const TickCounterProvider = ({ children }: { children: React.ReactNode }) => {
  const [tickCounter, setTickCounter] = useState<number>(initialValues.tickCounter);
  const [tickHistory, setTickHistory] = useState<string[]>([]);
  const [digitPercentages, setDigitPercentages] = useState<Record<number, number>>({});

  // Load data from localStorage on the client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedHistory = localStorage.getItem("tickHistory");
      const storedPercentages = localStorage.getItem("digitPercentages");

      if (storedHistory) setTickHistory(JSON.parse(storedHistory));
      if (storedPercentages) setDigitPercentages(JSON.parse(storedPercentages));
    }
  }, []);

  const addToTickHistory = (tick: string) => {
    setTickHistory((prev) => {
      const updatedHistory = [...prev, tick];
      if (updatedHistory.length > 1000) {
        updatedHistory.shift(); // Remove the oldest tick
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("tickHistory", JSON.stringify(updatedHistory));
      }

      return updatedHistory;
    });
  };

  useEffect(() => {
    if (tickHistory.length === 0) return;

    const calculatePercentages = () => {
      const digitCounts: Record<number, number> = {};

      for (let digit = 0; digit <= 9; digit++) {
        digitCounts[digit] = 0;
      }

      tickHistory.forEach((tick) => {
        const lastDigit = parseInt(tick.slice(-1), 10);
        if (!isNaN(lastDigit)) {
          digitCounts[lastDigit] += 1;
        }
      });

      const totalTicks = tickHistory.length;
      const percentages: Record<number, number> = {};

      for (let digit = 0; digit <= 9; digit++) {
        const count = digitCounts[digit];
        percentages[digit] = totalTicks > 0 ? parseFloat(((count / totalTicks) * 100).toFixed(2)) : 0;
      }

      setDigitPercentages(percentages);

      if (typeof window !== "undefined") {
        localStorage.setItem("digitPercentages", JSON.stringify(percentages));
      }
    };

    calculatePercentages();
  }, [tickHistory]);

  return (
    <Provider value={{ tickCounter, setTickCounter, tickHistory, setTickHistory, addToTickHistory, digitPercentages }}>
      {children}
    </Provider>
  );
};

export const useTickCounterContext = () => useContext(tickCounterContext);
