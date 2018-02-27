<style lang="less">
   @import './dissent-collect.less';
</style>

<template>
	 <div class="dissent-collect">
        <card class="margin-bottom-10 margin-top-10 select-col padding-top-bottom-minish">
            <div class="div">
                <label align="middle" class="label" style="width:40px;">原料</label>
                <Select v-model="material" class="select li-width" >
                    <Option v-for="item in goodsList" :value="item.id" :key="item.value">{{item.value}}</Option>
                </Select>
            </div>
            <div class="div">
                <label class="label">起始日期</label>
                <DatePicker :options='options' :value="startDate" placement="bottom-end" placeholder="选择日期" class="select" @on-change="dateStrat"></DatePicker>
            </div>
            <div class="div">
                <label class="label">截止日期</label>
                <DatePicker :options='options' :value="endDate" placement="bottom-end" placeholder="选择日期" class="select" @on-change="dateEnd"> </DatePicker>
            </div>
            <Button type="primary" icon="ios-search" @click="btnCheck()" >查看报表</Button>
            <Button type="primary" icon="ios-upload">导出明细账</Button>
		</card>
        <card>
            <!-- <p style="font-size:24px;text-align:center;"class="margin-bottom-10">油管质量异议总账12月份139.7*7.72 (J55)</p> -->
            <table class="main-table margin-bottom-10" border="1" >
                <tr >
                    <td colspan="12" class="table-title" style="font-size:24px;">油管质量异议总账12月份139.7*7.72 (J55)</td>
                </tr>
                <tr>
                    <td ></td>
                    <td colspan="2">前期结存</td>
                    <td colspan="2">本期发生</td>
                    <td colspan="2">异议处理</td>
                    <td colspan="2">本期结存</td>
                </tr>
                <tr>
                    <td >单位名称</td>
                    <td >数量</td>
                    <td >金额</td>
                    <td >数量</td>
                    <td >金额</td>
                    <td >数量</td>
                    <td >金额</td>
                    <td >数量</td>
                    <td >金额</td>
                </tr>
                <tr v-for="(item,index) in this.modelData2">
                    <td>{{item.ylSupCmp}}</td>
                    <td>{{item.bBalanceWeight}}</td>
                    <td>{{item.bBalanceAmount}}</td>
                    <td>{{item.weight}}</td>
                    <td>{{item.amount}}</td>
                    <td>{{item.batWeight}}</td>
                    <td>{{item.batAmount}}</td>
                    <td>{{item.tBalanceWeight}}</td>
                    <td>{{item.tBalanceAmount}}</td>
                </tr>
                <tr>
                    <td>合计：</td>
                    <td>{{totalbBalanceWeight}}</td>
                    <td>{{totalbBalanceAmount}}</td>
                    <td>{{totalWeight}}</td>
                    <td>{{totalAmount}}</td>
                    <td>{{totalBatWeight}}</td>
                    <td>{{totalBatAmount}}</td>
                    <td>{{totaltBalanceWeight}}</td>
                    <td>{{totaltBalanceAmount}}</td>
                </tr>
            </table>
        </card>
	</div>
</template>
<script>
import base from '@/libs/base';

export default {
    data () {
        return {
            UID: '123',
            material: '10710000',
            goodsList: [],//品名列表
            startDate: '',
            endDate: '',
            options: {
                disabledDate(date){
                    return date.valueOf() > Date.now();
                }
            },
            modelData2: [],
            data:'',
            rowNum: 10,
            len: '',
            totalbBalanceWeight: 0,
            totalbBalanceAmount: 0,
            totalBatAmount: 0,
            totalBatWeight: 0,
            totaltBalanceAmount: 0,
            totaltBalanceWeight: 0,
            totalWeight: 0,
            totalAmount: 0,        
        }
    },
    computed: {
    },
    methods: {
        dateStrat(val){
            this.startDate = val;
        },
        dateEnd(val){
            this.endDate = val;
        },
        /**
         * 改变页数时的函数
         */
        btnCheck() {
            this.check();
        },
        //查询函数
        check(){
            let _self = this;
            let para = {};
            this.modelData2 = [];

            if(this.UID) para.pUID = this.UID;
            if(this.material) para.pYl_Type = this.material;
            if(this.startDate) para.pStartDate = this.startDate;
            if(this.endDate) para.pEndDate = this.endDate;
            base.ajaxData('/WlCenter/Yl_YiYiBatReportParm', para, 'GET', (e) => {
                let res = e.Results;
                if(res[0].Flag == "Y"){
                    if(this.rowNum > this.len){
                        for(var i = 0;i < this.rowNum;i++){
                            this.modelData2.push({});
                        }   
                    }
                    if(this.rowNum <= this.len){
                        for(var i = 0;i < this.len;i++){
                            this.modelData2.push();
                        } 
                    }
                    
                    base.ajaxData('/WlCenter/Yl_YiYiBatReport', para, 'GET', (e) => {
                        let logData= e.results;
                        this.len = logData.length;
                        for(let i = 0;i < this.len; i++){
                            this.modelData2[i] = logData[i];
                        }
                        logData.forEach( (item) => {
                            if(item.bBalanceWeight) this.totalbBalanceWeight += Number(item.bBalanceWeight);
                            if(item.bBalanceAmount) this.totalbBalanceAmount += Number(item.bBalanceAmount);
                            if(item.batAmount) this.totalBatAmount += Number(item.batAmount);
                            if(item.batWeight) this.totalBatWeight += Number(item.batWeight);
                            if(item.tBalanceAmount) this.totaltBalanceAmount += Number(item.tBalanceAmount);
                            if(item.tBalanceWeight) this.totaltBalanceWeight += Number(item.tBalanceWeight);
                            if(item.weight) this.totalWeight += Number(item.weight);
                            if(item.amount) this.totalAmount += Number(item.amount);
                        });
                        this.$forceUpdate();
                    });
                }
                if(res[0].Flag == "S"){
                    this.$Message.error({duration: 5, content: '暂无数据！'});
                    this.initData();
                    for(var i = 0;i < this.rowNum;i++){
                        this.modelData2.push({});
                    } 
                }
                if(res[0].Flag == "N"){
                    this.$Message.error({duration: 5, content: '筛选条件错误，请重新筛选'});
                    this.initData();
                    for(var i = 0;i < this.rowNum;i++){
                        this.modelData2.push({});
                    } 
                }
            });
        },
        // 初始化
        init(){
            let date = new Date();
            let day = date.getDate();
            let month = date.getMonth();
            let year = date.getFullYear();
            let nowDate = year + '-' + (month + 1) + '-' + day;
            let newDate = year + '-' + month + '-' + day;
            if(month == 0){
                month = 12;
                year = year - 1;
                newDate = year + '-' + month + '-' + day;
            }
            this.endDate = nowDate;
            this.startDate = newDate;
        },
        initData(){
            this.totalbBalanceWeight= 0;
            this.totalbBalanceAmount= 0;
            this.totalBatAmount= 0;
            this.totalBatWeight= 0;
            this.totaltBalanceAmount= 0;
            this.totaltBalanceWeight= 0;
            this.totalWeight= 0;
            this.totalAmount= 0;
        }
    },
    created(){
        base.getGoodsList(this,"");
        this.init();
        this.check()
    }
};
</script>
