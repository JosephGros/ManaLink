import React from "react";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { fetchPlaygroupData } from "@/lib/fetchPlaygroupData";
import { fetchGamesForPlaygroup } from "@/lib/fetchGamesForPlaygroup";
import BackButton from "@/app/components/BackBtn";
import Link from "next/link";

const JWT_SECRET: any = process.env.JWT_SECRET;

const PlaygroupGamesPage = async ({
  params,
  searchParams,
}: {
  params: { playgroupId: string };
  searchParams: { playgroup: string };
}) => {
  const { playgroupId } = params;

  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return <div>No token found, please log in.</div>;
  }

  let currentUserId;
  let playgroupName;
  playgroupName = await fetchPlaygroupData(token, playgroupId);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    currentUserId = (decoded as any).id;
  } catch (error) {
    return <div>Invalid token, please log in again.</div>;
  }

  const games = await fetchGamesForPlaygroup(token, playgroupId);

  return (
    <div className="">
      <div className="fixed top-0 left-0 right-0 h-14 w-full bg-background flex justify-center items-center z-10 border-b-2 border-bg3">
        <BackButton
          label="Back"
          className="fixed left-4 text-textcolor rounded-md w-12 flex items-center"
        />
        <h1 className="text-3xl font-bold text-center text-textcolor">
          {playgroupName.playgroup.playgroupname}
        </h1>
      </div>

      <div className="fixed top-14 left-0 right-0 bottom-36 overflow-auto">
        <div className="w-full h-full flex flex-col overflow-auto p-4 space-y-4">
          {games && games.length > 0 ? (
            games.map((game: any) => (
              <div
                key={game._id}
                className="bg-bg2 p-4 rounded-lg shadow-md w-full"
              >
                <h2 className="text-xl font-bold text-textcolor">
                  {new Date(game.date).toLocaleDateString()}
                </h2>
                <p className="text-textcolor">Winner: {game.winningUsername}</p>
                <p className="text-textcolor">
                  Number of players: {game.amountOfPlayers}
                </p>
                <p className="text-textcolor">
                  Winning Deck: {game.winningDeck.deckName}
                </p>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-textcolor">No games recorded yet.</p>
            </div>
          )}
              <Link href={`/playgroups/${playgroupId}/games/register`}>
                <button className="bg-btn text-nav p-3 rounded-lg shadow-lg h-10 font-bold flex justify-center items-center">
                  Register a Game
                </button>
              </Link>
        </div>
      </div>
    </div>
  );
};

export default PlaygroupGamesPage;