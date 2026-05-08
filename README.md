# Lords of the Fallen Completionist Checklist

A checklist app for Lords of the Fallen (2023) that runs as a single HTML file. Tracks three playthroughs independently, warns you about missable quests before you blow them, links every collectible to its wiki page, and installs on your phone like a real app.

Verified against Patch 2.5, the final major update from December 2025.

This is a fork-and-rebuild of [colewaldrip/lotf-2023-checklist](https://github.com/colewaldrip/lotf-2023-checklist). The original was last touched in 2023 and predates a lot of post-launch content. Full credit chain at the bottom.

## Why I rebuilt it

The original is great desktop work but it's Bootstrap 5 and jQuery from 2023, the badge data missed about 17 quest gates that the Fextralife wiki has documented since, and there's no way to track three separate playthroughs (which the game requires for all three endings). I also wanted something I could actually use on my phone while playing.

So this version uses React, ships as one self-contained file, and has per-run state for Inferno, Radiance, and Umbral runs. Same content lineage, mostly the same item IDs, audited against the wiki.

## What's in it

Two tracking tabs.

The Playthrough tab has 542 items across 25 areas, ordered by where you actually encounter them. Items get one of two warning labels:

- STOP means you have to do this thing before you progress further or a questline silently fails. The seven Kukajin invoice payments, the Drustan fire-lighting in the Calrath sewers, telling Byron about Winterberry before the elevator. There are 35 of these.
- MISSABLE means it's irreversibly lost if you skip it now. Andreas's stigma soulflay, the Drustan caves first meeting, the three Lightreaper summon options. There are 25 of these.

The Collectibles tab has 1,085 items: every weapon, armor piece, ring, pendant, spell, ammo type, umbral eye, boss, gesture, stigma, remembrance, tinct, rune, and location. Each item links to its Fextralife wiki page so you can pull up where it drops without leaving the checklist.

Three named runs at the top, each with independent checkboxes and a different ending preset. Switch between them whenever. Items that only matter for one ending (cleansing the five beacons for Radiance, for example) only show up when that run is active.

A spoiler toggle blurs major boss-kill items behind a click. Defaults to on. Turn it off if you don't care.

Search and filter across both tabs. The "Open critical only" filter is the platinum hunter's friend at endgame, since it shows only the missables you haven't checked yet.

JSON export and import. Download your full state, send it to a friend, they import the file and start from your progress.

Works offline. React, Tailwind, icons, and all the data are inlined into the HTML. No CDN calls, no network, no hosting required to use it from disk.

## Install

### Desktop

Download `LOTF_Checklist.html` and double-click it. Any modern browser works.

### Phone (the good way)

Best experience comes from putting the file at a real HTTPS URL first. Easiest free options:

1. Drag the file onto [netlify.com/drop](https://app.netlify.com/drop). You get a URL in about ten seconds.
2. Or commit it to a public GitHub repo and turn on GitHub Pages.
3. Or Cloudflare Pages, Vercel, anywhere that serves static files.

Then on your phone:

On iOS, open the URL in Safari (this matters; Chrome on iOS doesn't support add-to-home-screen). Hit the Share button, then "Add to Home Screen." You get an app icon labeled "LOTF Checklist" that launches in fullscreen with no browser chrome.

On Android, open the URL in Chrome, hit the three-dot menu, then "Install app" or "Add to home screen." Same fullscreen experience.

You can also save the file locally and open it from `file://`, but the home-screen install flow only works from a real URL.

## What changed in the data

Every badge in this version was re-checked against the [Fextralife wiki](https://thelordsofthefallen.wiki.fextralife.com/) Walkthrough, Quests, and Game Progress Route pages. The summary:

Removed one over-eager badge. Pieta's Stigma was flagged missable in the original, but it stays accessible permanently after the boss fight, so the badge is gone.

Added STOP badges for things the original didn't catch:

- All seven Kukajin invoice payments (3k, 5k, 6k, 6k, 7.5k, 8.5k, 9k). Miss any one of them and her whole questline fails.
- Drustan's Unripe Berries delivery, before you take the elevator into the Fief.
- Telling Byron about Winterberry before that same elevator.
- Pickup and delivery of the Searing Accusation in Pilgrim's Perch, which is what relocates the Tortured Prisoner.
- Andreas's Book of Lineage return.
- Damaged Standard pickup in the Manse, before Empyrean.
- Charred Letter pickup in Bramis Castle, before you kill the Sundered Monarch.

Added MISSABLE badges:

- Drustan's first meeting in the Fitzroy's Gorge caves.
- Drustan's third meeting in the derelict tower along the Path to Bramis Castle.
- Andreas's stigma soulflay in the Fief.
- Three Isaac Kneeling stigmas (Lower Calrath, Fief, Manse). All three are part of the NG+ Paladin class unlock chain.
- Pieta's Lady stigma (Manse) and Pieta's Request stigma (Abbey).
- Three Lightreaper summon choices (Andreas, Paladin Isaac, Kukajin). Only one slot per fight, and picking one locks you into completing that NPC's questline.
- Damarose's cliff-edge dialogue, which is the first chance to start her Adyr questline.

Path-scoping for Radiance items. Cleansing the five beacons (Forsaken Fen, Upper Calrath B, Fief, Tower of Penance, Empyrean) only shows up when you're on a Radiance run. Cleansing them on an Inferno run kills the Inferno ending, and they don't matter for Umbral.

New items the original didn't have:

- The Forlorn Hound questline at Skyrest Bridge.
- Iselle's "Inside the Cleric's Mind" dungeon, post-Judge Cleric.
- Drustan's third meeting at the derelict tower.

Patch 2.5 content gets a "NEW" pill on 45 items: the Veteran of the Veil armor set, the Three Spirits weapon trio, post-launch ammo (Blood Vomit, Explosive Mines, Frost Worms), the Mirror of Distortion questline rewards, and the Offerings of Orius spells.

## How to plan three playthroughs

Run 1: Inferno plus Kukajin. Default. Defile the beacons (don't cleanse them), follow Damarose's path, summon Kukajin at the Lightreaper, place the Adyr Rune in the Bramis pedestal at the end.

Run 2: Radiance plus Paladin Isaac. Cleanse all five beacons with Sanctify before each Beacon boss. Summon Paladin Isaac at the Lightreaper instead of Kukajin. You can't share that summon slot, which is why these are two separate runs.

Run 3: Umbral. Get all four Umbral Parasites: from Harkyn, from Pieta, then the two Skyrest pillar slots. Beat Elianne the Starved.

The three default runs in the app are pre-configured for this layout.

## Tech stack

React 18 compiled by esbuild to one minified IIFE bundle. Tailwind CSS 3 with content scanning, so only the ~250 classes the app actually uses ship in the file (about 18 KB minified). Twenty Lucide icons rendered as inline SVG, no icon font. Web App Manifest and Apple touch icon both base64-inlined as data URLs. A service worker registers when you serve over http(s) and gets skipped on `file://`. State persists to localStorage, with the experimental `window.storage` API used when present.

You don't need any of this to use the app. The build pipeline is only for editing the React source.

## Editing the source

The React source is in `LOTF_Checklist.jsx`. To rebuild:

```bash
# 1. Compile JSX to a minified JS bundle
npx esbuild LOTF_Checklist.jsx \
  --bundle=false \
  --loader:.jsx=jsx \
  --jsx=transform \
  --jsx-factory=React.createElement \
  --jsx-fragment=React.Fragment \
  --format=iife --global-name=LOTF_APP \
  --minify --target=es2018 \
  --outfile=app.compiled.js

# 2. Build the Tailwind stylesheet from the compiled bundle
npx tailwindcss -i tw_input.css -o tw.css --minify

# 3. Concatenate icon library + app + Tailwind into the HTML scaffold
# (build script in this repo)
```

## Sources

- [Lords of the Fallen Fextralife Wiki](https://thelordsofthefallen.wiki.fextralife.com/), specifically the Walkthrough, Quests, Game Progress Route, and Patch Notes pages.
- The category structure and item IDs from [colewaldrip/lotf-2023-checklist](https://github.com/colewaldrip/lotf-2023-checklist), which I preserved so anyone familiar with that project can navigate this one.

## Credits

This fork stands on a long chain of community work:

[colewaldrip / HeyKidGables](https://github.com/colewaldrip) built the [LOTF 2023 Checklist](https://github.com/colewaldrip/lotf-2023-checklist) that this is forked from. The category structure, the item IDs, and a big chunk of the curated content come from his project.

[xenevel](https://github.com/xenevel) wrote the Dark Souls 2: Scholar of the First Sin Cheat Sheet that the original was forked from.

[Alifer](https://www.reddit.com/r/LordsoftheFallen/comments/17cziuv/lords_of_the_fallen_completionists_checklist_by/) wrote the original Reddit Completionist's Checklist that started this chain.

[100% Guides on YouTube](https://www.youtube.com/watch?v=zhwjeB_nwMk) and [Neoseeker](https://www.neoseeker.com/lords-of-the-fallen-2023/Collectibles/Stigmas) put together the Stigmas data.

[Fextralife wiki contributors](https://thelordsofthefallen.wiki.fextralife.com/) for the canonical item, quest, and walkthrough information that this whole space depends on.

## Community

[r/LordsoftheFallen](https://www.reddit.com/r/LordsoftheFallen) and the [original project Discord](https://discord.gg/WqXewh8xjd).

## License

The original repo doesn't have a LICENSE file. Content here is community-sourced from the wiki and prior community guides, so credit accordingly if you fork or reuse. I'd suggest opening an issue upstream asking for a license to be added, or just slap MIT on your own fork given the lineage is well-documented.
