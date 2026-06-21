# Regira JsLib TreeList — AI Agent Instructions

A generic, framework-agnostic hierarchical data structure (`regira_modules/treelist`): a `TreeList<T>`
holding `TreeNode<T>` items, with helpers to navigate ancestors, offspring and roots. It is plain
TypeScript (no Vue, no axios). The [entities tree](../../vue/entities/ai/entities.instructions.md)
composable and `buildNavigationTree` are both built on it.

> **Never guess** a signature — verify in [treelist.signatures.md](treelist.signatures.md).

## Import

```ts
import { TreeList, TreeNode, type IFindParents } from "regira_modules/treelist"
```

`TreeList` is also the default export. There are no granular subpaths — everything is re-exported from
the package root above.

## Building a tree

`TreeList<T>` **extends `Array<TreeNode<T>>`** — it is a flat array of every node, plus a separate
`roots` array for the top-level nodes. Build one of two ways:

- **From a flat list with `init(values, findParents)`.** `findParents(value, candidates)` returns the
  parent value(s) of `value` from the full list; `init` wires up the hierarchy and returns `this`.
  Default `findParents` returns `[]`, so everything becomes a root. This is how `buildNavigationTree`
  works — it matches `candidates.filter((x) => x.id == value.parentId)`.

  ```ts
  const tree = new TreeList<Item>().init(items, (v, all) => all.filter((x) => x.id === v.parentId))
  ```

- **Imperatively.** Pass a flat `Array<T>` to the constructor (each becomes a root), or call
  `addValue(value, parentNode?)` / `addValues(values, parentNode?)`. Omit `parentNode` (or pass `null`)
  to add roots; pass a node to add children under it.

## Navigating

From the `TreeList` (all default to operating on the whole tree when called with no argument):

- `getNodes(value | values?)` — nodes for the given value(s); no arg → every node.
- `getRoots(nodes?)` — root ancestor of each node (distinct); no arg → `roots`.
- `getAncestors(nodes?)` — all parents-of-parents (distinct).
- `getOffspring(nodes?)` — all descendants.
- `getValues(nodes?)` — the underlying `T` values.

From a `TreeNode<T>`: `value`, `parent`, `level` (0 for roots), `children` (read-only getters);
`add(value)`, `update(value)`, `remove(node)`, and the delegating `getAncestors()` / `getOffspring()` /
`getRoot()`. A node is iterable — `for (const child of node)` yields its direct children.

## Mutating

- `remove(node)` — removes the node **and all its descendants** from the tree and from its parent's
  children (or from `roots`); returns whether the node was found.
- `move(node, parent)` — detaches `node` from its current parent/roots and re-parents it under `parent`
  (pass a falsy `parent` to make it a root again). Used by the entities tree drag-and-drop.

## Gotchas

- **`level` is not recomputed on `move`.** `_level` is set at construction (`parent.level + 1`, or 0 for
  roots) and is not updated when a node is moved, so a moved node's `level` can be stale.
- **Array methods return a plain `Array`, not a `TreeList`.** `TreeList` overrides `Symbol.species` to
  `Array`, so `tree.filter(...)`, `tree.map(...)`, etc. yield a plain `Array<TreeNode<T>>`.
- **`getNodes` matches by value equality.** It filters on `node.value === input`, so it relies on
  reference/primitive equality of the stored values, not identity of the nodes.

## See also

- [treelist.examples.md](treelist.examples.md) — copy-paste basics
- [treelist.signatures.md](treelist.signatures.md) — verbatim signatures
- [Entities](../../vue/entities/ai/entities.instructions.md) — the entities tree composable and navigation consume this module
