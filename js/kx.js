    var myChart = echarts.init(document.getElementById('mymMain'));
    var charh = $('#mymMain').parent().height()
    myChart.height = charh;
    function getMyDate(str) {
        var oDate = new Date(str),
            oYear = oDate.getFullYear(),
            oMonth = oDate.getMonth() + 1,
            oDay = oDate.getDate(),
            oHour = oDate.getHours(),
            oMin = oDate.getMinutes(),
            oSen = oDate.getSeconds(),
            oTime = getzf(oMonth) + '月' + getzf(oDay) + '日'; //最后拼接时间  
        return oTime;
    };
    //补0操作  
    function getzf(num) {
        if (parseInt(num) < 10) {
            num = '0' + num;
        }
        return num;
    }

    function splitData(rawData) {
        var categoryData = [];
        var categoryDatay = [];
        var values = [];
        var volumns = [];
        var open = [];
        var close = [];
        var lowest = [];
        var highest = [];

        for (var i = 0; i < rawData.length; i++) {
            categoryData.push(rawData[i].splice(4, 1)[0]);
            highest.push(rawData[i].splice(0, 1)[0])
            open.push(rawData[i].splice(0, 1)[0])
            lowest.push(rawData[i].splice(0, 1)[0])
            close.push(rawData[i].splice(0, 1)[0])
            rawData[i].unshift(highest[i])
            rawData[i].unshift(lowest[i])
            rawData[i].unshift(close[i])
            rawData[i].unshift(open[i])
            values.push(rawData[i]);
            volumns.push(rawData[i][4]);
        }
        for (var i = 0; i < categoryData.length; i++) {
            categoryDatay.push(getMyDate(categoryData[i]));
        }
        return {
            categoryData: categoryData,
            categoryDatay: categoryDatay,
            values: values,
            volumns: volumns,
            highest: highest,
            lowest: lowest,
            close: close,
            open: open
        };
    }

    function calculateMA(dayCount, data) {
        var result = [];
        for (var i = 0, len = data.values.length; i < len; i++) {
            if (i < dayCount) {
                result.push('-');
                continue;
            }
            var sum = 0;
            for (var j = 0; j < dayCount; j++) {
                sum += data.values[i - j][1];
            }
            result.push(+(sum / dayCount).toFixed(3));
        }
        return result;
    }
    function tanmu(rawData) {

        var data = splitData(rawData);

        myChart.setOption(option = {
            backgroundColor: '#fff',
            legend: {
                top: 0,
                left: 'center',
                data: ['MA5', 'MA10', 'MA20']
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'line'
                },
                // formatter: function(param) {
                //         var param = param[0];
                //         return [
                //             '日期: ' + param.name + '<hr size=1 style="margin: 3px 0">',
                //             '开盘: ' + param.data[0] + '<br/>',
                //             '收盘: ' + param.data[1] + '<br/>',
                //             '最低: ' + param.data[2] + '<br/>',
                //             '最高: ' + param.data[3] + '<br/>'
                //         ].join('');
                //     }
            },
            grid: [{
                top: '10%',
                left: '10%',
                right: '7%',
                height: '60%'
            }, {
                left: '10%',
                right: '7%',
                bottom: '0%',
                height: '18%'
            }],
            xAxis: [{
                type: 'category',
                data: data.categoryDatay,
                axisLabel: {
                    show: true,
                    interval:38,
                },
                min: 'dataMin',
                max: 'dataMax'
            }, {
                type: 'category',
                gridIndex: 1,
                data: data.categoryDatay,
                min: 'dataMin',
                max: 'dataMax'
            }],
            yAxis: [{
                scale: true,
                splitArea: {
                    show: false
                }
            }, {
                scale: true,
                gridIndex: 1,
                splitNumber: 2,
                axisLabel: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: false
                }
            }],
            dataZoom: [{
                type: 'inside',
                xAxisIndex: [0, 1],
                start: 34,
                end: 100,
                zoomLock:true
            }, {
                show: false,
                xAxisIndex: [0, 1],
                type: 'slider',
                left: 'center',
                bottom: 5,
                start: 34,
                end: 100,
                zoomLock:true
            }],
            series: [{
                name: '------------------',
                type: 'candlestick',
                data: data.values,
                itemStyle: {
                    normal: {
                        color: 'red',
                        color0: 'green',
                        borderColor: null,
                        borderColor0: null
                    }
                },
                animationDuration:10

            },{
                name: 'MA5',
                type: 'line',
                data: calculateMA(5, data),
                smooth: true,
                showSymbol: false,
                lineStyle: {
                    normal: { opacity: 0.4 }
                },
                animationDuration:10
            }, {
                name: 'MA10',
                type: 'line',
                data: calculateMA(10, data),
                smooth: true,
                showSymbol: false,
                lineStyle: {
                    normal: { opacity: 0.4 }
                },
                animationDuration:10
            }, {
                name: 'MA20',
                type: 'line',
                data: calculateMA(20, data),
                smooth: true,
                showSymbol: false,
                lineStyle: {
                    normal: { opacity: 0.4 }
                },
                animationDuration:10
            }, {
                name: '成交量',
                type: 'bar',
                xAxisIndex: 1,
                yAxisIndex: 1,
                data: data.volumns,
                itemStyle: {
                    normal: {
                        color: 'red',
                        color0: 'green'
                    }
                }
            }]
        }, true);

    }
