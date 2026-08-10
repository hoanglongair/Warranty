"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Job } from "@/types";

interface JobStore {
  jobs: Job[];
  isLoading: boolean;
  bookmarkedJobs: string[];
  appliedJobs: string[];
  myJobs: Job[];
  fetchJobs: (category?: string, search?: string) => Promise<void>;
  bookmarkJob: (id: string) => void;
  unbookmarkJob: (id: string) => void;
  applyToJob: (id: string) => void;
  addJob: (job: Job) => Promise<void>;
}

export const useJobStore = create<JobStore>()(
  persist(
    (set, get) => ({
      jobs: [],
      isLoading: false,
      bookmarkedJobs: [],
      appliedJobs: [],
      myJobs: [],

      fetchJobs: async (category, search) => {
        set({ isLoading: true });
        try {
          const params = new URLSearchParams();
          if (category) params.append("category", category);
          if (search) params.append("search", search);

          const res = await fetch(`/api/jobs?${params.toString()}`);
          const data = await res.json();
          if (data.jobs) {
            set({ jobs: data.jobs, isLoading: false });
          } else {
            set({ isLoading: false });
          }
        } catch (error) {
          console.error("Fetch jobs error:", error);
          set({ isLoading: false });
        }
      },

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

      addJob: async (job) => {
        set((state) => ({
          myJobs: [job, ...state.myJobs.filter((j) => j.id !== job.id)],
          jobs: [job, ...state.jobs.filter((j) => j.id !== job.id)]
        }));
      }
    }),
    {
      name: "warranty-jobs",
      partialize: (state) => ({
        bookmarkedJobs: state.bookmarkedJobs,
        appliedJobs: state.appliedJobs,
        myJobs: state.myJobs
      })
    }
  )
);
