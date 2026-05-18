"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface ThunderLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "full" | "icon";
  option?: 1 | 2 | 3;
}

export function ThunderLogo({
  className,
  size = "md",
  variant = "full",
  option,
}: ThunderLogoProps) {
  const [activeOption, setActiveOption] = useState<1 | 2 | 3>(1);

  useEffect(() => {
    // Dynamically check if a user has selected a logo option in the design showcase
    const stored = localStorage.getItem("thunder_logo_option");
    if (stored) {
      const parsed = parseInt(stored, 10);
      if (parsed === 1 || parsed === 2 || parsed === 3) {
        setActiveOption(parsed as 1 | 2 | 3);
      }
    }
  }, []);

  // Use the explicitly provided option prop, or fallback to the site-wide stored active option
  const selectedOption = option !== undefined ? option : activeOption;

  const sizes = {
    sm: { icon: 24, text: "text-sm", subtitle: "text-[8px]" },
    md: { icon: 32, text: "text-lg", subtitle: "text-[10px]" },
    lg: { icon: 48, text: "text-2xl", subtitle: "text-[12px]" },
    xl: { icon: 64, text: "text-4xl", subtitle: "text-[16px]" },
  };

  const { icon, text, subtitle } = sizes[size];

  // Option 1: Classic Yellow Circle Badge
  const renderOption1 = () => (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative flex items-center justify-center">
        <svg
          width={icon}
          height={icon}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-300 hover:scale-110"
        >
          <circle cx="24" cy="24" r="22" fill="#FFD709" className="drop-shadow-md" />
          <path
            d="M28 12L16 26H23L20 36L32 22H25L28 12Z"
            fill="#0A0A0A"
            stroke="#0A0A0A"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      {variant === "full" && (
        <div className="flex flex-col justify-center leading-none">
          <div className={cn("font-black tracking-tight text-[#0A0A0A] dark:text-[#f9f6f5]", text)}>
            Thunder<span className="text-[#FFD709] ml-1">Food</span>
          </div>
          <span className={cn("font-bold tracking-[0.2em] text-[#afadac] uppercase mt-0.5", subtitle)}>
            Premium Delivery
          </span>
        </div>
      )}
    </div>
  );

  // Option 2: High-Velocity Dark Italic (Matching the Login Screen style)
  const renderOption2 = () => (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative flex items-center justify-center">
        <svg
          width={icon}
          height={icon}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-300 hover:rotate-6 hover:scale-110"
        >
          {/* Futuristic stylized italic shield container */}
          <path
            d="M8 8L36 4L42 20L20 44L6 28L8 8Z"
            fill="#1E1E1E"
            stroke="#FFD709"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path
            d="M27 10L17 24H23L20 34L31 20H25L27 10Z"
            fill="#FFD709"
            stroke="#FFD709"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      {variant === "full" && (
        <div className="flex flex-col leading-none animate-pulse-subtle">
          <div className={cn("font-headline font-black italic tracking-tighter uppercase text-[#0A0A0A] dark:text-[#f9f6f5] leading-[0.9]", text)}>
            THUNDER<br />
            <span className="text-[#FFD709]">DELIVERY</span>
          </div>
        </div>
      )}
    </div>
  );

  // Option 3: Minimalist Food Dome & Lightning Emblem (Luxury Gold & Carbon)
  const renderOption3 = () => (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="relative flex items-center justify-center">
        <svg
          width={icon}
          height={icon}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-all duration-300 hover:scale-110"
        >
          {/* Elegant food dome plate outline */}
          <path
            d="M6 34H42"
            stroke="#FFD709"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M10 34C10 24.5 16.5 17 24 17C31.5 17 38 24.5 38 34"
            stroke="#FFD709"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Little handle on top of dome */}
          <circle cx="24" cy="14" r="2.5" fill="#FFD709" />
          {/* Clean lightning bolt cutting through in charcoal & gold */}
          <path
            d="M26 18L18 28H23L21 34L29 24H24L26 18Z"
            fill="#FFD709"
            stroke="#0A0A0A"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      {variant === "full" && (
        <div className="flex flex-col justify-center leading-none">
          <div className={cn("font-light tracking-[0.25em] uppercase text-[#0A0A0A] dark:text-[#f9f6f5]", text)}>
            THUNDER
          </div>
          <span className={cn("font-black tracking-[0.1em] text-[#FFD709] uppercase mt-0.5", subtitle)}>
            FOOD SYSTEM
          </span>
        </div>
      )}
    </div>
  );

  switch (selectedOption) {
    case 2:
      return renderOption2();
    case 3:
      return renderOption3();
    case 1:
    default:
      return renderOption1();
  }
}
