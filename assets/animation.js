const paths = [...document.querySelectorAll('#art svg path')];
const byId = id => document.getElementById(id);
const weights = paths.map(p => Math.max(1, Math.min(45, Math.sqrt(p.getAttribute('d').length) / 4)));
const ends = []; let total = 0;
weights.forEach(w => { total += w; ends.push(total); });
paths.forEach(p => { p.style.visibility = 'hidden'; p.setAttribute('pathLength', '1'); });
let position = 0, running = false, lastTime = 0, completed = 0, active = -1, frame = 0;
let shownCodeIndex = -1, currentCode = '';
function showCode(index) {
  if (index === shownCodeIndex) return;
  shownCodeIndex = index;
  const path = paths[index];
  const clean = path.cloneNode(false);
  clean.removeAttribute('style');
  clean.removeAttribute('pathLength');
  currentCode = clean.outerHTML;
  byId('code').textContent = currentCode;
  byId('code-title').textContent = `第 ${(index + 1).toLocaleString()} / ${paths.length.toLocaleString()} 笔`;
  byId('code-meta').textContent = `路径 ID：${path.id || '未命名'}  ·  填色：${path.getAttribute('fill') || '继承'}`;
  byId('code').scrollTop = 0;
}
function resetPath(p) { p.style.visibility = 'hidden'; p.style.fillOpacity = ''; p.style.stroke = ''; p.style.strokeDasharray = ''; p.style.strokeDashoffset = ''; }
function finishPath(p) { p.style.visibility = 'visible'; p.style.fillOpacity = ''; p.style.stroke = ''; p.style.strokeDasharray = ''; p.style.strokeDashoffset = ''; }
function render(force = false) {
  const value = position * total;
  let lo = 0, hi = ends.length;
  while (lo < hi) { const mid = (lo + hi) >> 1; if (ends[mid] <= value) lo = mid + 1; else hi = mid; }
  const count = lo;
  if (force || count < completed) {
    paths.forEach((p, i) => i < count ? finishPath(p) : resetPath(p));
  } else {
    for (let i = completed; i < count; i++) finishPath(paths[i]);
    if (active >= count && active !== count) resetPath(paths[active]);
  }
  completed = count; active = count < paths.length ? count : -1;
  showCode(active < 0 ? paths.length - 1 : active);
  if (active >= 0) {
    const p = paths[active], start = active ? ends[active - 1] : 0;
    const t = Math.min(1, Math.max(0, (value - start) / weights[active]));
    p.style.visibility = t > 0 ? 'visible' : 'hidden';
    p.style.stroke = '#466a91'; p.style.strokeWidth = '1.5';
    p.style.strokeLinecap = 'round'; p.style.strokeLinejoin = 'round';
    p.style.strokeDasharray = '1'; p.style.strokeDashoffset = String(1 - Math.min(1, t / .75));
    p.style.fillOpacity = String(Math.max(0, (t - .7) / .3));
  }
  byId('seek').value = position * 1000;
  byId('status').textContent = `${(position * 100).toFixed(1)}% · ${count.toLocaleString()} / ${paths.length.toLocaleString()} 笔`;
  byId('toggle').textContent = running ? '暂停' : position >= 1 ? '重新播放' : '开始 / 继续';
}
function tick(now) {
  if (!running) return;
  if (lastTime) position = Math.min(1, position + (now - lastTime) / (Number(byId('duration').value) * 1000));
  lastTime = now;
  if (position >= 1) running = false;
  render(); if (running) frame = requestAnimationFrame(tick);
}
byId('toggle').onclick = () => { cancelAnimationFrame(frame); running = !running; if (running) { if (position >= 1) { position = 0; render(true); } lastTime = 0; frame = requestAnimationFrame(tick); } render(); };
byId('restart').onclick = () => { cancelAnimationFrame(frame); running = false; position = 0; render(true); };
byId('seek').oninput = e => { position = Number(e.target.value) / 1000; lastTime = 0; render(true); };
byId('finish').onclick = () => { cancelAnimationFrame(frame); running = false; position = 1; render(true); };
function goToPath(index) {
  cancelAnimationFrame(frame); running = false; lastTime = 0;
  const target = Math.max(0, Math.min(paths.length - 1, index));
  position = ((target ? ends[target - 1] : 0) + weights[target] * .5) / total;
  render(true);
}
byId('prev-path').onclick = () => goToPath((active < 0 ? paths.length : active) - 1);
byId('next-path').onclick = () => goToPath(active < 0 ? paths.length - 1 : active + 1);
byId('copy-code').onclick = async () => {
  try {
    await navigator.clipboard.writeText(currentCode);
    byId('copy-code').textContent = '已复制';
  } catch {
    const selection = getSelection();
    const range = document.createRange();
    range.selectNodeContents(byId('code'));
    selection.removeAllRanges(); selection.addRange(range);
    byId('copy-code').textContent = '已选中代码';
  }
  setTimeout(() => byId('copy-code').textContent = '复制本笔代码', 1800);
};
document.addEventListener('visibilitychange', () => { lastTime = 0; });
byId('fullscreen').onclick = () => { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen?.(); };
render();
