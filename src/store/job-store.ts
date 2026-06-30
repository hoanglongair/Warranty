"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Job } from "@/types";

interface JobStore {
  bookmarkedJobs: string[];
  appliedJobs: string[];
  myJobs: Job[];
  bookmarkJob: (id: string) => void;
  unbookmarkJob: (id: string) => void;
  applyToJob: (id: string) => void;
  addJob: (job: Job) => void;
}

export const useJobStore = create<JobStore>()(
  persist(
    (set) => ({
      bookmarkedJobs: [],
      appliedJobs: [],
      myJobs: [],
      bookmarkJob: (id) =>
        set((state) => ({
          bookmarkedJobs: state.bookmarkedJobs.includes(id)
            ? state.bookmarkedJobs
            : [...state.bookmarkedJobs, id]
        })),
      unbookmarkJob: (id) =>
        set((state) => ({
          bookmarkedJobs: state.bookmarkedJobs.filter((j) => j !== id)
        })),
      applyToJob: (id) =>
        set((state) => ({
          appliedJobs: state.appliedJobs.includes(id)
            ? state.appliedJobs
            : [...state.appliedJobs, id]
        })),
      addJob: (job) => set((state) => ({ myJobs: [job, ...state.myJobs] }))
    }),
    {
      name: "warranty-jobs"
    }
  )
);
