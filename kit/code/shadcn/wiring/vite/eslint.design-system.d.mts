// design-system-kit 0.5.1 · profile shadcn · wiring (Vite): ESLint block types
//
// Types for eslint.design-system.mjs, so an app whose flat config is
// TypeScript (eslint.config.ts — TTT's starter) can import the kit's blocks
// without failing its typecheck. Setup copies it beside the .mjs only when the
// app's config is TypeScript. Proven on the Districtly run.
import type { Linter } from "eslint"

declare const designSystem: Linter.Config[]
export default designSystem
