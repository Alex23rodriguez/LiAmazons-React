import { Amazons, coords_to_square, RANKS } from "amazons-game-engine";
import { Coords, Piece, Square } from "amazons-game-engine/dist/types";
import React from "react";
import Chat from "./chat";
import { Checkerboard } from "./checkerboard";
import { Arrow } from "./pieces/arrow";
import { Queen } from "./pieces/queen";
import { Token } from "./token";

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
          size={this.amazons.size()}
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
    // TODO not shooting
  }

  _getPieces() {
    let dragged = [];
    // TODO add dragged
    let result: any = [];

    let pieces = this.amazons.pieces();
    for (const [type, squares] of Object.entries(pieces))
      for (const square of squares) {
        const token = (
          <Token
            // draggable={true}
            // shouldDrag={this._shouldDrag}
            // onDrag={this._onDrag}
            // onDrop={this._onDrop}
            square={square}
            animate={true}
            // key={this._getInitialCell(square)}
          >
            {this._getPieceByTypeAndColor(type)}
          </Token>
        );
        result.push(token);
      }
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
  _getPieceByTypeAndColor(type: string) {
    switch (type) {
      case "b":
        return <Queen color="b" />;
      case "w":
        return <Queen color="w" />;
      case "a":
        return <Arrow color="b" />;
    }
    console.log("invalid type!!");
  }
  _isSelectable(sq: Square) {
    let moves = this.amazons.moves_dict()[sq];
    return (
      moves &&
      // piece.color === this._getCurrentPlayer() &&
      moves.length > 0
    );
  }
  _shouldDrag = (coords: Coords) => {
    const square = coords_to_square(coords, this.amazons.size());
    const result = this.props.isActive && this._isSelectable(square);
    if (result) {
      this.setState({
        ...this.state,
        dragged: this._getInitialCell(square),
      });
      return true;
    }
  };
}
