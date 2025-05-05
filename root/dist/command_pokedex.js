export async function commandPokedex(state) {
    console.log("Your Pokedex:");
    for (const pokemon of Object.values(state.caughtPokemon)) {
        console.log(` - ${pokemon.name}`);
    }
}
