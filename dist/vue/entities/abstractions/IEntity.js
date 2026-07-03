//#region src/vue/entities/abstractions/IEntity.ts
function e(e) {
	return e == null || e === "new" || e === "" || typeof e == "number" && e <= 0;
}
//#endregion
export { e as isNewEntity };
