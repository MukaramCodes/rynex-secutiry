'use client';

import React, { useState, useRef } from 'react';
import styles from './ImageInsertBar.module.css';

interface Props {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  onContentChange: (newValue: string) => void;
}

/* ── helpers ── */
function insertAround(
  ta: HTMLTextAreaElement,
  before: string,
  after: string,
  placeholder: string,
  onChange: (v: string) => void
) {
  const start = ta.selectionStart;
  const end = ta.selectionEnd;
  const selected = ta.value.slice(start, end) || placeholder;
  const newVal = ta.value.slice(0, start) + before + selected + after + ta.value.slice(end);
  onChange(newVal);
  requestAnimationFrame(() => {
    ta.focus();
    ta.setSelectionRange(start + before.length, start + before.length + selected.length);
  });
}

function insertBlock(
  ta: HTMLTextAreaElement,
  block: string,
  onChange: (v: string) => void
) {
  const pos = ta.selectionStart;
  const before = ta.value.slice(0, pos);
  const after = ta.value.slice(pos);
  const prefix = before.length > 0 && !before.endsWith('\n') ? '\n' : '';
  const suffix = after.length > 0 && !after.startsWith('\n') ? '\n' : '';
  const newVal = before + prefix + block + suffix + after;
  onChange(newVal);
  requestAnimationFrame(() => {
    ta.focus();
    const cur = pos + prefix.length + block.length + suffix.length;
    ta.setSelectionRange(cur, cur);
  });
}

/* ── component ── */
export default function MarkdownToolbar({ textareaRef, onContentChange }: Props) {
  /* image modal state */
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [imgTab, setImgTab] = useState<'url' | 'upload'>('url');
  const [imgUrl, setImgUrl] = useState('');
  const [imgAlt, setImgAlt] = useState('');
  const [imgAlign, setImgAlign] = useState<'left' | 'center' | 'right'>('center');
  const [imgPreviewErr, setImgPreviewErr] = useState(false);
  /* upload state */
  const [uploading, setUploading] = useState(false);
  const [uploadErr, setUploadErr] = useState('');
  const [uploadedUrl, setUploadedUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* link modal state */
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');

  const ta = () => textareaRef.current!;

  /* build the final markdown/html for the image */
  const buildImageMarkdown = (url: string, alt: string, align: 'left' | 'center' | 'right') => {
    const safeAlt = alt.trim() || 'image';
    const safeUrl = url.trim();
    if (align === 'center') return `<div style="text-align:center">\n\n![${safeAlt}](${safeUrl})\n\n</div>`;
    if (align === 'right')  return `<div style="text-align:right">\n\n![${safeAlt}](${safeUrl})\n\n</div>`;
    return `![${safeAlt}](${safeUrl})`;
  };

  /* active image URL depends on which tab */
  const activeUrl = imgTab === 'upload' ? uploadedUrl : imgUrl;

  const handleInsertImage = () => {
    if (!activeUrl.trim()) return;
    insertBlock(ta(), buildImageMarkdown(activeUrl, imgAlt, imgAlign), onContentChange);
    closeImageModal();
  };

  const openImageModal = () => {
    setImgTab('url');
    setImgUrl('');
    setImgAlt('');
    setImgAlign('center');
    setImgPreviewErr(false);
    setUploadedUrl('');
    setUploadErr('');
    setImageModalOpen(true);
  };

  const closeImageModal = () => {
    setImageModalOpen(false);
    setUploading(false);
  };

  /* file upload handler */
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadErr('');
    setUploadedUrl('');
    setImgPreviewErr(false);
    try {
      const form = new FormData();
      form.append('image', file);
      const res = await fetch('/api/upload/blog-image', { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setUploadedUrl(data.url);
    } catch (err: any) {
      setUploadErr(err.message || 'Upload failed. Try again.');
    } finally {
      setUploading(false);
      // reset input so same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleInsertLink = () => {
    if (!linkUrl.trim()) return;
    const md = `[${linkText.trim() || linkUrl.trim()}](${linkUrl.trim()})`;
    const pos = ta().selectionStart;
    const before = ta().value.slice(0, pos);
    const after  = ta().value.slice(pos);
    onContentChange(before + md + after);
    setLinkModalOpen(false);
  };

  /* toolbar definition */
  const tools = [
    {
      group: 'format',
      items: [
        { icon: 'fa-bold',          title: 'Bold',          action: () => insertAround(ta(), '**', '**', 'bold text', onContentChange) },
        { icon: 'fa-italic',        title: 'Italic',        action: () => insertAround(ta(), '_', '_', 'italic text', onContentChange) },
        { icon: 'fa-strikethrough', title: 'Strikethrough', action: () => insertAround(ta(), '~~', '~~', 'text', onContentChange) },
        { icon: 'fa-code',          title: 'Inline code',   action: () => insertAround(ta(), '`', '`', 'code', onContentChange) },
      ],
    },
    {
      group: 'headings',
      items: [
        { label: 'H1', title: 'Heading 1', action: () => insertBlock(ta(), '# Heading', onContentChange) },
        { label: 'H2', title: 'Heading 2', action: () => insertBlock(ta(), '## Heading', onContentChange) },
        { label: 'H3', title: 'Heading 3', action: () => insertBlock(ta(), '### Heading', onContentChange) },
      ],
    },
    {
      group: 'lists',
      items: [
        { icon: 'fa-list-ul',     title: 'Bullet list',  action: () => insertBlock(ta(), '- List item', onContentChange) },
        { icon: 'fa-list-ol',     title: 'Ordered list', action: () => insertBlock(ta(), '1. List item', onContentChange) },
      ],
    },
    {
      group: 'blocks',
      items: [
        { icon: 'fa-quote-right', title: 'Blockquote',    action: () => insertBlock(ta(), '> Blockquote', onContentChange) },
        { icon: 'fa-minus',       title: 'Divider (---)', action: () => insertBlock(ta(), '---', onContentChange) },
        { icon: 'fa-file-code',   title: 'Code block',    action: () => insertBlock(ta(), '```\ncode here\n```', onContentChange) },
        {
          label: 'Drop Cap',
          title: 'Drop Cap — large first letter (magazine style). Select the first letter first, or it inserts a placeholder.',
          action: () => {
            const taEl = textareaRef.current;
            if (!taEl) return;
            const start = taEl.selectionStart;
            const end = taEl.selectionEnd;
            const selected = taEl.value.slice(start, end);
            // If a single letter is selected use it, otherwise use placeholder
            const letter = selected.length === 1 ? selected : 'A';
            const before = taEl.value.slice(0, start);
            const after = taEl.value.slice(end);
            const snippet = `<span class="drop-cap">${letter}</span>`;
            onContentChange(before + snippet + after);
            requestAnimationFrame(() => {
              taEl.focus();
              taEl.setSelectionRange(before.length + snippet.length, before.length + snippet.length);
            });
          },
        },
      ],
    },
    {
      group: 'media',
      items: [
        {
          icon: 'fa-link',
          title: 'Insert link',
          action: () => {
            const sel = textareaRef.current?.value.slice(
              textareaRef.current.selectionStart,
              textareaRef.current.selectionEnd
            ) || '';
            setLinkText(sel);
            setLinkUrl('');
            setLinkModalOpen(true);
          },
        },
        { icon: 'fa-image', title: 'Insert image', action: openImageModal, highlight: true },
      ],
    },
  ];

  /* preview url shown in the modal */
  const previewUrl = activeUrl;

  return (
    <>
      {/* ── Toolbar ── */}
      <div className={styles.toolbar} role="toolbar" aria-label="Markdown editor toolbar">
        {tools.map((group, gi) => (
          <React.Fragment key={group.group}>
            {gi > 0 && <span className={styles.divider} aria-hidden="true" />}
            {group.items.map((item) => (
              <button
                key={item.title}
                type="button"
                className={`${styles.btn} ${(item as any).highlight ? styles.btnAccent : ''}`}
                title={item.title}
                aria-label={item.title}
                onClick={item.action}
              >
                {(item as any).icon
                  ? <i className={`fas ${(item as any).icon}`} aria-hidden="true" />
                  : <span className={styles.labelBtn}>{(item as any).label}</span>
                }
              </button>
            ))}
          </React.Fragment>
        ))}
      </div>

      {/* ── Image modal ── */}
      {imageModalOpen && (
        <div className={styles.modalOverlay} onClick={closeImageModal}>
          <div className={styles.modal} onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Insert image">

            {/* Header */}
            <div className={styles.modalHeader}>
              <i className="fas fa-image" aria-hidden="true" />
              <span>Insert Image</span>
              <button type="button" className={styles.modalClose} onClick={closeImageModal} aria-label="Close">
                <i className="fas fa-times" />
              </button>
            </div>

            {/* Tab switcher */}
            <div className={styles.tabs}>
              <button
                type="button"
                className={`${styles.tab} ${imgTab === 'url' ? styles.tabActive : ''}`}
                onClick={() => { setImgTab('url'); setImgPreviewErr(false); }}
              >
                <i className="fas fa-link" aria-hidden="true" /> Image URL
              </button>
              <button
                type="button"
                className={`${styles.tab} ${imgTab === 'upload' ? styles.tabActive : ''}`}
                onClick={() => { setImgTab('upload'); setImgPreviewErr(false); }}
              >
                <i className="fas fa-upload" aria-hidden="true" /> Upload from Device
              </button>
            </div>

            <div className={styles.modalBody}>
              {/* ── URL tab ── */}
              {imgTab === 'url' && (
                <div className={styles.field}>
                  <label className={styles.fieldLabel}>Image URL *</label>
                  <input
                    autoFocus
                    type="url"
                    className={styles.fieldInput}
                    value={imgUrl}
                    onChange={e => { setImgUrl(e.target.value); setImgPreviewErr(false); }}
                    placeholder="https://example.com/photo.jpg  or  /images/blog/photo.png"
                    onKeyDown={e => e.key === 'Enter' && handleInsertImage()}
                  />
                </div>
              )}

              {/* ── Upload tab ── */}
              {imgTab === 'upload' && (
                <div className={styles.field}>
                  <label className={styles.fieldLabel}>Choose image from your device</label>

                  {/* Drop zone */}
                  <div
                    className={`${styles.dropZone} ${uploading ? styles.dropZoneLoading : ''}`}
                    onClick={() => !uploading && fileInputRef.current?.click()}
                    onDragOver={e => e.preventDefault()}
                    onDrop={e => {
                      e.preventDefault();
                      const f = e.dataTransfer.files[0];
                      if (f) {
                        const syntheticEvt = { target: { files: [f] } } as any;
                        handleFileChange(syntheticEvt);
                      }
                    }}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                      className={styles.fileHidden}
                      onChange={handleFileChange}
                    />
                    {uploading ? (
                      <div className={styles.uploadingState}>
                        <i className="fas fa-spinner fa-spin" />
                        <span>Uploading…</span>
                      </div>
                    ) : uploadedUrl ? (
                      <div className={styles.uploadSuccess}>
                        <i className="fas fa-check-circle" />
                        <span>Uploaded! Click to replace</span>
                      </div>
                    ) : (
                      <div className={styles.dropZoneContent}>
                        <i className="fas fa-cloud-upload-alt" />
                        <span>Click or drag &amp; drop an image here</span>
                        <span className={styles.dropZoneHint}>JPG, PNG, WebP, GIF, SVG — max 5 MB</span>
                      </div>
                    )}
                  </div>

                  {uploadErr && (
                    <div className={styles.uploadErrMsg}>
                      <i className="fas fa-exclamation-triangle" /> {uploadErr}
                    </div>
                  )}
                </div>
              )}

              {/* Alt text — shared */}
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Alt text <span className={styles.optional}>(accessibility & SEO)</span></label>
                <input
                  type="text"
                  className={styles.fieldInput}
                  value={imgAlt}
                  onChange={e => setImgAlt(e.target.value)}
                  placeholder="Describe the image…"
                  onKeyDown={e => e.key === 'Enter' && handleInsertImage()}
                />
              </div>

              {/* Alignment — shared */}
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Alignment</label>
                <div className={styles.alignGroup}>
                  {(['left', 'center', 'right'] as const).map(a => (
                    <button
                      key={a}
                      type="button"
                      className={`${styles.alignBtn} ${imgAlign === a ? styles.alignBtnActive : ''}`}
                      onClick={() => setImgAlign(a)}
                      aria-pressed={imgAlign === a}
                      title={`Align ${a}`}
                    >
                      <i className={`fas fa-align-${a}`} aria-hidden="true" />
                      <span>{a.charAt(0).toUpperCase() + a.slice(1)}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Live preview */}
              {previewUrl && (
                <div className={styles.previewArea}>
                  <span className={styles.previewLabel}>Preview</span>
                  {imgPreviewErr ? (
                    <div className={styles.previewErr}>
                      <i className="fas fa-exclamation-triangle" />
                      Cannot load image — check the URL
                    </div>
                  ) : (
                    <div style={{ textAlign: imgAlign, padding: '6px' }}>
                      <img
                        src={previewUrl}
                        alt={imgAlt || 'preview'}
                        className={styles.previewImg}
                        style={{ display: 'inline-block' }}
                        onError={() => setImgPreviewErr(true)}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Output preview */}
              <div className={styles.mdPreview}>
                <i className="fas fa-code" aria-hidden="true" />
                <code>
                  {previewUrl
                    ? buildImageMarkdown(previewUrl, imgAlt, imgAlign).replace(/\n/g, ' ')
                    : '![image](url)'}
                </code>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button type="button" className={styles.cancelBtn} onClick={closeImageModal}>Cancel</button>
              <button
                type="button"
                className={styles.insertBtn}
                onClick={handleInsertImage}
                disabled={!activeUrl.trim() || uploading}
              >
                <i className="fas fa-plus" aria-hidden="true" />
                Insert Image
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Link modal ── */}
      {linkModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setLinkModalOpen(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Insert link">
            <div className={styles.modalHeader}>
              <i className="fas fa-link" aria-hidden="true" />
              <span>Insert Link</span>
              <button type="button" className={styles.modalClose} onClick={() => setLinkModalOpen(false)} aria-label="Close">
                <i className="fas fa-times" />
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>URL *</label>
                <input
                  autoFocus
                  type="url"
                  className={styles.fieldInput}
                  value={linkUrl}
                  onChange={e => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  onKeyDown={e => e.key === 'Enter' && handleInsertLink()}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Link text <span className={styles.optional}>(optional)</span></label>
                <input
                  type="text"
                  className={styles.fieldInput}
                  value={linkText}
                  onChange={e => setLinkText(e.target.value)}
                  placeholder="Click here"
                  onKeyDown={e => e.key === 'Enter' && handleInsertLink()}
                />
              </div>
              <div className={styles.mdPreview}>
                <i className="fas fa-code" aria-hidden="true" />
                <code>[{linkText || 'link text'}]({linkUrl || 'url'})</code>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button type="button" className={styles.cancelBtn} onClick={() => setLinkModalOpen(false)}>Cancel</button>
              <button type="button" className={styles.insertBtn} onClick={handleInsertLink} disabled={!linkUrl.trim()}>
                <i className="fas fa-link" aria-hidden="true" />
                Insert Link
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
