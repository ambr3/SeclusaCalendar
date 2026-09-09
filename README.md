<p align="center">
  <img src="icon-192.png" alt="Seclusa Calendar" width="120" height="120">
</p>


<h1 align="center">Seclusa Calendar</h1>


<p align="center">
  <em>A privacy-first calendar PWA — zero tracking, no accounts, no servers.</em>
</p>


<p align="center">
  <a href="LICENSE"><img alt="License: GPL-3.0" src="https://img.shields.io/badge/license-GPL--3.0-blue.svg"></a>
  <a href="https://github.com/ambr3/SeclusaCalendar/commits/main"><img alt="Last commit" src="https://img.shields.io/github/last-commit/ambr3/SeclusaCalendar"></a>
  <img alt="Vanilla JS" src="https://img.shields.io/badge/built%20with-vanilla%20JS-f7df1e.svg">
  <img alt="PWA" src="https://img.shields.io/badge/PWA-installable-6cb5e6.svg">
  <img alt="Tests" src="https://img.shields.io/badge/tests-45%20passing-6cb5e6.svg">
</p>


<p align="center">
  <a href="#features">Features</a> ·
  <a href="#privacy">Privacy</a> ·
  <a href="#installation">Installation</a> ·
  <a href="#license">License</a>
</p>


---


*Seclusa* — from the Latin meaning "private", "secluded", or "set apart" — keeps your calendar your own. Seclusa Calendar is a **pure static, open-source calendar app**. Everything runs in your browser: your events, settings, and preferences live only on your device's localStorage, and the app **cannot make a single network request** (its Content-Security-Policy sets `connect-src 'none'`). Installable, offline-capable, and auditable end-to-end.


---


## ✨ Features


### 📅 Views & Navigation
- **Month, Week & Year views** — switch with the toolbar buttons; the month grid shows each date in its own square box
- **Quick jump** — tap the month/year title to jump straight to any month
- **Swipe & keyboard** — swipe the calendar to change month; arrow keys move between periods
- **Today** — one tap returns you to today, highlighted and marked


### 📝 Events
- **Rich events** — all-day or timed, with end time, end date, colors, and descriptions
- **Recurring events** — daily, weekly, monthly, yearly, with custom intervals and an end date
- **Multi-day events** — spanning events show on every day they cover
- **Drag & drop** — move events between days by dragging the colored pill
- **Reminders** — optional browser notifications before an event (opt-in in Settings)


### 🌍 Holidays & Dates
- **Holidays** — toggle countries (UK, US, Canada, Ireland, Germany, France, Spain, Italy, Netherlands, Belgium, Switzerland, Austria, Portugal, China, South Korea, India, Brazil …) from the Holidays panel
- **Special dates** — Valentine's, Halloween, Mother's/Father's Day, New Year's Eve and more
- **Search** — find events and holidays instantly across your calendar


### 🎨 Interface
- **Dark / light themes** with a glassmorphism look and a baby-blue accent
- **Week start + 10 languages** — Sunday/Monday start and English, Français, Deutsch, Español, Italiano, Nederlands, Português, Türkçe, Српски / Srpski
- **Backup & restore** — export/import your data as JSON or standard iCal (.ics), fully portable
- Smooth fade-in animations, fully responsive, large touch targets


---


## 🔒 Privacy


Your data is your business. That's the whole point.


| | |
|---|---|
| 🚫 **Zero tracking** | No analytics, no cookies, no fingerprinting, no third-party scripts |
| 🖥️ **No server** | Pure static site — nothing runs on a server |
| 🔑 **No accounts or keys** | Open it and use it — no sign-up, ever |
| 🏠 **Stays on device** | Events, settings, and preferences live only in your browser's localStorage |
| 🚫 **Nothing leaves** | The CSP sets `connect-src 'none'` — the app cannot make any network request at all |
| 🚫 **No hidden sharing** | No outbound connection, ever — not even for a weather API or map tiles |
| 🧭 **No geolocation** | The app never asks for it; Permissions-Policy disables it |
| 🔔 **Notifications opt-in** | Reminder alerts only after you grant permission — off by default |
| 🛡️ **Locked-down security** | Camera, microphone, motion sensors, and payment are all blocked |
| 🖼️ **Can't be embedded** | Best-effort clickjacking protection; a sample `.htaccess` sends `X-Frame-Options: DENY` on Apache |
| 📜 **Open source** | GPL-3.0 — read every line |


> ⚠️ **Backup note:** because data lives only in the browser, clearing your browser cache/site data deletes your events. Export a JSON backup regularly — the app is a calendar, not a database.


---


## 📦 Installation


### Use it
Open the app (live site or `index.html` directly) and install it as a PWA:


1. Open the site
2. Tap **Install** / **Add to Home screen**
3. Done — it works offline too


> 💡 Want maximum security? On Android use a hardened browser like **Vanadium (GrapheneOS)** or **Brave** for any PWA.


---


## ⚠️ Disclaimer


> This project was **vibe-coded**. All code is reviewed before each release, but it's still recommended to audit for security flaws before use, especially when self-hosting. Use at your own risk.


---


## 📄 License


[GPL-3.0](LICENSE) — free to use, modify, and share, with the same freedom preserved for derivatives.


---