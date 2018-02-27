<template>
    <div style="width:100%;height:100%;" id="visite_volume_con"></div>
</template>

<script>
const echarts = require('echarts');
export default {
    name: 'visiteVolume',
    data () {
        return {
            //
        };
    },
    mounted () {
        this.$nextTick(() => {
            let visiteVolume = echarts.init(document.getElementById('visite_volume_con'));
            let xAxisData = [];
            let data1 = [];
            let data2 = [];
            for (let i = 0; i < 20; i++) {
                xAxisData.push('类目' + i);
                data1.push((Math.sin(i / 5) * (i / 5 - 10) + i / 6) * 5);
                data2.push((Math.cos(i / 5) * (i / 5 - 10) + i / 6) * 5);
            }

            const option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                grid: {
                    top: '2%',
                    left: '2%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: ['一分厂', '二分厂', '三分厂', '四分厂', '五分厂', '六分厂', '七分厂'],
                    nameTextStyle: {
                        color: '#c3c3c3'
                    }
                },
                yAxis: {
                    type: 'value',
                    boundaryGap: [0, 0.01]
                },
                series: [
                    {
                        name: '访问量',
                        type: 'bar',
                        data: [
                            {value: 48, name: '一分厂', itemStyle: {normal: {color: '#2d8cf0'}}},
                            {value: 72, name: '二分厂', itemStyle: {normal: {color: '#2d8cf0'}}},
                            {value: 44, name: '三分厂', itemStyle: {normal: {color: '#2d8cf0'}}},
                            {value: 34, name: '四分厂', itemStyle: {normal: {color: '#2d8cf0'}}},
                            {value: 44, name: '五分厂', itemStyle: {normal: {color: '#2d8cf0'}}},
                            {value: 58, name: '六分厂', itemStyle: {normal: {color: '#2d8cf0'}}},
                            {value: 82, name: '七分厂', itemStyle: {normal: {color: '#2d8cf0'}}}
                        ]
                    }
                ]
            };

            visiteVolume.setOption(option);

            window.addEventListener('resize', function () {
                visiteVolume.resize();
            });
        });
    }
};
</script>
