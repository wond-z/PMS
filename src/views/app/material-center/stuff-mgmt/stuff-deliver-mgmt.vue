<style lang="less" >

</style>

<template>
    <div class="stuff-common-mgmt">
        <div>
            <Button type="primary" @click="toDeliver()" icon="reply">发货</Button>
            <Button type="primary" :disabled = '!isToLook' @click="look()" icon="ios-search">查看</Button>
            <Button type="primary" :disabled = '!isToUpdate' @click="update()" icon="edit">修改</Button>
            <Button type="primary" :disabled = '!isToDelete' @click="toDeleteData()" icon="trash-a">删除</Button>
            <Button type="primary" :disabled = '!isToBill' @click="toBill()" icon="social-linkedin-outline">出库单</Button>
        </div>
        <Card class="select-col margin-bottom-10 padding-top-bottom-minish margin-top-10">
            <div class="div">
                <label class="label">使用单位</label>
                <Select v-model="office"  class="select">
                    <Option :value="0">全部</Option>
                    <Option v-for="item in useCmpList" :value="item.id" :key="item.id">{{ item.value }}</Option>
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
            <Button type="primary" icon="gear-b" >分类统计</Button>
            <Button type="primary" icon="ios-upload">导出信息</Button>
            <Button type="primary" icon="social-dropbox-outline" @click="clearQuery()">清空</Button>
        </Card>
        <Row>
            <Col :span="colLeft">
                <Card style="overflow-y: scroll; overflow-x: auto;min-height:475px;" class="layout">
                    <Tree ref='leftTree' style="width: 100%;" :data="treeData" @on-select-change='selectNode'></Tree>
                </Card>
            </Col>
            <Col :span="colRight">
                <card  class="layout">
                    <Table class="margin-bottom-10" size="small" border  style="min-height:400px;" :data="data"  :columns="columns" @on-selection-change='haveSelected'></Table>
                    <Page :total="total" placement='top' :current="pageCurrent" @on-change="changePage" @on-page-size-change="changePageSize" show-elevator show-sizer></Page>
                </card>
            </Col>
        </Row>
        <!-- 发货 -->
        <Modal class="modal-table-form stuff-common-modal" width='900px' :mask-closable="false" v-model="logModal" class-name="vertical-center-modal">
             <p slot="header" >
                <Icon type="compose" size='16'></Icon>
                <span>材料发货记录录入</span>
            </p>
            <div class="">
                <Form ref="deliverForm" :model="postData" :rules="rulePost">
                    <div class="modal-table margin-top-10">
                        <h3 class="align-center margin-bottom-10">发货信息</h3>
                        <table class="table-common larger-row" border="1" cellspacing='0'>
                            <tr style="display:none">
                                <td class="align-center" colspan="4">发货信息</td>
                            </tr>
                            <tr>
                                <td>材料品名</td>
                                <td>
                                    <FormItem prop='cL_TyID'>
                                        <Select ref='remote' v-model="postData.cL_TyID" placeholder='请输入材料品名' filterable remote :remote-method="filterMethod" :loading="autoLoading" @on-change='handleAuto'>
                                            <Option v-for="(option,index) in allStuff" :value="option.zid" :label="option.zSubClass_Value" :key="index">
                                                <span class="auto-complete-title">{{ option.zid }}</span>
                                                <span class="auto-complete-title">{{ option.zSubClass_Value }}</span>
                                                <span class="auto-complete-title">{{ option.zSpecifications }}</span>
                                                <span class="auto-complete-title">{{ option.zUnitPrice }}</span>
                                            </Option>
                                        </Select>
                                        <!-- <Input placeholder="请输入材料品名" :maxlength="10"></Input> -->
                                    </FormItem>
                                </td>
                                <td>规格</td>
                                <td v-text="postData.cSpecifications"></td>
                            </tr>
                            <tr>
                                <td>材料编码</td>
                                <td v-text="postData.cL_TyID"></td>
                                <td>使用单位</td>
                                <td>
                                    <FormItem prop='clUseCmp_ID'>
                                        <Select v-model="postData.clUseCmp_ID" :transfer="true">
                                            <Option v-for="item in useCmpList" :value="item.id" :key="item.id">{{ item.value }}</Option>
                                        </Select>
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td>收发结余</td>
                                <td v-text="balanceNum"></td>
                                <td>实际发货</td>
                                <td>
                                    <FormItem prop='faHuoNum'>
                                        <Input v-model="postData.faHuoNum" placeholder="请输入实际发货数" :maxlength="10"></Input>
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td>发货日期</td>
                                <td>
                                    <FormItem prop='faHuoDate'>
                                        <DatePicker v-model="postData.faHuoDate" :options='options' placement="bottom-end" placeholder="选择日期"></DatePicker>
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
                                    <FormItem prop="remarks">
                                        <Input v-model="postData.remarks" placeholder="" :maxlength="200"></Input>
                                    </FormItem>
                                </td>
                            </tr>
                        </table>
                    </div>
                </Form>
            </div>
            <p slot="footer" >
                <Button type="ghost" @click="handleClose('logModal')">取消</Button>
                <Button type="primary" @click="deliverSubmit('deliverForm')">确定</Button>
            </p>
        </Modal>
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
                                <td>使用单位</td>
                                <td v-text="lookData.depCLUseCmp"></td>
                            </tr>
                            <tr>
                                <td>计划发货</td>
                                <td v-text="lookData.plan_ID"></td>
                                <td>实际发货</td>
                                <td v-text="lookData.faHuoNum"></td>
                            </tr>
                            <tr>
                                <td>到货日期</td>
                                <td v-text="lookData.faHuoDate"></td>
                                <td>含税单价（元）</td>
                                <td v-text="lookData.unitPrice"></td>
                            </tr>
                            <tr>
                                <td>备注</td>
                                <td colspan="3" v-text="lookData.remarks"></td>
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
        <!-- 材料出库验收单 -->
        <Modal class="modal-table-form stuff-common-modal" width='900px' :mask-closable="false" v-model="billModal" class-name="vertical-center-modal">
             <p slot="header" >
                <Icon type="compose" size='16'></Icon>
                <span>材料出库单</span>
            </p>
            <div>
                <Form label-position="right" :label-width="50" inline ref="outStoreForm" :model="lookData" :rules="rulePost">
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
                        <h3 class="margin-bottom-10 align-center">材料出库单</h3>
                        <table class="storage-table table-common table-common-top table-common-bottom" border="1" cellspacing='0'>
                            <tr>
                                <td>编码:SYC/ZJ-WL-12</td>
                                <td colspan="2">使用单位：{{lookData.depCLUseCmp}}</td>
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
                                <td>应发</td>
                                <td>实发</td>
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
                                <td colspan="2">发料：</td>
                                <td colspan="3">领料主管：</td>
                                <td class="align-right">领料：</td>
                            </tr>
                        </table>
                    </div>
                </Form>
            </div>
            <p slot="footer" >
                <Button type="ghost" @click="handleClose('billModal')">取消</Button>
                <Button type="primary" @click="storeCommit('outStoreForm')">保存</Button>
            </p>
        </Modal>
    </div>
</template>

<script>
import base from '@/libs/base';
import Record from './stuff-record-mgmt.vue';

 export default {
    extends:Record,
    data () {
        return {
            statesList: [
                {num:0,value:'显示全部记录'},
                {num:1,value:'显示未出库记录'},
                {num:2,value:'显示已出库记录'}
            ],
            columns: [//首页显示表格的列
                {type: 'selection', align:"center",width: 30},
                {title: '物料编号', key: 'zcL_TyID',align:"center",width: 80,},
                {title: '品名', key: 'cPinMin',align:"center",width: 110,},
                {title: '规格', key: 'cSpecifications',align:"center",width: 100},
                {title: '单位', key: 'cUnit',align:"center",width: 70},
                {title: '发货数量', key: 'zFaHuoNum', align:"center",width: 80},
                {title: '含税单价（元）', key: 'zUnitPrice',align:"center",width: 100,},
                {title: '金额', key: 'amount',"width": 80,align:"center"},
                {title: '发货日期', key: 'zFaHuoDate',align:"center",width: 100,render: (h, para) => {
                    return para.row.zFaHuoDate.substring(0, 10);
                }},
                {title: '出库日期', key: 'zOutDate',align:"center",width: 100,render: (h, para) => {
                    var date = para.row.zOutDate.substring(0, 10);
                    var tem = date === '0001-01-01' ? '' : date;
                    return tem;
                }},
                {title: '使用单位', key: 'depCLUseCmp',align:"center",width: 100},
                {title: '材料库管员', key: 'zLibrarian',align:"center",width: 80},
                {title: '单号', key: 'zOutSgl_ID',align:"center",width: 70}
            ],
            restNum:'',
            preUpNum:0,
            preCLID:0,
            colLeft: 0,
            colRight: 0,
            screenHeight: document.body.clientHeight - 200,
        }
    },
    computed:{
        balanceNum(){
            let restNum = this.restNum;
            let preUpNum = this.preCLID == this.postData.cL_TyID ? this.preUpNum:0;
            let num = this.postStatus == 'update'? (restNum*1 + preUpNum*1):restNum;//结余
            return isNaN(num) ? '':num;
        }
    },
    methods: {
        //关联数据查询
        handleAuto(id){
            if(!id) return;
            base.ajaxData('PublicApi/Bs_ClCateGoryRec_view?zid='+ id, '', 'GET', (e) => {
                let res;
                if( e.results && (res = e.results[0]) ){
                    this.restNum = res.zTotalBalanceNum;
                    this.postData.cSpecifications = res.zSpecifications;
                    this.postData.unitPrice = res.zUnitPrice;
                    this.$forceUpdate();
                }
            });
        },
        //更新
        update(){
            this.logModal = true;
            this.postStatus = 'update';
            this.postTrans('postData');
            let pm = this.selectedData[0].cPinMin;
            this.$refs.remote.setQuery(pm);
            //存储修改信息
            this.preUpNum = this.postData.faHuoNum;
            this.preCLID = this.postData.cL_TyID;
        },
        //发货按钮
        toDeliver(){
            this.logModal = true;
            this.postData = {};
            this.restNum = '';
            this.$refs.deliverForm.resetFields();
            this.$set(this.postData,'faHuoDate',base.dateFormat(new Date()));
        },
        //检查状态公共函数
        btnCommonFun(status,callback){
            const id = this.selectedId;
            id && base.getAjaxData(base.baseURL+'WlCenter/Cl_FaHuoRec?ID=' + id, (data)=>{
                const rst = data.results[0];
                if(rst.inOutFlag == status){
                    callback(data.results[0],id);
                }else{
                    this.$Message.error({duration: 5, content:'已选的数据已填出库单,不可进行当前操作！'});
                }
            });
        },
        //删除按钮
        toDeleteData(){
            this.btnCommonFun(1, (data,id) => {
                this.$Modal.confirm({
                    content:'<p>确定删除数据么？</p>',
                    onOk: () => {
                        base.deleteAjaxData(base.baseURL + 'WlCenter/Cl_FaHuoRec?ID='+id, (res) =>{
                            this.$Message.success({duration: 3, content:'删除成功！'});
                            this.init();
                        });
                    }
                })
            })
        },
        deliverSubmit(name){
            this.$refs[name].validate((valid) => {
                if(valid) {
                    if(this.postData.faHuoNum > this.balanceNum){
                        this.$Message.warning({duration: 5, content:'发货量不能大于结余量！'});
                    }else{
                        base.ajaxData('PublicApi/Bs_ClCateGoryRec_view?zid='+ this.postData.cL_TyID, '', 'GET', (e) => {//查询数据库实时获取库存
                            let res;
                            if( e.results && (res = e.results[0]) ){
                                if(this.postStatus == 'post'){
                                    if(this.postData.faHuoNum > res.zTotalBalanceNum){
                                        this.$Message.warning({duration: 5, content:'库存不足！'});
                                    }else{
                                        base.postAjaxData(base.baseURL + 'WlCenter/Cl_FaHuoRec',JSON.stringify(this.postData),(e)=>{
                                            this.logModal = false;
                                            this.$Message.success({duration: 3, content:'发货成功！'});
                                            this.init();
                                            this.$refs[name].resetFields();
                                        })
                                    }
                                }else if(this.postStatus == 'update'){
                                    if(this.postData.faHuoNum > res.zTotalBalanceNum + this.preUpNum){
                                        this.$Message.warning({duration: 5, content:'库存不足！'});
                                    }else{
                                        this.btnCommonFun(1, (data,id) => {
                                            base.putAjaxData(base.baseURL + 'WlCenter/Cl_FaHuoRec',JSON.stringify(this.postData),(e)=>{
                                                this.logModal = false;
                                                this.$Message.success({duration: 3, content:'更新成功！'});
                                                this.init();
                                                this.$refs[name].resetFields();
                                            })
                                        })
                                    }
                                }
                            }else{
                                this.$Message.warning({duration: 5, content:'库存查询出错！请检查网络重新提交！'});
                            }
                        });
                    }
                }else{
                    this.$Message.warning({duration: 5, content:'请填写完整并检查是否正确！'});
                }
            })
        },
        storeCommit(name){
            this.$refs[name].validate((valid) => {
                if (valid) {
                    base.ajaxData('WlCenter/Cl_FaHuoRec?idIn=' + this.lookData.inOutDetails, {}, 'GET', (e) => {
                        let len,rlt = e.results,isPass = true;
                        if( rlt && (len = e.results.length) > 0){
                            for(var i = 0;i < len;i++){
                                if(rlt[i].inOutFlag !== 1){
                                    this.$Message.warning({duration: 5, content:'所选数据包含已出库数据'});
                                    return;
                                }
                            }
                            delete this.lookData.id;
                            this.lookData.inOutFlag = 2;
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
        //出库按钮
        toBill(){
            let slt = this.selectedData;
            let len = slt.length;
            for(var i = 1;i < len;i++){
                if(slt[i].zcL_TyID !== slt[0].zcL_TyID || slt[i].zclUseCmp_ID !== slt[0].zclUseCmp_ID || slt[i].cSpecifications !== slt[0].cSpecifications || slt[i].zUnitPrice !== slt[0].zUnitPrice){
                    this.$Message.warning({duration: 5, content:'请选择同材料，同使用单位，同规格，同单价的数据！'});
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
                actNum += (item.zFaHuoNum || 0);
            });
            this.lookData.inOutDetails = ids.join(',');
            let unit = (slt[0].zUnitPrice * 0.855).toFixed(2);
            this.$set(this.lookData,'unitPrice',unit);
            this.$set(this.lookData,'inOutGdNum',actNum);
            this.lookData.clSupUseCmp_ID = this.lookData.clSupCmp_ID;
        },
        check(skip,take){
            let _self = this;
            let para = {};
            
            para.Skip = skip;
            para.Take = this.pageSize;

            if(this.nodeChilds)para['BclSubClass_IDIn'] = this.nodeChilds;
            if(this.office) para.ZCLUseCmp_ID = this.office;
            if(this.stuffName) para.CPinMinContains = this.stuffName;
            if(this.state) para.ZInOutFlag = this.state;
            if(this.startDate) para['>ZfaHuoDate'] = this.startDate;
            if(this.endDate) para['ZfaHuoDate<'] = this.endDate;
            if(this.startDate && this.endDate) para.ZfaHuoDateBetween = this.startDate + ',' + this.endDate;
            
            base.ajaxData('WlCenter/Cl_FaHuoRec_view?', para, 'GET', (e) => {
                this.data = e.results;
                this.total = e.total;
            });
        },
    },
    mounted () {
        let dom = document.querySelectorAll('.layout');
        dom[0].style.height = this.screenHeight + "px";
        dom[1].style.minHeight = this.screenHeight + "px";
        window.onresize = () => {
            return (() => {
                this.screenHeight = document.body.clientHeight -200;
            })()
        }
    },
    created(){
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
    destroyed(){
        window.onresize = null;
    },
    watch: {
        screenHeight: function (val) {
            let dom = document.querySelectorAll('.layout');
            dom[0].style.height = val + "px";
            dom[1].style.height = val + "px";
        }
    }
}
</script>
