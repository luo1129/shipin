function fenshiy(json) {

    var c = document.getElementById("myCanvas");
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
    var frameColor = "#333";
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

    var offsetX = width / 241;

    var lastPrice = json.body.last;
    var maxPrice = 0.0;
    var minPrice = 0.0;
    var maxVolume = 0;

    var datas = new Array();
    var volumes = new Array();
    var averages = new Array();
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
        if (i == 0) {
            volumes[i] = volume;
        } else {
            volumes[i] = volume - json.body.minData[i - 1][1];
        }
        if (volumes[i] > maxVolume) {
            maxVolume = volumes[i];
        }

        amount += volumes[i] * datas[i];

        averages[i] = amount / volume;

        //console.log("%f",averages[i]);
    }

    var delta = Math.abs(maxPrice - lastPrice) > Math.abs(minPrice - lastPrice) ? Math.abs(maxPrice - lastPrice) : Math.abs(minPrice - lastPrice);

    var axisX = new Array();
    axisX[0] = maxPrice.toFixed(2);
    axisX[1] = (lastPrice + delta / 2).toFixed(2);
    axisX[2] = lastPrice.toFixed(2);
    axisX[3] = (lastPrice - delta / 2).toFixed(2);
    axisX[4] = (lastPrice - delta).toFixed(2);

    var axisVolume = axisVolume();

    drawFrame();
    drawTrend();
    drawAverages();
    if (!lastPrice == '') {
        drawVolume();
    }
    drawAxis();


    function drawFrame() {
        ctx.strokeStyle = "#ddd";
        ctx.lineWidth = .5;
        ctx.strokeRect(startX, trendStartY, width, trendHeight);
        ctx.strokeRect(startX, volumeStartY, width, volumeHeight);

        for (var i = 1; i < 4; i++) {
            ctx.moveTo(startX, trendStartY + trendHeight / 4 * i);
            ctx.lineTo(startX + width, trendStartY + trendHeight / 4 * i);
        }

        for (var i = 1; i < 4; i++) {
            ctx.moveTo(startX + width / 4 * i, trendStartY);
            ctx.lineTo(startX + width / 4 * i, trendHeight);
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
        var y = trendStartY + trendHeight / 2.0 + (datas[0] - lastPrice) / delta * (trendHeight / 2.0);

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

    function drawAverages() {
        var x = startX;
        var y = trendStartY + trendHeight / 2.0 + (averages[0] - lastPrice) / delta * (trendHeight / 2.0);

        ctx.beginPath();
        ctx.moveTo(x, y);
        for (var i = 1; i < datas.length; i++) {
            x += offsetX;
            y = trendStartY + trendHeight / 2.0 - (averages[i] - lastPrice) / delta * (trendHeight / 2.0);
            ctx.lineTo(x, y);
        }
        ctx.strokeStyle = averageLineColor;
        ctx.stroke();
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
        ctx.textAlign = "left"
        ctx.fillText("9:30", startX, trendStartY + trendHeight + 2);
        ctx.textAlign = "center"
        ctx.fillText("11:30/13:00", startX + width / 2, trendStartY + trendHeight + 2);
        ctx.textAlign = "right"
        ctx.fillText("15:00", startX + width, trendStartY + trendHeight + 2);

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
}
