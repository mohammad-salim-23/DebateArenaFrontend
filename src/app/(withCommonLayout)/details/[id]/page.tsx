/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { getSingleDebate, joinDebate } from "@/services/DebateService/DebateService";
import NLButton from "@/components/ui/core/ImageUploader/NLButton";
import Image from "next/image";
import { createArgument, getArgumentsByDebate } from "@/services/ArgumentService/ArgumentService";
import { voteArgument } from "@/services/VotingService/VotingService";

const DebateDetails = () => {
  const router = useRouter();
  const params = useParams();
  const { data: session } = useSession();
  const token = session?.user?.token;

  const [debate, setDebate] = useState<any>(null);
  const [argumentsList, setArgumentsList] = useState<any[]>([]);
  const [showCount, setShowCount] = useState(7);
  const [newArgument, setNewArgument] = useState("");
  const [argumentSide, setArgumentSide] = useState<"support" | "oppose">("support");
  const [loading, setLoading] = useState(true);

  const debateId = params?.id as string;

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const debateRes = await getSingleDebate(debateId);
      setDebate(debateRes.data);

      const argRes = await getArgumentsByDebate(debateId, token as string);
      setArgumentsList(argRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [debateId, token]);

  useEffect(() => {
    if (!token) {
      router.push("/sign-in");
    } else {
      fetchData();
    }
  }, [debateId, token, router, fetchData]);

  const handleJoin = async (side: "support" | "oppose") => {
    try {
      await joinDebate(debateId, side, token as string);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleVote = async (argumentId: string) => {
    try {
      await voteArgument(argumentId, token as string);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddArgument = async () => {
    if (!newArgument.trim()) return;
    try {
      await createArgument(
        { debateId, content: newArgument, side: argumentSide },
        token as string
      );
      setNewArgument("");
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading || !debate) return <p>Loading...</p>;

  const isClosed = new Date() > new Date(debate.endsAt);

  return (
    <div className="container mx-auto px-3 my-10 flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Debate Info */}
        <div className="md:col-span-2">
          <Image
            src={debate.image}
            alt={debate.title}
            width={800}
            height={500}
            className="object-contain rounded mb-4 w-full h-auto max-h-96 mx-auto"
          />
        </div>
        <div className="md:col-span-2 bg-white p-5 rounded text-center">
          <h1 className="text-3xl font-bold mb-3">{debate.title}</h1>

          <div className="mb-4">
            <p className="text-sm font-medium text-gray-600">
              Category:{" "}
              <span className="text-gray-800">{debate.category || "General"}</span>
            </p>
            {debate.tags && debate.tags.length > 0 && (
              <div className="mt-1 flex flex-wrap justify-center gap-2">
                {debate.tags.map((tag: string, idx: number) => (
                  <span
                    key={idx}
                    className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <p className="mb-4 text-gray-700">{debate.description}</p>

          <div className="flex flex-col sm:flex-row justify-center gap-3 mb-4">
            <NLButton onClick={() => handleJoin("support")} disabled={isClosed}>
              Join Support
            </NLButton>
            <NLButton onClick={() => handleJoin("oppose")} disabled={isClosed}>
              Join Oppose
            </NLButton>
          </div>

          {isClosed && (
            <p className="text-red-500 font-semibold">Debate is closed.</p>
          )}
        </div>

        {/* Arguments */}
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Support Side */}
          <div className="bg-green-50 p-5 rounded">
            <h2 className="text-2xl font-bold mb-4 text-green-700 text-center">
              Support Arguments
            </h2>
            <div className="space-y-4">
              {argumentsList
                .filter((arg) => arg.side === "support")
                .slice(0, showCount)
                .map((arg) => (
                  <div
                    key={arg._id}
                    className="border rounded p-4 shadow-sm bg-white flex flex-col items-center"
                  >
                    <div className="flex justify-between items-center w-full mb-1">
                      <p className="font-semibold text-indigo-600">
                        {arg.userId.username}
                      </p>
                      <p className="text-xs font-medium px-2 py-1 rounded bg-green-100 text-green-700">
                        {arg.side}
                      </p>
                    </div>
                    <p className="text-gray-800 text-center">{arg.content}</p>
                    <div className="flex justify-center mt-3">
                      <NLButton
                        variant="outline"
                        onClick={() => handleVote(arg._id)}
                        disabled={isClosed}
                      >
                        👍 {arg.votes}
                      </NLButton>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Oppose Side */}
          <div className="bg-red-50 p-5 rounded">
            <h2 className="text-2xl font-bold mb-4 text-red-700 text-center">
              Oppose Arguments
            </h2>
            <div className="space-y-4">
              {argumentsList
                .filter((arg) => arg.side === "oppose")
                .slice(0, showCount)
                .map((arg) => (
                  <div
                    key={arg._id}
                    className="border rounded p-4 shadow-sm bg-white flex flex-col items-center"
                  >
                    <div className="flex justify-between items-center w-full mb-1">
                      <p className="font-semibold text-indigo-600">
                        {arg.userId.username}
                      </p>
                      <p className="text-xs font-medium px-2 py-1 rounded bg-red-100 text-red-700">
                        {arg.side}
                      </p>
                    </div>
                    <p className="text-gray-800 text-center">{arg.content}</p>
                    <div className="flex justify-center mt-3">
                      <NLButton
                        variant="outline"
                        onClick={() => handleVote(arg._id)}
                        disabled={isClosed}
                      >
                        👍 {arg.votes}
                      </NLButton>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* See More Button */}
        {showCount < argumentsList.length && (
          <div className="md:col-span-2 flex justify-center">
            <NLButton
              variant="outline"
              onClick={() => setShowCount(showCount + 5)}
            >
              See More
            </NLButton>
          </div>
        )}

        {/* Add Argument Form */}
        {!isClosed && (
          <div className="md:col-span-2 mt-6 bg-gray-100 p-4 rounded shadow w-full">
            <h3 className="font-bold mb-2">Add your argument:</h3>
            <div className="mb-3">
              <label className="font-semibold mr-3">Choose Side:</label>
              <select
                value={argumentSide}
                onChange={(e) =>
                  setArgumentSide(e.target.value as "support" | "oppose")
                }
                className="border rounded px-2 py-1"
              >
                <option value="support">Support</option>
                <option value="oppose">Oppose</option>
              </select>
            </div>
            <textarea
              value={newArgument}
              onChange={(e) => setNewArgument(e.target.value)}
              className="border rounded w-full p-2 mb-4"
              rows={3}
              placeholder="Write your argument here..."
            />
            <div className="flex justify-end">
              <NLButton
                variant="outline"
                className="text-teal-400 hover:text-white hover:bg-teal-500 px-4 py-2 text-sm"
                onClick={handleAddArgument}
              >
                Submit Argument
              </NLButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DebateDetails;
