(function () {
  /* ============================================================
     CONFIGURACIÓN
  ============================================================ */
  var WINDOW_MS  = 25000;   // ventana de 25 segundos
  var MAX_EVENTS = 45;      // máximo de eventos en esa ventana
  var BLOCK_MS   = 30000;   // duración del bloqueo: 60 segundos

  var LS_TIMES   = 'rl_times';    // array de timestamps
  var LS_UNTIL   = 'rl_until';    // timestamp de fin de bloqueo
  var LS_COUNT   = 'rl_count';    // número de bloqueos totales

  /* ============================================================
     HELPERS
  ============================================================ */
  function now() { return Date.now(); }

  function lsGet(k) {
    try { return JSON.parse(localStorage.getItem(k)); } catch(e) { return null; }
  }
  function lsSet(k, v) {
    try { localStorage.setItem(k, JSON.stringify(v)); } catch(e) {}
  }
  function lsDel(k) {
    try { localStorage.removeItem(k); } catch(e) {}
  }

  /* ============================================================
     LÓGICA DE BLOQUEO
  ============================================================ */

  /* ¿Hay un bloqueo activo ahora mismo?
     Si acaba de expirar, limpiar timestamps para empezar desde cero. */
  function blocked() {
    var until = lsGet(LS_UNTIL);
    if (typeof until !== 'number') return false;
    if (until > now()) return true;
    /* Expiró — limpiar todo para que el siguiente ciclo empiece a cero */
    lsDel(LS_UNTIL);
    lsDel(LS_TIMES);
    return false;
  }

  /* Tiempo restante de bloqueo en segundos */
  function remaining() {
    var until = lsGet(LS_UNTIL) || 0;
    return Math.max(0, Math.ceil((until - now()) / 1000));
  }

  /* Registrar un evento. Devuelve true si se acaba de bloquear. */
  function record() {
    /* Ya bloqueado → ignorar */
    if (blocked()) return false;

    /* Leer timestamps, descartar los viejos, añadir el actual */
    var times  = lsGet(LS_TIMES) || [];
    var cutoff = now() - WINDOW_MS;
    var fresh  = [];
    for (var i = 0; i < times.length; i++) {
      if (times[i] > cutoff) fresh.push(times[i]);
    }
    fresh.push(now());
    lsSet(LS_TIMES, fresh);

    /* ¿Superamos el límite? */
    if (fresh.length > MAX_EVENTS) {
      /* Activar bloqueo */
      lsSet(LS_UNTIL, now() + BLOCK_MS);
      var cnt = (lsGet(LS_COUNT) || 0) + 1;
      lsSet(LS_COUNT, cnt);
      /* Limpiar contadores para que el próximo ciclo empiece limpio */
      lsDel(LS_TIMES);
      return true; /* bloqueado ahora mismo */
    }
    return false;
  }

  /* ============================================================
     INTERCEPTAR FETCH
  ============================================================ */
  var _fetch = window.fetch;
  window.fetch = function(resource, init) {
    record();
    if (blocked()) {
      showIfNeeded();
      return Promise.reject(new Error('Rate limit activo'));
    }
    return _fetch.call(window, resource, init);
  };

  /* ============================================================
     INTERCEPTAR XMLHttpRequest
  ============================================================ */
  var OrigXHR = window.XMLHttpRequest;
  window.XMLHttpRequest = function() {
    var self = new OrigXHR();
    /* guardamos referencia a send original */
    var origSend = self.send.bind(self);
    self.send = function(body) {
      record();
      if (blocked()) {
        showIfNeeded();
        /* simular error sin bloquear el hilo */
        var me = this;
        setTimeout(function() { me.dispatchEvent(new Event('error')); }, 0);
        return;
      }
      origSend(body);
    };
    return self;
  };
  window.XMLHttpRequest.prototype = OrigXHR.prototype;

  /* ============================================================
     CONTAR ESTA CARGA DE PÁGINA
     (se ejecuta en cada carga, incluyendo recargas)
  ============================================================ */
  var justBlocked = record();

  /* ============================================================
     MOSTRAR PANTALLA DE BLOQUEO
  ============================================================ */
  function showIfNeeded() {
    if (!blocked()) return;
    if (document.getElementById('rl-over')) return;

    if (document.body) {
      renderScreen();
    } else {
      document.addEventListener('DOMContentLoaded', renderScreen);
    }
  }

  /* Si al registrar esta carga de página se bloqueó, mostrar */
  if (justBlocked || blocked()) {
    showIfNeeded();
    /* Si el DOM aún no está listo, esperar */
    if (!document.body) {
      document.addEventListener('DOMContentLoaded', showIfNeeded);
    }
  }

  /* ============================================================
     RENDER
  ============================================================ */
  var QUOTES = [
    {
      code: 'ERR_TOO_MANY_PACKETS', title: 'SYN flood detectado',
      joke: 'Oye, hasta nmap tiene límites de cortesía.',
      sub:  'Nadie recarga una página 15 veces en 15 segundos... a menos que seas un script con un bucle for sin delay.'
    },
    {
      code: 'HTTP 429', title: 'Rate Limit Exceeded',
      joke: '¿Hydra? ¿Gobuster? Relax, aquí no hay nada que explotar.',
      sub:  'Tu IP ha sido temporalmente suspendida. En el mundo real te quedarías sin internet.'
    },
    {
      code: 'SIGTERM', title: 'Proceso terminado',
      joke: 'kill -9 $(tu_script_favorito)',
      sub:  'El sistema detectó un patrón de comportamiento que recuerda a un junior intentando levantar Docker un lunes.'
    },
    {
      code: 'ECONNREFUSED', title: 'Conexión rechazada',
      joke: 'sudo !! — sí claro, prueba otra vez.',
      sub:  'Has superado el límite. El servidor te mira con decepción desde el otro lado del cable.'
    },
    {
      code: 'TIMEOUT', title: 'Acceso denegado',
      joke: '¿Conoces el "responsible disclosure"? Esto no es lo que es.',
      sub:  'Más peticiones que un junior intentando entender Docker por primera vez. Respira.'
    }
  ];

  var ASCII_ART = [
`
 ████████╗ ██████╗  ██████╗     ███████╗ █████╗ ███████╗████████╗
    ██╔══╝██╔═══██╗██╔═══██╗    ██╔════╝██╔══██╗██╔════╝╚══██╔══╝
    ██║   ██║   ██║██║   ██║    █████╗  ███████║███████╗   ██║
    ██║   ╚██████╔╝╚██████╔╝    ██║     ██║  ██║███████║   ██║
    ╚═╝    ╚═════╝  ╚═════╝     ╚═╝     ╚═╝  ╚═╝╚══════╝   ╚═╝`,
`
  ██╗  ██╗██████╗  ██████╗
  ██║  ██║╚════██╗██╔═══██╗
  ███████║ █████╔╝╚██████╔╝
  ╚════██║██╔═══╝  ╚═══██╗
       ██║███████╗██████╔╝
       ╚═╝╚══════╝╚═════╝`,
`
  █████╗  ██████╗ ██████╗███████╗███████╗███████╗
 ██╔══██╗██╔════╝██╔════╝██╔════╝██╔════╝██╔════╝
 ███████║██║     ██║     █████╗  ███████╗███████╗
 ██╔══██║██║     ██║     ██╔══╝  ╚════██║╚════██║
 ██║  ██║╚██████╗╚██████╗███████╗███████║███████║
 ╚═╝  ╚═╝ ╚═════╝ ╚═════╝╚══════╝╚══════╝╚══════╝`
  ];

  function renderScreen() {
    if (document.getElementById('rl-over')) return;
    if (!blocked()) return;

    var q   = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    var art = ASCII_ART[Math.floor(Math.random() * ASCII_ART.length)];
    var rem = remaining();
    var tot = Math.ceil(BLOCK_MS / 1000);
    var cnt = lsGet(LS_COUNT) || 1;

    /* Glitch title */
    var gtitle = '';
    for (var ci = 0; ci < q.title.length; ci++) {
      var ch = q.title[ci];
      gtitle += '<span style="display:inline-block;animation:rlg 4s ' +
        (ci * 0.045).toFixed(2) + 's ease-in-out infinite">' +
        (ch === ' ' ? '&nbsp;' : ch) + '</span>';
    }

    /* Partículas */
    var parts = '';
    for (var pi = 0; pi < 22; pi++) {
      parts += '<div class="rl-p" style="' +
        'left:' + (Math.random() * 100).toFixed(1) + '%;' +
        'bottom:-8px;' +
        'width:'  + (1 + Math.random() * 3).toFixed(1) + 'px;' +
        'height:' + (1 + Math.random() * 3).toFixed(1) + 'px;' +
        'animation-duration:' + (4 + Math.random() * 7).toFixed(1) + 's;' +
        'animation-delay:'    + (Math.random() * 6).toFixed(1) + 's' +
        '"></div>';
    }

    var pct = ((rem / tot) * 100).toFixed(1);

    var html = [
      '<style>',
      '#rl-over{position:fixed;inset:0;z-index:2147483647;background:#0d1117;',
        'display:flex;flex-direction:column;align-items:center;justify-content:center;',
        'padding:1.5rem;font-family:"Fira Mono","JetBrains Mono",monospace;',
        'opacity:0;transition:opacity .4s ease;overflow:hidden}',
      '#rl-over.rl-on{opacity:1}',
      '#rl-over::before{content:"";position:absolute;inset:0;pointer-events:none;',
        'background-image:linear-gradient(rgba(220,20,60,.045) 1px,transparent 1px),',
        'linear-gradient(90deg,rgba(220,20,60,.045) 1px,transparent 1px);',
        'background-size:40px 40px}',
      '.rl-p{position:absolute;border-radius:50%;background:#dc143c;opacity:0;',
        'animation:rlup linear infinite}',
      '@keyframes rlup{0%{opacity:0;transform:translateY(0) scale(0)}',
        '10%{opacity:.55}90%{opacity:.12}100%{opacity:0;transform:translateY(-88vh) scale(1)}}',
      '.rl-box{position:relative;max-width:680px;width:100%;background:#161b22;',
        'border:1px solid #30363d;border-radius:16px;padding:2.5rem 2.5rem 2rem;',
        'text-align:center;box-shadow:0 0 0 1px rgba(220,20,60,.12),0 32px 64px rgba(0,0,0,.7);',
        'animation:rlbox .5s cubic-bezier(.34,1.56,.64,1) both}',
      '@keyframes rlbox{from{transform:scale(.88) translateY(20px);opacity:0}',
        'to{transform:scale(1) translateY(0);opacity:1}}',
      '.rl-box::before{content:"";position:absolute;top:-1px;left:10%;right:10%;',
        'height:2px;border-radius:999px;',
        'background:linear-gradient(90deg,transparent,#dc143c,#ff4060,#dc143c,transparent)}',
      '.rl-scan{position:absolute;inset:0;border-radius:16px;pointer-events:none;',
        'background:repeating-linear-gradient(0deg,transparent,transparent 3px,',
        'rgba(0,0,0,.034) 3px,rgba(0,0,0,.034) 4px)}',
      '.rl-code{font-size:.62rem;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;',
        'color:#dc143c;margin-bottom:1.2rem;display:flex;align-items:center;',
        'justify-content:center;gap:8px}',
      '.rl-code::before,.rl-code::after{content:"";flex:1;max-width:60px;height:1px;',
        'background:linear-gradient(90deg,transparent,rgba(220,20,60,.4))}',
      '.rl-code::after{transform:scaleX(-1)}',
      '.rl-lock{width:64px;height:64px;border-radius:18px;background:rgba(220,20,60,.1);',
        'border:1px solid rgba(220,20,60,.25);display:flex;align-items:center;',
        'justify-content:center;margin:0 auto 1.4rem;animation:rlpulse 2s ease-in-out infinite}',
      '@keyframes rlpulse{0%,100%{box-shadow:0 0 0 0 rgba(220,20,60,.35)}',
        '50%{box-shadow:0 0 0 14px rgba(220,20,60,0)}}',
      '.rl-title{font-size:clamp(1.3rem,4vw,1.9rem);font-weight:700;color:#e6edf3;',
        'margin-bottom:.5rem;line-height:1.2}',
      '@keyframes rlg{0%,84%,100%{transform:translate(0);color:#e6edf3}',
        '85%{transform:translate(-1px,1px);color:#dc143c}',
        '86%{transform:translate(1px,-1px);color:#ff4060}',
        '87%{transform:translate(0);color:#e6edf3}',
        '93%{transform:translate(1px,1px);color:#ff8090}',
        '94%{transform:translate(-1px,0);color:#dc143c}',
        '95%{transform:translate(0);color:#e6edf3}}',
      '.rl-joke{font-size:.91rem;color:#ff4060;font-style:italic;',
        'margin-bottom:.5rem;padding:.4rem 0}',
      '.rl-sub{font-size:.78rem;color:#8b949e;line-height:1.65;',
        'margin:0 auto 1.6rem;max-width:480px}',
      '.rl-ascii{font-size:clamp(.24rem,.78vw,.41rem);line-height:1.25;',
        'color:rgba(220,20,60,.3);white-space:pre;margin:0 auto 1.6rem;',
        'animation:rlasc 1s ease .25s both}',
      '@keyframes rlasc{from{opacity:0;filter:blur(4px)}to{opacity:1;filter:none}}',
      '.rl-cdwrap{margin-bottom:1.2rem}',
      '.rl-cdlabel{font-size:.68rem;color:#6e7681;letter-spacing:.8px;',
        'text-transform:uppercase;margin-bottom:.5rem}',
      '.rl-cdlabel strong{color:#dc143c;font-size:1rem}',
      '.rl-track{width:100%;height:3px;background:#21262d;border-radius:999px;overflow:hidden}',
      '.rl-fill{height:100%;background:linear-gradient(90deg,#8b0000,#dc143c,#ff4060);',
        'border-radius:999px;width:100%;transition:width 1s linear;',
        'box-shadow:0 0 8px rgba(220,20,60,.5)}',
      '.rl-stats{display:flex;justify-content:center;gap:1.5rem;',
        'padding:1rem 0 0;border-top:1px solid #21262d;flex-wrap:wrap}',
      '.rl-stat{display:flex;flex-direction:column;align-items:center;gap:3px}',
      '.rl-sv{font-size:1.05rem;font-weight:700;color:#e6edf3}',
      '.rl-sl{font-size:.58rem;letter-spacing:.8px;text-transform:uppercase;color:#6e7681}',
      '@media(max-width:480px){.rl-box{padding:2rem 1.25rem 1.5rem}',
        '.rl-ascii{display:none}.rl-stats{gap:1rem}}',
      '</style>',

      parts,

      '<div class="rl-box">',
        '<div class="rl-scan"></div>',
        '<div class="rl-code">', q.code, '</div>',
        '<div class="rl-lock">',
          '<svg width="28" height="28" viewBox="0 0 24 24" fill="none"',
          ' stroke="#dc143c" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">',
          '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>',
          '<path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
          '</svg>',
        '</div>',
        '<h1 class="rl-title">', gtitle, '</h1>',
        '<p class="rl-joke">"', q.joke, '"</p>',
        '<p class="rl-sub">', q.sub, '</p>',
        '<pre class="rl-ascii">', art, '</pre>',
        '<div class="rl-cdwrap">',
          '<div class="rl-cdlabel">Acceso restaurado en ',
            '<strong id="rl-cd">', rem, '</strong>s',
          '</div>',
          '<div class="rl-track">',
            '<div class="rl-fill" id="rl-bar" style="width:', pct, '%"></div>',
          '</div>',
        '</div>',
        '<div class="rl-stats">',
          '<div class="rl-stat">',
            '<span class="rl-sv" style="color:#dc143c">', MAX_EVENTS, '</span>',
            '<span class="rl-sl">máx / ', (WINDOW_MS/1000), 's</span>',
          '</div>',
          '<div class="rl-stat">',
            '<span class="rl-sv">', tot, 's</span>',
            '<span class="rl-sl">cooldown</span>',
          '</div>',
          '<div class="rl-stat">',
            '<span class="rl-sv" style="color:', (cnt > 2 ? '#f97316' : '#e6edf3'), '">', cnt, '</span>',
            '<span class="rl-sl">bloqueo', (cnt !== 1 ? 's' : ''), '</span>',
          '</div>',
        '</div>',
      '</div>'
    ].join('');

    var el = document.createElement('div');
    el.id  = 'rl-over';
    el.innerHTML = html;
    document.body.appendChild(el);
    document.body.style.overflow = 'hidden';

    /* Entrada animada */
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { el.classList.add('rl-on'); });
    });

    /* Countdown */
    var timer = setInterval(function () {
      rem--;
      var cdEl  = document.getElementById('rl-cd');
      var barEl = document.getElementById('rl-bar');
      if (cdEl)  cdEl.textContent   = Math.max(0, rem);
      if (barEl) barEl.style.width  = Math.max(0, (rem / tot) * 100).toFixed(1) + '%';

      if (rem <= 0) {
        clearInterval(timer);
        lsDel(LS_UNTIL);
        lsDel(LS_TIMES);
        var ov = document.getElementById('rl-over');
        if (ov) {
          ov.style.opacity = '0';
          setTimeout(function () {
            ov.remove();
            document.body.style.overflow = '';
          }, 450);
        }
      }
    }, 1000);
  }

})();
