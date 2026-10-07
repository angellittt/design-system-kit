# Skills

The four design-system skills will live here, one folder each with a `SKILL.md`:

| Skill | What it does |
|---|---|
| `setup` | Creates a client's design system from `kit/template/`, generates the Figma library, and opens a PR that applies `kit/code/<profile>/` to the client repo |
| `sync` | Pulls tokens into `.ttt/tokens.json` and regenerates code (PR); publishes components back to the design system |
| `components` | Checks a request against stock and the kit catalog, drafts a proposal, records acceptance |
| `drift-audit` | Compares the client repo with its design system and the kit version it records |

None are written yet. Skills read the rules from `kit/` at the version in this plugin's manifest; they never copy the rules into a design system.
