export async function commandMapForward(state) {
    const locations = await state.pokeAPI.fetchLocations(state.nextLocationsURL);
    state.nextLocationsURL = locations.next;
    state.prevLocationsURL = locations.previous;
    for (const loc of locations.results) {
        console.log(loc.name);
    }
}
export async function commandMapBack(state) {
    if (!state.prevLocationsURL) {
        throw new Error("you're on the first page");
    }
    const locations = await state.pokeAPI.fetchLocations(state.prevLocationsURL);
    state.nextLocationsURL = locations.next;
    state.prevLocationsURL = locations.previous;
    for (const loc of locations.results) {
        console.log(loc.name);
    }
}
