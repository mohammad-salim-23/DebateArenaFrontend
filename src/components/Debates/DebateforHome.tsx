"use client";

import React, { useEffect, useMemo, useState } from "react";
import { getAllDebates } from "@/services/DebateService/DebateService";
import { Button } from "@/components/ui/button";
import { FaList } from "react-icons/fa";
import { LuLayoutGrid } from "react-icons/lu";

import Image from "next/image";

type TDebate = {
  _id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  createdBy: {
    username: string;
    email: string;
  };
  tags: string[];
  duration: number;
  endsAt: string;
};

const Debates = () => {
  const [debates, setDebates] = useState<TDebate[]>([]);
  const [limit, setLimit] = useState(6);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isGrid, setIsGrid] = useState(true);

  useEffect(() => {
    const fetchDebates = async () => {
      setLoading(true);
      try {
        const res = await getAllDebates();
        setDebates(res.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDebates();
  }, []);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * limit;
    return debates.slice(start, start + limit);
  }, [debates, page, limit]);

  return (
    <div>
      {/* Filters & Listings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        <div>
          <h2 className="text-2xl font-bold">Explore Debates</h2>
          <p className="text-gray-500">
            Showing {paginatedData.length} of {debates.length} debates.
          </p>
        </div>
        <div className="flex justify-end gap-4">
          <div className="flex items-center gap-2">
            <h2 className="!text-sm">Show:</h2>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="border rounded px-2 py-1"
            >
              <option value={3}>3</option>
              <option value={6}>6</option>
              <option value={9}>9</option>
              <option value={12}>12</option>
            </select>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <h2 className="!text-sm">View:</h2>
            <Button
              className="bg-transparent text-gray-700 hover:bg-transparent !p-0 cursor-pointer"
              onClick={() => setIsGrid(true)}
            >
              <LuLayoutGrid size={24} />
            </Button>
            <Button
              className="bg-transparent text-gray-700 hover:bg-transparent !p-0 cursor-pointer"
              onClick={() => setIsGrid(false)}
            >
              <FaList size={24} />
            </Button>
          </div>
        </div>
      </div>

      {/* Listings */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {isGrid ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedData.map((debate) => (
                <div
                  key={debate._id}
                  className="border rounded p-4 hover:shadow-lg transition"
                >
                  <Image
                    src={debate.image}
                    alt={debate.title}
                    width={128}
                    height={128}
                    className="object-cover rounded"
                  />
                  <h3 className="text-lg font-bold">{debate.title}</h3>
                  <p className="text-gray-600">{debate.description}</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Category: {debate.category}
                  </p>
                  <p className="text-sm text-gray-400">
                    Ends At: {new Date(debate.endsAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div>
              {paginatedData.map((debate) => (
                <div
                  key={debate._id}
                  className="border rounded p-4 flex gap-4 mb-4 hover:shadow-lg transition"
                >
                  <Image
                    src={debate.image}
                    alt={debate.title}
                    width={128}
                    height={128}
                    className="object-cover rounded"
                  />
                  <div>
                    <h3 className="text-lg font-bold">{debate.title}</h3>
                    <p className="text-gray-600">{debate.description}</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Category: {debate.category}
                    </p>
                    <p className="text-sm text-gray-400">
                      Ends At: {new Date(debate.endsAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Debates;
