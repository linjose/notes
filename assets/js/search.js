(function(){
  const input = document.getElementById('q');
  if(!input) return;
  let cache = null;
  async function load(){
    if(cache) return cache;
    const res = await fetch((window.__baseurl || '') + '{{ "/search.json" }}'.replace(/\/{2,}/g,'/'));
    cache = await res.json();
    return cache;
  }
  function filter(q, list){
    q = (q||'').trim().toLowerCase();
    if(!q) return list;
    return list.filter(p => (p.title||'').toLowerCase().includes(q)
      || (p.tags||[]).join(' ').toLowerCase().includes(q)
      || (p.excerpt||'').toLowerCase().includes(q));
  }
  function rerender(items){
    const wrap = document.querySelector('.home');
    if(!wrap) return;
    if(items.length === 0){
      wrap.innerHTML = `<p style="color:var(--muted)">找不到符合「${input.value}」的文章。</p>`;
      return;
    }
    wrap.innerHTML = items.map(p => `
      <article class="card">
        <a href="${p.url}"><h2>${p.title}</h2></a>
        <div class="meta">
          <span>${new Date(p.date).toLocaleDateString(undefined,{year:'numeric',month:'short',day:'numeric'})}</span>
        </div>
        <p style="color:var(--muted)">${p.excerpt||''}</p>
        ${(p.tags||[]).map(t=>`<span class='tag'>${t}</span>`).join('')}
      </article>
    `).join('');
  }
  input.addEventListener('input', async (e)=>{
    const list = await load();
    rerender(filter(e.target.value, list));
  });
})();