import { Amazons, coords_to_square } from "amazons-game-engine";
import { FEN, Square } from "amazons-game-engine/dist/types";
import React from "react";
import Chat from "./chat";
import { Checkerboard } from "./checkerboard";
import { Arrow } from "./pieces/arrow";
import { Queen } from "./pieces/queen";
import { Token } from "./token";

type myProps = {
  G: { fen: string };
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
    this.amazons = Amazons(this.props.G.fen as FEN);
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

  click = ({ square }: { square: Square }) => {
    if (!this.props.isActive) {
      console.log("board: props not isActive");
      return;
    }

    if (!this.state.selected && this._isSelectable(square)) {
      this.setState({ ...this.state, selected: square, highlighted: square });
    } else if (this.state.selected) {
      this._tryMove(this.state.selected, square);
    }
  };

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
            draggable={true}
            shouldDrag={this._shouldDrag}
            onDrag={this._onDrag}
            onDrop={this._onDrop}
            square={square}
            animate={true}
            key={square}
          >
            {
              this._getPieceByTypeAndColor(
                type
              ) as any /*TODO difference between ReactElement and JSX.Element*/
            }
          </Token>
        );
        if (square === this.state.dragged) {
          result.push(token);
        } else {
          dragged.push(token);
        }
      }
    return dragged.concat(result);
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
      case "x":
        return <Arrow color="b" />;
    }
    console.log("invalid type!!", type);
    return <></>;
  }
  _isSelectable(sq: Square) {
    let moves = this.amazons.moves_dict()[sq];
    return (
      moves &&
      // piece.color === this._getCurrentPlayer() &&
      moves.length > 0
    );
  }
  _shouldDrag = ({ x, y }: { x: number; y: number }) => {
    const square = coords_to_square({ row: y, col: x }, this.amazons.size());
    const result = this.props.isActive && this._isSelectable(square);
    if (result) {
      this.setState({
        ...this.state,
        // dragged: this._getInitialCell(square), // TODO check out _getInitialCell
        dragged: square,
      });
      return true;
    }
    return false;
  };

  _getSquare(x: number, y: number) {
    return coords_to_square(
      { row: this._getInRange(y), col: this._getInRange(x) },
      this.amazons.size()
    );
  }

  _getInRange(x: number) {
    return Math.max(Math.min(Math.round(x), 7), 0);
  }

  _onDrag = ({ x, y, originalX, originalY }: any) => {
    if (Math.sqrt((x - originalX) ** 2 + (y - originalY) ** 2) > 0.2) {
      this.setState({
        ...this.state,
        selected: this._getSquare(originalX, originalY),
        highlighted: this._getSquare(x, y),
      });
    } else {
      this.setState({
        ...this.state,
        selected: null,
        highlighted: null,
      });
    }
  };
  _onDrop = ({ x, y }: any) => {
    if (this.state.selected) {
      this.setState({ ...this.state, dragged: null });
      this._tryMove(this.state.selected, this._getSquare(x, y));
    }
  };
  _getMoves() {
    if (!this.state.selected) {
      return [];
    }
    return this.amazons.moves_dict()[this.state.selected];
  }
  _tryMove(from: Square, to: Square) {
    console.log("before");
    console.log("board", this.amazons.fen());
    console.log("game", this.props.G.fen);

    if (this.amazons.move([from, to])) this.props.moves.move([from, to]);
    console.log("after");
    console.log("board", this.amazons.fen());
    console.log("game", this.props.G.fen);

    this.setState({ ...this.state, selected: null, highlighted: null });
  }
}
