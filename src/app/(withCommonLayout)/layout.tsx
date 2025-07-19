
import Banner from "@/components/Banner/Banner";
import Navbar from "@/components/shared/Navbar";
import React from "react";

const CommonLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
    
      <main className="min-h-screen">
        {children}</main>
   
    </>
  );
};

export default CommonLayout;
