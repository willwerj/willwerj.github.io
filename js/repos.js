async function loadRepositories() {
  const container = document.getElementById('repos-container');
  if (!container) return;

  const username = 'willwerj';
  const apiUrl = `https://api.github.com/users/${username}/repos?sort=updated&per_page=30&type=public`;

  try {
    const response = await fetch(apiUrl, {
      headers: { 'Accept': 'application/vnd.github.v3+json' }
    });

    if (!response.ok) {
      throw new Error(`GitHub API responded with status ${response.status}`);
    }

    const repos = await response.json();
    const filtered = repos.filter(r => !r.fork).sort((a, b) => b.stargazers_count - a.stargazers_count);

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="state-placeholder">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"/>
          </svg>
          <p>No public repositories found yet.</p>
        </div>`;
      return;
    }

    container.innerHTML = `<div class="cards-grid">${filtered.map(repoCard).join('')}</div>`;
  } catch (err) {
    container.innerHTML = `
      <div class="state-placeholder">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="12" cy="12" r="9"/><path stroke-linecap="round" d="M12 8v4m0 4h.01"/>
        </svg>
        <p>Could not load repositories. Please try again later.</p>
      </div>`;
    console.error('Failed to load repositories:', err);
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function repoCard(repo) {
  const lang = repo.language ? `<span class="lang-tag">${escapeHtml(repo.language)}</span>` : '';
  const desc = repo.description ? escapeHtml(repo.description) : 'No description provided.';
  const stars = `
    <span class="repo-stat">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"/>
      </svg>
      ${repo.stargazers_count}
    </span>`;
  const forks = `
    <span class="repo-stat">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M7 6a2 2 0 100-4 2 2 0 000 4zm10 0a2 2 0 100-4 2 2 0 000 4zm-5 12a2 2 0 100-4 2 2 0 000 4zM7 6v3m10-3v3M12 18v-3M7 9a5 5 0 005 5h0a5 5 0 005-5"/>
      </svg>
      ${repo.forks_count}
    </span>`;

  return `
    <div class="card">
      <span class="card__badge">Repository</span>
      <h3 class="card__title">${escapeHtml(repo.name)}</h3>
      <p class="card__description">${desc}</p>
      <div class="card__footer">
        <a href="${escapeHtml(repo.html_url)}" class="btn btn--primary" target="_blank" rel="noopener noreferrer">
          View on GitHub
        </a>
        ${lang}
        ${stars}
        ${forks}
      </div>
    </div>`;
}

document.addEventListener('DOMContentLoaded', loadRepositories);
