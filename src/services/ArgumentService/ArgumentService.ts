/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import axios from "axios";

export const createArgument = async (data: any, token: string) => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_BASE_API}/arguments`,
    data,
    {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const getArgumentsByDebate = async (debateId: string, token: string) => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_API}/arguments/${debateId}`,
    {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const updateArgument = async (id: string, content: string, token: string) => {
  const res = await axios.put(
    `${process.env.NEXT_PUBLIC_BASE_API}/arguments/${id}`,
    { content },
    {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const deleteArgument = async (id: string, token: string) => {
  const res = await axios.delete(
    `${process.env.NEXT_PUBLIC_BASE_API}/arguments/${id}`,
    {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};
