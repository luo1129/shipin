function isHasthigh(element, tag) {
    tag.load('json/untitled0.html')
    element.on('click', function() {
        var _this = $(this);
        _this.addClass('hover').siblings().removeClass('hover');
        tag.load('json/untitled' + $(this).index() + '.html')
    })
}

function isNews(element, tag) {
    element.on('click', function() {
        var _this = $(this);
        _this.addClass('hover').siblings().removeClass('hover');
        tag.eq(_this.index()).show().siblings().hide();
    })
}

function follow(element) {
    element.on('click', '.right', function() {
        var _this = $(this);
        if (_this.hasClass('add')) {
            _this.find('dd').text('已添加')
            _this.addClass('remov')
            _this.removeClass('add')
        } else {
            _this.addClass('add')
            _this.removeClass('remov')
            _this.find('dd').text('添加自选股')
        }
    })
}

function homeScroll(mtip,mtp) {
    var mtip,
        htop = mtip.offset().top,
        win = $(window),
        doc = $(document),
        h = mtip.height();
        mtp = mtp || 'mtp50';
    doc.scroll(function(event) {
        var height = win.scrollTop();
        if (height > htop - h) {
            mtip.addClass('pfixed')
            mtip.parent().addClass(mtp)
        } else {
            mtip.removeClass('pfixed')
            mtip.parent().removeClass(mtp)
        }
    })
}

function newTitle(element, tag) {
    element.on('click', function() {
        var _this = $(this);
        if (!_this.hasClass('hover')) {
            _this.addClass('hover')
            tag.addClass('hover')
        } else {
            _this.removeClass('hover')
            tag.removeClass('hover')
        }
    })
}

function setValue(element) {
    element.addClass('cGaryt');
    element.focusin(function() {
            (!element.val() || element.val() == element.attr('initValue')) && element.val('').removeClass("cGaryt")
        })
        .focusout(function() {
            !element.val() && element.val(element.attr('initValue')).addClass("cGaryt")
        });
    (element.val() != element.attr('initValue')) && element.removeClass("cGaryt");
}

function searchValue(element) {
    element.addClass('cGaryt');
    element.focusin(function() {
            element.next('span').show();
            (!element.val() || element.val() == element.attr('initValue')) && element.val('').removeClass("cGaryt")
        })
        .focusout(function() {
            if (!element.val()) {
                element.val(element.attr('initValue')).addClass("cGaryt")
                element.next('span').hide();
            }
        })
    element.next('span').on('click', function() {
        element.next('span').hide();
        element.val(element.attr('initValue'))
        element.addClass('cGaryt')
    })
}

function checkboxAll(all, sub, del) {
    all.on('click', function(event) {
        sub.find('input:checkbox').prop('checked', $(this).prop('checked'))
    })
    sub.on('click', 'input:checkbox', function(event) {
        var n = 0;
        sub.find('input:checkbox').each(function(index, el) {
            if ($(this).prop('checked')) {
                n++
            }
        })
        all.prop('checked', n == sub.find('input:checkbox').length)
    })
    del.on('click', function(event) {
        sub.find('input:checkbox').each(function(index, el) {
            if ($(this).prop('checked')) {
                $(this).parents('li').remove();
            }
        });
    })
    sub.on('click', 'i', function(event) {
        var _this = $(this);
        var oCopyLi = _this.parents('li').clone();
        _this.parents('ul').prepend(oCopyLi);
        _this.parents('li').remove();
    })

}
