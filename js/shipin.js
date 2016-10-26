var bcloud = {
    tool: {
        getUrlParams: function() {
            var b = {},
                a = window.location.search;
            if (-1 != a.indexOf("?"))
                for (var a = a.substr(1).split("&"), c = 0; c < a.length; c++) {
                    var d = a[c].substr(0, a[c].indexOf("=")),
                        e = a[c].substr(a[c].indexOf("=") + 1);
                    b[d] = e
                }
            return b
        },
        isFrame: function() {
            return self != top
        },
        isMobile: function() {
            var b = navigator.userAgent,
                a = b.match(/(iPad).*OS\s([\d_]+)/),
                c = !a && b.match(/(iPhone\sOS)\s([\d_]+)/),
                d = b.match(/(Android)\s+([\d.]+)/),
                b = /windows phone/.test(b);
            return c || d || b || a
        },
        getHeight: function() {
            return window.innerHeight ? window.innerHeight : document.body && document.body.clientHeight ? document.body.clientHeight : document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth ? document.documentElement.clientHeight : document.body.clientHeight
        }
    },
    player: {
        skipToUrl: function(b) {
            if (b.hasOwnProperty("skip") && b.hasOwnProperty("page_url")) {
                var a = b.page_url;
                "fenxiang" == b.skip && "" != a && (window.location.href = unescape(a))
            }
        },
        initPlayer: function() {
            var b = bcloud.tool.getUrlParams(),
                a = document.getElementById("player"),
                c = "100%",
                d = "100%";
            bcloud.player.skipToUrl(b);
            b.hasOwnProperty("width");
            b.hasOwnProperty("height");
             !bcloud.tool.isFrame() && bcloud.tool.isMobile() ? (bcloud.player.initMobilePlayer(b, a), a.style.width = "100%", a.style.height = bcloud.tool.getHeight() + "px") : ("100%" == d && (d = bcloud.tool.getHeight()), c += "", d += "", a.style.width = -1 != c.indexOf("%") ? c : c + "px", a.style.height = -1 != d.indexOf("%") ? d : d + "px");
            b.pageControls = 1;
            bcloud.tool.isFrame() || (b.wmode = "direct");
            (new CloudVodPlayer).init(b, "player")
        },
        initMobilePlayer: function(b, a) {
            var c = document.createElement("meta");
            c.name = "viewport";
            c.content = "width=device-width,initial-scale=1,user-scalable=no,minimum-scale=1.0,maximum-scale=1.0";
            document.getElementsByTagName("head")[0].appendChild(c);
            b.width = "100%";
            b.height = "100%";
            // document.body.style.backgroundColor = "#000000";
            window.onload = window.onpageshow = window.onresize = function() { a.style.height = bcloud.tool.getHeight() + "px" };
            var c = navigator.userAgent.toLowerCase(),
                d = null,
                e = 0;
            if (0 <= c.indexOf("iphone") || 0 <= c.indexOf("ipad")) a.addEventListener("touchend", function(b) {
                var a = (new Date).getTime();
                d = d || a + 1;
                var c = a - d;
                if (500 > c && 0 < c) return b.preventDefault(), !1;
                d = a
            }, !1), a.addEventListener("touchstart", function(a) {
                a = a.touches.item(0);
                e = { x: a.pageX, y: a.pageY }
            }, !1), a.addEventListener("touchmove", function(a) {
                var b = a.touches.item(0);
                5 < Math.abs(b.pageY - e.y) && a.preventDefault()
            }, !1)
        }
    }
};
bcloud.player.initPlayer();
