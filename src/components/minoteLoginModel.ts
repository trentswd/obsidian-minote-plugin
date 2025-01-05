// 登录页面
import { Notice } from 'obsidian';

import { settingsStore } from '../settings';
import { MinoteSettingTab } from '../settingTab';

export default class MinoteLoginModel {
	private modal: any;
	private settingTab: MinoteSettingTab;

	constructor(settingTab: MinoteSettingTab) {
		this.settingTab = settingTab;

		const { remote } = require('electron');
		const { BrowserWindow: RemoteBrowserWindow } = remote;
		this.modal = new RemoteBrowserWindow({
			parent: remote.getCurrentWindow(),
			width: 960,
			height: 540,
			show: false
		});

		this.modal.once('ready-to-show', () => {
			this.modal.setTitle('登录小米云服务~');
			this.modal.show();
		});

		const session = this.modal.webContents.session;

		const loginFilter = {
			urls: ['https://account.xiaomi.com/pass/serviceLoginAuth2']
		};

		session.webRequest.onCompleted(loginFilter, (details) => {
			if (details.statusCode == 200) {
				console.log('minote login success');
			}
		});

		const filter = {
			urls: ['https://i.mi.com']
		};
		session.webRequest.onSendHeaders(filter, (details) => {
			const cookies = details.requestHeaders['Cookie'];
			if (cookies) {
				settingsStore.actions.setCookies(cookies);
				settingTab.display();
				this.modal.close();
			} else {
				this.modal.reload();
			}
		});
	}

	async doLogin() {
		try {
			await this.modal.loadURL('https://i.mi.com');
		} catch (error) {
			console.log(error);
			new Notice('加载小米云服务登录页面失败');
		}
	}

	onClose() {
		this.modal.close();
	}
}
