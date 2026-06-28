# Attachments

Uploading and downloading files attached to an entity — a front-end concern layered on top of the basic
CRUD slice. The full worked code lives in the complex `Vehicle` slice:
[../ai/entities.advanced.example.md](../ai/entities.advanced.example.md). Exact signatures (file helpers,
HTTP wiring): [../ai/entities.signatures.md](../ai/entities.signatures.md#10-wiring-ioc--http).

## The shape

Attachments are themselves a small entity (`entity-attachments`), referenced as a child collection on the
host model. The host carries an optional array; soft-deleted rows are dropped before save:

```ts
import type { Entity as EntityAttachment } from "../../entity-attachments"

class Vehicle extends EntityBase {
    attachments?: Array<EntityAttachment>
    // …
}
```

A file is a `Blob`; an attachment wraps one. The `entity-attachments` module exports the helpers that turn
files into savable attachments and round-trip them with the host (`createEntity`, `save`,
`insertWithAttachments`, `updateWithAttachments`) plus the reusable `Overview` component (imported as
`EntityAttachments`) and the model `Entity` (imported as `EntityAttachment`).

## The attachment service

A host that owns files uses the **"with attachments" service variant**: it is constructed with an
`AxiosWithFilesInstance` (not a plain `AxiosInstance` — the file-aware axios from
[`vue/http`](../../http/README.md)), overrides `insert` / `update` to round-trip files alongside the
record, and adds bespoke file endpoints. The shape:

```ts
export class EntityService extends EntityServiceBase<Entity> {
    constructor(axios: AxiosWithFilesInstance, config: IConfig) {
        super(axios, config)
    }

    getAttachments(so?): Promise<Array<EntityAttachment>> // GET {api}/attachments
    addAttachment(itemId, file: Blob): Promise<EntityAttachment> // POST {api}/{id}/files

    override insert(item) {
        return insertWithAttachments(this.config.api, item, () => super.insert(item))
    }
    override update(item) {
        return updateWithAttachments(this.config.api, item, () => super.update(item))
    }
}
```

`prepareItem` filters out soft-deleted attachments (and other owned children) before save — see
[services.md](services.md#entityservicebaset) for `prepareItem` / `processItem`. The full method bodies,
imports, and the `AxiosWithFilesInstance` registration in `setup.ts` are in
[../ai/entities.advanced.example.md §4](../ai/entities.advanced.example.md) (service) and §13 (plugin).

## Upload / download UI — file fields

In the form, a dedicated **files tab** binds the host's `attachments` array to the shared
`EntityAttachments` overview (imported from `entity-attachments`):

```html
<EntityAttachments v-model="item.attachments" :readonly="readonly" />
```

That component owns the add/remove/preview interactions; you do not hand-roll the file `<input>`. Wire it
into a tab alongside the main form — the complete three-tab `Form.vue` (main / files / interventions) is in
[../ai/entities.advanced.example.md §5](../ai/entities.advanced.example.md).

## Download URLs

Downloads go through the file-aware axios from `vue/http`, not a bare `<a href>`: `AxiosWithFilesInstance`
exposes `getFile(url, method?, filename?, type?)` (returns a `Blob`) and `upload(url, files, options?)`.
Resolve the instance with `useAxios()` and build the URL from `config.api` (e.g. `{api}/{id}/files`).
Exact signatures: [../ai/entities.signatures.md §10](../ai/entities.signatures.md#10-wiring-ioc--http).

## When you need it

Only complex entities that own files. The simple/standard slices (see [../ai/entities.examples.md](../ai/entities.examples.md))
have none of the above — no file fields, the plain `AxiosInstance`, and the default `insert`/`update`. Reach
for the attachments variant only when the entity actually carries files, and keep everything else identical
to those slices.

## Overview

1. [Abstractions](abstractions.md)
2. [Services](services.md)
3. [Config](config.md)
4. [Views](views.md)
5. [Built-in features](built-in-features.md)
6. [Attachments](attachments.md)
7. [Checklist](checklist.md)
