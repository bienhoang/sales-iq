# Internal Scouting with Explore Subagents

Use Explore subagents when SCALE >= 6 or external tools unavailable.

## How It Works

Spawn multiple `Explore` subagents via `Task` tool to search the project in parallel.

## Task Tool Configuration

```
subagent_type: "Explore"
```

## Prompt Template

```
Quickly scout {DIRECTORY} for documents related to: {USER_PROMPT}

Instructions:
- Search for relevant documents matching the task
- Use Glob/Grep for document/resource discovery
- List documents with brief descriptions
- Timeout: 3 minutes max
- Skip if timeout reached

Report format:
## Found Documents
- `path/document.md` - description

## Patterns
- Key patterns observed
```

## Spawning Strategy

### Directory Division
Split project logically:
- `marketing/` - Marketing skills and templates
- `sales/` - Sales skills and playbooks
- `strategy/` - Strategy frameworks
- `shared/` - Cross-domain materials (brand context, ICP profiles)
- `siq-*/` - Utility skills

### Parallel Execution
- Spawn all agents in single `Task` tool call
- Each agent gets distinct directory scope
- No overlap between agents

## Example

User prompt: "Find competitor analysis materials"

```
Agent 1: Scout marketing/ for competitor analysis templates and references
Agent 2: Scout strategy/ for competitive positioning frameworks
Agent 3: Scout sales/ for battlecards and competitive objection handling
Agent 4: Scout shared/ for ICP profiles and market context documents
Agent 5: Scout .ref/ for imported reference materials on competitors
```

## Timeout Handling

- Set 3-minute timeout per agent
- Skip non-responding agents
- Don't restart timed-out agents
- Aggregate available results

## Result Aggregation

Combine results from all agents:
1. Deduplicate document paths
2. Merge descriptions
3. Note any gaps/timeouts
4. List unresolved questions
