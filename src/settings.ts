/**
 * @file 插件配置
 * @author Emac
 * @date 2025-01-05
 */
import { writable } from 'svelte/store';

import MinotePlugin from 'main';

interface MinotePluginSettings {
	cookie: string;
	isCookieValid: boolean;
	user: string;
	noteLocation: string;
	lastTimeSynced: SyncInfo[];
};

const DEFAULT_SETTINGS: MinotePluginSettings = {
	cookie: '',
	isCookieValid: false,
	user: '',
	noteLocation: 'minote',
	lastTimeSynced: [],
};

const createSettingsStore = () => {
	const store = writable(DEFAULT_SETTINGS as MinotePluginSettings);

	let _plugin!: MinotePlugin;

	const initialize = async (plugin: MinotePlugin): Promise<void> => {
		_plugin = plugin;

		const data = Object.assign({}, DEFAULT_SETTINGS, await plugin.loadData());
		const settings: MinotePluginSettings = { ...data };
		console.log('[minote plugin] init cookie: ', settings.cookie);
		store.set(settings);
	};

	store.subscribe(async (settings) => {
		if (_plugin) {
			const data = { ...settings };
			await _plugin.saveData(data);
		}
	});

	const clearCookie = () => {
		console.log('[minote plugin] clearing cookie...');
		store.update((state) => {
			state.cookie = '';
			state.isCookieValid = false;
			state.user = '';
			return state;
		});
	};

	const setCookie = (cookie: string) => {
		console.log('[minote plugin] setting cookie: ', cookie);
		store.update((state) => {
			state.cookie = cookie;
			state.isCookieValid = true;
			return state;
		});
	};

	const setUser = (user: string) => {
		console.log('[minote plugin] setting user name: ', user);
		store.update((state) => {
			state.user = user;
			return state;
		});
	};

	const setNoteLocationFolder = (value: string) => {
		store.update((state) => {
			state.noteLocation = value;
			return state;
		});
	};

	const clearLastTimeSynced = () => {
		store.update((state) => {
			state.lastTimeSynced = [];
			return state;
		});
	};

	const setLastTimeSynced = (synced: SyncInfo[]) => {
		store.update((state) => {
			state.lastTimeSynced = synced;
			return state;
		});
	};

	return {
		subscribe: store.subscribe,
		initialize,
		actions: {
			setNoteLocationFolder,
			setCookie,
			setUser,
			clearCookie,
			clearLastTimeSynced,
			setLastTimeSynced,
		}
	}
};

export const settingsStore = createSettingsStore()
