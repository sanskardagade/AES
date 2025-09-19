import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";

export default function Timer({ duration, onTimeUp }) {
  const [time, setTime] = useState(duration);

  useEffect(() => {
    if (time <= 0) {
      onTimeUp();
      return;
    }
    const interval = setInterval(() => setTime((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [time, onTimeUp]);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  // Color changes based on remaining time
  const getTimerColor = () => {
    if (time < 60) return "bg-[#e18891] text-white"; // Reddish when less than 1 minute
    if (time < 300) return "bg-[#e1ab30] text-[#0c2543]"; // Yellowish when less than 5 minutes
    return "bg-[#0e6994] text-white"; // Normal blue color
  };

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-colors ${getTimerColor()}`}>
      <Clock className="w-4 h-4" />
      <span className="font-mono">
        {minutes}:{seconds.toString().padStart(2, "0")}
      </span>
    </div>
  );
}