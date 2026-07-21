# Wheel & Axle Investigation Lab

A static GitHub Pages package for a Year 7 lesson on wheels and axles as force and speed multipliers.

## What is included

- `index.html` - the interactive simulation.
- `lesson.html` - a simple student lesson hub for Google Classroom.
- `bookwork-notes.html` - short copy-to-book notes for students.
- `bookwork-notes-copy.md` - the same notes in a copy-paste friendly format.
- `styles.css` - responsive layout and print styling.
- `model.js` - the ideal-machine calculations used by the app.
- `script.js` - controls, animation, trial table and CSV download.
- `worksheet.html` - printable student worksheet.
- `teacher-guide.html` - printable cover teacher guide and answers.
- `google-classroom-blurb.md` - copy-and-paste text for a Google Classroom post.
- `tests/model-check.js` - a small Node test for the reference values.
- `.nojekyll` - keeps GitHub Pages from applying Jekyll processing.

## Upload to GitHub

1. Create a new GitHub repository.
2. Add these files at the repository root.
3. In the repository settings, open Pages.
4. Set the source to the main branch and the root folder.
5. Share the GitHub Pages URL with students.

No install step, build step, login, API key or database is needed.

## Local check

Open `index.html` in a browser. The simulation is written as plain HTML, CSS and JavaScript, so it can also run directly from the file system.

To check the science model with Node:

```bash
node tests/model-check.js
```

Expected result:

```text
model checks passed
```

## Reference values

Force Lab with axle radius 2 cm, load 60 N and 1 turn:

| Wheel radius | Force ratio | Required effort | Wheel-rim distance | Axle/load distance |
|---:|---:|---:|---:|---:|
| 4 cm | 2 | 30 N | 25.1 cm | 12.6 cm |
| 8 cm | 4 | 15 N | 50.3 cm | 12.6 cm |
| 12 cm | 6 | 10 N | 75.4 cm | 12.6 cm |

Speed Lab with axle radius 2 cm, input rate 1 rotation per second and 1 second:

| Wheel radius | Axle rotations | Wheel rotations | Axle-surface speed | Wheel-rim speed |
|---:|---:|---:|---:|---:|
| 4 cm | 1 | 1 | 12.6 cm/s | 25.1 cm/s |
| 8 cm | 1 | 1 | 12.6 cm/s | 50.3 cm/s |
| 12 cm | 1 | 1 | 12.6 cm/s | 75.4 cm/s |

## Privacy

The site stores trial rows only in the current browser tab. Downloading CSV creates a local file on the student's device; no data is sent anywhere.
