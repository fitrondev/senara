# Senara Project Agents

Custom agents for the Senara project development workflow.

## Agents

### Explore

Fast read-only codebase exploration and Q&A for the Senara monorepo.

- **Use for**: Quick discovery of monorepo structure, file locations, component APIs, and configuration
- **Thoroughness**: Specify `quick`, `medium`, or `thorough` for the depth of analysis

Example: "Explore the structure of the UI package components"

### Senara-Specific Developer

Specialized agent for Senara project development with knowledge of:

- Next.js 16 + React 19 patterns
- Tailwind CSS v4 + shadcn/ui components
- Prisma + Clerk setup
- Turbo monorepo structure (apps/, packages/)
- TypeScript path aliases (@/, @senara/\*)

Use for: Feature implementation, component debugging, database schema updates, API routing.
