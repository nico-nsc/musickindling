# MusicKindling — Roadmap

## Progress

- [x] Setup
- [x] Step 1 — Foundation
- [x] Step 2 — Global parameters + Settings Panel
- [x] Step 3 — Minor scale variants
- [x] Step 4 — Relative
- [x] Step 5 — Circle of fifths neighbours
- [x] Step 6 — Language toggle + code refactor
- [ ] Step 7 — Secondary dominants
- [ ] Step 8 — Harmonic proximity
- [ ] Step 9 — Scale reference
- [ ] Step 10 — Chord diagrams
- [x] GitHub Pages deployment

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

## Step 2 — Global parameters + Settings Panel

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

Settings Panel:
- ⚙ button in header → centered modal, backdrop click to close
- Reusable `OptionRow<T>` component for all option groups
- localStorage persistence: enharmonicDisplay, intervalNomenclature, selectedInstrument
- selectedTonic and selectedMode are session-only (not persisted)

---

## Step 3 — Minor scale variants ✓

Toggle: "Show minor variants" (on by default, persisted)
Applies ONLY to the main tonality — not to relative or neighbours
Displayed only if minor mode is selected as main tonality

- [x] Harmonic minor — degree row + note row below natural minor
      Yellow = note present in harmonic, absent from natural minor
- [x] Melodic minor ascending — degree row + note row below harmonic
      Same yellow highlight logic

Degree labels defined in `src/data/degrees.ts` — human-editable, never computed.
Degrees per variant:
- Harmonic minor: i ii° III+ iv V VI vii°
- Melodic minor ascending: i ii III+ IV V vi° vii°

### Layout
- Sidebar (desktop, collapsible) + bottom drawer (mobile) for toggles
- Chromatic template uses a 3-column left structure:
  `[block title col] [scale name col] [13 note cells]`
  Block title col shows "Key" / "Minor variants" on the degree row of each block
  Both sticky columns freeze during horizontal scroll
- Block titles toggle in Settings (persisted), animates with transition-[width] / transition-[left]
- `max-w-5xl` on content wrapper (up from max-w-4xl) to accommodate the extra column

---

## Step 4 — Relative ✓

Toggle: "Relative" in sidebar (on by default, persisted)

- [x] Relative major/minor — same key signature, different tonal center
      Full row display (same 12-note template)
      Always displayed in natural minor if relative is minor
      No minor variants shown for the relative

`getRelativeTonic(tonic, mode)` in scaleUtils:
- major → +6M (9 semitones) → natural minor
- natural minor → +3m (3 semitones) → major

Scale name label = "Major" / "Nat. minor" — tonic is implicit from the degree row (i vs I)

---

## Step 5 — Circle of fifths neighbours ✓

One toggle: "Neighbours" in sidebar (on by default, persisted), same mode as home tonality

- [x] Left neighbour (-P4 = -P5 going left on circle) — yellow = note in neighbour, absent from main
- [x] Right neighbour (+P5) — same display logic

`getNeighbourTonics(tonic)` in scaleUtils:
- left → +P4 (5 semitones)
- right → +P5 (7 semitones)

`buildNeighbourRowData(neighbourTonic, mode, mainTonic, enharmonicDisplay)`:
- `isHighlighted` = note in neighbour scale but NOT in main scale → yellow cell
- Labels: ← / → in scale name column

Separator lines: border-b after tonality notes row, after relative notes row, after neighbours (no border within each block)
No transition chords in this step — deferred (see Ideas to explore)

---

## Step 6 — Language toggle + code refactor ✓

- [x] Language toggle FR/EN in Settings panel (persisted in localStorage, no flash on reload)
- [x] Unified `CellData` interface: `isInScale` + `isNoteInMain` + `isChordInMain`
      Yellow dark (`CELL_NOTE_ABSENT`) = note absente de la gamme principale
      Yellow light (`CELL_CHORD_DIFFERS`) = note présente, qualité d'accord différente
- [x] Chord quality arrays in `degrees.ts` (M/m/d/A per degree, human-editable)
- [x] Extract `DegreeRow` and `NotesRow` sub-components in ChromaticTemplate
- [x] `buildDegreeIndexByChroma` helper, `getChromaticNames` helper — remove repetition in builders

---

## Step 7 — Secondary dominants

Toggle on/off (on by default)
One additional row aligned on the 12-note chromatic template

Color coding:
- White = chord present in the reference scale
- Yellow = chord outside the reference scale
- Red = V/ii° (avoid — resolves to a diminished chord)

Optional toggle: "show 7th" (default off)

---

## Step 8 — Harmonic proximity

Two independent toggles: "Show major proximity" / "Show minor proximity"
Standalone block, separate from main display

- Blue = degree shared with home tonality
- Score per row (ex: 4/7)
- Sorted by proximity score descending

---

## Step 9 — Scale reference

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

## Step 10 — Chord diagrams

Global parameter: instrument (Guitar ← default / Piano)
Popup on hover on any chord anywhere in the tool

- Guitar + Piano: @tombatossals/react-chords
  → replaces VexChords (vanilla JS, poor React integration, low maintenance)
  → to validate at implementation; fallback to VexChords + Tonal.js if needed

---

## Step 11 — GitHub Pages deployment

---

## Ideas to explore

- Tonality selector as a circle of fifths visual (instead of dropdown)
- User-configurable block order (drag-and-drop or ↑↓ in sidebar, persisted in localStorage)
- Pivot chord modulation: highlight shared chords between main tonality and its neighbours (needs Steps 6 & 7 first for full context)

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
