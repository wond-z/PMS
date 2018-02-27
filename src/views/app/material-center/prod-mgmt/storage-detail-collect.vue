<style>
     @import './prod-mgmt-common.less';
</style>
<template>
  <div class="prod-collect-common">
        <Card class="select-col margin-bottom-10 padding-top-bottom-minish margin-top-10">
            <div class="div">
                <label class="label">起始日期</label>
                <DatePicker :options='options' :value="startDate" placement="bottom-end" placeholder="选择日期" class="select" @on-change="dateStrat"></DatePicker>
            </div>
            <div class="div">
                <label class="label">截止日期</label>
                <DatePicker :options='options' :value="endDate" placement="bottom-end" placeholder="选择日期" class="select" @on-change="dateEnd"> </DatePicker>
            </div>
            <Button type="primary" icon="ios-search" @click="btnCheck()">统计</Button>
            <Button type="primary" icon="ios-upload">导出</Button>
        </Card>
        <Card class="min-height-550">
            <table class="main-table tableCollect" border="1">
                <tr>
                    <td colspan="5" class="table-title" style="font-size:24px">{{startDateArr[0]}}年{{startDateArr[1]}}月{{startDateArr[2]}}日 至 {{endDateArr[0]}}年{{endDateArr[1]}}月{{endDateArr[2]}}日 入库明细汇总</td>
                </tr>
                <tr class="background-color-F8F8F9" v-show="isShow">
                    <td>名称</td>
                    <td>捆数</td>
                    <td>支数</td>
                    <td>重量</td>
                    <td>长度</td>
                </tr>
                <tbody class="tbodyCollect" v-for="(variety,i) in data" :key="i">
                    <tr>
                        <td colspan='5' class="align-left padding-left-20">{{variety.name}}</td>
                    </tr>
                    <tr v-for="(item,j) in variety.data" :key="j">
                        <td>{{item.bcYLSupCmp}}</td>
                        <td>{{item.zTotalBundleNum}}</td>
                        <td>{{item.zTotalNum}}</td>
                        <td>{{item.zTotalWeight}}</td>
                        <td>{{item.zTotalLength}}</td>
                    </tr>
                    <tr class="background-color">
                        <td>合计</td>
                        <td>{{variety.total.zTotalBundleNum}}</td>
                        <td>{{variety.total.zTotalNum}}</td>
                        <td>{{variety.total.zTotalWeight}}</td>
                        <td>{{variety.total.zTotalLength}}</td>
                    </tr>
                </tbody>
                <tr v-show="isShow" class="background-color-e0cccc">
                    <td>总合计</td>
                    <td>{{TotalBundleNum.toFixed(2)}}</td>
                    <td>{{TotalNum.toFixed(2)}}</td>
                    <td>{{TotalWeight.toFixed(2)}}</td>
                    <td>{{TotalLength.toFixed(2)}}</td>
                </tr>
            </table>
        </Card>
    </div>
</template>
<script>
import base from '@/libs/base';
    export default {
        data() {
            return { 
                TotalBundleNum: 0,
                TotalNum: 0,
                TotalWeight: 0,
                TotalLength: 0,
                endDateArr: [],
                startDateArr: [],
                isShow: false,
                data: [],
                startDate: '',
                endDate: '',
                options: {
                    disabledDate(date){
                        return date.valueOf() > Date.now();
                    },
                },
                columns: [
                    {title: '品名', key: 'zWuPinJN',align:"center"},
                    {title: '供货商', key: 'bcYLSupCmp',align:"center"},
                    {title: '长度',key: 'zTotalLength',align:"center"},
                    {title: '支数', key: 'zTotalNum', align:"center"},
                    {title: '重量', key: 'zTotalWeight',align:"center"},
                    {title: '捆数',key: 'zTotalBundleNum',align:"center"},
                ],
            }
        },
        methods:{
            dateStrat(val){
                this.startDate = val;
            },
            dateEnd(val){
                this.endDate = val;
            },
            clearQuery(){
                this.startDate = '';
                this.endDate = '';
            },
            btnCheck(){
                this.pageCurrent = 1;
                this.check(0, this.pageSize);
            },
            handleData(data){
                let i = 0;
                let lastName = '';
                let arr = [];
                let len = data.length;
                data.forEach((item,index)=>{
                    if( index == 0 ){
                        lastName = item.zWuPinJN;
                        arr[i] = this.addClass(item,i);
                    }else{
                        if(item.zWuPinJN === lastName){
                            arr[i].data.push(item);
                            for(var key in arr[i].total){
                                arr[i].total[key] += item[key]*1;
                            }
                            if(index === len -1){
                                for(var key in arr[i].total){
                                    arr[i].total[key] = arr[i].total[key].toFixed(2);
                                }
                            }
                        }else{
                            lastName = item.zWuPinJN;
                            for(var key in arr[i].total){
                                arr[i].total[key] = arr[i].total[key].toFixed(2);
                            }
                            i++;
                            arr[i] = this.addClass(item,i);
                        }
                    }
                })
                this.data = arr;
                
            },
            //添加一类
            addClass(item,i){
                let refer = {name:'',data:[],total:{zTotalBundleNum:0,zTotalNum:0,zTotalWeight:0,zTotalLength:0}};
                refer.name = item.zWuPinJN;
                refer.data.push(item);
                for(var key in refer.total){
                    refer.total[key] += item[key]*1;
                }
                return refer;
            },
            //查询函数
            check(skip,take){
                let para = {};
                this.init();

                para.pUID = 123;
                if(this.startDate) para.pStartDate = this.startDate;
                if(this.endDate) para.pEndDate = this.endDate;

                base.ajaxData('/WlCenter/Cp_ProdrecHzReportParm', para, 'GET', (e) => {
                    if(e.Results[0].Flag == "Y"){
                        para.OrderBy = 'ZWuPinJN';
                        base.ajaxData('/WlCenter/CP_ProdRecHzReport_View', para, 'GET', (e) => {
                            if(e.results.length > 0){
                                e.results.forEach((item) =>{
                                    if(item.zTotalBundleNum) this.TotalBundleNum += Number(item.zTotalBundleNum)
                                    if(item.zTotalLength) this.TotalLength += Number(item.zTotalLength)
                                    if(item.zTotalNum) this.TotalNum += Number(item.zTotalNum)
                                    if(item.zTotalWeight) this.TotalWeight += Number(item.zTotalWeight)
                                })
                                this.isShow = true;
                                this.handleData(e.results);
                            }else{
                                this.isShow = false;
                                this.$Message.error({duration: 5, content:'暂无数据，请重新选择筛选条件'});
                            }
                        });    
                    }
                });
            },
            init(){
                this.startDateArr = this.startDate.split('-');
                this.endDateArr = this.endDate.split('-');
                this.TotalBundleNum = 0;
                this.TotalNum = 0;
                this.TotalWeight = 0;
                this.TotalLength = 0;
                this.data = [];
                this.isShow = false;
            }
        },
        created (){
            this.goodsList = [];
            this.endDate = base.dateFormat(new Date());
            this.startDate = base.dateFormat(new Date(new Date().getTime()-60*60*24*31*1000));

            base.getAjaxData(base.baseURL + 'PublicApi/bs_goodsinfo_view?Wp_IDStartsWith=108',(bsGoods) =>{
                bsGoods.results.forEach((item) => {
                    if(item.pinM && item.wp_ID){
                        this.goodsList.push({id:item.wp_ID,value:item.pinM});
                    }
                })
                this.init()
                this.btnCheck();
            });
        }
    }
</script>