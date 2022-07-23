import { Client } from "boardgame.io/react";
import { AmazonsGame } from "./game";
import { AmazonsBoard } from "./board";

const App = Client({
  game: AmazonsGame,
  board: AmazonsBoard as any,
  debug: true,
});

export const Singleplayer = () => {
  return (
    <div style={{ padding: 50 }}>
      <App matchID="single" />
    </div>
  );
};
