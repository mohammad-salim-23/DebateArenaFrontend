/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import axios from "axios";

export const createDebate = async (debateData: FormData, token: string) => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_BASE_API}/debates`,
    debateData,
    {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};


export const getAllDebates = async () => {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_API}/debates`, {
    withCredentials: true,
  });
  return res.data;
};

export const joinDebate = async (id: string, side: string) => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_BASE_API}/debates/join/${id}`,
    { side },
    { withCredentials: true }
  );
  return res.data;
};
