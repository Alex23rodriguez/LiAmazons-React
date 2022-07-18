/*
 * Copyright 2018 The boardgame.io Authors.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */

import { Singleplayer } from "./singleplayer";
import { Multiplayer } from "./multiplayer";

export const amazonsRoutes = [
  {
    path: "/amazons/singleplayer",
    text: "Singleplayer",
    component: Singleplayer,
  },
  {
    path: "/amazons/multiplayer0",
    text: "Multiplayer (Player 0)",
    component: Multiplayer("0"),
  },
  {
    path: "/amazons/multiplayer1",
    text: "Multiplayer (Player 1)",
    component: Multiplayer("1"),
  },
  {
    path: "/amazons/multiplayer",
    text: "Multiplayer (Spectator)",
    component: Multiplayer(),
  },
];
