---
title: Electrical Systems and BS 7671
sector: electrical
---

# Electrical Systems — BS 7671 and Project Management

## Overview
The electrical installation on a construction project encompasses LV (low voltage) distribution, power systems, lighting, fire alarm, security, data, and specialist systems. All electrical work in the UK must comply with BS 7671: Requirements for Electrical Installations (IET Wiring Regulations).

## BS 7671 — Key Requirements

### Fundamental Principles
- All electrical installations must be designed, erected, and verified to prevent danger
- Installation must be fit for purpose, safe, and comply with statutory regulations
- An Electrical Installation Certificate (EIC) or Minor Works Certificate is required on completion

### Inspection and Testing Sequence
1. **Visual Inspection** — check correct installation, cable routing, terminations, labels
2. **Continuity of Protective Conductors** — verify all CPC paths are intact
3. **Insulation Resistance (IR) Test** — 500V DC applied, minimum 1 MΩ between conductors
4. **Polarity Test** — verify correct connection of line, neutral, earth
5. **Earth Fault Loop Impedance (EFLI) Test** — verify circuit can clear faults within disconnection time
6. **RCD Testing** — verify trip time meets BS 7671 Table 41.1 (30mA RCD: max 300ms)
7. **Prospective Fault Current** — verify PSCC does not exceed equipment ratings

### Distribution Systems
- **LV (Low Voltage):** 230V single-phase, 400V three-phase
- **LVDB (LV Distribution Board):** Feeds circuits from main incomer through MCBs/MCCBs
- **HV (High Voltage):** Above 1000V AC — requires HV Authorised Persons
- **Transformer:** Steps HV supply (11kV, 33kV) down to 400V LV
- **Switchgear:** ACB (Air Circuit Breaker), MCCB (Moulded Case Circuit Breaker), MCB

## Electrical Commissioning Process

### Stage 1: Pre-Commissioning
- Megger (IR) tests on all cables before connection to equipment
- Verify cable sizing, segregation (Power vs Data vs Fire)
- Check terminations in distribution boards, panels, and isolators
- Verify earthing and bonding

### Stage 2: Energisation
- Only energise under supervision of Qualified Electrician
- Stage-by-stage energisation — feeder cables → distribution boards → sub-circuits
- Verify voltage and phase rotation at each point

### Stage 3: Functional Testing
- Test all circuits under load
- Verify protective device co-ordination
- Fire Alarm System: test every detector, manual call point, sounder
- Emergency Lighting: test 1-hour duration test per BS 5266
- EV Charging: verify OCCP protocol where applicable

### Stage 4: Witnessing and Certification
- Electrical Installation Condition Report (EICR) or new installation EIC
- Witnessed by client or Approved Inspector
- All test results recorded in test schedule

## Cable Management Types
- **Cable Tray:** Ladder or perforated — for heavy power cables
- **Cable Trunking:** Enclosed — for surface wiring, data, control cabling
- **Conduit:** Steel or PVC — concealed wiring, protective
- **Basket Tray:** Open weave — lightweight, good ventilation for IT suites
- **Busbar Trunking:** Pre-manufactured — high-current distribution in plant rooms

## Cable Segregation Rules (BS 7671 / BS EN 50174)
- Power cables and data/comms cables must be segregated
- Minimum 50mm separation between power and Category 6 data cables
- Fire cables must be on dedicated containment (red tray/conduit)
- Circuit Integrity (CI) cables on separate CI trunking

## Key Electrical Standards
- **BS 7671:2018+A2:2022** — IET Wiring Regulations (18th Edition)
- **BS 5266** — Emergency Lighting
- **BS 5839** — Fire Detection and Alarm Systems
- **BS 7346** — Smoke Extract Systems
- **NICEIC / ELECSA** — Approved competent person schemes
- **IEC 61439** — Low-voltage switchgear and controlgear assemblies
