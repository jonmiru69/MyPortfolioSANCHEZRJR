# Editing your portfolio

Online editing requires the original GitHub owner account and write access to this specific repository. Visitors and other repository collaborators cannot publish portfolio changes. Your GitHub profile link is omitted from the public Contact page; GitHub still verifies your private owner sign-in.

1. Choose **Owner mode** and connect your GitHub owner access.
2. Choose **Manage certificates**, or open any other portfolio section.
3. Choose **Add certificate / Add item**, or the **Edit** button beside an existing record.
4. One popup opens for that record. Choose a file using the file picker, then fill in its details.
5. Choose **Save changes**. Wait for the sync status to confirm that the changes are saved online.

You can cancel without changing the existing record. If you have unsaved changes, choose **Discard changes** or **Keep editing** inside the same popup. Delete uses an explicit second confirmation button inside the editor.

Certificate fields appear in this exact order:

- Date issued
- Certificate type
- Delivery mode
- Seminar title
- Seminar topic
- Seminar provider
- Training code
- CPD points

Leave details blank when they are not stated on the document. CPD points are not inferred from training hours or provider accreditation numbers. A value of zero is different from an unstated value.

## Use the portfolio assistant

- In **Owner mode**, open **Overview** or **Profile**, choose **Update my background**, then **Scan portfolio**. Open **View scan coverage** to see which originals were read. Edit suggestions in place, check the updates you want, and choose **Save selected updates**.
- In **Add certificate**, choosing a file starts the scan. Confirm the suggestions against the original. Use **Review or correct the transcript** for missed text, or fill the remaining fields by hand. Choose **Save changes** to save the reviewed details and file together.
- Reading runs on this device and needs no AI account, key, or billing. The English reader scans up to 24 pages per file. If a scan is unreadable or exceeds that limit, try a clearer or shorter copy, paste the relevant text, or enter the details manually.
- Choose **Enable Qwen** in the certificate review or a background suggestion to download the local language model (about 512 MB). Once enabled, certificate scans use it automatically when there are missing fields. Qwen reads the transcript on your device. Check any additional values against the original, and review generated wording before saving.

Accepted files: JPEG, PNG, WebP, GIF, AVIF, BMP, PDF, Word (.doc/.docx) and PowerPoint (.ppt/.pptx), up to 20 MB each. Keep the original extension. The app checks the file's format before saving.

The Résumé / CV section displays your supplied résumé across the reading area. Use **Open full size**, **Download résumé**, or **Print résumé**. In owner mode, **Edit résumé & file** opens the same focused editing workflow for its introduction and document.

Profile, identity and photo, contact information, footer writing, section settings and other records each have focused editors. Nested lists use ordinary Add/Remove controls, not JSON.

The **Manage sections** popup lists the sections. Choosing one opens its own editor. You can change its name, address, order and visibility, or add a section. Section addresses use lowercase letters, numbers and hyphens and must be unique.

If an online save fails, the sync message explains it and your device draft remains available. Choose the sync message to review and publish again. Reloading the site returns to the public view; reconnect owner mode to recover pending device drafts. Review recovered drafts before publishing.

Hidden records remain stored in a public website/repository; hiding is a presentation choice. Only upload files you intend to share. The imported résumé is the original supplied document, including its printed contact/reference information. Transcripts, the payment receipt and duplicate certificate files were not imported.

For a local preview, run `powershell -ExecutionPolicy Bypass -File ./serve.ps1` and open http://localhost:8080.
