# Audio Transcription & Dictation Tools Research Guide

## Overview

Compare tools that turn speech into text for an individual user — both *dictation* (real-time speak-to-type into your apps) and *transcription* (turning recordings, meetings, and media files into editable text). The goal is to help a prosumer pick the right tool by weighing what it can do (live dictation vs file transcription vs meeting capture), how accurate and multilingual it is, what it does with the transcript (speaker labels, summaries, editing, export), how it handles your audio privately, which platforms and apps it works with, and what it costs. This comparison is about the *tools a person uses day-to-day*, not the raw speech-to-text APIs developers wire into their own products (those are the engines, not the tools) — though for open-source models we include the runnable ones a technical user can drive directly.

Users should be able to:
- Decide between a live dictation tool and a recording/meeting transcriber (or find one that does both)
- Judge accuracy and language coverage before committing
- Compare transcript features — speaker diarization, timestamps, AI summaries, in-app editing, export formats
- Understand where their audio is processed and whether it can be used to train models
- Match platform support and app integrations to their setup (Mac/Windows/iOS/Android/web, Zoom/Meet/Teams)
- Compare pricing, free tiers, and entry cost

## Scope

**Included:**
- End-user dictation apps — real-time speak-to-type into any application (Wispr Flow, superwhisper, Dragon, Talon, Apple/Windows built-in dictation)
- Meeting & media transcription products — record/upload/join → transcript, often with notes and summaries (Otter.ai, Fireflies, Rev, Descript, Trint, Sonix, Happy Scribe, Notta)
- Open-source / self-hostable speech-to-text that an individual can actually run (Whisper, whisper.cpp, faster-whisper, Vosk) and the desktop apps built on them (MacWhisper)
- Tools where producing usable text from speech is the primary job

**Excluded:**
- Developer-only speech-to-text *APIs/cloud engines* with no end-user app (Deepgram, AssemblyAI, Google Speech-to-Text, AWS Transcribe, Azure Speech, Speechmatics) — these are the engines tools are built on, not tools a person uses directly
- General voice assistants whose main job is commands/answers rather than transcription (Siri, Alexa, Google Assistant)
- Pure text-to-speech / voice-generation tools (the reverse direction)
- Note-taking or writing apps that merely embed a third-party transcription feature as a minor add-on
- Human-only transcription agencies with no software product
- Tools that are discontinued AND no longer usable

## Attribute Groups

### 1. General Information

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Developer** | text | Company, org, or individual behind the tool (Otter.ai, OpenAI, Nuance/Microsoft, Apple, etc.). |
| **First Release** | date (month-year) | First public release. For built-ins (Apple/Windows dictation), use when the modern dictation feature shipped; note in comment. |
| **Status** | tags | `active`, `beta`, `discontinued`. One primary status. |
| **License** | tags | `proprietary`, `freemium`, `open-source`, `source-available`. License of the *tool* itself. |
| **Primary Type** | tags | `dictation`, `transcription`, `meeting-assistant`, `model-library`. The tool's core purpose; multi-select when it genuinely does several. |
| **Website** | link | Official product page or repository. |

### 2. Input & Modes

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Real-time Dictation** | boolean | Live speak-to-type — your words appear as text as you talk. `true` for dictation tools; usually `false` for upload-only transcribers. |
| **File Transcription** | boolean | Can import/upload an existing audio or video file and transcribe it. |
| **Live Meeting Capture** | boolean | Captures a live meeting — via a meeting bot that joins the call, or by recording system/conference audio. |
| **Streaming / Low-latency** | boolean | Produces a running transcript of ongoing audio in near-real-time (vs batch-processing a finished recording). |
| **Audio Sources** | tags | `microphone`, `file-upload`, `system-audio`, `meeting-bot`, `url-import`. Where it can take audio from; multi-select. |

### 3. Accuracy & Languages

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Underlying Engine** | text | The recognition engine — `Whisper`, proprietary, `Nuance`, platform-native, etc. Many tools wrap OpenAI Whisper; name it when known. |
| **Language Count** | integer (ascending) | Approximate number of supported languages for transcription. Use the vendor's stated count; round and note "approx" in comment. Higher is better. |
| **English Accuracy** | rating (1–5, ascending) | Qualitative accuracy on clear English speech, from independent reviews/benchmarks. Note any published WER in the comment. Use `null` when there is no credible signal — do not guess from marketing. |
| **Multilingual / Auto-detect** | boolean | Can detect and transcribe non-English (or mixed-language) audio without manual language selection. |
| **Custom Vocabulary** | boolean | Lets the user add domain terms, names, or acronyms to improve recognition. |

### 4. Transcript Features

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Speaker Diarization** | boolean | Labels *who said what* (Speaker 1/2, or named speakers). |
| **Timestamps** | boolean | Provides word- or segment-level timestamps. |
| **AI Summaries & Notes** | boolean | Auto-generates summaries, action items, or meeting notes from the transcript. |
| **Built-in Editor** | boolean | An in-app editor to review and correct the transcript (bonus: edit media by editing text, à la Descript). |
| **Translation** | boolean | Can translate the transcript into other languages. |
| **Export Formats** | tags | `txt`, `docx`, `pdf`, `srt`, `vtt`, `json`, `markdown`. Output formats supported; multi-select. |

### 5. Privacy & Data

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Processing Location** | tags | `on-device`, `cloud`, `hybrid`. Where audio is actually processed. `on-device` for fully local; `hybrid` when local + optional cloud. |
| **Offline Capable** | boolean | Works fully offline with no network connection (implies on-device processing). |
| **Data Used for Training** | tags | `no`, `opt-out`, `opt-in`, `yes-default`. Whether your audio/transcripts may be used to improve models, and the consent posture. |
| **Data Deletion Control** | boolean | User can delete recordings/transcripts and/or set auto-deletion/retention. |

### 6. Platforms & Integration

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Platforms** | tags | `macos`, `windows`, `ios`, `android`, `web`, `linux`. Where the tool runs; multi-select. |
| **System-wide Dictation** | boolean | Dictation works in *any* app OS-wide (vs only inside the tool's own window). Relevant mainly for dictation tools. |
| **Integrations** | tags | `zoom`, `google-meet`, `teams`, `slack`, `notion`, `google-calendar`, `crm`, `none`. Meeting/app integrations; multi-select. |
| **API / Automation** | boolean | Offers an API, CLI, or scripting hook a power user can automate against. |

### 7. Pricing

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Pricing Model** | tags | `free`, `freemium`, `subscription`, `usage-based`, `one-time`, `open-source`. Select all that apply. |
| **Free Tier** | boolean | A genuinely usable free plan (not just a time-limited trial). |
| **Free Allowance** | text | What the free tier includes (e.g. "300 min/mo", "limited live notes", "unlimited local"). `null` if no free tier. |
| **Entry Price (USD/mo)** | decimal (descending) | Cheapest paid plan billed monthly; lower is better. Use `0` when a real free tier covers core use, and `null` for one-time/open-source with no subscription (explain in comment). |

## Research Sources

### Primary Sources (Preferred)

1. **Official product page & docs** — feature lists, supported platforms, languages, dictation vs transcription modes.
2. **Official pricing page** — plans, free tier and its limits, entry price. Snapshot the date.
3. **Official GitHub / repository** — for open-source tools: license, supported languages, engine, release history.
4. **Vendor privacy policy / trust center** — processing location, retention, and whether audio trains models.
5. **Official changelog / release notes** — first-release date and capability additions.

### Secondary Sources

6. **App Store / Mac App Store / Microsoft Store listings** — platform support, version history, ratings.
7. **Independent reviews & head-to-head comparisons** — recent articles testing accuracy and features (verify against primary docs).
8. **Benchmark write-ups (WER tables)** — for accuracy signals on Whisper-class and proprietary engines; cite the source and dataset.
9. **Community discussion** — Reddit (r/dictation, r/transcription, r/accessibility), forums, vendor Discords for real-world accuracy/usability.

### Tertiary / Verify Carefully

10. **Marketing claims** — treat "99% accurate" and "supports 100+ languages" skeptically; verify the number and conditions.
11. **App-store star ratings / download counts** — rough popularity proxies only.
12. **Aggregator/SEO "best transcription tool" listicles** — often affiliate-driven and outdated; corroborate before trusting.

## Assessment Guidelines

- **Primary Type**: `dictation` = real-time speak-to-type; `transcription` = recordings/files → text; `meeting-assistant` = joins/records meetings and produces notes; `model-library` = an open-source engine/runtime a user runs themselves. Multi-select only when the tool is genuinely positioned for several (e.g. Descript is `transcription` + editing; Otter is `transcription` + `meeting-assistant`).
- **Real-time Dictation vs Streaming / Low-latency**: Dictation means *you speak and it types for you* as a productivity input method. Streaming means a live running transcript of audio (e.g. live captions of a meeting). A meeting tool can stream a transcript without offering speak-to-type dictation — keep the two distinct.
- **Live Meeting Capture**: `true` if the tool can capture a live call — either a bot that joins (Zoom/Meet/Teams) or system-audio recording. Merely uploading a recorded meeting afterward is `File Transcription`, not live capture.
- **Underlying Engine**: Name the recognition engine when documented. Many third-party apps wrap OpenAI Whisper — say so. Use `null` (with a note) when the vendor does not disclose it; do not infer.
- **Language Count**: Use the vendor's stated number; note "approx" since counts shift with releases. Built-in dictation languages and transcription languages can differ — record the transcription figure and clarify in the comment if dictation differs.
- **English Accuracy** (rating): 5 = consistently near-human on clear speech in independent tests; 3 = solid but visibly error-prone on accents/cross-talk; 1 = unreliable. Anchor to independent benchmarks/reviews, not vendor claims. Quote any WER figure in the comment. Prefer `null` over a guess when no independent signal exists.
- **Custom Vocabulary**: `true` only for a real mechanism to add terms/names/acronyms (custom dictionary, vocabulary boosting). General "it learns over time" marketing without a user-facing list is `false` (note it).
- **Speaker Diarization**: `true` for automatic speaker separation/labeling. Manual after-the-fact relabeling without auto-detection is `false`.
- **Built-in Editor**: `true` for an in-app transcript editor. Mark the comment when it's a *media-by-text* editor (edit the audio/video by editing words, like Descript) versus plain text correction.
- **Processing Location vs Offline Capable**: `Processing Location` is where audio is handled (`on-device`/`cloud`/`hybrid`). `Offline Capable` is the stricter test of working with no network at all. A `hybrid` tool that *can* run local models is `Offline Capable: true`; a cloud-only tool is `false`.
- **Data Used for Training**: `no` = vendor states audio is never used for training; `opt-out` = used unless you disable it; `opt-in` = only if you enable it; `yes-default` = used by default with no clear control. Read the privacy policy, not the homepage; consumer and enterprise tiers may differ — record the consumer default and note the difference.
- **System-wide Dictation**: `true` only when dictation injects text into *any* focused app OS-wide (global hotkey, anywhere you can type). A tool that only transcribes within its own window is `false`.
- **API / Automation**: `true` for a documented API, CLI, or scripting interface a power user can drive. Open-source command-line tools (Whisper, whisper.cpp) are `true`. A closed GUI-only app is `false`.
- **Free Allowance**: Capture the concrete free-tier limit as short text ("300 min/mo", "unlimited local", "60 min/file, 3 files"). Use `null` when there is no free tier.
- **Entry Price (USD/mo)**: Cheapest *paid* plan billed monthly (convert annual-billed to monthly equivalent and note it). `0` when a genuine free tier covers core use; `null` for one-time-purchase or open-source tools with no subscription (state the one-time price or "free/OSS" in the comment).

### When to Use `null`

- Accuracy where no independent benchmark or credible review exists — `null` + comment, never a marketing-derived guess.
- Language count when the vendor gives no number and none is discoverable.
- Underlying engine when it's undisclosed.
- Training-data policy when the privacy policy is silent or ambiguous — `null` + comment rather than assuming `no`.
- First-release date for tools with murky/rebranded history.
- Any attribute where vendor claims and independent testing conflict — `null` and explain.

## Candidates

- [ ] Otter.ai — Leading meeting transcription and AI-notes assistant; web + mobile
- [ ] OpenAI Whisper — Reference open-source speech recognition model; the engine many tools wrap
- [ ] Descript — Transcription plus media-by-text audio/video editing
- [ ] Wispr Flow — Popular AI dictation app for fast, formatted speak-to-type
- [ ] Apple Dictation — Built-in on-device dictation across macOS and iOS
- [ ] Dragon (Nuance) — Veteran professional dictation suite, strong custom vocabulary
- [ ] Fireflies.ai — Meeting-bot notetaker with summaries and CRM integrations
- [ ] superwhisper — Mac AI dictation running local Whisper models, system-wide
- [ ] Rev — Hybrid human + AI transcription and captioning service
- [ ] whisper.cpp — C/C++ local Whisper runtime for offline, on-device transcription
- [ ] faster-whisper — Optimized Whisper inference (CTranslate2) for fast local transcription
- [ ] MacWhisper — Mac desktop transcription app built on Whisper
- [ ] Trint — Transcription and collaborative editing platform for media teams
- [ ] Sonix — Automated multilingual transcription with editing and export
- [ ] Happy Scribe — Transcription and subtitle generation, human + AI
- [ ] Notta — Multilingual transcription and meeting notes app, web + mobile
- [ ] Talon Voice — Accessibility-focused voice control and dictation, popular for hands-free coding
- [ ] Vosk — Offline open-source speech-recognition toolkit with small models
- [ ] Windows Voice Typing — Built-in Windows dictation (Win+H), system-wide
- [ ] tl;dv — Meeting recorder/transcriber with timestamps and highlights
- [ ] Fathom — Free-leaning AI meeting notetaker with summaries

## Notes for Researchers

1. **Separate dictation from transcription.** Many tools do only one well. Record both `Real-time Dictation` and `File Transcription` explicitly rather than assuming a "speech tool" does both.
2. **Name the engine.** A large share of newer apps wrap OpenAI Whisper. Identifying the engine explains accuracy and language coverage — record it, and note when it's undisclosed.
3. **Read the privacy policy for training/retention.** Processing location and "is my audio used for training" live in the privacy policy or trust center, not the homepage; consumer and enterprise tiers often differ.
4. **Verify accuracy against independent tests.** Vendor "99% accurate" claims are marketing. Anchor the accuracy rating to reviews/benchmarks and quote any WER in the comment; use `null` when there's no real signal.
5. **Snapshot date for pricing and free tiers.** Plans and free-minute allowances change often — put the check date in the `comment`.
6. **Note built-ins carefully.** Apple Dictation and Windows Voice Typing are free, on-device, and system-wide but lack file transcription and summaries — capture both their strengths and gaps.
7. **For open-source tools, "pricing" is engine cost.** Mark `open-source` / `Free Allowance: unlimited local` and put any practical cost (compute, setup effort) in the comment rather than forcing a subscription price.
8. **Cite primary sources with URLs.** Prefer vendor docs/pricing/privacy and official repos; use reviews only to corroborate, and flag conflicts with `null`.
9. **Use `null` + comment over a confident guess.** An honest unknown is more useful than a wrong value.
