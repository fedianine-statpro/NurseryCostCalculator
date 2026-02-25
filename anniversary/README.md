# Anna & Andrey – Anniversary Roller Runner

## How to Run
1. Open `index.html` in any modern browser (Chrome, Firefox, Edge).
2. Press **SPACE** to start.
3. That's it — no install, no server, no dependencies.

## How to Replace Assets

Drop your own images into the `assets/` folders. The game has built-in
fallback placeholders, so it works without any assets at all.

### Sprites (`assets/sprites/`)

| File               | What                        | Recommended Size         |
|--------------------|-----------------------------|--------------------------|
| `couple.png`       | Anna & Andrey skating       | 120 × 160 px (transparent PNG) |
| `alisa-icon.png`   | Alisa collectible icon      | 80 × 80 px (transparent PNG)   |
| `arisha-icon.png`  | Arisha collectible icon     | 80 × 80 px (transparent PNG)   |

### Scrapbook Photos (`assets/photos/`)

| File                | Milestone          | Recommended Size |
|---------------------|--------------------|------------------|
| `photo-ring.jpg`    | The Ring           | 800 × 600 px    |
| `photo-car.jpg`     | The EV             | 800 × 600 px    |
| `photo-house.jpg`   | Our Home           | 800 × 600 px    |
| `photo-alisa.jpg`   | Alisa              | 800 × 600 px    |
| `photo-arisha.jpg`  | Arisha             | 800 × 600 px    |
| `photo-family.jpg`  | Final Family Photo | 800 × 600 px    |

> **Tip:** Any aspect ratio works — images are scaled with `object-fit: cover`.
> Larger images look sharper; the sizes above are the minimum for crisp display.

## Controls

| Key          | Action                                      |
|--------------|---------------------------------------------|
| `← →`       | Move between 3 lanes                        |
| `SPACE`      | Jump over obstacles                         |
| `H`          | Hold hands — magnet boost (attracts items)  |

## Milestones

Collect them in order to unlock scrapbook memories:

1. 💍 The Ring — *"She said yes!"*
2. 🚗 The EV — *"Road trip mode activated!"*
3. 🏠 Our Home — *"Home sweet home!"*
4. 👧 Alisa — *"Hello, little star!"*
5. 👶 Arisha — *"The gang's all here!"*
6. 📸 Family Photo — *"Together forever!"*

After all six, the celebration screen plays with confetti!

## Folder Structure

```
/index.html          ← open this
/style.css
/game.js
/assets/
  /sprites/
    couple.png       ← TODO: drop your file here
    alisa-icon.png   ← TODO: drop your file here
    arisha-icon.png  ← TODO: drop your file here
  /photos/
    photo-ring.jpg   ← TODO: drop your file here
    photo-car.jpg    ← TODO: drop your file here
    photo-house.jpg  ← TODO: drop your file here
    photo-alisa.jpg  ← TODO: drop your file here
    photo-arisha.jpg ← TODO: drop your file here
    photo-family.jpg ← TODO: drop your file here
```
