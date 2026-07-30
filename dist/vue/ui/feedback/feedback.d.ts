import { type ComputedRef, type Ref } from "vue";
export declare enum FeedbackStatus {
    none = "",
    pending = "Pending",
    success = "Success",
    failed = "Failed"
}
export type FeedbackIn = {
    autoHideDelay?: number;
};
/**
 * What went wrong, as the API reports it: a field-error map (`{ title: "Required" }` — the 400 body an
 * `EntityInputException`'s `InputErrors` produces) or a plain string. NOT an `Error` — log the exception
 * yourself and pass `ex.response?.data?.errors`.
 */
export type FeedbackError = string | Record<string, string>;
export interface FeedbackOut {
    status: Ref<FeedbackStatus>;
    message: Ref<string>;
    error: Ref<FeedbackError | undefined>;
    /** busy flag — `status === FeedbackStatus.pending`, so a view can disable its buttons without re-deriving it */
    isPending: ComputedRef<boolean>;
    pending(msg: string): void;
    success(msg: string): void;
    /** `errors` is a FIELD-ERROR MAP or a string, never an `Error` — see {@link FeedbackError}. */
    fail(msg: string, errors?: FeedbackError): void;
    reset(): void;
}
type FeedbackStatusOrError = {
    status: FeedbackStatus;
    error?: FeedbackError;
};
export interface FeedbackEmits {
    (e: "close", arg: FeedbackStatusOrError): void;
}
export type FeedbackProps = {
    feedback: FeedbackOut;
    hideCloseButton?: boolean;
    enableErrorPopup?: boolean;
};
export declare const feedbackDefaults: {
    hideCloseButton: boolean;
    enableErrorPopup: boolean;
};
export type FeedbackSlots = {
    "close-button"?(): any;
    pending?(): any;
    success?(): any;
    error?(): any;
};
export declare function useFeedback({ autoHideDelay }?: FeedbackIn): FeedbackOut;
export default useFeedback;
