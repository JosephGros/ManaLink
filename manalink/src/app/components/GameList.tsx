import { useEffect, useState } from 'react';

interface Game {
    _id: string;
    date: string;
    playgroupName: string;
    winningUsername: string;
    amountOfPlayers: number;
    winningDeck: {
        deckName: string;
        commanderName: string;
    };
}

const GameList = () => {
    const [games, setGames] = useState<Game[]>([]);

    useEffect(() => {
        const fetchGames = async () => {
            const response = await fetch('/api/games');
            const data = await response.json();
            setGames(data.games);
        };

        fetchGames();
    }, []);

    return (
        <div className="game-list">
            {games.map((game) => (
                <div key={game._id} className="game-item">
                    <p>Date: {new Date(game.date).toLocaleDateString()}</p>
                    <p>Playgroup: {game.playgroupName}</p>
                    <p>Winner: {game.winningUsername}</p>
                    <p>Players: {game.amountOfPlayers}</p>
                    <p>Winning Deck: {game.winningDeck.deckName} ({game.winningDeck.commanderName})</p>
                </div>
            ))}
        </div>
    );
};

export default GameList;