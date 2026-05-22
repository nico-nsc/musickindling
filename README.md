# MusicKindling

Harmonic composition tool for acoustic guitar composers.
Used during composition sessions — not before.

> The tool sparks the flame, it does not replace the flow.

---

## Philosophy

Two modes:
- **Unblocking** — I'm stuck, what do I have at hand?
- **Exploration** — I want to break my habits, discover unusual options

Speed and readability above all. Zero friction.

---

## Tech stack

| Role | Library |
|---|---|
| Framework | React + TypeScript |
| Build tool | Vite |
| Styling | Tailwind CSS |
| Music theory | Tonal.js |
| Chord diagrams | @tombatossals/react-chords |
| i18n | react-i18next |

---

## Code philosophy

- Readable over clever
- Clear naming, logical file structure
- Wrap all Tonal.js calls in clearly named functions — never call Tonal.js directly in display logic
- In 6 months, any developer should understand the intent without reverse engineering

---

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Deploy

```bash
npm run build
```

Static output in `dist/` — deployed via GitHub Pages.

---

## License

GNU Affero General Public License v3.0 — see [LICENSE](LICENSE)
For commercial use, open an issue on this repository.
