---
name: Generated client DOM typings
description: TypeScript compatibility for generated Orval fetch helpers in this workspace
---

Generated request helpers may call `Headers.entries()`, which is typed through `dom.iterable` rather than only `dom`.

**Why:** The generated client can pass codegen but fail the workspace composite typecheck when the extra DOM library is missing.

**How to apply:** When a generated client library uses iterable browser APIs, keep both `dom` and `dom.iterable` in that library's TypeScript `lib` list.