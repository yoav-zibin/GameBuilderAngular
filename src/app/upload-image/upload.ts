export class Upload {
    cloudStoragePath: string;
    downloadURL: string;
    file: File;
    height: number;
    isBoardImage: boolean;
    $key: string;
    name: string;
    sizeInBytes: number;
    uploaderEmail: string;
    uploaderPhone: string;
    uploaderUid: string;
    width: number;

    constructor(file: File) {
        this.file = file;
    }
}