import React from "react";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { fetchPlaygroupData } from "@/lib/fetchPlaygroupData";
import { fetchGamesForPlaygroup } from "@/lib/fetchGamesForPlaygroup";
import BackButton from "@/app/components/BackBtn";
import Link from "next/link";
import Image from "next/image";

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
          Games Played
        </h1>
      </div>

      <div className="fixed top-14 left-0 right-0 bottom-36 overflow-auto">
        <div className="w-full h-full flex flex-col items-center overflow-auto p-4 space-y-4">
          {games && games.length > 0 ? (
            games.map((game: any) => (
              <div
              key={game._id}
              className="bg-bg2 rounded-lg shadow-md w-96 bg-cover bg-center relative"
              style={{
                backgroundImage: `url(${game.winningDeck.image_uris.art_crop})`,
              }}
              >
                <div className="absolute inset-0 bg-black opacity-50 rounded-lg"></div>
                <div className="relative p-4 z-10">
                  <h2 className="text-xl font-bold text-textcolor [text-shadow:_0_2px_4px_rgba(0_0_0/_0.7)]">
                    {new Date(game.date).toLocaleDateString()}
                  </h2>
                  <p className="text-textcolor font-bold [text-shadow:_0_2px_4px_rgba(0_0_0/_0.7)]">Winner: {game.winningUsername}</p>
                  <p className="text-textcolor [text-shadow:_0_2px_4px_rgba(0_0_0/_0.7)]">
                    Number of players: {game.amountOfPlayers}
                  </p>
                  <p className="text-textcolor [text-shadow:_0_2px_4px_rgba(0_0_0/_0.7)]">
                    Winning Deck: {game.winningDeck.deckName}
                  </p>
                  <p className="text-textcolor [text-shadow:_0_2px_4px_rgba(0_0_0/_0.7)]">
                    Commander: {game.winningDeck.commanderName}
                  </p>
                </div>
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