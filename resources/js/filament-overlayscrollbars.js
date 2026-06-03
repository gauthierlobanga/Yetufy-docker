// resources/js/filament-overlayscrollbars.js
import 'overlayscrollbars/overlayscrollbars.css';
import { OverlayScrollbars } from 'overlayscrollbars';

document.addEventListener('DOMContentLoaded', () => {
  const target = document.querySelector('body');

  if (target) {
    OverlayScrollbars(target, {
      scrollbars: {
        theme: 'os-theme-light',
        visibility: 'auto',
        autoHide: 'leave',
        autoHideDelay: 600,
      },
      overflow: {
        x: 'hidden',
        y: 'scroll',
      },
    });
  }
});
