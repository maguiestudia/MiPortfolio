function iniciarCarrusel(contenedor, track, selectorItems) {
  // Lo que necesitamos encontrar dentro del carrusel
  const items = track.querySelectorAll(selectorItems);
  const btnPrev = contenedor.querySelector('.carrusel__btn--prev');
  const btnNext = contenedor.querySelector('.carrusel__btn--next');

  // Posición actual: 0 = primer elemento
  let indice = 0;

  // Cuántos elementos se ven a la vez. Lo lee del CSS (--visibles).
  // Si el track no tiene esa variable (hero), se ve 1 solo.
  function visibles() {
    const valor = parseInt(getComputedStyle(track).getPropertyValue('--visibles'));
    return valor || 1;
  }

  // Último índice al que se puede llegar sin dejar espacio vacío a la derecha
  function ultimoIndice() {
    return Math.max(0, items.length - visibles());
  }

  // Mueve el track: cada "paso" es el ancho de un elemento + el espacio (gap) entre ellos
  function mover() {
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const paso = items[0].offsetWidth + gap;
    track.style.transform = `translateX(-${indice * paso}px)`;
  }

  // Siguiente: si ya está en el final, vuelve al principio
  btnNext.addEventListener('click', () => {
    indice = indice >= ultimoIndice() ? 0 : indice + 1;
    mover();
  });

  // Anterior: si está en el principio, salta al final
  btnPrev.addEventListener('click', () => {
    indice = indice <= 0 ? ultimoIndice() : indice - 1;
    mover();
  });

  // Si cambia el tamaño de la ventana (o se gira el celu), recalcula
  window.addEventListener('resize', () => {
    if (indice > ultimoIndice()) indice = ultimoIndice();
    mover();
  });
}

/* ---------- Activamos cada carrusel ---------- */

// Hero (solo existe en index.html)
const hero = document.querySelector('.carrusel');
if (hero) {
  iniciarCarrusel(hero, hero.querySelector('.carrusel__track'), '.carrusel__slide');
}

// Trabajos
iniciarCarrusel(
  document.querySelector('.trabajos__carrusel'),
  document.querySelector('.trabajos__track'),
  '.card'
);