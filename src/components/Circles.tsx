"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useTickCounterContext } from "@/context/use-tickcounter";

type CircleProps = {
  id: number;
  value: string;
  isHighlighted: boolean;
  percentage: number;
  isPointer?: boolean;
  fillColor?: string;
};

type CircleRowProps = {
  circles: CircleProps[];
  pointerPosition: number;
};

const Circle: React.FC<CircleProps> = ({
  id,
  value,
  isHighlighted,
  percentage,
  isPointer,
  fillColor = "#e2e8f0",
}) => {
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div
      className={`relative flex flex-col items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full shadow-xl text-center transition-all duration-500 ease-in-out ${isHighlighted
          ? "animate-pulse ring-2 sm:ring-4 ring-blue-300 transform scale-110"
          : "hover:scale-105"
        }`}
      style={{
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)",
      }}
    >
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 50 50">
        <circle
          cx="25"
          cy="25"
          r={radius}
          fill="transparent"
          stroke="#ffffff"
          strokeWidth="6"
        />
        <circle
          cx="25"
          cy="25"
          r={radius}
          fill="transparent"
          stroke={fillColor}
          strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="square"
          transform="rotate(75 25 25)"
          className="transition-all duration-1000 ease-in-out"
        />
      </svg>
      <div
        className="absolute inset-0 flex items-center justify-center rounded-full bg-gray-700"
        style={{
          width: "70%",
          height: "70%",
          top: "15%",
          left: "15%",
        }}
      ></div>
      <div className="relative z-10 flex flex-col items-center justify-center">
        <span className="text-xs sm:text-sm font-semibold text-white">{id}</span>
        <span className="text-[10px] sm:text-xs mt-0.5 sm:mt-1 text-white">
          {value}
        </span>
      </div>
      {isPointer && (
        <div className="absolute -bottom-5 sm:-bottom-7 w-0 h-0 border-l-[6px] sm:border-l-[8px] border-r-[6px] sm:border-r-[8px] border-b-[10px] sm:border-b-[14px] border-l-transparent border-r-transparent border-b-red-500 animate-bounce"></div>
      )}
    </div>
  );
};

const CircleRow: React.FC<CircleRowProps> = ({ circles, pointerPosition }) => {
  return (
    <div className="flex flex-col sm:flex-nowrap gap-4 sm:gap-6 items-center justify-center mr-8">
      <div className="grid grid-cols-5 gap-12">
        {circles.slice(0, 5).map((circle) => (
          <Circle
            key={circle.id}
            {...circle}
            isPointer={circle.id === pointerPosition}
          />
        ))}
      </div>
      <div className="grid grid-cols-5 gap-12">
        {circles.slice(5, 10).map((circle) => (
          <Circle
            key={circle.id}
            {...circle}
            isPointer={circle.id === pointerPosition}
          />
        ))}
      </div>
    </div>
  );
};

const CircleDesign: React.FC = () => {
  const { tickCounter, digitPercentages } = useTickCounterContext();
  const lastDigit = parseInt(tickCounter.toString().slice(-1), 10);
  const [selectedDigit, setSelectedDigit] = useState<number>(5); // Default digit is 5
  const [animatedOver, setAnimatedOver] = useState(0);
  const [animatedUnder, setAnimatedUnder] = useState(0);
  const [tickStream, setTickStream] = useState<{ type: "O" | "U"; id: number }[]>([]);

  const data = useMemo(() => {
    if (!digitPercentages || Object.keys(digitPercentages).length === 0) {
      return [];
    }

    const percentagesArray = Object.entries(digitPercentages).map(
      ([digit, percentage]) => ({
        id: parseInt(digit, 10),
        percentage,
      })
    );

    const minPercentageCircle = percentagesArray.reduce((min, current) =>
      current.percentage < min.percentage ? current : min
    );

    const maxPercentageCircle = percentagesArray.reduce((max, current) =>
      current.percentage > max.percentage ? current : max
    );

    return percentagesArray.map(({ id, percentage }) => {
      const value = `${percentage.toFixed(1)}%`;
      const isHighlighted = id === lastDigit;
      let fillColor = "#1e3a8a";
      if (id === minPercentageCircle.id) {
        fillColor = "#EF4444";
      } else if (id === maxPercentageCircle.id) {
        fillColor = "#10B981";
      }

      return {
        id,
        value,
        isHighlighted,
        percentage,
        fillColor,
      };
    });
  }, [digitPercentages, lastDigit]);

  const overUnderPercentages = useMemo(() => {
    if (selectedDigit === null || !digitPercentages) {
      return { over: 0, under: 0 };
    }

    let overPercentage = 0;
    let underPercentage = 0;

    Object.entries(digitPercentages).forEach(([digit, percentage]) => {
      const digitNumber = parseInt(digit, 10);
      if (digitNumber > selectedDigit) {
        overPercentage += percentage;
      } else if (digitNumber <= selectedDigit) {
        underPercentage += percentage;
      }
    });

    return {
      over: overPercentage,
      under: underPercentage,
    };
  }, [selectedDigit, digitPercentages]);

  useEffect(() => {
    const overInterval = setInterval(() => {
      setAnimatedOver((prev) => {
        const diff = overUnderPercentages.over - prev;
        if (Math.abs(diff) < 0.1) return overUnderPercentages.over;
        return prev + diff * 0.1;
      });
    }, 50);

    const underInterval = setInterval(() => {
      setAnimatedUnder((prev) => {
        const diff = overUnderPercentages.under - prev;
        if (Math.abs(diff) < 0.1) return overUnderPercentages.under;
        return prev + diff * 0.1;
      });
    }, 50);

    return () => {
      clearInterval(overInterval);
      clearInterval(underInterval);
    };
  }, [overUnderPercentages]);

  useEffect(() => {
    if (selectedDigit !== null) {
      const interval = setInterval(() => {
        const randomTick = Math.floor(Math.random() * 10);
        const type = randomTick > selectedDigit ? "O" : "U";
        setTickStream((prev) => [
          ...prev,
          { type, id: Date.now() }, // Add new tick to the end
        ]);
      }, 1000); // Simulate a tick every second

      return () => clearInterval(interval);
    }
  }, [selectedDigit]);

  // Remove old ticks after they move out of view
  useEffect(() => {
    const maxTicks = window.innerWidth >= 768 ? 18 : 5; // 18 ticks on large screens, 4 on small screens
    if (tickStream.length > maxTicks) {
      setTickStream((prev) => prev.slice(1)); // Remove the oldest tick
    }
  }, [tickStream]);

  if (data.length === 0) {
    return (
      <div className="bg-transparent p-6 sm:p-8 z-50">
        <p className="text-center text-gray-500">No data available.</p>
      </div>
    );
  }

  return (
    <div className="bg-white flex flex-col rounded-md shadow-[0_4px_10px_rgba(255,255,255,0.8)] items-center justify-center p-4 sm:p-8 md:mx-8 -mx-4 w-full z-50">
      <div className="bg-gray-100 rounded-md shadow-md flex items-center justify-center p-4 sm:p-8 w-full z-50">
        <CircleRow circles={data} pointerPosition={lastDigit} />
      </div>
      <div className="bg-gray-100 rounded-md shadow-[0_4px_10px_rgba(255,255,255,0.8)] flex flex-col items-center justify-center p-4 sm:p-8 w-full z-50 my-3">
        <h1 className="text-lg font-semibold mb-4 text-blue-900 animate-fade-in">
          Over and Under Analysis
        </h1>
        <div className="flex flex-wrap gap-2 mb-4 items-center justify-center">
          {Array.from({ length: 10 }, (_, i) => (
            <button
              key={i}
              className={`w-10 h-10 flex items-center justify-center rounded-md shadow-md transition-all duration-200 ${selectedDigit === i
                  ? "bg-gradient-to-br from-blue-900 to-blue-700 text-white font-bold border border-blue-900 transform scale-110 animate-glow"
                  : "bg-white hover:bg-gradient-to-br hover:from-blue-900 hover:to-blue-700 hover:text-white text-blue-900 font-bold border border-blue-900 hover:scale-105"
                }`}
              onClick={() => setSelectedDigit(i)}
            >
              {i}
            </button>
          ))}
        </div>
        <div className="flex gap-8 w-full max-w-md animate-fade-in">
          <div className="flex-1 bg-green-200 p-4 rounded-md shadow-md hover:shadow-lg transition-shadow duration-300">
            <span className="text-lg font-semibold text-blue-900">Over</span>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${animatedOver}%` }}
              ></div>
            </div>
            <span className="text-xl text-green-600 block mt-2 animate-fade-in">
              {animatedOver.toFixed(1)}%
            </span>
          </div>
          <div className="flex-1 bg-red-200 p-4 rounded-md shadow-md hover:shadow-lg transition-shadow duration-300">
            <span className="text-lg font-semibold text-blue-900">Under</span>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-gradient-to-r from-red-400 to-red-600 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${animatedUnder}%` }}
              ></div>
            </div>
            <span className="text-xl text-red-600 block mt-2 animate-fade-in">
              {animatedUnder.toFixed(1)}%
            </span>
          </div>
        </div>
        {/* Live Stream Section */}
        <div className="mt-6 w-full">
          <div className="relative h-20 overflow-hidden">
            <div className="flex space-x-4 animate-moveLeft">
              {tickStream.map((tick) => (
                <div
                  key={tick.id}
                  className={`w-12 h-12 flex items-center justify-center rounded-full shadow-lg text-white font-bold text-lg animate-float ${tick.type === "O" ? "bg-green-500" : "bg-red-500"
                    }`}
                >
                  {tick.type}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CircleDesign;