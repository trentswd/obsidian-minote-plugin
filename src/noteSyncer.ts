/**
 * @file 笔记同步引擎
 * @author Emac
 * @date 2025-01-05
 */
import { get } from 'svelte/store';

import { settingsStore } from './settings';
import FileManager from './fileManager';
import MinoteApi from './minoteApi';
import * as path from 'path';

export default class NoteSyncer {
	private fileManager: FileManager;
	private minoteApi: MinoteApi;
	private notes: Note[] = [];
	private folders: Folder[] = [];
	private folderDict: Record<string, string> = {};

	constructor(fileManager: FileManager, minoteApi: MinoteApi) {
		this.fileManager = fileManager;
		this.minoteApi = minoteApi;
	}

	public async sync(force = false) {
		if (force) {
			settingsStore.actions.clearLastTimeSynced();
		}

		await this.fetchNotesAndFolders();
		await this.createFolders();
		return await this.syncNotes();
	}

	private async fetchNotesAndFolders() {
		// 获取第一页
		let page = await this.minoteApi.fetchPage();
		while (true) {
			for (const entry of page.data.entries) {
				if (entry.type === 'note') {
					// 解析笔记
					let title = '';
					if (entry.extraInfo) {
						const extra = JSON.parse(entry.extraInfo);
						title = extra.title || '';
					}
					if (!title) {
						title = entry.snippet.split('\n')[0] + `_${entry.id}`;
					}
					// 将标题中的斜杠替换为竖线
					title = title.trim().replace(/\//g, '|');

					const note: Note = {
						id: entry.id,
						title,
						modifyDate: entry.modifyDate,
						folderId: entry.folderId.toString(),
					};
					this.notes.push(note);
				}
			}

			for (const entry of page.data.folders) {
				if (entry.type === 'folder') {
					// 解析文件夹
					const folder: Folder = {
						id: entry.id.toString(),
						name: entry.subject,
					};
					this.folders.push(folder);
				}
			}

			// 检查是否需要获取下一页
			if (page.data.lastPage) {
				break;
			}

			// 获取下一页
			page = await this.minoteApi.fetchPage(page.data.syncTag);
		}
	}

	private async createFolders() {
		// 添加默认文件夹
		this.folders.push({ id: '0', name: '未分类' });

		for (const folder of this.folders) {
			// 创建文件夹目录
			await this.fileManager.createFolder(folder.name);

			// 更新文件夹字典
			this.folderDict[folder.id] = folder.name;
		}
	}

	private async syncNotes() {
		let syncedCount = 0;

		// 加载上次同步信息
		let lastNoteDict: Record<string, number> = get(settingsStore).lastTimeSynced.reduce((acc: Record<string, number>, note: SyncInfo) => {
			acc[note.id] = note.modifyDate;
			return acc;
		}, {});

		// 记录此次同步信息
		const thisTimeSynced: SyncInfo[] = [];
		for (const note of this.notes) {
			try {
				// 如果笔记未修改则跳过
				if (note.id in lastNoteDict && note.modifyDate <= lastNoteDict[note.id]) {
					// 添加到已处理笔记列表
					thisTimeSynced.push({
						id: note.id,
						modifyDate: note.modifyDate
					});
					continue;
				}

				const folderName = this.folderDict[note.folderId];
				const folderPath = folderName;
				const notePath = path.join(folderPath, `${note.id}.md`);

				// 获取笔记内容
				const noteDetails = await this.minoteApi.fetchNoteDetails(note.id);

				// 处理图片
				const imgDict: Record<string, string> = {};
				const downloadPromises: Promise<void>[] = [];

				if (noteDetails.data.entry.setting?.data) {
					const images: ImageInfo[] = [];
					for (const img of noteDetails.data.entry.setting.data) {
						const fileId = img.fileId;
						const fileType = img.mimeType.replace('image/', '');
						images.push({ fileId, fileType });
						imgDict[fileId] = fileType;
					}

					// 创建图片目录
					const imgDir = path.join(folderPath, 'img');
					await this.fileManager.createFolder(imgDir);

					// 并行下载图片
					for (const img of images) {
						const imgPath = path.join(imgDir, `${img.fileId}.${img.fileType}`);
						downloadPromises.push(this.downloadImage(img.fileId, imgPath));
					}
				}

				// 等待所有图片下载完成
				await Promise.all(downloadPromises);

				// 转换内容
				let content = noteDetails.data.entry.content;

				// 规则1: 移除<text>标签
				content = content.replace(/<text[^>]*>(.*?)<\/text>/g, '$1');

				// 规则2: 转换background标签
				content = content.replace(
					/<background color="#([^"]*)">(.*?)<\/background>/g,
					'<span style="background-color: #$1">$2</span>'
				);

				// 规则3: 转换图片行 (☺格式)
				content = content.replace(/☺\s+([^<]+)(<0\/><\/>)?/gm, (match: any, fileId: any) => {
					return fileId in imgDict ? `![](img/${fileId}.${imgDict[fileId]})` : match;
				});

				// 规则4: 转换图片行 (<img>格式)
				content = content.replace(
					/<img fileid="([^"]+)" imgshow="0" imgdes="" \/>/g, (match: any, fileId: any) => {
						return fileId in imgDict ? `![](img/${fileId}.${imgDict[fileId]})` : match;
					}
				);

				// 保存转换后的内容
				await this.fileManager.saveFile(notePath, content);

				syncedCount++;
				// 添加到已处理笔记列表
				thisTimeSynced.push({
					id: note.id,
					modifyDate: note.modifyDate
				});
			} catch (err) {
				console.error('[minote plugin] sync MI note error: ', note, err);
				continue;
			}
		}

		// 更新上次同步信息
		settingsStore.actions.setLastTimeSynced(thisTimeSynced);
		return syncedCount
	}

	private async downloadImage(fileId: string, imgPath: string) {
		if (await this.fileManager.exists(imgPath)) {
			return;
		}

		const imgBinary = await this.minoteApi.fetchImage(fileId);
		await this.fileManager.saveBinaryFile(imgPath, imgBinary);
	}
}
