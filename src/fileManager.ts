import { Vault, MetadataCache, TFile, TFolder, Notice, TAbstractFile } from 'obsidian';
import { get } from 'svelte/store';

import { AnnotationFile, DailyNoteReferenece, Metadata, Notebook } from './models';
import { settingsStore } from './settings';

export default class FileManager {
	private vault: Vault;
	private metadataCache: MetadataCache;

	constructor(vault: Vault, metadataCache: MetadataCache) {
		this.vault = vault;
		this.metadataCache = metadataCache;
	}
}
