"use client";

import React, { useEffect, useMemo, useState } from "react";
import { getAllDebates } from "@/services/DebateService/DebateService";
import Image from "next/image";
import Link from "next/link";
import NLButton from "../ui/core/ImageUploader/NLButton";

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
  votes?: number; // if your schema has votes
};

const Debates = () => {
  const [debates, setDebates] = useState<TDebate[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination & Limit
  const [limit, setLimit] = useState(6);
  const [page, setPage] = useState(1);

  // Filtering & Sorting states
  const [searchTitle, setSearchTitle] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOption, setSortOption] = useState("newest");

  useEffect(() => {
    const fetchDebates = async () => {
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

  const filteredDebates = useMemo(() => {
    let data = debates;

    if (searchTitle) {
      data = data.filter((d) =>
        d.title.toLowerCase().includes(searchTitle.toLowerCase())
      );
    }

    if (selectedTag) {
      data = data.filter((d) => d.tags.includes(selectedTag));
    }

    if (selectedCategory) {
      data = data.filter((d) => d.category === selectedCategory);
    }

    if (sortOption === "newest") {
      data = data.sort(
        (a, b) => new Date(b.endsAt).getTime() - new Date(a.endsAt).getTime()
      );
    } else if (sortOption === "endingSoon") {
      data = data.sort(
        (a, b) => new Date(a.endsAt).getTime() - new Date(b.endsAt).getTime()
      );
    } else if (sortOption === "mostVoted") {
      data = data.sort((a, b) => (b.votes || 0) - (a.votes || 0));
    }

    return data;
  }, [debates, searchTitle, selectedTag, selectedCategory, sortOption]);

  // Pagination
  const paginatedDebates = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredDebates.slice(start, start + limit);
  }, [filteredDebates, page, limit]);

  const totalPages = Math.ceil(filteredDebates.length / limit);

  // Extract unique tags and categories for filter options
  const allTags = Array.from(new Set(debates.flatMap((d) => d.tags)));
  const allCategories = Array.from(new Set(debates.map((d) => d.category)));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Filters</h2>

          <div>
            <label className="block text-sm font-medium mb-1">Search Title:</label>
            <input
              type="text"
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
              placeholder="Search by title"
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Filter by Tag:</label>
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="w-full border rounded px-3 py-2 cursor-pointer"
            >
              <option value="">All Tags</option>
              {allTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Filter by Category:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full border rounded px-3 py-2 cursor-pointer"
            >
              <option value="">All Categories</option>
              {allCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Sort By:</label>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full border rounded px-3 py-2 cursor-pointer"
            >
              <option value="newest">Newest</option>
              <option value="endingSoon">Ending Soon</option>
              <option value="mostVoted">Most Voted</option>
            </select>
          </div>
        </div>

        {/* Main Debates Listing */}
        <div className="md:col-span-3">
          <div className="flex items-center justify-between mb-4">
            {/* Limit input */}
            <div className="flex items-center gap-2">
              <h2 className="!text-sm">Show:</h2>
              <input
                type="number"
                value={limit === filteredDebates.length ? "" : limit}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "") {
                    setLimit(filteredDebates.length);
                  } else {
                    setLimit(Number(value));
                    setPage(1);
                  }
                }}
                placeholder="All"
                className="border rounded px-2 py-1 w-20"
                min="1"
                max={filteredDebates.length}
              />
              <button
                type="button"
                onClick={() => {
                  setLimit(filteredDebates.length);
                  setPage(1);
                }}
                className="text-teal-500 text-xs underline cursor-pointer"
              >
                All
              </button>
            </div>

            {/* Pagination */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="px-3 py-1 border rounded cursor-pointer disabled:opacity-50"
              >
                Prev
              </button>
              <span className="text-sm">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="px-3 py-1 border rounded cursor-pointer disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>

          {loading ? (
            <p>Loading debates...</p>
          ) : paginatedDebates.length === 0 ? (
            <p>No debates found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedDebates.map((debate) => (
                <div
                  key={debate._id}
                  className="border rounded p-4 flex flex-col hover:shadow transition cursor-pointer"
                >
                  <Image
                    src={debate.image}
                    alt={debate.title}
                    width={400}
                    height={200}
                    className="object-cover rounded mb-3"
                  />
                  <h3 className="text-lg font-bold">{debate.title}</h3>
                  <p className="text-gray-600 flex-1">{debate.description}</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Category: {debate.category}
                  </p>
                  <p className="text-sm text-gray-400">
                    Ends At: {new Date(debate.endsAt).toLocaleString()}
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
          )}
        </div>
      </div>
    </div>
  );
};

export default Debates;
