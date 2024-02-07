# Obsidian File Trigger

Just a simple plugin to trigger a specific obsidian command on a specific file changes.
The exemple works along with APIRequest Obsidian plugin but can maybe used somewhere else.

## Why
I wasn't able to fulfill my use case on Commander plugin so here is mine. 

My use case is as follow:
- I want to read my documents every time a specific file change
- I am able to read my documents through Obsidian API plugin or simply by reading it through SMB
- The only problem I had is in terms of optimisation because I needed to check every N times if the file has changed
- This could be optimized by calling a trigger

More specifically, I am using NodeRED which give the ability to provide an API on the fly. But you could also imagine creating a custom API with anything and just catch the event.
For the command, I am using APIRequest Obsidian plugin to have the ability to call the plugin. Normally, this APIRequest plugin is more to "insert" information from the request in a page but I am making him bug on result (with a non-JSON response) so it doesn't write anything but call the API anyway. Which is a little workaround because I don't time yet and felt like calling a command is more flexible.

Probably it would be better to create a 2nd plugin that just add the desired complete simple API call without writing anything.

Other possible use cases.

## How it Works
Realllly simple

1) Register to modification event
```
this.registerEvent(this.app.vault.on('modify', (file) => {
	this.handler.executeCommandOnFileChange(file, this.app.commands);
}));
```
2) Prevent spamming with time
3) Then execute the command on trigger
```
executeCommandOnFileChange(file, commands)
{
	const currentTime = Date.now();
	
	if (currentTime - this.lastUpdateTime > (this.debounce_time * 1000)) 
	{
	console.log(`File content of ${file.path} has changed.`);
	
	// Execute the command
	commands.executeCommandById(this.command);
}
```
over
