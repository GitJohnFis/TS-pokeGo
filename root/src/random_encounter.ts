import type { State } from "./state.js";
import * as readline from "readline";
import { PokeAPI } from "./pokeapi.js";


function getPlayerInput(): Promise<string> {
    return new Promise((resolve) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        rl.question("\nEnter your choice: ", (answer) => {
            rl.close();
            resolve(answer.trim());
        });
    });
}


// Track whether a Pokémon recently escaped
let recentlyEscaped = false;

export function setRecentlyEscaped(escaped: boolean): void {
  recentlyEscaped = escaped;
}

export async function checkForRandomEncounter(state: State, locationName: string): Promise<boolean> {
  // Base encounter chance
  let encounterChance = 0.1;
  
  // Increase chance if a Pokémon recently escaped
  if (recentlyEscaped) {
    encounterChance = 0.3; // 30% chance instead of 10%
    recentlyEscaped = false; // Reset the flag
  }
  
  // Determine if an encounter happens
  if (Math.random() < encounterChance) {
    await triggerLocationSpecificEncounter(state, locationName);
    return true;
  }
  return false;
}

async function triggerLocationSpecificEncounter(state: State, locationName: string): Promise<void> {
  try {
    // Fetch the location data using your existing method
    const location = await state.pokeAPI.fetchLocation(locationName);
    
    // If there are no encounters, exit
    if (!location.pokemon_encounters || location.pokemon_encounters.length === 0) {
      console.log("No wild Pokémon in this area!");
      return;
    }
    
    // Select a random Pokémon from the possible encounters
    const randomIdx = Math.floor(Math.random() * location.pokemon_encounters.length);
    const encounter = location.pokemon_encounters[randomIdx];
    
    // Get the Pokémon's name and format it
    const pokemonName = encounter.pokemon.name;
    const formattedName = pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1);
    // Display the encounter message
    console.log(`\nA wild ${formattedName} appeared!`);
    console.log("\nWhat will you do?");
    console.log("- Catch");
    console.log("- Battle");
    console.log("- Run");

    const playerChoice = await getPlayerInput(); //// 👈 Function to capture user input

    switch (playerChoice.toLowerCase()) {
        case "catch":
            console.log(`You attempt to catch ${pokemonName}...`);
            await attemptCatchPokemon(state, pokemonName);
            break;
        case "battle":
            console.log(`You engage in battle with ${pokemonName}!`);
            await startBattle(state, pokemonName);
            break;
        case "run":
            console.log(`You ran away safely!`);
            break;
        default:
            console.log("Invalid choice. The Pokémon fled.");
    }

    } catch(error) {
        console.error("Error during Pokémon encounter:", error);
  }
}

async function attemptCatchPokemon(state: State, pokemonName: string): Promise<void> {
    try {
      // Fetch more details about the Pokemon if needed
      const normalizedName = pokemonName.toLowerCase();
      const pokemon = await state.pokeAPI.fetchPokemon(normalizedName);
      
      // Calculate catch chance (based on Pokemon's base experience)
      // Lower experience = easier to catch
      const baseExp = pokemon.base_experience || 100;
      const catchDifficulty = Math.min(baseExp / 200, 0.9); // Convert to a value between 0-0.9
      const catchChance = 1 - catchDifficulty; // Higher chance for easier Pokemon
      
      console.log(`\nYou throw a Pokéball at ${pokemonName}...`);
      
      // Dramatic pause with dots appearing
      await new Promise(resolve => setTimeout(resolve, 1000));
      process.stdout.write(".");
      await new Promise(resolve => setTimeout(resolve, 1000));
      process.stdout.write(".");
      await new Promise(resolve => setTimeout(resolve, 1000));
      process.stdout.write(".\n");
      if (Math.random() < catchChance) {
        console.log(`\nGotcha! ${pokemonName} was caught!`);
        
        // Add to player's collection if you're tracking that
        if (!state.caughtPokemon) {
          state.caughtPokemon = {};
        }
        
        // Check if already caught
        if (!state.caughtPokemon[normalizedName]) {
          state.caughtPokemon[normalizedName] = pokemon;
          console.log(`${pokemonName} has been added to your Pokédex!`);
                } else {
                  console.log(`You already had ${pokemonName} in your Pokédex.`);
                }
              }
            } catch (error) {
              console.error("Error while attempting to catch Pokémon:", error);
            }
        }
        
        async function startBattle(state: State, pokemonName: string): Promise<void> {
            try {
              console.log(`\nYou are battling ${pokemonName}...`);
              
              // Get wild Pokemon's details
              const wildPokemon = await state.pokeAPI.fetchPokemon(pokemonName.toLowerCase());
              
              // Get player's active Pokemon (if implemented)
              // For now we'll simulate having a starter
              const playerPokemonName = state.activePokemon || "Pikachu";
              console.log(`You sent out ${playerPokemonName}!`);
              
              // Display HP and stats
              const wildPokemonHP = Math.floor(wildPokemon.stats[0].base_stat * 1.5);
              let playerPokemonHP = 100; // Simplified for this example
              
              console.log(`\n${pokemonName} HP: ${wildPokemonHP}`);
              console.log(`${playerPokemonName} HP: ${playerPokemonHP}\n`);
              
              // Battle loop
              let currentWildPokemonHP = wildPokemonHP;
              let currentPlayerPokemonHP = playerPokemonHP;
              let turnCount = 0;
              
              while (currentWildPokemonHP > 0 && currentPlayerPokemonHP > 0 && turnCount < 5) {
                turnCount++;
                
                // Player's turn
                console.log(`\nTurn ${turnCount}:`);
                console.log("What move will you use?");
                console.log("1. Quick Attack");
                console.log("2. Thunderbolt");
                console.log("3. Tackle");
                
                const moveChoice = await getPlayerInput();
                
                // Calculate damage based on move
                let playerDamage = 10; // Default damage
                
                switch (moveChoice) {
                    case "1":
                    case "quick attack":
                      playerDamage = 15;
                      console.log(`${playerPokemonName} used Quick Attack!`);
                      break;
                    case "2":
                    case "thunderbolt":
                      playerDamage = 25;
                      console.log(`${playerPokemonName} used Thunderbolt!`);
                      break;
                    case "3":
                    case "tackle":
                      playerDamage = 10;
                      console.log(`${playerPokemonName} used Tackle!`);
                      break;
                    default:
                      console.log(`${playerPokemonName} hesitated and missed the turn!`);
                      playerDamage = 0;
                  } 
                  
                  // Apply damage to wild Pokémon
                  currentWildPokemonHP -= playerDamage;
                  console.log(`${pokemonName} took ${playerDamage} damage!`);
                  
                  if (currentWildPokemonHP <= 0) {
                    console.log(`\n${pokemonName} fainted! You won the battle!`);
                    console.log("You gained experience points!");
                    
                    // Option to catch the defeated Pokemon
                    console.log(`\nWould you like to try catching ${pokemonName}? (yes/no)`);
                    const catchChoice = await getPlayerInput();
                    
                    if (catchChoice.toLowerCase() === "yes") {
                      await attemptCatchPokemon(state, pokemonName);
                    }
                    
                    return;
                  }
                  // Wild Pokémon's turn
const wildDamage = Math.floor(Math.random() * 15) + 5; // Random damage between 5 and 20
currentPlayerPokemonHP -= wildDamage;
console.log(`${pokemonName} attacked and dealt ${wildDamage} damage!`);

if (currentPlayerPokemonHP <= 0) {
  console.log(`\n${playerPokemonName} fainted! You lost the battle!`);
  console.log("You blacked out and returned to the nearest Pokémon Center.");
  return;
}

// Display updated HP
console.log(`\n${pokemonName} HP: ${currentWildPokemonHP}`);
console.log(`${playerPokemonName} HP: ${currentPlayerPokemonHP}`);
}

// If the battle exceeds the turn limit
if (currentWildPokemonHP > 0 && currentPlayerPokemonHP > 0) {
  console.log("\nThe battle ended in a draw!");
  console.log(`${pokemonName} ran away!`);
}
} catch (error) {
  console.error("Error during battle:", error);
}
}

export { startBattle };