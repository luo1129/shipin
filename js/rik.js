function tiangetDate(json) {
    var c = document.getElementById("myCanvas");
    c.addEventListener('touchstart', touch, false);
    c.addEventListener('touchmove', touch, false);
    c.addEventListener('touchend', touch, false);
    var ctx = c.getContext("2d");

    var mycan = $('#myCanvas');
    var canvh = mycan.parent().height()
    var canvw = mycan.parent().width();
    c.width = canvw * 2
    c.height = canvh * 2
    mycan.css({
        width: canvw,
        height: canvh
    })

    var drawNum = 40;
    var beginFlag = 20;

    var frameColor = "#555";
    var trendLineColor = "#0000ff";
    var trendGridentStartColor = "rgba(255, 0, 0, 255)";
    var trendGridentStopColor = "rgba(255, 0, 0, 0)";
    var volumeLineColor = "#1D7BD6";
    var averageLineColor = "#55ff55";
    var upColor = "#AD0000";
    var downColor = "#009A00";
    var evenColor = "#323232";

    var PMA5Color = "#FF60CD";
    var PMA10Color = "#FFF100";
    var PMA20Color = "#33D0FF";
    ctx.font = "100 20px Calibri";
    var strWidth = ctx.measureText("3333.33").width;

    var startX = 1 + strWidth;
    var width = c.width - startX - ctx.measureText("10.00%").width / 2;

    var trendStartY = 30;
    var trendHeight = c.height / 3 * 2;

    var volumeStartY = trendStartY + trendHeight + 26;
    var volumeHeight = c.height - volumeStartY - 1;
    var kWidth = width / 40;

    var lastPrice = json.body.last;
    var maxPrice = 0.0;
    var minPrice = 0.0;
    var maxVolume = 0;

    var ma5 = new Array();
    var ma10 = new Array();
    var ma20 = new Array();

    var ma5width = c.width / 4;
    var ma10width = ma5width * 2;
    var ma20width = ma5width * 3;
    var m5top = trendStartY / 2;
    var m5width = trendStartY / 5;
    var datasNum = json.body.kData.length;
    if (datasNum < 60) {
        beginFlag = datasNum - drawNum;
    }
    var MAlength = drawNum + beginFlag

    var temp = 0.0;
    var temp5 = 0.0;
    var temp10 = 0.0;
    var temp20 = 0.0;

    for (var i = 0; i < datasNum; i++) {
        var high = json.body.kData[i][0];
        var low = json.body.kData[i][2];
        var volume = json.body.kData[i][5];
        var close = json.body.kData[i][3];
        if (i == beginFlag) {
            maxPrice = high;
            minPrice = low;
            maxVolume = volume;
        }

        if (i > beginFlag) {
            if (high > maxPrice) {
                maxPrice = high;
            }
            if (low < minPrice) {
                minPrice = low;
            }
            if (volume > maxVolume) {
                maxVolume = volume;
            }
        }
        temp5 += close;
        temp10 += close;
        temp20 += close;


        if (i >= 4) {
            if (i > 4) {
                temp5 = temp5 - json.body.kData[i - 5][3];
            }
            ma5[i] = temp5 / 5;
            if (i >= 9) {
                if (i > 9) {
                    temp10 = temp10 - json.body.kData[i - 10][3];
                }
                ma10[i] = temp10 / 10;

                if (i >= 19) {
                    if (i > 19) {
                        temp20 = temp20 - json.body.kData[i - 20][3];
                    }
                    ma20[i] = temp20 / 20;

                }
            }
        }
    }

    var delta = Math.abs(maxPrice - minPrice);
    var axisX = new Array();
    axisX[0] = maxPrice.toFixed(2);
    axisX[1] = (minPrice + delta / 2).toFixed(2);
    axisX[2] = minPrice.toFixed(2);

    var axisVolume = axisVolume();

    caculateMa()
    drawFrame();
    drawKline();
    drawAxis();

    function caculateMa() {
        ctx.beginPath();
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillStyle = PMA5Color;
        ctx.arc(ma5width, m5top, m5width, 0, 2 * Math.PI, true);
        ctx.fillText('MA5', ma5width - strWidth + 10, m5top + 1)
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = PMA10Color;
        ctx.arc(ma10width, m5top, m5width, 0, 2 * Math.PI, true);
        ctx.fillText('MA10', ma10width - strWidth, m5top + 1)
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = PMA20Color;
        ctx.arc(ma20width, m5top, m5width, 0, 2 * Math.PI, true);
        ctx.fillText('MA20', ma20width - strWidth, m5top + 1)
        ctx.fill();
        ctx.beginPath();

    }

    function caculateMatext(malength) {
        ctx.fillStyle = frameColor;
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText(ma5[malength].toFixed(2), ma5width + 20, m5top + 1)
        ctx.fillText(ma10[malength].toFixed(2), ma10width + 20, m5top + 1)
        ctx.fillText(ma20[malength].toFixed(2), ma20width + 20, m5top + 1)
    }
    caculateMatext(MAlength - 1)

    function drawKline() {
        var scale = maxPrice - minPrice;
        for (var i = beginFlag; i < MAlength; i++) {
            var high = json.body.kData[i][0];
            var open = json.body.kData[i][1];
            var low = json.body.kData[i][2];
            var close = json.body.kData[i][3];
            var lclose = json.body.kData[i][6];
            var x = startX + (i - beginFlag) * kWidth;
            var y1 = trendStartY + (1 - (open - minPrice) / scale) * trendHeight;
            var height = ((open - close)) / scale * trendHeight;

            var lineStartY = trendStartY + (1 - (high - minPrice) / scale) * trendHeight;
            var lineEndY = trendStartY + (1 - (low - minPrice) / scale) * trendHeight;

            if (open < close) {
                ctx.strokeStyle = upColor;
                ctx.fillStyle = "#ffffff";
            } else if (open == close) {
                ctx.strokeStyle = evenColor;
            } else {
                ctx.strokeStyle = downColor;
                ctx.fillStyle = downColor;
            }
            // 绘制蜡烛
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x + kWidth / 2, lineStartY);
            ctx.lineTo(x + kWidth / 2, lineEndY);
            ctx.stroke();

            ctx.fillRect(x + 1, y1, kWidth - 2, height);
            ctx.strokeRect(x + 1, y1, kWidth - 2, height);
            // 绘制量线
            if (close > lclose) {
                ctx.fillStyle = upColor;
            } else if (close == lclose) {
                ctx.fillStyle = upColor;
            } else {
                ctx.fillStyle = downColor;
            }
            var volume = json.body.kData[i][5];
            var vHeight = volume / maxVolume * volumeHeight;
            ctx.fillRect(x + 1, volumeStartY + volumeHeight - vHeight, kWidth - 2, volumeStartY + volumeHeight);
            ctx.fillStyle = frameColor;
            ctx.textAlign = "right";
            // 绘制5日，10日，20日均线
            ctx.lineWidth = 2;
            if (i < drawNum + beginFlag - 1) {
                if (ma5[i]) {
                    lineStartY = trendStartY + (1 - (ma5[i] - minPrice) / scale) * trendHeight;
                    lineEndY = trendStartY + (1 - (ma5[i + 1] - minPrice) / scale) * trendHeight;
                    ctx.strokeStyle = PMA5Color
                    ctx.beginPath();
                    ctx.moveTo(x + kWidth / 2, lineStartY);
                    ctx.lineTo(x + kWidth / 2 + kWidth, lineEndY);
                    ctx.stroke();
                }
                if (ma10[i]) {
                    lineStartY = trendStartY + (1 - (ma10[i] - minPrice) / scale) * trendHeight;
                    lineEndY = trendStartY + (1 - (ma10[i + 1] - minPrice) / scale) * trendHeight;
                    ctx.strokeStyle = PMA10Color
                    ctx.beginPath();
                    ctx.moveTo(x + kWidth / 2, lineStartY);
                    ctx.lineTo(x + kWidth / 2 + kWidth, lineEndY);
                    ctx.stroke();
                }
                if (ma20[i]) {
                    lineStartY = trendStartY + (1 - (ma20[i] - minPrice) / scale) * trendHeight;
                    lineEndY = trendStartY + (1 - (ma20[i + 1] - minPrice) / scale) * trendHeight;
                    ctx.strokeStyle = PMA20Color
                    ctx.beginPath();
                    ctx.moveTo(x + kWidth / 2, lineStartY);
                    ctx.lineTo(x + kWidth / 2 + kWidth, lineEndY);
                    ctx.stroke();
                }
            }
        }
    }

    function drawFrame() {
        ctx.strokeStyle = frameColor;
        ctx.lineWidth = 0.5;
        ctx.strokeRect(startX, trendStartY, width, trendHeight);
        ctx.strokeRect(startX, volumeStartY, width, volumeHeight);

        for (var i = 1; i < 4; i++) {
            ctx.moveTo(startX, trendStartY + trendHeight / 4 * i);
            ctx.lineTo(startX + width, trendStartY + trendHeight / 4 * i);
        }

        // for(var i = 1; i < 4 ; i++){
        //   ctx.moveTo(startX + width/4*i,trendStartY );
        //   ctx.lineTo(startX + width/4*i,trendHeight);
        // }
        ctx.stroke();
    }

    function GetRandomNum(Min, Max) {
        var Range = Max - Min;
        var Rand = Math.random();
        return (Min + Math.round(Rand * Range));
    }

    function drawAxis() {
        ctx.fillStyle = frameColor;
        ctx.textAlign = "right";
        ctx.textBaseline = "top";
        ctx.fillText(axisX[0], startX, trendStartY);
        ctx.textBaseline = "bottom";
        ctx.fillText(axisX[2], startX, trendStartY + trendHeight);
        ctx.textBaseline = "middle";
        ctx.fillText(axisX[1], startX, trendStartY + trendHeight / 2);


        ctx.textBaseline = "top";
        ctx.fillText(axisVolume[0], startX, volumeStartY);
        ctx.textBaseline = "bottom";
        ctx.fillText(axisVolume[1], startX, volumeStartY + volumeHeight);

        ctx.textBaseline = "top";
        ctx.textAlign = "left"
        ctx.fillText(FormatDate(json.body.kData[beginFlag][4]), startX, trendStartY + trendHeight + 2);
        ctx.textAlign = "right"
        ctx.fillText(FormatDate(json.body.kData[datasNum - 1][4]), startX + width, trendStartY + trendHeight + 2);

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

    function FormatDate(strTime) {
        var date = new Date(strTime);
        return (date.getMonth() + 1) + "月" + date.getDate() + "日";
    }

    function FormatDateWithYear(strTime) {
        var date = new Date(strTime);
        return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    }

    function axisVolume() {
        var temp = maxVolume / 100;
        var array = new Array();
        if (temp > 100000000) {
            temp = temp / 100000000;
            return new Array(temp.toFixed(2).toString(), "亿手");
        } else if (temp > 10000) {
            temp = temp / 10000;
            return new Array(temp.toFixed(2).toString(), "万手");
        } else {
            return new Array(temp.toFixed(2).toString(), "手");
        }
    }

    function drawInfo(index, isleft) {
        var x, y, w, h;
        var high = json.body.kData[index][0];
        var open = json.body.kData[index][1];
        var low = json.body.kData[index][2];
        var close = json.body.kData[index][3];
        var time = json.body.kData[index][4];
        var volume = json.body.kData[index][5];
        var lclose = json.body.kData[index][6];
        if (isleft) {
            x = startX;
            y = trendStartY;
            w = ctx.measureText("价格 3333.33ddd").width;
            h = 21 * 7;
        } else {
            x = startX + width - ctx.measureText("价格 3333.33ddd").width;
            y = trendStartY;
            w = ctx.measureText("价格 3333.33ddd").width;
            h = 21 * 7;
        }

        ctx.strokeStyle = frameColor;
        ctx.fillStyle = "#ffffff";
        ctx.lineWidth = 0.5;
        ctx.fillRect(x, y, w, h);
        ctx.strokeRect(x, y, w, h);
        //console.log("%f, %f, %f, %f",x, y, w, h);
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillStyle = "#000000";

        ctx.fillText(" 日期:", x, trendStartY + 5);
        ctx.fillText(" 最高:", x, trendStartY + 5 + 20);
        ctx.fillText(" 开盘:", x, trendStartY + 5 + 40);
        ctx.fillText(" 最低:", x, trendStartY + 5 + 60);
        ctx.fillText(" 收盘:", x, trendStartY + 5 + 80);
        ctx.fillText(" 涨幅:", x, trendStartY + 5 + 100);
        ctx.fillText(" 成交:", x, trendStartY + 5 + 120);

        var valueX = ctx.measureText("日期:").width;

        ctx.fillText(FormatDateWithYear(time), x + valueX, trendStartY + 5);
        ctx.fillStyle = color(high, lclose);
        ctx.fillText(high.toFixed(2), x + valueX, trendStartY + 5 + 20);
        ctx.fillStyle = color(open, lclose);
        ctx.fillText(open.toFixed(2), x + valueX, trendStartY + 5 + 40);
        ctx.fillStyle = color(low, lclose);
        ctx.fillText(low.toFixed(2), x + valueX, trendStartY + 5 + 60);
        ctx.fillStyle = color(close, lclose);
        ctx.fillText(close.toFixed(2), x + valueX, trendStartY + 5 + 80);
        ctx.fillText(((close - lclose) / lclose * 100).toFixed(2) + "%", x + valueX, trendStartY + 5 + 100);
        ctx.fillStyle = "#000000";
        ctx.fillText(parseInt(volume / 100), x + valueX, trendStartY + 5 + 120);
    }

    function color(value, compare) {
        if (value > compare) {
            return upColor;
        } else if (value == compare) {
            return evenColor;
        } else {
            return downColor;
        }
    }

    function touch(event) {

        ctx.clearRect(0, 0, c.width, c.height);
        var x, y;
        caculateMa()
        drawFrame();
        drawKline();
        drawAxis();
        if (event.type == "touchend") { //need redraw twice, don't know why
            ctx.clearRect(0, 0, c.width, c.height);
            caculateMa()
            drawFrame();
            drawKline();
            drawAxis();
            caculateMatext(MAlength - 1)
            return;
        }
        if (event.touches.length == 1) {
            x = event.touches[0].pageX * 2
            y = event.touches[0].pageY
        }
        if (x < startX || x > startX + width || y < trendStartY || y > volumeStartY + volumeHeight) {
            return;
        }
        var index = parseInt((x - startX) / kWidth);
        x = index * kWidth + kWidth / 2;
        var ss = json.body.kData;
        var open = ss[index + beginFlag][1];
        var close = ss[index + beginFlag][3];

        y = trendStartY + (1 - (close - minPrice) / (maxPrice - minPrice)) * trendHeight;

        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(startX, y);
        ctx.lineTo(startX + width, y);
        ctx.moveTo(x + startX, trendStartY);
        ctx.lineTo(x + startX, volumeStartY + volumeHeight);
        ctx.stroke();
        ctx.closePath();
        caculateMatext(index + beginFlag)

        if (x > width / 2) {
            drawInfo(index + beginFlag, true);
        } else {
            drawInfo(index + beginFlag, false);
        }

    }
}
