import { Amazons, RANKS } from "amazons-game-engine";
import { Square } from "amazons-game-engine/dist/types";
import React from "react";
import Chat from "./chat";
import { Checkerboard } from "./checkerboard";

type myProps = {
  G: any;
  ctx: any;
  moves: any;
  playerID?: string;
  isActive?: boolean;
  isMultiplayer: boolean;
  isConnected?: boolean;
  sendChatMessage?: (msg: string) => void;
  chatMessages?: string[];
};

type myState = {
  selected: Square | null;
  highlighted: Square | null;
  dragged: Square | null;
};

const HIGHLIGHTED_COLOR = "green";
const MOVABLE_COLOR = "palegreen";

export class AmazonsBoard extends React.Component<myProps, myState> {
  private amazons;
  constructor(props: any) {
    super(props);
    this.amazons = Amazons();
  }

  state = {
    selected: null,
    highlighted: null,
    dragged: null,
  };

  render() {
    if (this.props.G.fen !== undefined) {
      this.amazons.load(this.props.G.fen);
    }

    let disconnected: JSX.Element | null = null;
    if (this.props.isMultiplayer && !this.props.isConnected) {
      disconnected = <p>Disconnected!</p>;
    }

    return (
      <div>
        <Checkerboard
          highlightedSquares={this._getHighlightedSquares()}
          style={{ width: "400px" }}
          onClick={this.click}
        >
          {this._getPieces()}
        </Checkerboard>

        {this._getStatus()}
        {disconnected}
        {this.props.isMultiplayer && this.props.playerID !== null && (
          <Chat
            onSend={this.props.sendChatMessage}
            messages={this.props.chatMessages}
          />
        )}
      </div>
    );
  }

  click = () => {};

  _getHighlightedSquares() {
    let result: { [square: string]: string } = {};
    if (this.amazons.shooting()) {
      result[this.amazons.shooting_sq()] = HIGHLIGHTED_COLOR;
      for (let m of this.amazons.moves()) result[m[0]] = MOVABLE_COLOR;
      return result;
    }
  }

  _getPieces() {
    let dragged = [];
    let result: any = [];
    return result;
  }

  _getStatus() {
    let message = null;
    if (this.amazons.game_over()) message = "Game Over!";

    if (message) {
      return (
        <p>
          <strong>{message}</strong>
        </p>
      );
    }
  }
}
