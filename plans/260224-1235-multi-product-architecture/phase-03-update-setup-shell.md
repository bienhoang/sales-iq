# Phase 3: Update Setup Shell Script

## Context
- Parent: [plan.md](./plan.md)
- Depends on: [Phase 1](./phase-01-refactor-setup-silent-install.md), [Phase 2](./phase-02-new-init-command.md)

## Overview
- **Priority**: P2
- **Effort**: 20m
- **Status**: Complete
- **Description**: Update setup.sh to reflect new 2-phase flow. Remove brand delegation, add init guidance.

## Key Insights
- setup.sh handles: OS detect, Node.js install, GitHub PAT, token validation, then delegates to CLI
- Currently ends with `npx @bienhoang/sales-iq@latest setup` which was interactive
- Now setup is silent, so script flow is simpler
- Must guide user to run `sales-iq init` afterward

## Related Code Files

**Modify:**
- `setup.sh` — update step 5 and final message

## Implementation Steps

1. **Update step 5 comment**: "Run silent install" instead of "Run interactive wizard"

2. **Update final success message**:
   ```bash
   echo ""
   ok "Installation complete!"
   echo ""
   info "Create your first project:"
   echo ""
   echo -e "    ${CYAN}sales-iq init${NC}"
   echo ""
   info "This will set up a project directory for your product/company."
   echo ""
   ```

3. **Remove the stdin redirect**: Current line has `< /dev/tty` for interactive prompts — no longer needed since setup is silent:
   ```bash
   # Before
   npx @bienhoang/sales-iq@latest setup < /dev/tty
   # After
   npx @bienhoang/sales-iq@latest setup
   ```

## Todo
- [ ] Update step 5 comment
- [ ] Remove `< /dev/tty` from npx call
- [ ] Update final success message to guide toward `sales-iq init`
- [ ] Test: `bash setup.sh` runs without prompts after PAT setup

## Success Criteria
- setup.sh completes with zero brand-related prompts
- Final message guides user to `sales-iq init`
- PAT setup flow unchanged (still interactive — that's fine)

## Next Steps
- Phase 4: Update doctor + configure
