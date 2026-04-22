---
title: Programme Management — Critical Path and EVM
sector: construction
---

# Programme Management — Critical Path Method and Earned Value

## Critical Path Method (CPM)

### What is the Critical Path?
The critical path is the longest sequence of dependent activities that determines the minimum project duration. Any delay to a critical path activity delays the project end date.

### CPM Process
1. **Define Activities** — from WBS, list all discrete activities
2. **Sequence Activities** — define logical dependencies (FS, SS, FF, SF)
3. **Estimate Durations** — use historical data, expert judgement
4. **Network Diagram** — Precedence Diagramming Method (PDM)
5. **Forward Pass** — calculate Early Start (ES) and Early Finish (EF)
6. **Backward Pass** — calculate Late Start (LS) and Late Finish (LF)
7. **Float Calculation** — Total Float = LS - ES = LF - EF
8. **Critical Path** — activities with zero total float

### Dependency Types
- **FS (Finish to Start):** B cannot start until A finishes — most common
- **SS (Start to Start):** B cannot start until A starts
- **FF (Finish to Finish):** B cannot finish until A finishes
- **SF (Start to Finish):** B cannot finish until A starts — rare

### Float Types
- **Total Float:** Time an activity can be delayed without delaying project end
- **Free Float:** Time an activity can be delayed without delaying successor
- **Negative Float:** Activity is already late — requires compression or acceleration

## Programme Tools
- **Primavera P6:** Industry standard for large complex construction projects
- **Microsoft Project:** Common for medium projects, less sophisticated
- **Asta Powerproject:** Popular in UK construction
- **Smartsheet:** Cloud-based, good for collaborative simple programmes

## Programme Updates
- Update programme minimum monthly (weekly on fast-track projects)
- Capture actual start, actual finish, remaining duration for each activity
- Perform Time Impact Analysis (TIA) for compensation events
- Issue updated programme to client with narrative explaining changes

## Acceleration Techniques (when behind programme)
1. **Crashing** — add resources to critical path activities (increases cost)
2. **Fast-tracking** — overlap activities that were originally sequential (increases risk)
3. **Overtime** — extend working hours or add weekend shifts
4. **Scope reduction** — agree to defer non-critical elements
5. **Resource reallocation** — move best resources to critical activities

## Extension of Time (EOT)
- EOT is a contractor's right to additional time when delays are caused by client risk events
- Must be claimed promptly per contract requirements
- Supported by:
  - Contemporaneous programme records
  - Delay analysis (impacted as-planned or as-built comparison)
  - Cause-and-effect linking
- **SCL Delay and Disruption Protocol** — industry guidance for EoT claims in UK

## Earned Value Management (EVM)

### Setup
- Develop a project budget baseline (Performance Measurement Baseline — PMB)
- Assign budget to each WBS element
- Define earning rules: 0/100, 50/50, % complete, milestones

### Key Calculations
| Metric | Formula | Meaning |
|---|---|---|
| PV | BCWS | Planned budget for work scheduled |
| EV | BCWP | Planned budget for work performed |
| AC | ACWP | Actual cost of work performed |
| CV | EV - AC | Cost variance (positive = under budget) |
| SV | EV - PV | Schedule variance (positive = ahead) |
| CPI | EV / AC | Cost efficiency (>1 = under budget) |
| SPI | EV / PV | Schedule efficiency (>1 = ahead) |
| EAC | BAC / CPI | Best-case estimate at completion |
| TCPI | (BAC-EV)/(BAC-AC) | Efficiency needed to complete on budget |

### Traffic Light Reporting
- CPI > 1.0 and SPI > 1.0: 🟢 Green — on or under budget, ahead of schedule
- CPI 0.9–1.0 or SPI 0.9–1.0: 🟡 Amber — minor issues, monitor
- CPI < 0.9 or SPI < 0.9: 🔴 Red — escalate, corrective action required
