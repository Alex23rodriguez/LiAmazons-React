/*
 * Copyright 2018 The boardgame.io Authors.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */

import React from "react";
import PropTypes from "prop-types";
import { Grid } from "./grid";
import { coords_to_square, square_to_coords } from "amazons-game-engine";
import { Square } from "amazons-game-engine/dist/types";

/**
 * Checkerboard
 *
 * Component that will show a configurable checker board for games like
 * chess, checkers and others. The vertical columns of squares are labeled
 * with letters from a to z, while the rows are labeled with numbers, starting
 * with 1.
 *
 * Props:
 *   rows    - How many rows to show up, 8 by default.
 *   cols    - How many columns to show up, 8 by default. Maximum is 26.
 *   onClick - On Click Callback, (row, col) of the square passed as argument.
 *   primaryColor - Primary color, #d18b47 by default.
 *   secondaryColor - Secondary color, #ffce9e by default.
 *   colorMap - Object of object having cell names as key and colors as values.
 *   Ex: { 'c5': 'red' } colors cells c5 with red.
 *
 * Usage:
 *
 * <Checkerboard>
 *   <Token square={'c5'}>
 *     <Knight color='dark' />
 *   </Token>
 * </Checkerboard>
 */

type myProps = {
  rows: number;
  cols: number;
  onClick: ({ square }: { square: Square }) => void;
  primaryColor: string;
  secondaryColor: string;
  highlightedSquares: { [square: string]: string };
  style: object;
  children: Element | Element[];
};

export class Checkerboard extends React.Component<myProps, any> {
  static defaultProps = {
    rows: 10,
    cols: 10,
    onClick: () => {},
    primaryColor: "#d18b47",
    secondaryColor: "#ffce9e",
    highlightedSquares: {},
    style: {},
  };

  onClick = ({ x, y }: any) => {
    this.props.onClick({
      square: coords_to_square(x, y, this.props.rows, this.props.cols),
    });
  };

  render() {
    // Convert the square="" prop to row and col.
    const tokens = React.Children.map(this.props.children, (child: any) => {
      const square = child.props.square;
      const { row, col } = square_to_coords(
        square,
        this.props.rows,
        this.props.cols
      );
      return React.cloneElement(child, { row, col });
    });

    // Build colorMap with checkerboard pattern.
    let colorMap: { [key: string]: string } = {};
    for (let x = 0; x < this.props.cols; x++) {
      for (let y = 0; y < this.props.rows; y++) {
        const key = `${x},${y}`;
        let color = this.props.secondaryColor;
        if ((x + y) % 2 == 0) {
          color = this.props.primaryColor;
        }
        colorMap[key] = color;
      }
    }

    // Add highlighted squares.
    for (const square in this.props.highlightedSquares) {
      const { row, col } = square_to_coords(
        square as Square,
        this.props.rows,
        this.props.cols
      );
      const key = `${row},${col}`;
      colorMap[key] = this.props.highlightedSquares[square];
    }

    return (
      <Grid
        rows={this.props.rows}
        cols={this.props.cols}
        style={this.props.style}
        onClick={this.onClick}
        colorMap={colorMap}
      >
        {tokens}
      </Grid>
    );
  }
}
