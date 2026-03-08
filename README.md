# Slides

Presentation decks hosted at [slides.rtylermalone.com](https://slides.rtylermalone.com). Built with [Reveal.js](https://revealjs.com/) and a custom theme.

## Presentations

| Talk | Venue | Date | Link |
|------|-------|------|------|
| Astronomy & Scouting | Barnard Astronomical Society | March 2026 | [View](https://slides.rtylermalone.com/astronomy-scouting/) |

## Local Preview

```bash
python3 -m http.server 8000
# Open http://localhost:8000/astronomy-scouting/
```

## Keyboard Shortcuts (during presentation)

| Key | Action |
|-----|--------|
| `S` | Open speaker notes |
| `F` | Fullscreen |
| `O` | Slide overview |
| `B` | Black screen (pause) |
| `←` `→` | Navigate slides |
| `Esc` | Exit fullscreen/overview |

## Adding a New Presentation

1. Create a folder: `my-new-talk/`
2. Add an `index.html` using the Reveal.js template (see `astronomy-scouting/index.html`)
3. Reference the shared theme: `../shared/theme/starfield.css`
4. Put images in `my-new-talk/images/`
5. Add an entry to the root `index.html` landing page

## Deployment

Hosted via GitHub Pages with a custom domain.

- **Domain:** `slides.rtylermalone.com`
- **DNS:** CNAME record in Cloudflare pointing to `<username>.github.io`
- **Pages config:** Source from `main` branch, root `/`

## Theme

The custom `starfield` theme (`shared/theme/starfield.css`) features:

- Dark navy background with CSS star-field effect
- Gold and blue accent colors
- Playfair Display + Inter font pairing
- Layout utilities: `.title-slide`, `.section-header`, `.columns`, `.portrait-grid`, `.closing-slide`, `.stat`

## License

Presentation content is personal. NASA images are public domain. BSA badge images are used under fair use for educational purposes. Wood Badge beads photo is CC BY-SA 3.0 via Wikimedia Commons.
