declare class FileHelper {
    getBlob(input: File | Blob | string, filename?: string, type?: string): Promise<Blob>;
    getBase64Url(input: File | Blob | string): Promise<string>;
    createUrl(input: File | Blob | string): Promise<string>;
    browse(options?: {
        multiple?: boolean;
        accept?: string | string[];
    }): Promise<File[]>;
    readJson(blob: Blob): Promise<any>;
    writeJson(object: unknown, filename: string): Promise<Blob & {
        name: string;
    }>;
    send(url: string, files: Blob[], data?: Record<string, unknown>, options?: {
        method?: string;
        headers?: Record<string, string>;
        filesParameterName?: string;
    }): Promise<import("axios").AxiosResponse<any, any, {}>>;
    saveAs(input: File | Blob | string, type?: string, filename?: string): Promise<void>;
}
export default FileHelper;
