/*  Snowfall jquery plugin - Improved SVG Version with Presets */

(function($){
	// 预设配置
	$.snowfall.presets = {
		realistic: {
			flakeCount: 20,
			flakeType: 'svg',
			flakeColor: '#f0f8ff',
			minSize: 4,
			maxSize: 10,
			minSpeed: 0.5,
			maxSpeed: 2,
			flakeOpacity: 0.9,
			windEffect: true
		},
		lightSnow: {
			flakeCount: 25,
			flakeType: 'character',
			flakeCharacter: '❆',
			flakeColor: '#e6f3ff',
			minSize: 3,
			maxSize: 8,
			minSpeed: 1,
			maxSpeed: 3,
			flakeOpacity: 0.8
		},
		blizzard: {
			flakeCount: 50,
			flakeType: 'character',
			flakeCharacter: '❄',
			flakeColor: '#d4eaff',
			minSize: 2,
			maxSize: 5,
			minSpeed: 2,
			maxSpeed: 6,
			flakeOpacity: 0.7,
			windEffect: true
		},
		heavySnow: {
			flakeCount: 15,
			flakeType: 'svg',
			flakeColor: '#ffffff',
			minSize: 8,
			maxSize: 15,
			minSpeed: 0.3,
			maxSpeed: 1.5,
			flakeOpacity: 0.95,
			windEffect: true
		},
		classic: {
			flakeCount: 30,
			flakeType: 'classic',
			flakeColor: '#ffffff',
			minSize: 2,
			maxSize: 6,
			minSpeed: 1,
			maxSpeed: 4,
			round: true,
			shadow: true
		}
	};

	$.snowfall = function(element, options){
		// 如果传入的是预设名称，则使用预设配置
		if (typeof options === 'string' && $.snowfall.presets[options]) {
			options = $.snowfall.presets[options];
		}
		
		// 修改默认配置：使用 lightSnow 预设作为默认值
		var	defaults = $.snowfall.presets.lightSnow; // 直接使用 lightSnow 作为默认配置
		
		// 扩展用户选项到默认配置
		options = $.extend({}, defaults, options);
		
		var random = function random(min, max){
			return Math.round(min + Math.random()*(max-min)); 
		};
			
		$(element).data("snowfall", this);			
		
		// Snow flake object
		function Flake(_x, _y, _size, _speed, _id)
		{
			// Flake properties
			this.id = _id; 
			this.x  = _x;
			this.y  = _y;
			this.size = _size;
			this.speed = _speed;
			this.step = 0;
			this.stepSize = random(5,15) / 100;
			this.opacity = random(60, 95) / 100;
			this.rotation = random(0, 360);
			this.rotationSpeed = random(1, 3) / 10;
			this.wind = options.windEffect ? (random(-5, 5) / 10) : 0;

			if(options.collection){
				this.target = canvasCollection[random(0,canvasCollection.length-1)];
			}
			
			var flakeElement;
			
			if (options.flakeType === 'svg') {
				// 更真实的雪花 SVG 形状
				var svgSize = this.size * 6;
				var svgHTML = `
					<svg class="snowfall-flakes" id="flake-${this.id}" 
						 width="${svgSize}" height="${svgSize}" 
						 viewBox="0 0 100 100" 
						 style="position:absolute; top:${this.y}px; left:${this.x}px; z-index:${options.flakeIndex}; pointer-events:none; opacity:${this.opacity * options.flakeOpacity}; transform: rotate(${this.rotation}deg);">
						<!-- 六角雪花基础形状 -->
						<g fill="${options.flakeColor}" stroke="${options.flakeColor}" stroke-width="1.5">
							<!-- 主枝干 -->
							<path d="M50 10 L50 90 M30 30 L70 70 M70 30 L30 70"/>
							<!-- 侧枝 -->
							<path d="M35 20 L40 25 L45 20 M55 20 L60 25 L65 20
									M35 80 L40 75 L45 80 M55 80 L60 75 L65 80
									M20 35 L25 40 L20 45 M80 35 L75 40 L80 45
									M20 55 L25 60 L20 65 M80 55 L75 60 L80 65"/>
							<!-- 装饰点 -->
							<circle cx="50" cy="25" r="2"/>
							<circle cx="50" cy="75" r="2"/>
							<circle cx="25" cy="50" r="2"/>
							<circle cx="75" cy="50" r="2"/>
							<circle cx="35" cy="35" r="1.5"/>
							<circle cx="65" cy="35" r="1.5"/>
							<circle cx="35" cy="65" r="1.5"/>
							<circle cx="65" cy="65" r="1.5"/>
						</g>
					</svg>
				`;
				
				if($(element).get(0).tagName === $(document).get(0).tagName){
					$('body').append(svgHTML);
					element = $('body');
				}else{
					$(element).append(svgHTML);
				}
				
			} else if (options.flakeType === 'character') {
				// 使用更好的雪花字符
				flakeElement = $(document.createElement("span"))
					.attr({
						'class': 'snowfall-flakes', 
						'id': 'flake-' + this.id
					})
					.html(options.flakeCharacter)
					.css({
						'color': options.flakeColor,
						'fontSize': this.size * 8 + 'px',
						'position': 'absolute', 
						'top': this.y, 
						'left': this.x, 
						'zIndex': options.flakeIndex || 999999,
						'pointerEvents': 'none',
						'userSelect': 'none',
						'opacity': this.opacity * options.flakeOpacity,
						'textShadow': options.shadow ? '1px 1px 3px rgba(0,0,0,0.4)' : 'none',
						'transform': `rotate(${this.rotation}deg)`,
						'fontWeight': 'normal'
					});
					
				if($(element).get(0).tagName === $(document).get(0).tagName){
					$('body').append(flakeElement);
					element = $('body');
				}else{
					$(element).append(flakeElement);
				}
				
			} else {
				// 经典圆形
				flakeElement = $(document.createElement("div"))
					.attr({
						'class': 'snowfall-flakes', 
						'id': 'flake-' + this.id
					})
					.css({
						'width': this.size, 
						'height': this.size, 
						'background': options.flakeColor, 
						'position': 'absolute', 
						'top': this.y, 
						'left': this.x, 
						'fontSize': 0, 
						'zIndex': options.flakeIndex || 999999,
						'opacity': this.opacity * options.flakeOpacity,
						'borderRadius': '50%'
					});
					
				if($(element).get(0).tagName === $(document).get(0).tagName){
					$('body').append(flakeElement);
					element = $('body');
				}else{
					$(element).append(flakeElement);
				}
			}
			
			this.element = document.getElementById('flake-' + this.id);
			
			// Update function
			this.update = function(){
				this.y += this.speed;
				
				// 根据大小调整速度 - 大雪片落得慢
				var sizeFactor = 1 - (this.size / (options.maxSize * 2));
				this.y += this.speed * sizeFactor;
				
				if(this.y > (elHeight) - (this.size * 3 + 6)){
					this.reset();
				}
				
				// 更自然的旋转
				this.rotation += this.rotationSpeed;
				
				if (this.element) {
					this.element.style.top = this.y + 'px';
					this.element.style.left = this.x + 'px';
					
					// 添加风效和旋转
					if (options.flakeType !== 'classic') {
						this.element.style.transform = `rotate(${this.rotation}deg) translateX(${this.wind}px)`;
					}
				}
				
				this.step += this.stepSize;

				// 更自然的摆动
				if (doRatio === false) {
					this.x += Math.cos(this.step) * 0.5 + this.wind;
				} else {
					this.x += (doRatio + Math.cos(this.step) * 0.5 + this.wind);
				}

				// Pileup check
				if(options.collection){
					if(this.x > this.target.x && this.x < this.target.width + this.target.x && this.y > this.target.y && this.y < this.target.height + this.target.y){
						var ctx = this.target.element.getContext("2d"),
							curX = this.x - this.target.x,
							curY = this.y - this.target.y,
							colData = this.target.colData;
							
							if(colData[parseInt(curX)][parseInt(curY+this.speed+this.size)] !== undefined || curY+this.speed+this.size > this.target.height){
								if(curY+this.speed+this.size > this.target.height){
									while(curY+this.speed+this.size > this.target.height && this.speed > 0){
										this.speed *= .5;
									}

									ctx.fillStyle = options.flakeColor;
									ctx.globalAlpha = this.opacity;
									
									if(colData[parseInt(curX)][parseInt(curY+this.speed+this.size)] == undefined){
										colData[parseInt(curX)][parseInt(curY+this.speed+this.size)] = 1;
										ctx.fillRect(curX, (curY)+this.speed+this.size, this.size, this.size);
									}else{
										colData[parseInt(curX)][parseInt(curY+this.speed)] = 1;
										ctx.fillRect(curX, curY+this.speed, this.size, this.size);
									}
									ctx.globalAlpha = 1.0;
									this.reset();
								}else{
									this.speed = 1;
									this.stepSize = 0;
								
									if(parseInt(curX)+1 < this.target.width && colData[parseInt(curX)+1][parseInt(curY)+1] == undefined ){
										this.x++;
									}else if(parseInt(curX)-1 > 0 && colData[parseInt(curX)-1][parseInt(curY)+1] == undefined ){
										this.x--;
									}else{
										ctx.fillStyle = options.flakeColor;
										ctx.globalAlpha = this.opacity;
										ctx.fillRect(curX, curY, this.size, this.size);
										colData[parseInt(curX)][parseInt(curY)] = 1;
										ctx.globalAlpha = 1.0;
										this.reset();
									}
								}
							}
					}
				}
				
				if(this.x > (elWidth) - widthOffset || this.x < widthOffset){
					this.reset();
				}
			}
			
			// Reset function
			this.reset = function(){
				this.y = -random(0, 50);
				this.x = random(widthOffset, elWidth - widthOffset);
				this.stepSize = random(5,15) / 100;
				this.size = random((options.minSize * 100), (options.maxSize * 100)) / 100;
				this.speed = random(options.minSpeed * 100, options.maxSpeed * 100) / 100;
				this.opacity = random(60, 95) / 100;
				this.rotation = random(0, 360);
				this.rotationSpeed = random(1, 3) / 10;
				this.wind = options.windEffect ? (random(-5, 5) / 10) : 0;
				
				if (this.element) {
					if (options.flakeType === 'svg') {
						var svgSize = this.size * 6;
						this.element.style.width = svgSize + 'px';
						this.element.style.height = svgSize + 'px';
						this.element.style.opacity = this.opacity * options.flakeOpacity;
					} else if (options.flakeType === 'character') {
						this.element.style.fontSize = this.size * 8 + 'px';
						this.element.style.opacity = this.opacity * options.flakeOpacity;
					} else {
						this.element.style.opacity = this.opacity * options.flakeOpacity;
					}
				}
			}
		}
	
		// Private vars
		var flakes = [],
			flakeId = 0,
			i = 0,
			elHeight = $(element).height(),
			elWidth = $(element).width(),
			widthOffset = 0,
			snowTimeout = 0;
	
		// Collection Piece
		if(options.collection !== false){
			var testElem = document.createElement('canvas');
			if(!!(testElem.getContext && testElem.getContext('2d'))){
				var canvasCollection = [],
					elements = $(options.collection),
					collectionHeight = options.collectionHeight;
				
				for(var i =0; i < elements.length; i++){
						var bounds = elements[i].getBoundingClientRect(),
							canvas = document.createElement('canvas'),
							collisionData = [];

						if(bounds.top-collectionHeight > 0){									
							document.body.appendChild(canvas);
							canvas.style.position = 'absolute';
							canvas.height = collectionHeight;
							canvas.width = bounds.width;
							canvas.style.left = bounds.left + 'px';
							canvas.style.top = bounds.top-collectionHeight + 'px';
							
							for(var w = 0; w < bounds.width; w++){
								collisionData[w] = [];
							}
							
							canvasCollection.push({element :canvas, x : bounds.left, y : bounds.top-collectionHeight, width : bounds.width, height: collectionHeight, colData : collisionData});
						}
				}
			}else{
				options.collection = false;
			}
		}
		
		if($(element).get(0).tagName === $(document).get(0).tagName){
			widthOffset = 25;
		}
		
		$(window).bind("resize", function(){  
			elHeight = $(element).height();
			elWidth = $(element).width();
		}); 
		
		// 初始化雪花
		for(i = 0; i < options.flakeCount; i+=1){
			flakeId = flakes.length;
			flakes.push(new Flake(
				random(widthOffset, elWidth - widthOffset), 
				random(-100, 0),
				random((options.minSize * 100), (options.maxSize * 100)) / 100, 
				random(options.minSpeed * 100, options.maxSpeed * 100) / 100, 
				flakeId
			));
		}

		// 样式设置
		if(options.round && options.flakeType === 'classic'){
			$('.snowfall-flakes').css({
				'-moz-border-radius': options.maxSize, 
				'-webkit-border-radius': options.maxSize, 
				'border-radius': options.maxSize
			});
		}
		
		if(options.shadow && options.flakeType === 'classic'){
			$('.snowfall-flakes').css({
				'-moz-box-shadow': '1px 1px 2px rgba(0,0,0,0.3)', 
				'-webkit-box-shadow': '1px 1px 2px rgba(0,0,0,0.3)', 
				'box-shadow': '1px 1px 2px rgba(0,0,0,0.3)'
			});
		}

		var doRatio = false;
		if (options.deviceorientation) {
			$(window).bind('deviceorientation', function(event) {
				doRatio = event.originalEvent.gamma * 0.05;
			});
		}

		function snow(){
			for( i = 0; i < flakes.length; i += 1){
				flakes[i].update();
			}
			snowTimeout = setTimeout(function(){ snow(); }, 40);
		}
		
		snow();
	
	this.clear = function(){
		$(element).find('.snowfall-flakes').remove();
		flakes = [];
		clearTimeout(snowTimeout);
	};
};

$.fn.snowfall = function(options){
	if(typeof(options) == "object" || options == undefined){		
		return this.each(function(i){
			(new $.snowfall(this, options)); 
		});	
	}else if (typeof(options) == "string") {
		// 支持预设名称
		if ($.snowfall.presets[options]) {
			return this.each(function(i){
				(new $.snowfall(this, $.snowfall.presets[options])); 
			});
		} else {
			// 清除雪花
			return this.each(function(i){
				var snow = $(this).data('snowfall');
				if(snow){
					snow.clear();
				}
			});
		}
	}
};
})(jQuery);