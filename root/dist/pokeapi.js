export class PokeAPI {
    static baseURL = "https://pokeapi.co/api/v2";
    constructor() { }
    async fetchLocations(pageURL) {
        const url = pageURL || `${PokeAPI.baseURL}/location-area`;
        try {
            const resp = await fetch(url);
            if (!resp.ok) {
                throw new Error(`${resp.status} ${resp.statusText}`);
            }
            const locations = await resp.json();
            return locations;
        }
        catch (e) {
            throw new Error(`Error fetching locations: ${e.message}`);
        }
    }
    async fetchLocation(locationName) {
        const url = `${PokeAPI.baseURL}/location-area/${locationName}`;
        try {
            const resp = await fetch(url);
            if (!resp.ok) {
                throw new Error(`${resp.status} ${resp.statusText}`);
            }
            const location = await resp.json();
            return location;
        }
        catch (e) {
            throw new Error(`Error fetching location '${locationName}': ${e.message}`);
        }
    }
}
