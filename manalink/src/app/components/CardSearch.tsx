"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

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

interface CardSearchProps {
  onCardSelect: (card: Card) => void;
}

const CardSearch: React.FC<CardSearchProps> = ({ onCardSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCards = async (query: string) => {
    if (!query) {
      setCards([]);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/cards/search?query=${query}`);
      const data = await res.json();
      setCards(data);
    } catch (error) {
      console.error("Error fetching cards:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardSelect = (card: Card) => {
    onCardSelect(card);
    setSearchTerm("");
    setCards([]);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.length > 2) {
        fetchCards(searchTerm);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <div className="relative flex flex-col justify-center items-center">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search for your Commander..."
        className="w-80 h-10 bg-input bg-opacity-20 rounded-md placeholder:text-textcolor text-textcolor my-1.5 shadow-lg focus:outline-none focus:ring focus:ring-lightaccent p-2 pr-10"
      />

      {cards.length > 0 && (
        <ul className="absolute top-12 z-50 bg-bg2 text-textcolor mt-2 p-4 h-96 overflow-auto rounded-lg shadow-[inset_0_2px_4px_rgba(42,42,42,1),inset_0_-2px_4px_rgba(42,42,42,1)]">
          {cards.map((card) => (
            <li
              key={card.id}
              onClick={() => handleCardSelect(card)}
              className="h-32 rounded-lg flex flex-row justify-center items-center p-2 my-2 shadow-md hover:bg-bg3 cursor-pointer bg-bg3 bg-opacity-45"
            >
              <Image
                src={card.image_uris?.normal || "/assets/profile-pics/mtg.webp"}
                alt={card.name}
                width={80}
                height={112}
                className="rounded-md"
              />
              <div className="w-full h-full flex flex-col justify-start ml-2">
                <p>{card.name}</p>
                <div className="flex flex-row">
                  {card.mana_symbols?.map((symbol, index) =>
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
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CardSearch;