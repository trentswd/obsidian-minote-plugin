/**
 * @file 注销页面
 * @author Emac
 * @date 202-01-05
 */
import { settingsStore } from '../settings';
import { MinoteSettingTab } from '../settingTab';

export default class MinoteLogoutModel {
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
			this.modal.setTitle('注销小米云服务，点击头像选择【退出】');
			this.modal.show();
		});

		const session = this.modal.webContents.session;
		const filter = {
			urls: ['https://logout.account.xiaomi.com/logout*']
		};
		session.webRequest.onCompleted(filter, (details) => {
			if (details.statusCode == 200) {
				console.log('[minote plugin] logout success');
				settingsStore.actions.clearCookie();
				this.settingTab.display();
				this.modal.close();
			}
		});
	}

	async doLogout() {
		await this.modal.loadURL('https://i.mi.com');
	}

	onClose() {
		this.modal.close();
	}
}
