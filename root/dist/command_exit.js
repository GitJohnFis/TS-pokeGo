export async function commandExit(state) {
    console.log("Closing the Pokedex... Goodbye!");
    state.readline.close();
    state.pokeAPI.closeCache();
    process.exit(0);
}
