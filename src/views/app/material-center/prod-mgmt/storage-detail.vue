<style>
   @import './prod-mgmt-common.less';
</style>
<template>
  <div class="prod-collect-common">
        <Card class="select-col margin-bottom-10 padding-top-bottom-minish margin-top-10">
            <div class="div">
                <label class="label">产品类别</label>
                <Select v-model="material" class="select" >
                    <Option  v-for="item in goodsList" :value="item.id " :key="item.id ">{{ item.value }}</Option> 
                </Select>
            </div>
            <div class="div">
                <label class="label">分厂</label>
                <Select v-model="office" class="select">
                    <Option :value="0">全部</Option>
                    <Option v-for="item in offerCmpList" :value="item.mid" :key="item.mid">{{ item.mDepName }}</Option>
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
                    <td colspan="7" class="table-title" >{{startShow}} 至 {{endShow}} {{offerShow}} {{goodShow}}入库明细</td>
                </tr>
                <tr class="background-color-F8F8F9" v-show="isShow">
                    <td>入库日期</td>
                    <td>捆数</td>
                    <td>支数</td>
                    <td>重量</td>
                    <td>长度</td>
                    <td>炉号</td>
                    <td>备注</td>
                </tr>
                <tbody class="tbodyCollect" v-for="(variety,i) in data" :key="i">
                    <tr>
                        <td colspan='7' class="align-left padding-left-20">{{variety.name}}</td>
                    </tr>
                    <tr v-for="(item,j) in variety.data" :key="j">
                        <td>{{item.inDate}}</td>
                        <td>{{item.totalBundleNum}}</td>
                        <td>{{item.totalNum}}</td>
                        <td>{{item.totalWeight}}</td>
                        <td>{{item.totalLength}}</td>
                        <td>{{item.furnaceNo}}</td>
                        <td>{{item.remarks}}</td>
                    </tr>
                    <tr class="background-color">
                        <td>合计</td>
                        <td>{{variety.total.totalBundleNum}}</td>
                        <td>{{variety.total.totalNum}}</td>
                        <td>{{variety.total.totalWeight}}</td>
                        <td>{{variety.total.totalLength}}</td>
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
                TotalBundleNum: 0,
                TotalNum: 0,
                TotalWeight: 0,
                TotalLength: 0,
                endDateArr: [],
                startDateArr: [],
                startDate: '',
                endDate: '',
                isShow: false,
                data: [],
                options: {
                    disabledDate(date){
                        return date.valueOf() > Date.now();
                    },
                },
                goodsList: [],
                material: '',
                office: '',
                offerCmpList: [],
                startShow: '',
                endShow: '',
                goodShow: '',
                offerShow: ''
            }
        },
        methods:{
            goodShowChange(id){
                let json = this.goodsList.find( (item,index)=>{
                    if(item.id == id)return item;
                })
                this.goodShow = json.value
            },
            offerShowChange(id){
                if(id != 0){
                    let json = this.offerCmpList.find( (item,index)=>{
                        if(item.mid == id)return item;
                    })
                    this.offerShow = json.mDepName
                }else{
                     this.offerShow = ''
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
                        lastName = item.ylSupCmp;
                        arr[i] = this.addClass(item,i);
                    }else{
                        if(item.ylSupCmp === lastName){
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
                            lastName = item.ylSupCmp;
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
                let refer = {name:'',data:[],total:{totalBundleNum:0,totalNum:0,totalWeight:0,totalLength:0}};
                refer.name = item.ylSupCmp;
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
                if(this.material) para.pCp_Type = this.material;
                if(this.office) {
                    para.pUseCmp_ID = this.office;
                }else{
                    para.pUseCmp_ID = 0;
                }
                
                if(this.startDate) para.pStartDate = this.startDate;
                if(this.endDate) para.pEndDate = this.endDate;
                this.goodShowChange(this.material)
                this.offerShowChange(this.office)
                base.ajaxData('/WlCenter/Cp_ProdRechReport_V1Parm', para, 'GET', (e) => {
                    if(e.Results[0].Flag == "Y"){
                        para.OrderBy = 'ylSupCmp';
                        base.ajaxData('/WlCenter/Cp_ProdrechzReport_View1', para, 'GET', (e) => {
                            if(e.results.length > 0){
                                e.results.forEach((item) =>{
                                    if(item.inDate) item.inDate = item.inDate.substring(0,10);
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
                this.data = [];
                this.isShow = false;
            }
        },
        created (){
            this.endDate = base.dateFormat(new Date());
            this.startDate = base.dateFormat(new Date(new Date().getTime()-60*60*24*31*1000));
            base.getGoodsList(this,108);
            base.getAjaxData(base.baseURL + 'PublicApi/Bs_commdep1_view',(res) =>{
                this.offerCmpList = res.results;
                if(this.offerCmpList[0].mid){
                    this.office = this.offerCmpList[0].mid;
                    this.offerShowChange(this.offerCmpList[0].mid)
                }
                this.goodShowChange(this.goodsList[0].id)
                this.btnCheck();
            });
        }
    }
</script>