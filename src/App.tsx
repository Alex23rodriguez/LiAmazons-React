import { Client } from "boardgame.io/react";
import { AmazonsGame } from "./amazons/game";
import "./App.css";

const App = Client({ game: AmazonsGame });

export default App;
