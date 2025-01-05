// 插件配置
import { writable } from 'svelte/store';

import MinotePlugin from 'main';
import { parseCookies } from './utils/cookiesUtil';

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

		console.log('--------init cookie------', settings.cookies);
		if (settings.cookies) {
			setUser(settings.cookies);
		}

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
		console.log('[minote plugin] cookie已失效，清理cookie...');
		store.update((state) => {
			state.cookies = '';
			state.isCookieValid = false;
			state.user = '';
			return state;
		});
	};

	const setCookies = (cookies: string) => {
		store.update((state) => {
			state.cookies = cookies;
			state.isCookieValid = true;
			setUser(cookies);
			return state;
		});
	};

	const setUser = (cookies: string) => {
		for (const cookie of parseCookies(cookies)) {
			// todo: 替换userId为真实的用户名
			if (cookie.name == 'userId') {
				if (cookie.value !== '') {
					console.log('[minote plugin] setting user name=>', cookie.value);
					store.update((state) => {
						state.user = cookie.value;
						return state;
					});
				}
			}
		}
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
			clearCookies,
		}
	}
};

export const settingsStore = createSettingsStore()
