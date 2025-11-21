let selectedPsyName = "";
let selectedPsyPhoto = "";
let selectedDay = "";
let selectedTime = "";

function goToScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-' + screenId).classList.add('active');

  if (screenId === 'home') {
    resetSelection();
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

function finishScheduling() {
  const appointment = {
    psyName: selectedPsyName,
    day: selectedDay,
    time: selectedTime
  };

  let appointments = JSON.parse(localStorage.getItem('appointments')) || [];
  appointments.push(appointment);
  localStorage.setItem('appointments', JSON.stringify(appointments));

  document.getElementById('final-name').innerText = selectedPsyName;
  document.getElementById('final-day').innerText = selectedDay;
  document.getElementById('final-time').innerText = selectedTime;

  goToScreen('success');
}

function loadSavedAppointments() {
  const listDiv = document.getElementById('saved-list');
  const areaDiv = document.getElementById('my-appointments-area');
  listDiv.innerHTML = "";
  
  let appointments = JSON.parse(localStorage.getItem('appointments')) || [];
  
  if (appointments.length > 0) {
    areaDiv.style.display = "block";
    
    appointments.reverse().forEach(app => {
      const div = document.createElement('div');
      div.className = 'saved-card';
      
      div.innerHTML = `
        <div style="display:flex; align-items:center; gap:10px; width:100%">
            <div class="psy-photo" style="width:40px; height:40px; background-image: url('${app.psyPhoto}')"></div>
            <div>
                <strong>${app.psyName}</strong><br>
                <span style="font-size:0.85rem; color:#666">Dia ${app.day}/11 às ${app.time}</span>
            </div>
            <button class="btn-delete" onclick="cancelAppointment(${app.id})">✕</button>
        </div>
      `;
      listDiv.appendChild(div);
    });
  } else {
    areaDiv.style.display = "none";
  }
}

function cancelAppointment(id) {
  if (confirm("Tem certeza que deseja cancelar este agendamento?")) {
  
    let appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    let updatedList = appointments.filter(app => app.id !== id);
    localStorage.setItem('appointments', JSON.stringify(updatedList));
    
    loadSavedAppointments();
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
    
  }, 1500); 
}

function cancelAppointment(id) {
  if (confirm("Deseja realmente cancelar?")) {
    let appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    let updatedList = appointments.filter(app => Number(app.id) !== Number(id));
    localStorage.setItem('appointments', JSON.stringify(updatedList));
    
    loadSavedAppointments();
    showToast("Agendamento cancelado.", "error");
  }
}