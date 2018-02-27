<style lang="less">
   @import './prod-truck-bill.less';
</style>

<template>
	<div class="table-component-common">
        <div style="display: inline-block; margin-right: 15px;">
            <Button type="primary" @click="truckData()" icon="plus">产品装车单</Button>
        </div>
        <Card class="margin-bottom-10 margin-top-10 padding-top-bottom-minish">
            <div class="select-col">
                <div class="div">
                    <label for="for" align="middle" class="label">产品类别</label>
                    <Select v-model="material" class="select li-width">
                        <Option v-for="item in goodsList" :value="item.id" :key="item.value">{{item.value}}</Option>
                    </Select>
                </div>
                <div class="div">
                    <label class="label">订货单位</label>
                    <Select v-model="user"  class="select">
                        <Option :value="0">全部</Option>
                        <Option v-for="item in useCmpList" :value="item.id" :key="item.value">{{ item.value }}</Option>
                    </Select>
                </div>
                <div class="div">
                    <label class="label">起始日期</label>
                    <DatePicker placement="bottom-end" :options="options" placeholder="选择日期" :value="startDate"  @on-change="dateFormatStart"></DatePicker>
                </div>
                <div class="div">
                    <label class="label">截止日期</label>
                    <DatePicker placement="bottom-end" :options="options" placeholder="选择日期" :value="endDate" @on-change="dateFormatEnd"></DatePicker>
                </div>
                <Button type="primary" icon="ios-search" @click="btnCheck()" >查询</Button>
                <Button type="primary" icon="social-dropbox-outline" @click="clearCheck()">清空</Button>
            </div>
		</Card>
        <Card>
			<div class="margin-bottom-10" >
	            <Table class="fontSize" highlight-row size="small" border  :data="data" :columns="columns" stripe @on-row-click='haveSelected'></Table>
	        </div>
                <Page :total="total" :current="pageCurrent" @on-change="changePage" @on-page-size-change="changePageSize" show-elevator show-sizer placement='top' :transfer="true"></Page>
	      	<div style="clear: both;"></div>
        </Card>
        <!-- 录入界面弹出框 -->
        <Modal class="prod-truck-modal modal-table-form" width='900px' v-model="logModal" :mask-closable="false" :styles="{top: '0px'}">
             <p slot="header" >
                 <Icon type="compose" size='16'></Icon>
                <span>产品质量保证书</span>
            </p>
            <div class="">
                <Button type="primary"  icon="ios-upload" size="small">导出excel</Button>
                <Form ref="postData" :model="postData"  :rules="ruleStoreForm" :show-message="false" label-position="right">
                    <table class="table-common table-common-top table-common-bottom table-common-tworow small-row" cellspan="0" cellpadding="0" border="1" style="width:100%">
                        <tr class="font-size-16">
                            <td colspan="12" class="align-center">陕西延长石油材料责任有限公司</td>
                        </tr>
                        <tr >
                            <td colspan="12" class="table-title">产品装车单</td>
                        </tr>
                        <tr>
                            <td colspan="2">收货单位：</td>
                            <td colspan="4" class="align-left">
                                    <Select :transfer="true" v-model="selectedData.zCp_OrderGdCmp_ID"  :label-in-value='true'>
                                        <Option  v-for="item in useCmpList" :value="item.id" :label="item.value" :key="item.id">{{item.value}}</Option>
                                    </Select>
                            </td>
                            <td>发货单位：</td>
                            <td colspan="5" class="align-left padding-left-6">陕西延长石油材料有限责任公司</td>
                        </tr>
                        <tr>
                            <td colspan="2">收货人：</td>
                            <td colspan="4" class="align-left">
                                    <Input placeholder="请输入收货人" ></Input>
                            </td>
                            <td>发货人：</td>
                            <td colspan="5" class="align-left padding-left-6">
                                {{deliverPeoper}}
                                   <Input v-show="isShow" placeholder="请输入发货人" ></Input>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="2">电话（传真）：</td>
                            <td colspan="4" class="align-left">
                                    <Input placeholder="请输入电话" ></Input>
                            </td>
                            <td>电话（传真）：</td>
                            <td colspan="5" class="align-left padding-left-6">029-84622219</td>
                        </tr>
                        <tr>
                            <td colspan="2">承运方：</td>
                            <td colspan="4" class="align-left">
                                    <Select :transfer="true" :label-in-value='true'>
                                        <Option v-for="item in transportCmpList" :value="item.id" :label="item.value" :key="item.id">{{item.value}}</Option>
                                    </Select>
                            </td>
                            <td>API证书号：</td>
                            <td colspan="5" class="align-left padding-left-6">5CT-0815</td>
                        </tr>
                        <tr>
                            <td colspan="12" class="align-left padding-left-6">关于:我公司于 {{Inputdate}} 发往贵公司 {{logTotal}} 车，具体明细见下表。望收到请核对，如有问题请及时给予回复，谢谢合作!</td>
                        </tr>
                        <tr>
                            <td>序号</td>
                            <td>发运时间</td>
                            <td>合同号</td>
                            <td>到站</td>
                            <td colspan="2">品名</td>
                            <td>捆编号	</td>
                            <td>整车捆数</td>
                            <td>整车支数</td>
                            <td>整车吨位</td>
                            <td>整车米数</td>
                            <td>车号</td>
                        </tr>
                        <tr v-for="(item,index) in modelData2">
                            <td>{{index+1}}</td>
                            <td>{{item.zInputDate}}</td>
                            <td>{{item.xsHt_Code}}</td>
                            <td>{{item.bcOrderGdCmp}}</td>
                            <td colspan="2">{{item.bgCPName}} {{item.bgJsSpecifications}} {{item.bgSteelGrade}}</td>
                            <td>{{item.BundleNoStr}}</td>
                            <td>{{item.zTotalJianShu}}</td>
                            <td>{{item.zTotalNumber}}</td>
                            <td>{{item.zTotalWeight}}</td>
                            <td>{{item.zTotalLength}}</td>
                            <td>{{item.zCarNo}}</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>合计</td>
                            <td>/</td>
                            <td>/</td>
                            <td>/</td>
                            <td>/</td>
                            <td>/</td>
                            <td>{{TotalJianShu}}</td>
                            <td>{{TotalNumber}}</td>
                            <td>{{TotalWeight}}</td>
                            <td>{{TotalLength}}</td>
                            <td>/</td>
                        </tr>
                        <tr class="leader-td-style">
                            <td colspan="6" >
                                <FormItem prop="Person1" label="部门主管：" inline>
                                    <Select placement='top' :transfer='true' v-model="postData.Person1" filterable>
                                        <Option v-for="item in adminList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                    </Select>
                                </FormItem>
                            </td>
                            <td colspan="6">
                                <FormItem prop="Person2" label="经办人：" inline>
                                    <Select placement='top' :transfer='true' v-model="postData.Person2" filterable>
                                        <Option v-for="item in adminList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                    </Select>
                                </FormItem>
                            </td>
                        </tr>
                    </table>
                </Form>
            </div>
            <p slot="footer" >
                <Button type="ghost" @click="handleClose()">取消</Button>
                <Button type="primary" @click="handlesubmit('postData')">确认</Button>
            </p>
        </Modal>
	</div>
</template>
<script>
import base from '@/libs/base';

export default {
    data () {
        return {
            postData: {},
            isShow: false,
            logModal: false,//录入模态框
            rowNum: 10,
            modelData2: [],
            columns: [//首页显示表格的列
                {title: '产品类别',key: 'bgPinMing',align:"center",width: 180,},
                {title: '订货单位', key: 'bcCp_OrderGdCmp', align:"center"},
                {title: '捆数',key: 'zTotalKunShu',align:"center"},
                {title: '支数', key: 'zTotalNumber',align:"center"},
                {title: '总重', key: 'zTotalWeight',align:"center"},
                {title: '整车米数', key: 'zTotalLength', align:"center"},
                {title: '日期',key: 'zOutDate',align:"center",},
                {title: '部门主管',key: 'cpoName1',align:"center",},
                {title: '经办人',key: 'cpoName2',align:"center",}
            ],
            selectedData:[],//选中的数据
            selectedIds:[],//选中的id
            data: [],//获取主页列表的数据
            total:0,//总条数
            pageCurrent: 1,//当前页码
            pageSize: 10,//页面大小
            material:'',//选中的材料
            user:0,
            startDate: '',
            endDate: '',
            options:{//日期选项
                disabledDate(date){
                    return date.valueOf() > Date.now();
                }
            },
            //录入界面
            goodsList:[],//品名列表
            offerCmpList:[],//供货单位列表
            useCmpList:[],//使用单位列表
            transportCmpList: [],
            logData:[],
            TotalLength: '',
            TotalNumber: '',
            TotalJianShu: '',
            TotalWeight: '',
            logTotal: '',
            Inputdate: '',
            len: '',
            deliverPeoper: '',
            adminList:[],
            ruleStoreForm:{
                Person1: [
                    { required: true,message:' '}
                ],
                Person2: [
                    { required: true,message:' '}
                ],
            },
        }
    },
    methods: {
        //日期范围
        dateFormatStart(val){
            this.startDate = val;
        },
        dateFormatEnd(val){
            this.endDate = val;
        },
        truckData(){
            if(this.selectedIds.length == 0){
                this.$Message.error({duration: 5,content:'请选择一行数据'});
            }else{
                let para = {};
                
                this.TotalLength = 0;
                this.TotalNumber = 0;
                this.TotalWeight = 0;
                this.TotalJianShu = 0;
                this.logModal = true;
                this.modelData2 = [];

                if(this.rowNum > this.len){
                    for(var i = 0;i < this.rowNum;i++){
                        this.modelData2.push({});
                    }   
                }
                if(this.rowNum <= this.len){
                    for(var i = 0;i < this.len;i++){
                        this.modelData2.push({});
                    } 
                }
                
                para.ZIDIn = this.selectedIds.join(",");
                base.ajaxData('/WlCenter/Cp_Outmanage_view', para, 'GET', (res) => {
                    if(res.results){
                            res.results.forEach( (item) => {
                                if(item.zTotalJianShu) this.TotalJianShu += Number(item.zTotalJianShu);
                                if(item.zTotalNumber) this.TotalNumber += Number(item.zTotalNumber);
                                if(item.zTotalWeight) this.TotalWeight += Number(item.zTotalWeight);
                                if(item.zTotalLength) this.TotalLength += Number(item.zTotalLength);
                                if(item.zInputDate) item.zInputDate = item.zInputDate.substring(0,10);
                            });
                            let logData= res.results;
                            this.len = logData.length;
                            for(let i = 0;i < this.len; i++){
                                this.modelData2[i] = logData[i];
                                this.modelData2[i].BundleNoStr = "见产品出库清单";
                            }
                        }
                    this.logTotal = res.total;
                    this.Inputdate = this.modelData2[0].zInputDate;
                })
                base.getAdminList(this);
            }
        },
        handlesubmit(name){
            this.$refs[name].validate((valid) => {
                if (valid) {
                    let param = {};
                    let data = {};
                    let _self = this;
                    param.IDIn = this.selectedIds.join(",");
                    base.ajaxData('/WlCenter/Cp_Outmanage', param, 'GET', (res) => {
                        data = res.results;
                        if(data){
                            let len = data.length
                            for(let i=0;i<len;i++){
                                data[i].person1 = this.postData.Person1;
                                data[i].person2 = this.postData.Person2;
                                base.ajaxData('/WlCenter/Cp_Outmanage', data[i], 'PUT', (res) => {
                                    this.logModal = false;
                                    this.changePage(this.pageCurrent);
                                });
                            }
                        }
                    })
                }else{
                    this.$Message.error('请填写完整！');
                }
            })
        },
        //点击选中项的操作
        haveSelected(rowData){
            this.selectedIds = [];
            this.selectedData = rowData;
            if(this.selectedData.zOperator){
                this.deliverPeoper = this.selectedData.zOperator;
                this.isShow = false;
            }else{
                this.deliverPeoper = '';
                this.isShow = true;
            }
            let selectedIds = rowData.zgid;
            if(selectedIds.length > 0){
                this.selectedIds.push(selectedIds);
            }
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

            if(this.material) para.zcP_TyID = this.material;
            if(this.user) para.zCp_OrderGdCmp_ID = this.user;
            if(this.startDate) para['>zOutDate'] = this.startDate;
            if(this.endDate) para['zOutDate<'] = this.endDate;
            if(this.startDate && this.endDate) para.zOutDateBetween = this.startDate + ',' + this.endDate;
        
            base.ajaxData('WlCenter/Cp_LoadCarSingle_view', para, 'GET', (res) => {
                if(res.results){
                    res.results.forEach( (item) => {
                        if(item.zOutDate) item.zOutDate = item.zOutDate.substring(0,10);
                    });
                    this.data = res.results;
                    this.total = res.total;
                }
            });
        },
        clearCheck(){
            this.user = 0;
            this.startDate = '';
            this.endDate = '';
        },
        //关闭模态框
        handleClose(modal){
            this.logModal = false;
        },
        init(){
            this.btnCheck();
        } 
    },
    created(){
        this.useCmpList = [];
        this.transportCmpList = [];

        base.getGoodsList(this,108);
        base.getAjaxData(base.baseURL + 'PublicApi/bs_comminfo_view',(res) =>{
            res.results.forEach((item) => {
                if(item.comm_ID){
                    let temp = item.comm_ID.substring(0,3);
                    if(temp == 102) this.useCmpList.push({id:item.comm_ID,value:item.subClass_Value});
                    if(temp == 103) this.transportCmpList.push({id:item.comm_ID,value:item.subClass_Value});
                }
            })
        });
    }
};
</script>

               
