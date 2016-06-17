var Slider = {};

Slider.init = function(div_slider, options) {
	var ind_src	
	, self = this
	;

	self.divSlider = document.getElementById(div_slider);
	self.imagens.lista = document.getElementsByClassName("img_slider");
	self.imagens.ultima = (self.imagens.lista.length - 1);

	div_slider = self.divSlider;

	self.Options = self.validation(options);
	self.makeHtml();

	self.imagens.lista = document.getElementsByClassName("img_slider");
	self.imagens.ultima = (self.imagens.lista.length - 1);

	self.balls.list = document.getElementsByClassName("ball");	
	self.balls.last = self.balls.list.length - 1; 	

	div_slider.dataset.src = 0;
	self.toggleClass(self.imagens.lista[0], self.objClasses.image.inativo, self.objClasses.image.ativo);
	self.toggleClass(self.balls.list[0], self.objClasses.ball.inativo, self.objClasses.ball.ativo);
	self.autoSlide();
};

Slider.objClasses = {
	'image' : {
		'ativo' : "slider-visible_img"
		,'inativo' : "slider-hidden_img"
	}
	,'ball': {
		'ativo' : "slider-active_ball"
		, 'inativo' : "slider-inactive_ball"
	}
};

Slider.divSlider = null;

Slider.imagens = {
	'lista' : [],
	'ultima': null
};

Slider.Options = {};

Slider.balls = {};

Slider.validation = function(options) {
	var defaultOptions = {
		"time": 3000
		,"height": window.innerHeight
		, "definedHeight": 0
	};

	if (options == undefined || typeof options == undefined) {
		return defaultOptions;
	}
	if (options.hasOwnProperty('height') && isNaN(options.height)) {
		throw new  {'Error':"'height' property invalid"};
	}

	if (options.hasOwnProperty('time') && isNaN(options.time)) {
		throw new {'Error':"'time' property invalid"};
	}

	if (options.hasOwnProperty('time')) {
		defaultOptions.time = options.time;
	}

	if (options.hasOwnProperty('height')) {
		defaultOptions.height = options.height;
		defaultOptions.definedHeight = 1;
	}

	return defaultOptions;
}

Slider.makeHtml = function() {
	var estrutura = []
	, self = this
	, controle = []
	, classeBola
	, s_direita
	, s_esquerda
	;

	for (var i = 0; i < self.imagens.lista.length; i++) {

		if (i > 0) {
			self.imagens.lista[i].classList.add(self.objClasses.image.inativo);
			classeBola = self.objClasses.ball.inativo;
		} else {
			classeBola = self.objClasses.ball.ativo;
		}

		controle.push("<div class='ball "+classeBola+"' id='ball_"+(i+1)+"' data-src='"+i+"'></div>");
	}

	estrutura.push(
		"<center id='center_img'>",
		self.divSlider.innerHTML,
		"</center>",
		"<div id='controles_slider'>",
		"<span class='seta' id='s_esquerda'><i class='fa fa-angle-left fa-5x' aria-hidden='true'></i>",
		"</span>",
		"<span class='seta' id='s_direita'><i class='fa fa-angle-right fa-5x' aria-hidden='true'></i>",
		"</span>",
		"<div id='slider_balls'>",
		"<center id='balls'>",
		controle.join(""),
		"</center>",
		"</div>",
		"</div>");

	self.divSlider.innerHTML = estrutura.join("");	

	document.getElementById("center_img").style.height = self.Options.height + "px";
	self.divSlider.style.height = self.Options.height + "px";

	window.onresize =  function(){		
		if(self.Options.definedHeight === 0) {
			self.Options.height = window.innerHeight;
			document.getElementById("center_img").style.height = self.Options.height + "px";
			self.divSlider.style.height = self.Options.height + "px";
		}
		
	};
}

Slider.autoSlide = function () {
	var self = this
	, s_direita = document.getElementById("s_direita")
	, s_esquerda = document.getElementById("s_esquerda")
	;

	var intervalo = setInterval(function() {
		self.nextImg();
	}, self.Options.time);

	s_direita.onclick = function() {
		clearInterval(intervalo);
		self.nextImg();
		self.autoSlide();
	};

	s_esquerda.onclick = function() {
		clearInterval(intervalo);
		self.prevImg();
		self.autoSlide();
	};

	for (var index = self.balls.list.length - 1; index >= 0; index--) {
		if(index < self.balls.list.length) {
			self.balls.list[index].onclick = function() {
				clearInterval(intervalo);
				self.controlChange(this);
				self.autoSlide();
			}
		}
	};
}

Slider.nextImg = function () {
	var self = this
	, ind_src
	;

	ind_src = +self.divSlider.dataset.src;
	if((ind_src + 1) >= self.imagens.lista.length) {		
		self.divSlider.dataset.src = 0;
		self.toggle(self.imagens.lista[0], self.balls.list[0]);
		return;
	}

	self.divSlider.dataset.src = ind_src + 1;
	self.toggle(self.imagens.lista[self.divSlider.dataset.src], self.balls.list[self.divSlider.dataset.src]);
}

Slider.prevImg = function () {
	var self = this
	, ind_src
	;

	ind_src = +self.divSlider.dataset.src;
	if (ind_src <= 0) {		
		self.divSlider.dataset.src = self.imagens.lista.length - 1;
		self.toggle(self.imagens.lista[self.imagens.ultima], self.balls.list[self.balls.last]);
		return;
	}

	self.divSlider.dataset.src = ind_src - 1;
	self.toggle(self.imagens.lista[self.divSlider.dataset.src], self.balls.list[self.divSlider.dataset.src]);
}

Slider.controlChange = function (currentBall) {
	var self = this
	, ind_src = +currentBall.dataset.src
	;

	self.divSlider.dataset.src = ind_src;
	self.toggle(self.imagens.lista[ind_src], currentBall);

}

Slider.toggleClass = function (element, classFrom, classTo) {
	element.classList.add(classTo);
	element.classList.remove(classFrom);
}

Slider.toggle = function (imgToShow, controlToShow) {
	var self = this
	, imgToHide = document.getElementsByClassName(self.objClasses.image.ativo)
	, controlToHide = document.getElementsByClassName(self.objClasses.ball.ativo)
	;

	imgToHide = imgToHide[0];
	controlToHide = controlToHide[0];

	if (imgToHide != imgToShow) {		
		self.toggleClass(imgToHide, self.objClasses.image.ativo, self.objClasses.image.inativo);
		self.toggleClass(imgToShow, self.objClasses.image.inativo, self.objClasses.image.ativo);
		self.toggleClass(controlToHide, self.objClasses.ball.ativo, self.objClasses.ball.inativo);
		self.toggleClass(controlToShow, self.objClasses.ball.inativo, self.objClasses.ball.ativo);
	}
}