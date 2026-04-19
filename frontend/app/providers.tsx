"use client";

import { ToastProvider } from "@/lib/toast-context";
import { PostJobProvider } from "@/lib/post-job-context";
import type { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <PostJobProvider>
        {children}
      </PostJobProvider>
    </ToastProvider>
  );
}
