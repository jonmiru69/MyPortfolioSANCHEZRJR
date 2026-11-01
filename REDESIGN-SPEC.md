# Ramelito Sanchez · A living record of inquiry

## Brief and argument
Redesign the existing professional teaching portfolio for school leaders, colleagues and research collaborators. The mood is scholarly, personal, assured. Preserve the vanilla JavaScript module application, hash routes, certificate filters and lightbox, original résumé, owner tools, draft storage and cloud publishing. No new framework or animation dependency.

The subject inventory is specific: Ramelito Jr. C. Sanchez; preferred name Sir Johnmil; science and research teaching at Colegio de Sto. Tomas-Recoletos; a 2025 science education degree from CPSU San Carlos; 360 hours of pre-service teaching at Julio Ledesma National High School; undergraduate research comparing sugarcane bagasse and corn stalks as biofuel; original professional-learning certificates; a supplied portrait; a licensure rating recorded as 92.60; and the owner's editable evidence archive.

The argument follows the evidence. The hero introduces the educator through his name and portrait. The biography explains his preparation. A research feature exposes the actual thesis subject. The learning gallery proves continuing development with original documents. An index provides the full existing portfolio. Contact closes with the actual faculty email. No awards, student outcomes, endorsements or availability claims are invented.

On this page, Sanchez's original professional documents become exhibits in a reading room. The live interaction is a subject selector for the featured certificate gallery: visitors choose All learning, Science, or Technology and inspect the original documents. All previews remain available with JavaScript controls progressively added to already rendered content.

## Direction and hierarchy
Use the dealt dark-room direction, Imbue display with Albert Sans body, and lunar/bronze palette. The hero blueprint is adapted to the supplied square portrait: an unframed portrait occupies the right 40% of the upper stage, while an introduction occupies the left. The full name sits beneath this stage as a large two-line masthead. A full-bleed landscape portrait would require a photograph that does not exist; do not invent a classroom scene or stretch the supplied square image. All later sections retain a single ground with lit documents, varied scale and generous separation. The contact section keeps the dark ground in accordance with the direction's priority over its inverse-colour section blueprint.

## Tokens and type
Ground #111111, surface #1c1c1c, ink #f2f2f2, secondary #b9b5b0, bronze #c6ab91. Light-mode counterpart #f1f0ec ground, #ffffff paper, #202420 ink and #555a53 secondary. Set html and body background immediately. Display font Imbue 400; body Albert Sans 400/500. Load exact Google Fonts family URL in index.html. Existing font variables map all inner routes and editor forms to these two families. Avoid a third family.

Desktop masthead clamp(76px,10.5vw,156px), line-height .9, tracking -.025em, with two intentional lines: Ramelito Jr. / C. Sanchez. Upper stage body is 20px/1.55, bounded to 32ch. Supporting role is 32px/1.15. Section headings clamp(40px,5vw,72px), line-height 1.02, normal display weight. Ordinary body is 18px/1.6. Navigation is 16px; secondary details are 16px. Labels use ordinary case and no wide tracking. Reading paragraphs stay below 65ch.

## Header and first viewport
Use an unboxed horizontal header: wordmark at left, existing route navigation in the middle, theme and owner controls at right. At 1100px and below the navigation becomes a second wrapping row. At 640px keep Overview, Résumé and Certificates visible, and retain Profile/Contact access in the existing More sections menu. Every interactive target has at least 44px height. The main container is 1320px maximum with clamp(20px,4vw,64px) gutters.

The upper hero stage uses 1fr / 40% columns, gap 7vw, portrait height 340px at desktop, object-fit cover and object-position 50% 33%. Keep the face entirely visible. The writing says the stored professional title and institution; the primary action is View certificates, and the supporting action is Read my résumé. Below, the name becomes the page's largest object. Avoid overlays on the name. On phones the stage is a two-column compact introduction with a 132px portrait, and the masthead stays two lines at 19vw. The primary action remains visible within the initial screen.

## Section composition
Biography uses an offset heading and a wide paragraph, 100px top spacing and 48px column gap; include the existing editable overview biography. Research uses a text-led feature: the actual thesis title in display type at 48px and a short description beside a link to the research route. This section is an honest text feature because no thesis cover or laboratory photograph is supplied.

Learning uses a 34% sticky introduction and 66% document gallery. Render four existing certificate previews, the first 100% wide and the remaining in an asymmetric two-column field. Each document retains its real title and provider and opens the existing lightbox. Buttons are flat with square corners. Provide three filter controls with aria-pressed, 44px minimum height and visible active treatment. Filter by actual certificate type/tags, with a non-destructive live result announcement. Avoid manufacturing certificate counts; derive them from loaded public records.

The full index retains all visible tabs as large text links in two columns. Use meaningful descriptions, no numbered ornaments. Contact reads Start a conversation, with the actual faculty email as a wrapping display link. Preserve the separate contact page and its working form behavior. Footer repeats the owner's identity and existing owner-access route.

## Motion and interaction
Reuse the application's IntersectionObserver reveal system. Elements enter once with opacity 0→1 and translateY(20px)→0 over 700ms, cubic-bezier(.22,1,.36,1), with 70ms sibling staggering capped at four. The portrait slowly scales 1→1.035 over 16 seconds. The masthead uses a supported CSS scroll timeline scaling 1→.96 through the hero exit, with a static fallback. Hover/focus shifts links by 2px and lifts document previews 4px; there are no ornamental infinite marquees. Reduced motion disables animation, transforms and smooth scrolling and always exposes all content. Filter buttons update previews without animation and preserve focus.

## Acceptance
Check 1440, 768 and 390px, plus 320px and keyboard navigation. Verify no horizontal overflow, both themes, all visible routes, certificate filtering/lightbox, résumé rendering, owner entry/exit and unchanged storage tests. Test the actual cloud-backed view as well as a local synthetic configuration where relevant. Archive originals and create before/after screenshots. Do not place skill sponsorship in site files. Publish the redesigned preview privately; provide repository-ready source separately so the original public site can be reviewed before replacement.
