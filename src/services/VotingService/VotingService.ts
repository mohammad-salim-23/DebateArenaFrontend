"use client";

import axios from "axios";

export const voteArgument = async (id: string, token: string) => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_BASE_API}/voting/${id}/vote`,
    {},
    {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};
