class App {
	timer = {
		min_tens: document.getElementById('min_tens'),
		min: document.getElementById('min'),
		sec_tens: document.getElementById('sec_tens'),
		sec: document.getElementById('sec'),
	};
	#interval;
	audioContext;
	gainNode;
	isTimerRunning = false;

	constructor() {
		this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
		this.gainNode = this.audioContext.createGain();
		this.gainNode.connect(this.audioContext.destination);
	}

	submit(event) {
		event.preventDefault();
		const formData = new FormData(event.target);
		const time = formData.get('time');
		const button = document.querySelector('button');
		const input = document.querySelector('input');
	
		if (!this.isTimerRunning) {
			this.#startTimer(time);
			this.isTimerRunning = true;
			button.innerHTML = '<img src="./img/pause.svg" alt="play"> Пауза'		
		} else {
			clearInterval(this.#interval);
			this.isTimerRunning = false;
			button.innerHTML = '<img src="./img/play.svg" alt="play"> Запустить (установите время)'	
			input.value = '';			
		}
	}

	#clearTimer() {
		if (this.#interval) {
			clearInterval(this.#interval);
		}
		this.#setTimer({
			min_tens: 0,
			min: 0,
			sec_tens: 0,
			sec: 0
		})
	}

	#startTimer(time) {
		const end = Date.now() + time * 1000 * 60;
		this.#interval = setInterval(() => {
			const now = Date.now();
			const delta = end - now;
			if (delta < 0) {
				clearInterval(this.#interval);
				this.#playSound();
				return;
			}
			this.#setTimer({
				min_tens: Math.floor(delta / 1000 / 60 / 10),
				min: Math.floor((delta / 1000 / 60) % 10),
				sec_tens: Math.floor((delta % 60000) / 10000),
				sec: Math.floor(((delta % 60000) / 1000) % 10)
			})
		}, 500);
	}

	#playSound() {
		const gudokSoundUrl = 'gudok.mp3';
		fetch(gudokSoundUrl)
			.then(response => response.arrayBuffer())
			.then(arrayBuffer => {
				this.audioContext.decodeAudioData(arrayBuffer, (buffer) => {
					const source = this.audioContext.createBufferSource();
					source.buffer = buffer;
					source.connect(this.gainNode);
					source.start(0);	

				// уведомление 
					const notification = new Notification('Таймер завершил работу', {
						body: 'Таймер завершил работу.'
					});				
				});
			});
	}

	#setTimer({ min_tens, min, sec_tens, sec }) {
		this.timer.min_tens.innerText = min_tens >= 0 ? min_tens : 0;
		this.timer.min.innerText = min >= 0 ? min : 0;
		this.timer.sec_tens.innerText = sec_tens >= 0 ? sec_tens : 0;
		this.timer.sec.innerText = sec >= 0 ? sec : 0;
	}
}

const app = new App();


