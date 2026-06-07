/**
 * ssl-check.js — Verifica que el certificado autofirmado del VPS
 * está aceptado por el navegador. Si no, muestra un popup que
 * guía al usuario para aceptarlo sin salir de la página.
 *
 * Incluir en cualquier HTML así (antes del cierre de </body>):
 *   <script src="js/ssl-check.js"></script>
 *
 * No depende de ningún framework. Usa las CSS variables del blog.
 */

(function () {
  'use strict';

  const VPS_URL      = 'https://51.170.40.86';
  const HEALTH_URL   = VPS_URL + '/health';
  const SESSION_KEY  = 'ssl_cert_accepted';
  const MODAL_ID     = '__ssl_check_modal__';

  // ── Si ya se aceptó en esta sesión, no hacer nada ──────────────────────────
  if (sessionStorage.getItem(SESSION_KEY) === '1') return;

  // ── Inyectar estilos del modal ─────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    #${MODAL_ID}-overlay {
      position: fixed;
      inset: 0;
      z-index: 99999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      background: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
      animation: __ssl_fadein__ 0.2s ease;
    }
    @keyframes __ssl_fadein__ {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    #${MODAL_ID} {
      background-color: var(--color-surface, #161b22);
      border: 1px solid var(--color-border, #30363d);
      border-radius: 12px;
      padding: 2rem;
      max-width: 480px;
      width: 100%;
      box-shadow: 0 24px 64px rgba(0,0,0,0.6);
      animation: __ssl_slidein__ 0.25s cubic-bezier(.16,1,.3,1);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    @keyframes __ssl_slidein__ {
      from { transform: translateY(20px); opacity: 0; }
      to   { transform: translateY(0);    opacity: 1; }
    }
    #${MODAL_ID} .ssl-icon {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: rgba(220, 20, 60, 0.12);
      border: 1px solid rgba(220, 20, 60, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1.25rem;
    }
    #${MODAL_ID} .ssl-icon svg {
      width: 24px;
      height: 24px;
      color: var(--color-accent, #dc143c);
      fill: none;
      stroke: currentColor;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    #${MODAL_ID} h2 {
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--color-text, #e6edf3);
      margin: 0 0 0.5rem;
    }
    #${MODAL_ID} p {
      font-size: 0.875rem;
      color: var(--color-text-muted, #9198a1);
      margin: 0 0 1.25rem;
      line-height: 1.6;
    }
    #${MODAL_ID} .ssl-steps {
      background: var(--color-bg, #0d1117);
      border: 1px solid var(--color-border, #30363d);
      border-radius: 8px;
      padding: 0.875rem 1rem;
      margin-bottom: 1.5rem;
      list-style: none;
      padding-left: 1rem;
      counter-reset: ssl-step;
    }
    #${MODAL_ID} .ssl-steps li {
      counter-increment: ssl-step;
      font-size: 0.82rem;
      color: var(--color-text-muted, #9198a1);
      padding: 0.25rem 0;
      padding-left: 1.5rem;
      position: relative;
    }
    #${MODAL_ID} .ssl-steps li::before {
      content: counter(ssl-step) '.';
      position: absolute;
      left: 0;
      color: var(--color-accent, #dc143c);
      font-weight: 700;
      font-size: 0.8rem;
    }
    #${MODAL_ID} .ssl-steps li strong {
      color: var(--color-text, #e6edf3);
      font-weight: 600;
    }
    #${MODAL_ID} .ssl-btn-primary {
      display: block;
      width: 100%;
      padding: 0.625rem 1rem;
      background: var(--color-accent, #dc143c);
      color: #fff;
      border: none;
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      text-align: center;
      text-decoration: none;
      transition: opacity 0.15s, transform 0.1s;
      margin-bottom: 0.625rem;
    }
    #${MODAL_ID} .ssl-btn-primary:hover {
      opacity: 0.88;
      transform: translateY(-1px);
    }
    #${MODAL_ID} .ssl-btn-primary:active {
      transform: translateY(0);
    }
    #${MODAL_ID} .ssl-btn-secondary {
      display: block;
      width: 100%;
      padding: 0.625rem 1rem;
      background: transparent;
      color: var(--color-text-muted, #9198a1);
      border: 1px solid var(--color-border, #30363d);
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      text-align: center;
      transition: background 0.15s, color 0.15s;
    }
    #${MODAL_ID} .ssl-btn-secondary:hover {
      background: var(--color-surface-raised, #1c2128);
      color: var(--color-text, #e6edf3);
    }
    #${MODAL_ID} .ssl-status {
      font-size: 0.78rem;
      text-align: center;
      margin-top: 0.875rem;
      height: 1rem;
      color: var(--color-text-muted, #9198a1);
    }
    #${MODAL_ID} .ssl-status.checking {
      color: var(--color-text-muted, #9198a1);
    }
    #${MODAL_ID} .ssl-status.ok {
      color: #28a745;
      font-weight: 600;
    }
    #${MODAL_ID} .ssl-status.fail {
      color: var(--color-accent, #dc143c);
    }
    #${MODAL_ID} .ssl-url-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-family: 'Courier New', monospace;
      font-size: 0.78rem;
      background: var(--color-bg, #0d1117);
      border: 1px solid var(--color-border, #30363d);
      border-radius: 4px;
      padding: 2px 7px;
      color: var(--color-accent-light, #ff4060);
      margin-bottom: 0.875rem;
    }
  `;
  document.head.appendChild(style);

  // ── Crear el modal ─────────────────────────────────────────────────────────
  function createModal() {
    const overlay = document.createElement('div');
    overlay.id = MODAL_ID + '-overlay';

    overlay.innerHTML = `
      <div id="${MODAL_ID}" role="dialog" aria-modal="true" aria-labelledby="ssl-title">
        <div class="ssl-icon">
          <svg viewBox="0 0 24 24">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </div>

        <h2 id="ssl-title">Certificado de seguridad no aceptado</h2>

        <p>
          El servidor de writeups usa un certificado <strong style="color:var(--color-text,#e6edf3)">autofirmado</strong>.
          Tu navegador lo bloquea hasta que lo aceptes manualmente una vez.
        </p>

        <div class="ssl-url-badge">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          ${HEALTH_URL}
        </div>

        <ol class="ssl-steps">
          <li>Haz clic en <strong>"Abrir página del servidor"</strong> aquí abajo</li>
          <li>Se abrirá una pestaña con aviso de seguridad del navegador</li>
          <li>Haz clic en <strong>"Avanzado"</strong> → <strong>"Continuar"</strong> (o "Aceptar el riesgo")</li>
          <li>Cierra esa pestaña y vuelve aquí → haz clic en <strong>"Ya lo acepté"</strong></li>
        </ol>

        <a href="${HEALTH_URL}" target="_blank" class="ssl-btn-primary" id="ssl-open-btn">
          Abrir página del servidor →
        </a>

        <button class="ssl-btn-secondary" id="ssl-check-btn">
          Ya lo acepté — verificar conexión
        </button>

        <div class="ssl-status" id="ssl-status-msg"></div>
      </div>
    `;

    document.body.appendChild(overlay);

    // ── Botón "Ya lo acepté" ─────────────────────────────────────────────────
    document.getElementById('ssl-check-btn').addEventListener('click', async () => {
      const status = document.getElementById('ssl-status-msg');
      status.textContent = 'Comprobando conexión…';
      status.className = 'ssl-status checking';

      const ok = await checkCert();
      if (ok) {
        status.textContent = '✓ Conexión establecida — cargando…';
        status.className = 'ssl-status ok';
        sessionStorage.setItem(SESSION_KEY, '1');
        setTimeout(() => {
          overlay.remove();
          // Recargar la página para que los recursos se carguen correctamente
          window.location.reload();
        }, 800);
      } else {
        status.textContent = '✗ Aún no aceptado. Sigue los pasos anteriores.';
        status.className = 'ssl-status fail';
      }
    });

    // ── Click fuera del modal — no cierra (el usuario DEBE aceptar) ──────────
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        // pequeño shake para indicar que no se puede cerrar así
        const modal = document.getElementById(MODAL_ID);
        modal.style.animation = 'none';
        modal.offsetHeight; // reflow
        modal.style.animation = '__ssl_shake__ 0.3s ease';
      }
    });

    // Añadir keyframe shake dinámicamente
    const shakeStyle = document.createElement('style');
    shakeStyle.textContent = `
      @keyframes __ssl_shake__ {
        0%,100% { transform: translateX(0); }
        20%      { transform: translateX(-8px); }
        40%      { transform: translateX(8px); }
        60%      { transform: translateX(-6px); }
        80%      { transform: translateX(6px); }
      }
    `;
    document.head.appendChild(shakeStyle);
  }

  // ── Función de verificación de certificado ─────────────────────────────────
  async function checkCert() {
    try {
      const res = await fetch(HEALTH_URL, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-store',
        signal: AbortSignal.timeout(5000),
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  // ── Punto de entrada ───────────────────────────────────────────────────────
  async function init() {
    // Esperar a que el DOM esté listo
    if (document.readyState === 'loading') {
      await new Promise(r => document.addEventListener('DOMContentLoaded', r, { once: true }));
    }

    const ok = await checkCert();
    if (ok) {
      // Certificado ya aceptado — guardar en sesión y no mostrar nada
      sessionStorage.setItem(SESSION_KEY, '1');
    } else {
      // Mostrar el modal
      createModal();
    }
  }

  init();
})();
