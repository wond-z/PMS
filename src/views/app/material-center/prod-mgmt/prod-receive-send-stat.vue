<style lang="less" >
   @import './prod-mgmt-common.less';
</style>
<template>
    <div class="prod-receive-send-stat">
        <card class="margin-bottom-10 padding-top-bottom-minish">
            <div class="select-col" >
                <div class="div">
                    <label align="middle" class="label">产品类别</label>
                    <Select v-model="material" class="select li-width">
                        <Option v-for="item in goodsList" :value="item.id" :key="item.value">{{item.value}}</Option>
                    </Select>
                </div>
                <div class="div">
                    <label class="label">生产单位</label>
                    <Select v-model="office" class="select">
                        <Option v-for="item in offerCmpList" :value="item.mid" :key="item.mid">{{ item.mDepName }}</Option>
                    </Select>
                </div> 
                <div class="div">
                    <label class="label">起始日期</label>
                    <DatePicker :options='options' v-model="startDate" placement="bottom-end" placeholder="选择日期" class="select" @on-change="dateStrat"></DatePicker>
                </div>
                <div class="div">
                    <label class="label">截止日期</label>
                    <DatePicker :options='options' v-model="endDate" placement="bottom-end" placeholder="选择日期" class="select" @on-change="dateEnd"> </DatePicker>
                </div>
                <Button type="primary" @click="btnCheck" icon="ios-search" :disabled="countStatus">统计</Button>
                <Button type="primary" icon="social-dropbox-outline" @click="clearSelect">清空</Button>
            </div> 
        </card>
        <card class="margin-bottom-10">
            <table class="main-table margin-bottom-10 tableDetail" border="1">
                <tr>
                    <td colspan="8" class="table-title" > 汇总合计 </td>
                </tr>
                <tr>
                    <td>汇总项目</td>
                    <td>入库</td>
                    <td>出库</td>
                    <td>冲红入库</td>
                    <td>结存</td>
                </tr>
                <tr v-for="item in statData">
                    <td>{{item.tj_Prj}}</td>
                    <td>{{item.inTotal}}</td>
                    <td>{{item.outInTotal}}</td>
                    <td>{{item.offsetInTotal}}</td>
                    <td>{{item.balanceTotalNum}}</td>
                </tr>
            </table>
        </card>    
        <card class="margin-bottom-10">
            <table class="main-table margin-bottom-10 tableDetail" border="1">
                <tr>
                    <td colspan="7" class="table-title"> 入库单明细 </td>
                </tr>
                <tr>
                    <td>入库日期</td>
                    <td>入库单数</td>
                    <td>捆数</td>
                    <td>支数</td>
                    <td>重量</td>
                    <td>长度</td>
                    <td>备注</td>
                </tr>
                <tr v-for="item in inStoreData" :class= "item.isSunday == '1'?'background-color':''">
                    <td>{{item.inOutDate}}</td>
                    <td>{{item.totalBillNum}}</td>
                    <td>{{item.totalBundleNum}}</td>
                    <td>{{item.totalNumber}}</td>
                    <td>{{item.totalWeight}}</td>
                    <td>{{item.totalLength}}</td>
                    <td>{{item.remarks}}</td>
                </tr>
                <tr v-for="item in inStoreTotal">
                    <td>合计</td>
                    <td>{{item.totalBillNum}}</td>
                    <td>{{item.totalBundleNum}}</td>
                    <td>{{item.totalNumber}}</td>
                    <td>{{item.totalWeight}}</td>
                    <td>{{item.totalLength}}</td>
                    <td></td>
                </tr>
            </table>
        </card>    
        <card class="margin-bottom-10">
            <table class="main-table margin-bottom-10 tableDetail" border="1">
                <tr>
                    <td colspan="7" class="table-title"> 出库单明细 </td>
                </tr>
                <tr>
                    <td>出库日期</td>
                    <td>出库单数</td>
                    <td>捆数</td>
                    <td>支数</td>
                    <td>重量</td>
                    <td>长度</td>
                    <td>备注</td>
                </tr>
                <tr v-for="item in outStoreData" :class="item.isSunday == '1'?background-color:''">
                   <td>{{item.inOutDate}}</td>
                    <td>{{item.totalBillNum}}</td>
                    <td>{{item.totalBundleNum}}</td>
                    <td>{{item.totalNumber}}</td>
                    <td>{{item.totalWeight}}</td>
                    <td>{{item.totalLength}}</td>
                    <td>{{item.remarks}}</td>
                </tr>
                <tr v-for="item in outStoreTotal">
                    <td>合计</td>
                    <td>{{item.totalBillNum}}</td>
                    <td>{{item.totalBundleNum}}</td>
                    <td>{{item.totalNumber}}</td>
                    <td>{{item.totalWeight}}</td>
                    <td>{{item.totalLength}}</td>
                    <td></td>
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
                material: '',                    //选中的材料
                office: '',   
                offerCmpList: [] ,  
                goodsList: [], 
                startDate: '',
                endDate: '', 
                statData: [],                // 表格数据
                options:{
                    disabledDate(date){
                        return date.valueOf() > Date.now();
                    }
                },
                columns: [                   // 表格表头/列信息
                    {key: "SubClass_Value", title: "品名",align: 'center',width: 220,},
                    {key: "ShouPoundWeight", title: "到货重量",align: 'center'},
                    {key: "ShouNumber", title: "到货总支数",align: 'center'},
                    {key: "FaPoundWeight", title: "发货重量",align: 'center'},
                    {key: "FaNumber", title: "发货总支数",align: 'center'},
                    {key: "WfPoundWeight", title: "未发货重量",align: 'center'},
                    {key: "WfNumber", title: "未发货支数",align: 'center'},
                ],
                inStoreColumns: [                   // 表格表头/列信息
                    {key: "SubClass_Value", title: "入库日期",align: 'center',width: 220,},
                    {key: "ShouPoundWeight", title: "入库单数",align: 'center'},
                    {key: "ShouNumber", title: "捆数",align: 'center'},
                    {key: "FaPoundWeight", title: "支数",align: 'center'},
                    {key: "FaNumber", title: "重量",align: 'center'},
                    {key: "WfPoundWeight", title: "长度",align: 'center'},
                    {key: "WfNumber", title: "备注",align: 'center'},
                ],
                outStoreColumns: [                   // 表格表头/列信息
                    {key: "SubClass_Value", title: "出库日期",align: 'center',width: 220,},
                    {key: "ShouPoundWeight", title: "出库单数",align: 'center'},
                    {key: "ShouNumber", title: "捆数",align: 'center'},
                    {key: "FaPoundWeight", title: "支数",align: 'center'},
                    {key: "FaNumber", title: "重量",align: 'center'},
                    {key: "WfPoundWeight", title: "长度",align: 'center'},
                    {key: "WfNumber", title: "备注",align: 'center'},
                ],
                inStoreData: '',
                outStoreData: '',
                inTotalBillNum: 0,
                inTotalBundleNum: 0,
                inTotalNumber: 0,
                inTotalWeight: 0,
                inTotalLength: 0,
                outTotalBillNum: 0,
                outTotalBundleNum: 0,
                outTotalNumber: 0,
                outTotalWeight: 0,
                outTotalLength: 0,
                sunday: '',
                inStoreTotal: [],
                outStoreTotal: [],
                countStatus: false
            }
        },
        methods: {
            dateStrat(val){
                this.startDate = val;
            },
            dateEnd(val){
                this.endDate = val;
            },
           // 统计
            check(){
                this.countStatus = true;
                this.init();
                let _self = this;
                let para = {};
                this.inStoreData = [];
                this.outStoreData = [];
                this.statData = [];

                if(this.material) para.pCp_Type = this.material;
                if(this.UID) para.pUID = this.UID;
                if(this.office) para.pCpUseCmp_ID =  this.office;
                if(this.startDate){
                    if(this.startDate.length == undefined){
                        this.startDate = base.dateFormat(this.startDate);
                    }
                    para.pStartDate = this.startDate;
                } 
                if(this.endDate){
                    if(this.endDate.length == undefined){
                        this.endDate = base.dateFormat(this.endDate);
                    }
                    para.pEndDate = this.endDate;
                } 
                console.log(para)
                base.ajaxData('/WlCenter/Cp_RecDeliverrecReportParm', para, 'GET', (e) => {
                    let res = e.Results;
                    
                    if(res){
                        if(res[0].Flag == "Y"){
                            base.ajaxData('/WlCenter/Cp_RecDeliverrecReport', para, 'GET', (e) => {
                                this.statData = e.results;
                            });
                            base.ajaxData('/WlCenter/Cp_RecDeliverRecReport_V', para, 'GET', (e) => {
                                if(e.results){
                                    e.results.forEach((item) => {
                                        if(item.inOutFlag == 1) {
                                            this.inStoreData.push({inOutDate:item.inOutDate,inOutFlag:item.inOutFlag,isSunday:item.isSunday,remarks:item.remarks,totalBillNum:item.totalBillNum,
                                                               totalBundleNum:item.totalBundleNum,totalLength:item.totalLength,totalNumber:item.totalNumber,totalWeight:item.totalWeight,uid:item.uid})
                                        }else if(item.inOutFlag == 11) {
                                            this.inStoreTotal.push({totalBillNum:item.totalBillNum,totalBundleNum:item.totalBundleNum,totalLength:item.totalLength,totalNumber:item.totalNumber,totalWeight:item.totalWeight,uid:item.uid})
                                        }else if(item.inOutFlag == 2) {
                                            this.outStoreData.push({inOutDate:item.inOutDate,inOutFlag:item.inOutFlag,isSunday:item.isSunday,remarks:item.remarks,totalBillNum:item.totalBillNum,
                                                               totalBundleNum:item.totalBundleNum,totalLength:item.totalLength,totalNumber:item.totalNumber,totalWeight:item.totalWeight,uid:item.uid})
                                        }else if(item.inOutFlag == 22) {
                                            this.outStoreTotal.push({totalBillNum:item.totalBillNum,totalBundleNum:item.totalBundleNum,totalLength:item.totalLength,totalNumber:item.totalNumber,totalWeight:item.totalWeight,uid:item.uid})
                                        }else{
                                            this.$Message.error({top: 200, duration: 5, content: '无数据！'});
                                        }
                                    });
                                }
                            });
                        }
                        if(res[0].Flag == "S"){
                            base.ajaxData('/WlCenter/Cp_RecDeliverrecReport', para, 'GET', (e) => {
                                this.statData = e.results;
                            });
                            this.$Message.error({top: 200, duration: 5, content: '入库单，出库单明细暂无数据！'});
                        }
                        if(res[0].Flag == "N"){
                            this.$Message.error({top: 200, duration: 5, content: '筛选条件有误，请您重新选择！'});
                        }
                    }
                    _self.countStatus = false;
                });
            },
            btnCheck() {
                this.check();
            },
            // 表单重置
            clearSelect () {
                this.office = '3';        
                this.initDate();               
            },
            init(){
                this.inStoreData = [];
                this.inStoreTotal = [];
                this.outStoreData = [];
                this.outStoreTotal = [];
            },
            initDate(){
                this.endDate = base.dateFormat(new Date());
                this.startDate = base.dateFormat(new Date(new Date().getTime()-60*60*24*31*1000));
            }
        },
        // 获取数据
        mounted () {
            base.getGoodsList(this,108);
            base.getAjaxData(base.baseURL + 'PublicApi/Bs_commdep1_view',(res) =>{
                this.offerCmpList = res.results;
                if(this.offerCmpList[0].mid) this.office = this.offerCmpList[0].mid
                this.initDate();
                this.check();
            });
        }
    }
</script>
