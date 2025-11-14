/*  Snowfall jquery plugin

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

	Version 1.51 Dec 2nd 2012
	// fixed bug where snow collection didn't happen if a valid doctype was declared.
	
	Version 1.5 Oct 5th 2011
	Added collecting snow! Uses the canvas element to collect snow. In order to initialize snow collection use the following
	
	$(document).snowfall({collection : 'element'});

    element = any valid jquery selector.

	The plugin then creates a canvas above every element that matches the selector, and collects the snow. If there are a varrying amount of elements the 
	flakes get assigned a random one on start they will collide.

	Version 1.4 Dec 8th 2010
	Fixed issues (I hope) with scroll bars flickering due to snow going over the edge of the screen. 
	Added round snowflakes via css, will not work for any version of IE. - Thanks to Luke Barker of http://www.infinite-eye.com/
	Added shadows as an option via css again will not work with IE. The idea behind shadows, is to show flakes on lighter colored web sites - Thanks Yutt
 
	Version 1.3.1 Nov 25th 2010
	Updated script that caused flakes not to show at all if plugin was initialized with no options, also added the fixes that Han Bongers suggested 
	
	Developed by Jason Brown for any bugs or questions email me at loktar69@hotmail
	info on the plugin is located on Somethinghitme.com
	
	values for snow options are
	
	flakeCount,
	flakeColor,
	flakeIndex,
	minSize,
	maxSize,
	minSpeed,
	maxSpeed,
	round, 		true or false, makes the snowflakes rounded if the browser supports it.
	shadow		true or false, gives the snowflakes a shadow if the browser supports it.
	
	Example Usage :
	$(document).snowfall({flakeCount : 100, maxSpeed : 10});
	
	-or-
	
	$('#element').snowfall({flakeCount : 800, maxSpeed : 5, maxSize : 5});
	
	-or with defaults-
	
	$(document).snowfall();
	
	- To clear -
	$('#element').snowfall('clear');
*/

(function($){
    $.snowfall = function(element, options){
        var defaults = {
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
                deviceorientation : false
            },
            options = $.extend(defaults, options),
            random = function random(min, max){
                return Math.round(min + Math.random()*(max-min)); 
            };
            
            $(element).data("snowfall", this);          
            
            // 雪花字符集合
            var snowShapes = ["❄","❅","❆"];
            
            // Snow flake object
            function Flake(_x, _y, _size, _speed, _id)
            {
                this.id = _id; 
                this.x  = _x;
                this.y  = _y;
                this.size = _size;
                this.speed = _speed;
                this.step = 0;
                this.stepSize = random(1,10) / 100;
    
                if(options.collection){
                    this.target = canvasCollection[random(0,canvasCollection.length-1)];
                }
                
                // 使用 Unicode 雪花符号替代圆点
                var flakeMarkup = $(document.createElement("div"))
                    .attr({'class': 'snowfall-flakes', 'id' : 'flake-' + this.id})
                    .text(snowShapes[random(0, snowShapes.length-1)]) // 随机挑选雪花符号
                    .css({
                        'font-size': this.size * 20 + "px", // 根据 size 调整大小
                        'color': options.flakeColor,
                        'position' : 'absolute',
                        'top' : this.y,
                        'left' : this.x,
                        'zIndex' : options.flakeIndex
                    });
                
                if($(element).get(0).tagName === $(document).get(0).tagName){
                    $('body').append(flakeMarkup);
                    element = $('body');
                }else{
                    $(element).append(flakeMarkup);
                }
                
                this.element = document.getElementById('flake-' + this.id);
                
                // Update function
                this.update = function(){
                    this.y += this.speed;
                    
                    if(this.y > (elHeight) - (this.size  + 6)){
                        this.reset();
                    }
                    
                    this.element.style.top = this.y + 'px';
                    this.element.style.left = this.x + 'px';
                    
                    this.step += this.stepSize;

                    if (doRatio === false) {
                        this.x += Math.cos(this.step);
                    } else {
                        this.x += (doRatio + Math.cos(this.step));
                    }

                    if(this.x > (elWidth) - widthOffset || this.x < widthOffset){
                        this.reset();
                    }
                }
                
                // Reset
                this.reset = function(){
                    this.y = 0;
                    this.x = random(widthOffset, elWidth - widthOffset);
                    this.stepSize = random(1,10) / 100;
                    this.size = random((options.minSize * 100), (options.maxSize * 100)) / 100;
                    this.speed = random(options.minSpeed, options.maxSpeed);
                    
                    // 重置时随机一个新的雪花符号
                    this.element.textContent = snowShapes[random(0, snowShapes.length-1)];
                    this.element.style.fontSize = this.size * 20 + "px";
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
                    random(widthOffset,elWidth - widthOffset),
                    random(0, elHeight),
                    random((options.minSize * 100), (options.maxSize * 100)) / 100,
                    random(options.minSpeed, options.maxSpeed),
                    flakeId
                ));
            }

            // 主循环
            function snow(){
                for( i = 0; i < flakes.length; i += 1){
                    flakes[i].update();
                }
                snowTimeout = setTimeout(function(){snow()}, 30);
            }
            
            snow();
        
        // Public Methods
        this.clear = function(){
            $(element).children('.snowfall-flakes').remove();
            flakes = [];
            clearTimeout(snowTimeout);
        };
    };
    
    // 插件接口
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

