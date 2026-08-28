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
// PRELOADER (APARECE SOLO 1 VEZ POR SESIÓN)
// ==========================================
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    
    if (preloader) {
        // Verificamos si ya se mostró el preloader en esta pestaña/sesión
        if (!sessionStorage.getItem('preloaderShown')) {
            // Si es la primera vez, marcamos que ya se mostró
            sessionStorage.setItem('preloaderShown', 'true');
            
            // Lo mantenemos visible durante 3 segundos y luego lo ocultamos
            setTimeout(() => {
                preloader.classList.add('ocultar-preloader');
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 500); 
            }, 3000); 
        } else {
            // Si ya se había cargado antes en esta sesión, lo ocultamos de inmediato sin animación
            preloader.style.display = 'none';
        }
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
}