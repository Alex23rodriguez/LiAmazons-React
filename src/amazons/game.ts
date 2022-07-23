import { Amazons } from "amazons-game-engine";
import type { Move } from "amazons-game-engine/dist/types";
import type { Game } from "boardgame.io";

let amazons = Amazons(8);
console.log(amazons.fen());

// FOR DEBUGGING ONLY
(window as any).amazons = amazons;

export const AmazonsGame: Game = {
  name: "amazons",

  setup: () => ({ fen: amazons.fen() }),

  moves: {
    move: (G: any, ctx: any, m: Move) => {
      // const amazons = Load(G.fen);
      if (
        (amazons.turn() == "w" && ctx.currentPlayer == "1") ||
        (amazons.turn() == "b" && ctx.currentPlayer == "0")
      ) {
        console.log("wrong player");
        return { ...G };
      }
      amazons.move(m);
      return { fen: amazons.fen() };
    },
    random_move: (G: any, ctx: any) => {
      amazons.random_move();
      return { fen: amazons.fen() };
    },
  },

  turn: {
    minMoves: 2,
    maxMoves: 2,
  },
};
