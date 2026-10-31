(() => {
  const catalog = document.getElementById("catalog");
  const search = document.getElementById("search");
  const filters = document.getElementById("filters");
  const pkgUrl = document.getElementById("pkgUrl");
  const manualStatus = document.getElementById("manualStatus");
  let items = [];
  let active = "all";

  const labels = {game:"Jogo", app:"Aplicativo", dlc:"DLC", update:"Update"};
  function render() {
    const term = search.value.trim().toLocaleLowerCase("pt-BR");
    const visible = items.filter(x =>
      (active === "all" || x.type === active) &&
      (String(x.name || "").toLocaleLowerCase("pt-BR").includes(term) ||
       String(x.description || "").toLocaleLowerCase("pt-BR").includes(term))
    );
    catalog.innerHTML = "";
    if (!visible.length) {
      catalog.innerHTML = '<div class="empty">Nenhum item no catálogo. Adicione entradas em <code>catalog/apps.json</code> e publique novamente.</div>';
      return;
    }
    visible.forEach(item => {
      const card = document.createElement("article");
      card.className = "item";
      const cover = document.createElement("div");
      cover.className = "cover";
      if (item.cover) {
        const img = document.createElement("img");
        img.src = item.cover; img.alt = ""; img.loading = "lazy";
        img.style.cssText = "width:100%;height:100%;object-fit:cover";
        cover.appendChild(img);
      } else cover.textContent = "PS4";
      const body = document.createElement("div"); body.className = "item-body";
      const tag = document.createElement("div"); tag.className = "tag"; tag.textContent = labels[item.type] || "Item";
      const title = document.createElement("h3"); title.textContent = item.name || "Sem título";
      const desc = document.createElement("p"); desc.textContent = item.description || "";
      const link = document.createElement("a"); link.href = item.pkg_url || "#"; link.textContent = "Abrir arquivo PKG ↗";
      if (!item.pkg_url) { link.removeAttribute("href"); link.textContent = "Link não cadastrado"; }
      else { link.target = "_blank"; link.rel = "noopener"; }
      body.append(tag,title,desc,link); card.append(cover,body); catalog.appendChild(card);
    });
  }
  fetch("catalog/apps.json").then(r => { if (!r.ok) throw new Error("HTTP "+r.status); return r.json(); })
    .then(data => { items = Array.isArray(data.items) ? data.items : []; render(); })
    .catch(() => { catalog.innerHTML = '<div class="empty">Não foi possível carregar catalog/apps.json.</div>'; });

  search.addEventListener("input", render);
  filters.addEventListener("click", e => {
    const btn = e.target.closest("button[data-filter]"); if (!btn) return;
    active = btn.dataset.filter;
    filters.querySelectorAll("button").forEach(b => b.classList.toggle("active", b === btn));
    render();
  });
  document.getElementById("openPkg").addEventListener("click", () => {
    let url;
    try { url = new URL(pkgUrl.value); } catch { manualStatus.textContent = "Informe um endereço válido."; return; }
    if (url.protocol !== "https:") { manualStatus.textContent = "Por segurança, use um link HTTPS."; return; }
    manualStatus.textContent = "Abrindo o endereço. O navegador poderá baixar o arquivo; isso não inicia nem confirma a instalação.";
    window.open(url.href, "_blank", "noopener");
  });
})();
