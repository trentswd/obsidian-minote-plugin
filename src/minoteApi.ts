/**
 * @file 小米笔记 API 代理
 * @author Emac
 * @date 2025-01-05
 */
import { requestUrl, type RequestUrlParam } from 'obsidian';
import { get } from 'svelte/store';

import { settingsStore } from './settings';

export default class MinoteApi {
	readonly baseUrl: string = 'https://i.mi.com';

	private getHeaders() {
		return {
			'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36',
			'Accept-Encoding': 'gzip, deflate, br',
			'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
			'Cookie': get(settingsStore).cookie
		};
	}

	async fetchPage(syncTag = '') {
		const req: RequestUrlParam = {
			url: this.baseUrl + `/note/full/page?ts=${Date.now()}&syncTag=${syncTag}&limit=200`,
			method: 'GET',
			headers: this.getHeaders()
		};
		const resp = await requestUrl(req);
		return resp.json;
	}

	async fetchNoteDetails(noteId: string) {
		const req: RequestUrlParam = {
			url: this.baseUrl + `/note/note/${noteId}/?ts=${Date.now()}`,
			method: 'GET',
			headers: this.getHeaders()
		};
		const resp = await requestUrl(req);
		return resp.json;
	}

	async fetchImage(fileId: string) {
		const req: RequestUrlParam = {
			url: this.baseUrl + `/file/full?type=note_img&fileid=${fileId}`,
			method: 'GET',
			headers: this.getHeaders()
		};
		const resp = await requestUrl(req);
		return resp.arrayBuffer;
	}
}
