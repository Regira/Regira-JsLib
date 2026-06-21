# Regira JsLib Debug — Examples

Verify signatures in [debug.signatures.md](debug.signatures.md). Imports use the demo alias
`@/regira_modules`; drop `@/` for a plain npm install.

## Install the plugin (startup)

Install after vue-router (the `$isDebug` getter reads the current route) and after the `Icon`
component is resolvable. Pass `isDebug` from your loaded config:

```ts
import { plugin as debugPlugin } from "@/regira_modules/vue/debug"

app.use(debugPlugin, { isDebug: config.isDebug })   // isDebug defaults to false
```

This registers `<Debug>` globally and installs the `$isDebug` / `$setDebug` global properties.

## A debug bar that only shows in debug mode

`<Debug>` is registered globally, so no import is needed. With no `modelValue` it just acts as a
slot for debug-only chrome (it renders nothing unless `$isDebug` is true):

```vue
<template>
  <section>
    <Feedback :feedback="$feedback" />
    <Debug />
  </section>
</template>
```

## Dump a value in a component

Pass any object/array as `modelValue`; it is pretty-printed as JSON when debug is on:

```vue
<template>
  <section>
    <List :items="items" />
    <Debug :modelValue="items" />
  </section>
</template>
```

Combine several things into one object to inspect them together:

```vue
<template>
  <Debug
    :modelValue="{
      searchObject,
      pagingInfo,
      items,
    }"
  />
</template>
```

You can also import the component explicitly instead of relying on global registration:

```vue
<script setup lang="ts">
import { Debug } from "@/regira_modules/vue/debug"
</script>
```

## Gate your own debug-only UI

Use the `$isDebug` getter to show extra markup, and `$setDebug(false)` to switch debug output off:

```vue
<template>
  <div v-if="$isDebug" class="debug">
    <span>{{ $router.currentRoute.value.name }}</span>
    <IconButton icon="close" @click="$setDebug(false)" />
  </div>
</template>
```

To force debug on without rebuilding, append `?debug=1` to the URL — it overrides the `isDebug`
install option (any other `?debug` value forces it off).

## See also

- [debug.instructions.md](debug.instructions.md) · [debug.signatures.md](debug.signatures.md)
