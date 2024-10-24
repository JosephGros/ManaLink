"use client";

import { useState } from "react";
import CardSearch from "./CardSearch";
import Image from "next/image";
import BackButton from "./BackBtn";

interface Card {
  id: string;
  name: string;
  mana_cost?: string;
  image_uris?: {
    normal?: string;
  };
  mana_symbols?: {
    symbol: string;
    svg_uri: string;
  }[];
}

const DeckForm = ({ onDeckCreated }: { onDeckCreated: () => void }) => {
  const [deckName, setDeckName] = useState("");
  const [commander, setCommander] = useState<any | null>(null);

  const handleCardSelect = (card: any) => {
    setCommander(card);
  };

  const handleCreateDeck = async () => {
    try {
      const response = await fetch("/api/decks/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          deckName,
          commanderId: commander._id,
          commanderName: commander.name,
          image_uris: commander.image_uris,
          manaCost: commander.mana_cost,
          manaSymbols: commander.mana_symbols,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create deck");
      }

      const data = await response.json();
      onDeckCreated();
    } catch (error) {
      console.error("Error creating deck:", error);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center bg-bg2 rounded-lg w-11/12 sm:w-2/4 text-textcolor p-4 mt-8">
      <h1 className="font-bold text-3xl mb-4">Create a Deck</h1>
      <input
        type="text"
        value={deckName}
        onChange={(e) => setDeckName(e.target.value)}
        placeholder="Deck Name"
        className="w-80 h-10 bg-input bg-opacity-20 rounded-md placeholder:text-textcolor text-textcolor my-1.5 shadow-lg focus:outline-none focus:ring focus:ring-lightaccent p-2 pr-10"
      />
      <CardSearch onCardSelect={handleCardSelect} />
      {commander && (
        <div>
          <div className="h-38 rounded-lg flex flex-col items-center p-2 my-4 shadow-md bg-bg3 bg-opacity-45">
          <h2 className="font-bold text-xl w-full mb-2">{deckName}</h2>
          <div className="flex flex-row justify-center p-2 rounded-md shadow-[inset_0_2px_4px_rgba(42,42,42,1),inset_0_-2px_4px_rgba(42,42,42,1)]">
            <Image
              src={
                commander.image_uris?.normal || "/assets/profile-pics/mtg.webp"
              }
              alt={commander.name}
              width={80}
              height={112}
              className="rounded-md"
            />
            <div className="w-full h-full flex flex-col justify-start ml-2">
              <p>{commander.name}</p>
              <div className="flex flex-row">
                {commander.mana_symbols?.map((symbol: any, index: any) =>
                  symbol.svg_uri ? (
                    <Image
                      key={index}
                      src={symbol.svg_uri}
                      alt={symbol.symbol}
                      width={16}
                      height={16}
                      className="mr-1"
                    />
                  ) : (
                    <span key={index}>{symbol.symbol}</span>
                  )
                )}
              </div>
            </div>
          </div>
          </div>
        </div>
      )}
      <button 
      onClick={handleCreateDeck} 
      className="w-32 h-9 mt-2 bg-btn rounded-md text-nav font-bold shadow-lg">
        Create Deck
      </button>
    </div>
  );
};

export default DeckForm;