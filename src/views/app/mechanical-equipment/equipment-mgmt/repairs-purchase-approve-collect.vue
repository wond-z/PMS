<style lang="less" >
   @import './equipment-mgmt-common.less';
</style>

<template>
    <div class="table-component-common">
        <div>
            <Button type="primary" :disabled = '!isToRatify' @click="ratify()" icon="paintbrush">批准</Button>
            <Button type="primary" :disabled = '!isToCancelRatify' @click="cancelRatify()" icon="ios-color-wand-outline">取消批准</Button>
            <Button type="primary" @click="summarize()" icon="aperture">采购汇总表</Button>
        </div>
        <Card class="select-col margin-bottom-10 padding-top-bottom-minish margin-top-10">
            <div class="div">
                <label class="label">年份</label>
                <DatePicker :options='options' type="year" v-model="Years" placeholder="选择年份" class="select"></DatePicker>
            </div>
            <div class="div">
                <label class="label">月份</label>
                <Select :transfer="true" v-model="Month" class="select">
                    <Option  :value="0" >全部</Option>
                    <Option  v-for="item in months" :value="item.num" :key="item.num" >{{item.value}}</Option>
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
            <Table class="margin-bottom-10" size="small" border  style="min-height:400px;" :data="stuffSendData"  :columns="renderColumns" @on-selection-change='mainSelected' @on-row-click="rowClick"></Table>
            <Page :total="total" :current="pageCurrent" @on-change="changePage" @on-page-size-change="changePageSize" show-elevator show-sizer></Page>
        </card>
        <Modal class="modal-table-form equipment-mgmt-modal" width='80%' :mask-closable="false" v-model="collectModal" :styles="{top:'0px'}">
            <p slot="header" >
                <Icon type="compose" size='16'></Icon>
                <span>物资采购汇总</span>
            </p>
            <div class="">
                <div class="equipment-mgmt">
                    <Button type="primary" :disabled = '!isToCollect' icon="ios-color-filter-outline" @click="toCollect()">采购汇总</Button>
                    <Button type="primary" icon="ios-upload">导出</Button>
                    <Button type="primary" :disabled = '!isToDelete' icon="trash-a" @click="toDeleteData()">删除</Button>
                    
                    <Card class="select-col margin-bottom-10 margin-top-10 padding-top-bottom-minish">
                        <div class="div">
                            <label class="label">年份</label>
                            <DatePicker :options='options' type="year"  v-model="collectYears" placeholder="选择年份" class="select"></DatePicker>
                        </div>
                        <div class="div">
                            <label class="label" style="width:40px">月份</label>
                            <Select :transfer="true" v-model="collectMonth" class="select">
                                <Option  :value="0" >全部</Option>
                                <Option  v-for="item in months" :value="item.num" :key="item.num" >{{item.value}}</Option>
                            </Select>
                        </div>
                        <div class="div">
                            <label class="label">材料品名</label>
                            <Input v-model="collectStuffName" placeholder="请输入材料品名" class="select"></Input>
                        </div>
                        <div class="div">
                            <label class="label">材料编码</label>
                            <Input v-model="collectStuffNum" placeholder="请输入物料编码" class="select"></Input>
                        </div>
                        <div class="div">
                            <label class="label">使用单位</label>
                            <Select :transfer="true" v-model="collectDepName" class="select">
                                <Option  :value="0" >全部</Option>
                                <Option  v-for="item in departList" :value="item.value" :key="item.value" >{{item.value}}</Option>
                            </Select>
                        </div>
                        <Button type="primary" icon="ios-search" @click="collectBtnCheck()">查询</Button>
                        <Button type="primary" icon="social-dropbox-outline" @click="collectClearQuery()">清空</Button>
                    </Card>
                    <card style="">
                        <Table class="margin-bottom-10" size="small" border  style="min-height:400px;" :data="collectData"  :columns="collectColumns" no-data-text="暂无数据"></Table>
                        <Page class="margin-bottom-10" :total="collectTotal" :current="collectPageCurrent" @on-change="collectChangePage" @on-page-size-change="collectChangePageSize" show-elevator show-sizer></Page>
                    </card>
                </div>
            </div>
            <p slot="footer" >
                <Button type="ghost" @click="handleClose('collectModal')">取消</Button>
                <Button type="primary" @click="handleClose('collectModal')">确认</Button>
            </p>
        </Modal>
    </div>
</template>

<script>
import base from '@/libs/base';
import repairsPurchasePlanMgmt from './repairs-purchase-plan-mgmt.vue';
 export default {
     extends: repairsPurchasePlanMgmt,
    data () {
        return {
            PostData: {
                "ID": "int",
                "HZID": "int",
                "UID": "",
                "Years": "",
                "Month": "",
                "CLSupCmp_ID": "",
                "CL_TyID": "int",
                "CLUseCmp_ID": "",
                "SQDate": "Date",
                "SQNum": 0,
                "PlanNum": 0,
                "UnitPrice": 0,
                "Unit": "",
                "Purpose": "",
                "SPStatus": "int",
                "Remarks": ""
            },
            collectModal: false,
            // 汇总
            collectDepName: 0,
            collectStuffName: '',
            collectStuffNum: '',
            collectMonth: '',
            collectYears: '',
            collectData: [],
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
            options: {
                disabledDate(date){
                    return date.valueOf() > Date.now();
                }
            },
            renderColumns: [//首页显示表格的列
                {type: 'selection',align:"center",width: 30},
                {title: '物料编码', key: 'zcL_TyID',align:"center",width: 80},
                {title: '品名', key: 'cPinMin',align:"center",width: 120},
                {title: '规格', key: 'cSpecifications',align:"center",width: 150},
                {title: '申请数量', key: 'zsqNum', align:"center",width: 90},
                {title: '实采数量', key: 'zPlanNum', align:"center",width: 90,
                    render:(h,params) => {
                        if( this.isInput == true && params.row.zid == this.clickId && params.index == this.rowIndex){
                            console.log(this.isInput, params.row.zid,this.clickId,params.index,this.rowIndex)
                            return h('div',[
                                h('Input',{
                                    props:{
                                        value: params.row.zPlanNum,
                                    },
                                    on:{
                                        input: (value)=>{
                                            params.row.zPlanNum =value;
                                            this.editData = params.row;
                                        }
                                    }
                                })
                            ])
                        }else{
                            return h('div',[
                                h('p',{},params.row.zPlanNum)
                            ],)
                        }
                    }
                },
                {title: '单位', key: 'zUnit',align:"center",width: 90},
                {title: '含税单价（元）', key: 'zUnitPrice',align:"center",width: 100,
                    render:(h,params) => {
                        if( this.isInput == true && params.row.zid == this.clickId && params.index == this.rowIndex){
                            return h('div',[
                                h('Input',{
                                    props:{
                                        value: params.row.zUnitPrice,
                                    },
                                    on:{
                                        input: (value)=>{
                                            params.row.zUnitPrice = value;
                                            this.editData = params.row;
                                        }
                                    }
                                })
                            ])
                        }else{
                            return h('div',[
                                h('p',{},params.row.zUnitPrice)
                            ],)
                        }
                    }
                },
                {title: '金额（元）', key: 'amout',align:"center",width: 100,
                    render:(h,params) => {
                        if( this.isInput == true && params.row.zid == this.clickId && params.index == this.rowIndex){
                            return h('div',[
                                h('Input',{
                                    props:{
                                        value: params.row.amout,
                                    },
                                    on:{
                                        input: (value)=>{
                                            params.row.amout =value;
                                            this.editData = params.row;
                                        }
                                    }
                                })
                            ])
                        }else{
                            return h('div',[
                                h('p',{},params.row.amout)
                            ],)
                        }
                    }
                },
                {title: '填报单位', key: 'zclUseCmp',align:"center",width: 120},
                {title: '填报日期', key: 'zsqDate',align:"center",width: 100},
                {title: '用途', key: 'zPurpose',align:"center",width: 100},
                {title: '状态', key: 'zspStatusN',align:"center",width: 50,fixed: 'right'},
                {title: '操作', key: '',align:"center",width:60,fixed: 'right',
                    render:(h,params) => {
                        return h('div',[
                            this.isInput == true && params.row.zid == this.clickId && params.index == this.rowIndex?h('Button',{
                                props:{
                                    type: 'success',
                                    size: 'small',
                                    type: 'warning'
                                },
                                on: {
                                        click: (e) => {
                                            e.stopPropagation();
                                            this.toEditSubmit()
                                        },
                                    }
                            },'更新'):h('Button',{
                                props:{
                                    type: 'success',
                                    size: 'small',
                                },

                            },'修改')
                        ])
                    }
                },
            ],
            collectColumns:[
                {title: '物料编码', key: 'zcL_TyID',align:"center"},
                {title: '年份', key: 'zYears',align:"center"},
                {title: '月份', key: 'zMonth',align:"center"},
                {title: '品名', key: 'cPinMin',align:"center"},
                {title: '规格', key: 'cSpecifications',align:"center"},
                {title: '申请数量', key: 'zsqNum', align:"center"},
                {title: '实采数量', key: 'zPlanNum', align:"center"},
                {title: '单位', key: 'zUnit',align:"center"},
                {title: '含税单价（元）', key: 'zUnitPrice',align:"center"},
                {title: '金额（元）', key: 'cgTotalAmout',align:"center"},
                {title: '使用单位', key: 'cAllCLUseCmp',align:"center"},
            ],
            collectSkip: 0,
            collectTotal: 100,
            collectPageCurrent : 1,
            collectPageSize: 10,
            isToDelete: false,
            isToCollect: false,
            isInput: false,
            planNum: '',
            rowIndex: '',
            clickId: '',
        }
    },
    methods: {
        rowClick(h,params){
            this.isInput = false;
            this.rowIndex = '';
            this.clickId = '';
            if(h.zspStatus == 2){
                console.log(h.zspStatus)
                this.isInput = true;
                this.rowIndex = params;
                this.clickId = h.zid;
                this.editData = h;
                console.log(this.rowIndex)
                console.log(this.clickId)
                console.log(this.editData)
            }else{
                this.$Message.error({duration: 3, content:'此行数据不能修改，请查看状态'});
            }
        },
        toEditSubmit(){
            this.isInput = false;
            for(var key in this.PostData){
                var oKey = key;
                key = key.replace(/^CL/,'cl');
                key = key.replace(/^SQ/,'sq');
                key = 'z' + key;
                this.PostData[oKey] = this.editData[key];
            }
            this.PostData.ID = this.editData.zid;
            console.log(this.PostData.ID);
            this.PostData.HZID = this.editData.zhzid;
            this.PostData.UID = this.editData.zuid;
            this.PostData.SPStatus = this.editData.zspStatus;
            this.PostData.CL_TyID = this.editData.zcL_TyID    
      
            base.putAjaxData(base.baseURL+'WlCenter/Cl_BuyPlanrec', JSON.stringify(this.PostData),(res)=>{
                    this.changePage(this.pageCurrent)
            });
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

            base.ajaxData('/WlCenter/Cl_buyplanrec_view?>ZSPStatus=2', para, 'GET', (e) => {
                if(e.results){
                    e.results.forEach((item) => {
                        if(item.zsqDate) item.zsqDate = item.zsqDate.substring(0,10);
                    })
                    this.stuffSendData = e.results;
                    this.total = e.total;
                }
            });
        },
        // 汇总
        summarize(){
            this.collectModal = true;
        },
        collectChangePage (index) {
            this.collectPageCurrent = index;
            let _size = this.collectPageSize;
            this.collectSkip = (index - 1) * _size;
            this.collectCheck(this.collectSkip, _size);
        },
        collectChangePageSize (size) {
            this.collectPageSize = size;
            this.collectCheck(this.collectSkip, size);
        },
        collectBtnCheck() {
            this.collectPageCurrent = 1;
            this.collectCheck(0, this.collectPageSize);
        },
        collectCheck(skip,take){
            let para = {};
            
            para.Skip = skip;
            para.Take = this.collectPageSize;

            if(this.collectYears) {
                if(this.collectYears.length == undefined) this.collectYears = base.dateFormat(this.collectYears).substring(0,4);
                para.zYears = this.collectYears;
            }
            if(this.collectMonth) para.zMonth = this.collectMonth;

            base.ajaxData('/WlCenter/Cl_buyplanhz_view', para, 'GET', (e) => {
                if(e.results.length > 0){
                    this.isToCollect = false;
                    this.isToDelete = true;
                }else{
                    this.isToDelete = false;
                    this.isToCollect = true;
                }
            });

            if(this.collectStuffName) para.cPinMinContains = this.collectStuffName;
            if(this.collectStuffNum) para.zcL_TyIDContains = this.collectStuffNum;
            if(this.collectDepName) para.cAllCLUseCmp = this.collectDepName;

            base.ajaxData('/WlCenter/Cl_buyplanhz_view', para, 'GET', (e) => {
                this.collectData = e.results;
                this.collectTotal = e.total;
                if(this.isToDelete == true && e.results.length == 0){
                    this.$Message.error({duration: 3, content:'未查询到数据，请重新选择查询条件'});
                }
            });
        },
       collectPara(){
            let para = {};
            if(this.collectYears) {
                if(this.collectYears.length == undefined) this.collectYears = base.dateFormat(this.collectYears).substring(0,4);
                para.pYear = this.collectYears;
            }
            if(this.collectMonth) para.pMonth = this.collectMonth;
            return para;
        },
        toDeleteData(){
            let para = this.collectPara();
            para.pF = 2;
            this.$Modal.confirm({
                title: '提醒消息',
                content: '<p>确定删除这条吗？</p>',
                onOk: () => {
                    base.ajaxData('/WlCenter/Cl_buyplanhzParm', para, 'GET', (e) => {
                        if(e.Results[0].Flag == "Y"){
                            this.$Message.info({duration: 3, content:'删除成功！'});
                            this.collectBtnCheck();
                            this.changePage(this.pageCurrent);
                        }
                    });     
                },
                onCancel: () => {
                    this.$Message.info('您取消了删除');
                }
            });
        },
        toCollect(){
            let para = this.collectPara();
            para.pF = 1;
            base.ajaxData('/WlCenter/Cl_buyplanhzParm', para, 'GET', (e) => {
                if(e.Results[0].Flag == "Y"){
                    this.collectBtnCheck();
                    this.changePage(this.pageCurrent);
                }
                if(e.Results[0].Flag == "S"){
                    this.$Message.error({duration: 5, content:'请先删除此时间段内的数据，在进行汇总！'});
                    this.collectBtnCheck();
                }
                if(e.Results[0].Flag == "N"){
                    this.$Message.error({duration: 5, content:'汇总时间有误，请重新选择汇总时间！'});
                    this.collectData = [];
                }
                if(e.Results[0].Flag == "P"){
                    this.$Message.error({duration: 5, content:'此时间段内没有数据'});
                    this.collectBtnCheck();
                }
            });
        },
        collectClearQuery(){
            this.collectStuffName = '';
            this.collectStuffNum = '';
            this.collectDepName = 0;
        },
    },
    created () {
        // 汇总
        let date = new Date();
        let year = base.dateFormat(date).substring(0,4);
        let month = date.getMonth();
        this.collectYears = year;
        this.collectMonth = month + 1 + '';

        this.collectCheck(0, this.collectPageSize);
    },
}
</script>
