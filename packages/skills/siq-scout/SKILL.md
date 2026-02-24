---
name: siq-scout
description: Fast project scouting using parallel Explore subagents. Use for document/resource discovery, task context gathering, quick searches across sales-iq skill directories.
version: 1.0.0
---

# Scout

Fast, token-efficient project scouting using parallel agents to find documents and resources needed for tasks.

## When to Use

- Beginning research on a campaign spanning multiple skill areas
- Looking for existing templates, references, or brand materials
- User mentions needing to "find", "locate", or "search for" documents
- Understanding which skills or playbooks cover a specific topic
- Before building new materials that may already exist in another skill

## Quick Start

1. Analyze user prompt to identify search targets
2. Use a wide range of Grep and Glob patterns to find relevant documents and estimate scale of the project
3. Spawn parallel Explore subagents with divided directories
4. Collect results into concise report

## Workflow

### 1. Analyze Task
- Parse user prompt for search targets
- Identify key directories, patterns, document types
- Determine optimal number of subagents to spawn

### 2. Divide and Conquer
- Split project into logical segments per agent
- Assign each agent specific directories or patterns
- Ensure no overlap, maximize coverage

### 3. Spawn Parallel Agents
Load scouting reference: `references/internal-scouting.md` (Explore subagents)

**Notes:**
- Prompt detailed instructions for each subagent with exact directories or files it should read
- Remember that each subagent has less than 200K tokens of context window
- Amount of subagents to-be-spawned depends on the current system resources available and amount of documents to be scanned
- Each subagent must return a detailed summary report to a main agent

### 4. Collect Results
- Timeout: 3 minutes per agent (skip non-responders)
- Aggregate findings into single report
- List unresolved questions at end

## Report Format

```markdown
# Scout Report

## Relevant Documents
- `path/to/document.md` - Brief description
- ...

## Unresolved Questions
- Any gaps in findings
```

## References

- `references/internal-scouting.md` - Using Explore subagents
