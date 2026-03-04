# GroundChiFlow — Backlog & ideas

Future features we want to build. Add notes here so we don’t lose them.

---

## Coach-assisted logging

- **Tell the Coach your blood work** — User says or types something like “My last panel: glucose 92, vitamin D 45, B12 520” and the Coach (or a follow-up flow) fills the Blood Work form fields. Same idea for other inputs: describe vitals or meals in natural language and the app fills the right screens.
- **✅ Paste lab results (implemented)** — On the Blood Work tab, **“Paste lab results”** opens a modal. User pastes or types lab text (e.g. from an email); the app sends it to the Grok bridge, which extracts biomarker values and fills the fields. See `docs/AGENT_AND_SIGNIN.md` §4.
- **Document scan / import** — User can:
  - Take a picture of a lab report (camera) and we parse it to extract values and fill Blood Work.
  - Import a file (PDF/image) and do the same.
- Apply the same “paste or scan → parse → fill” pattern to other import types (e.g. gut log, meals, vitals) where it makes sense.

---

*Last updated: 2026-02-28. Add new ideas as bullets above.*
