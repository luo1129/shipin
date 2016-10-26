
function isHasdown(element){
	element.on('click',function(){
		var _this = $(this);
		if(!_this.hasClass('hover')){
			_this.addClass('hover');
			_this.next().slideDown()
		}else{
			_this.removeClass('hover')
			_this.next().slideUp()
		}
	})
}
function yswitch(element, tag){
	element.on('click','li',function(){
		var _this = $(this).index();
		$(this).addClass('hover').siblings().removeClass('hover');
		tag.removeClass('hover').eq(_this).addClass('hover');
	})
}
function floating(element,tag,bgt){
	element.on('click',function(){
		tag.show()
		bgt.show()
	})
	tag.on('click','dd span',function(){
		tag.hide()
		bgt.hide()
	})
}

$(window).load(function(){
	var hgpList = $('.h-gpList')
	hgpList.on('click','i.cWhite',function(){
		var _this = $(this).parent().parent().next()
		if(!$(this).hasClass('hover')){
			$(this).addClass('hover');
			_this.slideDown()		
		}else{
			$(this).removeClass('hover')
			_this.slideUp()
		}
	})
})
function downMenug(menu, element, wbg, down, callback) {
	if (down) {
		var menu,
			isMove = false,
			fn = null;
		if (typeof(down) == "function") {
			callback = down;
		} else {
			menu = down;
		}
		menu.delegate('li', 'click', function(event) {
			var _this = $(this);
			hide();
			element.html(_this.html());
			callback && callback(_this);
		}).hover(clear, timer);

		element.click(function(event) {
			event.preventDefault();
			isMove = true;
			var pos = element.parent().offset();
			var _this = $(this);
			if(_this.hasClass('on')){
				hide()
			}else{
				menu.css({
					display: 'block',
					left: pos.left,
					top: pos.top + element.innerHeight()
					// width: element.innerWidth()-2
				});
				$(this).addClass("on")
				wbg.show()
			}
			document.body.addEventListener('touchmove', function (event) {
				if(_this.hasClass('on')){
				    event.preventDefault();					
				}
			}, false);
		}).hover(clear, timer);
	}
	wbg.click(hide)
	function clear() {
		clearTimeout(fn);
		fn = null;
	}

	function timer() {
		if (isMove) {
			fn = setTimeout(hide, 500)
		}
	}
	
	function hide() {
		menu.hide();
		isMove = false;
		element.removeClass("on");
		wbg.hide()
	}
}






