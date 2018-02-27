<style lang="less" >
    @import './stuff-mgmt-common.less';
</style>

<template>
    <div class="stuff-common-mgmt">
        <div>
            <Button type="primary" @click="logBtn()" icon="plus">到货登记</Button>
            <Button type="primary" :disabled = '!isToLook' @click="look()" icon="ios-search">查看</Button>
            <Button type="primary" :disabled = '!isToUpdate' @click="update()" icon="edit">修改</Button>
            <Button type="primary" :disabled = '!isToDelete' @click="toDeleteData()" icon="trash-a">删除</Button>
            <Button type="primary" :disabled = '!isToBill' @click="toBill()" icon="social-linkedin-outline">入库单</Button>
            <!-- <Button type="primary" :disabled = '!isToDeliver'@click="toDeliver()" icon="reply">发货</Button> -->
        </div>
        <Card class="select-col margin-bottom-10 padding-top-bottom-minish margin-top-10">
            <div class="div">
                <label class="label">供货单位</label>
                <Select v-model="office"  class="select">
                    <Option :value="0">全部</Option>
                    <Option v-for="item in offerCmpList" :value="item.comm_ID" :key="item.subClass_Value">{{ item.subClass_Value }}</Option>
                </Select>
            </div>
            <div class="div">
                <label class="label">材料品名</label>
                <Input v-model="stuffName" placeholder="请输入材料品名" class="select"></Input>
            </div>
            <div class="div">
                <label class="label">筛选状态</label>
                <Select v-model="state"  class="select">
                    <Option v-for="item in statesList" :value="item.num" :key="item.num">{{ item.value }}</Option>
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
            <Button type="primary" icon="ios-search" @click="btnCheck()">查询</Button>
            <!-- <Button type="primary" icon="gear-b" >分类统计</Button> -->
            <Button type="primary" icon="ios-upload">导出信息</Button>
            <Button type="primary" icon="social-dropbox-outline" @click="clearQuery()">清空</Button>
        </Card>
        <Row>
            <Col  :span="colLeft" >
                <Card style="overflow-y: scroll; overflow-x: auto;min-height:475px;" class="layout">
                    <Tree ref='leftTree' style="width: 100%;" :data="treeData" @on-select-change='selectNode'></Tree>
                </Card>
            </Col>
            <Col :span="colRight">
                <Card class="layout">
                    <Table class="margin-bottom-10" size="small" :data = 'data' border :columns="columns" stripe @on-selection-change='haveSelected'></Table>
                    <Page :total="total" placement='top' :current="pageCurrent" @on-change="changePage" @on-page-size-change="changePageSize" show-elevator show-sizer></Page>
                </Card>
            </Col>
        </Row>
        <!-- 查看 -->
        <Modal class="modal-table-form stuff-common-modal" width='900px' :mask-closable="false" v-model="lookModal" class-name="vertical-center-modal">
             <p slot="header" >
                <Icon type="compose" size='16'></Icon>
                <span>材料到货录入</span>
            </p>
            <div class="">
                <Form >
                    <div class="modal-table margin-top-10">
                        <h3 class="align-center margin-bottom-10">到货信息</h3>
                        <table class="table-common larger-row" border="1" cellspacing='0'>
                            <tr style="display:none">
                                <td class="align-center" colspan="4">到货信息</td>
                            </tr>
                            <tr>
                                <td>材料品名</td>
                                <td v-text="lookData.cPinMin"></td>
                                <td>规格</td>
                                <td>{{lookData.cSpecifications}}</td>
                            </tr>
                            <tr>
                                <td>材料编码</td>
                                <td v-text="lookData.cL_TyID"></td>
                                <td>供货单位</td>
                                <td v-text="lookData.cylSupCmp"></td>
                            </tr>
                            <tr>
                                <td>计划到货</td>
                                <td v-text="lookData.plan_ID"></td>
                                <td>实际到货</td>
                                <td v-text="lookData.daHuoGdNum"></td>
                            </tr>
                            <tr>
                                <td>到货日期</td>
                                <td v-text="lookData.daHuoDate"></td>
                                <td>含税单价（元）</td>
                                <td v-text="lookData.unitPrice"></td>
                            </tr>
                            <tr>
                                <td>备注</td>
                                <td colspan="3" v-text="lookData.dremarks"></td>
                            </tr>
                        </table>
                    </div>
                </Form>
            </div>
            <p slot="footer" >
                <Button type="ghost" @click="handleClose('lookModal')">取消</Button>
                <Button type="primary" @click="handleClose('lookModal')">保存</Button>
            </p>
        </Modal>

        <!-- 录入 -->
        <Modal class="modal-table-form stuff-common-modal" width='900px' :mask-closable="false" v-model="logModal" class-name="vertical-center-modal">
             <p slot="header" >
                <Icon type="compose" size='16'></Icon>
                <span>材料到货录入</span>
            </p>
            <div class="">
                <Form ref="postForm" :model="postData" :rules="rulePost">
                    <div class="modal-table margin-top-10">
                        <h3 class="align-center margin-bottom-10">到货信息</h3>
                        <table class="table-common larger-row" border="1" cellspacing='0'>
                            <tr style="display:none">
                                <td class="align-center" colspan="4">到货信息</td>
                            </tr>
                            <tr>
                                <td>材料品名</td>
                                <td>
                                    <FormItem prop='cL_TyID'>
                                        <Select ref='remote' v-model="postData.cL_TyID" placeholder='请输入材料品名' :filterable='true' :remote='true' :remote-method="filterMethod" :loading="autoLoading" @on-change='handleAuto'>
                                            <Option v-for="(option,index) in allStuff" :value="option.zid" :label="option.zSubClass_Value" :key="index">
                                                <span class="auto-complete-title">{{ option.zid }}</span>
                                                <span class="auto-complete-title">{{ option.zSubClass_Value }}</span>
                                                <span class="auto-complete-title">{{ option.zSpecifications }}</span>
                                                <span class="auto-complete-title">{{ option.zUnitPrice }}</span>
                                            </Option>
                                        </Select>
                                    </FormItem>
                                </td>
                                <td>规格</td>
                                <td v-text="postData.cSpecifications"> </td>
                            </tr>
                            <tr>
                                <td>材料编码</td>
                                <td v-text="postData.cL_TyID"></td>
                                <td>供货单位</td>
                                <td>
                                    <FormItem prop='clSupCmp_ID'>
                                        <Select v-model="postData.clSupCmp_ID" :transfer="true">
                                            <Option v-for="item in offerCmpList" :value="item.comm_ID" :key="item.comm_ID">{{ item.subClass_Value }}</Option>
                                        </Select>
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td>计划到货</td>
                                <td>
                                    <FormItem prop='plan_ID'>
                                        <Input v-model="postData.plan_ID" placeholder="请输入计划到货数" :maxlength="6"></Input>
                                    </FormItem>
                                </td>
                                <td>实际到货</td>
                                <td>
                                    <FormItem prop='daHuoGdNum'>
                                        <Input v-model="postData.daHuoGdNum" placeholder="请输入实际到货数" :maxlength="10"></Input>
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td>到货日期</td>
                                <td>
                                    <FormItem prop='daHuoDate'>
                                        <DatePicker v-model="postData.daHuoDate" :options='options' placement="bottom-end" placeholder="选择日期"></DatePicker>
                                    </FormItem>
                                </td>
                                <td>含税单价（元）</td>
                                <td>
                                    <FormItem prop='unitPrice'>
                                        <Input v-model="postData.unitPrice" placeholder="请输入单价" :maxlength="10"></Input>
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td>备注</td>
                                <td colspan="3">
                                    <FormItem prop="daFaRemarks">
                                        <Input v-model="postData.daFaRemarks" placeholder="请输入备注" :maxlength="200"></Input>
                                    </FormItem>
                                </td>
                            </tr>
                        </table>
                    </div>
                </Form>
            </div>
            <p slot="footer" >
                <Button type="ghost" @click="handleClose('logModal')">取消</Button>
                <Button type="primary" @click="toLogSubmit('postForm')">确定</Button>
            </p>
        </Modal>

        <!-- 材料入库验收单 -->
        <Modal class="modal-table-form stuff-common-modal" width='900px' :mask-closable="false" v-model="billModal" class-name="vertical-center-modal">
             <p slot="header" >
                <Icon type="compose" size='16'></Icon>
                <span>材料入库单</span>
            </p>
            <div class="">
                <Form label-position="right" :label-width="50" inline ref="storeForm" :model="lookData" :rules="rulePost">
                    <Card class="modal-formItem">
                        <FormItem label="日期" prop='inOutDate'>
                            <DatePicker v-model="lookData.inOutDate" :options="options" :transfer="true" type="date" style="width:130px;" ></DatePicker>
                        </FormItem>
                        <FormItem  label="单号" prop='inOutSgl_ID'>
                            <Input v-model="lookData.inOutSgl_ID" :maxlength="10" style="width:100px;"></Input>
                        </FormItem>
                        <FormItem  label="单价（不含税）" prop='unitPrice' class="label-70">
                            <Input v-model="lookData.unitPrice" :maxlength="10" style="width:100px;"></Input>
                        </FormItem>
                        <FormItem label="发票号" prop='' >
                            <Input :maxlength="10" style="width:100px;"></Input>
                        </FormItem>
                    </Card>
                    <div class="modal-table margin-top-10">
                        <h3 class="margin-bottom-10 align-center">材料入库单</h3>
                        <table class="storage-table table-common table-common-top table-common-bottom" border="1" cellspacing='0'>
                            <tr>
                                <td>编码:SYC/ZJ-WL-12</td>
                                <td colspan="2">供货单位：{{lookData.cylSupCmp}}</td>
                                <td>日期：{{storeDateShow}}</td>
                                <td  colspan="2">类别：{{lookData.bclSubClass_ID}}</td>
                                <td colspan="1">NO.{{billNumFull}}</td>
                            </tr>
                            <tr>
                                <td rowspan="2">材料名称</td>
                                <td rowspan="2">规格及材质</td>
                                <td rowspan="2">单位</td>
                                <td colspan="2">数量</td>
                                <td colspan="2">价格</td>
                            </tr>
                            <tr>
                                <td>应收</td>
                                <td>实收</td>
                                <td>单价（不含税）</td>
                                <td>金额</td>
                            </tr>
                            <tr>
                                <td v-text="lookData.cPinMin"></td>
                                <td v-text="lookData.cSpecifications"></td>
                                <td v-text="lookData.cUnit"></td>
                                <td v-text="lookData.plan_ID"></td>
                                <td v-text="lookData.inOutGdNum"></td>
                                <td v-text="lookData.unitPrice"></td>
                                <td>
                                    <FormItem prop='amout'>
                                        <Input :value="amountShow" v-model='lookData.amout' :maxlength="10" style="width:100%;"></Input>
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td>备注</td>
                                <td colspan="6">
                                    <Input v-model="lookData.inOutRemarks" :maxlength="80" style="width:100%;"></Input>
                                </td>
                            </tr>
                            <tr>
                                <td class="align-left">主管：</td>
                                <td colspan="2">计划员：</td>
                                <td colspan="3">保管员：</td>
                                <td class="align-right">采购：</td>
                            </tr>
                        </table>
                    </div>
                </Form>
            </div>
            <p slot="footer">
                <Button type="ghost" @click="handleClose('billModal')">取消</Button>
                <Button type="primary" @click="storeCommit('storeForm')">保存</Button>
            </p>
        </Modal>
    </div>
</template>

<script>
import base from '@/libs/base';

export default {
    data () {
        return {
            autoLoading:false,
            stuff:'',
            allStuff:[],
            postData:{},
            storeData:{},
            rulePost:{
                daHuoDate: [
                    { required: true,type:'date', message:' '}
                ],
                inOutDate: [
                    { required: true,type:'date', message:' '}
                ],
                cLUseCmp_ID: [
                    { required: true,message:' '}
                ],
                clSupCmp_ID: [
                    { required: true,message:' '}
                ],
                daHuoGdNum:[
                    { validator: base.intCheck,required: true, message: ' '}
                ],
                cL_TyID:[
                    { required: true, message: ' '}
                ],
                inOutSgl_ID:[
                    { required: true, message: ' '}
                ],
                unitPrice:[
                    { validator: base.floatCheck,required: true, message: ' '}
                ],
                //发货
                faHuoNum:[
                    { validator: base.intCheck,required: true, message: ' '}
                ],
                amout:[
                    { validator: base.floatCheck,required: true, message: ' '}
                ]
            },
            lookData:{},
            isToUpdate: false,
            isToDelete: false,
            isToLook: false,
            isToBill: false,
            isToDeliver: false,
            treeData: [
                {
                    title : '全部材料',
                    expand: true,
                    children:[]
                }
            ],
            total: 0,
            pageCurrent: 1,
            pageSize: 10,
            skip: 0,
            startDate: '',
            endDate: '',
            stuffName: '',
            stuffNumber: '',
            state: 0,
            options: {
                disabledDate(date){
                    return date.valueOf() > Date.now();
                }
            },
            use: '',
            useCmpList: [],
            offerCmpList: [],
            office: 0,
            statesList: [
                {num:0,value:'显示全部记录'},
                {num:1,value:'显示未入库记录'},
                {num:2,value:'显示已入库记录'}
            ],
            data:[],
            columns: [//首页显示表格的列
                {type: 'selection',align:"center",width: 30},
                {title: '物料编号',key: 'zcL_TyID',align:"center",width: 80,},
                {title: '品名',key: 'cPinMin',align:"center",width: 150,},
                {title: '规格', key: 'cSpecifications',align:"center",width: 90},
                {title: '单位', key: 'cUnit',align:"center",width: 80},
                {title: '总数量', key: 'zDaHuoGdNum', align:"center",width: 80},
                // {title: '剩余数量', key: 'ZRuKuDate', align:"center",width: 80},
                {title: '含税单价（元）', key: 'zUnitPrice',"width": 100,align:"center"},
                {title: '金额',key: 'amount',"width": 80,align:"center"},
                // {title: '状态',key: 'zStoreStatus',align:"center",width: 60},
                {title: '到货日期',key: 'zDaHuoDate',align:"center",width: 80,render: (h, para) => {
                    return para.row.zDaHuoDate.substring(0, 10);
                }},
                {title: '入库日期',key: 'zRuKuDate',align:"center",width: 80,render: (h, para) => {
                    var date = para.row.zRuKuDate.substring(0, 10);
                    var tem = date === '0001-01-01' ? '' : date;
                    return tem;
                }},
                {title: '供货单位',key: 'cylSupCmp',align:"center",width: 80},
                {title: '材料库管员',key: 'zLibrarian',align:"center",width: 100},
                {title: '入库单号',key: 'zInSgl_ID',align:"center",width: 100}
            ],
            lookModal:false,
            logModal: false,
            deliverModal: false,
            billModal: false,
            colLeft: 0,
            colRight: 0,
            buttonStatus: 'none',
            buttonProps: {          // 树按钮属性
                type: 'ghost',
                size: 'small',
            },
            // screenHeight: document.body.clientHeight,s
            treeTop: 0,
            today:'',
            // isUpdate:false,
            postStatus:'',
            screenHeight: document.body.clientHeight - 200,
        }
    },
    computed:{
        billNumFull(){
            let str = this.lookData.inOutSgl_ID;
            str = str ? str + '' : '';
            let len = str.length;
            for(var i = len; i<6;i++){
                str = '0' + str;
            }
            return str;
        },
        storeDateShow(){
            return base.dateFormat(new Date(this.lookData.inOutDate));
        },
        amountShow(){
            var total = this.lookData.inOutGdNum * this.lookData.unitPrice;
            total = total ? total.toFixed(2):0;
            this.$set(this.lookData,'amout',total);
        }
    },
    methods: {
        // 关联数据查询
        handleAuto(id){
            if(!id) return;
            base.ajaxData('PublicApi/Bs_ClCateGoryRec_view?zid='+ id, '', 'GET', (e) => {
                let res;
                if( e.results && (res = e.results[0]) ){
                    this.postData.cSpecifications = res.zSpecifications;
                    this.postData.unitPrice = res.zUnitPrice;
                    this.$forceUpdate();
                }
            });
        },
        // 远程搜索方法
        filterMethod (query) {
            if (query) {
                let para = {};
                /[a-z]+/i.test(query) ? para['zPinYinContains'] = query:para['zSubClass_ValueContains'] = query;
                this.autoLoading = true;
                base.ajaxData('PublicApi/Bs_ClCateGoryRec_view', para, 'GET', (e) => {
                    this.autoLoading = false;
                    this.allStuff = e.results;
                })
            } else {
                this.allStuff = [];
                this.postData.cSpecifications = "";
                this.postData.unitPrice = "";
                this.postData.cL_TyID = null;
            }
        },
        logBtn(){
            this.postData = {};
            this.$refs.postForm.resetFields();
            this.logModal = true;
            this.postStatus = 'post';
            this.postData.daHuoDate = this.today;
        },
        look(){
            this.lookModal = true;
            this.postTrans('lookData');
        },
        /**
         * 赋值函数
         * @param {String} data 赋值目标
        */
        postTrans(data,sltData){
            this[data] = {};
            sltData = sltData || this.selectedData[0];
            for(var key in sltData){
                let ikey = key.replace(/^z/,'');
                ikey = ikey[0].toLowerCase() + ikey.slice(1);
                if(key == 'zDaHuoDate')sltData[key] = sltData[key].substring(0,10);//查看时间处理
                if(key == 'zFaHuoDate')sltData[key] = sltData[key].substring(0,10);//查看时间处理
                this.$set(this[data],ikey,sltData[key]);
            }
        },
        //更新
        update(){
            this.logModal = true;
            // this.isUpdate = true;
            this.postStatus = 'update';
            let pm = this.selectedData[0].cPinMin;
            this.postTrans('postData');
            this.$refs.remote.setQuery(pm);
        },
        //入库按钮
        toBill(){
            let slt = this.selectedData;
            let len = slt.length;
            for(var i = 1;i < len;i++){
                if(slt[i].zcL_TyID !== slt[0].zcL_TyID || slt[i].zclSupCmp_ID !== slt[0].zclSupCmp_ID || slt[i].cSpecifications !== slt[0].cSpecifications || slt[i].zUnitPrice !== slt[0].zUnitPrice){
                    this.$Message.warning({duration: 5, content:'请选择同材料，同供货商，同规格，同单价的数据！'});
                    return;
                }
            }
            this.billModal = true;
            this.postTrans('lookData');
            this.$set(this.lookData,'inOutDate',base.dateFormat(new Date()));
            this.$set(this.lookData,'inOutSgl_ID','');
            let ids = [];
            let planNum = 0;
            let actNum = 0;
            slt.forEach( (item) => {
                ids.push(item.zid);
                planNum += (item.zPlan_ID || 0);
                actNum += (item.zDaHuoGdNum || 0);
            });
            this.lookData.inOutDetails = ids.join(',');
            // this.lookData.plan_ID = planNum;
            var unit = (slt[0].zUnitPrice * 0.855).toFixed(2);
            this.$set(this.lookData,'unitPrice',unit);
            this.$set(this.lookData,'inOutGdNum',actNum);
            this.lookData.clSupUseCmp_ID = this.lookData.clSupCmp_ID;
        },
        // 删除
        toDeleteData(){
            this.btnCommonFun(1, (data,id) => {
                this.$Modal.confirm({
                    content:'<p>确定删除数据么？</p>',
                    onOk: () => {
                        base.deleteAjaxData(base.baseURL + 'WlCenter/Cl_Arrival?ID='+id, (res) =>{
                            this.$Message.success({duration: 3, content:'删除成功！'});
                            this.init();
                        });
                    }
                })
            })
        },
        //检查状态公共函数
        btnCommonFun(status,callback){
            const id = this.selectedId;
            id && base.getAjaxData(base.baseURL+'WlCenter/Cl_Arrival?ID=' + id, (data)=>{
                const rst = data.results[0];
                if(rst.inOutFlag == status){
                    callback(data.results[0],id);
                }else{
                    this.$Message.error({duration: 5, content:'已选的数据已不可进行当前操作！'});
                }
            });
        },
        dateStrat(val){
            this.startDate = val;
        },
        dateEnd(val){
            this.endDate = val;
        },
        //点击选中项的操作
        haveSelected(selectedData){
            this.selectedIds = [];
            this.selectedData = selectedData;
            if(selectedData.length > 0){
                this.lookHead =selectedData[0];
                this.selectedId = selectedData[0].zid;
                this.initBtn(true);
                selectedData.forEach( (item)=>{
                    this.selectedIds.push(item.zid);
                    if(item.zInOutFlag !== 1){
                        this.initBtn(false);
                        this.isToLook = true;
                    }
                })
                if(selectedData.length >1 ){
                    this.isToUpdate = false;
                    this.isToDelete = false;
                    this.isToLook = false;
                }
            }else{
                this.initBtn(false);
            }
        },
        // 清空
        clearQuery(){
            this.office = 0;
            this.stuffName = '';
            this.stuffNumber = '';
            this.state = 0;
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
        check(skip,take){
            let _self = this;
            let para = {};
            
            para.Skip = skip;
            para.Take = this.pageSize;

            if(this.nodeChilds)para['BclSubClass_IDIn'] = this.nodeChilds;
            if(this.office) para.ZCLSupCmp_ID = this.office;
            if(this.stuffName) para.CPinMinContains = this.stuffName;
            if(this.state) para.ZInOutFlag = this.state;
            if(this.startDate) para['>ZDaHuoDate'] = this.startDate;
            if(this.endDate) para['ZDaHuoDate<'] = this.endDate;
            if(this.startDate && this.endDate) para.ZDaHuoDateBetween = this.startDate + ',' + this.endDate;
            
            base.ajaxData('WlCenter/Cl_Arrival_view?', para, 'GET', (e) => {
                this.data = e.results;
                this.total = e.total;
            });
        },
        handleClose(modal){
            this[modal] = false;
        },
        // 保存提交
        toLogSubmit(name){
            this.$refs[name].validate((valid) => {
                if (valid) {
                    if(this.postStatus == 'post'){
                        base.postAjaxData(base.baseURL + 'WlCenter/Cl_Arrival',JSON.stringify(this.postData),()=>{
                            this.logModal = false;
                            this.$Message.success({duration: 3, content:'登记成功！'});
                            this.init();
                            this.$refs[name].resetFields();
                        })
                    }else if(this.postStatus == 'update'){
                        this.btnCommonFun(1, (data,id) => {
                            base.putAjaxData(base.baseURL+'WlCenter/Cl_Arrival',JSON.stringify(this.postData),() =>{
                                this.logModal = false;
                                this.$Message.success({duration: 3, content:'修改成功！'});
                                this.init();
                                this.$refs[name].resetFields();
                            })
                        })
                    }
                }else{
                    this.$Message.warning({duration: 5, content:'请填写完整并检查是否正确！'});
                }
            })
        },
        storeCommit(name){
            this.$refs[name].validate((valid) => {
                if (valid) {
                    base.ajaxData('WlCenter/Cl_Arrival?idIn=' + this.lookData.inOutDetails, {}, 'GET', (e) => {
                        let len,rlt = e.results,isPass = true;
                        if( rlt && (len = e.results.length) > 0){
                            for(var i = 0;i < len;i++){
                                if(rlt[i].inOutFlag !== 1){
                                    this.$Message.warning({duration: 5, content:'所选数据包含已入库数据'});
                                    return;
                                }
                            }
                            delete this.lookData.id;
                            this.lookData.inOutFlag = 1;
                            base.postAjaxData(base.baseURL+'WlCenter/Cl_InOutMange',JSON.stringify(this.lookData),() =>{
                                this.billModal = false;
                                this.$Message.success({duration: 3, content:'填写成功！'});
                                this.init();
                                this.$refs[name].resetFields();
                            })
                        }else{
                            this.$Message.warning({duration: 5, content:'所选数据已不存在！'});
                        }
                    });
                }else{
                   this.$Message.warning({duration: 5, content:'请填写完整并检查是否正确！'});
                }
            })
        },
        getDepartmentTree (isEnable) {
            base.getAjaxData(base.baseURL + 'PublicApi/Bs_ClCateGory_view', (e) => {
                let data = e.results;
                let nodes = [];
                data.forEach(item => {
                    let node = {};
                    node.id = item.zid;
                    node.title = item.zClass_Value;
                    node.parentID = item.zParentId;
                    node.childIDs = item.zChildID;
                    node.expand = isEnable;
                    nodes.push(node);
                });
                // let parseData = base.convert(nodes);
                
                let parseData = base.formatDataToTree(nodes);
                this.treeData[0].children = parseData;
            })
        },
        selectNode (e) {
            if(e.length == 0) return;
            this.nodeChilds = e[0].childIDs;
            this.changePage(1);
        },
        // 统一设置按钮状态
        initBtn(s){
            this.isToLook = s;
            this.isToUpdate = s;
            this.isToDelete = s;
            this.isToBill = s;
            this.isToDeliver = s;
        },
        init(){
            this.initBtn(false);
            this.changePage(this.pageCurrent);
        }
    },
    created(){
        this.today = base.dateFormat(new Date());
        let screenWidth = window.screen.width;
        if(screenWidth <= 1024){
            this.colLeft = 6;
            this.colRight = 18;
        }else if(screenWidth > 1024 && screenWidth <= 1280){
            this.colLeft = 5;
            this.colRight = 19;
        }else{
            this.colLeft = 4;
            this.colRight = 20;
        }
    },
    mounted () {
        // this.treeTop = $(this.$refs.leftTree.$el).offset().top;
        this.init();
        this.getDepartmentTree(0);
        let dom = document.querySelectorAll('.layout');
        dom[0].style.height = this.screenHeight + "px";
        dom[1].style.minHeight = this.screenHeight + "px";
        window.onresize = () => {
            return (() => {
                this.screenHeight = document.body.clientHeight -200;
            })()
        }

        let departArray = [];
        let offerArray = [];
        // 使用单位
        base.ajaxData('/PublicApi/Sys_Deparment?IsEnable=1', {}, 'GET', (e) => {
            if(e.results && e.results.length > 0){
                e.results.forEach((item) => {
                    departArray.push({id:item.departmentId,value:item.name})
                })
                this.useCmpList = departArray;
            }
        });
        // 供货单位
        base.ajaxData('PublicApi/Bs_comminfo_view?Comm_IDStartsWith=101&IsEnable=1', {}, 'GET', (e) => {
            if(e.results && e.results.length > 0){
                e.results.forEach((item) => {
                    offerArray.push({comm_ID:item.comm_ID,subClass_Value:item.subClass_Value});
                });
                this.offerCmpList = offerArray;
            }
        });
    },
    destroyed(){
        window.onresize = null;
    },
    watch: {
        total: function(val){
            base.watchTotal(val, this);
        },
        screenHeight: function (val) {
            let dom = document.querySelectorAll('.layout');
            dom[0].style.height = val + "px";
            dom[1].style.height = val + "px";
        }
    }
}
</script>
