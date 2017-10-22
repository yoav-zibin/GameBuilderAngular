export class Upload {
    file: File;
    cloudStoragePath: string;
    downloadURL: string;
    height: number;
    isBoardImage: boolean;
    $key: string;
    name: string;
    sizeInBytes: number;
    type: string;
    uploaderEmail: string;
    uploaderPhone: string;
    uploaderUid: string;
    width: number;

    constructor(file: File) {
        this.file = file;
    }
}