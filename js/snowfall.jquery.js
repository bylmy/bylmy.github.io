/*  Snowfall jquery plugin - SVG Version

	====================================================================
	LICENSE
	====================================================================
	Licensed under the Apache License, Version 2.0 (the "License");
	you may not use this file except in compliance with the License.
	You may obtain a copy of the License at

	   http://www.apache.org/licenses/LICENSE-2.0

	   Unless required by applicable law or agreed to in writing, software
	   distributed under the License is distributed on an "AS IS" BASIS,
	   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	   See the License for the specific language governing permissions and
	   limitations under the License.
	====================================================================

	Modified to use SVG snowflakes instead of dots
*/

(function($){
	$.snowfall = function(element, options){
		var	defaults = {
				flakeCount : 35,
				flakeColor : '#ffffff',
				flakeIndex: 999999,
				minSize : 1,
				maxSize : 2,
				minSpeed : 1,
				maxSpeed : 5,
				round : false,
				shadow : false,
				collection : false,
				collectionHeight : 40,
				deviceorientation : false,
				flakeType: 'svg', // 新增：雪花类型 'svg', 'classic', 'character'
				flakeCharacter: '❄', // 字符雪花
				flakeOpacity: 0.8 // 雪花透明度
			},
			options = $.extend(defaults, options),
			random = function random(min, max){
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
				this.stepSize = random(1,10) / 100;
				this.opacity = random(50, 100) / 100; // 随机透明度
				this.rotation = random(0, 360); // 随机旋转角度
	
				if(options.collection){
					this.target = canvasCollection[random(0,canvasCollection.length-1)];
				}
				
				var flakeElement;
				
				if (options.flakeType === 'svg') {
					// SVG 雪花
					var svgSize = this.size * 8; // SVG 需要更大的基础尺寸
					var svgHTML = `
						<svg class="snowfall-flakes" id="flake-${this.id}" 
							 width="${svgSize}" height="${svgSize}" 
							 viewBox="0 0 100 100" 
							 style="position:absolute; top:${this.y}px; left:${this.x}px; z-index:${options.flakeIndex}; pointer-events:none; opacity:${this.opacity * options.flakeOpacity}; transform: rotate(${this.rotation}deg);">
							<!-- 复杂雪花形状 -->
							<path d="M50 10 L55 25 L70 20 L60 35 L75 40 L60 45 L70 60 L55 55 L50 70 L45 55 L30 60 L40 45 L25 40 L40 35 L30 20 L45 25 Z" 
								  fill="${options.flakeColor}" 
								  stroke="${options.flakeColor}" 
								  stroke-width="2"/>
							<!-- 内部细节 -->
							<path d="M50 20 L55 30 L65 27 L58 38 L65 43 L55 42 L53 52 L47 52 L45 42 L35 43 L42 38 L35 27 L45 30 Z" 
								  fill="${options.flakeColor}" 
								  stroke="${options.flakeColor}" 
								  stroke-width="1"/>
						</svg>
					`;
					
					if($(element).get(0).tagName === $(document).get(0).tagName){
						$('body').append(svgHTML);
						element = $('body');
					}else{
						$(element).append(svgHTML);
					}
					
				} else if (options.flakeType === 'character') {
					// 字符雪花
					flakeElement = $(document.createElement("span"))
						.attr({
							'class': 'snowfall-flakes', 
							'id': 'flake-' + this.id
						})
						.html(options.flakeCharacter)
						.css({
							'color': options.flakeColor,
							'fontSize': this.size * 10 + 'px',
							'position': 'absolute', 
							'top': this.y, 
							'left': this.x, 
							'zIndex': options.flakeIndex,
							'pointerEvents': 'none',
							'userSelect': 'none',
							'opacity': this.opacity * options.flakeOpacity,
							'textShadow': options.shadow ? '1px 1px 2px rgba(0,0,0,0.3)' : 'none',
							'transform': `rotate(${this.rotation}deg)`
						});
						
					if($(element).get(0).tagName === $(document).get(0).tagName){
						$('body').append(flakeElement);
						element = $('body');
					}else{
						$(element).append(flakeElement);
					}
					
				} else {
					// 经典圆形雪花（保持向后兼容）
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
							'zIndex': options.flakeIndex,
							'opacity': this.opacity * options.flakeOpacity
						});
						
					if($(element).get(0).tagName === $(document).get(0).tagName){
						$('body').append(flakeElement);
						element = $('body');
					}else{
						$(element).append(flakeElement);
					}
				}
				
				this.element = document.getElementById('flake-' + this.id);
				
				// Update function, used to update the snow flakes, and checks current snowflake against bounds
				this.update = function(){
					this.y += this.speed;
					
					if(this.y > (elHeight) - (this.size * 3 + 6)){ // 调整边界检测
						this.reset();
					}
					
					// 添加旋转动画
					this.rotation += this.speed * 0.5;
					
					if (this.element) {
						this.element.style.top = this.y + 'px';
						this.element.style.left = this.x + 'px';
						
						// 为 SVG 和字符添加旋转
						if (options.flakeType !== 'classic') {
							this.element.style.transform = `rotate(${this.rotation}deg)`;
						}
					}
					
					this.step += this.stepSize;

					if (doRatio === false) {
						this.x += Math.cos(this.step);
					} else {
						this.x += (doRatio + Math.cos(this.step));
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
										// flow to the sides
										this.speed = 1;
										this.stepSize = 0;
									
										if(parseInt(curX)+1 < this.target.width && colData[parseInt(curX)+1][parseInt(curY)+1] == undefined ){
											// go left
											this.x++;
										}else if(parseInt(curX)-1 > 0 && colData[parseInt(curX)-1][parseInt(curY)+1] == undefined ){
											// go right
											this.x--;
										}else{
											//stop
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
				
				// Resets the snowflake once it reaches one of the bounds set
				this.reset = function(){
					this.y = 0;
					this.x = random(widthOffset, elWidth - widthOffset);
					this.stepSize = random(1,10) / 100;
					this.size = random((options.minSize * 100), (options.maxSize * 100)) / 100;
					this.speed = random(options.minSpeed, options.maxSpeed);
					this.opacity = random(50, 100) / 100;
					this.rotation = random(0, 360);
					
					// 更新元素样式
					if (this.element) {
						if (options.flakeType === 'svg') {
							var svgSize = this.size * 8;
							this.element.style.width = svgSize + 'px';
							this.element.style.height = svgSize + 'px';
							this.element.style.opacity = this.opacity * options.flakeOpacity;
						} else if (options.flakeType === 'character') {
							this.element.style.fontSize = this.size * 10 + 'px';
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
		
			// Collection Piece ******************************
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
					// Canvas element isnt supported
					options.collection = false;
				}
			}
			// ************************************************
			
			// This will reduce the horizontal scroll bar from displaying, when the effect is applied to the whole page
			if($(element).get(0).tagName === $(document).get(0).tagName){
				widthOffset = 25;
			}
			
			// Bind the window resize event so we can get the innerHeight again
			$(window).bind("resize", function(){  
				elHeight = $(element).height();
				elWidth = $(element).width();
			}); 
			

			// initialize the flakes
			for(i = 0; i < options.flakeCount; i+=1){
				flakeId = flakes.length;
				flakes.push(new Flake(random(widthOffset,elWidth - widthOffset), random(0, elHeight), random((options.minSize * 100), (options.maxSize * 100)) / 100, random(options.minSpeed, options.maxSpeed), flakeId));
			}

			// This adds the style to make the snowflakes round via border radius property 
			if(options.round && options.flakeType === 'classic'){
				$('.snowfall-flakes').css({'-moz-border-radius' : options.maxSize, '-webkit-border-radius' : options.maxSize, 'border-radius' : options.maxSize});
			}
			
			// This adds shadows just below the snowflake so they pop a bit on lighter colored web pages
			if(options.shadow && options.flakeType === 'classic'){
				$('.snowfall-flakes').css({'-moz-box-shadow' : '1px 1px 1px #555', '-webkit-box-shadow' : '1px 1px 1px #555', 'box-shadow' : '1px 1px 1px #555'});
			}

			// On newer Macbooks Snowflakes will fall based on deviceorientation
			var doRatio = false;
			if (options.deviceorientation) {
				$(window).bind('deviceorientation', function(event) {
					doRatio = event.originalEvent.gamma * 0.1;
				});
			}

			// this controls flow of the updating snow
			function snow(){
				for( i = 0; i < flakes.length; i += 1){
					flakes[i].update();
				}
				
				snowTimeout = setTimeout(function(){snow()}, 30);
			}
			
			snow();
		
		// Public Methods
		
		// clears the snowflakes
		this.clear = function(){
						$(element).find('.snowfall-flakes').remove();
						flakes = [];
						clearTimeout(snowTimeout);
					};
	};
	
	// Initialize the options and the plugin
	$.fn.snowfall = function(options){
		if(typeof(options) == "object" || options == undefined){		
				 return this.each(function(i){
					(new $.snowfall(this, options)); 
				});	
		}else if (typeof(options) == "string") {
			return this.each(function(i){
				var snow = $(this).data('snowfall');
				if(snow){
					snow.clear();
				}
			});
		}
	};
})(jQuery);