/**
 * @file Vault 文件管理器
 * @author Emac
 * @date 2025-01-05
 */
import { Vault, MetadataCache, TFile, TFolder, Notice, TAbstractFile } from 'obsidian';
import { get } from 'svelte/store';

import { settingsStore } from './settings';

export default class FileManager {
	private vault: Vault;
	private metadataCache: MetadataCache;
	private noteLocation: string;

	constructor(vault: Vault, metadataCache: MetadataCache) {
		this.vault = vault;
		this.metadataCache = metadataCache;
		this.noteLocation = get(settingsStore).noteLocation;
	}

	async createFolder(folderPath: string) {
		if (await this.exists(folderPath)) {
			return;
		}

		console.log('[minote plugin] create folder: ', folderPath);
		this.vault.createFolder(`${this.noteLocation}/${folderPath}`);
	}

	async exists(filePath: string) {
		return this.vault.adapter.exists(`${this.noteLocation}/${filePath}`);
	}

	async saveFile(filePath: string, content: string) {
		console.log('[minote plugin] save file: ', filePath);
		this.vault.adapter.write(`${this.noteLocation}/${filePath}`, content);
	}

	async saveBinaryFile(filePath: string, binary: ArrayBuffer) {
		console.log('[minote plugin] save binary file: ', filePath);
		this.vault.adapter.writeBinary(`${this.noteLocation}/${filePath}`, binary);
	}
}
