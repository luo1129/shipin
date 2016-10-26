    function wuri(json) {
        var c = document.getElementById("myCanvas");
        var ctx = c.getContext("2d");
        var mycan = $('#myCanvas');
        var canvh = mycan.parent().height()
        var canvw = mycan.parent().width()*0.98;
        c.width = canvw*2
        c.height = canvh*2
        mycan.css({
            width:canvw,
            height:canvh
        })
        var frameColor = "#000";
        var trendLineColor = "#08a5ef";
        var trendGridentStartColor = "#e2f6ff";
        var trendGridentStopColor = "#e2f6ff";
        var volumeLineColor = "#eb343c";
        var averageLineColor = "#f9ba52";
        ctx.font = "100 20px Calibri";
        var strWidth = ctx.measureText("3333.33").width;

        var startX = 1 + strWidth;
        var width = c.width - startX - 1 - ctx.measureText("10.00%").width;

        var trendStartY = 1;
        var trendHeight = c.height / 3 * 2;

        var volumeStartY = trendStartY + trendHeight + 30;
        var volumeHeight = c.height - volumeStartY - 1;

        var offsetX = width / 245;

        var lastPrice = 0.0;
        var maxPrice = 0.0;
        var minPrice = 0.0;
        var maxVolume = 0;

        //console.log("%ld", json.body.times[0]);

        var datas = new Array();
        var volumes = new Array();
        var times = new Array();
        var amount = 0.0;
        for (var i = 0; i < json.body.minData.length; i++) {
            var num = json.body.minData[i][0];
            var volume = json.body.minData[i][1];
            var average = json.body.minData[i][0];
            if (i == 0) {
                maxPrice = num;
                minPrice = num;
                maxVolume = volume;
            }
            datas[i] = num;
            if (num > maxPrice) {
                maxPrice = num;
            } else if (num < minPrice) {
                minPrice = num;
            }
            if (i == 0 || i % 49 == 0) {
                volumes[i] = volume;
            } else {
                volumes[i] = volume - json.body.minData[i - 1][1];
            }
            if (volumes[i] > maxVolume) {
                maxVolume = volumes[i];
            }
        }

        for (var i = 0; i < json.body.times.length; i++) {
            times[i] = json.body.times[i];
        }

        lastPrice = (maxPrice + minPrice) / 2;
        var delta = Math.abs(maxPrice - lastPrice) > Math.abs(minPrice - lastPrice) ? Math.abs(maxPrice - lastPrice) : Math.abs(minPrice - lastPrice);
        delta += delta * 0.1;
        var axisX = new Array();
        axisX[0] = (lastPrice + delta).toFixed(2);
        axisX[1] = (lastPrice + delta / 2).toFixed(2);
        axisX[2] = lastPrice.toFixed(2);
        axisX[3] = (lastPrice - delta / 2).toFixed(2);
        axisX[4] = (lastPrice - delta).toFixed(2);

        var axisVolume = axisVolume();


        drawFrame();
        drawTrend();
        if(!lastPrice==''){
            drawVolume();
        }
        drawAxis();


        function drawFrame() {
            ctx.strokeStyle = "#ddd";
            ctx.lineWidth = 0.5;
            ctx.strokeRect(startX, trendStartY, width, trendHeight);
            ctx.strokeRect(startX, volumeStartY, width, volumeHeight);

            for (var i = 1; i < 4; i++) {
                ctx.moveTo(startX, trendStartY + trendHeight / 4 * i);
                ctx.lineTo(startX + width, trendStartY + trendHeight / 4 * i);
            }

            for (var i = 1; i < 5; i++) {
                ctx.moveTo(startX + width / 5 * i, trendStartY);
                ctx.lineTo(startX + width / 5 * i, trendHeight);
            }
            ctx.stroke();
            ctx.lineWidth = 3;
        }

        function GetRandomNum(Min, Max) {
            var Range = Max - Min;
            var Rand = Math.random();
            return (Min + Math.round(Rand * Range));
        }
        function drawTrend() {
            var x = startX;
            var y = trendStartY + trendHeight / 2.0 - (datas[0] - lastPrice) / delta * (trendHeight / 2.0);

            ctx.beginPath();
            ctx.moveTo(x, y);
            for (var i = 1; i < datas.length; i++) {
                x += offsetX;
                y = trendStartY + trendHeight / 2.0 - (datas[i] - lastPrice) / delta * (trendHeight / 2.0);
                ctx.lineTo(x, y);

            }
            ctx.strokeStyle = trendLineColor;
            ctx.stroke();

            ctx.lineWidth = .5;

            ctx.lineTo(x, trendStartY + trendHeight);
            ctx.lineTo(startX, trendStartY + trendHeight);

            var grd = ctx.createLinearGradient(startX, trendStartY, startX, trendStartY + trendHeight);
            grd.addColorStop(0, trendGridentStartColor);
            grd.addColorStop(1, trendGridentStopColor);
            ctx.strokeStyle = "#0000ff";
            ctx.fillStyle = grd;
            ctx.fill();

        }

        function drawAxis() {
            ctx.fillStyle = frameColor;
            ctx.font = "100 20px Arial";
            ctx.textAlign = "right";
            ctx.textBaseline = "top";
            ctx.fillText(axisX[0], startX, trendStartY);
            ctx.textBaseline = "bottom";
            ctx.fillText(axisX[4], startX, trendStartY + trendHeight);
            ctx.textBaseline = "middle";
            for (var i = 1; i < 4; i++) {
                ctx.fillText(axisX[i], startX, trendStartY + trendHeight / 4 * i);
            }

            ctx.textBaseline = "top";
            ctx.fillText(axisVolume[0], startX, volumeStartY);
            ctx.textBaseline = "bottom";
            ctx.fillText(axisVolume[1], startX, volumeStartY + volumeHeight);


            ctx.textAlign = "left";
            ctx.textBaseline = "top";
            ctx.fillText((((axisX[0] - lastPrice) / lastPrice) * 100).toFixed(2).toString() + "%", startX + width, trendStartY);
            ctx.textBaseline = "bottom";
            ctx.fillText((((axisX[4] - lastPrice) / lastPrice) * 100).toFixed(2).toString() + "%", startX + width, trendStartY + trendHeight);
            ctx.textBaseline = "middle";
            for (var i = 1; i < 4; i++) {
                ctx.fillText((((axisX[i] - lastPrice) / lastPrice) * 100).toFixed(2).toString() + "%", startX + width, trendStartY + trendHeight / 4 * i);
            }

            ctx.textBaseline = "top";
            ctx.textAlign = "center"
            var offset = width / 5;
            for (var i = 0; i < times.length; i++) {
                var time = new Date();
                time.setTime(times[i]);
                var day = time.getDate() + '日';
                var month = (time.getMonth() + 1) + "月";
                ctx.fillText(month + day, startX + offset * i + offset / 2, trendStartY + trendHeight + 2);
            }

        }

        function drawVolume() {
            var x = startX;
            var Y = volumeStartY + volumeHeight - volumes[0] / maxVolume * volumeHeight;

            ctx.beginPath();
            ctx.fillStyle = null;
            ctx.strokeStyle = volumeLineColor;
            for (var i = 1; i < volumes.length; i++) {
                x = startX + offsetX * i;
                y = volumeStartY + volumeHeight - volumes[i] / maxVolume * volumeHeight;
                ctx.moveTo(x, y);
                ctx.lineTo(x, volumeStartY + volumeHeight);
            }
            ctx.stroke();
        }

        function axisVolume() {
            var temp = maxVolume / 100;
            var array = new Array();
            if (maxVolume > 100000000) {
                temp = temp / 100000000;
                return new Array(temp.toFixed(2).toString(), "亿手");
            } else if (maxVolume > 10000) {
                temp = temp / 10000;
                return new Array(temp.toFixed(2).toString(), "万手");
            } else {
                return new Array(temp.toFixed(2).toString(), "手");
            }
        }

        Date.prototype.Format = function(fmt) { //author: meizz
            var o = {
                "M+": this.getMonth() + 1, //月份
                "d+": this.getDate(), //日
                "h+": this.getHours(), //小时
                "m+": this.getMinutes(), //分
                "s+": this.getSeconds(), //秒
                "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                "S": this.getMilliseconds() //毫秒
            };
            if (/(y+)/.test(fmt))
                fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt))
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        }
    }
