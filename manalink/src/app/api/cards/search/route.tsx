import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import CardSymbol from "@/models/CardSymbol";
import { MongoClient } from "mongodb";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const searchTerm = searchParams.get("query");

  if (!searchTerm) {
    return NextResponse.json(
      { success: false, error: "No search term provided" },
      { status: 400 }
    );
  }

  try {
    await dbConnect();

    const client = new MongoClient(process.env.MONGODB_URI!);

    const db = client.db();

    const cardsCollection = db.collection("MTGCard");

    const cards = await cardsCollection
      .find({ name: { $regex: searchTerm, $options: "i" } })
      .limit(30)
      .toArray();

    if (cards.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    const allSymbols = new Set<string>();
    cards.forEach((card: any) => {
      const matches = card.mana_cost?.match(/{(.*?)}/g);
      if (matches) {
        matches.forEach((symbol: string) => allSymbols.add(symbol));
      }
    });

    const symbolsArray = Array.from(allSymbols);
    const symbolData = await CardSymbol.find({ symbol: { $in: symbolsArray } });

    const symbolMap: { [key: string]: string } = symbolData.reduce(
      (acc: any, symbol: any) => {
        acc[symbol.symbol] = symbol.svg_uri;
        return acc;
      },
      {}
    );

    const cardsWithSymbols = cards.map((card: any) => {
      if (card.mana_cost) {
        const manaSymbols = card.mana_cost.match(/{(.*?)}/g);
        if (manaSymbols) {
          card.mana_symbols = manaSymbols.map((symbol: string) => ({
            symbol: symbol,
            svg_uri: symbolMap[symbol] || null,
          }));
        }
      }
      return card;
    });

    return NextResponse.json(cardsWithSymbols, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching cards:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
