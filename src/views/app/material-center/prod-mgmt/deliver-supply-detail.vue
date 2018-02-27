<style>

</style>
<template>
  <div class="prod-collect-common">
        <Card class="select-col margin-bottom-10 padding-top-bottom-minish margin-top-10">
            <div class="div">
                <label class="label">产品类别</label>
                <Select v-model="material" class="select">
                    <Option  v-for="item in goodsList" :value="item.id " :key="item.id ">{{ item.value }}</Option> 
                </Select>
            </div>
            <div class="div">
                <label class="label">订货单位</label>
                <Select v-model="user"  class="select">
                    <Option :value="0">全部</Option>
                    <Option v-for="item in useCmpList" :value="item.id" :key="item.value">{{ item.value }}</Option>
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

            <Button type="primary" icon="ios-search" @click="btnCheck()">统计</Button>
            <Button type="primary" icon="ios-upload">导出</Button>
        </Card>
        <Card class="min-height-550">
            <table class="main-table tableCollect" border="1">
                <tr>
                    <td colspan="9" class="table-title">{{startShow}} 至 {{endShow}} {{orderShow}} {{goodShow}}发/供货明细</td>
                </tr>
                <tr class="background-color-F8F8F9" v-show="isShow">
                    <td>供货商</td>
                    <td>捆数</td>
                    <td>支数</td>
                    <td>重量（吨）</td>
                    <td>长度</td>
                    <td>生产分厂</td>
                    <td>车数</td>
                    <td>生产月份</td>
                    <td>入库序号</td>
                </tr>
                <tbody class="tbodyCollect" v-for="(variety,i) in data" :key="i">
                    <tr>
                        <td colspan='9' class="align-left padding-left-20">{{variety.name}}</td>
                    </tr>
                    <tr v-for="(item,j) in variety.data" :key="j">
                        <td>{{item.ylSupCmp}}</td>
                        <td>{{item.totalBundleNum}}</td>
                        <td>{{item.totalNum}}</td>
                        <td>{{item.totalWeight}}</td>
                        <td>{{item.totalLength}}</td>
                        <td>{{item.cpProdCmp}}</td>
                        <td>{{item.totalCheshu}}</td>
                        <td>{{item.prod_Month}}</td>
                        <td>{{item.inBillSeq}}</td>
                    </tr>
                    <tr class="background-color">
                        <td>合计</td>
                        <td>{{variety.total.totalBundleNum}}</td>
                        <td>{{variety.total.totalNum}}</td>
                        <td>{{variety.total.totalWeight}}</td>
                        <td>{{variety.total.totalLength}}</td>
                        <td></td>
                        <td>{{variety.total.totalCheshu}}</td>
                        <td></td>
                        <td></td>
                    </tr>
                </tbody>
                <tr v-show="isShow" class="background-color-e0cccc">
                    <td>总合计</td>
                    <td>{{TotalBundleNum.toFixed(2)}}</td>
                    <td>{{TotalNum.toFixed(2)}}</td>
                    <td>{{TotalWeight.toFixed(2)}}</td>
                    <td>{{TotalLength.toFixed(2)}}</td>
                    <td></td>
                    <td>{{TotalCheShu.toFixed(2)}}</td>
                    <td></td>
                    <td></td>
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
                TotalCheShu: 0,
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
                    }
                },
                material: '',
                goodsList: [],
                useCmpList: [],
                user: 0,
                startShow: '',
                endShow: '',
                goodShow: '',
                orderShow: ''
            }
        },
        methods:{
            goodShowChange(id){
                let json = this.goodsList.find( (item,index)=>{
                    if(item.id == id)return item;
                })
                this.goodShow = json.value
            },
            orderShowChange(id){
                if(id != 0){
                    let json = this.useCmpList.find( (item,index)=>{
                        if(item.id == id)return item;
                    })
                    this.orderShow = json.value
                }else{
                     this.orderShow = ''
                }
            },
            dateStrat(val){
                this.startDate = val;
            },
            dateEnd(val){
                this.endDate = val;
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
                        lastName = item.date;
                        arr[i] = this.addClass(item,i);
                    }else{
                        if(item.date === lastName){
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
                            lastName = item.date;
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
                let refer = {name:'',data:[],total:{totalCheshu:0,totalBundleNum:0,totalNum:0,totalWeight:0,totalLength:0}};
                refer.name = item.date;
                refer.data.push(item);
                for(var key in refer.total){
                    refer.total[key] += item[key]*1;
                }
                return refer;
            },
            check(skip,take){
                let para = {};
                this.init();
               
                para.pUID = 123;
                if(this.material) para.pCpType = this.material;
                if(this.user) {
                    para.pCpProdCmp_ID = this.user;
                }else{
                    para.pCpProdCmp_ID = 0;
                }
                if(this.startDate) para.pStartDate = this.startDate;
                if(this.endDate) para.pEndDate = this.endDate;

                this.goodShowChange(this.material)
                this.orderShowChange(this.user)
                base.ajaxData('/WlCenter/Cp_ProdRechReport_V3Parm', para, 'GET', (e) => {
                    if(e.Results[0].Flag == "Y"){
                        para.OrderBy = 'date';
                        base.ajaxData('/WlCenter/Cp_prodrechzReport_View3', para, 'GET', (e) => {
                            if(e.results.length > 0){
                                e.results.forEach((item) =>{
                                    if(item.date) item.date = item.date.substring(0,10);
                                    if(item.totalCheshu) this.TotalCheShu += Number(item.totalCheshu)
                                    if(item.totalBundleNum) this.TotalBundleNum += Number(item.totalBundleNum)
                                    if(item.totalLength) this.TotalLength += Number(item.totalLength)
                                    if(item.totalNum) this.TotalNum += Number(item.totalNum)
                                    if(item.totalWeight) this.TotalWeight += Number(item.totalWeight)
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
                this.startShow = this.startDateArr[0] + '年' + this.startDateArr[1] +'月'+ this.startDateArr[2] + '日'
                this.endShow = this.endDateArr[0] + '年' + this.endDateArr[1] + '月' + this.endDateArr[2] + '日'
                this.TotalBundleNum = 0;
                this.TotalNum = 0;
                this.TotalWeight = 0;
                this.TotalLength = 0;
                this.TotalCheShu = 0;
                this.data = [];
                this.isShow = false;
            }
        },
        created (){
            this.endDate = base.dateFormat(new Date());
            this.startDate = base.dateFormat(new Date(new Date().getTime()-60*60*24*31*1000));
            base.getGoodsList(this,108);

            base.getAjaxData(base.baseURL + 'PublicApi/bs_comminfo_view',(res) =>{
                res.results.forEach((item) => {
                    if(item.comm_ID){
                        let temp = item.comm_ID.substring(0,3);
                        if(item.subClass_Value){
                            if(temp == 102) this.useCmpList.push({id:item.comm_ID,value:item.subClass_Value});
                        }
                    }
                })
                if(this.useCmpList[0].id) {
                    this.user = this.useCmpList[0].id;
                    this.orderShowChange(this.useCmpList[0].id)
                }
                this.goodShowChange(this.goodsList[0].id)
                this.btnCheck();
            });
        }
    }
</script>