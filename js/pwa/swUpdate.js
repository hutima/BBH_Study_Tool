// Service-worker registration + "Update available" prompt.
//
// DELIBERATELY a CLASSIC script OUTSIDE the ES-module graph (loaded from its
// own <script> tag in index.html, before the module entrypoint). Extracted
// from js/app/main.js after a field freeze: the update prompt used to live at
// the tail of main.js's module body, so ANY startup error earlier in the
// module graph (including the CLAUDE.md mixed-version import hazard during a
// service-worker update window) silently killed the one UI that lets the
// user recover — the refresh prompt. As a standalone classic script, no
// module-graph failure can ever hide it again. Keep this file dependency-free
// (DOM + navigator only) and never convert it to a module.
//
// The flow (unchanged from the main.js original):
// - sw.js does NOT skipWaiting on install; a new worker sits waiting.
// - We surface #refreshAvailableOverlay when a new worker is waiting/installed
//   while an old controller is active.
// - "Refresh now" (onclick="acceptRefreshAvailable()") messages SKIP_WAITING;
//   the reload runs from the user's gesture (auto-reload on controllerchange
//   at launch froze iOS standalone PWAs).
(function () {
  'use strict';
  if (!('serviceWorker' in navigator)) return;

  let pendingWorker = null;
  let reloading = false;
  let refreshAccepted = false;

  navigator.serviceWorker.addEventListener('controllerchange', function () {
    if (!refreshAccepted || reloading) return;
    reloading = true;
    window.location.reload();
  });

  window.acceptRefreshAvailable = function () {
    refreshAccepted = true;
    if (pendingWorker) {
      try { pendingWorker.postMessage({ type: 'SKIP_WAITING' }); } catch (_) {}
    }
    // Belt-and-suspenders: if activation doesn't fire controllerchange
    // shortly, reload anyway so the tap is never a no-op.
    setTimeout(function () {
      if (!reloading) { reloading = true; window.location.reload(); }
    }, 1500);
  };

  function showRefreshOverlay(sw) {
    pendingWorker = sw;
    const overlay = document.getElementById('refreshAvailableOverlay');
    if (!overlay) return;
    // Visibility needs the `.show` class (see styles.css); aria-hidden alone
    // won't display it. The worker stays waiting, so there is no auto-reload
    // to race.
    overlay.classList.add('show');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  }

  function trackUpdates(reg) {
    // A waiting worker while a controller exists = returning user with a new
    // version ready. Surface the prompt; the worker waits for "Refresh now".
    if (reg.waiting && navigator.serviceWorker.controller) {
      showRefreshOverlay(reg.waiting);
    }
    reg.addEventListener('updatefound', function () {
      const sw = reg.installing;
      if (!sw) return;
      sw.addEventListener('statechange', function () {
        if (sw.state === 'installed' && navigator.serviceWorker.controller) {
          showRefreshOverlay(sw);
        }
      });
    });
  }

  window.addEventListener('load', function () {
    navigator.serviceWorker.register('./sw.js', { updateViaCache: 'none' })
      .then(function (reg) {
        trackUpdates(reg);
        try { reg.update(); } catch (_) {}
        // Re-check when the tab regains focus, so a PWA reopened a day later
        // picks up a deploy without a hard reload.
        document.addEventListener('visibilitychange', function () {
          if (document.visibilityState !== 'visible') return;
          try { reg.update(); } catch (_) {}
          // A worker can already be waiting from before this resume — the
          // one-time check in trackUpdates only runs at registration, so a
          // reopened backgrounded PWA would otherwise sit silently on the
          // old version.
          if (reg.waiting && navigator.serviceWorker.controller) {
            showRefreshOverlay(reg.waiting);
          }
        });
      })
      .catch(function () {});
  });
})();
