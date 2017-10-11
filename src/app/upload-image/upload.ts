export class Upload {
    file: File;
    downloadURL: string;
    height: number;
    is_board_image: boolean;
    $key: string;
    name: string;
    uploader_email: string;
    uploader_phone: string;
    uploader_uid: string;
    width: number;

    constructor(file: File) {
        this.file = file;
    }
}