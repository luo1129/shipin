function dingyue(element) {
	element.on('click',function(){
		var _this = $(this);
		_this.addClass('hover').siblings().removeClass('hover')
	})
};
