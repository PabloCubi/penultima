// Estado de la aplicación
let appState = {
    name: '',
    attendance: null,
    drink: null,
    confirmedGuests: []
};

// Elementos del DOM
const nameInput = document.getElementById('name');
const attendYesBtn = document.getElementById('attend-yes');
const attendNoBtn = document.getElementById('attend-no');
const drinkSection = document.getElementById('drink-section');
const drinkOptions = document.querySelectorAll('.drink-option');
const submitBtn = document.getElementById('submit-btn');
const confirmedList = document.getElementById('confirmed-list');

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    createParticles();
    loadConfirmedGuests();
    setupEventListeners();
});

// Configurar event listeners
function setupEventListeners() {
    nameInput.addEventListener('input', handleNameInput);
    attendYesBtn.addEventListener('click', () => handleAttendance('yes'));
    attendNoBtn.addEventListener('click', () => handleAttendance('no'));
    drinkOptions.forEach(option => {
        option.addEventListener('click', handleDrinkSelection);
    });
    submitBtn.addEventListener('click', handleSubmit);
}

// Manejar entrada del nombre
function handleNameInput(e) {
    appState.name = e.target.value.trim();
    updateSubmitButton();
}

// Manejar selección de asistencia
function handleAttendance(attendance) {
    appState.attendance = attendance;
    
    // Actualizar botones visuales
    attendYesBtn.classList.remove('attendance-yes', 'text-white');
    attendNoBtn.classList.remove('attendance-no', 'text-white');
    
    if (attendance === 'yes') {
        attendYesBtn.classList.add('attendance-yes', 'text-white');
        drinkSection.classList.remove('opacity-50', 'pointer-events-none');
        drinkSection.classList.add('opacity-100', 'pointer-events-auto');
        createCelebrationEffect();
    } else {
        attendNoBtn.classList.add('attendance-no', 'text-white');
        drinkSection.classList.add('opacity-50', 'pointer-events-none');
        drinkSection.classList.remove('opacity-100', 'pointer-events-auto');
        appState.drink = null;
        drinkOptions.forEach(option => option.classList.remove('selected'));
    }
    
    updateSubmitButton();
    animateAttendanceSelection(attendance);
}

// Manejar selección de bebida
function handleDrinkSelection(e) {
    const selectedDrink = e.currentTarget.dataset.drink;
    
    // Remover selección previa
    drinkOptions.forEach(option => option.classList.remove('selected'));
    
    // Seleccionar nueva opción
    e.currentTarget.classList.add('selected');
    appState.drink = selectedDrink;
    
    updateSubmitButton();
    animateDrinkSelection(e.currentTarget);
}

// Actualizar estado del botón submit
function updateSubmitButton() {
    const canSubmit = appState.name && 
                     appState.attendance && 
                     (appState.attendance === 'no' || appState.drink);
    
    submitBtn.disabled = !canSubmit;
    
    if (canSubmit) {
        submitBtn.classList.add('animate-pulse');
    } else {
        submitBtn.classList.remove('animate-pulse');
    }
}

// Manejar envío del formulario
function handleSubmit() {
    if (!appState.name || !appState.attendance) return;
    
    const guest = {
        id: Date.now(),
        name: appState.name,
        attendance: appState.attendance,
        drink: appState.drink,
        timestamp: new Date().toLocaleString('es-ES')
    };
    
    appState.confirmedGuests.push(guest);
    saveConfirmedGuests();
    addGuestToList(guest);
    
    // Reset form
    resetForm();
    
    // Show success animation
    showSuccessAnimation();
}

// Resetear formulario
function resetForm() {
    appState.name = '';
    appState.attendance = null;
    appState.drink = null;
    
    nameInput.value = '';
    attendYesBtn.classList.remove('attendance-yes', 'text-white');
    attendNoBtn.classList.remove('attendance-no', 'text-white');
    drinkOptions.forEach(option => option.classList.remove('selected'));
    drinkSection.classList.add('opacity-50', 'pointer-events-none');
    
    updateSubmitButton();
}

// Añadir invitado a la lista
function addGuestToList(guest) {
    const guestElement = document.createElement('div');
    guestElement.className = 'bg-white/80 rounded-lg p-4 shadow-md transform transition-all duration-300 hover:scale-105';
    
    const drinkEmoji = getDrinkEmoji(guest.drink);
    const attendanceText = guest.attendance === 'yes' ? '✅ Confirmado' : '❌ No puede ir';
    const drinkText = guest.drink ? `${drinkEmoji} ${guest.drink}` : 'Sin bebida seleccionada';
    
    guestElement.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
                <h4 class="font-bold text-lg text-amber-900">${guest.name}</h4>
                <p class="text-sm text-amber-700">${attendanceText}</p>
                ${guest.attendance === 'yes' ? `<p class="text-sm text-amber-600">${drinkText}</p>` : ''}
            </div>
            <div class="text-right">
                <button onclick="removeGuest(${guest.id})" class="text-red-500 hover:text-red-700 transition-colors">
                    <i class="fas fa-trash"></i>
                </button>
                <p class="text-xs text-amber-600 mt-1">${guest.timestamp}</p>
            </div>
        </div>
    `;
    
    confirmedList.appendChild(guestElement);
    
    // Animate appearance
    anime({
        targets: guestElement,
        scale: [0, 1],
        opacity: [0, 1],
        duration: 500,
        easing: 'easeOutBounce'
    });
}

// Obtener emoji para la bebida
function getDrinkEmoji(drink) {
    const emojis = {
        'ron': '🍷',
        'whisky': '🥃',
        'ginebra': '🍸',
        'calimocho': '🍷',
        'cerveza': '🍺'
    };
    return emojis[drink] || '🥤';
}

// Remover invitado
function removeGuest(id) {
    appState.confirmedGuests = appState.confirmedGuests.filter(guest => guest.id !== id);
    saveConfirmedGuests();
    loadConfirmedGuests();
}

// Guardar invitados en localStorage
function saveConfirmedGuests() {
    localStorage.setItem('pena-confirmed-guests', JSON.stringify(appState.confirmedGuests));
}

// Cargar invitados desde localStorage
function loadConfirmedGuests() {
    const saved = localStorage.getItem('pena-confirmed-guests');
    if (saved) {
        appState.confirmedGuests = JSON.parse(saved);
        confirmedList.innerHTML = '';
        appState.confirmedGuests.forEach(guest => addGuestToList(guest));
    }
}

// Animaciones
function initializeAnimations() {
    // Animar título principal
    anime({
        targets: '.hero-title',
        scale: [0.8, 1],
        opacity: [0, 1],
        duration: 1000,
        easing: 'easeOutBounce',
        delay: 300
    });
    
    // Animar tarjeta principal
    anime({
        targets: '.card-hover',
        translateY: [50, 0],
        opacity: [0, 1],
        duration: 800,
        easing: 'easeOutQuart',
        delay: 600
    });
}

function animateAttendanceSelection(attendance) {
    const targetBtn = attendance === 'yes' ? attendYesBtn : attendNoBtn;
    
    anime({
        targets: targetBtn,
        scale: [1, 1.1, 1],
        duration: 300,
        easing: 'easeInOutQuad'
    });
}

function animateDrinkSelection(element) {
    anime({
        targets: element,
        rotate: [0, 5, -5, 0],
        duration: 400,
        easing: 'easeInOutQuad'
    });
}

function showSuccessAnimation() {
    createConfetti();
    
    anime({
        targets: submitBtn,
        scale: [1, 1.2, 1],
        backgroundColor: ['#22c55e', '#16a34a', '#22c55e'],
        duration: 600,
        easing: 'easeInOutQuad'
    });
}

// Efectos visuales
function createParticles() {
    const particles = ['🎉', '🎊', '✨', '🌟', '💫', '🎈', '🎪', '🎭'];
    const container = document.getElementById('particles-container');
    
    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'party-particle';
        particle.textContent = particles[Math.floor(Math.random() * particles.length)];
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 3 + 's';
        
        container.appendChild(particle);
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 3000);
    }
    
    // Crear partículas periódicamente
    setInterval(createParticle, 2000);
}

function createCelebrationEffect() {
    const celebrationEmojis = ['🎉', '🎊', '🥳', '🎈'];
    
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            const emoji = document.createElement('div');
            emoji.className = 'party-particle';
            emoji.textContent = celebrationEmojis[Math.floor(Math.random() * celebrationEmojis.length)];
            emoji.style.left = Math.random() * 100 + '%';
            emoji.style.top = '20%';
            emoji.style.fontSize = '32px';
            
            document.getElementById('particles-container').appendChild(emoji);
            
            anime({
                targets: emoji,
                translateY: [0, -200],
                translateX: [0, (Math.random() - 0.5) * 200],
                opacity: [1, 0],
                duration: 2000,
                easing: 'easeOutQuart',
                complete: () => {
                    if (emoji.parentNode) {
                        emoji.parentNode.removeChild(emoji);
                    }
                }
            });
        }, i * 100);
    }
}

function createConfetti() {
    const colors = ['#fbbf24', '#f59e0b', '#d97706', '#92400e', '#f97316', '#ea580c'];
    const container = document.getElementById('confetti-container');
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 3 + 's';
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
            
            container.appendChild(confetti);
            
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.parentNode.removeChild(confetti);
                }
            }, 5000);
        }, i * 50);
    }
}

// Hacer removeGuest accesible globalmente
window.removeGuest = removeGuest;