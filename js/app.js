window.addEventListener('load', function () {
	const fullScreenBtn = document.querySelector('.game__button-fullscreen'),
		  menuBtn = document.querySelector('.game__button-menu'),
		  musicBtn = document.querySelector('.game__button-music'),
		  langBtn = document.querySelector('.game__button-lang'),

		  backMusic = new Audio('audio/pustyinya.mp3'),
		  drawMusic = new Audio('audio/draw.mp3'),
		  winMusic = new Audio('audio/win.mp3'),
		  loseMusic = new Audio('audio/loss.mp3'),

		  allLang = ['ru', 'en'],

		  burgerImg = document.querySelector('.button__img-burger'),
		  crossImg = document.querySelector('.button__img-cross'),
		  soundImg = document.querySelector('.button__img-sound'),
		  muteImg = document.querySelector('.button__img-mute'),
		  enImg = document.querySelector('.button__img-en'),
		  ruImg = document.querySelector('.button__img-ru'),

		  scoreUser = document.querySelector('.score__user'),
		  scoreComp = document.querySelector('.score__comp'),

		  fieldGame = document.querySelector('.field__game'),
		  fieldUser = document.querySelector('.user'),
		  fieldComp = document.querySelector('.comp'),
		  
		  descriptionText = document.querySelectorAll('.field__description-text'),

		  newGameBtn = document.querySelector('.new-game__button');
		  
	let	countU = 0,
		countC = 0;

	function slideMenu() {
		fullScreenBtn.classList.toggle('slide-fullscreen');
		musicBtn.classList.toggle('slide-music');
		langBtn.classList.toggle('slide-lang');
	}

	function toggleFullScreen() {
		if (!document.fullscreenElement &&    // альтернативный стандартный метод
			!document.mozFullScreenElement &&
			!document.webkitFullscreenElement) {  // текущие методы работы
			if (document.documentElement.requestFullscreen) {
				document.documentElement.requestFullscreen();
			} else
			if (document.documentElement.mozRequestFullScreen) {
				document.documentElement.mozRequestFullScreen();
			} else
			if (document.documentElement.webkitRequestFullscreen) {
				document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
			}
		} else {
			if (document.cancelFullScreen) {
				document.cancelFullScreen();
			} else
			if (document.mozCancelFullScreen) {
				document.mozCancelFullScreen();
			} else
			if (document.webkitCancelFullScreen) {
				document.webkitCancelFullScreen();
			}
		}
	}

	function toggleLang() {
		//перенаправит на нужный URL языка 
		if(langBtn.value === 'en') {
			langBtn.value = 'ru';
		} else if(langBtn.value === 'ru') {
			langBtn.value = 'en';
		}

		let lang = langBtn.value;
		location.href = window.location.pathname + '#' +lang;
		//location.reload();

		let hash = window.location.hash;
		hash = hash.substr(1);
		//проверяем наличие языков
		if(!allLang.includes(hash)) {
			location.href = window.location.pathname + '#en';
			location.reload();
		}

		langBtn.value = hash;
		document.querySelector('title').innerHTML = langArr['title'][hash];

		for(let key in langArr) {
			let elem = document.querySelector('.lang-' + key);
			if(elem) {
				elem.innerHTML = langArr[key][hash];
			}
		}
	}

	function toogleMusic() {
		if(musicBtn.value === 's') {
			musicBtn.value = 'm';

			backMusic.muted = true;
			drawMusic.muted = true;
			winMusic.muted = true;
			loseMusic.muted = true;
		} else if(musicBtn.value === 'm') {
			musicBtn.value = 's';

			backMusic.muted = false;
			drawMusic.muted = false;
			winMusic.muted = false;
			loseMusic.muted = false;
		}
	}

	function choiceUser(e) {
		let target = e.target;

		if (target.classList.contains('field__button')) {
			let fields = document.querySelectorAll('.field__button');
			fields.forEach((item) => {
				item.classList.remove('field__button--active', 'field__button--error');
			});

			let userCh = target.dataset.field;

			target.classList.add('field__button--active');
			fieldGame.classList.add('inactive');
			newGameBtn.classList.add('inactive');

			descriptionText.forEach((item) => {
				const target = item.classList.contains('text-active');

				if(target) {
					item.classList.remove('text-active');
					descriptionText[4].classList.add('text-active');
				}
			});

			choiceComp(userCh);
		}
	}

	function choiceComp(userCh) {
		let rand = Math.floor(Math.random() * 3);
		let fields = fieldComp.querySelectorAll('.field__button');

		fieldComp.classList.add('field__button--blink');

		setTimeout(() => {
			fieldComp.classList.remove('field__button--blink');

			let compCh = fields[rand].dataset.field;
			
			fields.forEach((item) => {
				item.classList.remove('field__button--active');
			});
			fields[rand].classList.add('field__button--active');
			fieldGame.classList.remove('inactive');
			newGameBtn.classList.remove('inactive');

			winner(userCh, compCh);
		},3000);
	}

	function winner(userCh, compCh) {
		let comb = userCh + compCh;

		switch (comb) {
			case 'rr':
			case 'ss':
			case 'pp':
				descriptionText.forEach((item) => {
					const target = item.classList.contains('text-active');

					if(target) {
						item.classList.remove('text-active');
						descriptionText[3].classList.add('text-active');
					}
				});

				drawMusic.play();

				break;

			case 'rs':
			case 'sp':
			case 'pr':
				descriptionText.forEach((item) => {
					const target = item.classList.contains('text-active');

					if(target) {
						item.classList.remove('text-active');
						descriptionText[2].classList.add('text-active');
					}
				});

				countU++;
				scoreUser.innerHTML = countU;
				fieldComp.querySelector('[data-field="' + compCh + '"]').classList.add('field__button--error');

				winMusic.play();

				finishGame();

				break;

			case 'sr':
			case 'ps':
			case 'rp':
				descriptionText.forEach((item) => {
					const target = item.classList.contains('text-active');

					if(target) {
						item.classList.remove('text-active');
						descriptionText[1].classList.add('text-active');
					}
				});

				countC++;
				scoreComp.innerHTML = countC;
				fieldUser.querySelector('[data-field="' + userCh + '"]').classList.add('field__button--error');

				loseMusic.play();

				finishGame();

				break;

			default:

				break;
		}
	}

	function playGame() {
		countU = 0;
		countC = 0;

		descriptionText.forEach((item) => {
			const target = item.classList.contains('text-active');

			if(target) {
				item.classList.remove('text-active');
				descriptionText[0].classList.add('text-active');
			}
		});

		scoreUser.innerHTML = '0';
		scoreComp.innerHTML = '0';

		fieldGame.classList.remove('inactive');
		let fields = document.querySelectorAll('.field__button');
		fields.forEach((item) => {
			item.classList.remove('field__button--active', 'field__button--error');
		});
	}

	function finishGame() {
		function inactive() {
			fieldGame.classList.add('inactive');

			setTimeout(() => {
				newGameBtn.classList.remove('inactive');
			},3000);
		}

		if(countU === 5) {
			descriptionText.forEach((item) => {
				const target = item.classList.contains('text-active');

				if(target) {
					item.classList.remove('text-active');
					descriptionText[5].classList.add('text-active');
				}
			});
			inactive();
		} else if(countC === 5) {
			descriptionText.forEach((item) => {
				const target = item.classList.contains('text-active');

				if(target) {
					item.classList.remove('text-active');
					descriptionText[6].classList.add('text-active');
				}
			});
			inactive();
		}
	}

	backMusic.play();
	backMusic.setAttribute('loop', '100000');
	fullScreenBtn.addEventListener('click', toggleFullScreen);
	fieldUser.addEventListener('click', choiceUser);
	newGameBtn.addEventListener('click', playGame);

	menuBtn.addEventListener('click', () => {
		burgerImg.classList.toggle('hide');
		crossImg.classList.toggle('show');

		slideMenu();
	});
	
	musicBtn.addEventListener('click', () => {
		soundImg.classList.toggle('hide');
		muteImg.classList.toggle('show');

		toogleMusic();
	});

	langBtn.addEventListener('click', () => {
		enImg.classList.toggle('hide');
		ruImg.classList.toggle('show');

		toggleLang();
	});
});