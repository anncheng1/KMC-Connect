# KMC Connect 🤱

**Kangaroo Mother Care — learn, practise, track.**

KMC Connect is a free, offline-capable web app (PWA) with two complementary purposes:

1. **Healthcare provider training** — a structured learning and competency platform for doctors, nurses, medical assistants, midwives and other healthcare workers.
2. **Parent education** — a simple, visual, multilingual guide (English, Bahasa Melayu, 中文) that teaches parents to practise KMC safely in hospital and at home, with a **KMC tracker**.

Content is adapted from WHO *Kangaroo mother care: a clinical practice guide* (2025) and WHO *Parent counselling guide on KMC* (2025). All 17 videos referenced in the WHO guide are linked.

## Features

### For parents (EN / BM / 中文)
- 10 short lessons mirroring the WHO parent counselling guide (what KMC is, benefits, duration, breastfeeding, positioning, feeding in KMC, monitoring, going home, when to stop)
- Step-by-step picture guide to the KMC position, with a labelled illustration
- Red **Danger signs** page with one-tap call buttons (emergency number + your hospital)
- **KMC Tracker**: start/stop skin-to-skin timer (mother / father / other family), feeds (breastfed / expressed milk / other milk), weight, temperature
  - Daily progress ring vs the 8 h minimum, 7-day bar chart, feeds in 24 h vs 8–12 target
  - Corrected gestational age, weight chart and growth velocity (g/kg/day)
  - Temperature alerts (<36.5 °C / >37.5 °C) and a “ready to stop KMC” prompt (~2500 g or 38–40 weeks CGA)
  - Printable **daily KMC chart** in WHO Annex 4a (hourly) and 4b (6-hourly) format; CSV export
  - Twins/triplets supported (multiple babies)

### For healthcare providers
- 10 training modules with objectives, key content, WHO video links and a 5-question quiz each (pass mark 80%)
- 7 OSCE-style **skills checklists** with critical steps, assessor sign-off and assessment history
- **Certificate** (printable / save as PDF) when all modules are passed, listing observed competencies
- **Counselling mode** — show the parent lessons at the bedside in the family’s language
- **Unit KMC monitor** — SSC hours in last 24 h, feeds, temperature, weight per newborn (ID/bed only), with KMC indicators (% ≥8 h SSC, % exclusive breast milk)
- Clinical tools — corrected GA, growth velocity, feed-volume helper, expected expressed-milk volumes

### Privacy
All data stay **on the device** (browser localStorage). Nothing is sent to any server. Users can download/restore a backup file from Settings. Because records are stored in the browser, use a personal, password-protected device where possible; do not use the tracker for identifiable clinical documentation or leave patient details on shared devices.

## Publish on GitHub Pages (no coding needed)

1. Sign in to GitHub → **New repository** → name it `kmc-connect` → Public → Create.
2. Click **uploading an existing file**, drag in **all files and folders** from this package (keep the `css`, `js`, `icons` folders), then **Commit changes**.
3. Go to **Settings → Pages** → *Source*: **Deploy from a branch** → Branch **main**, folder **/ (root)** → Save.
4. After about a minute the app is live at `https://<your-username>.github.io/kmc-connect/`.
5. On a phone, open the link and choose **Add to Home Screen** — it then works offline.

### Customise for your hospital
- Edit `js/config.js` to set the default emergency number, hospital name and phone (shown on the Danger signs page).
- After changing any file, bump `VERSION` in `sw.js` so installed phones pick up the update.

### Add a language (e.g. Iban, Tamil)
1. In `js/i18n.js`, add `{ code: 'iba', label: 'Iban' }` to `LANGS` and copy the `en` block in `STR` as `iba`.
2. In `js/content-parent.js`, add an `iba:` entry alongside `en/ms/zh` for each lesson, step and danger sign.
3. Add the option to the language `<select id="topLang">` in `index.html`.
Missing text falls back to English automatically.

## File structure
```
index.html              app shell
manifest.webmanifest    PWA manifest
sw.js                   service worker (offline)
css/styles.css
js/config.js            hospital defaults
js/i18n.js              interface text (EN/BM/ZH)
js/content-parent.js    parent lessons, steps, danger signs, video list
js/content-hcp.js       training modules, quizzes, skills checklists
js/app.js               router, views, tracker, storage
icons/                  app icons
```

## Before clinical roll-out
- Have native speakers / your hospital’s health education unit review the **Bahasa Melayu and Chinese** translations.
- Check content against Malaysian national and hospital protocols (e.g. feeding volumes, follow-up schedule).
- The Unit monitor is a training/QI aid, not a medical record; follow your hospital’s data-protection policy.

## Licence and attribution
Adapted from WHO material licensed under **CC BY-NC-SA 3.0 IGO**; this adaptation is shared under the same licence for **non-commercial** use.

- WHO. *Kangaroo mother care: a clinical practice guide.* Geneva: World Health Organization; 2025. Licence: CC BY-NC-SA 3.0 IGO.
- WHO. *Parent counselling guide on kangaroo mother care (KMC).* Geneva: World Health Organization; 2025. Licence: CC BY-NC-SA 3.0 IGO.

WHO does not endorse this app or any specific organisation, product or service. *The translations were not created by WHO. WHO is not responsible for the content or accuracy of these translations. The original English edition shall be the binding and authentic edition.* Illustrations are original drawings, not WHO artwork.

This app supports, but does not replace, advice from qualified health professionals.
