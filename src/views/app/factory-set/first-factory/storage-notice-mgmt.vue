<style lang="less" >
     @import './storage-notice-mgmt.less';
</style>

<template>
    <div class="table-component-common">
        <div class="margin-bottom-10">
            <div>
                <Button type="primary" @click="handleOutBill()" icon="plus">录入</Button>
                <Button type="primary" :disabled="!isToCheck" @click="toCheck" icon="reply">送检</Button>
                <Button type="primary" :disabled="!isToCancelCheck" @click="toCancelCheck" icon="forward">取消送检</Button>
                <Button type="primary" :disabled = '!isToDelete' @click="remove()" icon="trash-a">删除</Button>
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
                    <Select :transfer="true" v-model="unitSelectId" class="select" @on-change='handleProLineIds'>
                        <Option  :value="0">全部</Option>
                        <Option  v-for="item in useCmpList" :value="item.id" :key="item.id">{{item.value}}</Option>
                    </Select>
                </div>
                <div class="div">
                    <label class="label">入库序号</label>
                    <Input  class="select" v-model="storageNum" placeholder="请输入入库序号" ></Input>
                </div>
                <div class="div">
                    <label class="label">原料供货</label>
                    <Select :transfer="true" v-model="supplySelectId" class="select">
                        <Option  :value="0" >全部</Option>
                        <Option  v-for="item in offerCmpList" :value="item.id" :key="item.id" >{{ item.value }}</Option>
                    </Select>
                </div>
                <div class="div">
                    <label  class="label">起始日期</label>
                    <DatePicker :options="options" placement="bottom-end" placeholder="选择日期" class="select" @on-change='dateFormatStart'></DatePicker>
                </div>
                <div class="div">
                    <label class="label">截止日期</label>
                    <DatePicker :options="options" placement="bottom-end" placeholder="选择日期" class="select" @on-change='dateFormatEnd'></DatePicker>
                </div>
                <Button type="primary" icon="ios-search" @click="check()" >查询</Button>
            </div>
        </card>
        <card class="margin-bottom-10">
            <Table class="margin-bottom-10" size="small" border style="min-height:400px;" :columns="columns" :data="data1" highlight-row @on-row-click='mainHandleRow'></Table>
            <div>
                <Page :total="total" :current="pageCurrent" @on-change="changePage" @on-page-size-change="changePageSize" show-elevator show-sizer></Page>
            </div>
        </card>
        <!-- 录入模态框 -->
        <Modal  class="modal-table-form storage-modal" v-model="recordModal"  :mask-closable="false"  width="1000px" :styles="{top: '0px'}">
            <p slot="header" >
                <Icon type="clipboard"></Icon>
                <span>产品判定入库通知书</span>
            </p>
            <Form ref="postForm" :model="formValidate" :rules="ruleValidate" :label-width="70" inline>
                <div  class="margin-bottom-10 ">
                    <Button type="primary"  icon="plus" size="small">导出excel</Button>
                </div>
                <Card class="modal-formItem margin-bottom-10">
                    <FormItem prop='CP_TyID' label="产品类别">
                        <Select :transfer="true" v-model="formValidate.CP_TyID"  size="small" style="width:150px" @on-change ='showProName'>
                            <Option  v-for="item in goodsList" :value="item.id" :key="item.id" >{{ item.value }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem prop='CpProdCmp_ID' label="生产单位">
                        <Select :transfer="true" v-model="formValidate.CpProdCmp_ID"  :label-in-value='true' size="small" style="width:100px"  @on-change ='showUnitName'>
                            <Option  v-for="item in useCmpList" :value="item.id" :label="item.value" :key="item.id">{{item.value}}</Option>
                        </Select>
                    </FormItem>
                    <FormItem prop='Seq_Num' label="入库序号">
                        <Input   v-model="formValidate.Seq_Num" :maxlength="10" placeholder="请输入序号" size="small" style="width:100px"></Input>
                    </FormItem>
                    <FormItem prop='StoreArea' label="库区">
                        <Input   :maxlength="60" v-model="formValidate.StoreArea" placeholder="请输入库区" size="small" style="width:100px"></Input>
                    </FormItem>
                    <FormItem prop='Date' label="日期">
                        <DatePicker :transfer="true" :options='options' type="date" v-model="formValidate.Date" placement="bottom-end" placeholder="选择日期" style="width:105px" size="small" ></DatePicker>
                    </FormItem>
                </Card>
                <div class="margin-top-10">
                    <table class="table-common table-common-tworow table-common-bottom table-common-top table-common-towrow storage-table" cellspan="0" cellpadding="0" border="1" style="width:100%">
                        <tr>
                            <td colspan="14" class="table-title">产品判定入库通知书</td>
                        </tr>
                            <tr>
                                <td colspan="3">生产单位：{{prodUnitSelect}}</td>
                                <td ></td>
                                <td colspan="5">日期：{{showDate}}</td>
                                <td ></td>
                                <td colspan="4" class="align-right">编码：SYC/ZJ-JZ-19</td>
                            </tr>
                            <tr>
                                <td colspan="2">产品类别</td>
                                <td >钢级</td>
                                <td colspan="2">规格</td>
                                <td colspan="2">技术条件</td>
                                <td colspan="2">总重量kg</td>
                                <td >总长度m</td>
                                <td >总支数</td>
                                <td >总件数</td>
                                <td >入库序号</td>
                                <td >库区</td>
                            </tr>
                            <tr>
                                <td colspan="2">{{recordModalData.subClass_Value}}</td>
                                <td >{{recordModalData.steelGrade}}</td>
                                <td colspan="2" style="width:141px;">{{recordModalData.specifications}}</td>
                                <td colspan="2">API Spec5CT</td>
                                <td colspan="2">{{totalWeight}}</td>
                                <td >{{totalLength}}</td>
                                <td >{{totalNumber}}</td>
                                <td >{{totalJianShu}}</td>
                                <td >{{formValidate.Seq_Num}}</td>
                                <td >{{formValidate.StoreArea}}</td>
                            </tr>
                            <tr>
                                <td style="width:30px;"></td>
                                <td style="width:80px;">原料供货商</td>
                                <td style="width:110px;">炉号</td>
                                <td>捆数编号</td>
                                <td>捆重量kg</td>
                                <td>捆长度m</td>
                                <td style="width:40px;">支数</td>
                                <td style="width:30px;"></td>
                                <td style="width:80px;">原料供货商</td>
                                <td style="width:110px;">炉号</td>
                                <td>捆数编号</td>
                                <td>捆重量kg</td>
                                <td>捆长度m</td>
                                <td style="width:40px;">支数</td>
                            </tr>
                            <tr v-for="(item,index) in modelData2" :key="index">
                                <!-- 左 -->
                                <td>{{index+1}}</td>
                                <td>
                                    <Select @click.native="recIdsHandle(index)" :transfer='true' v-model="item.left.ylSupCmp_ID" :label-in-value='true' @on-change='storeLabel(index,$event)' placeholder=''>
                                        <Option  v-for="item in offerCmpList" :label='item.value' :value="item.id" :key="item.id" >{{ item.value }}</Option>
                                    </Select>
                                </td>
                                <td>
                                    <input @input="recIdsHandle(index)" maxlength="30" v-model="item.left.furnaceNo" type="text">
                                </td>
                                <td>
                                    <input @input="recIdsHandle(index)" v-model="item.left.bundleNo" maxlength="10" type="text" @blur="modAdd(index)">
                                </td>
                                <td>
                                    <input @input="recIdsHandle(index)" :id="'text'+index" @keydown="textFocus($event,index,1/2)" v-model="item.left.weight" maxlength="10" type="text" @focus="autoAdd(index)">
                                </td>
                                <td>
                                    <input @input="recIdsHandle(index)" :id="'text'+(index+1/2)" @keydown="textFocus($event,index+1/2,1/2)" v-model="item.left.length" maxlength="10" type="text">
                                </td>
                                <td>
                                    <input @input="recIdsHandle(index)" v-model="item.left.number" maxlength="10" type="text">
                                </td>
                                <!-- 右 -->
                                <td>{{index+rowNum+1}}</td>
                                <td>
                                    <Select @click.native="recIdsHandle(index+rowNum)" :transfer='true' v-model="item.right.ylSupCmp_ID" @on-change='storeLabel(index+rowNum,$event)' placeholder=''>
                                        <Option  v-for="item in offerCmpList" :value="item.id" :key="item.id" >{{ item.value }}</Option>
                                    </Select>
                                </td>
                                <td>
                                    <input @input="recIdsHandle(index+rowNum)" v-model="item.right.furnaceNo"  maxlength="30" type="text">
                                </td>
                                <td>
                                    <input @input="recIdsHandle(index+rowNum)" v-model="item.right.bundleNo" maxlength="10" type="text" @blur="modAdd(index+rowNum)">
                                </td>
                                <td>
                                    <input @input="recIdsHandle(index+rowNum)" :id="'text'+(index+rowNum)" @keydown="textFocus($event,index+rowNum,1/2)" v-model="item.right.weight" maxlength="10" type="text" @focus="autoAdd(index+rowNum)">
                                </td>
                                <td>
                                    <input @input="recIdsHandle(index+rowNum)" :id="'text'+(index+rowNum+1/2)" @keydown="textFocus($event,index+rowNum+1/2,1/2)" v-model="item.right.length" maxlength="10" type="text">
                                </td>
                                <td>
                                    <input @input="recIdsHandle(index+rowNum)" v-model="item.right.number" maxlength="10" type="text">
                                </td>
                            </tr>
                            <tr >
                                <td colspan="2">备注：</td>
                                <td colspan="5" ><input v-model="recordModal.Remarks" maxlength="119" type="text"></td>
                                <td colspan="2">判定结论：</td>
                                <td colspan="5" ></td>
                            </tr>
                            <tr>
                                <td colspan="7">制表人：</td>
                                <td colspan="7">判定人：</td>
                            </tr>
                        </table>
                </div>
            </Form>
            <div slot="footer">
                <Button type="ghost" @click="handleColse('recordModal')">关闭</Button>
                <Button type="primary" @click="handleSubmit('postForm')">保存</Button>
            </div>
        </Modal>

        <!-- 查看模态 -->
        <Modal  class="modal-table-form storage-modal" v-model="lookModal" :mask-closable="false"  width="1000px" :styles="{top: '0px'}">
            <p slot="header" >
                <Icon type="clipboard"></Icon>
                <span>产品判定入库通知书</span>
            </p>
            <div class="margin-top-10">
                <table class="table-common table-common-tworow table-common-bottom table-common-top table-common-towrow storage-table" cellspan="0" cellpadding="0" border="1" style="width:100%">
                    <tr>
                        <td colspan="14" class="table-title">产品判定入库通知书</td>
                    </tr>
                    <tr>
                        <td colspan="3">生产单位：{{prodUnitSelect}}</td>
                        <td ></td>
                        <td colspan="5">日期：{{showDate}}</td>
                        <td ></td>
                        <td colspan="4" class="align-right">编码：SYC/ZJ-JZ-19</td>
                    </tr>
                    <tr>
                        <td colspan="2">产品类别</td>
                        <td >钢级</td>
                        <td colspan="2">规格</td>
                        <td colspan="2">技术条件</td>
                        <td colspan="2">总重量kg</td>
                        <td >总长度m</td>
                        <td >总支数</td>
                        <td >总件数</td>
                        <td >入库序号</td>
                        <td >库区</td>
                    </tr>
                    <tr>
                        <td colspan="2">{{recordModalData.subClass_Value}}</td>
                        <td >{{recordModalData.steelGrade}}</td>
                        <td colspan="2" style="width:141px;">{{recordModalData.specifications}}</td>
                        <td colspan="2">API Spec5CT</td>
                        <td colspan="2">{{totalWeight}}</td>
                        <td >{{totalLength}}</td>
                        <td >{{totalNumber}}</td>
                        <td >{{totalJianShu}}</td>
                        <td >{{formValidate.Seq_Num}}</td>
                        <td >{{formValidate.StoreArea}}</td>
                    </tr>
                    <tr>
                        <td style="width:30px;"></td>
                        <td style="width:80px;">原料供货商</td>
                        <td style="width:110px;">炉号</td>
                        <td>捆数编号</td>
                        <td>捆重量kg</td>
                        <td>捆长度m</td>
                        <td style="width:40px;">支数</td>
                        <td style="width:30px;"></td>
                        <td style="width:80px;">原料供货商</td>
                        <td style="width:110px;">炉号</td>
                        <td>捆数编号</td>
                        <td>捆重量kg</td>
                        <td>捆长度m</td>
                        <td style="width:40px;">支数</td>
                    </tr>
                    <tr v-for="(item,index) in modelData2" :key="index">
                        <!-- 左 -->
                        <td>{{index+1}}</td>
                        <td v-text="item.left.ylSupCmpName"></td>
                        <td v-if="index == 0 || (index>0 && modelData2[index].left.furnaceNo != modelData2[index-1].left.furnaceNo)" v-text="item.left.furnaceNo"></td>
                        <td v-else></td>
                        <td v-text="item.left.bundleNo"></td>
                        <td v-text="item.left.weight"></td>
                        <td v-text="item.left.length"></td>
                        <td v-text="item.left.number"></td>
                        <!-- 右 -->
                        <td>{{index+31}}</td>
                        <td v-text="item.right.ylSupCmpName"></td>
                        <td v-if="(modelData2[0].right.furnaceNo != modelData2[24].left.furnaceNo) || (index>0 && modelData2[index].right.furnaceNo != modelData2[index-1].right.furnaceNo)" v-text="item.right.furnaceNo"></td>
                        <td v-else></td>
                        <td v-text="item.right.bundleNo"></td>
                        <td v-text="item.right.weight"></td>
                        <td v-text="item.right.length"></td>
                        <td v-text="item.right.number"></td>
                    </tr>
                    <tr >
                        <td colspan="2">备注：</td>
                        <td colspan="5" ></td>
                        <td colspan="2">判定结论：</td>
                        <td colspan="5" ></td>
                    </tr>
                    <tr>
                        <td colspan="7">制表人：</td>
                        <td colspan="7">判定人：</td>
                    </tr>
                </table>
            </div>
            <div slot="footer">
                <Button type="ghost" @click="handleColse('lookModal')" size="small">关闭</Button>
                <Button type="primary" @click="handleColse('lookModal')" size="small">确认</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
import base from '@/libs/base';

 export default {
        data () {
            return {
                max:0,
                modelData2:[],
                rowNum:30,
                lookModal:false,             // 查看模态框
                recordModal: false,          // 新增按钮--模态框
                material:"",          // 产品类别下拉框id
                unitSelectId:0,
                prodUnitSelect:'',           // 生产单位id
                storeArea:'',                // 库区
                storageNum:'',               // 入库序号
                prodClass: [],               // 第一个select下拉列表数据
                data1: [],                   // 表格数据
                recordModalData:{
                    subClass_Value:'',
                    steelGrade:'',
                    specifications:''
                },
                // 模态框数据
                skip: 0,                     // 数据起始值
                take: 10 ,                   // 一次获取的条数--一页显示的条数
                total: 100,                  // 数据总数
                pageCurrent: 1,              // 当前页
                pageSize: 10,                // 每页的数据
                columns: [                   // 表格表头/列信息
                    {key: "ylPinMing", title: "产品类别",align: 'center',width: 200},
                    {key: "cpProdCmpName", title: "生产单位",align: 'center',width: 100},
                    {key: "bcSubClass_Value", title: "原料供货单位",align: 'center' },
                    {key: "zSeq_Num", title: "入库序号",align: 'center' },
                    {key: "zTotalWeight", title: "总重量",align: 'center'},
                    {key: "zTotalLength", title: "总长度",align: 'center'},
                    {key: "zTotalJianShu", title: "总件数",align: 'center' },
                    {key: "zDecisionStatusN", title: "判定状态",align: 'center'},
                    {key: "zDate", title: "日期",align: 'center',width: 100 },
                    {key: "zOffsetStatusN", title: "冲红状态",align: 'center'},
                    {key: "zSinglePerson", title: "录入",align: 'center'},
                    {title: '操作', align:"center",key: 'handle',width: 100,
                        render: (h, params) => {
                            return h('div', [
                                 h('Button', {
                                    props: {
                                        type: 'success',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.show(params.row)
                                        }
                                    }
                                }, '查看 / 修改')
                            ]);
                        }
                    } 
                ],
               // 提交的数据
                formValidate:{
                    "ID": "",
                    "Seq_Num": "",
                    "CP_TyID": "",
                    "ylSupCmp_ID": "",
                    "CpProdCmp_ID":"",
                    "furnaceNo": "",
                    "Date": "",
                    "StoreArea": "",
                    "TotalJianShu": "",
                    "TotalNumber": "",
                    "TotalWeight": 0,
                    "TotalLength": 0,
                    "SinglePerson": "",
                    "DecisionStatus": 1,
                    "DecisionResult": "",
                    "Inspector": "",
                    "IsQualified": "",
                    "DecisionDate": "",
                    "RecordDate": "",
                    "OffsetStatus": "",
                    "Offset": "",
                    "IsLock": '',
                    "Remarks": "",
                    "Cp_ProdStoreRec": []
                },
                // 表单验证的规则
                ruleValidate: {
                    CP_TyID: [
                        { required: true, message: ' ', trigger: 'change' }
                    ],
                    CpProdCmp_ID: [
                        { required: true, message: ' '}
                    ],
                    Seq_Num: [
                        {validator: base.intCheck, required: true, message: ' ',},
                    ],
                    StoreArea: [
                        { required: true, message: ' ',},
                    ],
                    Date: [
                        { type: 'date', required: true, message: ' ',  trigger: 'blur' }
                    ],
                },
                goodsList:[],// 品名列表
                offerCmpList:[],// 生产单位列表
                useCmpList:[],// 使用单位列表
                supplySelectId:0,
                today:'',
                options:{// 日期选项
                    disabledDate(date){
                        return date.valueOf() > Date.now();
                    }
                },
                dateRange:{srtart:'',end:''},// 日期范围
                proLineIds:'',
                isToCheck:false,
                isToCancelCheck:false,
                isToDelete:false,
                selectedId:'',// 选中的id
                childUpdateIds:[],// 子数据ids
                emptyIndex:[],
                postStatus:''
            }   
        },
        computed:{
            // 日期显示
            showDate(){
                if(typeof this.formValidate.Date === 'object'){
                    return base.dateFormat(this.formValidate.Date);
                }
            },
            //总重量显示
            totalWeight(){
                let sum = 0;
                this.modelData2.forEach( (item) => {
                    if(item.left.bundleNo || item.right.bundleNo){
                        sum += (item.left.weight*1 || 0);
                        sum += (item.right.weight*1 || 0);
                    }
                });
                return sum.toFixed(3);
            },
            // 总长度显示
            totalLength(){
                let sum = 0;
                this.modelData2.forEach( (item) => {
                    if(item.left.bundleNo || item.right.bundleNo){
                        sum += (item.left.length*1 || 0);
                        sum += (item.right.length*1 || 0);
                    }
                });
                return sum.toFixed(3);
            },
            // 总支数显示
            totalNumber(){
                let sum = 0;
                this.modelData2.forEach( (item,index,data) => {
                        if(item.left.bundleNo){
                            sum += (item.left.number*1 || 0);
                        }
                        if(item.right.bundleNo){
                            sum += (item.right.number*1 || 0);
                        }
                });
                return sum.toFixed(0);
            },
            //总件数显示
            totalJianShu(){
                let sum = 0;
                this.modelData2.forEach( (item) => {
                    if(item.left.bundleNo) sum += 1;
                    if(item.right.bundleNo) sum += 1;
                });
                return sum;
            },
            // 月&日
            monthAndDay(){
                return this.today.replace(/\D/g,'').slice(2,6);
            }
        },
        methods: {
            storeLabel(index,data){
                this.towColItem(index,'ylSupCmpName',data.label);
            },
            // 存储修改行数据的id
            recIdsHandle(index){
                let id = this.towColItem(index,'id');
                if(id && this.childUpdateIds.indexOf(id) === -1) this.childUpdateIds.push(id);
            },
            textFocus(e,index,interval){
                if( e.keyCode != 13 ) return;
                const nextName = 'text' + (Number(index) + interval);
                var nextDom = document.getElementById(nextName);
                nextDom && nextDom.focus();
            },
            mainHandleRow(row){
                this.selectedId = row.id;
                switch (row.zDecisionStatus) {
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
                    default:
                        this.isToCancelCheck = false;
                        this.isToCheck = false;
                        this.isToDelete = false;
                        break;
                }
            },
            // 状态公共函数
            btnCommonFun(status,callback){
                const id = this.selectedId;
                if(!id){
                    this.$Message.warning({duration: 5, content:'请选择数据'});
                    return;
                }
                base.getAjaxData(base.baseURL+'FCManage/Cp_ProdStore?ID=' + id, (data)=>{
                    if(data.results[0].decisionStatus === status){
                        callback(data.results[0],id);
                    }else{
                        this.$Message.error({duration: 5, content:'已选的数据已不可进行当前操作！请确认判定状态！'});
                    }
                });
            },
            // 送检
            toCheck(){
                this.btnCommonFun(1, (data,id) => {
                    data.decisionStatus = 2;
                    base.putAjaxData(base.baseURL + 'FCManage/Cp_ProdStore',JSON.stringify(data),() =>{
                        this.$Message.success({duration: 5, content:'送检成功！'});
                        this.changePage(this.pageCurrent)
                        this.init();
                    });
                });
            },
            // 取消送检
            toCancelCheck(){
                this.btnCommonFun(2, (data,id) => {
                    data.decisionStatus = 1;
                    base.putAjaxData(base.baseURL + 'FCManage/Cp_ProdStore',JSON.stringify(data),() =>{
                        this.$Message.success({duration: 5, content:'取消送检成功！'});
                        this.changePage(this.pageCurrent)
                        this.init();
                    });
                });
            },
            // 生产线查找
            handleProLineIds(val){
                val ? base.getAjaxData(base.baseURL + 'PublicApi/Bs_commdep1_view?mid=' + val , (res)=>{
                    this.proLineIds = res.results[0].mChildDepID;
                }) : this.proLineIds = 0;
            },
            // 日期范围
            dateFormatStart(val){
                this.dateRange.start = val;
            },
            dateFormatEnd(val){
                this.dateRange.end = val;
            },
            // 编号自增
            autoAdd(index){
                let rowNum = this.rowNum;
                if(index-1 == this.max){
                    if(typeof this.towColItem(index-1,'bundleNo') !== 'undefined'){
                        this.towColItem(index,'bundleNo',this.autoAddFormat(this.towColItem(index-1,'bundleNo')));
                        this.towColItem(index,'number',String(this.towColItem(index-1,'number')).replace(/\D/g,''));
                        this.max = index > this.max ? index:this.max;
                    }
                }
            },
            modAdd(index){
                let rowNum = this.rowNum;
                let cur = this.towColItem(index,'bundleNo');
                this.max = index < this.max ? this.max : !cur ? index&&this.lastIndexFind(index-1) : index;// 4种情况
                if (!cur) {
                    this.modelData2[index].left = {};
                    this.emptyIndex.indexOf(index) === -1 && this.emptyIndex.push(index);
                    return;
                } else {
                    let pre = index ===0 ? this.monthAndDay : this.towColItem(index-1,'bundleNo');
                    this.towColItem(index,'bundleNo',this.formatBundleNo(cur,pre));
                    let t = this.emptyIndex.indexOf(index);
                    if( t !== -1) this.emptyIndex.splice(t,1);
                }
                for(var i = index; i < this.max; i++){
                    if (cur) {
                        this.towColItem(i+1,'bundleNo',this.autoAddFormat(this.towColItem(i,'bundleNo'),i));
                        this.recIdsHandle(i+1);
                    }
                }
            },
            // 处理两列类型表格数据
            towColItem(index,prop,val){
                const rowNum = this.rowNum;
                if(val !== undefined){
                    if(index < rowNum){
                        this.$set(this.modelData2[index].left,prop,val);
                    }else{
                        this.$set(this.modelData2[index -rowNum].right,prop,val);
                    }
                }else{
                    if(index < rowNum){
                        return this.modelData2[index].left[prop];
                    }else{
                        return this.modelData2[index -rowNum].right[prop];
                    }
                }
            },
            formatBundleNo(now,pre){
                let len = now.length;
                if(!len) return;
                let a = now;
                if(len > 5){
                    a = a.replace(/\D/g,'');
                    let date = a.substring(0,4);
                    let num = a.slice(4);
                    for(var i = num.length;i < 4;i++) num = '0' + num;
                    return date + '-' + num;
                }else{
                    if(!pre) pre = this.monthAndDay;
                    let date = pre.substring(0,4);
                    for(var i = len;i < 4;i++) a = '0' + a;
                    return date + '-' + a;
                }
            },
            lastIndexFind (val) {
                if(this.emptyIndex.indexOf(val) !== -1){
                    return this.lastIndexFind(val-1);
                }else{
                    return val;
                }
            },
            // 格式化自增数据
            autoAddFormat(a,index){
                let t = this.emptyIndex.indexOf(index)
                if( t !== -1) this.emptyIndex.splice(t,1);

                a = (a+'').replace(/\D/g,'');
                let date = a.slice(0,4) || this.monthAndDay;
                let num = a.replace(/^\d{4}/,'');
                num = (1*num + 1) + '';
                for(var i = num.length;i < 4;i++) num = '0' + num;
                return date + '-' + num;
            },
            BundleNoFormat(val){
                let num = String(val).replace(/\D/g,'');
                return num;
            },
            showBundleNo(val){
                if(val >= 1000) {
                    const date = String(val).match(/\d{4}/).toString();
                    let rlt = String(val).replace(/\d{4}/, date + '-');
                    return rlt;
                }else{
                    return val;
                }
            },
            // 产品名显示
            showProName(id){
                base.showGoodsInfo({
                    'vm':this,
                    'wpId':id,
                    'subClass_Value':'recordModalData.subClass_Value',
                    'steelGrade':'recordModalData.steelGrade',
                    'jsSpecifications':'recordModalData.specifications',
                });
            },
            // 单位显示
            showUnitName(data){
                this.prodUnitSelect = data.label;
            },
            // 点击录入
            handleOutBill(){
                this.recordModal = true;
                this.$refs.postForm.resetFields();
                this.initData();
                this.postStatus = 'post';
                this.formValidate.CP_TyID = this.material;
                this.formValidate.Date = this.today;
                this.showProName(this.material);
            },
            // 查看
            show (data) {
                data.zDecisionStatus == 1 ? this.recordModal = true:this.lookModal = true;
                this.postStatus = 'put';
                for(var key in this.formValidate){
                    let oKey =  key;
                    key = 'z' + key;
                    this.formValidate[oKey] = data[key];
                }
                this.formValidate.CP_TyID = data.zcP_TyID;
                this.formValidate.id = data.id;
                this.modelData2 = [];
                for(var i = 0;i < this.rowNum;i++){
                    this.modelData2.push({
                        left:{},
                        right:{}
                    });
                }
                base.getAjaxData(base.baseURL + 'FCManage/Cp_ProdStoreRec?orderBy=ID&cp_ProdStoreId=' + data.id,(res)=>{
                    this.childUpdateIds = [];
                    this.emptyIndex = [];
                    let resData = res.results;
                    let len = resData.length;
                    this.max = len > 0 ? len-1:0;
                    for(var i = 0;i < len;i++){
                        if(i < this.rowNum){
                            Object.assign(this.modelData2[i].left,resData[i]);
                        }else if(i >= this.rowNum){
                            Object.assign(this.modelData2[i-this.rowNum].right,resData[i]);
                        }
                        if (i > 0) {
                            if(resData[i].ylSupCmp_ID === resData[i-1].ylSupCmp_ID)this.towColItem(i,'ylSupCmp_ID','');
                            if(resData[i].furnaceNo === resData[i-1].furnaceNo)this.towColItem(i,'furnaceNo','');
                            if(resData[i].ylSupCmpName === resData[i-1].ylSupCmpName)this.towColItem(i,'ylSupCmpName','');
                        }
                        this.towColItem(i,'bundleNo',this.showBundleNo(resData[i].bundleNo));
                    };
                    this.$forceUpdate();
                });
            },
            // 子表查看商家名
            childName(id){
                if(id) {
                    let filArray = this.offerCmpList.filter( function(item,index,data){
                        if( item.id === id )return item;
                    })
                    return filArray[0].value;
                }
            },
            // 删除
            remove () {
                this.btnCommonFun(1, (data,id) => {
                    this.$Modal.confirm({
                        title: '提醒消息',
                        content: '<p>确定删除这条吗？</p>',
                        onOk: () => {
                            this.$Message.info('删除成功！');
                            base.deleteAjaxData(base.baseURL + 'FCManage/Cp_ProdStore?ID=' + id,(e)=>{
                                this.changePage(this.pageCurrent);
                            });
                        },
                        onCancel: () => {
                            this.$Message.info('您取消了删除');
                        }
                    });
                });
            },
            // 查询函数
            check(skip,take){
                let options = '';
                let date = this.dateRange;
                options = '&ZCP_TyID='+this.material;
                if(this.proLineIds) options += '&zCpProdCmp_IDIn=' + this.proLineIds;
                if(this.supplySelectId) options += '&zylSupCmp_ID=' + this.supplySelectId;
                if(this.storageNum) options += '&ZSeq_Num=' + this.storageNum;
                if(date.start && date.end){
                    date.start > date.end ? this.$Modal.warning({content: '<p>起始日期大于截至日期,条件无效</p>'}) : (options += '&ZDateBetween='+date.start + ',' +date.end);
                }else if(date.start){
                    options += '&>ZDate=' + date.start;
                }else if(date.end){
                    options += '&ZDate<=' + date.end;
                }

                if( skip == undefined ) skip = 0;
                if( take == undefined ) take = this.pageSize;   
                // 表格获取的全部数据
                base.getAjaxData(base.baseURL + 'FCManage/Cp_ProdStore_view?orderBy=-ID&Skip=' + skip + '&take=' + take + options, (e) => {
                    this.data1 = e.results;
                    this.total = e.total;
                    this.data1.forEach( (item) => {
                        if(item.zDate){
                            item.zDate = item.zDate.substring(0,10);
                        }
                    });
                })
            },
            // 分页
            changePage (index) {
                this.pageCurrent = index;          // 当前页
                let _size = this.pageSize;         // 一页显示的条数
                let _skip = (index-1)*_size;       // 偏移量--数据的起始位置
                this.check(_skip,_size);
            },
            changePageSize (size) {
                this.pageSize = size;                //一页显示的条数
                let _current = this.pageCurrent;     //当前页
                let _skip = (_current-1)*size;       // 偏移量---数据的起始位置
                this.check(_skip, size);
            },
            //判断对象是否为空
            isEmptyObject(obj){ 
                for(var key in obj){
                    return false;
                    break;
                };
                return true;
            },
            // 数据提交处理
            commitLog(name,callback){
                let isPass = true;
                let temp = [];
                this.formValidate.TotalJianShu = this.totalJianShu;
                this.formValidate.TotalNumber = this.totalNumber;
                this.formValidate.TotalWeight = this.totalWeight;
                this.formValidate.TotalLength = this.totalLength;
                this.modelData2.some( (item,index,data)=>{
                    if( item.left.bundleNo ){
                        if(!this.isTest(item.left)){
                            isPass = false;
                            return true;
                        };
                        if(index == 0){
                            if( !item.left.ylSupCmp_ID || !item.left.furnaceNo || !item.left.number || !item.left.bundleNo ||!item.left.weight||!item.left.length){
                                isPass = false;
                                return true;
                            }
                        }
                        temp.push(item.left);
                    }
                });
                isPass && this.modelData2.some( (item,index,data)=>{
                    if( item.right.bundleNo ){
                        if(!this.isTest(item.right)){
                            isPass = false;
                            return true;
                        };
                        temp.push(item.right);
                    }
                });
                if(isPass && temp.length > 0){
                    this.recordModal = false;
                    let fur = [];
                    if(temp[0].ylSupCmp_ID)this.formValidate.ylSupCmp_ID = temp[0].ylSupCmp_ID;
                    temp.forEach((item,index,data)=>{
                        if(index == 0){
                            fur.push(item.furnaceNo);
                        }else{
                            if(!item.ylSupCmp_ID){
                                item.ylSupCmp_ID = data[index-1].ylSupCmp_ID;
                            }
                            if(!item.furnaceNo){
                                item.furnaceNo = data[index-1].furnaceNo;
                            }else{
                                if(fur.indexOf(item.furnaceNo) === -1)fur.push(item.furnaceNo);
                            }
                        }
                        item.bundleNo = this.BundleNoFormat(item.bundleNo);
                        item.CpProdCmp_ID = this.formValidate.CpProdCmp_ID;
                        item.CP_TyID = this.formValidate.CP_TyID;
                        this.formValidate.Cp_ProdStoreRec.push(item);
                    })
                    this.formValidate.furnaceNo = fur.join(',');
                    callback();
                }else{
                    this.$Message.warning({duration: 5, content:'请填写完整并检查是否正确！'});
                }
            },
            //检查不合法数据
            isTest(data){
                const nReg = /[^0-9]/;
                const wReg = /^-?[1-9]\d*\.?\d*$|0\.\d*[1-9]\d*$/;
                const bReg = /^\d{4}\-?\d{4,}/;
                if( !bReg.test(String(data.bundleNo)) ) {
                    return false;
                }
                if( nReg.test(String(data.number)) ) return false;
                if( !wReg.test(String(data.weight)) ) return false;
                if( !wReg.test(String(data.length)) ) return false;
                return true;
            },
            // 保存
            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        if(this.postStatus === 'post'){
                            this.commitLog(name,() =>{
                                this.formValidate.IsLock = 1;
                                base.postAjaxData(base.baseURL + 'FCManage/Cp_ProdStore',JSON.stringify(this.formValidate),() =>{
                                    this.$Message.success('登记保存成功!');
                                    this.$refs[name].resetFields();
                                    this.init();
                                });
                            });
                        }else if(this.postStatus === 'put'){
                            this.updateSubmit(name);
                        }
                    }else {
                        this.$Message.error({duration: 5, content:'保存失败'});
                    };
                })
            },
            //更新提交
            updateSubmit(name){
                this.formValidate.DecisionStatus = 1;
                this.formValidate.Cp_ProdStoreRec = [];
                this.commitLog(name,()=>{
                    base.putAjaxData(base.baseURL + 'FCManage/Cp_ProdStore',JSON.stringify(this.formValidate),() =>{
                        let postData = [];
                        let putData = [];
                        let isUp = false;
                        this.formValidate.Cp_ProdStoreRec.forEach( (item,index)=>{
                            if(item.id){
                                const dex = this.childUpdateIds.indexOf(item.id);
                                if(dex !== -1){
                                    this.childUpdateIds.splice(dex,1);
                                    putData.push(item);
                                    isUp = true;
                                }
                            }else{
                                item.cp_ProdStoreId = this.formValidate.id;
                                postData.push(item);
                                isUp = true;
                            }
                        })
                        var pms3 = new Promise((res,rej)=>{
                            if(this.childUpdateIds.length){
                                base.recursion('delete',this.childUpdateIds,'FCManage/Cp_ProdStoreRec',()=>{res();});
                                isUp = true;
                            }else{
                                res();
                            }
                        });
                        if(!isUp){
                            this.recordModal = false;
                            this.$refs[name].resetFields();
                            this.init();
                            this.$Message.success('登记修改成功!');
                        }else{
                            var pms1 = new Promise((res,rej)=>{
                                putData.length ? base.recursion('put',putData,'FCManage/Cp_ProdStoreRec',()=>{res();}):res();
                            });
                            var pms2 = new Promise((res,rej)=>{
                                postData.length ? base.recursion('post',postData,'FCManage/Cp_ProdStoreRec',()=>{res();}):res();
                            })
                            Promise.all([pms1,pms2,pms3]).then(()=>{
                                this.$Message.success('登记修改成功!');
                                this.recordModal = false;
                                this.init();
                                this.$refs[name].resetFields();
                            }).catch(reason => { 
                                this.$Message.success({duration: 5, content:'出现错误！'});
                            });
                        }
                    });
                });
            },
            //关闭模态框
            handleColse(modal){
                this[modal] = false;
            },
            initData(){
                this.selectedId = '';
                this.modelData2 = [];
                this.emptyIndex = [];
                this.max = 0;
                for(var i = 0;i < this.rowNum;i++){
                    this.modelData2.push({
                        left:{},
                        right:{}
                    });
                }
            },
            init(){
                this.initData();
                this.changePage(this.pageCurrent);
                this.isToCheck = false;
                this.isToCancelCheck = false;
                this.isToDelete = false;
            }
        },
        created(){
            base.getGoodsList(this,108);
            // 生产单位 下拉列表数据
            base.getAjaxData(base.baseURL + 'PublicApi/bs_comminfo_view',(res) =>{
                res.results.forEach((item) => {
                    if(item.comm_ID){
                        let temp = item.comm_ID.substring(0,3);
                        if(item.subClass_Value){
                            if(item.isEnable == 1 && temp == 100)this.offerCmpList.push({id:item.comm_ID,value:item.subClass_Value});
                        }
                    }
                });
            });
            base.getAjaxData(base.baseURL + 'PublicApi/Bs_commdep1_view',(res) =>{
                res.results.forEach((item) => {
                    if(item.mid){
                        if(item.isEnable == 1 && item.mDepName){
                            this.useCmpList.push({id:String(item.mid),value:item.mDepName});
                        }
                    }
                })
            });
        },
        // 获取数据
        mounted () {
            this.today = base.dateFormat(new Date());
        }
    }
</script>
