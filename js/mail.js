const EMAILJS_PUBLIC_KEY  = 'XJpsLN3h68Ur1SIIm';
const EMAILJS_SERVICE_ID  = 'service_2dkl0fo';
const EMAILJS_TEMPLATE_ID = 'template_rmmejzs';

// Inicializa EmailJS. limitRate evita que alguien dispare envíos seguidos (10 segundos entre cada uno)
emailjs.init({
  publicKey: EMAILJS_PUBLIC_KEY,
  limitRate: { throttle: 10000 }
});

const form  = document.getElementById('form-contacto');
const boton = form.querySelector('button[type="submit"]');
const aviso = document.getElementById('aviso-form'); // el <p> donde se muestra el resultado

// Muestra un mensaje de resultado. Si el <p> no existe en el HTML, no rompe nada.
function mostrarAviso(texto, tipo) {
  if (!aviso) return;
  aviso.textContent = texto;
  aviso.className = 'contacto__aviso' + (tipo ? ' contacto__aviso--' + tipo : '');
}

// Corta la espera si EmailJS no responde en 15 segundos, así el botón nunca queda colgado
function conTiempoLimite(promesa, ms) {
  const limite = new Promise((_, rechazar) =>
    setTimeout(() => rechazar(new Error('Tiempo de espera agotado')), ms)
  );
  return Promise.race([promesa, limite]);
}

form.addEventListener('submit', async (evento) => {
  // Evita que el navegador recargue la página al enviar
  evento.preventDefault();

  boton.disabled = true;
  boton.textContent = 'Enviando...';
  mostrarAviso('');

  try {
    // sendForm toma los campos del formulario por su atributo name (nombre, email, mensaje)
    await conTiempoLimite(
      emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form),
      15000
    );

    mostrarAviso('¡Mensaje enviado! Te respondo a la brevedad.', 'ok');
    form.reset();
  } catch (error) {
    console.error('EmailJS falló:', error);
    mostrarAviso('No se pudo enviar el mensaje. Probá de nuevo o escribime por Instagram o Whatsapp.', 'error');
  } finally {
    // Pase lo que pase, el botón vuelve a su estado normal
    boton.disabled = false;
    boton.textContent = 'Enviar';
  }
});
