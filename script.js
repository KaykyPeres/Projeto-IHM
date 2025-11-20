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
        <div>
            <strong>${app.psyName}</strong><br>
            Dia ${app.day}/11 às ${app.time}
        </div>
        <span style="color:green">✔</span>
      `;
      listDiv.appendChild(div);
    });
  } else {
    areaDiv.style.display = "none";
  }
}