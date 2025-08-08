"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import {
  animate,
  useMotionTemplate,
  useMotionValue,
  motion,
} from "framer-motion";
import { TbSearch as Search } from "react-icons/tb";
import { FiArrowRight as Right } from "react-icons/fi";
import Link from "../link";

export interface BeamInputProps {
  type: "subscribe" | "search";
  placeholder: string;
  title: string;
}

export default function BeamInput({
  type,
  placeholder,
  title,
}: BeamInputProps) {
  const router = useRouter();

  const [search, setSearch] = useState<string>("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const turn = useMotionValue(0);

  useEffect(() => {
    animate(turn, 1, {
      ease: "linear",
      duration: 5,
      repeat: Infinity,
    });
  }, []);

  const backgroundImage = useMotionTemplate`conic-gradient(from ${turn}turn, #0177E700 75%, #0177E7 100%)`;

  const handleSubmit = () => {
    if (type === "search")
      window.open(
        `https://v3.znsconnect.io/search?domain=${inputRef.current?.value}`
      );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      router.push(`search?domain=${search}`);
    }
  };

  return (
    <div className="relative w-full max-w-[500px] flex items-center gap-2 rounded-full border border-white-200 bg-gradient-to-br from-white-200 to-white-100 backdrop-blur py-1.5 pl-6 pr-1.5">
      <input
        onChange={(e) => setSearch(e.target.value)}
        value={search}
        type={type === "search" ? "search" : "email"}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm text-white placeholder-white/80 focus:outline-0"
        onKeyDown={(e) => handleKeyDown(e)}
      />

      <Link
        newTab
        href={`search?domain=${search}`}
        className="group flex shrink-0 items-center gap-1.5 rounded-full bg-gradient-to-br from-white-100 to-white-400 px-4 py-3 text-sm font-medium text-white transition-transform active:scale-[0.985]"
      >
        <span>{title}</span>
        {type === "search" ? (
          <Search
            size={15}
            className="-mr-6 opacity-0 transition-all group-hover:-mr-0 group-hover:opacity-100 group-active:-rotate-45"
          />
        ) : (
          <Right
            size={15}
            className="-mr-6 opacity-0 transition-all group-hover:-mr-0 group-hover:opacity-100 group-active:-rotate-45"
          />
        )}
      </Link>

      <div className="pointer-events-none absolute inset-0 z-10 rounded-full">
        <motion.div
          style={{
            backgroundImage,
          }}
          className="mask-with-browser-support absolute -inset-[1px] rounded-full border border-transparent bg-origin-border"
        />
      </div>
    </div>
  );
}
