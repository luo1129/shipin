! function(a, b) { a["__H"] = a[b] = { F: [], E: [], open: function(a, b) { this[a] ? this.E.push(a + " exists") : this[a] = b }, push: function(a) { "function" == typeof a ? this.F.unshift(a) : this.E.push(a) }, load: function() {
            for (var a = this.F.length; a--;) this.F[a]() }, get: function() {
            var c, d, e, f, a = arguments.length,
                b = "__ver=" + (this.ver ? this.ver : ~(-new Date / 6e5));
            for (c = 0; a > c; c++) d = arguments[c], e = /.css$/.test(d), f = (e ? "%3Clink href=" : "%3Cscript src=") + (d + (/\?/.test(d) ? "&" : "?") + b) + (e ? " rel=stylesheet /%3E" : "%3E%3C/script%3E"), document.write(unescape(f));
            return this } } }(window, "_K");

! function() {
	_K.open('ajaxDataType', 'json')
}();
! function() {
    var validType = {
        '*': /[\w\W]+/,
        '*6-16': /^[\w\W]{6,16}$/,
        'n4-16': /^\d{4,16}$/,
        'n1-16': /^\d{1,16}$/,
        'password': /^(?![^a-zA-Z]+$)(?!\D+$).{6,16}$/,
        'bankcard': /^\d{16,19}$/,
        'number': /^\d+(\.\d+)?$/,
        'mobile': /^13[0-9]{9}$|14[0-9]{9}|15[0-9]{9}$|17[0-9]{9}$|18[0-9]{9}$/,
        'email': /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
        'username': /[\u4e00-\u9fa5]{2,}/,
        'bankname': /[\u4e00-\u9fa5]{4,}/,
        'idcard': function(cardNumber) {
            var Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1] // 加权因子;
            var ValideCode = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2] // 身份证验证位值，10代表X;

            if (cardNumber.length == 15) {
                return isValidityBrithBy15IdCard(cardNumber)
            } else if (cardNumber.length == 18) {
                var a_idCard = cardNumber.split("") // 得到身份证数组   
                if (isValidityBrithBy18IdCard(cardNumber) && isTrueValidateCodeBy18IdCard(a_idCard)) {
                    return true
                }
                return false
            }
            return false

            function isTrueValidateCodeBy18IdCard(a_idCard) {
                var sum = 0; // 声明加权求和变量   
                if (a_idCard[17].toLowerCase() == 'x') {
                    a_idCard[17] = 10 // 将最后位为x的验证码替换为10方便后续操作   
                }
                for (var i = 0; i < 17; i++) {
                    sum += Wi[i] * a_idCard[i] // 加权求和   
                }
                valCodePosition = sum % 11; // 得到验证码所位置   
                if (a_idCard[17] == ValideCode[valCodePosition]) {
                    return true
                }
                return false
            }

            function isValidityBrithBy18IdCard(idCard18) {
                var year = idCard18.substring(6, 10)
                var month = idCard18.substring(10, 12)
                var day = idCard18.substring(12, 14)
                var temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day))
                    // 这里用getFullYear()获取年份，避免千年虫问题   
                if (temp_date.getFullYear() != parseFloat(year) || temp_date.getMonth() != parseFloat(month) - 1 || temp_date.getDate() != parseFloat(day)) {
                    return false
                }
                return true
            }

            function isValidityBrithBy15IdCard(idCard15) {
                var year = idCard15.substring(6, 8)
                var month = idCard15.substring(8, 10)
                var day = idCard15.substring(10, 12)
                var temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day))
                    // 对于老身份证中的你年龄则不需考虑千年虫问题而使用getYear()方法   
                if (temp_date.getYear() != parseFloat(year) || temp_date.getMonth() != parseFloat(month) - 1 || temp_date.getDate() != parseFloat(day)) {
                    return false
                }
                return true
            }

        }
    }

    /**错误警示**/
    function error(_this, msg) {
        _this.attr('type') == 'hidden' ? _K.MSG.error(msg) : _this.next().html(msg).removeClass('none')
    }

    function pase(_this) {
        _this.next().addClass('none')
    }

    function check(_this) {

        /**包含_type的项为验证项**/
        var _type = _this.data('type')
        if (!_type) return true

        var _msg
        var _val = $.trim(_this.val())

        if (!_val) {
            _msg = 'null'
        } else {
            var _re = _this.data('re')
                /**包含_re的项为密码二次验证项**/
            if (typeof(validType[_type]) === 'function') {
                validType[_type](_val) ? ((_re && $(_re).val() != _val) && (_msg = 'err')) : (_msg = 'err')
            } else {
                validType[_type].test(_val) ? ((_re && $(_re).val() != _val) && (_msg = 'err')) : (_msg = 'err')
            }
        }

        if (_msg) {
            var text = _this.data(_msg)
            text && error(_this, text)
            return false
        } else {
            pase(_this)
        }
        return true
    }

    __H.open('check', check)
}();

! function() {
    function buttonTimer(el, n) {
        var fn = null
        var el = $(el)
        var n = n || 61

        el.data('bak', el.html())

        function timer() {
            n--;
            if (n > 0) {
                el.html(n + 'S后重新获取')
                fn = setTimeout(timer, 1000)
            } else {
                clearTimeout(fn)
                el.removeClass('disabled').html(el.data('bak'))
            }
        }

        timer()
    }

    function getCode(el, phone) {
        if (!el.hasClass('disabled')) {
            var _data = {}
            var _isok = true

            if (phone) {
                _K.check(phone) ? (_data[phone[0].name] = phone.val()) : (_isok = false)
            }
            _isok && el.addClass('disabled') && $.ajax({
                url: el.data('url'),
                dataType: _K.ajaxDataType,
                type: el.attr('method') || 'POST',
                data: _data,
                success: function(data) {
                    if (data.code == 200) {
                        buttonTimer(el)
                    } else {
                        el.removeClass('disabled')
                        _K.MSG.error(data.msg)
                    }
                }
            })
        }
    }
    __H.open('getCode', getCode)
}();


! function() {
    function formValid(json) {
        var form = json.form
        var button = json.button || form.find('button:last')
        var formLoad = false

        form.on('submit', function(event) {
            event.preventDefault()

            /**表单加载中return**/
            if (formLoad) return
            var _data = {}
            var _isok = true
            var _value = button.html()

            /**提交前数据校验：比如是否接受许可协议**/

            if (typeof(json.before) === 'function' && !json.before(_data)) {
                return
            }

            /**获取所有input值，name对应提交的key**/
            form.find('input:text,input:password,input:hidden,select').each(function(index, el) {
                var _this = $(el),
                    one = false;
                if (_this.data('hasError') || (_this.data('type') && !_K.check(_this))) {
                    _isok = false;
                    if (!one) {
                        _this.focus();
                        var size = _this.offset();
                        window.scrollTo(0, size.top);
                        one = true;
                    }
                    return false
                }
                el.name && (_data[el.name] = el.value);
                one = false;
            })

            _isok && $.ajax({
                url: form.attr('action'),
                dataType: _K.ajaxDataType,
                type: form.attr('method'),
                timeout: 15000,
                data: _data,
                beforeSend: function() {
                    formLoad = true
                    button.html('请稍等..')
                },
                success: function(data) {
                    if (data.code == 200) {
                        (typeof(json.callback) === 'function') && json.callback(data, _data)
                    } else {
                        formLoad = false
                        button.html(_value)
                        _K.MSG.error(data.msg);
                        (typeof(json.errcallback) === 'function') && json.errcallback(data, _data)
                    }
                },
                complete: function(request, stauts) {
                    if (stauts == 'timeout') {
                        formLoad = false
                        button.html(_value)
                        _K.MSG.error('网络超时，请重新操作')
                    }
                },
                error: function(request, stauts) {
                    if (stauts == 'error') {
                        formLoad = false
                        button.html(_value)
                        _K.MSG.error('请求错误，请检查网络')
                    }
                }
            })
        })

        .on('keydown', 'input:text,input:password,input:hidden', function(event) {
            $(this).next().addClass('none')
        })

        .on('change', 'select', function() {
            $(this).next().addClass('none')
        })

        .on('blur', 'input:text,input:password,input:hidden', function() {
            var _this = $(this)
            var checkUrl = _this.data('checkurl')
            if (_K.check(_this) && checkUrl) {
                var _data = {}
                _data[this.name] = this.value
                $.ajax({
                    url: checkUrl,
                    dataType: _K.ajaxDataType,
                    type: _this.attr('method'),
                    data: _data,
                    success: function(data) {
                        if (data.code == 200) {
                            _this.next().addClass('none')
                            _this.data('hasError', false)
                        } else {
                            _this.next().html(data.msg).removeClass('none')
                            _this.data('hasError', true)
                        }
                    }
                })
            }
        })
    }

    __H.open('formValid', formValid)
}();
! function() {
    var style = '.Msg-Error,.Msg-Success,.Msg-Load{position:fixed;top:100px;width:400px;text-align:center;left:50%;margin-left:-200px;z-index:1002;background:#EC6247;line-height:50px;-webkit-transition:top 0.5s ease;-moz-transition:top 0.5s ease;-o-transition:top 0.5s ease;transition:top 0.5s ease;opacity:0.9;color:#fff;font-size:16px}.Msg-Success{background:#5CB85C}.Msg-Load{background:#FFB506}'

    var element = $('<div>')
    var is_build = false
    var fn = null
    var close_callback = null

    element.on('click', close)

    function loadStyle(d, a) {
        var b = d.createElement("style")
        b.type = "text/css"
        b.styleSheet ? b.styleSheet.cssText = a : b.appendChild(d.createTextNode(a))
        d.getElementsByTagName("head")[0].appendChild(b)
    }

    function close() {
        element.fadeOut(function() {
            fn = null
            close_callback && close_callback()
        });
    }

    function init() {
        is_build = true
        loadStyle(document, style)
        $('body').append(element)
    }

    function MSG(msg, time, callback) {
        if (callback) {
            typeof(callback) != 'function' ? message(msg, callback, time): message(msg, time, callback)
        } else {
            typeof(time) != 'function' ? message(msg, time): message(msg, null, time)
        }
    }

    function message(msg, time, callback) {
        close_callback = callback
        var n = time || 3000
        clearTimeout(fn)
        !is_build && init()
        element.fadeIn().html(msg);
        fn = setTimeout(function() {
            element.fadeOut(function() {
                callback && callback()
            })
        }, n)
    }

    function error(msg, time, callback) {
        element[0].className = 'Msg-Error'
        MSG(msg, time, callback)
    }

    function success(msg, time, callback) {
        element[0].className = 'Msg-Success'
        MSG(msg, time, callback)
    }

    function load(msg, time, callback) {
        element[0].className = 'Msg-Load'
        MSG(msg, time, callback)
    }

    __H.open('MSG', {
        'error': error,
        'success': success,
        'load': load,
        'close': close
    });
}();
