<style lang="less" >
</style>
<template>
    <div class="">
        <card class="margin-bottom-10 padding-top-bottom-minish">
            <div class="select-col " >
                <div class="div">
                    <label class="label">原料</label>
                    <Select  v-model="materiaSelect" class="select li-width">
                        <Option  value="0">全部</Option>
                        <Option  v-for="item in materiaData" :value="item.wp_ID" :key="item.wp_ID" >{{ item.pinMing }}</Option> 
                    </Select>
                </div>
                <div class="div">
                    <label class="label" >供货单位</label>
                    <Select :transfer="true" v-model="supplierSelect" class="select">
                        <Option  value="0" >全部</Option>
                        <Option  v-for="item in supplierData" :value="item.comm_ID" :key="item.comm_ID">{{item.subClass_Value}}</Option>
                    </Select>
                </div>
                <div class="div">
                    <label class="label">使用单位</label>
                    <Select :transfer="true" v-model="userSelect" class="select" >
                        <Option  value="0" >全部</Option>
                        <Option  v-for="item in userData" :value="item.mid" :key="item.mid" >{{ item.mDepName }}</Option>
                    </Select >
                </div>
                <div class="div">
                    <label class="label">起始日期</label>
                    <DatePicker :options='options' :value='startDate' placement="bottom-end" placeholder="选择日期" @on-change='dateFormatStart'></DatePicker>
                </div>
                <div class="div">
                    <label class="label">截止日期</label>
                    <DatePicker :options='options' :value='endDate' placement="bottom-end" placeholder="选择日期" @on-change='dateFormatEnd'></DatePicker>
                </div>
                <Button type="primary" @click="btnCheck" icon="ios-search">统计</Button>
                <Button type="primary" icon="social-dropbox-outline" @click="clearSelect">清空条件</Button>
            </div> 
        </card>
        <card class="margin-bottom-10">
            <Table class="margin-bottom-10" size="small" border  style="min-height:350px;" :columns="columns" :data="statData"></Table>
            <div>
                <Page :total="total" :current="pageCurrent" @on-change="changePage" @on-page-size-change="changePageSize" placement="top" show-elevator show-sizer></Page>
            </div>
        </card>
    </div>
</template>
<script>
import base from '@/libs/base';

 export default {
        data () {
            return {
                startDate:'',       // 入库起始日期
                endDate:'',                 // 入库截止日期
                materiaDecideModal: false,   // 原料复验判定模态框
                materiaCheckModal: false,    // 原料复验验收模态框
                materiaSelect: '',   // 原料下拉框
                supplierSelect: '0',         // 供货单位下拉框
                userSelect: '0',              // 使用单位下来框
                materiaData: [],             // 第一个select下拉列表数据
                statData: [],                // 表格数据
                supplierData:[],             // 第二个select下拉列表数据
                userData:[],                 // 第三个select下拉列表数据
                filtStateData:[],            // 筛选状态数据
                total: 100,                  // 数据总条数
                pageCurrent: 1,              // 当前页码
                pageSize: 10,                // 每页显示条数
                skip: 0,                     // 当前获取索引
                options:{
                    disabledDate(date){
                        return date.valueOf() > Date.now();
                    }
                },
                newDate : '',
                columns: [                   // 表格表头/列信息
                    {key: "wpPinMin", title: "品名",align: 'center',width: 200},
                    {key: "inTotalWeight", title: "入库重量",align: 'center'},
                    {key: "inTotaNum", title: "入库支数",align: 'center'},
                    {key: "offInTotalWeight", title: "冲红入库重量",align: 'center',width: 113},
                    {key: "offInTotalNum", title: "冲红入库支数",align: 'center',width: 110},
                    {key: "outTotalWeight", title: "出库重量",align: 'center'},
                    {key: "outTotalNum", title: "出库支数",align: 'center'},
                    {key: "offOutTotalWeight", title: "冲红出库重量",align: 'center',width: 120},
                    {key: "offOutTotalNum", title: "冲红出库支数",align: 'center',width: 120},
                    {key: "balanceWeight", title: "库存重量",align: 'center'},
                    {key: "balanceNum", title: "库存支数",align: 'center'},
                ]
            }
        },
        methods: {
            //日期范围
            dateFormatStart(val){
                this.startDate = val;
            },
            dateFormatEnd(val){
                this.endDate = val;
            },
           // 统计
            check(skip, take){
                let _self = this;
                let para = {};
                
                para.Skip = skip;
                para.Take = take;

                para.pUID = '123';
                if(this.materiaSelect) {
                    para.pCp_Type =  this.materiaSelect;
                    para.yL_TyID = this.materiaSelect;
                }
                if(this.supplierSelect) para.pSupCmp_ID = this.supplierSelect;
                if(this.userSelect) para.pUseCmp_ID = this.userSelect;
                if(this.startDate) para.pStartDate = this.startDate;
                if(this.endDate) para.pEndDate = this.endDate;
                base.ajaxData('/WlCenter/Yl_InOutManageReportParm', para, 'GET', (e) => {
                    if(e.Results[0].Flag == "Y"){
                        if(this.materiaSelect){
                            if(this.materiaSelect == "0") {
                                para = {Skip: skip, Take: take, pUID: "123"}
                            }else{
                                para.yL_TyID = this.materiaSelect;
                            }
                        }
                        base.ajaxData('/WlCenter/Yl_InOutManageReport_view', para, 'GET', (e) => {
                            this.statData = e.results;
                            this.total = e.total;
                        }); 
                    }
                    if(e.Results[0].Flag == "N"){
                        this.$Message.error({duration: 3, content:'请重新选择筛选条件'});

                    }
                });
            },
           
            btnCheck(skip, take) {
                this.pageCurrent = 1;
                this.check(0, this.pageSize);
            },
            // 改变页码时
            changePage (index) {
                this.pageCurrent = index;
                let _size = this.pageSize;
                this.skip = (index-1)*_size;
                this.check(this.skip ,_size);
            },
            // 改变每页显示条数时
            changePageSize (size) {
                this.pageSize = size;
                this.check(this.skip, size);
            },
            // 表单重置
            clearSelect () {
                // this.$refs[name].resetFields();
                this.materiaSelect = this.materiaData[0].wp_ID;        
                this.supplierSelect = '0';       
                this.userSelect = '0';        
                this.startDate = this.newDate;      
                this.endDate = base.dateFormat(new Date());                  
            }
        },
        // 获取数据
        mounted () {
            // 原料下拉列表数据
            base.getAjaxData(base.baseURL+'/PublicApi/Bs_goodsinfo_view?Wp_IDStartsWith=107',(e)=>{
                this.materiaData = e.results;
                this.materiaSelect = this.materiaData[0].wp_ID;
                this.check(this.skip, this.pageSize);
            });
            // 供货单位下拉列表数据
            base.getAjaxData(base.baseURL+'/PublicApi/Bs_comminfo_view?Comm_IDStartsWith=100',(e)=>{
                this.supplierData = e.results;
                // this.supplierSelect = this.supplierData[0].comm_ID;
                });
            // 使用单位下拉列表数据
            base.getAjaxData(base.baseURL+'/PublicApi/Bs_commdep0_view',(e)=>{
                this.userData = e.results;
                // this.userSelect = this.userData[0].mid;
                
            });

            let date = new Date();
            let day = date.getDate();
            let year = date.getFullYear();
            let month = date.getMonth();
            if(month == 0){
                month = 12;
                year = year - 1;
            }
            this.newDate = year + '-' + month + '-' + day;
            this.endDate =  base.dateFormat(new Date());
            this.startDate = this.newDate;
        }
    }
</script>
