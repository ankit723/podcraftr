'use client';

import { AudioContextType, AudioProps } from "@/types";
import { usePathname } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";

// Create context with undefined as initial value
const AudioContext = createContext<AudioContextType | undefined>(undefined);

/**
 * Provider component for managing audio state across the application
 */
const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  const [audio, setAudio] = useState<AudioProps | undefined>(undefined);
  const pathname = usePathname();

  // Reset audio when navigating to create-podcast page
  useEffect(() => {
    if (pathname === '/create-podcast') {
      setAudio(undefined);
    }
  }, [pathname]);

  return (
    <AudioContext.Provider value={{ audio, setAudio }}>
      {children}
    </AudioContext.Provider>
  );
};

/**
 * Custom hook to access audio context
 * @returns AudioContextType containing audio state and setter
 * @throws Error if used outside of AudioProvider
 */
export const useAudio = (): AudioContextType => {
  const context = useContext(AudioContext);
  
  if (context === undefined) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  
  return context;
};

export default AudioProvider;