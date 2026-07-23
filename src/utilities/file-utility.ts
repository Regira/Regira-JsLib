import { toArray, last, skip, take } from "./array-utility"
import { flattenObject } from "./object-utility"

type NamedBlob = Blob & { name: string }

function byteStringToBlob(byteString: string, filename: string, type: string): NamedBlob {
    // write the bytes of the string to an ArrayBuffer
    const ab = new ArrayBuffer(byteString.length)
    const ia = new Uint8Array(ab)
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i)
    }
    // write the ArrayBuffer to a blob, and you're done
    const blob = new Blob([ab], { type }) as NamedBlob
    blob.name = filename
    return blob
}
function base64StringToBlob(byteString: string, type: string, sliceSize = 512): Blob {
    // https://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript#answer-16245768

    const byteArrays: Uint8Array[] = []

    for (let offset = 0; offset < byteString.length; offset += sliceSize) {
        const slice = byteString.slice(offset, offset + sliceSize)

        const byteNumbers = new Array<number>(slice.length)
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i)
        }

        const byteArray = new Uint8Array(byteNumbers)
        byteArrays.push(byteArray)
    }

    const blob = new Blob(byteArrays as BlobPart[], { type })
    return blob
}

export const browse = ({ multiple, accept }: { multiple?: boolean; accept?: string | string[] } = {}) => {
    return new Promise<File[]>(function (resolve) {
        const input = document.createElement("input") as HTMLInputElement
        input.setAttribute("type", "file")

        if (multiple == null || multiple) {
            input.setAttribute("multiple", "true")
        }
        if (accept != null) {
            input.setAttribute("accept", Array.isArray(accept) ? accept.join(",") : accept)
        }

        input.value = ""
        input.setAttribute("style", "display: none;")
        function changeListener() {
            const files = [...input.files!]
            input.removeEventListener("change", changeListener)
            document.body.removeChild(input)
            resolve(files)
        }
        input.addEventListener("change", changeListener)
        input.addEventListener("cancel", () => resolve([]))
        document.body.appendChild(input)
        input.click()
    })
}

export const isFile = (item: unknown): item is Blob => item != null && item instanceof Blob
export const createUrl = (blob: Blob): string => URL.createObjectURL(blob)
export const revokeUrl = (url: string): void => URL.revokeObjectURL(url)
export const getFilename = (uri: string): string | undefined => {
    if (!uri || !uri.includes("/")) {
        return uri
    }
    if (uri.endsWith("/")) {
        throw new Error("filename cannot end with a '/'")
    }
    return last(uri.split("/").filter((x) => !!x))
}
export const getExtension = (filename: string): string => {
    const filenameSegments = filename.split(".")
    const filenameSegmentsWithoutFirst = skip(filenameSegments, 1)
    const ext = last(filenameSegmentsWithoutFirst)
    return ext ? "." + ext : ""
}
export const getFilenameWithoutExtension = (uri: string | undefined): string | undefined => {
    if (!uri) {
        return undefined
    }

    const filename = getFilename(uri)
    if (!filename || !filename.includes(".")) {
        return filename
    }
    const filenameSegments = filename.split(".")
    return take(filenameSegments, filenameSegments.length - 1 || 1).join(".")
}
export const toFormData = (
    files: Blob[],
    data: Record<string, unknown>,
    { filesParameterName = "files" }: { filesParameterName?: string } = {}
): FormData => {
    const formData = toArray(files).reduce((r: FormData, f: Blob) => {
        r.append(filesParameterName, f, (f as File).name)
        return r
    }, new FormData())
    const flattenedData = flattenObject(data) as Record<string, string>
    return Object.entries(flattenedData).reduce((r: FormData, e) => {
        r.append(e[0], e[1])
        return r
    }, formData)
}

export const fileToBlob = async (file: File, filename?: string, type?: string): Promise<NamedBlob> => {
    return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = () => resolve(byteStringToBlob(reader.result as string, filename ?? file.name, type ?? file.type))
        reader.readAsBinaryString(file)
    })
}
export const base64ToBlob = (base64: string, filename: string, type?: string): NamedBlob => {
    const hasType = base64.substr(0, 100).includes(",")
    const input = hasType ? base64.substr(base64.indexOf(",") + 1) : base64

    if (!type && hasType) {
        type = base64.substr(0, base64.indexOf(",")).split(":")[1]!.split(";")[0]
    }

    const decodedInput = atob(input)

    const blob = base64StringToBlob(decodedInput, type ?? "") as NamedBlob
    blob.name = filename
    return blob

    // https://stackoverflow.com/questions/12168909/blob-from-dataurl/36183379#answer-12300351
    // let byteString = undefined;

    // if (base64.startsWith("data:")) {
    //   // convert base64 to raw binary data held in a string
    //   // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    //   const segments = base64.split(",");
    //   byteString = atob(last(segments));
    //   if (!type) {
    //     type = segments[0].split(":")[1].split(";")[0];
    //   }
    // } else {
    //   byteString = base64;
    // }

    // return byteStringToBlob(byteString, filename, type);
}
export const urlToBlob = async (url: string, filename?: string): Promise<NamedBlob> => {
    const response = await fetch(url)

    // try to get filename from content-disposition header
    const disposition = response.headers.get("content-disposition")
    if (disposition && disposition.indexOf("attachment") !== -1) {
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
        const matches = filenameRegex.exec(disposition)
        if (matches != null && matches[1]) {
            filename = matches[1].replace(/['"]/g, "")
        }
    }

    const blob = (await response.blob()) as NamedBlob

    if (filename) {
        blob.name = filename
    }
    return blob
}
export const blobToBase64 = async (blob: Blob): Promise<string> => {
    return new Promise(function (resolve) {
        const reader = new FileReader()
        reader.onload = (e) => resolve(e.target!.result as string)
        reader.readAsDataURL(blob)
    })
}

export const readAllText = async (blob: Blob): Promise<string> => {
    return new Promise(function (resolve) {
        const reader = new FileReader()
        reader.onload = (e) => resolve(e.target!.result as string)
        reader.readAsText(blob)
    })
}
export const writeAllText = (content: string, filename?: string, type?: string): NamedBlob => {
    const blob = new Blob([content], { type }) as NamedBlob
    if (filename) {
        blob.name = filename
    }
    return blob
}

export const saveAs = (blob: Blob & { name?: string }, filename?: string): void => {
    // http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js
    type WindowLike = Window &
        typeof globalThis & {
            webkitURL?: typeof URL
            setImmediate?: (fn: () => void) => void
            safari?: boolean
            FileReader?: typeof FileReader
        }
    type SaverFn = (blob: Blob & { name?: string }, name: string) => void
    const saveAsImpl = (function (win?: WindowLike): SaverFn | undefined {
        "use strict"
        if (win == null || (typeof navigator !== "undefined" && /MSIE [1-9]\./.test(navigator.userAgent))) {
            return undefined
        }
        const doc = win.document
        const getURLAPI = (): typeof URL => win.URL ?? win.webkitURL ?? (win as unknown as typeof URL)
        const linkEl = doc.createElementNS("http://www.w3.org/1999/xhtml", "a") as HTMLAnchorElement
        const supportsDownload = "download" in linkEl
        const dispatchClick = (el: Element): void => {
            el.dispatchEvent(new MouseEvent("click"))
        }
        const isIOS = /constructor/i.test(String(win.HTMLElement ?? "")) || !!win.safari
        const isCriOS = /CriOS\/[\d]+/.test(navigator.userAgent)
        const throwAsync = (err: Error): void => {
            if (win.setImmediate) {
                win.setImmediate(() => {
                    throw err
                })
            } else {
                win.setTimeout(() => {
                    throw err
                }, 0)
            }
        }
        const APP_OCTET_STREAM = "application/octet-stream"
        const REVOKE_DELAY = 1e3 * 40
        const revokeAfterDelay = (urlOrEl: string | Element): void => {
            setTimeout((): void => {
                if (typeof urlOrEl === "string") {
                    getURLAPI().revokeObjectURL(urlOrEl)
                } else {
                    ;(urlOrEl as Element & { remove(): void }).remove()
                }
            }, REVOKE_DELAY)
        }
        const fireEvents = (target: EventTarget & Record<string, unknown>, eventNames: string | string[], evt?: unknown): void => {
            const names = ([] as string[]).concat(eventNames)
            let remaining = names.length
            while (remaining--) {
                const handler = target["on" + names[remaining]]
                if (typeof handler === "function") {
                    try {
                        ;(handler as (e: unknown) => void).call(target, evt ?? target)
                    } catch (err) {
                        throwAsync(err as Error)
                    }
                }
            }
        }
        const prependBOM = (blobArg: Blob): Blob => {
            if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blobArg.type)) {
                return new Blob([String.fromCharCode(65279), blobArg], { type: blobArg.type })
            }
            return blobArg
        }
        interface SaverState extends Record<string, unknown> {
            readyState: number
            INIT: number
            WRITING: number
            DONE: number
            error?: Error
            onwritestart?: (e: Event) => void
            onprogress?: (e: Event) => void
            onwrite?: (e: Event) => void
            onabort?: (e: Event) => void
            onerror?: (e: Event) => void
            onwriteend?: (e: Event) => void
            abort(): void
        }
        function SaverCtor(this: SaverState, blobArg: Blob & { name?: string }, saveName: string, noAutoBOM?: boolean): void {
            if (!noAutoBOM) blobArg = prependBOM(blobArg) as Blob & { name?: string }
            const saver = this
            const isOctetStream = blobArg.type === APP_OCTET_STREAM
            let objURL: string | undefined
            const fireStateEvents = (): void => {
                fireEvents(saver as unknown as EventTarget & Record<string, unknown>, "writestart progress write writeend".split(" "))
            }
            const tryFallback = (): void => {
                if ((isCriOS || (isOctetStream && isIOS)) && win!.FileReader) {
                    const reader = new FileReader()
                    reader.onloadend = function () {
                        const dataUrl = isCriOS
                            ? (reader.result as string)
                            : (reader.result as string).replace(/^data:[^;]*;/, "data:attachment/file;")
                        const opened = win!.open(dataUrl, "_blank")
                        if (!opened) win!.location.href = dataUrl
                        saver.readyState = saver.DONE
                        fireStateEvents()
                    }
                    reader.readAsDataURL(blobArg)
                    saver.readyState = saver.INIT
                    return
                }
                if (!objURL) {
                    objURL = getURLAPI().createObjectURL(blobArg)
                }
                if (isOctetStream) {
                    win!.location.href = objURL
                } else {
                    const opened = win!.open(objURL, "_blank")
                    if (!opened) {
                        win!.location.href = objURL
                    }
                }
                saver.readyState = saver.DONE
                fireStateEvents()
                revokeAfterDelay(objURL)
            }
            saver.readyState = saver.INIT
            if (supportsDownload) {
                objURL = getURLAPI().createObjectURL(blobArg)
                setTimeout(function () {
                    linkEl.href = objURL!
                    linkEl.download = saveName
                    dispatchClick(linkEl)
                    fireStateEvents()
                    revokeAfterDelay(objURL!)
                    saver.readyState = saver.DONE
                })
                return
            }
            tryFallback()
        }
        const proto = SaverCtor.prototype as SaverState
        const createSaver = function (blobArg: Blob & { name?: string }, saveName: string, noAutoBOM?: boolean): void {
            new (SaverCtor as unknown as new (b: Blob, n: string, d?: boolean) => SaverState)(
                blobArg,
                saveName || blobArg.name || "download",
                noAutoBOM
            )
        }
        const nav = navigator as Navigator & { msSaveOrOpenBlob?: (blob: Blob, name: string) => boolean }
        if (typeof navigator !== "undefined" && nav.msSaveOrOpenBlob) {
            return function (blobArg: Blob & { name?: string }, saveName: string): void {
                saveName = saveName || blobArg.name || "download"
                nav.msSaveOrOpenBlob!(prependBOM(blobArg), saveName)
            }
        }
        proto.abort = function (): void {}
        proto.readyState = proto.INIT = 0
        proto.WRITING = 1
        proto.DONE = 2
        proto.error = proto.onwritestart = proto.onprogress = proto.onwrite = proto.onabort = proto.onerror = proto.onwriteend = undefined
        return createSaver
    })((typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : undefined) as WindowLike)
    saveAsImpl?.(blob, filename ?? blob.name ?? "file")
}

export const formatFileSize = (bytes: number, si = true, dp = 1): string => {
    // https://stackoverflow.com/questions/10420352/converting-file-size-in-bytes-to-human-readable-string/10420404
    const thresh = si ? 1000 : 1024

    if (Math.abs(bytes) < thresh) {
        return bytes + " B"
    }

    const units = si ? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"] : ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"]
    let u = -1
    const r = 10 ** dp

    do {
        bytes /= thresh
        ++u
    } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1)

    return bytes.toFixed(dp) + " " + units[u]
}

export const dropHandler = (e: DragEvent): File[] => {
    // https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/File_drag_and_drop

    // Prevent default behavior (Prevent file from being opened)
    e.preventDefault()

    const { dataTransfer } = e
    const droppedFiles: File[] = []

    if (dataTransfer?.items) {
        // Use DataTransferItemList interface to access the file(s)
        for (let i = 0; i < dataTransfer.items.length; i++) {
            // If dropped items aren't files, reject them
            if (dataTransfer.items[i]!.kind === "file") {
                const file = dataTransfer.items[i]!.getAsFile()
                if (file) droppedFiles.push(file)
            }
        }
    } else if (dataTransfer?.files) {
        // Use DataTransfer interface to access the file(s)
        droppedFiles.push(...Array.from(dataTransfer.files))
    }

    return droppedFiles
}

// utility
export default {
    isFile,
    createUrl,
    revokeUrl,
    getFilename,
    getExtension,
    getFilenameWithoutExtension,
    toFormData,

    fileToBlob,
    base64ToBlob,
    urlToBlob,
    blobToBase64,

    readAllText,
    writeAllText,

    saveAs,

    formatFileSize,
}
