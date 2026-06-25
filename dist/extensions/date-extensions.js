import { n as e } from "../_chunks/datetime-utility-3.2.0.js";
//#region src/extensions/date-extensions.ts
var t = { use() {
	Date.prototype.toJSON = function() {
		return e(this) ?? "";
	};
} };
//#endregion
export { t as default };
