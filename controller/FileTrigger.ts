import { TAbstractFile } from "obsidian";

// More logic could belong here
export default class FileTrigger
{
    // Inputs
    debounce_time;
    command;

    // Tools
    lastUpdateTime;

    constructor(debounce_time: number, command: string){
        this.debounce_time = debounce_time;
        this.command = command;

        this.lastUpdateTime = 0;
    }

    executeCommandOnFileChange(file: TAbstractFile, commands: { executeCommandById: (arg0: string) => void; }) {
        const currentTime = Date.now();

        if (currentTime - this.lastUpdateTime > (this.debounce_time * 1000)) 
        {
            console.log(`File content of ${file.path} has changed.`);

            // Execute the command
            commands.executeCommandById(this.command);

            // Update time
            this.lastUpdateTime = currentTime;
        }
    }
}