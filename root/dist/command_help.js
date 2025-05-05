export async function commandHelp(state) {
    console.log();
    console.log("Welcome to the Pokedex!");
    console.log("Usage:");
    console.log();
    for (const cmd of Object.values(state.commands)) {
        console.log(`${cmd.name}: ${cmd.description}`);
    }
    console.log();
}
