/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import axios from "axios";

export const getScoreboard = async (filter: "weekly" | "monthly" | "all", token: string) => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_API}/score?filter=${filter}`,
    {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};
