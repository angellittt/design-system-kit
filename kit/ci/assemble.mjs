// design-system-kit 0.8.0 · the kit's own CI: lay the kit out as an app has it
//
// app/ is rebuilt every run (and gitignored): the stock components, with the
// kit's extension files over them as Setup installs them; the stock lib and
// hooks; the locale module; the test setup; and the kit's scripts with their
// tests and the bundle fixture. Tests, typecheck and the fixture then run
// against app/ exactly as they would in a client repo.
import { cpSync, rmSync, mkdirSync, readdirSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const HERE = dirname(fileURLToPath(import.meta.url))
const KIT = join(HERE, "../code/shadcn")
const APP = join(HERE, "app")

rmSync(APP, { recursive: true, force: true })
const copy = (from, to) => { mkdirSync(dirname(join(APP, to)), { recursive: true }); cpSync(join(KIT, from), join(APP, to), { recursive: true }) }

copy("stock/ui", "src/components/ui")
for (const f of readdirSync(join(KIT, "kit/ui"))) copy(`kit/ui/${f}`, `src/components/ui/${f}`)
copy("stock/hooks", "src/hooks")
copy("stock/lib", "src/lib")
copy("wiring/locale.ts", "src/lib/locale.ts")
copy("wiring/theme-provider.tsx", "src/components/theme-provider.tsx")
copy("harness/test/setup.ts", "src/test/setup.ts")
copy("scripts", "scripts")
copy("harness/scripts-tests", "scripts/__tests__")
copy("harness/fixture", "scripts/__fixtures__")
copy("wiring/ds-drift.test.mjs", "scripts/ds-drift.test.mjs")
console.log(`assembled ${APP}`)
