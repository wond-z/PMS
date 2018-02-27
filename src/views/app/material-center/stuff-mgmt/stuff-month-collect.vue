<style lang="less" >
    @import './stuff-mgmt-common.less';
</style>

<template>
	 <div class="stuff-common-mgmt">
        <card class="margin-bottom-10 margin-top-10 select-col padding-top-bottom-minish">
            <div class="div">
                <label class="label" style="width:50px;">年份</label>
                <DatePicker :options='options' type="year"  :value="Years" placeholder="选择年份" class="select" @on-change="chooseYear"></DatePicker>
            </div>
             <div class="div">
                <label class="label" style="width:50px;">月份</label>
                <Select :transfer="true" v-model="Month" class="select">
                    <Option  v-for="item in months" :value="item.num" :key="item.num" >{{item.value}}</Option>
                </Select>
            </div>
            <div class="div">
                <label class="label">材料类别</label>
                <Select :transfer="true" v-model="stuffClass" class="select">
                    <Option  :value="0" >全部</Option>
                    <Option  v-for="item in stuffClassList" :value="item.class_Value" :key="item.class_Value" >{{item.class_Value}}</Option>
                </Select>
            </div>
            <Button type="primary" icon="ios-search" @click="btnCheck()" >查询</Button>
            <Button type="primary" icon="ios-upload">导出明细账</Button>
		</card>
        <card>
            <p style="font-size:24px;text-align:center;"class="margin-bottom-10">{{Years}}年{{Month}}月物资收发存明细表</p>
            <table class="main-table margin-bottom-10 month-collect-table" border="1" >
                <tr style="font-size:24px;display:none;">
                    <td colspan="11">月物资收发存明细表</td>
                </tr>
                <tr>
                    <td rowspan="2">物资名称</td>
                    <td rowspan="2">规格</td>
                    <td rowspan="2">计量单位</td>
                    <td colspan="2">上期结存</td>
                    <td colspan="2">本期购进</td>
                    <td colspan="2">本期发出</td>
                    <td colspan="2">本期结存</td>
                </tr>
                <tr>
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
                  
                    <td></td>
                    <td></td>
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
                    <td></td>
                    <td></td>
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
            months:[ 
                {num: "1", value: "1"},
                {num: "2", value: "2"},
                {num: "3", value: "3"},
                {num: "4", value: "4"},
                {num: "5", value: "5"},
                {num: "6", value: "6"},
                {num: "7", value: "7"},
                {num: "8", value: "8"},
                {num: "9", value: "9"},
                {num: "10", value: "10"},
                {num: "11", value: "11"},
                {num: "12", value: "12"}
            ],  
            // month:'',
            // years:'', 
            Years: '', 
            Month: '1', 
            stuffClassList: [],
            stuffClass: 0,
        }
    },
    computed: {
    },
    methods: {
        chooseYear(val){
            this.Years = val;
        },
        chooseMonth(val){
            this.Month = val;
        },
        /**
         * 改变页数时的函数
         */
        btnCheck() {
            this.check(0, this.pageSize);
        },
        //查询函数
        check(skip,take){
            let _self = this;
            let para = {};
            
            para.Skip = skip;
            para.Take = this.pageSize;

            if(this.UID) para.pUID = this.UID;
            if(this.Years) {
                    if(this.Years.length == undefined){
                        // this.Years = base.dateFormat(this.Years).substring(0,4);
                    }
                    para.BmYears = this.Years;
                }
            if(this.Month)para.bmMonth = this.Month;
            if(this.stuffClass) para.pYl_Type = this.stuffClass;
     

            base.ajaxData('/WlCenter/Yl_YiYiBatReportParm', para, 'GET', (e) => {
            });
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
        },
        init(){
            let date = base.dateFormat(new Date());
            let year = date.substring(0,4);
            this.Years = year;
        }
    },
    mounted(){
        this.init();
        this.check();
        for(var i = 0;i < this.rowNum;i++){
            this.modelData2.push({});
        } 
        let stuffArray = [];
        // 材料类别
        base.ajaxData('/PublicApi/Bs_Clcategory?ParentId=0', {}, 'GET', (e) => {
            if(e.results.length > 0){
                e.results.forEach((item) => {
                    stuffArray.push({parentId:item.parentId,class_Value:item.class_Value})
                })
                this.stuffClassList = stuffArray;
            }
        });
    },
    created(){
        
    }
};
</script>
