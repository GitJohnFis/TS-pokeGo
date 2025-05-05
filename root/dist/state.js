import { createInterface } from "readline";
import { getCommands } from "./commands.js";
import { PokeAPI } from "./pokeapi.js";
export function initState() {
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: "pokedex > ",
    });
    return {
        readline: rl,
        commands: getCommands(),
        pokeAPI: new PokeAPI(),
        nextLocationsURL: "",
        prevLocationsURL: "",
    };
}
