import { createInterface, type Interface } from "readline";
import { getCommands } from "./commands.js";
import { PokeAPI } from "./pokeapi.js";
import type { Pokemon } from "./pokeapi.js";

export type CLICommand = {
  name: string;
  description: string;
  callback: (state: State, ...args: string[]) => Promise<void>;
};

export type State = {
  activePokemon: string;
  readline: Interface;
  commands: Record<string, CLICommand>;
  pokeAPI: PokeAPI;
  nextLocationsURL: string;
  prevLocationsURL: string;
  caughtPokemon: Record<string, Pokemon>;
};

export function initState(cacheInterval: number) {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "pokedex > ",
  });

  return {
    activePokemon: "", // The name of the currently active Pokemon fixed
    readline: rl,
    commands: getCommands(),
    pokeAPI: new PokeAPI(cacheInterval),
    nextLocationsURL: "",
    prevLocationsURL: "",
    caughtPokemon: {},
  };
}
