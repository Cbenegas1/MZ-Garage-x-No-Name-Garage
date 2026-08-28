// ==========================================
// 1. GESTIÓN DEL FORMULARIO DE WHATSAPP Y VIDEOS
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Formulario de WhatsApp
    const form = document.getElementById('whatsappForm');
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const nombre = document.getElementById('nombre').value.trim();
            const vehiculo = document.getElementById('vehiculo').value.trim();
            const tipoServicio = document.getElementById('tipoServicio').value;
            const mensaje = document.getElementById('mensaje').value.trim();

            const numeroWhatsApp = "595981000000"; // Cambia por tu número real

            const texto = `Hola! 👋 Me gustaría cotizar un proyecto para mi vehículo.%0A%0A*Nombre:* ${nombre}%0A*Vehículo:* ${vehiculo}%0A*Servicio:* ${tipoServicio}%0A*Detalles:* ${mensaje}`;

            window.open(`https://wa.me/${numeroWhatsApp}?text=${texto}`, '_blank');
        });
    }

    // Compatibilidad para videos en móviles y PC
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
        video.setAttribute('playsinline', '');
        video.setAttribute('webkit-playsinline', '');
        video.load();
    });
});

// ==========================================
// PRELOADER SEGURO (CON SESIÓN)
// ==========================================
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    
    if (preloader) {
        // Si ya se mostró en esta pestaña, lo removemos de inmediato para que NUNCA se cuelgue
        if (sessionStorage.getItem('animacionLista') === '1') {
            preloader.remove();
            return;
        }

        // Si es la primera vez en la pestaña, marcamos que ya corrió
        sessionStorage.setItem('animacionLista', '1');

        // Espera 3 segundos y oculta el preloader de forma segura
        setTimeout(() => {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
            setTimeout(() => {
                preloader.remove(); // Elimina el elemento por completo para que no tape nada
            }, 500);
        }, 3000);
    }
});

// ==========================================
// 3. CONTROL DE DESPLAZAMIENTO DEL CARRUSEL
// ==========================================
function scrollCarousel(direction) {
    const track = document.getElementById('projectsTrack');
    if (track) {
        const scrollAmount = 380 + 30; // Ancho de la tarjeta + espacio (gap)
        track.scrollBy({
            left: direction * scrollAmount,
            behavior: 'smooth'
        });
    }
}

// ==========================================
// 4. CONTROL DE MÚSICA DE FONDO
// ==========================================
const audio = new Audio('Cancion1.mp3');
audio.loop = true;
audio.volume = 0.4; // Volumen al 40%

const musicBtn = document.getElementById('musicToggleBtn');
const musicIcon = document.getElementById('musicIcon');
let isPlaying = false;

function toggleAudio() {
    if (isPlaying) {
        audio.pause();
        if (musicIcon) {
            musicIcon.classList.remove('fa-volume-high');
            musicIcon.classList.add('fa-music');
        }
        if (musicBtn) musicBtn.classList.remove('playing');
        isPlaying = false;
    } else {
        audio.play().then(() => {
            if (musicIcon) {
                musicIcon.classList.remove('fa-music');
                musicIcon.classList.add('fa-volume-high');
            }
            if (musicBtn) musicBtn.classList.add('playing');
            isPlaying = true;
        }).catch(error => {
            console.log("Reproducción pausada o bloqueada por restricciones del navegador:", error);
        });
    }
}// ==========================================
// CARRUSEL AUTOMÁTICO
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('projectsTrack');
    if (!track) return;

    let autoScrollInterval;
    const scrollAmount = 380 + 30; // Ancho de la tarjeta + espacio (gap)

    // Función que avanza el carrusel
    function startAutoScroll() {
        autoScrollInterval = setInterval(() => {
            // Si llega al final, regresa al inicio (0)
            if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 10) {
                track.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }, 3000); // 3000ms = 3 segundos (cambia este número si quieres que sea más rápido o lento)
    }

    // Detener el movimiento automático cuando el usuario ponga el mouse encima
    track.addEventListener('mouseenter', () => {
        clearInterval(autoScrollInterval);
    });

    // Volver a activar el movimiento automático cuando el usuario retire el mouse
    track.addEventListener('mouseleave', () => {
        startAutoScroll();
    });

    // Iniciar el carrusel automático al cargar la página
    startAutoScroll();
});
