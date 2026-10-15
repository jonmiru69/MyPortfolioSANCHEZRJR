/**
 * Accessible Modal Lightbox
 * For previewing sheet protector evidence files, certificates, and images.
 */

export function openLightbox(evidenceItem) {
  // Remove any existing lightbox
  const existing = document.querySelector('.lightbox-backdrop');
  if (existing) existing.remove();

  const backdrop = document.createElement('div');
  backdrop.className = 'lightbox-backdrop';
  backdrop.setAttribute('role', 'dialog');
  backdrop.setAttribute('aria-modal', 'true');
  backdrop.setAttribute('aria-label', evidenceItem.label || 'Evidence Document');

  const content = document.createElement('div');
  content.className = 'lightbox-content';

  const closeBtn = document.createElement('button');
  closeBtn.className = 'lightbox-close-btn';
  closeBtn.innerHTML = '&times;';
  closeBtn.setAttribute('aria-label', 'Close lightbox');
  closeBtn.onclick = () => backdrop.remove();

  const isDoc = evidenceItem.type === 'document' || (evidenceItem.file && evidenceItem.file.endsWith('.pdf'));

  const img = document.createElement('img');
  img.className = 'lightbox-img';
  img.src = evidenceItem.file || 'assets/docs/sample-certificate.svg';
  img.alt = evidenceItem.label || 'Document preview';

  const bar = document.createElement('div');
  bar.className = 'lightbox-bar';

  const labelSpan = document.createElement('span');
  labelSpan.innerHTML = `<strong>${evidenceItem.label || 'Evidence Document'}</strong>`;

  const contextSpan = document.createElement('span');
  contextSpan.className = 'text-muted';
  contextSpan.textContent = evidenceItem.context ? ` · ${evidenceItem.context}` : '';

  const downloadLink = document.createElement('a');
  downloadLink.href = evidenceItem.file || '#';
  downloadLink.download = (evidenceItem.label || 'evidence').toLowerCase().replace(/\s+/g, '-');
  downloadLink.className = 'btn btn-primary btn-sm';
  downloadLink.innerHTML = `Download File`;

  bar.appendChild(labelSpan);
  if (evidenceItem.context) bar.appendChild(contextSpan);
  bar.appendChild(downloadLink);

  content.appendChild(closeBtn);
  content.appendChild(img);
  content.appendChild(bar);
  backdrop.appendChild(content);

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) backdrop.remove();
  });

  document.body.appendChild(backdrop);
  closeBtn.focus();
}
