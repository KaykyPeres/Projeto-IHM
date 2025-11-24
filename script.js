let selectedPsyName = "";
let selectedPsyPhoto = "";
let selectedDay = "";
let selectedTime = "";

window.onload = function() {
  updateDashboard();
};

function goToScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-' + screenId).classList.add('active');
  
  if(screenId === 'home') {
    resetSelection();
    updateDashboard(); 
  }
}

function resetSelection() {
    selectedDay = "";
    selectedTime = "";
    document.querySelectorAll('.day').forEach(d => d.classList.remove('selected'));
    document.querySelectorAll('.slot').forEach(s => s.classList.remove('selected'));
    checkBooking();
}

function selectPsy(name, photoUrl) {
  selectedPsyName = name;
  selectedPsyPhoto = photoUrl;
  document.getElementById('selected-name').innerText = name;
  document.getElementById('selected-photo').style.backgroundImage = `url('${photoUrl}')`;
  resetSelection(); 
  goToScreen('schedule');
}

function selectDay(element) {
  document.querySelectorAll('.day').forEach(d => d.classList.remove('selected'));
  element.classList.add('selected');
  selectedDay = element.innerText;
  checkBooking();
}

function selectTime(element) {
  document.querySelectorAll('.slot').forEach(s => s.classList.remove('selected'));
  element.classList.add('selected');
  selectedTime = element.innerText;
  checkBooking();
}

function checkBooking() {
  const btn = document.getElementById('btn-confirm');
  if (selectedDay !== "" && selectedTime !== "") {
    btn.classList.remove('disabled');
  } else {
    btn.classList.add('disabled');
  }
}

function updateDashboard() {
  const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
  const dashboardCard = document.getElementById('dashboard-notification');
  
  if (appointments.length > 0) {
    const nextApp = appointments[appointments.length - 1];
    
    document.getElementById('dash-psy-name').innerText = nextApp.psyName;
    document.getElementById('dash-time').innerText = `Dia ${nextApp.day}/11 às ${nextApp.time}`;
    dashboardCard.style.display = "flex"; 
  } else {
    dashboardCard.style.display = "none"; 
  }
}

function finishScheduling() {
  const btn = document.getElementById('btn-confirm');
  btn.classList.add('loading'); 
  
  setTimeout(() => {
    const appointment = {
      psyName: selectedPsyName,
      psyPhoto: selectedPsyPhoto,
      day: selectedDay,
      time: selectedTime,
      id: Date.now()
    };

    let appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    appointments.push(appointment);
    localStorage.setItem('appointments', JSON.stringify(appointments));

    document.getElementById('final-name').innerText = selectedPsyName;
    document.getElementById('final-day').innerText = selectedDay;
    document.getElementById('final-time').innerText = selectedTime;
    
    btn.classList.remove('loading');
    goToScreen('success');
    showToast("Agendamento realizado com sucesso!", "success");
  }, 1500);
}

function loadAppointments() {
  const listElement = document.getElementById('appointments-list');
  const emptyMsg = document.getElementById('no-appointments');
  
  listElement.innerHTML = ""; 
  
  let appointments = JSON.parse(localStorage.getItem('appointments')) || [];

  if (appointments.length === 0) {
    emptyMsg.style.display = "block"; 
  } else {
    emptyMsg.style.display = "none"; 
    
    appointments.reverse().forEach(app => {
      
      const card = document.createElement('div');
      card.className = 'appointment-card-full'; 
      
      card.innerHTML = `
        <div class="app-card-left">
          <div class="psy-photo" style="background-image: url('${app.psyPhoto}'); width: 50px; height: 50px;"></div>
        </div>
        <div class="app-card-middle">
          <h4>${app.psyName}</h4>
          <p>📅 Dia ${app.day}/11 às ${app.time}</p>
          <span class="status-badge">Confirmado</span>
        </div>
        <div class="app-card-right">
          <button class="btn-cancel-icon" onclick="cancelAppointment(${app.id})">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e74c3c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
      `;
      
      listElement.appendChild(card);
    });
  }
}

function cancelAppointment(id) {
  if (confirm("Deseja cancelar este agendamento?")) {
    let appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    let updatedList = appointments.filter(app => Number(app.id) !== Number(id));
    localStorage.setItem('appointments', JSON.stringify(updatedList));
    
    loadAppointments(); 
    updateDashboard();
    showToast("Agendamento cancelado.", "error");
  }
}

function showToast(message, type = 'default') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerText = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = "toastDown 0.3s forwards";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}