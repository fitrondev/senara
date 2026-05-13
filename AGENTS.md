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
- Prisma + Better Auth setup
- Turbo monorepo structure (apps/, packages/)
- TypeScript path aliases (@/, @senara/\*)

Use for: Feature implementation, component debugging, database schema updates, API routing.

## Digital Invitation Website Feature

### Overview

Senara will be a digital invitation platform with 4 user roles and two template systems (own templates and reseller templates). Editors create invitations based on templates and can design new templates for reuse.

### User Roles & Permissions

| Role | Create Template | Create Invitation (Own) | Create Invitation (Reseller) | Input Invitation Data | Manage Users | View Analytics |
|------|-----------------|------------------------|-----------------------------|----------------------|--------------|-----------------||
| Superadmin | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Admin | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Editor | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| User | ❌ | ✅ | ❌ | ✅ | ❌ | ✅ |

### Template Type 1: Own Templates (Template Sendiri)

#### Creation & Design

**Who can create:** Superadmin & Editor
**Best approach for implementation:**

- **Headless Template System:** Store template structure as JSON in database
- **Component-based:** Templates composed of reusable UI blocks (header, details, RSVP form, etc.)
- **Visual builder or code:** Provide both:
  - **Visual editor:** Drag-and-drop UI builder for non-technical users (Superadmin/Editors)
  - **Code option:** JSON schema editor for advanced customization

**Example template structure:**

```json
{
  "id": "template-001",
  "name": "Elegant Wedding",
  "author": "editor-1",
  "blocks": [
    {
      "type": "header",
      "backgroundImage": "url-or-data",
      "title": "{groom_name} & {bride_name}",
      "subtitle": "Request the honour of your presence"
    },
    {
      "type": "details",
      "fields": ["date", "time", "venue", "dress_code"]
    },
    {
      "type": "rsvp_form",
      "fields": ["name", "email", "guests_count", "dietary_restrictions"]
    }
  ]
}
```

#### Data Binding & Dynamic Content

**How templates consume user data:**

- Use template variables (e.g., `{event_title}`, `{guest_name}`) that get replaced at render time
- Create a "Invitation Instance" when user creates invitation from template
- Invitation Instance = Template + User-provided data

**Data storage approach:**

```
Template (stored in DB) → Invitation Instance (user fills in data) → Published Invitation
```

**Database design:**

- `templates` table: Store template JSON, metadata, version history
- `invitations` table: Store invitation instance with template_id + filled data (JSON blob or separate fields)
- `template_versions` table: Track template changes for audit trail

#### Editing Templates

**Edit modes:**

1. **Edit template itself:** Modify template structure (visual builder or JSON editor)
2. **Create new version:** Template versioning to prevent breaking existing invitations
3. **Lock published templates:** Allow editing only unpublished templates

**Edit flow:**

```
Editor → Edit UI (drag-drop or JSON) → Preview → Save version → Publish/Draft
```

### Template Type 2: Reseller Templates

#### Architecture

**What are they:**

- Link-based external templates hosted on reseller's website
- Senara only stores the reseller link in database
- Templates are managed by Editors & Superadmin who create invitations for Users
- Users can only input data, cannot directly create invitations from reseller templates

**Who can do what:**

- **Editor/Superadmin:** Create invitations from reseller templates (build on reseller's website)
- **User:** Input data into invitation form (name, event details, etc.)
- **User cannot:** Directly access or create invitations from reseller templates

**How it works:**

```
Editor/Superadmin → Select reseller template → Build at reseller's website
→ Create invitation instance → Share with User
→ User inputs their data (name, contact, guest count, etc.)
→ Invitation generated & published
```

**Data storage:**

- `reseller_templates` table: Store reseller_id, template_name, external_url, reseller_info
- `invitations` table: Store invitation instance with editor_id, reseller_template_id, user_id, filled_data
- No template design needed in Senara; only link management

**Invitation creation flow for Reseller Templates:**

```
1. Editor selects reseller template from Senara
2. Editor is redirected to reseller's website to build invitation
3. Reseller provides invitation builder/form
4. Editor creates invitation and gets URL/ID from reseller
5. Editor saves invitation record in Senara (linked to specific User)
6. User receives invitation instance
7. User fills in required data (name, email, number of guests, dietary restrictions, etc.)
8. User submits → Invitation is published
```

#### Integration approach:

- Reseller provides webhook or API for Senara to validate template existence
- Reseller provides API for creating invitation instances and sharing access codes
- Senara can optionally display preview/thumbnail from reseller
- Track usage metrics: how many invitations created per reseller template
- Access control: Users can only see/edit invitations created for them by Editors

---

### Implementation Roadmap

#### Phase 1: Core Template System

- [ ] Database schema for templates & invitations
- [ ] Visual template editor component (shadcn/ui based)
- [ ] Basic variable binding system
- [ ] Invitation rendering engine

#### Phase 2: Template Features

- [ ] Template versioning & history
- [ ] Template publishing (draft/live states)
- [ ] Template duplication & sharing within roles
- [ ] Preview mode

#### Phase 3: Reseller Integration

- [ ] Reseller template linking UI
- [ ] External URL validation
- [ ] Analytics tracking for reseller usage

---

### Suggested Tech Stack for Implementation

- **Template storage:** Prisma + PostgreSQL (JSON fields for flexibility)
- **Visual builder:** React + shadcn/ui + React DnD (drag-and-drop)
- **Template rendering:** React Server Components or dynamic component system
- **Preview:** Iframe sandboxing for security
- **Variables:** Template literal or Handlebars-style syntax parser

---

## Notes

- The workspace structure uses pnpm workspaces
- Main app: `apps/web` (Next.js)
- UI package: `packages/ui` (shadcn/ui components)
- API package: `packages/api` (tRPC/ORPC)
- Database: `packages/db` (Prisma)
