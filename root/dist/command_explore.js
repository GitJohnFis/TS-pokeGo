import { checkForRandomEncounter } from "./random_encounter.js";
export async function commandExplore(state, ...args) {
    if (args.length !== 1) {
        throw new Error("you must provide a location name");
    }
    const name = args[0];
    const location = await state.pokeAPI.fetchLocation(name);
    console.log(`Exploring ${name}...`);
    console.log("Found Pokemon:");
    for (const enc of location.pokemon_encounters) {
        console.log(` - ${enc.pokemon.name}`);
    }
    // Check for random encounters after exploring
    const encounterOccurred = await checkForRandomEncounter(state, name);
    // If no encounter occurred, display a message
    if (!encounterOccurred) {
        console.log("\nYou explored the area safely without any wild Pokémon encounters.");
    }
    // If an encounter did occur, the encounter logic in random_encounters.ts
    // has already handled displaying the appropriate messages
}
