// 插件配置
import { writable } from 'svelte/store';

import MinotePlugin from 'main';

interface MinotePluginSettings {
	cookies: string;
	isCookieValid: boolean;
    user: string;
    noteLocation: string;
};

const DEFAULT_SETTINGS: MinotePluginSettings = {
	cookies: '',
	isCookieValid: false,
    user: '',
    noteLocation: '/'
};

const createSettingsStore = () => {
	const store = writable(DEFAULT_SETTINGS as MinotePluginSettings);

	let _plugin!: MinotePlugin;

	const initialize = async (plugin: MinotePlugin): Promise<void> => {
		const data = Object.assign({}, DEFAULT_SETTINGS, await plugin.loadData());
		const settings: MinotePluginSettings = { ...data };

		console.log('[minote plugin] init cookie: ', settings.cookies);
		store.set(settings);
		_plugin = plugin;
	};

	store.subscribe(async (settings) => {
		if (_plugin) {
			const data = {
				...settings
			};
			await _plugin.saveData(data);
		}
	});

	const clearCookies = () => {
		console.log('[minote plugin] clearing cookie...');
		store.update((state) => {
			state.cookies = '';
			state.isCookieValid = false;
			state.user = '';
			return state;
		});
	};

	const setCookies = (cookies: string) => {
		console.log('[minote plugin] setting cookies: ', cookies);
		store.update((state) => {
			state.cookies = cookies;
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
    
	return {
		subscribe: store.subscribe,
		initialize,
		actions: {
			setNoteLocationFolder,
			setCookies,
			setUser,
			clearCookies,
		}
	}
};

export const settingsStore = createSettingsStore()
