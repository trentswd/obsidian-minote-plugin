/**
 * @file 插件配置页面
 * @author Emac
 * @date 2025-01-05
 */
import { PluginSettingTab, Setting, App, Platform, Notice } from 'obsidian';
import { get } from 'svelte/store';
import pickBy from 'lodash.pickby';

import MinotePlugin from 'main';
import { settingsStore } from './settings';
import MinoteLoginModel from './components/minoteLoginModel';
import MinoteLogoutModel from './components/minoteLogoutModel';

export class MinoteSettingTab extends PluginSettingTab {
	plugin: MinotePlugin;

	constructor(app: App, plugin: MinotePlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;
		containerEl.empty();

		containerEl.createEl('h2', { text: '设置小米笔记插件' });
		const isCookieValid = get(settingsStore).isCookieValid;
		if (Platform.isDesktopApp) {
			if (isCookieValid) {
				this.showLogout();
			} else {
				this.showLogin();
			}
		}

        this.notebookFolder();
	}

    private showLogin(): void {
		new Setting(this.containerEl).setName('登录小米云服务').addButton((button) => {
			return button
				.setButtonText('登录')
				.setCta()
				.onClick(async () => {
					button.setDisabled(true);
					const loginModel = new MinoteLoginModel(this);
					await loginModel.doLogin();
					this.display();
				});
		});
	}

    private showLogout(): void {
		document.createRange().createContextualFragment;
		const desc = document.createRange().createContextualFragment(
			`1. 登录：点击登录按钮，在弹出页面【扫码登录】<br>
             2. 注销：点击注销按钮，在弹出页面右上角点击头像，下拉菜单选择【退出】`
		);

		new Setting(this.containerEl)
			.setName(`小米云服务已登录，用户名：  ${get(settingsStore).user}`)
			.setDesc(desc)
			.addButton((button) => {
				return button
					.setButtonText('注销')
					.setCta()
					.onClick(async () => {
						button.setDisabled(true);
						const logoutModel = new MinoteLogoutModel(this);
						await logoutModel.doLogout();
						this.display();
					});
			})
			.addButton((button) => {
				return button
					.setButtonText('拷贝Settings')
					.setCta()
					.onClick(async () => {
						navigator.clipboard.writeText(JSON.stringify(get(settingsStore))).then(
							function () {
								new Notice('拷贝Settings到剪切板成功！');
							},
							function (error) {
								new Notice('拷贝Settings到剪切板失败！');
								console.error('[minote plugin] failed to copy settings to clipboard', error);
							}
						);
					});
			});
	}

    private notebookFolder(): void {
		new Setting(this.containerEl)
			.setName('笔记保存位置')
			.setDesc('请选择Obsidian Vault中小米笔记存放的位置')
			.addDropdown((dropdown) => {
				const files = (this.app.vault.adapter as any).files;
				const folders = pickBy(files, (val: any) => {
					return val.type === 'folder';
				});

				Object.keys(folders).forEach((val) => {
					dropdown.addOption(val, val);
				});
				return dropdown
					.setValue(get(settingsStore).noteLocation)
					.onChange(async (value) => {
						settingsStore.actions.setNoteLocationFolder(value);
					});
			});
	}
}