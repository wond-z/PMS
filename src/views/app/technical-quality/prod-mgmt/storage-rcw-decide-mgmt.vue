<style lang="less">
</style>

<template>
	 <div class="table-component-common">
        <card class="margin-bottom-10 margin-top-10 padding-top-bottom-minish">
            <div class="select-col">
                <div class="div">
                    <label class="label">产品类别</label>
                    <Select v-model="material" class="select li-width" >
                        <Option  v-for="item in goodsList" :value="item.id " :key="item.id ">{{ item.value }}</Option> 
                    </Select>
                </div>
                <div class="div">
                    <label class="label">生产单位</label>
                    <Select :transfer="true" v-model="unitSelectId" class="select">
                        <Option  :value="0">全部</Option>
                        <Option  v-for="item in useCmpList" :value="item.id" :key="item.id">{{item.value}}</Option>
                    </Select>
                </div>
                <div class="div">
                    <label class="label">入库序号</label>
                    <Input  class="select" v-model="storageNum" placeholder="请输入入库序号" ></Input>
                </div>
                <div class="div">
                    <label class="label">捆编号</label>
                    <Input  class="select" v-model="bundleNo" placeholder="请输入捆编号" ></Input>
                </div>
                <div class="div">
                    <label class="label">原料供货</label>
                    <Select :transfer="true" v-model="supplySelectId" class="select">
                        <Option  :value="0" >全部</Option>
                        <Option  v-for="item in offerCmpList" :value="item.id" :key="item.id" >{{ item.value }}</Option>
                    </Select>
                </div>
                <div class="div">
                    <label class="label">判定状态</label>
                    <Select v-model="state" class="select">
                        <Option  :value="0">全部</Option>
                        <Option v-for="item in statesList" :value="item.num" :key="item.value">{{ item.value }}</Option>
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
                <Button type="primary" icon="ios-search" @click="btnCheck()" >查询</Button>    
                <Button type="primary" icon="ios-upload" @click="clearQuery()">清空</Button>
            </div>
		</card>
        <card>
			<div class="margin-bottom-10" >
	            <Table class="fontSize" size="small" border :data="data" :columns="columns" stripe ref="table2image"></Table>
	        </div>
            <Page ref='page' :total="total" :current="pageCurrent" @on-change="changePage" @on-page-size-change="changePageSize" show-elevator show-sizer placement='top'></Page>
        </card>
	</div>
</template>
<script>
import base from '@/libs/base';

export default {
    data () {
        return {
            bundleNo: '',
            material: '',          // 产品类别下拉框id
            unitSelectId: 0,
            endDate: '',
            startDate: '',
            storageNum: '',    
            //模态框控制
            columns: [                   // 表格表头/列信息
                    {title: '捆编号',key: 'cpcBundleNo',align:"center", ellipsis: true,},
                    {title: '产品类别',key: 'bgWuPinMin',align:"center", ellipsis: true},
                    {title: '生产分厂', key: 'depCpProdCmp',align:"center", ellipsis: true},
                    {title: '原料供货', key: 'bcYLSupCmp',align:"center", ellipsis: true},
                    {title: '炉号', key: 'cpcFurnaceNo', align:"center", ellipsis: true},
                    {title: '捆重量',key: 'cpcWeight',align:"center", ellipsis: true},
                    {title: '捆长度',key: 'cpcLength',align:"center", ellipsis: true},
                    {title: '支数', key: 'cpcNumber',align:"center", ellipsis: true},
                    {title: '入库序号', key: 'cpeSeq_Num',align:"center", ellipsis: true},
                    {title: '冲红日期',key: 'zOffsetDate',align:"center", ellipsis: true},
                    {title: '冲红状态', key: 'cpeOffsetStatusN', align:"center"},
                    {title: '判定状态', key: 'zOffSetDecisionStatusN',align:"center"},
                    {title: '检定日期', key: 'zOffSetDecisionDate', align:"center"},
                    {title: '是否合格', key: 'zOffSetDecisionStatus', align:"center",
                        render: (h, params) => {
                            return h('div', {}, [
                                h('i-switch', {
                                    props: {
                                        value:params.row.zOffSetDecisionStatus < 3 ? false : true,
                                    },
                                    on: {
                                        'on-change': (val) => {
                                            this.isQuality(params.row, val);
                                        }
                                    },
                                }, [
                                    h('span',{
                                        slot: 'open',
                                    },"是"),
                                    h('span',{
                                    slot: 'close',
                                    },"否")
                                ])
                            ]);
                        }
                    },
                ],
            data: [],//获取主页列表的数据
            total: 0,//总条数
            pageCurrent: 1,//当前页码
            pageSize: 10,//页面大小
            //主页面
            options: {
                disabledDate(date){
                    return date.valueOf() > Date.now();
                }
            },
            state: 0,
            goodsList: [],//品名列表
            offerCmpList: [],//供货单位列表
            useCmpList: [],//使用单位列表
            supplySelectId: 0,
            statesList: [//状态列表
                // {num:0,value:'显示全部记录'},
                {num:3,value:'合格'},
                {num:2,value:'不合格'},
            ],
            today: ''
        }
    },
    methods: {
        dateStrat(val){
            this.startDate = val;
        },
        dateEnd(val){
            this.endDate = val;
        },
        //查询函数
        check(skip,take){
            let _self = this;
            let para = {};
            
            para.Skip = skip;
            para.Take = this.pageSize;

            para.orderByDesc = 'zOffsetDate';
            
            if(this.material) para.cpeCP_TyID = this.material;
            if(this.unitSelectId) para.cpeCpProdCmp_ID = this.unitSelectId;
            if(this.bundleNo) para.cpcBundleNo = this.bundleNo;
            if(this.state)  para.zOffSetDecisionStatus = this.state;
            if(this.storageNum) para.cpeSeq_Num = this.storageNum;
            if(this.supplySelectId) para.cpeYLSupCmp_ID = this.supplySelectId;
            if(this.startDate) para['>zOffsetDate'] = this.startDate;
            if(this.endDate) para['zOffsetDate<'] = this.endDate;
            if(this.startDate && this.endDate) para.zOffsetDateBetween = this.startDate + ',' + this.endDate;

            base.ajaxData('/WlCenter/Cp_offsetmanage_view?>ZOffSetDecisionStatus=2', para, 'GET', (e) => {
                if(e.results){
                    e.results.forEach((item) => {
                        if(item.zOffsetDate) item.zOffsetDate = item.zOffsetDate.substring(0,10);
                        if(item.zOffSetDecisionDate) item.zOffSetDecisionDate = item.zOffSetDecisionDate.substring(0,10);
                    })
                    this.data = e.results;
                    this.total = e.total;
                }
            });
        },
        isQuality(data, val){
            let _self = this;
            base.ajaxData('/WlCenter/Cp_offsetmanage', {ID: data.zid}, 'GET', (g) => {
                let res = g.results[0];
                // 更新主表数据
                if (val == true) {
                    res.decisionStatus = 3;
                    res.decisionDate = this.today;
                    base.ajaxData('/WlCenter/Cp_offsetmanage', res, 'PUT', (k) => {
                        if (k.errMsg == 'ok') {
                            this.$Message.info('判断合格成功！');
                            this.init();
                        } else {
                            this.$Message.error({duration: 5, content: '取消合格失败，请重试！'});
                            this.init();
                        }
                    });
                } else {
                    res.decisionStatus = 2;
                    res.decisionDate = '0001-01-01';
                    base.ajaxData('/WlCenter/Cp_offsetmanage', res, 'PUT', (k) => {
                        if (k.errMsg == 'ok') {
                            this.$Message.info('取消合格！');
                            this.init();
                        } else {
                            this.$Message.error({duration: 5, content: '取消合格失败，请重试！'});
                            this.init();
                        }
                    });
                }
            });
        },
        /**
         * 改变页数时的函数
         */
        clearQuery(){
            this.unitSelectId = 0;
            this.storageNum = '';
            this.supplySelectId = 0;
            this.bundleNo = '';
            this.startDate = '';
            this.endDate = '';
        },
        btnCheck() {
            this.pageCurrent = 1;
            this.check(0, this.pageSize);
        },
        // 分页
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
        //关闭模态框
        handleClose(modal){
            this[modal] = false;
        },
        // 初始化
        init(){
            this.changePage(this.pageCurrent);
        }
    },
    mounted () {
        this.today = base.dateFormat(new Date());
    },
    created(){
        //物品信息
        base.getGoodsList(this,108);
        this.offerCmpList=[];
        this.useCmpList=[];
        //公共信息类
        base.getAjaxData(base.baseURL + 'PublicApi/bs_comminfo_view',(res) =>{
            res.results.forEach((item) => {
                if(item.isEnable && item.subClass_Value && item.comm_ID){
                    let temp = item.comm_ID.substring(0,3);
                    if(temp == 100)this.offerCmpList.push({id:item.comm_ID,value:item.subClass_Value});
                }
            })
        });
        base.getAjaxData(base.baseURL + 'PublicApi/Bs_commdep1_view',(res) =>{
            res.results.forEach((item) => {
                if(item.mid){
                    if(item.isEnable==1 && item.mDepName){
                        this.useCmpList.push({id:String(item.mid),value:item.mDepName});
                    }
                }
            })
        });
    }
};
</script>
