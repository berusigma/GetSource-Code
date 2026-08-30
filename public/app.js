/**
 * RSOURCE - Ultra Website Source Code Extractor & Inspector
 * Core JavaScript Logic
 */

// State Management
const state = {
  targetUrl: '',
  parsedDomain: '',
  htmlRaw: '',
  htmlFormatted: '',
  title: '',
  metadata: {},
  scripts: [], // { type: 'inline'|'external', url: string, content: string, name: string }
  styles: [],   // { type: 'inline'|'external', url: string, content: string, name: string }
  media: [],    // { type: 'img'|'svg'|'icon', url: string, name: string }
  linksCount: 0,
  activeJsIndex: 0,
  activeCssIndex: 0,
  isFetching: false,
  wrapLines: false
};

// UI Element Cache
const elements = {
  fetchForm: document.getElementById('fetchForm'),
  urlInput: document.getElementById('urlInput'),
  btnFetch: document.getElementById('btnFetch'),
  btnPaste: document.getElementById('btnPaste'),
  btnClear: document.getElementById('btnClear'),
  proxySelect: document.getElementById('proxySelect'),
  statusBanner: document.getElementById('statusBanner'),
  statusMessage: document.getElementById('statusMessage'),
  statusIcon: document.getElementById('statusIcon'),
  statusTags: document.getElementById('statusTags'),
  inspectorCard: document.getElementById('inspectorCard'),
  toastContainer: document.getElementById('toastContainer'),
  
  // Tab Elements
  tabBtns: document.querySelectorAll('.tab-btn'),
  tabContents: document.querySelectorAll('.tab-content'),
  
  // Badges & Stats
  badgeHtml: document.getElementById('badgeHtml'),
  badgeScripts: document.getElementById('badgeScripts'),
  badgeStyles: document.getElementById('badgeStyles'),
  badgeMedia: document.getElementById('badgeMedia'),
  statHtmlSize: document.getElementById('statHtmlSize'),
  statJsCount: document.getElementById('statJsCount'),
  statCssCount: document.getElementById('statCssCount'),
  statMediaCount: document.getElementById('statMediaCount'),
  
  // Meta Table
  metaUrl: document.getElementById('metaUrl'),
  metaTitle: document.getElementById('metaTitle'),
  metaDescription: document.getElementById('metaDescription'),
  metaFavicon: document.getElementById('metaFavicon'),
  metaLinksCount: document.getElementById('metaLinksCount'),
  
  // Viewers
  htmlCodeViewer: document.getElementById('htmlCodeViewer'),
  htmlCodeContainer: document.getElementById('htmlCodeContainer'),
  jsListContainer: document.getElementById('jsListContainer'),
  jsCodeViewer: document.getElementById('jsCodeViewer'),
  jsSelectedTitle: document.getElementById('jsSelectedTitle'),
  cssListContainer: document.getElementById('cssListContainer'),
  cssCodeViewer: document.getElementById('cssCodeViewer'),
  cssSelectedTitle: document.getElementById('cssSelectedTitle'),
  assetGridContainer: document.getElementById('assetGridContainer'),
  previewIframe: document.getElementById('previewIframe'),
  iframeBox: document.getElementById('iframeBox'),
  
  // Buttons
  btnQuickZip: document.getElementById('btnQuickZip'),
  btnQuickCopyHtml: document.getElementById('btnQuickCopyHtml'),
  btnFormatHtml: document.getElementById('btnFormatHtml'),
  btnToggleWrapHtml: document.getElementById('btnToggleWrapHtml'),
  btnCopyHtml: document.getElementById('btnCopyHtml'),
  btnDownloadHtml: document.getElementById('btnDownloadHtml'),
  btnFormatJs: document.getElementById('btnFormatJs'),
  btnCopyJs: document.getElementById('btnCopyJs'),
  btnDownloadJs: document.getElementById('btnDownloadJs'),
  btnFormatCss: document.getElementById('btnFormatCss'),
  btnCopyCss: document.getElementById('btnCopyCss'),
  btnDownloadCss: document.getElementById('btnDownloadCss'),
  btnRefreshFrame: document.getElementById('btnRefreshFrame'),
  btnOpenNewTab: document.getElementById('btnOpenNewTab'),
  btnDownloadZipFull: document.getElementById('btnDownloadZipFull'),
  btnDlHtmlOnly: document.getElementById('btnDlHtmlOnly'),
  btnDlJsBundle: document.getElementById('btnDlJsBundle'),
  btnDlCssBundle: document.getElementById('btnDlCssBundle'),
  searchHtmlInput: document.getElementById('searchHtml')
};

// Helper: Haptic Feedback (Capacitor Native Support)
async function triggerHaptic() {
  try {
    if (window.Capacitor && window.Capacitor.isPluginAvailable("Haptics")) {
      await window.Capacitor.Plugins.Haptics.impact({ style: "LIGHT" });
    }
  } catch (e) {
    // Ignore in standard web browsers
  }
}

// Helper: Toast Notifications
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  let iconClass = 'fa-info-circle';
  if (type === 'success') iconClass = 'fa-check-circle';
  if (type === 'error') iconClass = 'fa-exclamation-triangle';
  
  toast.innerHTML = `<i class="fa-solid ${iconClass}"></i> <span>${message}</span>`;
  elements.toastContainer.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Helper: Format Bytes to KB/MB
function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Helper: Normalize URL
function normalizeUrl(input) {
  let url = input.trim();
  if (!url) return '';
  if (!/^https?:\/\//i.test(url)) {
    url = 'https://' + url;
  }
  return url;
}

// Helper: Resolve Relative to Absolute URL
function resolveAbsoluteUrl(relative, base) {
  try {
    return new URL(relative, base).href;
  } catch (e) {
    return relative;
  }
}

// Helper: CORS Proxy Fetcher
async function fetchWithProxy(targetUrl, selectedProxy) {
  const startTime = performance.now();
  let proxyUrl = '';
  
  // Capacitor Native Http check
  if (window.Capacitor && window.Capacitor.isPluginAvailable("CapacitorHttp")) {
    try {
      const response = await window.Capacitor.Plugins.CapacitorHttp.get({ url: targetUrl });
      const duration = Math.round(performance.now() - startTime);
      return { html: response.data, status: response.status || 200, duration, proxyUsed: 'Capacitor Native Http' };
    } catch (err) {
      console.warn("CapacitorHttp failed, falling back to web proxies...", err);
    }
  }

  // Web Proxies Fallback Sequence
  const proxyList = [];
  if (selectedProxy === 'allorigins') {
    proxyList.push(`https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`);
  } else if (selectedProxy === 'corsproxy') {
    proxyList.push(`https://corsproxy.io/?${encodeURIComponent(targetUrl)}`);
  } else if (selectedProxy === 'codetabs') {
    proxyList.push(`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(targetUrl)}`);
  } else if (selectedProxy === 'direct') {
    proxyList.push(targetUrl);
  } else {
    // Auto Mode: try allorigins, then corsproxy, then codetabs, then direct
    proxyList.push(
      `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`,
      `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`,
      `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(targetUrl)}`,
      targetUrl
    );
  }

  let lastError = null;
  for (const url of proxyList) {
    try {
      const res = await fetch(url, { headers: { 'Accept': 'text/html,application/xhtml+xml,application/xml' } });
      if (res.ok) {
        const text = await res.text();
        const duration = Math.round(performance.now() - startTime);
        return { html: text, status: res.status, duration, proxyUsed: url };
      }
    } catch (err) {
      lastError = err;
    }
  }

  throw new Error(lastError ? lastError.message : 'Gagal mengakses URL melalui proxy.');
}

// MAIN EXTRACTION FUNCTION
async function extractWebsiteSource(rawUrl) {
  const targetUrl = normalizeUrl(rawUrl);
  if (!targetUrl) {
    showToast('Masukkan URL website yang valid!', 'error');
    return;
  }

  state.targetUrl = targetUrl;
  try {
    state.parsedDomain = new URL(targetUrl).hostname;
  } catch (e) {
    state.parsedDomain = 'website';
  }

  // Update UI Loading State
  state.isFetching = true;
  elements.btnFetch.disabled = true;
  elements.btnFetch.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> <span>Extracting...</span>';
  
  elements.statusBanner.className = 'status-banner loading';
  elements.statusIcon.className = 'fa-solid fa-circle-notch fa-spin';
  elements.statusMessage.innerText = `Sedang mengambil source code dari ${state.parsedDomain}...`;
  elements.statusTags.innerHTML = '';

  triggerHaptic();

  try {
    const selectedProxy = elements.proxySelect.value;
    const fetchResult = await fetchWithProxy(targetUrl, selectedProxy);
    
    state.htmlRaw = fetchResult.html;

    // Parse HTML DOM
    const parser = new DOMParser();
    const doc = parser.parseFromString(state.htmlRaw, 'text/html');

    // Extract Page Title
    state.title = doc.title || state.parsedDomain;

    // Extract Metadata
    state.metadata = {
      description: doc.querySelector('meta[name="description"]')?.content || doc.querySelector('meta[property="og:description"]')?.content || 'Tidak ada deskripsi meta.',
      keywords: doc.querySelector('meta[name="keywords"]')?.content || '-',
      ogImage: doc.querySelector('meta[property="og:image"]')?.content || '',
      favicon: doc.querySelector('link[rel*="icon"]')?.href || resolveAbsoluteUrl('/favicon.ico', targetUrl)
    };

    // Count Links
    state.linksCount = doc.querySelectorAll('a[href]').length;

    // Extract Scripts
    state.scripts = [];
    const scriptElements = doc.querySelectorAll('script');
    let inlineJsCount = 0;
    
    for (let i = 0; i < scriptElements.length; i++) {
      const el = scriptElements[i];
      const src = el.getAttribute('src');
      if (src) {
        const absSrc = resolveAbsoluteUrl(src, targetUrl);
        const fileName = absSrc.split('/').pop().split('?')[0] || `script_${i + 1}.js`;
        state.scripts.push({
          type: 'external',
          url: absSrc,
          name: fileName,
          content: `// Source code external script:\n// ${absSrc}\n\n// Klik tombol Beautify / Download untuk mengambil skrip lengkap.`,
          fetched: false
        });
      } else if (el.textContent.trim()) {
        inlineJsCount++;
        state.scripts.push({
          type: 'inline',
          url: '',
          name: `Inline Script #${inlineJsCount}`,
          content: el.textContent.trim(),
          fetched: true
        });
      }
    }

    // Extract Stylesheets
    state.styles = [];
    const linkElements = doc.querySelectorAll('link[rel="stylesheet"]');
    const styleElements = doc.querySelectorAll('style');
    let inlineCssCount = 0;

    for (let i = 0; i < linkElements.length; i++) {
      const href = linkElements[i].getAttribute('href');
      if (href) {
        const absHref = resolveAbsoluteUrl(href, targetUrl);
        const fileName = absHref.split('/').pop().split('?')[0] || `style_${i + 1}.css`;
        state.styles.push({
          type: 'external',
          url: absHref,
          name: fileName,
          content: `/* External Stylesheet:\n * ${absHref}\n */`,
          fetched: false
        });
      }
    }

    for (let i = 0; i < styleElements.length; i++) {
      if (styleElements[i].textContent.trim()) {
        inlineCssCount++;
        state.styles.push({
          type: 'inline',
          url: '',
          name: `Inline Style #${inlineCssCount}`,
          content: styleElements[i].textContent.trim(),
          fetched: true
        });
      }
    }

    // Extract Media & Assets
    state.media = [];
    const imgElements = doc.querySelectorAll('img[src]');
    imgElements.forEach((img, idx) => {
      const src = img.getAttribute('src');
      if (src && !src.startsWith('data:')) {
        const absUrl = resolveAbsoluteUrl(src, targetUrl);
        const name = absUrl.split('/').pop().split('?')[0] || `image_${idx + 1}`;
        state.media.push({ type: 'img', url: absUrl, name });
      }
    });

    const svgElements = doc.querySelectorAll('svg');
    svgElements.forEach((svg, idx) => {
      state.media.push({ type: 'svg', url: '#svg', name: `Inline SVG #${idx + 1}` });
    });

    if (state.metadata.favicon) {
      state.media.unshift({ type: 'icon', url: state.metadata.favicon, name: 'Favicon Icon' });
    }

    // Update Status Banner to Success
    elements.statusBanner.className = 'status-banner success';
    elements.statusIcon.className = 'fa-solid fa-circle-check';
    elements.statusMessage.innerText = `Berhasil mengekstrak ${state.parsedDomain}!`;
    elements.statusTags.innerHTML = `
      <span class="status-tag">Status 200 OK</span>
      <span class="status-tag">${fetchResult.duration} ms</span>
      <span class="status-tag">${formatBytes(state.htmlRaw.length)}</span>
    `;

    // Format HTML Code
    if (window.html_beautify) {
      state.htmlFormatted = window.html_beautify(state.htmlRaw, { indent_size: 2 });
    } else {
      state.htmlFormatted = state.htmlRaw;
    }

    // Render All Inspector Tabs
    renderOverviewTab();
    renderHtmlTab();
    renderScriptsTab();
    renderStylesTab();
    renderMediaTab();
    renderLivePreview();

    // Show Inspector Card
    elements.inspectorCard.classList.add('active');
    elements.inspectorCard.scrollIntoView({ behavior: 'smooth', block: 'start' });

    showToast(`Extraction ${state.parsedDomain} Berhasil!`, 'success');

  } catch (error) {
    console.error("Extraction error:", error);
    elements.statusBanner.className = 'status-banner error';
    elements.statusIcon.className = 'fa-solid fa-circle-exclamation';
    elements.statusMessage.innerText = `Gagal mengekstrak: ${error.message || 'CORS restriction or network error.'}`;
    showToast(`Gagal: ${error.message}`, 'error');
  } finally {
    state.isFetching = false;
    elements.btnFetch.disabled = false;
    elements.btnFetch.innerHTML = '<i class="fa-solid fa-bolt"></i> <span>Dapatkan Source Code</span>';
  }
}

// RENDER TAB 1: OVERVIEW
function renderOverviewTab() {
  elements.badgeHtml.innerText = formatBytes(state.htmlRaw.length);
  elements.badgeScripts.innerText = state.scripts.length;
  elements.badgeStyles.innerText = state.styles.length;
  elements.badgeMedia.innerText = state.media.length;

  elements.statHtmlSize.innerText = formatBytes(state.htmlRaw.length);
  elements.statJsCount.innerText = `${state.scripts.length} File`;
  elements.statCssCount.innerText = `${state.styles.length} File`;
  elements.statMediaCount.innerText = `${state.media.length} Asset`;

  elements.metaUrl.innerText = state.targetUrl;
  elements.metaTitle.innerText = state.title;
  elements.metaDescription.innerText = state.metadata.description;
  elements.metaFavicon.innerText = state.metadata.favicon;
  elements.metaLinksCount.innerText = `${state.linksCount} link terdeteksi`;
}

// RENDER TAB 2: HTML
function renderHtmlTab() {
  elements.htmlCodeViewer.textContent = state.htmlFormatted;
  if (window.Prism) {
    Prism.highlightElement(elements.htmlCodeViewer);
  }
}

// RENDER TAB 3: SCRIPTS JS
function renderScriptsTab() {
  elements.jsListContainer.innerHTML = '';
  
  if (state.scripts.length === 0) {
    elements.jsListContainer.innerHTML = '<p style="font-size: 0.8rem; color: var(--text-muted); padding: 10px;">Tidak ada script terdeteksi.</p>';
    elements.jsCodeViewer.textContent = '// Tidak ada file JS';
    return;
  }

  state.scripts.forEach((item, idx) => {
    const div = document.createElement('div');
    div.className = `resource-item ${idx === state.activeJsIndex ? 'active' : ''}`;
    div.innerHTML = `
      <span>${item.name}</span>
      <div class="res-meta">
        <span>${item.type === 'inline' ? 'Inline Script' : 'External JS'}</span>
        <span>${item.type === 'inline' ? formatBytes(item.content.length) : 'Fetch on view'}</span>
      </div>
    `;
    div.addEventListener('click', () => selectJsScript(idx));
    elements.jsListContainer.appendChild(div);
  });

  selectJsScript(state.activeJsIndex || 0);
}

async function selectJsScript(index) {
  state.activeJsIndex = index;
  const item = state.scripts[index];
  if (!item) return;

  // Highlight active sidebar item
  const items = elements.jsListContainer.querySelectorAll('.resource-item');
  items.forEach((el, idx) => el.classList.toggle('active', idx === index));

  elements.jsSelectedTitle.innerText = item.name;

  // Fetch external script content if not fetched yet
  if (item.type === 'external' && !item.fetched) {
    elements.jsCodeViewer.textContent = `// Sedang mengunduh isi ${item.url}...`;
    try {
      const res = await fetchWithProxy(item.url, elements.proxySelect.value);
      item.content = res.html;
      item.fetched = true;
    } catch (e) {
      item.content = `// Gagal mengambil external JS: ${e.message}\n// URL: ${item.url}`;
    }
  }

  elements.jsCodeViewer.textContent = item.content;
  if (window.Prism) {
    Prism.highlightElement(elements.jsCodeViewer);
  }
}

// RENDER TAB 4: STYLES CSS
function renderStylesTab() {
  elements.cssListContainer.innerHTML = '';

  if (state.styles.length === 0) {
    elements.cssListContainer.innerHTML = '<p style="font-size: 0.8rem; color: var(--text-muted); padding: 10px;">Tidak ada stylesheet terdeteksi.</p>';
    elements.cssCodeViewer.textContent = '/* Tidak ada file CSS */';
    return;
  }

  state.styles.forEach((item, idx) => {
    const div = document.createElement('div');
    div.className = `resource-item ${idx === state.activeCssIndex ? 'active' : ''}`;
    div.innerHTML = `
      <span>${item.name}</span>
      <div class="res-meta">
        <span>${item.type === 'inline' ? 'Inline Style' : 'External CSS'}</span>
        <span>${item.type === 'inline' ? formatBytes(item.content.length) : 'Fetch on view'}</span>
      </div>
    `;
    div.addEventListener('click', () => selectCssStyle(idx));
    elements.cssListContainer.appendChild(div);
  });

  selectCssStyle(state.activeCssIndex || 0);
}

async function selectCssStyle(index) {
  state.activeCssIndex = index;
  const item = state.styles[index];
  if (!item) return;

  const items = elements.cssListContainer.querySelectorAll('.resource-item');
  items.forEach((el, idx) => el.classList.toggle('active', idx === index));

  elements.cssSelectedTitle.innerText = item.name;

  if (item.type === 'external' && !item.fetched) {
    elements.cssCodeViewer.textContent = `/* Sedang mengunduh isi stylesheet ${item.url}... */`;
    try {
      const res = await fetchWithProxy(item.url, elements.proxySelect.value);
      item.content = res.html;
      item.fetched = true;
    } catch (e) {
      item.content = `/* Gagal mengambil external CSS: ${e.message}\n * URL: ${item.url}\n */`;
    }
  }

  elements.cssCodeViewer.textContent = item.content;
  if (window.Prism) {
    Prism.highlightElement(elements.cssCodeViewer);
  }
}

// RENDER TAB 5: MEDIA & ASSETS
function renderMediaTab(filter = 'all') {
  elements.assetGridContainer.innerHTML = '';

  const filteredMedia = state.media.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'img') return item.type === 'img';
    if (filter === 'svg') return item.type === 'svg';
    if (filter === 'icon') return item.type === 'icon';
    return true;
  });

  if (filteredMedia.length === 0) {
    elements.assetGridContainer.innerHTML = '<p style="font-size: 0.85rem; color: var(--text-muted); padding: 20px;">Tidak ada asset media pada filter ini.</p>';
    return;
  }

  filteredMedia.forEach(item => {
    const card = document.createElement('div');
    card.className = 'asset-card';
    
    let previewHtml = '';
    if (item.type === 'svg') {
      previewHtml = `<div class="asset-preview-box"><i class="fa-solid fa-code-branch" style="font-size:2rem; color:var(--primary-600);"></i></div>`;
    } else {
      previewHtml = `<div class="asset-preview-box"><img src="${item.url}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/150?text=Image+Error'" /></div>`;
    }

    card.innerHTML = `
      ${previewHtml}
      <div class="asset-info">
        <div class="asset-name">${item.name}</div>
        <div class="asset-url">${item.url}</div>
      </div>
      <div class="asset-actions">
        <button class="btn-xs btn-copy-url" data-url="${item.url}"><i class="fa-solid fa-link"></i> Copy Link</button>
        ${item.url.startsWith('http') ? `<a href="${item.url}" target="_blank" class="btn-xs"><i class="fa-solid fa-arrow-up-right-from-square"></i> Open</a>` : ''}
      </div>
    `;

    card.querySelector('.btn-copy-url').addEventListener('click', (e) => {
      const urlToCopy = e.currentTarget.getAttribute('data-url');
      copyToClipboard(urlToCopy, 'Link asset berhasil disalin!');
    });

    elements.assetGridContainer.appendChild(card);
  });
}

// RENDER TAB 6: LIVE PREVIEW
function renderLivePreview() {
  if (!state.htmlRaw) return;
  
  // Set iframe srcdoc with base URL injected so images/links resolve correctly
  const baseTag = `<base href="${state.targetUrl}">`;
  let parsedHtml = state.htmlRaw;
  if (!parsedHtml.includes('<base')) {
    parsedHtml = parsedHtml.replace('<head>', `<head>${baseTag}`);
  }

  elements.previewIframe.srcdoc = parsedHtml;
}

// DOWNLOAD SYSTEM (AUTOMATIC DOWNLOAD TO DOWNLOADS DIRECTORY)
async function downloadFile(content, filename, mimeType = 'text/plain') {
  triggerHaptic();

  // Capacitor Native Filesystem Write check
  if (window.Capacitor && window.Capacitor.isPluginAvailable("Filesystem")) {
    try {
      const { Filesystem, Directory } = window.Capacitor.Plugins;
      await Filesystem.writeFile({
        path: filename,
        data: content,
        directory: Directory.Documents || Directory.Cache
      });
      showToast(`⚡ Tersimpan di perangkat native: ${filename}`, 'success');
      return;
    } catch (e) {
      console.warn("Native filesystem download fallback to Blob...", e);
    }
  }

  // Web Browser Standard Auto Download Trigger
  const blob = new Blob([content], { type: mimeType });
  if (window.saveAs) {
    window.saveAs(blob, filename);
  } else {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }
  showToast(`📥 ${filename} berhasil di-download otomatis!`, 'success');
}

// DOWNLOAD FULL ZIP PACKAGE
async function downloadFullZip() {
  if (!state.htmlRaw) {
    showToast('Silakan extract website terlebih dahulu!', 'error');
    return;
  }

  if (!window.JSZip) {
    showToast('Library JSZip belum siap.', 'error');
    return;
  }

  showToast('📦 Sedang membuat paket ZIP lengkap...', 'info');
  triggerHaptic();

  const zip = new JSZip();
  const domainClean = state.parsedDomain.replace(/[^a-z0-9]/gi, '_');
  const timestamp = new Date().toISOString().slice(0, 10);
  const folderName = `RSource_${domainClean}_${timestamp}`;

  const root = zip.folder(folderName);

  // 1. Add index.html
  root.file('index.html', state.htmlFormatted || state.htmlRaw);

  // 2. Add JS Scripts Folder
  const jsFolder = root.folder('scripts');
  for (let i = 0; i < state.scripts.length; i++) {
    const s = state.scripts[i];
    if (s.type === 'external' && !s.fetched) {
      try {
        const res = await fetchWithProxy(s.url, elements.proxySelect.value);
        s.content = res.html;
        s.fetched = true;
      } catch (e) {
        s.content = `// Gagal fetch: ${s.url}`;
      }
    }
    const jsName = s.name.endsWith('.js') ? s.name : `${s.name}.js`;
    jsFolder.file(jsName, s.content);
  }

  // 3. Add CSS Stylesheets Folder
  const cssFolder = root.folder('styles');
  for (let i = 0; i < state.styles.length; i++) {
    const st = state.styles[i];
    if (st.type === 'external' && !st.fetched) {
      try {
        const res = await fetchWithProxy(st.url, elements.proxySelect.value);
        st.content = res.html;
        st.fetched = true;
      } catch (e) {
        st.content = `/* Gagal fetch: ${st.url} */`;
      }
    }
    const cssName = st.name.endsWith('.css') ? st.name : `${st.name}.css`;
    cssFolder.file(cssName, st.content);
  }

  // 4. Add Metadata JSON Report
  const report = {
    app: 'RSource Website Source Code Extractor',
    version: '2.5 PRO',
    extractedAt: new Date().toLocaleString('id-ID'),
    targetUrl: state.targetUrl,
    domain: state.parsedDomain,
    title: state.title,
    metadata: state.metadata,
    summary: {
      htmlSizeBytes: state.htmlRaw.length,
      scriptsCount: state.scripts.length,
      stylesCount: state.styles.length,
      mediaCount: state.media.length
    },
    scriptsList: state.scripts.map(s => ({ name: s.name, type: s.type, url: s.url })),
    stylesList: state.styles.map(s => ({ name: s.name, type: s.type, url: s.url })),
    mediaList: state.media.map(m => ({ name: m.name, type: m.type, url: m.url }))
  };

  root.file('metadata.json', JSON.stringify(report, null, 2));

  // Generate ZIP Blob
  const content = await zip.generateAsync({ type: 'blob' });
  const zipFileName = `${folderName}.zip`;

  if (window.saveAs) {
    window.saveAs(content, zipFileName);
  } else {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(content);
    link.download = zipFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  showToast(`🎉 ZIP ${zipFileName} berhasil didownload!`, 'success');
}

// COPY TO CLIPBOARD HELPER
async function copyToClipboard(text, successMsg = 'Berhasil disalin ke clipboard!') {
  try {
    if (window.Capacitor && window.Capacitor.isPluginAvailable("Clipboard")) {
      await window.Capacitor.Plugins.Clipboard.write({ string: text });
    } else {
      await navigator.clipboard.writeText(text);
    }
    triggerHaptic();
    showToast(successMsg, 'success');
  } catch (err) {
    showToast('Gagal menyalin ke clipboard.', 'error');
  }
}

// EVENT LISTENERS INITIALIZATION
function initEventListeners() {

  // Fetch Form Submit
  elements.fetchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    extractWebsiteSource(elements.urlInput.value);
  });

  // Paste Button
  elements.btnPaste.addEventListener('click', async () => {
    try {
      let text = '';
      if (window.Capacitor && window.Capacitor.isPluginAvailable("Clipboard")) {
        const res = await window.Capacitor.Plugins.Clipboard.read();
        text = res.value;
      } else {
        text = await navigator.clipboard.readText();
      }
      if (text) {
        elements.urlInput.value = text;
        showToast('URL berhasil ditempel!', 'info');
      }
    } catch (e) {
      showToast('Gagal mengakses clipboard.', 'error');
    }
  });

  // Clear Input Button
  elements.btnClear.addEventListener('click', () => {
    elements.urlInput.value = '';
    elements.urlInput.focus();
  });

  // Preset Chips
  document.querySelectorAll('.preset-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const url = chip.getAttribute('data-url');
      elements.urlInput.value = url;
      extractWebsiteSource(url);
    });
  });

  // Tab Switching
  elements.tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabTarget = btn.getAttribute('data-tab');
      
      elements.tabBtns.forEach(b => b.classList.remove('active'));
      elements.tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      document.getElementById(`tab-${tabTarget}`).classList.add('active');

      triggerHaptic();
    });
  });

  // Quick Action Buttons
  elements.btnQuickZip.addEventListener('click', downloadFullZip);
  elements.btnQuickCopyHtml.addEventListener('click', () => copyToClipboard(state.htmlFormatted, 'HTML Source Code disalin!'));

  // HTML Actions
  elements.btnFormatHtml.addEventListener('click', () => {
    if (window.html_beautify) {
      state.htmlFormatted = window.html_beautify(state.htmlRaw, { indent_size: 2 });
      renderHtmlTab();
      showToast('HTML berhasil di-beautify!', 'success');
    }
  });

  elements.btnToggleWrapHtml.addEventListener('click', () => {
    state.wrapLines = !state.wrapLines;
    elements.htmlCodeContainer.classList.toggle('wrap-lines', state.wrapLines);
    showToast(state.wrapLines ? 'Line Wrap: ON' : 'Line Wrap: OFF', 'info');
  });

  elements.btnCopyHtml.addEventListener('click', () => copyToClipboard(state.htmlFormatted, 'HTML disalin!'));
  elements.btnDownloadHtml.addEventListener('click', () => downloadFile(state.htmlFormatted, `${state.parsedDomain}_index.html`, 'text/html'));

  // JS Actions
  elements.btnFormatJs.addEventListener('click', () => {
    const item = state.scripts[state.activeJsIndex];
    if (item && item.content && window.js_beautify) {
      item.content = window.js_beautify(item.content, { indent_size: 2 });
      elements.jsCodeViewer.textContent = item.content;
      if (window.Prism) Prism.highlightElement(elements.jsCodeViewer);
      showToast('JS berhasil di-beautify!', 'success');
    }
  });

  elements.btnCopyJs.addEventListener('click', () => {
    const item = state.scripts[state.activeJsIndex];
    if (item) copyToClipboard(item.content, `Script ${item.name} disalin!`);
  });

  elements.btnDownloadJs.addEventListener('click', () => {
    const item = state.scripts[state.activeJsIndex];
    if (item) downloadFile(item.content, item.name.endsWith('.js') ? item.name : `${item.name}.js`, 'application/javascript');
  });

  // CSS Actions
  elements.btnFormatCss.addEventListener('click', () => {
    const item = state.styles[state.activeCssIndex];
    if (item && item.content && window.css_beautify) {
      item.content = window.css_beautify(item.content, { indent_size: 2 });
      elements.cssCodeViewer.textContent = item.content;
      if (window.Prism) Prism.highlightElement(elements.cssCodeViewer);
      showToast('CSS berhasil di-beautify!', 'success');
    }
  });

  elements.btnCopyCss.addEventListener('click', () => {
    const item = state.styles[state.activeCssIndex];
    if (item) copyToClipboard(item.content, `Stylesheet ${item.name} disalin!`);
  });

  elements.btnDownloadCss.addEventListener('click', () => {
    const item = state.styles[state.activeCssIndex];
    if (item) downloadFile(item.content, item.name.endsWith('.css') ? item.name : `${item.name}.css`, 'text/css');
  });

  // Asset Filter Buttons
  document.querySelectorAll('.asset-filters .btn-xs').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.asset-filters .btn-xs').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      renderMediaTab(filter);
    });
  });

  // Live Preview Viewport Buttons
  document.querySelectorAll('.vp-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.vp-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const vp = btn.getAttribute('data-vp');
      elements.iframeBox.className = `iframe-container ${vp}`;
    });
  });

  elements.btnRefreshFrame.addEventListener('click', renderLivePreview);
  elements.btnOpenNewTab.addEventListener('click', () => {
    if (state.targetUrl) window.open(state.targetUrl, '_blank');
  });

  // Download Center Actions
  elements.btnDownloadZipFull.addEventListener('click', downloadFullZip);
  elements.btnDlHtmlOnly.addEventListener('click', () => downloadFile(state.htmlFormatted, `${state.parsedDomain}_index.html`, 'text/html'));
  
  elements.btnDlJsBundle.addEventListener('click', async () => {
    let combinedJs = `// Combined JavaScript Bundle from ${state.targetUrl}\n\n`;
    for (const s of state.scripts) {
      combinedJs += `/* =================== ${s.name} =================== */\n${s.content}\n\n`;
    }
    downloadFile(combinedJs, `${state.parsedDomain}_bundle.js`, 'application/javascript');
  });

  elements.btnDlCssBundle.addEventListener('click', async () => {
    let combinedCss = `/* Combined CSS Bundle from ${state.targetUrl} */\n\n`;
    for (const st of state.styles) {
      combinedCss += `/* =================== ${st.name} =================== */\n${st.content}\n\n`;
    }
    downloadFile(combinedCss, `${state.parsedDomain}_bundle.css`, 'text/css');
  });

  // Search within HTML Code
  elements.searchHtmlInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    if (!query) {
      renderHtmlTab();
      return;
    }
    const lines = state.htmlFormatted.split('\n');
    const filteredLines = lines.filter(line => line.toLowerCase().includes(query));
    elements.htmlCodeViewer.textContent = filteredLines.join('\n');
    if (window.Prism) Prism.highlightElement(elements.htmlCodeViewer);
  });
}

// APP INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
  initEventListeners();
  // Auto-extract default preset URL on launch for immediate WOW demo!
  const defaultUrl = 'https://wikipedia.org';
  elements.urlInput.value = defaultUrl;
  extractWebsiteSource(defaultUrl);
});
