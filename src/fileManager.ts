/**
 * @file Vault 文件管理器
 * @author Emac
 * @date 2025-01-05
 */
import { Vault, MetadataCache, TFile, TFolder, Notice, TAbstractFile, normalizePath } from 'obsidian';
import { get } from 'svelte/store';
import path from 'path';

import { settingsStore } from './settings';

export default class FileManager {
	private vault: Vault;
	private metadataCache: MetadataCache;

	constructor(vault: Vault, metadataCache: MetadataCache) {
		this.vault = vault;
		this.metadataCache = metadataCache;
		// 创建默认文件夹（如果不存在）
		this.createFolder("");
	}

	async createFolder(folderPath: string) {
		if (await this.exists(folderPath)) {
			return;
		}

		this.vault.createFolder(normalizePath(path.join(get(settingsStore).noteLocation, folderPath)));
	}

	async exists(filePath: string) {
		return this.vault.adapter.exists(normalizePath(path.join(get(settingsStore).noteLocation, filePath)));
	}

	async saveFile(filePath: string, content: string) {
		this.vault.adapter.write(normalizePath(path.join(get(settingsStore).noteLocation, filePath)), content);
	}

	async saveBinaryFile(filePath: string, binary: ArrayBuffer) {
		this.vault.adapter.writeBinary(normalizePath(path.join(get(settingsStore).noteLocation, filePath)), binary);
	}
}
