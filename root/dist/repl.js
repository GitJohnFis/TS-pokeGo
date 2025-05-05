export function startREPL(state) {
    state.readline.prompt();
    state.readline.on("line", async (input) => {
        const words = cleanInput(input);
        if (words.length === 0) {
            state.readline.prompt();
            return;
        }
        const commandName = words[0];
        const args = words.slice(1);
        const cmd = state.commands[commandName];
        if (!cmd) {
            console.log(`Unknown command: "${commandName}". Type "help" for a list of commands.`);
            state.readline.prompt();
            return;
        }
        try {
            await cmd.callback(state, ...args);
        }
        catch (e) {
            console.log(e.message);
        }
        state.readline.prompt();
    });
}
// REPL (Read-Eval-Print Loop) for the CLI
export function cleanInput(input) {
    return input
        .toLowerCase()
        .trim()
        .split(" ")
        .filter((word) => word !== "");
}
