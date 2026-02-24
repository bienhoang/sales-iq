# Output Convention — Workspace Persistence

All skills that produce deliverables (proposals, emails, ad copy, reports, etc.) must auto-save output to the project's `workspace/` directory.

---

## Project Detection

Find the project root by locating `.sales-iq.json`:

1. Check the current working directory for `.sales-iq.json`
2. If not found, check each parent directory until the filesystem root
3. The directory containing `.sales-iq.json` is the **project root**
4. If no `.sales-iq.json` is found anywhere, display output normally and append:
   > Output not saved — run `sales-iq init` to enable workspace persistence.

---

## Save Protocol

After generating any deliverable:

1. Find the project root (see above)
2. Determine the target path: `{project-root}/workspace/{output_dir}/`
3. Create the directory if it doesn't exist (equivalent to `mkdir -p`)
4. Generate the filename: `{descriptor}-{YYYY-MM-DD}.md`
5. Write the full deliverable content to the file
6. Display the deliverable in the conversation as usual
7. Print at the end: `Saved to: workspace/{output_dir}/{filename}`

---

## File Naming

**Format**: `{descriptor}-{YYYY-MM-DD}.md`

The **descriptor** is derived from context — account name, campaign name, topic, etc. Use kebab-case, keep it under 50 characters.

Examples:
- `acme-corp-proposal-2026-02-24.md`
- `spring-launch-email-sequence-2026-02-24.md`
- `competitor-hubspot-analysis-2026-02-24.md`
- `q1-pipeline-report-2026-02-24.md`

If the same descriptor + date already exists, append a counter: `-2`, `-3`, etc.

---

## Directory Mapping

Each skill declares its `output_dir`. The full mapping:

| output_dir | Workspace Path | Content Types |
|:-----------|:---------------|:-------------|
| `proposals` | `workspace/proposals/` | Business proposals, pricing quotes, SOWs |
| `emails` | `workspace/emails/` | Email campaigns, drip sequences, follow-ups |
| `outreach` | `workspace/outreach/` | Cold email sequences, LinkedIn sequences |
| `ad-copy` | `workspace/ad-copy/` | Meta, Google, LinkedIn ad copy sets |
| `content` | `workspace/content/` | SEO articles, repurposed content pieces |
| `social` | `workspace/social/` | Social posts, content calendars, community content |
| `intel` | `workspace/intel/` | Competitor analysis, lead scorecards |
| `reports` | `workspace/reports/` | Pipeline reports, marketing metrics reports |
| `strategy` | `workspace/strategy/` | Brand strategy docs, consulting frameworks |
| `sales-prep` | `workspace/sales-prep/` | Demo prep, objection playbooks, account plans |
| `research` | `workspace/research/` | Research reports, brainstorm outputs |

---

## Important Notes

- **On-demand creation**: Directories are created only when a skill first writes to them. Do not pre-create empty directories.
- **Existing references/ saves**: Skills that save internal reference data to `references/` (brand-strategy, account-strategy) should continue doing so. Workspace saves are for user-facing deliverables.
- **JSON outputs**: MCP tools that produce structured data (e.g., content calendar) save as `.json` instead of `.md`.
- **No duplication**: Save once to workspace. Don't save the same content to both workspace and another location (except the `references/` pattern above).
