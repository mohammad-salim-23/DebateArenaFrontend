"use client";

import { signIn, signOut, useSession } from "next-auth/react";



export const useCurrentUser = () => {
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const user = session?.user || null;

  return { user, loading };
};


export const logout = async () => {
  await signOut({
    callbackUrl: "/", 
  });
};
