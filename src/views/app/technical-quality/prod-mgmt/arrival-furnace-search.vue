<style lang="less">
</style>

<template>
	<div class="table-component-common">
        <card class="margin-bottom-10 margin-top-10 padding-top-bottom-minish">
            <div class="select-col">
                <div class="div">
                    <label align="middle" class="label">原料</label>
                    <Select v-model="material" class="select li-width">
                        <Option v-for="item in goodsList" :value="item.id" :key="item.value">{{item.value}}</Option>
                    </Select>
                </div>
                <div class="div">
                    <label class="label">供货单位</label>
                    <Select v-model="office" class="select">
                        <Option v-for="item in offerCmpList" :value="item.id" :key="item.value">{{ item.value }}</Option>
                    </Select>
                </div>
                <div class="div">
                    <label class="label">使用单位</label>
                    <Select v-model="user" class="select">
                        <Option v-for="item in useCmpList" :value="item.id" :key="item.value">{{ item.value }}</Option>
                    </Select>
                </div>
                <div class="div">
                    <label class="label">炉号</label>
                    <Input v-model="furnaceNo" placeholder="请输入炉号" class="select"></Input>
                </div>
                <div class="div">
                    <label class="label">起始日期</label>
                    <DatePicker :options="options" placement="bottom-end" placeholder="选择日期" :value="startDate" @on-change="dateStrat"></DatePicker>
                </div>
                <div class="div">
                    <label class="label">截止日期</label>
                    <DatePicker :options="options" placement="bottom-end" placeholder="选择日期" :value="endDate" @on-change="dateEnd"></DatePicker>
                </div>
                <Button type="primary" icon="ios-search" @click="btnQuery()" >查询</Button>
                <Button type="primary" icon="social-dropbox-outline" @click="clearQuery()">清空</Button>
            </div>
		</card>
        <card>
            <Table class="fontSize margin-bottom-10" size="small" border :loading='isLoading' :data="data" :columns="columns" stripe ref="table2image" ></Table>
            <Page :total="total" :current="pageCurrent" @on-change="changePage" @on-page-size-change="changePageSize" show-elevator show-sizer placement='top' :transfer="true"></Page>
        </card>
	</div>
</template>
<script>
import base from '@/libs/base';

export default {
    data () {
        return {
                columns: [//首页显示表格的列
                    {title: '品名',key: 'cWpPinMin',align:"center",width: 225},
                    {title: '供货单位', key: 'cylSupCmpName',align:"center"},
                    {title: '使用单位', key: 'cylUseCmpName',align:"center"},
                    {title: '炉号', key: 'zFurnaceNo', align:"center"},
                    {title: '批次',key: 'zBatch',align:"center"},
                    {title: '支数',key: 'zNumber',align:"center"},
                    {title: '重量（吨）',key: 'zWeight',align:"center"},
                    {title: '库区',key: 'zStoreArea',align:"center"},
                    {title: '日期',key: 'zArrivalGoodsDate',align:"center"}
                ],
                data: [],//获取主页列表的数据
                total:0,//总条数
                pageCurrent: 1,//当前页码
                pageSize: 10,//页面大小
                materialList:[],//原料筛选列表
                material:'',//选中的材料
                officeList:[],//供货单位列表
                office:0,//选中的供货单位
                userList:[],//使用单位列表
                user:0,//选中的使用单位
                isLoading:false,
                //主页面
                today:'',
                furnaceNo:'',
                startDate:'',
                endDate:'',
                options:{//日期选项
                    disabledDate(date){
                        return date.valueOf() > Date.now();
                    }
                },
                //录入界面
                goodsList:[],//品名列表
                offerCmpList:[],//供货单位列表
                useCmpList:[],//使用单位列表
                YLName:'', //原料名显示
                upYLName:''
            }
    },
    computed:{
        //单号填充
        billNumFull(){
            let str = this.toStoreBill.Bill_ID;
            str = str ? str + '' : '';
            let len = str.length;
            for(var i = len; i<6;i++){
                str = '0' + str;
            }
            return str;
        },
    },
    methods: {
        //日期范围
        dateFormatStart(val){
            this.dateRange.start = val;
        },
        dateFormatEnd(val){
            this.dateRange.end = val;
        },
        /**
         * 改变页数时的函数
         */
        changePage (index) {
            // 这里直接更改了模拟的数据，真实使用场景应该从服务端获取数据
            this.pageCurrent = index;
            let _size = this.pageSize;
            let _skip = (index-1)*_size;
            this.query(_skip, _size);
        },
        //改变页显示数时的函数
        changePageSize (size) {
            this.pageSize = size;
            let _current = this.pageCurrent;
            let _skip = (_current-1)*size;
            this.query(_skip, size);
        },
        btnQuery(){
            this.pageCurrent = 1;
            this.query(0, this.pageSize);
        },
        

        query(skip,take){
            this.isLoading = true;
            let _self = this;
            let para = {};
            para.Skip = skip;
            para.Take = this.pageSize;
            // if(this.filtStateSelect) para.ZInOutStats = this.filtStateSelect;
            if(this.material) {
                para.zyL_TyID = this.material;
            }
            if(this.office) {
                para.zylSupCmp_ID = this.office;
            }
            if(this.user) {
                para.zylUseCmp_ID = this.user;
            }
            if(this.furnaceNo) {
                para.zFurnaceNoContains = this.furnaceNo;
            }
            
            if(this.startDate) para['>zArrivalGoodsDate='] = base.dateFormat(this.startDate);
            if(this.endDate) para['zArrivalGoodsDate<='] = base.dateFormat(this.endDate);
            if(this.startDate && this.endDate) para.ZArrivalGoodsDateBetween = base.dateFormat(this.startDate) + ',' + base.dateFormat(this.endDate);

            base.ajaxData('WlCenter/Yl_Arrivalrecfind_view', para, 'GET', (e) => {
                e.results.forEach((item) => {
                    if(item.zArrivalGoodsDate) item.zArrivalGoodsDate = item.zArrivalGoodsDate.substring(0,10);
                })
                    _self.data = e.results;
                    this.isLoading = false;
                    _self.total = e.total;
                });
        },
        //清空查询条件
        clearQuery(){
                this.office = 0;
                this.user = 0;
                this.furnaceNo = '';
                this.startDate = '';
                this.endDate = '';
        },
         dateStrat(val){
            this.startDate = val;
        },
        dateEnd(val){
            this.endDate = val;
        },
        init(){
            //数据初始化
            this.changePage(this.pageCurrent);
        }
    },
    created(){
        // 添加筛选选项的列表
        this.goodsList=[];
        this.offerCmpList=[];
        this.useCmpList=[];
        const all = {id:0,value:'全部'}
        base.getAjaxData(base.baseURL + 'PublicApi/bs_goodsinfo_view',(bsGoods) =>{
            bsGoods.results.forEach((item) => {
                if(item.isEnable && item.pinMing && item.wp_ID){
                    this.goodsList.push({id:item.wp_ID,value:item.pinMing});
                }
            })
            if(!this.material)this.material = this.goodsList[0].id;

            //公共信息类
            base.getAjaxData(base.baseURL + 'PublicApi/bs_comminfo_view',(res) =>{
                res.results.forEach((item) => {
                    if(item.comm_ID){
                        let temp = item.comm_ID.substring(0,3);
                        if(item.isEnable && item.subClass_Value){
                            if(temp == 100)this.offerCmpList.push({id:item.comm_ID,value:item.subClass_Value});
                        }
                    }
                })
                this.offerCmpList.unshift(all);
                this.init();
            });
            base.getAjaxData(base.baseURL + 'PublicApi/Bs_commdep0_view',(res) =>{
                res.results.forEach((item) => {
                    if(item.mChildDepID){
                        this.useCmpList.push({id:item.mChildDepID.substring(0,1),value:item.mDepName});
                    }
                })
                this.useCmpList.unshift(all);
                this.init();
            });
        });
    }
};
</script>