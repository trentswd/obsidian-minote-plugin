// 插件主函数
import { Menu, Notice, Platform, Plugin } from 'obsidian';

import { settingsStore } from './src/settings';
import { MinoteSettingTab } from './src/settingTab';
import syncer from './src/syncer';

export default class MinotePlugin extends Plugin {
	private syncing = false;

	async onload() {
		console.log('loading minote plugin');
		settingsStore.initialize(this);

		const ribbonEl = this.addRibbonIcon('book-open', '同步小米笔记', (event) => {
			if (event.button === 0) {
				this.startSync();
			}
		});

		ribbonEl.addEventListener('contextmenu', (event: MouseEvent) => {
			event.preventDefault();
			event.stopPropagation(); // 阻止事件传播

			const preventDefaultMouseDown = (mouseDownEvent: MouseEvent) => {
				mouseDownEvent.preventDefault();
			};

			// 额外阻止mousedown事件的默认行为
			window.addEventListener('mousedown', preventDefaultMouseDown);

			const menu = new Menu();
			menu.addItem((item) =>
				item
					.setTitle('同步小米笔记')
					.setIcon('refresh-ccw')
					.onClick(() => {
						this.startSync();
					})
			);

			menu.addItem((item) =>
				item
					.setTitle('强制小米笔记')
					.setIcon('refresh-ccw-dot')
					.onClick(() => {
						this.startSync(true);
					})
			);

			menu.showAtMouseEvent(event);
			menu.onHide(() => {
				window.removeEventListener('mousedown', preventDefaultMouseDown);
			});
		});

		this.addCommand({
			id: 'sync-minote-command',
			name: '同步小米笔记',
			callback: () => {
				this.startSync();
			}
		});

		this.addCommand({
			id: 'Force-sync-minote-command',
			name: '强制同步小米笔记',
			callback: () => {
				this.startSync(true);
			}
		});

		this.addSettingTab(new MinoteSettingTab(this.app, this));
	}

	async startSync(force = false) {
		if (this.syncing) {
			new Notice('正在同步小米笔记，请勿重复点击');
			return;
		}
		this.syncing = true;
		try {
			await this.syncer.sync(force);
			console.log('sync MI notes success');
		} catch (e) {
			if (Platform.isDesktopApp) {
				new Notice('同步小米笔记异常，请打开控制台查看详情');
			}
			console.error('failed to sync MI notes', e);
		} finally {
			this.syncing = false;
		}
	}

	onunload() {
		console.log('unloading minote plugin', new Date().toLocaleString());
	}
}
