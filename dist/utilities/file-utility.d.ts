type NamedBlob = Blob & {
    name: string;
};
export declare const browse: ({ multiple, accept }?: {
    multiple?: boolean;
    accept?: string | string[];
}) => Promise<File[]>;
export declare const isFile: (item: unknown) => item is Blob;
export declare const createUrl: (blob: Blob) => string;
export declare const revokeUrl: (url: string) => void;
export declare const getFilename: (uri: string) => string | undefined;
export declare const getExtension: (filename: string) => string;
export declare const getFilenameWithoutExtension: (uri: string | undefined) => string | undefined;
export declare const toFormData: (files: Blob[], data: Record<string, unknown>, { filesParameterName }?: {
    filesParameterName?: string;
}) => FormData;
export declare const fileToBlob: (file: File, filename?: string, type?: string) => Promise<NamedBlob>;
export declare const base64ToBlob: (base64: string, filename: string, type?: string) => NamedBlob;
export declare const urlToBlob: (url: string, filename?: string) => Promise<NamedBlob>;
export declare const blobToBase64: (blob: Blob) => Promise<string>;
export declare const readAllText: (blob: Blob) => Promise<string>;
export declare const writeAllText: (content: string, filename?: string, type?: string) => NamedBlob;
export declare const saveAs: (blob: Blob & {
    name?: string;
}, filename?: string) => void;
export declare const formatFileSize: (bytes: number, si?: boolean, dp?: number) => string;
export declare const dropHandler: (e: DragEvent) => File[];
declare const _default: {
    isFile: (item: unknown) => item is Blob;
    createUrl: (blob: Blob) => string;
    revokeUrl: (url: string) => void;
    getFilename: (uri: string) => string | undefined;
    getExtension: (filename: string) => string;
    getFilenameWithoutExtension: (uri: string | undefined) => string | undefined;
    toFormData: (files: Blob[], data: Record<string, unknown>, { filesParameterName }?: {
        filesParameterName?: string;
    }) => FormData;
    fileToBlob: (file: File, filename?: string, type?: string) => Promise<NamedBlob>;
    base64ToBlob: (base64: string, filename: string, type?: string) => NamedBlob;
    urlToBlob: (url: string, filename?: string) => Promise<NamedBlob>;
    blobToBase64: (blob: Blob) => Promise<string>;
    readAllText: (blob: Blob) => Promise<string>;
    writeAllText: (content: string, filename?: string, type?: string) => NamedBlob;
    saveAs: (blob: Blob & {
        name?: string;
    }, filename?: string) => void;
    formatFileSize: (bytes: number, si?: boolean, dp?: number) => string;
};
export default _default;
