/**
 * @file 同步模型
 * @author Emac
 * @date 2025-01-05
 */
interface Note {
	id: string;
	title: string;
	modifyDate: number;
	folderId: string;
}

interface Folder {
	id: string;
	name: string;
}

interface ImageInfo {
	fileId: string;
	fileType: string;
}

interface SyncInfo {
	id: string;
	modifyDate: number;
}
