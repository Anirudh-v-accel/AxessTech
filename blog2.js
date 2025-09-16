(function () {
  const cfg = window.STRAPI_CONFIG || {};
  const BASE = (cfg.baseUrl || '').replace(/\/$/, '');
  const TOKEN = cfg.apiToken || '';
  const PAGE_SIZE = Number(cfg.pageSize || 6);

  function qs(sel) {
    return document.querySelector(sel);
  }
  function qsa(sel) {
    return Array.from(document.querySelectorAll(sel));
  }
  function setWarning(msg) {
    const el = qs('#strapiWarning');
    if (el) {
      el.style.display = 'block';
      el.textContent = msg;
    }
  }
  function clearWarning() {
    const el = qs('#strapiWarning');
    if (el) el.style.display = 'none';
  }
  function formatDate(iso) {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });
    } catch {
      return '';
    }
  }
  function imgUrl(maybe) {
    if (!maybe) return '';
    // Strapi returns either absolute or relative URLs for media
    if (/^https?:\/\//i.test(maybe)) return maybe;
    if (!BASE) return maybe; // fallback
    return `${BASE}${maybe}`;
  }
  function buildUrl(path, params = {}) {
    const usp = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v === undefined || v === null || v === '') return;
      usp.append(k, String(v));
    });
    return `${BASE}${path}${usp.toString() ? `?${usp.toString()}` : ''}`;
  }
  async function api(path, query = {}) {
    if (!BASE) {
      setWarning('Strapi baseUrl is not set. Open strapi-config.js and set window.STRAPI_CONFIG.baseUrl to your Strapi Cloud URL.');
      throw new Error('Missing baseUrl');
    }
    clearWarning();
    const url = buildUrl(path, query);
    const res = await fetch(url, {
      headers: TOKEN ? { Authorization: `Bearer ${TOKEN}` } : undefined,
    });
    if (!res.ok) {
      const txt = await res.text().catch(() => '');
      setWarning(`Strapi request failed (${res.status}). ${txt || ''}`);
      throw new Error(`HTTP ${res.status}`);
    }
    return res.json();
  }

  // Shape helpers (support Strapi v5 Documents API and legacy v4 attributes API)
  function doc(item) {
    // v5 returns flattened fields; v4 returns { attributes: { ... } }
    return item && (item.attributes ?? item);
  }
  function mediaUrl(m) {
    // v5: m.url; v4: m.data.attributes.url
    if (!m) return '';
    if (m.url) return imgUrl(m.url);
    const v4 = m.data?.attributes?.url;
    return v4 ? imgUrl(v4) : '';
  }
  function categoryName(cat) {
    if (!cat) return '';
    const c = cat.attributes ?? cat;
    return c?.name || c?.title || cat.data?.attributes?.name || cat.data?.attributes?.title || '';
  }
  function tagsArray(tags) {
    if (!tags) return [];
    if (Array.isArray(tags)) return tags.map((t) => t.attributes ?? t);
    if (Array.isArray(tags.data)) return tags.data.map((t) => t.attributes ?? t);
    return [];
  }

  // Query helpers
  function getQuery() {
    const url = new URL(window.location.href);
    return Object.fromEntries(url.searchParams.entries());
  }
  function setQuery(obj) {
    const url = new URL(window.location.href);
    Object.entries(obj).forEach(([k, v]) => {
      if (v === undefined || v === null || v === '') url.searchParams.delete(k);
      else url.searchParams.set(k, v);
    });
    // Reset page on filter changes
    if ('q' in obj || 'category' in obj || 'tag' in obj) url.searchParams.set('page', '1');
    window.location.href = url.toString();
  }

  // Render helpers
  function articleCard(article) {
    const a = doc(article) || {};
    const slug = a.slug;
    const title = (a.title ?? a.name ?? 'Untitled');
    const excerpt = a.excerpt || '';
    const date = formatDate(a.publishedAt || a.createdAt);
    const coverUrl = mediaUrl(a.cover);
    const catName = categoryName(a.category);

    return `
      <div class="ep-blog__card ep-blog__card--style2">
        <a href="blog-2-details.html?slug=${encodeURIComponent(slug)}" class="ep-blog__img">
          ${coverUrl ? `<img src="${coverUrl}" alt="${title.replace(/\"/g, '&quot;')}" />` : `<div style="width:100%;height:214px;border-radius:10px;background:var(--ep-offwhite-color);"></div>`}
        </a>
        <div class="ep-blog__info">
          <div class="ep-blog__content">
            <div class="ep-blog__meta">
              <ul>
                <li><i class="fi fi-rr-calendar"></i> ${date}</li>
                ${catName ? `<li><i class="fi fi-rr-folder"></i> ${catName}</li>` : ''}
              </ul>
            </div>
            <div class="ep-blog__title"><h5><a href="blog-2-details.html?slug=${encodeURIComponent(slug)}">${title}</a></h5></div>
            ${excerpt ? `<p class="ep-blog__text">${excerpt}</p>` : ''}
            <div class="ep-blog__btn"><a href="blog-2-details.html?slug=${encodeURIComponent(slug)}">Read More <i class="fi fi-rs-arrow-small-right"></i></a></div>
          </div>
        </div>
      </div>
    `;
  }

  function renderPagination(meta) {
    const el = qs('#pagination');
    if (!el) return;
    el.innerHTML = '';
    const p = meta?.pagination;
    if (!p || p.pageCount <= 1) return;

    const url = new URL(window.location.href);
    function link(page, label, active = false) {
      url.searchParams.set('page', String(page));
      const a = document.createElement('a');
      a.href = url.toString();
      a.textContent = label;
      if (active) a.classList.add('active');
      el.appendChild(a);
    }

    // Prev
    if (p.page > 1) link(p.page - 1, 'Prev');

    // Pages
    const maxToShow = 5;
    let start = Math.max(1, p.page - Math.floor(maxToShow / 2));
    let end = Math.min(p.pageCount, start + maxToShow - 1);
    if (end - start < maxToShow - 1) start = Math.max(1, end - maxToShow + 1);
    for (let i = start; i <= end; i++) link(i, String(i), i === p.page);

    // Next
    if (p.page < p.pageCount) link(p.page + 1, 'Next');
  }

  async function loadCategories() {
    const sel = qs('#categorySelect');
    if (!sel) return;
    sel.innerHTML = '<option value="">All Categories</option>';
    try {
      const data = await api('/api/categories', {
        'pagination[pageSize]': 100,
        sort: 'name:asc',
      });
      const { data: items } = data || { data: [] };
      const q = getQuery();
      items.forEach((item) => {
        const a = doc(item) || {};
        const opt = document.createElement('option');
        opt.value = a.slug;
        opt.textContent = a.name || a.title || a.slug || 'Category';
        if (q.category && q.category === a.slug) opt.selected = true;
        sel.appendChild(opt);
      });
      // Refresh Nice Select if present so newly-added options show up
      try {
        if (window.jQuery && jQuery.fn && typeof jQuery.fn.niceSelect === 'function') {
          const $sel = jQuery('#categorySelect');
          if ($sel.next('.nice-select').length) {
            $sel.niceSelect('destroy');
          }
          $sel.niceSelect();
        }
      } catch (e) {}
    } catch (e) {
      // handled by api()
    }
  }

  async function loadLatestPosts() {
    const wrap = qs('#latestPosts');
    if (!wrap) return;
    wrap.innerHTML = '';
    try {
      const resp = await api('/api/articles', {
        sort: 'publishedAt:desc',
        'pagination[pageSize]': 4,
        'populate[cover]': 'true',
      });
      const { data = [] } = resp || {};
      if (!data.length) {
        wrap.innerHTML = '<div class="ep-blog__empty">No posts yet.</div>';
        return;
      }
      wrap.innerHTML = data
        .map((it) => {
          const a = doc(it) || {};
          const title = (a.title ?? a.name ?? 'Untitled');
          const date = formatDate(a.publishedAt || a.createdAt);
          const coverUrl = mediaUrl(a.cover);
          return `
            <div class="ep-blog__latest-item">
              <div class="ep-blog__latest-img">${coverUrl ? `<img src="${coverUrl}" alt="${title}" />` : ''}</div>
              <div class="ep-blog__latest-info">
                <span><i class="fi fi-rr-calendar"></i> ${date}</span>
                <a href="blog-2-details.html?slug=${encodeURIComponent(a.slug)}">${title}</a>
              </div>
            </div>
          `;
        })
        .join('');
    } catch (e) {}
  }

  async function loadTagsCloud() {
    const ul = qs('#tagsCloud ul');
    if (!ul) return;
    ul.innerHTML = '';
    try {
      const resp = await api('/api/tags', {
        sort: 'name:asc',
        'pagination[pageSize]': 100,
      });
      const { data = [] } = resp || {};
      const q = getQuery();
      ul.innerHTML = data
        .map((t) => {
          const a = doc(t) || {};
          const active = q.tag && q.tag === a.slug;
          const href = (() => {
            const url = new URL(window.location.href);
            url.searchParams.set('tag', a.slug);
            url.searchParams.set('page', '1');
            return url.toString();
          })();
          return `<li><a href="${href}" ${active ? 'style="background: var(--ep-primary-color-2); color: #fff;"' : ''}>#${a.name || a.title || a.slug}</a></li>`;
        })
        .join('');
    } catch (e) {}
  }

  async function loadListPage() {
    await Promise.all([loadCategories(), loadLatestPosts(), loadTagsCloud()]);

    const list = qs('#blogList');
    if (!list) return;

    const q = getQuery();
    const page = Math.max(1, parseInt(q.page || '1', 10) || 1);
    const filters = {};
    if (q.q) filters['filters[title][$containsi]'] = q.q;
    if (q.category) filters['filters[category][slug][$eq]'] = q.category;
    if (q.tag) filters['filters[tags][slug][$eq]'] = q.tag;

    try {
      list.innerHTML = '<div class="ep-blog__empty">Loading...</div>';
      const resp = await api('/api/articles', {
        sort: 'publishedAt:desc',
        'pagination[page]': page,
        'pagination[pageSize]': PAGE_SIZE,
        'populate[cover]': 'true',
        'populate[category]': 'true',
        'populate[tags]': 'true',
        ...filters,
      });
      const { data = [], meta } = resp || {};
      if (!data.length) {
        list.innerHTML = '<div class="ep-blog__empty">No articles found.</div>';
      } else {
        list.innerHTML = data.map(articleCard).join('');
      }
      renderPagination(meta);
    } catch (e) {
      // error displayed by api()
    }

    const applyBtn = qs('#applyFiltersBtn');
    const searchInput = qs('#searchInput');
    const categorySelect = qs('#categorySelect');
    if (searchInput) searchInput.value = q.q || '';

    if (applyBtn) {
      applyBtn.addEventListener('click', () => {
        setQuery({ q: searchInput?.value || '', category: categorySelect?.value || '' });
      });
    }
    if (searchInput) {
      searchInput.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter') setQuery({ q: searchInput.value, category: categorySelect?.value || '' });
      });
    }
  }

  function buildDetailsHTML(a) {
    const title = (a.title ?? a.name ?? 'Untitled');
    const date = formatDate(a.publishedAt || a.createdAt);
    const catName = categoryName(a.category);
    const coverUrl = mediaUrl(a.cover);
    const contentHtml = a.content || a.body || a.description || '';
    const tags = tagsArray(a.tags);

    return `
      <div class="ep-blog__details-cover">
        <div class="ep-blog__details-cover-img">${coverUrl ? `<img src="${coverUrl}" alt="${title}" />` : `<div class="ep-blog__details-cover-placeholder"></div>`}</div>
        <div class="ep-blog__details-meta">
          <ul>
            <li><i class="fi fi-rr-calendar"></i> ${date}</li>
            ${catName ? `<li><i class=\"fi fi-rr-folder\"></i> ${catName}</li>` : ''}
          </ul>
        </div>
      </div>
      <h2 class="ep-blog__details-title">${title}</h2>
      ${contentHtml ? `<div class="ep-blog__details-content">${contentHtml}</div>` : ''}
      ${tags.length ? `<div class="ep-blog__details-navigation"><div class="ep-blog__navigation-tag"><span>Tags:</span> ${tags
        .map((t) => `<a href=\"blog-2.html?tag=${encodeURIComponent(t.slug)}\">#${t.name || t.title || t.slug}</a>`)
        .join(' ')}</div></div>` : ''}
    `;
  }

  async function loadDetailsPage() {
    await Promise.all([loadLatestPosts(), loadTagsCloud()]);

    const container = qs('#articleContainer');
    if (!container) return;

    const q = getQuery();
    const slug = q.slug;
    if (!slug) {
      container.innerHTML = '<div class="ep-blog__empty">Missing article slug.</div>';
      return;
    }

    try {
      container.innerHTML = '<div class="ep-blog__empty">Loading...</div>';
      const resp = await api('/api/articles', {
        'filters[slug][$eq]': slug,
        'populate[cover]': 'true',
        'populate[category]': 'true',
        'populate[tags]': 'true',
      });
      const item = resp?.data?.[0];
      if (!item) {
        container.innerHTML = '<div class="ep-blog__empty">Article not found.</div>';
        return;
      }
      const a = doc(item) || {};
      // Update meta title/desc
      document.title = `${(a.title ?? a.name ?? 'Article')} – Axess Technology`;
      const md = document.getElementById('meta-description');
      if (md && a.excerpt) md.setAttribute('content', a.excerpt);
      const bcTitle = qs('#breadcrumbsTitle');
      const bcActive = qs('#breadcrumbsActive');
      if (bcTitle) bcTitle.textContent = 'Blog 2';
      if (bcActive) bcActive.textContent = (a.title ?? a.name ?? 'Article');

      container.innerHTML = buildDetailsHTML(a);
    } catch (e) {
      // error shown by api
    }
  }

  function init() {
    // Only run on our two pages
    const path = window.location.pathname || '';
    if (path.endsWith('/blog-2.html') || path.endsWith('blog-2.html')) {
      loadListPage();
    } else if (path.endsWith('/blog-2-details.html') || path.endsWith('blog-2-details.html')) {
      loadDetailsPage();
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
