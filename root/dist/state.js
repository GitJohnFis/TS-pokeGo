import { createInterface } from "readline";
import { getCommands } from "./commands.js";
import { PokeAPI } from "./pokeapi.js";
export function initState(cacheInterval) {
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
