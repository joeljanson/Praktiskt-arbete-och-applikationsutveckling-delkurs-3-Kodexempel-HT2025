import * as Tone from 'tone';

// Skapa en synth.
const synth = new Tone.Synth().toDestination();

// Antal steg i sekvensern.
const numSteps = 16;

// Noterna som kan spelas.
const notes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'];

// Hämta HTML-element.
const sequencerContainer = document.getElementById('sequencer');
const playButton = document.getElementById('play-button');
const tempoInput = document.getElementById('tempo');
const tempoValue = document.getElementById('tempo-value');

// Skapa sekvenser-griden.
for (let i = 0; i < notes.length; i++) {
  for (let j = 0; j < numSteps; j++) {
    const step = document.createElement('div');
    step.classList.add('step');
    step.dataset.note = notes[i];
    step.dataset.step = j;
    sequencerContainer.appendChild(step);
  }
}

// Hantera klick på steg.
sequencerContainer.addEventListener('click', (e) => {
  if (e.target.classList.contains('step')) {
    e.target.classList.toggle('active');
  }
});

// Hantera play/stopp-knappen.
playButton.addEventListener('click', async () => {
  await Tone.start();
  if (Tone.Transport.state === 'started') {
    Tone.Transport.stop();
    playButton.textContent = 'Play';
    playButton.classList.remove('playing');
  } else {
    Tone.Transport.start();
    playButton.textContent = 'Stop';
    playButton.classList.add('playing');
  }
});

// Hantera tempo-kontrollen.
tempoInput.addEventListener('input', (e) => {
  Tone.Transport.bpm.value = e.target.value;
  tempoValue.textContent = e.target.value;
});

// Skapa en loop som spelar sekvensern.
let currentStep = 0;
const loop = new Tone.Loop((time) => {
  // Rensa föregående stegs visuella markering.
  const prevSteps = document.querySelectorAll('.current');
  prevSteps.forEach(step => step.classList.remove('current'));

  // Markera nuvarande steg.
  const currentSteps = document.querySelectorAll(`[data-step='${currentStep}']`);
  currentSteps.forEach(step => step.classList.add('current'));

  // Spela aktiva noter.
  currentSteps.forEach(step => {
    if (step.classList.contains('active')) {
      synth.triggerAttackRelease(step.dataset.note, '8n', time);
    }
  });

  // Gå till nästa steg.
  currentStep = (currentStep + 1) % numSteps;
}, '16n').start(0);