<style lang="less" >
   @import './prod-mgmt-common.less';

</style>

<template>
    <div class="table-component-common">
        <div class="margin-bottom-10">
            <div>
                <Button type="primary" @click="offsetModal=true" icon="plus">冲红</Button>
                <Button type="primary" :disabled="!isToCheck" @click="toCheck" icon="reply">送检</Button>
                <Button type="primary" :disabled="!isToCancelCheck" @click="toCancelCheck" icon="forward">取消送检</Button>
                <Button type="primary" :disabled = '!isToDelete' @click="remove(selectedId)" icon="trash-a">删除</Button>
            </div>
        </div>
        <card class="margin-bottom-10 padding-top-bottom-minish">
            <div class="select-col" >
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
                    <label class="label">起始日期</label>
                    <DatePicker :options='options' :value="startDate" placement="bottom-end" placeholder="选择日期" class="select" @on-change="dateStrat"></DatePicker>
                </div>
                <div class="div">
                    <label class="label">截止日期</label>
                    <DatePicker :options='options' :value="endDate" placement="bottom-end" placeholder="选择日期" class="select" @on-change="dateEnd"> </DatePicker>
                </div>
                <Button type="primary" icon="ios-search" @click="btnCheck()" >查询</Button>    
                <Button type="primary" icon="ios-upload" @click="clearQuery()">清空条件</Button>
            </div>  
        </card>
        <card class="margin-bottom-10">
            <Table class="margin-bottom-10" size="small" border style="min-height:400px;" :columns="columns" :data="data1" highlight-row @on-row-click='mainHandleRow'></Table>
            <div>
                <Page :total="total" :current="pageCurrent" @on-change="changePage" @on-page-size-change="changePageSize" show-elevator show-sizer></Page>
            </div>
        </card>
        <!-- 冲红入库单 -->
        <Modal class="output-modal modal-table-form zIndex-2000" width='1100px' v-model="offsetModal" @on-ok='nextStep()' :mask-closable="false" :styles="{top: '0px'}">
             <p slot="header" >
                 <Icon type="compose" size='16'></Icon>
                <span>冲红录入界面</span>
            </p>
            <div>
                <Form :label-width="60" inline>
                    <Card class="modal-formItem margin-bottom-10">
                         <FormItem label="产品类别">
                            <Select v-model="material" class="select li-width">
                                <Option v-for="item in goodsList" :value="item.id" :key="item.value">{{item.value}}</Option>
                            </Select>
                        </FormItem>
                         <FormItem label="生产单位">
                            <Select v-model="office" class="select">
                                <Option  v-for="item in useCmpList" :value="item.id" :key="item.id">{{item.value}}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="供货单位">
                            <Select v-model="user"  class="select">
                                <Option v-for="item in offerCmpList" :value="item.id" :key="item.value">{{ item.value }}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="起始捆号">    
                            <Input v-model="startBundleNo" placeholder="请输入起始捆号" class="select"></Input>
                        </FormItem>
                        <FormItem label="炉号">
                            <Input v-model="FurnaceNoInput" placeholder="请输入炉号" class="select"></Input>
                        </FormItem>
                        <FormItem label="捆重量">
                            <Input v-model="BundleWeight" placeholder="请输入捆重量" class="select"></Input>
                        </FormItem>
                        <FormItem label="捆长度">
                            <Input v-model="BundleLenght" placeholder="请输入捆长度" class="select"></Input>
                        </FormItem>
                        <FormItem label="起始日期">
                            <DatePicker :options='options' :value="startDate" placement="bottom-end" placeholder="选择日期" class="select" @on-change="dateStrat"></DatePicker>
                        </FormItem>
                        <FormItem label="截止日期">
                            <DatePicker :options='options' :value="endDate" placement="bottom-end" placeholder="选择日期" class="select" @on-change="dateEnd"> </DatePicker>
                        </FormItem>
                        <Button type="primary" icon="ios-search" @click="btnLogQuery()" >查询</Button>
                        <Button type="primary" icon="social-dropbox-outline" :disabled="!isToOffset" @click="btnOffset()">冲红</Button>
                    </Card>
                    <card class="padding-bottom-10">
                        <div class="margin-bottom-10" >
                            <Table class="fontSize" size="small" style="min-height:450px;" border :data="logModalData" :columns="offsetColumns" stripe highlight-row  @on-row-click='handleRow'></Table>
                        </div>
                            <Page :total="xsTotal" :current="xsPageCurrent" @on-change="xsChangePage" @on-page-size-change="xsChangePageSize" show-elevator show-sizer placement='top' :transfer="true"></Page>
                        <div style="clear: both;"></div>
                    </card>
                </Form>
            </div>
            <p slot="footer" >
                <Button type="ghost" @click="handleColse('offsetModal')">取消</Button>
                <Button type="primary" @click="handleColse('offsetModal')">确定</Button>
            </p>
        </Modal>
    </div>
</template>
<script>
import base from '@/libs/base';

 export default {
        data () {
            return {
                bundleNo: '',
                offsetModal: false,
                material: "",          // 产品类别下拉框id
                unitSelectId:0,
                endDate: '',
                startDate: '',
                storageNum: '',               // 入库序号
                data1: [],                   // 表格数据
                skip: 0,                     // 数据起始值
                take: 10 ,                   // 一次获取的条数--一页显示的条数
                total: 100,                  // 数据总数
                pageCurrent: 1,              // 当前页
                pageSize: 10,                // 每页的数据
                columns: [                   // 表格表头/列信息
                    {title: '捆编号',key: 'cpcBundleNo',align:"center", ellipsis: true, 
                    width:110,
                    render: (h, para) => {
                        let str = para.row.cpcBundleNo.toString();
                        return str.substring(0, 4) + '-' + str.substring(4, 8);
                    }},
                    {title: '产品类别',key: 'bgWuPinMin',align:"center", width:140,ellipsis: true},
                    {title: '生产分厂', key: 'depCpProdCmp',align:"center", width:110,ellipsis: true},
                    {title: '原料供货', key: 'bcYLSupCmp',align:"center",width:110, ellipsis: true},
                    {title: '炉号', key: 'cpcFurnaceNo', align:"center",width:110, ellipsis: true},
                    {title: '捆重量',key: 'cpcWeight',align:"center", width:110,ellipsis: true},
                    {title: '捆长度',key: 'cpcLength',align:"center", width:110,ellipsis: true},
                    {title: '支数', key: 'cpcNumber',align:"center", width:110,ellipsis: true},
                    {title: '入库序号', key: 'cpeSeq_Num',align:"center",width:100, ellipsis: true},
                    {title: '冲红日期',key: 'zOffsetDate',align:"center", width:100,ellipsis: true},
                    {title: '冲红状态', key: 'cpeOffsetStatusN', width:100,align:"center"},
                    {title: '判定状态', key: 'zOffSetDecisionStatusN',width:100,align:"center"},
                ],
                offsetColumns: [                   // 表格表头/列信息
                    {title: '捆编号',key: 'zBundleNo',align:"center", ellipsis: true,},
                    {title: '产品类别',key: 'bgWuPin',align:"center", ellipsis: true},
                    {title: '生产分厂', key: 'zCpProdCmp_ID',align:"center", ellipsis: true},
                    {title: '原料供货', key: 'bcYLSupCmpName',align:"center", ellipsis: true},
                    {title: '炉号', key: 'zFurnaceNo', align:"center", ellipsis: true},
                    {title: '捆重量',key: 'zWeight',align:"center", ellipsis: true},
                    {title: '捆长度',key: 'zLength',align:"center", ellipsis: true},
                    {title: '支数', key: 'zNumber',align:"center", ellipsis: true},
                    {title: '入库序号', key: 'cpoInStoreSeq_Num',align:"center", ellipsis: true},
                    {title: '判定状态', key: 'decisionStatusN', align:"center"},
                    {title: '入库日期',key: 'cpoInStoreDate',align:"center", ellipsis: true},
                    {title: '冲红状态', key: 'cpoOffsetStatus', align:"center"},
                    {title: '状态', key: 'decisionStatusRecN',align:"center"},
                ],
                updataFormValidate:{
                    "ID": "int",
                    "Cp_ProdStoreId": "int",
                    "Cp_ProdStorerecId": "int",
                    "OffsetDate": "Date",
                    "DecisionStatus": "int",
                    "IsInOrOut": "int",
                    "Is_lock": "int"
                },
                goodsList:[],//品名列表
                offerCmpList:[],//生产单位列表
                useCmpList:[],//使用单位列表
                supplySelectId: 0,
                today:'',
                options:{//日期选项
                    disabledDate(date){
                        return date.valueOf() > Date.now();
                    }
                },
                isToCheck: false,
                isToCancelCheck: false,
                isToDelete: false,
                isToOffset: false,
                selectedId:'',//选中的id
                contractNum: '',
                logModalData: [],
                xsSkip: 0,                     // 数据起始值
                xsTake: 10 ,                   // 一次获取的条数--一页显示的条数
                xsTotal: 100,                  // 数据总数
                xsPageCurrent: 1,              // 当前页
                xsPageSize: 10,                // 每页的数据
                office: '',
                user: '',
                startBundleNo: '',
                FurnaceNoInput: '',
                state: '',
                BundleWeight: '',
                BundleLenght: '',
                recUpdata: {},
                recID: '',
                offsetId: ''
            }   
        },
        methods: {
            handleRow(row){
                this.isToOffset = true;
                this.offsetId = row.zid;
                this.contractRow = row;
                this.recUpdata.ID = this.contractRow.zid
                this.recUpdata.Cp_ProdStoreId = this.contractRow.zCp_ProdStoreId
                this.recUpdata.CP_TyID = this.contractRow.zcP_TyID
                this.recUpdata.YLSupCmp_ID = this.contractRow.zylSupCmp_ID
                this.recUpdata.YLSupCmpName = this.contractRow.bcYLSupCmpName
                this.recUpdata.CpProdCmp_ID = this.contractRow.zCpProdCmp_ID
                this.recUpdata.BundleNo = this.contractRow.zBundleNo
                this.recUpdata.FurnaceNo = this.contractRow.zFurnaceNo
                this.recUpdata.Weight = this.contractRow.zWeight
                this.recUpdata.Length = this.contractRow.zLength
                this.recUpdata.Number = this.contractRow.zNumber
                this.recUpdata.StoreDate = this.contractRow.cpoInStoreDate
                this.recUpdata.CPOutStoreSgl_ID = this.contractRow.cpoInStoreDate
                this.recUpdata.ProdDate = this.contractRow.cpoInStoreDate
              
                this.recUpdata.StoreArea = this.contractRow.cpoInStoreDate
                this.recUpdata.DecisionStatus = this.contractRow.decisionStatusRec
            },
            btnOffset(){
                if(this.offsetId === ''){
                    this.$Message.error({duration: 5, content:'请先选择一行数据'});
                }else{
                    this.updataFormValidate.Cp_ProdStorerecId = this.contractRow.zid;
                    this.updataFormValidate.CP_TyID = this.contractRow.zcP_TyID;
                    this.updataFormValidate.YLSupCmp_ID = this.contractRow.zylSupCmp_ID;
                    this.updataFormValidate.OffsetDate = this.today;
                    this.updataFormValidate.zOffSetDecisionStatus = 1;
                    this.updataFormValidate.Cp_ProdStoreId = this.contractRow.zCp_ProdStoreId;
                    this.updataFormValidate.IsInOrOut = 1;

                    base.postAjaxData(base.baseURL + '/WlCenter/Cp_offsetmanage',JSON.stringify(this.updataFormValidate),() =>{
                        this.$Message.success('冲红成功!');
                        this.btnLogQuery();
                        // 更新rec的isoffset
                        this.recUpdata.IsOffset = 2
                        base.putAjaxData(base.baseURL + 'FCManage/Cp_ProdStoreRec',JSON.stringify(this.recUpdata),() =>{
                            this.init();
                            this.offsetModal = false;
                        });
                    });
                }
            },
            dateStrat(val){
                this.startDate = val;
            },
            dateEnd(val){
                this.endDate = val;
            },
            mainHandleRow(row){
                this.selectedId = row.zid;
                this.recID = row.zCp_ProdStorerecId
                switch (row.zOffSetDecisionStatus) {
                    case 1:
                        this.isToCheck = true;
                        this.isToCancelCheck = false;
                        this.isToDelete = true;
                        break;
                    case 2:
                        this.isToCancelCheck = true;
                        this.isToCheck = false;
                        this.isToDelete = false;
                        break;
                    case 3:
                        this.isToCancelCheck = false;
                        this.isToCheck = false;
                        this.isToDelete = false;
                        break;
                    default:
                        this.isToCancelCheck = false;
                        this.isToCheck = false;
                        this.isToDelete = false;
                        break;
                }
            },
            //状态公共函数
            btnCommonFun(status,callback){
                const id = this.selectedId;
                id && base.getAjaxData(base.baseURL+'/WlCenter/Cp_offsetmanage?ID=' + id, (data)=>{
                    callback(data.results[0],id);
                });
            },
            //送检
            toCheck(){
                this.btnCommonFun(1, (data,id) => {
                    data.DecisionStatus = 2;
                    base.putAjaxData(base.baseURL + '/WlCenter/Cp_offsetmanage',JSON.stringify(data),() =>{
                        this.$Message.success({duration: 5, content:'送检成功！'});
                        this.init();
                    });
                });
            },
            //取消送检
            toCancelCheck(){
                this.btnCommonFun(2, (data,id) => {
                    data.DecisionStatus = 1;
                    base.putAjaxData(base.baseURL + '/WlCenter/Cp_offsetmanage',JSON.stringify(data),() =>{
                        this.$Message.success({duration: 5, content:'取消送检成功！'});
                        this.init();
                    });
                });
            },
            // 删除
            remove (id) {
                this.$Modal.confirm({
                    title: '提醒消息',
                    content: '<p>确定删除这条吗？</p>',
                    onOk: () => {
                        base.deleteAjaxData(base.baseURL + '/WlCenter/Cp_offsetmanage?ID=' + id,(e)=>{
                            this.$Message.info({duration: 3, content:'删除成功！'});
                             base.ajaxData('/FCManage/Cp_ProdStoreRec?ID=' + this.recID, {}, 'GET', (e) => {
                                let data = e.results[0];
                                data.isOffset = 1;
                                data.DecisionStatus = 2;
                                base.putAjaxData(base.baseURL + '/FCManage/Cp_ProdStore',JSON.stringify(data),() =>{
                                });
                            });
                            this.init();
                        });     
                    },
                    onCancel: () => {
                        this.$Message.info('您取消了删除');
                    }
                });
            },
            // 查询函数
            check(skip,take){
                let _self = this;
                let para = {};
                
                para.Skip = skip;
                para.Take = this.pageSize;
                
                if(this.material) para.cpeCP_TyID = this.material;
                if(this.unitSelectId) para.cpeCpProdCmp_ID = this.unitSelectId;
                if(this.storageNum) para.cpeSeq_Num = this.storageNum;
                if(this.bundleNo) para.cpcBundleNo = this.bundleNo;
                if(this.supplySelectId) para.cpeYLSupCmp_ID = this.supplySelectId;
                if(this.startDate) para['>zOffsetDate'] = this.startDate;
                if(this.endDate) para['zOffsetDate<'] = this.endDate;
                if(this.startDate && this.endDate) para.zOffsetDateBetween = this.startDate + ',' + this.endDate;

                base.ajaxData('/WlCenter/Cp_offsetmanage_view', para, 'GET', (e) => {
                    if(e.results){
                       e.results.forEach((item) => {
                           if(item.zOffsetDate) item.zOffsetDate = item.zOffsetDate.substring(0,10);
                       })
                        this.data1 = e.results;
                        this.total = e.total;
                    }
                });
            },
            btnLogQuery(xsSkip,xsTake){
                let _self = this;
                let para = {};
                
                para.Skip = xsSkip;
                para.Take = this.xsPageSize;
                
                if(this.material) para.zcP_TyID = this.material;
                if(this.office) para.ZCpProdCmp_ID = this.office;
                if(this.user) para.zylSupCmp_ID = this.user;
                if(this.startBundleNo) para['>zBundleNo'] = this.startBundleNo;
                if(this.FurnaceNoInput) para.zFurnaceNoContains = this.FurnaceNoInput;
                if(this.state) para.decisionStatusRec = this.state;
                if(this.BundleWeight) para.zWeight = this.BundleWeight;
                if(this.BundleLenght) para.zLength = this.BundleLenght;
                if(this.startDate) para['>cpoInStoreDate'] = this.startDate;
                if(this.endDate) para['cpoInStoreDate<'] = this.endDate;
                if(this.startDate && this.endDate) para.cpoInStoreDateBetween = this.startDate + ',' + this.endDate;

                base.ajaxData('/FCManage/Cp_ProdStoreRec_view?ZIsOffset=1&cpoOffsetStatus=3&DecisionStatusRec=2', para, 'GET', (e) => {
                    this.logModalData = [];
                    if(e.results){
                        e.results.forEach( (item) => {
                            if(item.zBundleNo){
                                if(item.cpoInStoreDate) item.cpoInStoreDate = item.cpoInStoreDate.substring(0,10);
                                if(item.cmoOutStoreDate) item.cmoOutStoreDate = item.cmoOutStoreDate.substring(0,10);
                                this.logModalData.push(item);
                            }
                        });
                    this.xsTotal = e.total;    
                    }
                });
            },
            clearQuery(){
                this.unitSelectId = 0;
                this.storageNum = '';
                this.supplySelectId = 0;
                this.startDate = '';
                this.endDate = '';
                this.bundleNo = '';
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
            xsChangePage (index) {
                this.xsPageCurrent = index;
                let _size = this.xsPageSize;
                this.xsSkip = (index - 1) * _size;
                this.btnLogQuery(this.xsSkip, _size);
            },
            xsChangePageSize (size) {
                this.xsPageSize = size;
                this.btnLogQuery(this.xsSkip, size);
            },
            //关闭模态框
            handleColse(modal){
                this[modal] = false;
            },
            initData(){
                this.selectedId = '';
                this.contractRow = [];
            },
            init(){
                this.initData();
                this.changePage(this.pageCurrent);
                this.xsChangePage(this.xsPageCurrent)
                this.isToCheck = false;
                this.isToCancelCheck = false;
                this.isToDelete = false;
                this.isToOffset = false;
            }
        },
        created(){
            base.getGoodsList(this,108);
            // 生产单位 下拉列表数据
            base.getAjaxData(base.baseURL + 'PublicApi/bs_comminfo_view',(res) =>{
                res.results.forEach((item) => {
                    if(item.comm_ID){
                        let temp = item.comm_ID.substring(0,3);
                        if(item.isEnable && item.subClass_Value){
                            if(temp == 100)this.offerCmpList.push({id:item.comm_ID,value:item.subClass_Value});
                        }
                    }
                });
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
        },
        // 获取数据
        mounted () {
            this.today = base.dateFormat(new Date());
        },
        watch:{
            total: function(val){
                base.watchTotal(val, this);
            },
        }
    }
</script>
