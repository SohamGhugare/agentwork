"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface PostJobDefaults {
  capability?: string;
  agentName?: string;
  price?: number;
}

interface PostJobContextValue {
  isOpen: boolean;
  defaults: PostJobDefaults;
  open: (defaults?: PostJobDefaults) => void;
  close: () => void;
}

const PostJobContext = createContext<PostJobContextValue>({
  isOpen: false,
  defaults: {},
  open: () => {},
  close: () => {},
});

export function usePostJob() {
  return useContext(PostJobContext);
}

export function PostJobProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [defaults, setDefaults] = useState<PostJobDefaults>({});

  const open = (d: PostJobDefaults = {}) => {
    setDefaults(d);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setDefaults({});
  };

  return (
    <PostJobContext.Provider value={{ isOpen, defaults, open, close }}>
      {children}
    </PostJobContext.Provider>
  );
}
