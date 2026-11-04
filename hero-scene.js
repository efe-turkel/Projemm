/**
 * HERO SAHNESİ — karakter + arkada kod akan monitörler
 * #hero-scene-mount içine sahneyi kurar (hero-scene.css ile birlikte kullanılır).
 */
(function () {
  'use strict';

  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // Basit sözdizimi renklendirme (k: anahtar, f: fonksiyon, s: metin, n: sayı, c: yorum)
  function hl(line) {
    let out = esc(line);
    if (/^\s*(#|--)/.test(line)) return '<span class="c">' + out + '</span>';
    out = out
      .replace(/(&#39;[^&]*?&#39;|'[^']*')/g, '<span class="s">$1</span>')
      .replace(/\b(import|from|as|def|return|SELECT|FROM|JOIN|INNER|ON|CASE|WHEN|THEN|ELSE|END|GROUP BY|ORDER BY|WITH|AS|AND|for|in|if)\b/g, '<span class="k">$1</span>')
      .replace(/\b(read_csv|merge|groupby|fit|predict|roc_auc_score|SUM|COUNT|AVG|plot|print|train_test_split|RandomForestClassifier)\b/g, '<span class="f">$1</span>')
      .replace(/\b(\d+(\.\d+)?)\b/g, '<span class="n">$1</span>');
    return out;
  }

  const PY = [
    "import pandas as pd",
    "from sklearn.ensemble import RandomForestClassifier",
    "from sklearn.metrics import roc_auc_score",
    "",
    "# Kredi portfoyu yukle",
    "df = pd.read_csv('loans.csv')",
    "df = df.merge(customers, on='id')",
    "df['dpd'] = df['days_past_due']",
    "",
    "def risk_tier(dpd):",
    "    if dpd <= 30: return 'Normal'",
    "    if dpd <= 90: return 'Watchlist'",
    "    return 'NPL'",
    "",
    "df['tier'] = df['dpd'].apply(risk_tier)",
    "X = df[features]",
    "y = df['default']",
    "model = RandomForestClassifier(300)",
    "model.fit(X_train, y_train)",
    "p = model.predict(X_test)",
    "print(roc_auc_score(y_test, p))"
  ];

  const SQL = [
    "-- risk segmentasyonu",
    "SELECT c.city,",
    "  l.loan_type,",
    "  SUM(i.amount) AS total,",
    "  CASE",
    "    WHEN i.dpd <= 30 THEN 'Normal'",
    "    WHEN i.dpd <= 90 THEN 'Watch'",
    "    ELSE 'NPL'",
    "  END AS tier",
    "FROM customers c",
    "INNER JOIN loans l ON l.cid = c.id",
    "INNER JOIN installments i",
    "  ON i.loan_id = l.id",
    "GROUP BY c.city, l.loan_type",
    "ORDER BY total DESC;",
    "",
    "WITH npl AS (",
    "  SELECT * FROM loans",
    "  WHERE dpd > 90",
    ")",
    "SELECT COUNT(*) FROM npl;"
  ];

  function codeTrack(lines) {
    const html = lines.map(hl).join('\n');
    // Kesintisiz döngü için içerik iki kez yazılır (CSS -50% kayar)
    return '<code class="mon-code-track">' + html + '\n\n' + html + '\n\n</code>';
  }

  function dashboard() {
    const bars = [
      [0.35, 0.8], [0.5, 0.95], [0.3, 0.65], [0.6, 1], [0.4, 0.75],
      [0.55, 0.9], [0.25, 0.6], [0.5, 0.85], [0.35, 0.7]
    ].map((b, i) =>
      '<span style="--b1:' + b[0] + ';--b2:' + b[1] + ';--bd:' + (2 + (i % 4) * 0.45).toFixed(2) +
      's;--bdel:' + (i * 0.18).toFixed(2) + 's"></span>'
    ).join('');

    return (
      '<div class="mon-dash">' +
        '<div class="dash-kpis">' +
          '<div class="dash-kpi">AUC<b>0.94</b></div>' +
          '<div class="dash-kpi">NPL<b>1.8%</b></div>' +
          '<div class="dash-kpi">ROWS<b>150K</b></div>' +
        '</div>' +
        '<div class="dash-bars">' + bars + '</div>' +
        '<svg class="dash-line" viewBox="0 0 120 30" preserveAspectRatio="none" aria-hidden="true">' +
          '<path d="M0,24 C12,22 18,10 30,14 C42,18 48,6 62,9 C76,12 82,20 96,12 C106,7 112,5 120,3"/>' +
        '</svg>' +
      '</div>'
    );
  }

  function bits() {
    const chars = ['</>', '{ }', '01', 'SQL', 'df', 'AUC', '=>', 'ML', '1010', 'NPL'];
    return chars.map((c, i) =>
      '<span style="--x:' + (8 + i * 9) + '%;--t:' + (8 + (i % 4) * 2) + 's;--d:' + (-i * 1.3).toFixed(1) + 's">' + esc(c) + '</span>'
    ).join('');
  }

  function build(mount) {
    const src = mount.dataset.char || 'assets/efe_character_a.png';
    const alt = mount.dataset.alt || 'Efe Fevzi Türkel';
    const bg = mount.dataset.bg || 'assets/desk_scene.jpg';
    mount.classList.add('hero-scene');
    // Sahne: masa + 3 gerçek monitör görseli; kodlar monitör ekranlarının içinde akar
    mount.innerHTML =
      '<div class="scene-stage">' +
        '<img class="scene-bg" src="' + bg + '" alt="" aria-hidden="true" draggable="false">' +
        '<div class="screen-glow g-left"></div>' +
        '<div class="screen-glow g-center"></div>' +
        '<div class="screen-glow g-right"></div>' +
        '<div class="scene-screen s-left"><div class="screen-inner">' +
          '<div class="mon-bar"><i></i><i></i><i></i><span>risk_model.py</span></div>' +
          '<div class="mon-code">' + codeTrack(PY) + '</div>' +
        '</div></div>' +
        '<div class="scene-screen s-center"><div class="screen-inner">' +
          '<div class="mon-bar"><i></i><i></i><i></i><span>credit_risk.sql</span></div>' +
          '<div class="mon-code">' + codeTrack(SQL) + '</div>' +
        '</div></div>' +
        '<div class="scene-screen s-right"><div class="screen-inner">' +
          '<div class="mon-bar"><i></i><i></i><i></i><span>dashboard.xlsx</span></div>' +
          dashboard() +
        '</div></div>' +
      '</div>' +
      '<div class="scene-backlight"></div>' +
      '<div class="scene-bits" aria-hidden="true">' + bits() + '</div>' +
      '<img class="scene-char" id="profile-img" src="' + src + '" alt="' + alt + '" draggable="false">';
  }

  document.addEventListener('DOMContentLoaded', () => {
    const mount = document.getElementById('hero-scene-mount');
    if (mount) build(mount);
  });
})();

