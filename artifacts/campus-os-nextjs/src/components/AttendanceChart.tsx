"use client";

interface AttendanceChartProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
}

export default function AttendanceChart({ percentage, size = 120, strokeWidth = 12 }: AttendanceChartProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;
  
  // Determine color based on threshold (e.g. 75% is LPU's typical requirement)
  const isWarning = percentage < 75;
  const strokeColor = isWarning ? "text-red-500" : "text-green-500";
  const glowColor = isWarning ? "drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" : "drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]";

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
        {/* Background track */}
        <circle
          className="text-white/10"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Progress ring */}
        <circle
          className={`${strokeColor} transition-all duration-1000 ease-out ${glowColor}`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-2xl font-bold">{percentage}%</span>
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Attendance</span>
      </div>
    </div>
  );
}
