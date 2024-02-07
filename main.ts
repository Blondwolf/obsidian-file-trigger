import { App, Plugin, PluginSettingTab, Setting, TFile, Command, Editor } from 'obsidian';
import FileTrigger from 'controller/FileTrigger';

interface FileTriggerPluginSettings {
	filePath: string;
    debounceTime: number;
    command: string;
}

export const DEFAULT_SETTINGS: FileTriggerPluginSettings = {
	filePath: 'Root/Path/To/File.md',
    debounceTime: 10,
    command: 'app:open-settings'
}

export default class FileTriggerPlugin extends Plugin 
{
	settings: FileTriggerPluginSettings;
	handler: FileTrigger;

	async onload() 
	{
		// Load the settings
		await this.loadSettings();
		
		// Create the controller
		this.handler = new FileTrigger(this.settings.debounceTime, this.settings.command);
		
		// Register for OnLayoutReady call
		this.app.workspace.onLayoutReady(this.onLayoutReady.bind(this));

		// Add settings tab UI
		this.addSettingTab(new FileTriggerSettingTab(this.app, this));
	}

	onLayoutReady()
	{
		console.log("Layout ready");
		let file = this.app.vault.getAbstractFileByPath(this.settings.filePath);
		const fileFound = file instanceof TFile;
		//const fileFound = this.handler.checkFileExistence(this.settings.filePath, this.app.vault);

		if(fileFound){
			console.log("File Found. Registering to event")

			// Register to modification event once layout is loaded
			this.registerEvent(this.app.vault.on('modify', (file) => {
				console.log("file modified");
				
				this.handler.executeCommandOnFileChange(file, this.app.commands);
			}));
		}
	}

	onunload()
	{

	}

	async loadSettings() 
	{
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() 
	{
		await this.saveData(this.settings);
	}
}

class FileTriggerSettingTab extends PluginSettingTab {
	plugin: FileTriggerPlugin;

	constructor(app: App, plugin: FileTriggerPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;
		containerEl.empty();

		new Setting(containerEl)
			.setName('File Path')
			.setDesc('File path relative to the root of vault')
			.addText(text => text
				.setPlaceholder('Root/Path/To/File.md')
				.setValue(this.plugin.settings.filePath)
				.onChange(async (value) => {
					this.plugin.settings.filePath = value;
					await this.plugin.saveSettings();
				}));

        new Setting(containerEl)
			.setName('Debounce Time')
			.setDesc('Minimum time between each calls (in seconds). To avoid flood on editing, do not put 0.')
			.addText(text => text
				.setPlaceholder("10")
				.setValue(this.plugin.settings.debounceTime.toString())
				.onChange(async (value) => {
					this.plugin.settings.debounceTime = +value; // = +value is unary that convert from string to number
					await this.plugin.saveSettings();
				}));

        new Setting(containerEl)
			.setName('Command')
			.setDesc('The command to execute on file change')
			.addText(text => text
				.setPlaceholder('app:open-settings')
				.setValue(this.plugin.settings.command)
				.onChange(async (value) => {
					this.plugin.settings.command = value;
					await this.plugin.saveSettings();
				}));
	}
}
