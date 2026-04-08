/**
 * @file 同步模型
 * @author Emac
 * @date 2025-01-05
 */
export interface Note {
	id: string;
	title: string;
	modifyDate: number;
	folderId: string;
}

export interface Folder {
	id: string;
	name: string;
}

export interface ImageInfo {
	fileId: string;
	fileType: string;
}

export interface SyncInfo {
	id: string;
	type: string;
	name: string;
	syncTime: number;
	folderName?: string;
}

export interface TodoEntity {
	id: string; // use syncId or id from wrapper
	title: string;
	content: string; // for listType 1 it's JSON string, listType 0 it's plain text
	plainText: string;
	listType: number; // 0 or 1
	isFinish: number; // 0 or 1
	modifyDate: number; // lastModifiedTime
	folderId: string; // defaults to 0
}
