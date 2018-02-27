<style lang="less" >
   @import './equipment-mgmt-common.less';
</style>

<template>
    <div class="table-component-common">
        <div>
            <Button type="primary" @click="logBtn()" icon="plus-round">录入</Button>
            <Button type="primary" :disabled = '!isToAudit' @click="audit()" icon="checkmark-round">审核</Button>
            <Button type="primary" :disabled = '!isToCancelAudit' @click="cancelAudit()" icon="close-round">取消审核</Button>
            <Button type="primary" :disabled = '!isToDelete' @click="deleteData()" icon="trash-a">删除</Button>
        </div>
        <Card class="select-col margin-bottom-10 padding-top-bottom-minish margin-top-10">
            <div class="div">
                <label class="label">年份</label>
                <DatePicker :options='options' type="year" v-model="Years" placeholder="选择年份" class="select"></DatePicker>
            </div>
             <div class="div">
                <label class="label">月份</label>
                <Select :transfer="true" v-model="Month" class="select">
                    <Option :value="0" >全部</Option>
                    <Option v-for="item in months" :value="item.num" :key="item.num" >{{item.value}}</Option>
                </Select>
            </div>
            
            <div class="div">
                <label class="label">材料品名</label>
                <Input v-model="stuffName" placeholder="请输入材料品名" class="select"></Input>
            </div>
            <div class="div">
                <label class="label">材料编码</label>
                <Input v-model="stuffNum" placeholder="请输入物料编码" class="select"></Input>
            </div>
            <div class="div">
                <label class="label">用途</label>
                <Input v-model="purpose" placeholder="请输入材料用途" class="select"></Input>
            </div>
            <div class="div">
                <label class="label">填报单位</label>
                <Select :transfer="true" v-model="mDepName" class="select">
                    <Option  :value="0" >全部</Option>
                    <Option  v-for="item in departList" :value="item.id" :key="item.id" >{{item.value}}</Option>
                </Select>
            </div>
            <div class="div">
                <label class="label">填报日期</label>
                <DatePicker :options='options' :value="startDate" placement="bottom-end" placeholder="选择日期" class="select" @on-change="dateStrat"></DatePicker>
            </div>
            <div class="div">
                <label class="label">至</label>
                <DatePicker :options='options' :value="endDate" placement="bottom-end" placeholder="选择日期" class="select" @on-change="dateEnd"> </DatePicker>
            </div>
            <div class="div">
                <label class="label">筛选状态</label>
                <Select v-model="state"  class="select">
                    <Option v-for="item in statesList" :value="item.num" :key="item.num">{{ item.value }}</Option>
                </Select>
            </div>
            <Button type="primary" icon="ios-search" @click="btnCheck()">查询</Button>
            <Button type="primary" icon="social-dropbox-outline" @click="clearQuery()">清空</Button>
        </Card>
        <card style="">
            <Table class="margin-bottom-10" size="small" border  style="min-height:400px;"  :data="stuffSendData"  :columns="columns" @on-selection-change='mainSelected'></Table>
            <Page :total="total" :current="pageCurrent" @on-change="changePage" @on-page-size-change="changePageSize" show-elevator show-sizer></Page>
        </card>
        <!-- 物资采购计划录入-->
        <Modal class="modal-table-form equipment-mgmt-modal" width='900px' :mask-closable="false" v-model="logModal" :styles="{top:'0px'}">
            <p slot="header" >
                <Icon type="compose" size='16'></Icon>
                <span>物资采购计划录入</span>
            </p>
            <div class="">
                <Form ref='postForm' :rules="ruleValidate" :model='inPostData' :label-width="70" inline>
                    <div  class="margin-bottom-10 ">
                        <Button type="primary"  icon="ios-upload" size="small">导出excel</Button>
                    </div>
                    <Card class="modal-formItem margin-bottom-10">
                        <FormItem label="年度" class="label-40" prop='Years'>
                            <DatePicker :options='options' type="year"  v-model="inPostData.Years" placeholder="选择年份" class="width-150"></DatePicker>
                        </FormItem>
                        <FormItem label="月份" class="label-40" prop='Month'>
                            <Select :transfer="true" v-model="inPostData.Month" class="width-150">
                                <Option  v-for="item in months" :value="item.num" :key="item.num" >{{item.value}}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="填报单位" prop='ClUseCmp_ID'>
                            <Select :transfer="true" v-model="inPostData.ClUseCmp_ID" class="width-150" :label-in-value='true' @on-change='fillUnitShow'>
                                <Option  v-for="item in departList" :value="item.id" :key="item.id" >{{item.value}}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="填报日期"  prop='SqDate'>
                            <DatePicker :options='options' v-model="inPostData.SqDate" placement="bottom-end" placeholder="选择日期" class="width-150"></DatePicker>
                        </FormItem>
                    </Card>
                    <div class="margin-top-10">
                        <h3 class="align-center margin-bottom-10">物资采购计划表</h3>
                        <table class="table-common storage-table table-common-tworow" border="1" cellspacing='0'>
                            <tr style="display:none">
                                <td class="align-center" colspan="4">物资采购计划表</td>
                            </tr>
                            <tr>
                                <td colspan="3">填报单位：{{inPostData.mDepName}}</td>
                                <td colspan="4">日期：{{sqDateShow}}</td>
                                <td colspan="3">编号：SYC/ZJ-SC-01</td>
                            </tr>
                            <tr>
                                <td>序号</td>
                                <td>品名</td>
                                <td>物料编码</td>
                                <td>型号</td>
                                <td style="width:30px">单位</td>
                                <td>申报数量</td>
                                <td>含税单价（元）</td>
                                <td style="width:30px">金额（元）</td>
                                <td>用途</td>
                                <td>备注</td>
                            </tr>
                            <tr v-for="(item,index) in modelTableData">
                                <td style="width:40px">{{index+1}}</td>
                                <td style="width:80px">
                                    <FormItem>
                                        <Select ref="remote" :transfer='true' v-model="item.CL_TyID"  placeholder='' filterable remote :remote-method="filterMethod" :loading="autoLoading" @on-change='handleAuto($event,index)' size="small" style="width:120px;">
                                            <Option v-for="(option,index) in allStuff" :value="option.zid" :label="option.zSubClass_Value" :key="index">
                                                <span class="auto-complete-title">{{ option.zid }}</span>
                                                <span class="auto-complete-title">{{ option.zSubClass_Value }}</span>
                                                <span class="auto-complete-title">{{ option.zSpecifications }}</span>
                                                <span class="auto-complete-title">{{ option.zUnit }}</span>
                                                <span class="auto-complete-title">{{ option.zSubClass_ID }}</span>
                                            </Option>
                                        </Select>
                                    </FormItem>
                                </td>
                                <td style="width:70px">{{item.CL_TyID}}</td>
                                <td style="width:150px">{{item.CSpecifications}}</td>
                                <td style="width:100px">{{item.Unit}}</td>
                                <td style="width:100px">
                                    <FormItem>
                                        <Input @input="recIdsHandle(index)" :maxlength="10" v-model="item.sqNum"></Input>
                                    </FormItem>
                                </td>
                                <td style="width:100px">
                                    <FormItem>
                                        <Input @input="recIdsHandle(index)" :maxlength="10" v-model="item.UnitPrice"></Input>
                                    </FormItem>
                                </td>
                                <td style="width:100px">{{item.Amout}}</td>
                                <td style="width:120px">
                                    <FormItem>
                                        <Input @input="recIdsHandle(index)" :maxlength="10" v-model="item.Purpose"></Input>
                                    </FormItem>
                                </td>
                                <td style="width:80px">
                                    <FormItem>
                                        <Input @input="recIdsHandle(index)" :maxlength="10" v-model="item.Remarks"></Input>
                                    </FormItem>
                                </td>
                            </tr>
                            <tr>
                                <td>合计</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td>{{totalAmout}}</td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td colspan="11" @click="addRow()">
                                    <Icon type="plus-circled" size='20' color="yellowgreen" ></Icon>
                                </td>
                            </tr>
                        </table>
                    </div>
                </Form>
            </div>
            <p slot="footer" >
                <Button type="ghost" @click="handleClose('logModal')">取消</Button>
                <Button type="primary" @click="toSubmit('postForm')">保存</Button>
            </p>
        </Modal>
    </div>
</template>

<script>
import base from '@/libs/base';
import Cookies from 'js-cookie';

 export default {
    data () {
        return {
            space:' ',
            totalAmout: '',
            rowID: '',
            rownum: 16,
            modelTableData: [],
            model11: '',
            loading1: false,
            stuffNameList: [],
            stuffNum: '',

            Month: 0,
            Years: '',
            allStuff: [],
            autoLoading: false,
            isToAudit: false,
            isToCancelAudit: false,
            isToRatify: false,
            isToCancelRatify: false,
            isToDelete: false,
            logModal: false,
            stuffSendData: [],
            data: [],
            lookDate: [],
            editData: [],

            today:'',
            total: 0,
            pageCurrent: 1,
            pageSize: 10,
            skip: 0,
            startDate: '',
            endDate: '',
            stuffName: '',
            purpose: '',
            state: 0,
            mDepName: 0,
            options: {
                disabledDate(date){
                    return date.valueOf() > Date.now();
                }
            },
            use: 0,
            useCmpList: [],
            offerCmpList: [],
            departList: [],
            office: 0,
            statesList: [
                {num:0,value:'全部'},
                {num:1,value:'待审核'},
                {num:2,value:'已审核'},
                {num:3,value:'已批准'},
                {num:4,value:'已锁定'}
            ],
            months:[ 
                {num: "1", value: "1"},
                {num: "2", value: "2"},
                {num: "3", value: "3"},
                {num: "4", value: "4"},
                {num: "5", value: "5"},
                {num: "6", value: "6"},
                {num: "7", value: "7"},
                {num: "8", value: "8"},
                {num: "9", value: "9"},
                {num: "10", value: "10"},
                {num: "11", value: "11"},
                {num: "12", value: "12"}
            ],
            columns: [//首页显示表格的列
                {type: 'selection',align:"center",width: 30},
                {title: '物料编码', key: 'zcL_TyID',align:"center",width: 80,editable: true},
                {title: '品名', key: 'cPinMin',align:"center",width: 120},
                {title: '规格', key: 'cSpecifications',align:"center",width: 150},
                {title: '申请数量', key: 'zsqNum', align:"center",width: 90},
                {title: '实采数量', key: 'zPlanNum', align:"center",width: 90},
                {title: '单位', key: 'zUnit',align:"center",width: 90},
                {title: '含税单价（元）', key: 'zUnitPrice',align:"center",width:100},
                {title: '金额（元）', key: 'amout',align:"center",width: 100},
                {title: '填报单位', key: 'zclUseCmp',align:"center",width: 120},
                {title: '填报日期', key: 'zsqDate',align:"center",width: 100},
                {title: '用途', key: 'zPurpose',align:"center",width: 100},
                {title: '状态', key: 'zspStatusN',align:"center",width: 50,fixed: 'right'},
                {title: '操作', key: '',align:"center",width:60,fixed: 'right',
                    render:(h,params) => {
                        return h('div',[
                            h('Button',{
                                props:{
                                    type: 'success',
                                    size: 'small',
                                },
                                on:{
                                    click: () => {
                                        this.update(params.row.zid,params.row.zuid,1);
                                    }
                                }
                            },'修改')
                        ])
                    }
                },
            ],
            inPostData:{},
            inPostReference: {
                "Years": "",
                "Month": "",
                "ClUseCmp_ID": "",
                "SqDate": "",
            },
            ruleValidate:{
                Years: [
                    { required: true,type:'date', message:' ' }
                ],
                ClUseCmp_ID: [
                    { required: true,message:' ' }
                ],
                Month: [
                    { required: true,message:' ' }
                ],
                SqDate: [
                    { required: true, message: ' ' }
                ]
            },
            logDetail:[],
            selectedIds:[],
            isUpdate :false,
            postStatus:'',
            recUpIds:[]//修改数据id
        }
    },
    computed:{
        sqDateShow(){
            return base.dateFormat(new Date(this.inPostData.SqDate));
        }
    },
    methods: {
        // 存储修改行数据的id
        recIdsHandle(index){
            let id;
            if( (id = this.modelTableData[index].Id) && this.recUpIds.indexOf(id) === -1)this.recUpIds.push(id);
        },
        // 审核
        audit(){
            this.btnCommonFun('put',1,2,()=>{
                this.$Message.success({duration: 3, content:'审核成功！'});
                this.init();
            })
        },
        // 取消审核
        cancelAudit(){
            this.btnCommonFun('put',2,1,()=>{
                this.$Message.success({duration: 3, content:'取消审核成功！'});
                this.init();
            })
        },
        // 批准
        ratify(){
            this.btnCommonFun('put',2,3,()=>{
                this.$Message.success({duration: 3, content:'批准成功！'});
                this.init();
            })
        },
        // 取消批准
        cancelRatify(){
            this.btnCommonFun('put',3,2,()=>{
                this.$Message.success({duration: 3, content:'取消批准成功！'});
                this.init();
            })
        },
        deleteData(){
            this.$Modal.confirm({
                title: '提醒消息',
                content: '<p>确定删除这条吗？</p>',
                onOk: () => {
                    this.btnCommonFun('delete',1,'',()=>{
                        this.$Message.info({duration: 3, content:'删除成功！'});
                        this.init();
                    })
                },
                onCancel: () => {
                    this.$Message.info('您取消了删除');
                }
            });
        },
        //检查状态函数
        btnCommonFun(type,spStatus,upStatus,callback){
            const ids = this.selectedIds;
            ids.length && base.getAjaxData(base.baseURL+'WlCenter/Cl_BuyPlanrec?IDIn=' + ids.join(','), (data)=>{
                const len = data.results.length;
                if(!len){
                    this.$Message.error({duration: 5, content:'已选的数据已不存在！'});
                    return;
                }
                for(var i = 0; i < len; i++){
                    if(data.results[i].spStatus !== spStatus){
                        this.$Message.error({duration: 5, content:'已选的第【'+ (i+1)+'】条数据不可进行当前操作！请重新查询，确认对应状态！'});
                        return;
                    }else if(type === 'put'){
                        data.results[i].spStatus = upStatus;
                    }
                }
                if(type === 'test'){
                    callback();
                    return;
                }
                base.recursion(type,data.results,'WlCenter/Cl_BuyPlanrec',callback);
            });
        },
        fillUnitShow(data){
            this.inPostData.mDepName = data.label;
        },
        //检查不合法数据
        isTest(data){
            const nReg = /[^0-9]/;
            const wReg = /^-?[1-9]\d*\.?\d*$|0\.\d*[1-9]\d*$/;
            if( nReg.test(String(data.sqNum)) ) return false;
            if( !wReg.test(String(data.UnitPrice)) ) return false;
            return true;
        },
        commitLog(name,callback){
            let isPass = true;
            let temp = [];
            this.modelTableData.some( (item,index,data)=>{
                if( item.CL_TyID ){
                    if(!this.isTest(item)){
                        isPass = false;
                        return true;
                    };
                    if( !item.Purpose || !item.sqNum || !item.UnitPrice){
                        isPass = false;
                        return true;
                    }
                    temp.push(item);
                }
            });
            if(isPass && temp.length > 0){
                let markid;
                if(!temp[0].Uid){
                    markid = new Date().getTime();
                    let numLen = Math.ceil(Math.random()*3+3);
                    markid = 'uid' + markid +''+ Math.random().toFixed(numLen)*Math.pow(10,numLen);
                }else{
                    markid = temp[0].Uid;
                }
                temp.forEach((item,index,data)=>{
                    item.Uid = markid;
                    item.PlanNum = item.sqNum;
                })
                this.logDetail = temp;
                callback();
            }else{
                this.$Message.warning({duration: 5, content:'请填写完整并正确填写！'});
            }
        },
        toSubmit(name){
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.commitLog(name,() =>{
                        this.inPostData.Years = base.dateFormat(this.inPostData.Years).substring(0,4);
                        const len = this.logDetail.length;
                        this.logDetail.forEach( (item,index) => {
                            for(var key in this.inPostReference){
                                item[key] = this.inPostData[key];
                            }
                        })
                        if(this.postStatus === 'post'){
                            base.recursion(this.postStatus,this.logDetail,'WlCenter/Cl_BuyPlanrec',()=>{
                                this.logModal = false;
                                this.$Message.success('录入成功!');
                                this.$refs[name].resetFields();
                                this.init();
                            })
                        }else if(this.postStatus === 'put'){
                            let postData = [];
                            let putData = [];
                            let isUp = false;
                            this.logDetail.forEach( (item,index)=>{
                                if(item.Id){
                                    const dex = this.recUpIds.indexOf(item.Id);
                                    if(dex !== -1){
                                        this.recUpIds.splice(dex,1);
                                        putData.push(item);
                                        isUp = true;                                        
                                    }
                                }else{
                                    postData.push(item);
                                    isUp = true;
                                }
                            })
                            if (!isUp) {
                                this.logModal = false;
                                this.$refs[name].resetFields();
                            } else {
                                var pms1 = new Promise((res,rej)=>{
                                    putData.length ? base.recursion('put',putData,'WlCenter/Cl_BuyPlanrec',()=>{res();}):res();
                                });
                                var pms2 = new Promise((res,rej)=>{
                                    postData.length ? base.recursion('post',postData,'WlCenter/Cl_BuyPlanrec',()=>{res();}):res();
                                })
                                Promise.all([pms1,pms2]).then(()=>{
                                    this.$Message.success({duration: 5, content:'修改成功！'});
                                    this.logModal = false;
                                    this.init();
                                    this.$refs[name].resetFields();
                                }).catch(reason => { 
                                    this.$Message.success({duration: 5, content:'修改失败！'});
                                });
                            }
                        }
                    });
                } else {
                    this.$Message.error({duration: 5, content:'保存失败'});
                };
            })
        },
        handleAuto(id,index){
            if(!id || this.isUpdate)return;
            this.recIdsHandle(index);
            base.ajaxData('PublicApi/Bs_ClCateGoryRec_view?zid='+ id, '', 'GET', (e) => {
                let res;
                if( e.results && (res = e.results[0]) ){
                    this.modelTableData[index].CSpecifications = res.zSpecifications;
                    this.$set(this.modelTableData[index],'UnitPrice',res.zUnitPrice);
                    this.modelTableData[index].Unit = res.zUnit;
                    this.$forceUpdate();
                }
            });
        },
        filterMethod (query) {//期望传递其他参数
            if (query) {
                let para = {};
                /[a-z]/i.test(query) ? para['zPinYinContains'] = query:para['zSubClass_ValueContains'] = query;
                this.autoLoading = true;
                base.ajaxData('PublicApi/Bs_ClCateGoryRec_view', para, 'GET', (e) => {
                    this.autoLoading = false;
                    this.allStuff = e.results;
                })
                setTimeout(() => {
                    this.isUpdate = false;
                }, 0);
            } else {
                this.allStuff = [];
            }
        },
        addRow(){
            this.modelTableData.push({});
        },
        // 主页复选
        mainSelected(dataArray){
            let len = dataArray.length;
            if(!len) {
                this.initBtn(false);
                return;
            };
            this.initBtn(true);
            this.selectedIds = [];
            dataArray.forEach( item =>{
                this.selectedIds.push(item.zid)
            })
        },
        logBtn(){
            this.$refs.postForm.resetFields();
            this.postStatus = 'post';
            this.initRec(this.rownum);
            this.logModal = true;
            this.inPostData.SqDate = this.today;
        },
        update(id,uid,status){
            let para = {};
            para.zspStatus = status;
            if(uid){
                para.zuid = uid;
            }else{
                para.zid = id;
            }
            base.ajaxData('/WlCenter/Cl_buyplanrec_view', para, 'GET', (e) => {
                if(e.results){
                    if(!e.results.length){
                        this.$Message.error({duration: 5, content:'所选数据不可进行当前操作！请重新查询，确认对应状态！'});
                        return;
                    }
                    this.logModal = true;
                    this.isUpdate = true;
                    this.recUpIds = [];
                    this.postStatus = 'put';
                    this.initRec(Math.max(this.rownum,e.results.length));
                    e.results.forEach((item,index) => {
                        this.$refs.remote[index].setQuery(item.cPinMin);
                        for(var key in item){
                            let ikey = key.replace(/^z/,'');
                            ikey = ikey[0].toUpperCase() + ikey.slice(1);
                            this.$set(this.modelTableData[index],ikey,item[key]);
                            index === 0 && this.$set(this.inPostData,ikey,item[key]);
                        }
                        this.$set(this.modelTableData[index],'sqNum',item['zsqNum']);
                    })
                }
            });
        },
        dateStrat(val){
            this.startDate = val;
        },
        dateEnd(val){
            this.endDate = val;
        },
        clearQuery(){
            this.Years = '';
            this.Month = 0;
            this.stuffName = '';
            this.stuffNum = '';
            this.purpose = '';
            this.mDepName = 0;
            this.startDate = '';
            this.endDate = '';
            this.state = 0;
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

            if(this.Years) {
                if(this.Years.length == undefined){
                    this.Years = base.dateFormat(this.Years).substring(0,4);
                }
                para.zYears = this.Years;
            }
            if(this.Month) para.zMonth = this.Month;

            if(this.use) para.ZCLSupUseCmp_ID = this.use;
            if(this.stuffName) para.cPinMinContains = this.stuffName;
            if(this.stuffNum) para.zcL_TyIDContains = this.stuffNum;
            if(this.mDepName) para.zclUseCmp_ID = this.mDepName;
            if(this.purpose) para.zPurposeContains = this.purpose;
            if(this.state)  para.zspStatus = this.state;
            if(this.startDate) para['>zsqDate'] = this.startDate;
            if(this.endDate) para['zsqDate<'] = this.endDate;
            if(this.startDate && this.endDate) para.zsqDateBetween = this.startDate + ',' + this.endDate;

            base.ajaxData('/WlCenter/Cl_buyplanrec_view', para, 'GET', (e) => {
                if(e.results){
                    e.results.forEach((item) => {
                        if(item.zsqDate) item.zsqDate = item.zsqDate.substring(0,10);
                    })
                    this.stuffSendData = e.results;
                    this.total = e.total;
                }
            });
        },
        handleClose(modal){
            this[modal] = false;
        },
        initRec(rownum){
            this.modelTableData = [];
            for(let i=0;i<rownum;i++){
                this.modelTableData.push({})
            };
        },
        initBtn(s){
            this.isToAudit = s;
            this.isToCancelAudit = s;
            this.isToRatify = s;
            this.isToCancelRatify = s;
            this.isToDelete = s;
        },
        init(){
            this.changePage(this.pageCurrent);
            this.initBtn(false);
        }
    },
    created () {
        this.init();
        this.initRec(this.rownum);
        this.today = base.dateFormat( new Date() );
        let offerArray = [];
        let stuffArray = [];
        // 供货单位
        base.ajaxData('PublicApi/Bs_comminfo_view?isEnable=1&Comm_IDStartsWith=101', {}, 'GET', (e) => {
            if(e.results.length > 0){
                e.results.forEach((item) => {
                    offerArray.push({comm_ID:item.comm_ID,subClass_Value:item.subClass_Value});
                });
                this.offerCmpList = offerArray;
            }
        });
        // 填报单位
        base.ajaxData('/PublicApi/Sys_Deparment', {}, 'GET', (e) => {
            if(e.results.length > 0){
                e.results.forEach((item) => {
                    stuffArray.push({id:item.departmentId,value:item.name})
                })
            }
            this.departList = stuffArray;
        });
    },
    watch:{
        total: function(val) {
            base.watchTotal(val, this);
        },
        modelTableData:{
            handler(cur){
                let sum = 0;
                cur.forEach( (item)=>{
                    if(item.CL_TyID){
                        let total = item.sqNum*1 * item.UnitPrice;
                        item.Amout = total ? total.toFixed(2) : 0;
                        sum += item.Amout*1;
                    }else{
                        item.Amout = '';
                    }
                })
                this.totalAmout = sum.toFixed(2);
            },
            deep:true
        }
    }
}
</script>
