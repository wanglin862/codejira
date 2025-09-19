# JIRA ITIL Plugin Design Guidelines

## Design Approach: Enterprise Utility System
**Selected Approach:** Design System (Fluent Design) - optimized for data-heavy, enterprise applications with complex information hierarchies.

**Justification:** This JIRA plugin handles critical IT infrastructure data where clarity, efficiency, and professional appearance are paramount. Users need to quickly identify VM/Server/Location relationships and trace incident patterns without visual distractions.

## Core Design Elements

### A. Color Palette
**Primary Colors:**
- Primary Blue: 210 85% 45% (professional trust)
- Secondary Gray: 220 10% 25% (neutral foundation)

**Status Colors:**
- Critical Red: 0 75% 55%
- Warning Orange: 35 85% 60%
- Success Green: 140 70% 45%
- Info Blue: 200 80% 50%

**Dark Mode:**
- Background: 220 15% 8%
- Surface: 220 10% 12%
- Text Primary: 0 0% 95%

### B. Typography
**Font Stack:** Segoe UI, system-ui, sans-serif
- Headers: 600 weight, sizes 24px/20px/16px
- Body: 400 weight, 14px
- Code/IDs: Consolas, monospace, 13px
- Labels: 500 weight, 12px uppercase

### C. Layout System
**Spacing Units:** Tailwind 2, 4, 6, 8 units consistently
- Component padding: p-4
- Section margins: m-6
- Element gaps: gap-2, gap-4
- Card spacing: p-6

### D. Component Library

**Navigation:**
- Sidebar with collapsible sections for CI Categories
- Breadcrumb trail showing: Ticket → CI → Related Items
- Tab navigation for Incident/Problem/Change views

**Data Display:**
- **CI Cards:** Clean white/dark cards with status indicators, minimal shadows
- **Relationship Tree:** Expandable hierarchy showing VM → Server → Location
- **Status Badges:** Rounded pills with appropriate status colors
- **Data Tables:** Sortable columns, zebra striping, compact row height
- **Timeline View:** Vertical timeline for related incidents/changes

**Forms:**
- Input fields with subtle borders, focus states in primary blue
- Dropdown selectors for CI types and locations
- Search bars with autocomplete for quick CI lookup

**Interactive Elements:**
- Buttons: Primary filled, secondary outline, minimal border radius
- Links: Underlined on hover, primary blue color
- Icons: Heroicons library, 16px/20px sizes

**Information Architecture:**
- **Main Panel:** CI relationship visualization
- **Side Panel:** Related tickets list with quick actions
- **Details Modal:** Expanded CI information overlay
- **Alert Bar:** System status and notifications at top

### E. Specialized Features

**CI Topology Map:**
- Node-link diagram showing infrastructure relationships
- Color-coded nodes by CI type (Server=blue, VM=green, Network=orange)
- Interactive zoom and pan capabilities
- Status overlays showing current incidents

**Quick Actions Toolbar:**
- Create related ticket buttons
- Export topology data
- Refresh CI status
- SLA escalation controls

**Dashboard Widgets:**
- Critical incidents count
- SLA breach warnings
- Recent changes summary
- Top affected CIs

This design prioritizes information density and workflow efficiency while maintaining enterprise-grade visual polish. The interface supports rapid decision-making during incident management scenarios through clear visual hierarchies and intuitive navigation patterns.