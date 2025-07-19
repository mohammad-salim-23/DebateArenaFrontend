"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import NLButton from "@/components/ui/core/ImageUploader/NLButton";
import { getAllDebates } from "@/services/DebateService/DebateService";
import { IDebate } from "@/types/debate.type";
import Image from "next/image";

const AllDebates = () => {
  const [debates, setDebates] = useState<IDebate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDebates = async () => {
      try {
        const response = await getAllDebates();
        setDebates(response.data || []);
      } catch (error) {
        console.error("Error fetching debates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDebates();
  }, []);

  if (loading) {
    return <p>Loading debates...</p>;
  }

  return (
    <div className="container mx-auto px-3 my-10">
      <h1 className="text-2xl font-bold mb-6">All Debates</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {debates.map((debate) => (
          <div
  key={debate._id?.toString()}
  className="border rounded shadow p-4 cursor-default hover:bg-gray-50 flex flex-col"
>
  {debate.image && (
    <Image
      src={debate.image}
      alt={debate.title}
      width={400}
      height={192}
      className="w-full h-48 object-cover rounded mb-4"
      style={{ width: "100%", height: "12rem" }}
      unoptimized={false}
    />
  )}

  <h2 className="text-xl font-semibold mb-2">{debate.title}</h2>
  <p className="text-gray-600 mb-2">{debate.description}</p>
  <div className="flex flex-wrap gap-2 mb-2">
    {debate.tags.map((tag) => (
      <span
        key={tag}
        className="bg-gray-200 text-gray-800 px-2 py-1 rounded text-xs"
      >
        {tag}
      </span>
    ))}
  </div>
  <p className="text-sm text-gray-500">Category: {debate.category}</p>
  <p className="text-sm text-gray-500">
    Duration: {debate.duration} hours
  </p>

  <div className="mt-auto">
    <Link href={`/details/${debate._id}`}>
      <NLButton
        variant="outline"
        className="mt-3 w-full cursor-pointer text-teal-400 bg-teal-400 font-bold hover:bg-teal-600 hover:text-white"
      >
        View Details
      </NLButton>
    </Link>
  </div>
</div>

        ))}
      </div>
    </div>
  );
};

export default AllDebates;
