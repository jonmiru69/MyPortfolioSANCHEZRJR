# Feature specification: Portfolio assistant

## Owner journeys

1. From Overview or Profile in Owner mode, scan the current portfolio. Read the résumé, all public certificate attachments, and accessible evidence in enabled sections. Report any unread files and progress. Review, edit, and select individual updates. A save commits the selected updates through the existing draft and sync flow.
2. Pick a certificate in the existing add or edit dialog. Read the document locally, propose values with page excerpts, and fill eligible blank fields. The owner can correct the transcript, compare suggestions with the original, and save the file and reviewed metadata together.
3. Use a compatible browser's on-device language model to improve proposed wording or find additional literal certificate fields. Document reading and evidence-based drafting work independently of that model.

## Acceptance criteria

- Public visitors see no assistant controls. Existing owner authorization and revision checks still govern publishing.
- Scan image files, PDF, Word and PowerPoint through the portfolio's document engine. Large, locked and unreadable files surface a recovery path. A stopped scan shows its actual coverage.
- Missing or conflicting dates, training codes, CPD points and hours do not become invented values. Certificate suggestions never overwrite manual input without an explicit choice.
- The background assistant may update introductions, biography and documented areas of learning. Contact details, identity, raw records, attached originals, section visibility and private records are outside its write scope.
- Documents and text are processed on the owner's device. The feature requires no service key, payment or billing change.
- Verify the upload and background flows in a real browser and check owner mode, mobile layout, draft persistence, and existing portfolio workflows.
