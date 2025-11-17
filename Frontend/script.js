let selectedPsyName = "";
let selectedPsyTime = "";

function goToScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-' + screenId).classList.add('active');
  
  if(screenId === 'home') {
    document.querySelectorAll('.slot').forEach(s => s.classList.remove('selected'));
    document.getElementById('btn-confirm').classList.add('disabled');
  }
}

function selectPsy(name, photoUrl) {
  selectedPsyName = name;
  document.getElementById('selected-name').innerText = name;
  document.getElementById('selected-photo').style.backgroundImage = `url('${photoUrl}')`;
  goToScreen('schedule');
}

function selectTime(element) {
  document.querySelectorAll('.slot').forEach(s => s.classList.remove('selected'));
  element.classList.add('selected');
  selectedPsyTime = element.innerText;
  
  document.getElementById('btn-confirm').classList.remove('disabled');
}

function finishScheduling() {
  document.getElementById('final-name').innerText = selectedPsyName;
  document.getElementById('final-time').innerText = selectedPsyTime;
  goToScreen('success');
}