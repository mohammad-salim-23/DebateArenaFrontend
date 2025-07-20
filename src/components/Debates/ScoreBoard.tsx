"use client";

import { useEffect, useState } from "react";

import { useSession } from "next-auth/react";
import { getScoreboard } from "@/services/ScoreService/scoreService";

type ScoreData = {
  userId: string;
  username: string;
  totalVotes: number;
  totalDebates: number;
};

const Leaderboard = () => {
  const [filter, setFilter] = useState<"weekly" | "monthly" | "all">("all");
  const [scoreboard, setScoreboard] = useState<ScoreData[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchScoreboard = async () => {
      if (!session?.user?.token) return;
      const res = await getScoreboard(filter, session.user?.token);
      setScoreboard(res.data);
    };
    fetchScoreboard();
  }, [filter, session]);

  return (
    <div className="p-4">
      <div className="mb-4">
        <button onClick={() => setFilter("weekly")} className="mr-2 px-3 py-1 bg-blue-500 text-white rounded">Weekly</button>
        <button onClick={() => setFilter("monthly")} className="mr-2 px-3 py-1 bg-green-500 text-white rounded">Monthly</button>
        <button onClick={() => setFilter("all")} className="px-3 py-1 bg-purple-500 text-white rounded">All Time</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {scoreboard.map((user, index) => (
          <div key={user.userId} className="bg-gray-100 p-4 rounded shadow">
            <p className="text-xl font-bold">#{index + 1}</p>
            <p className="text-lg">{user.username}</p>
            <p>Total Votes: {user.totalVotes}</p>
            <p>Debates Participated: {user.totalDebates}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
