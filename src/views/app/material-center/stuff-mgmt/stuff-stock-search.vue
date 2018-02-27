<style lang="less" >
</style>
<template>
    <div class="">
        <card class="margin-bottom-10 padding-top-bottom-minish">
            <div class="select-col " >
                <div class="div">
                    <label class="label">供货单位</label>
                    <Select v-model="office"  class="select">
                        <Option :value="0">全部</Option>
                        <Option v-for="item in offerCmpList" :value="item.comm_ID" :key="item.subClass_Value">{{ item.subClass_Value }}</Option>
                    </Select>
                </div>
                <div class="div">
                    <label class="label">使用单位</label>
                    <Select v-model="use"  class="select">
                        <Option :value="0">全部</Option>
                        <Option v-for="item in useCmpList" :value="item.departmentId" :key="item.departmentId">{{ item.name }}</Option>
                    </Select>
                </div>
                <div class="div">
                    <label class="label">材料品名</label>
                    <Input v-model="stuffName" placeholder="请输入材料品名" class="select"></Input>
                </div>
                <div class="div">
                    <label class="label">材料编号</label>
                    <Input v-model="stuffNumber" placeholder="请输入材料编号" class="select"></Input>
                </div>
                <div class="div">
                    <label class="label">起始日期</label>
                    <DatePicker :options='options' :value="startDate" placement="bottom-end" placeholder="选择日期" class="select" @on-change="dateStrat"></DatePicker>
                </div>
                <div class="div">
                    <label class="label">截止日期</label>
                    <DatePicker :options='options' :value="endDate" placement="bottom-end" placeholder="选择日期" class="select" @on-change="dateEnd"> </DatePicker>
                </div>
                <Button type="primary" @click="btnCheck" icon="ios-search">统计</Button>
                <Button type="primary" icon="social-dropbox-outline" @click="clearSelect">清空</Button>        
                <Button type="primary" icon="ios-upload">导出Excel</Button>
            </div> 
        </card>
        <card class="margin-bottom-10">
            <Table class="margin-bottom-10" size="small" border  style="min-height:400px;" :columns="columns" :data="statData"></Table>
        </card>
    </div>
</template>
<script>
import base from '@/libs/base';

 export default {
        data () {
            return {
                use: 0,
                useCmpList: [],
                offerCmpList: [],
                office: 0,
                startDate: '',
                endDate: '',         
                statData: [],                // 表格数据
                supplierData: [],            
                userData: [],                 
                stuffName: '',
                stuffNumber: '',
                total: 100,                  // 数据总条数
                pageCurrent: 1,              // 当前页码
                pageSize: 10,                // 每页显示条数
                skip: 0,                     // 当前获取索引
                options:{
                    disabledDate(date){
                        return date.valueOf() > Date.now();
                    }
                },
                columns: [                   // 表格表头/列信息
                    {key: "SubClass_Value",title: "编码",align: 'center',ellipsis:true},
                    {key: "SubClass_Value", title: "品名",align: 'center',width: 220,ellipsis:true},
                    {key: "SubClass_Value",title: "规格",align: 'center',ellipsis:true},
                    {key: "SubClass_Value",title: "单位",align: 'center',ellipsis:true},
                    {key: "ShouPoundWeight", title: "入库量",align: 'center',ellipsis:true},
                    {key: "ShouNumber", title: "出库量",align: 'center',ellipsis:true},
                    {key: "FaPoundWeight", title: "库存结存",align: 'center',ellipsis:true},
                ]
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
            check(skip, take){
                let _self = this;
                let para = {};
                
                para.Skip = skip;
                para.Take = take;

                if(this.office) para.YL_TyID =  this.materiaSelect;
                if(this.use) para.YLSupCmp_ID = this.use;
                if(this.stuffName) para.YLUseCmp_ID = this.stuffName;
                if(this.stuffNumber) para.StartArrivalGoodsDate = this.stuffNumber;
                if(this.startDate) para.endArrivalGoodsDate = this.startDate;
                if(this.endDate) para.endArrivalGoodsDate = this.endDate;

                base.ajaxData('WlCenter/Yl_Arr_ShouFaTJ_viewParm', para, 'GET', (e) => {
                    _self.statData = e.Results;
                    _self.total = e.Total;
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
                this.office = '0';        
                this.use = '0';   
                this.stuffNumber = '';   
                this.stuffName = '';   
                this.startDate = '';      
                this.endDate = '';                  
            }
        },
        // 获取数据
        mounted () {
            // 表格获取的全部数据
            let _self = this;
            this.check(this.skip, this.pageSize);
            let departArray = [];
            let offerArray = [];
            // 使用单位
            base.ajaxData('/PublicApi/Sys_Deparment', {}, 'GET', (e) => {
                if(e.results.length > 0){
                    e.results.forEach((item) => {
                        departArray.push({departmentId:item.departmentId,name:item.name})
                    })
                    this.useCmpList = departArray;
                }
            });
            // 供货单位
            base.ajaxData('PublicApi/Bs_comminfo_view?Comm_IDStartsWith=101', {}, 'GET', (e) => {
                if(e.results.length > 0){
                    e.results.forEach((item) => {
                        offerArray.push({comm_ID:item.comm_ID,subClass_Value:item.subClass_Value});
                   });
                   this.offerCmpList = offerArray;
                }
            });
        }
    }
</script>
