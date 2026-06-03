import 'overlayscrollbars/overlayscrollbars.css';
import { OverlayScrollbars } from 'overlayscrollbars';

document.addEventListener('DOMContentLoaded', () => {
  // Cible le corps principal de Filament
  const target = document.querySelector('.fi-body');

  if (target) {
    OverlayScrollbars(target, {
      scrollbars: {
        theme: 'os-theme-light',        // thème clair (change automatiquement en mode sombre si tu utilises 'os-theme-dark')
        visibility: 'auto',             // visible uniquement au survol / scroll
        autoHide: 'move',               // disparaît après arrêt du mouvement (ou 'leave' pour disparaître quand la souris quitte la zone)
        autoHideDelay: 800,             // délai avant disparition (en ms)
      },
      overflow: {
        x: 'hidden',
        y: 'scroll',
      },
    });
  }
});
