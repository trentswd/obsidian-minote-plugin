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

export interface AttachmentSyncInfo {
	fileId: string;              // 小米云端的附件唯一标识
	localPath: string;           // 本地 Vault 中的实际存放路径
	digest: string;              // 文件摘要（来自小米 API）
	lastSyncTime: number;        // 最近一次同步/状态变更的时间戳
	linkedNoteIds: string[];     // 当前仍在引用该附件的笔记 ID 列表
	historicalNoteIds: string[]; // 历史上曾引用过该附件的全部笔记 ID（溯源用，只增不减）
	isDeleted: boolean;          // 当 linkedNoteIds 为空时标记为孤儿附件
}
