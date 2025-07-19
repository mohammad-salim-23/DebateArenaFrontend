"use client";

import React, { useState } from "react";
import Image from "next/image";
import NLButton from "@/components/ui/core/ImageUploader/NLButton";
import { useCurrentUser } from "@/services/AuthService/AuthService";
import { Dialog } from "@headlessui/react";
import DebateForm from "../DebateForm/DebateForm";
import banner1 from "@/app/assets/images/debate.jpg";

export default function Banner() {
  const { user, loading } = useCurrentUser();
  const [isOpen, setIsOpen] = useState(false);

  const handleCreateDebate = () => {
    if (!user) {
      window.location.href = "/sign-in";
    } else {
      setIsOpen(true);
    }
  };

  return (
    <div className="relative w-full">
      {/* Image container with responsive height */}
      <div className="relative w-full h-[50vh] md:h-[70vh] lg:h-[80vh]">
        <Image
          src={banner1}
          alt="Banner"
          fill
          className="
            md:object-cover 
            lg:object-fill 
            lg:w-full lg:h-full
            brightness-75
          "
          priority
        />
      </div>

      {/* Overlay content */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 text-white">
        <h2 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-xl">
          Join the Debate Arena
        </h2>
        <p className="max-w-xl mb-6 text-gray-100">
          Create debates, share your opinions, and explore others’ perspectives.
        </p>

        <NLButton
          onClick={handleCreateDebate}
          variant="outline"
          className="px-6 py-3 text-lg border-teal-500 text-teal-500 hover:bg-white hover:text-teal-700 transition font-bold "
        >
          Create Debate
        </NLButton>
      </div>

      {/* Debate Form Modal */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-lg max-w-2xl w-full p-6 overflow-y-auto max-h-[90vh] relative">
            
            {/* Close icon */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-red-500 hover:text-red-700 text-xl font-bold cursor-pointer"
              aria-label="Close"
            >
              ×
            </button>

            <DebateForm closeModal={() => setIsOpen(false)} />
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
