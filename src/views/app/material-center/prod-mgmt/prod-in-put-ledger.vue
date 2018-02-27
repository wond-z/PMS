<style lang="less">
</style>

<template>
	<div class="table-component-common">
        <Button type="primary" icon="ios-upload" @click="clearCheck()">导出Excel</Button>
        <Button type="primary" icon="chevron-down" v-show="!isShow" @click="show()">高级选项</Button>
        <Button type="primary" icon="chevron-up" v-show="isShow" @click="show()">高级选项</Button>
        <Button type="primary" icon="ios-upload" @click="clearCheck()">清空条件</Button>
        <card class="padding-top-bottom-minish margin-top-10">
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
                        <Option :value="0">全部</Option>
                        <Option v-for="item in offerCmpList" :value="item.mid" :key="item.mid">{{ item.mDepName }}</Option>
                    </Select>
                </div>    
                <div class="div">
                    <label class="label">起始序号</label>
                    <Input v-model="startSeqNum" placeholder="请输入起始序号" class="select"></Input>
                </div>
                <div class="div">
                    <label class="label">截止序号</label>
                    <Input v-model="endSeqNum" placeholder="请输入截止序号" class="select"></Input>
                </div>
                <Button type="primary" v-show="!isShow" icon="ios-search" @click="btnCheck()" >查询统计</Button>
            </div>
            <div class="select-col" v-show="isShow">
                <div class="div">
                    <label class="label">原料供货</label>
                    <Select v-model="user"  class="select">
                        <Option :value="0">全部</Option>
                        <Option v-for="item in useCmpList" :value="item.id" :key="item.value">{{ item.value }}</Option>
                    </Select>
                </div>
                <div class="div">
                    <label class="label">订货单位</label>
                    <Select v-model="order"  class="select">
                        <Option :value="0">全部</Option>
                        <Option v-for="item in orderCmpList" :value="item.id" :key="item.value">{{ item.value }}</Option>
                    </Select>
                </div>
                <div class="div">
                    <label class="label">起始捆号</label>
                    <Input v-model="startBundleNo" placeholder="请输入起始捆号" class="select"></Input>
                </div>
                <div class="div">
                    <label class="label">截止捆号</label>
                    <Input v-model="endBundleNo" placeholder="请输入起始捆号" class="select"></Input>
                </div>
                <div class="div">
                    <label class="label">入库日期</label>
                    <DatePicker placement="bottom-end" :options="options" placeholder="选择日期" :value="inStartDate" @on-change='inDateFormatStart'></DatePicker>
                </div>
                <div class="div">
                    <label class="label">至</label>
                    <DatePicker placement="bottom-end" :options="options" placeholder="选择日期" :value="inEndDate" @on-change='inDateFormatEnd'></DatePicker>
                </div>
                <div class="div">
                    <label class="label">出库日期</label>
                    <DatePicker placement="bottom-end" :options="options" placeholder="选择日期" :value="outStartDate" @on-change='outDateFormatStart'></DatePicker>
                </div>
                <div class="div">
                    <label class="label">至</label>
                    <DatePicker placement="bottom-end" :options="options" placeholder="选择日期" :value="outEndDate" @on-change='outDateFormatEnd'></DatePicker>
                </div>
                <Button type="primary" icon="ios-search" @click="btnCheck()" >查询统计</Button>
            </div>
        </card>
        <card class="margin-top-10">
			<div class="margin-bottom-10" >
	            <Table size="small" border :loading='isLoading' :data="data" :columns="columns" stripe></Table>
	        </div>
            <Page :total="total" :current="pageCurrent" @on-change="changePage" @on-page-size-change="changePageSize" show-elevator show-sizer placement='top' :transfer="true"></Page>
        </card>
	</div>
</template>
<script>
import base from '@/libs/base';

export default {
    data () {
        return {
            isLoading: false,
            columns: [
                {title: '原料供货', key: 'bcYLSupCmpName',align:"center",width: 100,},
                {title: '入库序号', key: 'cpoInStoreSeq_Num',align:"center",width: 80},
                {title: '入库日期',key: 'cpoInStoreDate',align:"center",width: 100},
                {title: '炉号', key: 'zFurnaceNo', align:"center",width: 100},
                {title: '支数', key: 'zNumber',align:"center",width: 80},
                {title: '捆编号',key: 'zBundleNo',align:"center",width: 100, render: (h, para) => {
                    let str = para.row.zBundleNo.toString();
                    return str.substring(0, 4) + '-' + str.substring(4, 8);
                }},
                {title: '捆重量',key: 'zWeight',align:"center",width: 80},
                {title: '捆长度',key: 'zLength',align:"center",width: 80},
                {title: '库区', key: 'cpoStoreArea',align:"center",width: 80},
                {title: '生产日期',key: 'cpoInStoreDate',align:"center",width: 100},
                {title: '订货单位',key: 'cmoOrderGdCmp',align:"center",width: 100},
                {title: '出库序号', key: 'cmoOutStoreSeq_Num', align:"center",width: 80},
                {title: '出库日期',key: 'cmoOutStoreDate',align:"center",width: 100, render: (h, para) => {
                    var date = para.row.cmoOutStoreDate.substring(0, 10);
                    var tem = date == '0001-01-01' ? '' : date;
                    return tem;
                }},
                {title: '发运方式', key: 'cmoTransportModeName',align:"center",width:100},
            ],
            data: [],                        //获取主页列表的数据
            total: 0,                        //总条数
            pageCurrent: 1,                  //当前页码
            pageSize: 10,                    //页面大小
            material: '',                    //选中的材料
            office: 0,                       //选中的供货单位
            user: 0,                         //选中的使用单位
            order: 0,
            startSeqNum: '',                 // 起始序号
            endSeqNum:'',                    // 截止序号
            startBundleNo: '',
            endBundleNo: '',
            FurnaceNoInput: '',              //炉号 筛选条件
            BundleWeight: '',                // 筛选条件 捆重量
            BundleLenght: '',                // 筛选条件 捆长度
            inStartDate: '',
            inEndDate: '',   
            outStartDate: '',
            outEndDate: '',   
            options: {                       //日期选项
                disabledDate(date){
                    return date.valueOf() > Date.now();
                }
            },
            goodsList: [],                   //品名列表
            orderCmpList: [],                
            useCmpList: [],       
            offerCmpList: [] ,  
            isShow: false,
        }
    },
    computed:{
        
    },
    methods: {
        show(){
            if(this.isShow == false){
                this.isShow = true;
            }else if(this.isShow == true){
                this.isShow = false
            }
        },
        //日期范围
        inDateFormatStart(val){
            this.inStartDate = val;
        },
        inDateFormatEnd(val){
            this.inEndDate = val;
        },
        outDateFormatStart(val){
            this.outStartDate = val;
        },
        outDateFormatEnd(val){
            this.outEndDate = val;
        },
        /**
         * 改变页数时的函数
         */
        changePage (index) {
            this.pageCurrent = index;
            let _size = this.pageSize;
            this.skip = (index - 1) * _size;
            this.check(this.skip, _size);
        },
        changePageSize (size) {
            this.pageSize = size;
            this.check(this.skip, size);
        },
        btnCheck(){
            this.pageCurrent = 1;
            this.check(0, this.pageSize);
        },
        //查询函数
        check(skip,take){
            let _self = this;
            let para = {};

            para.Skip = skip;
            para.Take = this.pageSize;
            para.orderByDesc='CpoInStoreDate';
            para['>DecisionStatus'] = 3;

            if(this.material) para.zcP_TyID = this.material;
            if(this.office) para.ZCpProdCmp_ID = this.office;
            if(this.user) para.zylSupCmp_ID = this.user;
            if(this.order) para.cmoOrderGdCmp = this.order;
            if(this.BundleWeight) para.zWeight = this.BundleWeight;
            if(this.BundleLenght) para.zLength = this.BundleLenght;

            // 入库日期
            if(this.inStartDate) para['>cpoInStoreDate'] = this.inStartDate;
            if(this.inEndDate) para['cpoInStoreDate<'] = this.inEndDate;
            if(this.inStartDate && this.inEndDate) para.cpoInStoreDateBetween = this.inStartDate + ',' + this.inEndDate;
            // 出库日期
            if(this.outStartDate) para['>cmoOutStoreDate'] = this.outStartDate;
            if(this.outEndDate) para['cmoOutStoreDate<'] = this.outEndDate;
            if(this.outStartDate && this.outEndDate) para.cmoOutStoreDateBetween = this.outStartDate + ',' + this.outEndDate;
            // 捆编号
            if(this.startBundleNo) para['>zBundleNo'] = this.startBundleNo;
            if(this.endBundleNo) para['zBundleNo<'] = this.endBundleNo;
            if(this.startBundleNo && this.endBundleNo) para.zBundleNoBetween = this.startBundleNo + ',' + this.endBundleNo;
            // 序号
            if(this.startSeqNum) para['>cpoInStoreSeq_Num'] = this.startSeqNum;
            if(this.endSeqNum) para['cpoInStoreSeq_Num<'] = this.endSeqNum;
            if(this.startSeqNum && this.endSeqNum) para.cpoInStoreSeq_NumBetween = this.startSeqNum + ',' + this.endSeqNum;

            base.ajaxData('/FCManage/Cp_ProdStoreRec_view?>DecisionStatus=3', para, 'GET', (res) => {
                if(res.results){
                    res.results.forEach( (item) => {
                        if(item.cpoInStoreDate) item.cpoInStoreDate = item.cpoInStoreDate.substring(0,10);
                        if(item.cmoOutStoreDate) item.cmoOutStoreDate = item.cmoOutStoreDate.substring(0,10);
                    });
                    this.data = res.results;
                    this.isLoading = false;
                }
                this.total = res.total;
            });
        },
        //清空查询条件
        clearCheck(){
                this.office = 0;
                this.user = 0;
                this.order = 0;
                this.startSeqNum = '';
                this.endSeqNum = '';
                this.startBundleNo = '';
                this.endBundleNo = '';
        },
        init(){
            this.check(this.skip,this.take)
        }
    },
    created(){
        // 添加筛选选项的列表
        this.orderCmpList = [];
        this.useCmpList = [];
        this.offerCmpList = [];
        
        base.getGoodsList(this,108);
        base.getAjaxData(base.baseURL + 'PublicApi/bs_comminfo_view',(res) =>{
            res.results.forEach((item) => {
                if(item.comm_ID){
                    let temp = item.comm_ID.substring(0,3);
                    if(item.subClass_Value){
                        if(temp == 100)this.useCmpList.push({id:item.comm_ID,value:item.subClass_Value});
                        if(temp == 102)this.orderCmpList.push({id:item.comm_ID,value:item.subClass_Value});
                    }
                }
            })
        });
        base.getAjaxData(base.baseURL + 'PublicApi/Bs_commdep1_view',(res) =>{
            this.offerCmpList = res.results;
        });
    }
};
</script>

               
