# Three.js experiment with cards

**Cards rotate and react on hover**

Live website: https://1-cards-shtyka.netlify.app/

---

### Install

```bash
npm i
```

<br/>

### Run local server

```bash
npm run dev
```

<br />

---

### ✅ Done:

1. Cards rotate in `Gallery view`.
2. Cards rotate in `Circle view`.
3. Cards react on hover (I used `Raycaster`)

### ⚠️ Nuances:

**Meshes overlap and cause flickering** \
In `Circle view` hover image from left or right - it'll overlap with another one above. \
I don't understand how to fix it yet.

I tried changing `mesh.position.z` for hovered card, but:
- cards from the bottom seem to lose their Y position change (it's way too small)
- cards from the top go up way too much.
