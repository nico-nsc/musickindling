# MusicKindling — Roadmap

## Progress

- [x] Setup — Vite + React + TypeScript + Tailwind + Tonal.js + react-i18next
- [x] GitHub Pages deployment — automated via GitHub Actions on every push to main
- [x] Step 1 — Foundation: tonality selector + chromatic template
- [x] Step 2 — Global parameters: enharmonic display, interval nomenclature, instrument
  Settings panel (⚙ modal), localStorage persistence for all global parameters
- [ ] Step 3 — Minor scale variants (harmonic + melodic)
- [ ] Step 4 — Relative major/minor
- [ ] Step 5 — Circle of fifths neighbours
- [ ] Step 6 — Secondary dominants
- [ ] Step 7 — Harmonic proximity
- [ ] Step 8 — Scale reference
- [ ] Step 9 — Chord diagrams (hover popup)

---

## Step 1 — Foundation

### Tonality selector
- Tonic: C D E F G A B + alterations
- Mode: major / natural minor (display "natural minor" explicitly — educational choice)
- Results update immediately on selection

### Chromatic template (3 fixed rows, always visible)
- Row 1: chromatic intervals
- Row 2: scale degrees (empty = note outside scale = greyed out)
- Row 3: note names following circle of fifths rules

All steps share the same 12-note chromatic template for visual consistency.
Empty cells = non-degree positions
Greyed cells = notes outside the scale

Example C major:
```
Intervals : 1     b2     2    b3     3    4    b5     5    b6     6    b7     7    8
Degrees   : I     ""     ii   ""     iii  IV   ""     V    ""     vi   ""     vii° ""
Notes     : C     C#/Db  D    D#/Eb  E    F    F#/Gb  G    G#/Ab  A    A#/Bb  B    C
```

Note naming rules (circle of fifths):
- Sharp side (G D A E B F# C#) → name in #
- Flat side (F Bb Eb Ab Db Gb) → name in b
- C → no alteration
- F#/Gb → display both, user chooses

Degree structure is mode-dependent:
- Major: I ii iii IV V vi vii°
- Natural minor: i ii° III iv v VI VII

---

## Step 2 — Global parameters

Enharmonic display (applies only to notes outside the scale):
- Both (C#/Db) ← default
- Sharp only (C#)
- Flat only (Db)

Interval nomenclature (stored in `src/data/intervals.ts` — edit there, never in component code):

Reference row (13 columns, root to octave):
```
C    C#/Db  D    D#/Eb  E    F    F#/Gb  G    G#/Ab  A    A#/Bb  B    C
```

Option 1 — Guitar / Pop / Jazz (Anglo-saxon shorthand) ← default
```
1    b2     2    b3     3    4    b5     5    b6     6    b7     7    8
```

Option 2 — Academic International (conservatory standard)
```
P1   m2     M2   m3     M3   P4   d5/A4  P5   m6     M6   m7     M7   P8
```
P = Perfect, m = minor, M = major, d = diminished, A = augmented

Option 3 — French Solfège (French pedagogical convention)
```
1    2m     2M   3m     3M   4j   5dim   5j   6m     6M   7m     7M   8v
```
j = juste, m = mineur, M = majeur, dim = diminué

Instrument (affects chord diagrams):
- Guitar ← default
- Piano

---

## Step 3 — Minor scale variants

Toggle: "Show minor variants" (on by default, global)
Displayed only if minor mode is selected anywhere in the tool

- [ ] Harmonic minor — additional row, yellow = present in harmonic, absent from natural minor
- [ ] Melodic minor ascending — same display logic, row below harmonic minor

---

## Step 4 — Relative

Toggle on/off (on by default)

- [ ] Relative major/minor — same key signature, different tonal center, full row display

---

## Step 5 — Circle of fifths neighbours

Toggle on/off (on by default), same mode as home tonality

- [ ] Left and right neighbours — yellow = note present in neighbour, absent from main tonality
- [ ] Natural transition chords toward neighbours

---

## Step 6 — Secondary dominants

Toggle on/off (on by default)
One additional row aligned on the 12-note chromatic template

Color coding:
- White = chord present in the reference scale
- Yellow = chord outside the reference scale
- Red = V/ii° (avoid — resolves to a diminished chord)

Optional toggle: "show 7th" (default off)

---

## Step 7 — Harmonic proximity

Two independent toggles: "Show major proximity" / "Show minor proximity"
Standalone block, separate from main display

- Blue = degree shared with home tonality
- Score per row (ex: 4/7)
- Sorted by proximity score descending

---

## Step 8 — Scale reference

Toggle: "Show scale reference" (off by default)
Standalone block, same tonic as user selection

Grouped by family:
- Major & Modes: Major, Dorian, Phrygian, Lydian, Mixolydian, Locrian
- Minor: Natural minor, Harmonic minor, Melodic minor (ascending only)
- Pentatonic & Blues: Major pentatonic, Minor pentatonic, Blues
- Exotic: Phrygian dominant, Double harmonic, Hirajoshi, Whole tone

Notes only in v1 — no degrees or chords for modes.
Extensible: adding a new scale = adding a data entry.

---

## Step 9 — Chord diagrams

Global parameter: instrument (Guitar ← default / Piano)
Popup on hover on any chord anywhere in the tool

- Guitar + Piano: @tombatossals/react-chords
  → replaces VexChords (vanilla JS, poor React integration, low maintenance)
  → to validate at implementation; fallback to VexChords + Tonal.js if needed

---

## Step 10 — GitHub Pages deployment

---

## Ideas to explore

- Tonality selector as a circle of fifths visual (instead of dropdown)

---

## Implementation notes

- No minor qualifier = natural minor by default
- Architecture must allow adding new concepts without major refactoring
- Some steps are conditional (ex: minor variants only if minor mode selected)
- Responsive design mandatory from v1 — target: usable on iPhone Safari, PWA
  Primary target: iPhone 15 / 390px CSS width (covers 80%+ of current smartphones)
  iPhone SE (375px) is a bonus, not a constraint
- Session persistence: toggles saved via localStorage
- i18n: FR/EN from v1 via react-i18next, extensible to other languages

### Layout

Mobile:
- Single column, full width
- Chromatic grid scrolls horizontally (13 columns ~730px, narrower than phone screen)
- Toggle panel: floating button bottom-right → opens a bottom drawer

Desktop (screen wide enough to display the full grid without scrolling):
- Content centered in the available space (max-width + auto margins)
- Sidebar on the left (~220px) with all section toggles, always visible
- Main content fills the rest

Breakpoint logic: sidebar appears + content centers at md (768px) or lg (1024px) — to decide when sidebar is built (Step 3)
