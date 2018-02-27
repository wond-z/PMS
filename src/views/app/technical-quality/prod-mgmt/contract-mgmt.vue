<style lang="less">
   @import './contract-mgmt.less';
   .width-25{
       width:25%;
   }
</style>

<template>
	<div class="table-component-common">
         <div style="display: inline-block; margin-right: 15px;">
            <Button type="primary" @click="logModal = true;logBtn()" icon="plus">录入</Button>
        </div>
        <Card class="margin-bottom-10 margin-top-10 padding-top-bottom-minish">
            <div class="select-col">
                <div class="div">
                    <label align="middle" class="label">订购产品</label>
                    <Select v-model="material" class="select">
                        <Option v-for="item in goodsList" :value="item.id" :key="item.value">{{item.value}}</Option>
                    </Select>
                </div>
                <div class="div">
                    <label class="label">订货单位</label>
                    <Select v-model="order" class="select">
                        <Option :value="0">全部</Option>
                        <Option v-for="item in offerCmpList" :value="item.id" :key="item.value">{{ item.value }}</Option>
                    </Select>
                </div>
                <div class="div">
                    <label class="label">收货单位</label>
                    <Select v-model="receive"  class="select">
                        <Option :value="0">全部</Option>
                        <Option v-for="item in useCmpList" :value="item.id" :key="item.value">{{ item.value }}</Option>
                    </Select>
                </div>
                <div class="div">
                    <label class="label">合同编号</label>
                    <Input v-model="contractNum" placeholder="请输入合同编号" class="select"></Input>
                </div>
                <div class="div">
                    <label class="label">起始日期</label>
                    <DatePicker :options="options" type="date" placement="bottom-end" placeholder="选择日期" @on-change="dateFormatStart"></DatePicker>
                </div>
                <div class="div">
                    <label class="label">截止日期</label>
                    <DatePicker :options="options" type="date" placement="bottom-end" placeholder="选择日期" @on-change="dateFormatEnd"></DatePicker>
                </div>
                <Button type="primary" icon="ios-search" @click="btnQuery()" >查询</Button>
                <Button type="primary" icon="social-dropbox-outline" @click="clearQuery()">清空</Button>
            </div>
		</Card>
        <Card>
			<div class="margin-bottom-10" >
	            <Table class="fontSize" size="small" border :loading='isLoading' :data="data" :columns="columns" stripe ref="table2image"></Table>
	        </div>
                <Page :total="total" :current="pageCurrent" @on-change="changePage" @on-page-size-change="changePageSize" show-elevator show-sizer placement='top' :transfer="true"></Page>
	      	<div style="clear: both;"></div>
        </Card>
        <!-- 录入界面弹出框 -->
        <Modal class="contract-modal modal-table-form" width='900px' v-model="logModal" :mask-closable="false" >
            <p slot="header" >
                 <Icon type="compose" size='16'></Icon>
                <span>产品订货合同</span>
            </p>
            <div>
                <Form ref="postForm" :model="postData" :rules="ruleValidate" :label-width="60" label-position="right">                
                    <table class="table-common larger-row table-common-buttom" border="1" cellspacing='0'>
                        <tr class="font-size-16">
                            <td colspan="12" style="text-align:center;">陕西延长石油材料责任有限公司</td>
                        </tr>
                        <tr>
                            <td colspan="12" class="table-title">产品订购合同</td>
                        </tr>
                        <tr>
                            <td colspan="4" class="align-left">
                                <FormItem prop="HtDate" label="日期：" inline>
                                    <DatePicker :options="options" type="date" :transfer="true" v-model="postData.HtDate"></DatePicker>
                                </FormItem>
                            </td>
                            <td colspan="5"></td>
                            <td colspan="3" class="align-right">编号：SYC/ZJ-WL-07</td>
                        </tr>
                        <tr>
                            <td rowspan="3">订货单位</td>
                            <td>名称</td>
                            <td colspan="4">
                                <FormItem prop="Cp_OrderGdCmp_ID">
                                    <Select :transfer="true" v-model="postData.Cp_OrderGdCmp_ID" class="select" @on-change='showOrderAddress'>
                                        <Option v-for="item in offerCmpList" :disabled='item.isEnable == 2' :value="item.id" :key="item.id">{{ item.value }}</Option>
                                    </Select>
                                </FormItem>
                            </td>
                            <td rowspan="3">收货单位</td>
                            <td>名称</td>
                            <td colspan="4">
                                <FormItem prop="Cp_CollectGdCmp_ID">
                                    <Select :transfer="true" v-model="postData.Cp_CollectGdCmp_ID"  class="select" @on-change='showRecAddress'>
                                        <Option v-for="item in useCmpList" :disabled='item.isEnable == 2' :value="item.id" :key="item.value">{{ item.value }}</Option>
                                    </Select>
                                </FormItem>
                            </td>
                        </tr>
                        <tr>
                            <td>地址</td>
                            <td colspan="4">{{orderAddress}}</td>
                            <td>地址</td>
                            <td colspan="4">{{recAddress}}</td>
                        </tr>
                        <tr>
                            <td>合同号</td>
                            <td colspan="4">
                                <FormItem prop="Ht_Code">
                                    <Input :maxlength="18" v-model="postData.Ht_Code" placeholder=""></Input>
                                </FormItem>
                            </td>
                            <td>运输方式</td>
                            <td colspan="4">
                                <FormItem prop="TransportMode_ID">
                                    <Select :transfer="true" v-model="postData.TransportMode_ID" >
                                        <Option v-for="item in transportList" :value="item.id" :key="item.value">{{item.value}}</Option>
                                    </Select>
                                </FormItem>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="3" class="width-25">产品名称</td>
                            <td colspan="3" class="width-25">钢级</td>
                            <td colspan="3" class="width-25">规格</td>
                            <td colspan="3" class="width-25">螺纹类型</td>
                        </tr>

                        <tr>
                            <td colspan="3">
                                <FormItem prop="CP_TyID">
                                    <Select :transfer="true" v-model="postData.cP_TyID" :label-in-value='true' @on-change='handleShowData'>
                                        <Option v-for="item in goodsList" :value="item.id" :key="item.value">{{item.value}}</Option>
                                    </Select>
                                </FormItem>
                            </td>
                            <td colspan="3">{{postShow.bgSteelGrade}}</td>
                            <td colspan="3">{{postShow.bgSpecifications}}</td>
                            <td colspan="3">{{postShow.bgThread}}</td>
                        </tr>
                        <tr>
                            <td colspan="3">长度范围（m）</td>
                            <td colspan="3">订货量（吨）</td>
                            <td colspan="3">订货金额</td>
                            <td colspan="3">交货状态</td>
                        </tr>
                        <tr>
                            <td colspan="3">9.0 ~ 10.0</td>
                            <td colspan="3">
                                <FormItem prop="OrderLiang">
                                    <Input :maxlength="12" v-model="postData.OrderLiang" placeholder=""></Input>
                                </FormItem>
                            </td>
                            <td colspan="3">
                                <FormItem prop="OrderAmount">
                                    <Input :maxlength="12" v-model="postData.OrderAmount" placeholder=""></Input>
                                </FormItem>
                            </td>
                            <td colspan="3">正火</td>
                        </tr>
                        <tr>
                            <td colspan="6">执行标准</td>
                            <td colspan="6">API Spec 5CT、5B</td>
                        </tr>
                        <tr>
                            <td>备注</td>
                            <td colspan="11">
                                <FormItem prop="Remarks">
                                    <Input :maxlength="200" v-model="postData.Remarks" :rows="4" type="textarea" ></Input>
                                </FormItem>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                经办人：
                            </td>
                            <td colspan="5">
                                 <FormItem prop="Operator" inline>
                                    <Select :transfer="true" v-model="postData.Operator">
                                        <Option v-for="item in useCmpList" :value="item.id" :key="item.value" style="width:200px">{{ item.value }}</Option>
                                    </Select>
                                </FormItem>
                            </td>
                            <td>
                                部门主管
                            </td>
                            <td colspan="5">
                                <FormItem prop="DepartmentHead" inline>
                                    <Select :transfer="true" v-model="postData.DepartmentHead">
                                        <Option v-for="item in useCmpList" :value="item.id" :key="item.value" style="width:200px">{{ item.value }}</Option>
                                    </Select>
                                </FormItem>
                            </td>
                        </tr>
                    </table>
                </Form>
            </div>
            <p slot="footer" >
                <Button type="ghost" @click="handleReset('postForm')">重置</Button>
                <!-- <Button @click="handleClose('logModal')">关闭</Button> -->
                <Button type="primary" @click="handleSubmit('postForm')">保存</Button>
            </p>
        </Modal>
	</div>
</template>
<script>
import base from '@/libs/base';

export default {
    data () {
        return {
                //验证数据
                ruleValidate: {
                    HtDate: [
                        { required: true,type:'date',message:' '}
                    ],
                    Ht_Code: [
                        { required: true,message:' '}
                    ],
                    Cp_OrderGdCmp_ID: [
                        { required: true, message: ' ', trigger: 'change' }
                    ],
                    Cp_CollectGdCmp_ID: [
                        { required: true, message: ' ', trigger: 'change' }
                    ],
                    TransportMode_ID:[
                        { required: true, message: ' ', trigger: 'change' }
                    ],
                    OrderLiang: [
                        {validator: base.floatCheck, required: true, message: ' '},
                    ],
                    OrderAmount: [
                        {validator: base.floatCheck, required: true, message: ' '}
                    ]
                },
                ruleStoreForm:{
                    InOutDate: [
                        { required: true,type:'date',message:' '}
                    ],
                    ThisNum: [
                        { required: true,message:' '}
                    ],
                    ThisWeight: [
                        { required: true,message:' ' }
                    ],
                    UnitPrice: [
                        { required: true, message: ' '}
                    ],
                    ThisAmount: [
                        { required: true, message: ' '}
                    ],
                    Bill_ID:[
                        { required: true, message: ' '}
                    ]
                },
                isLoading:false,
                //表单提交总验证
                formValid:true,
                //按钮状态
                //模态框控制
                updateModal:false,
                logModal: false,//录入模态框
                //主页面
                today:'',
                columns: [//首页显示表格的列
                    // {type: 'selection',width: 30,align:"center",},
                    {title: '合同编号',key: 'zHt_Code',align:"center",},
                    {title: '订货单位',key: 'bcCp_OrderGdCmp',align:"center",},
                    {title: '收货单位', key: 'bcCp_CollectGdCmp',align:"center"},
                    {title: '产品', key: 'bgCpPinMin',align:"center"},
                    {title: '订货量', key: 'zOrderLiang', align:"center"},
                    {title: '出货量',key: 'coOutTotalWeight',align:"center"},
                    {title: '日期',key: 'zHtDate',align:"center"},
                    {title: '完成率', key: 'finishRate',align:"center"},
                    {title: '是否完成',align:"center",key: 'handle',
                        render: (h, params) => {
                            return h('div', [
                                h('i-switch', {
                                    props: {
                                        value: params.row.zIsFinish,
                                        falseValue:1,
                                        trueValue:2
                                    },
                                    on:{
                                        'on-change':(val) =>{
                                            this.changeFinish(params.row.zid,val);
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
                    {title: '完成时间', key: 'zFinishDate',align:"center"},
                    { title: '操作', width: 120,align:"center",key: 'handle',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'warning',
                                        size: 'small'
                                    },
                                    style:{
                                        marginRight: '8px'
                                    },
                                    on: {
                                        click: () => {
                                            this.update(params.row);
                                        }
                                    }
                                }, '修改'),
                                h('Button', {
                                    props: {
                                        type: 'warning',
                                        size: 'small'
                                    },
                                    style:{
                                        marginRight: '8px'
                                    },
                                    on: {
                                        click: () => {
                                            this.remove(params.row);
                                        }
                                    }
                                }, '删除'),

                            ]);
                        }
                    }
                ],
                data: [],//获取主页列表的数据
                total:0,//总条数
                pageCurrent: 1,//当前页码
                pageSize: 10,//页面大小
                materialList:[],//原料筛选列表
                material:'',//选中的材料
                order:0, //订货
                receive:0, // 收货
                transport:'',// 运输方式
                contractNum:'', //合同编号
                transportList:[],
                options:{
                    disabledDate(date){
                        return date.valueOf() > Date.now();
                    }
                },
                dateRange:{srtart:'',end:''},//日期范围
                goodsList:[],//品名列表
                offerCmpList:[],//订/收货单位列表
                //提交数据
                postData:{
                    "id":"",
                    "Ht_Code": "",
                    "Cp_OrderGdCmp_ID": "",
                    "Cp_CollectGdCmp_ID": "",
                    "cP_TyID": "",
                    "OrderLiang": '',
                    "OrderAmount": '',
                    "TransportMode_ID": "",
                    "Operator": "",
                    "DepartmentHead": "",
                    "HtDate": "",
                    "InputDate": "",
                    "FinishDate": "",
                    "IsFinish": 1,
                    "Remarks": "",
                },
                orderAddress:'', //订货单位地址
                recAddress:'', //收货单位地址
                postShow:{
                    bgSteelGrade:"",
                    bgSpecifications :"",
                    bgThread:''
                },
                postStatus:''
            }
    },
    computed:{
        iDate(){
            if(typeof this.toStoreBill.InOutDate === 'object'){
                return base.dateFormat(this.toStoreBill.InOutDate);
            }
        }
    },
    methods: {
        changeFinish(id,val){
            let option = '';
            if(val == 2) option = '&zFinishDate='+this.today;
            base.putAjaxData(base.baseURL + 'XsManage/Xs_Salehtmanageupd_view?id='+ id +option+'&zIsFinish=' + val,'',() => {
                this.init();
            })
        },
        logBtn(){
            this.$refs.postForm.resetFields();
            this.postStatus = 'post';
        },
        lookDeliver(){
            this.detailModal = true;
        },
        //名称显示
        showOrderAddress(id){
            let json = this.offerCmpList.find( (item,index)=>{
                if(item.id == id)return item;
            })
            this.orderAddress = json ? json.address:this.postData.Cp_OrderGdCmp_ID = '';
        },
        showRecAddress(id){
            let json = this.useCmpList.find( (item,index)=>{
                if(item.id == id)return item;
            })
            this.recAddress = json ? json.address:this.postData.Cp_CollectGdCmp_ID = '';
        },
        handleShowData(data){
            base.showGoodsInfo({
                'vm':this,
                'wpId':data.value,
                'steelGrade':'postShow.bgSteelGrade',
                'jsSpecifications':'postShow.bgSpecifications',
                'luoWenType':'postShow.bgThread',
            });
        },
        //修改
        update(data){
            this.initData();
            this.postStatus = 'update';
            for(var key in this.postData){
                let okey = key;
                key = 'z' + key;
                this.postData[okey] = data[key];
            }
            this.logModal = true;
        },
        remove(data){
            this.$Modal.confirm({
                title: '提醒消息',
                content: '<p>确定删除这条吗？</p>',
                onOk: () => {
                    base.deleteAjaxData(base.baseURL + '/XsManage/Xs_SaleHtManage?ID=' + data.zid, (e) => {
                        switch (e.errMsg) {
                            case 'ok':
                                this.$Message.success({duration: 3, content: '删除成功！'});
                                this.init();
                                break;
                            default:
                                break;
                        }
                    });
                },
                onCancel: () => {
                    this.$Message.info({duration: 5, content: '取消删除！'});
                }
            });  
        },
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
        condition(){
            let options = '';
            let date = this.dateRange;
            options += '&ZCP_TyID='+this.material;
            if(this.order)options += '&ZCp_OrderGdCmp_ID='+this.order;
            if(this.receive)options += '&ZCp_CollectGdCmp_ID='+this.receive;
            if(this.contractNum != '')options += '&ZHt_CodeContains='+this.contractNum;
            if(date.start && date.end){
                date.start > date.end ? this.$Modal.warning({content: '<p>起始日期大于截至日期,条件无效</p>'}) : (options += '&ZHtDateBetween='+date.start + ',' +date.end);
            }else if(date.start){
                options += '&>ZHtDate=' + date.start;
            }else if(date.end){
                options += '&ZHtDate<=' + date.end;
            }
            return options;
        },
        //查询函数
        query(skip,take){
            let options = this.condition();
            if(skip == undefined)skip = 0;
            if(take == undefined)take = this.pageSize;
            this.isLoading = true;
            base.getAjaxData(base.baseURL+'XsManage/Xs_SaleHtManage_view?orderBy=-zID&Skip='+skip+'&take='+take+options,(res) => {
                this.data = res.results;
                this.data.forEach( (item) => {
                    if(item.zHtDate)item.zHtDate = item.zHtDate.substring(0,10);
                    item.zFinishDate && (item.zFinishDate = item.zFinishDate.substring(0,10));
                })
                this.isLoading = false;
                this.total = res.total;
                this.initData();
            });
        },
        //清空查询条件
        clearQuery(){
                this.order = 0;
                this.receive = 0;
                this.contractNum = '';
        },
        //判断对象是否为空
        isEmptyObject(obj){ 
            for(var key in obj){
                return false;
                break;
            };
            return true;
        },
        //检查不合法数据
        isTest(data){
            let len = data.length;
            let nReg = /[^0-9]+/g;
            let wReg = /^-?[1-9]\d*\.\d*$|0\.\d*[1-9]\d*$/g;
            for(var i = 0;i<len;i++){
                if( nReg.test(String(data[i].number)) ) return false;
                if( !wReg.test(String(data[i].weight)) ) return false;
            }
            return true;
        },
        // 录入提交处理
        commitLog(name,callback){
            
        },
        //重置按钮
        handleReset(name) {
            this.$refs[name].resetFields();
        },
        //保存提交按钮
        handleSubmit(name){
            this.$refs[name].validate((valid) => {
                if(valid){
                    if(this.postStatus === 'post'){
                        base.postAjaxData(base.baseURL+'XsManage/Xs_SaleHtManage',JSON.stringify(this.postData),() =>{
                            this.$Message.success({duration: 5, content:'提交成功'});
                            this.logModal = false;
                            this.init();
                            this.$refs[name].resetFields();
                        })
                    }else if(this.postStatus === 'update'){
                        base.putAjaxData(base.baseURL+'XsManage/Xs_SaleHtManage',JSON.stringify(this.postData),() =>{
                            this.$Message.success({duration: 5, content:'更改成功'});
                            this.logModal = false;
                            this.init();
                            this.$refs[name].resetFields();
                        })
                    }
                    
                }
            })
            
        },
        //关闭模态框
        handleClose(modal){
            this[modal] = false;
        },
        initData(){
            this.postData={
                "id":"",
                "Ht_Code": "",
                "Cp_OrderGdCmp_ID": "",
                "Cp_CollectGdCmp_ID": "",
                "cP_TyID": "",
                "OrderLiang": '',
                "OrderAmount": '',
                "TransportMode_ID": "",
                "Operator": "",
                "DepartmentHead": "",
                "HtDate": "",
                "InputDate": "",
                "FinishDate": "",
                "IsFinish": 1,
                "Remarks": "",
            };
            this.today = base.dateFormat( new Date())
        },
        init(){
            //数据初始化
            this.changePage(this.pageCurrent);
        }
    },
    created(){
           
            // 添加筛选选项的列表
            this.offerCmpList = [];
            this.useCmpList = [];
            this.transportList = [];
            base.getGoodsList(this,108);
            //公共信息类
            base.getAjaxData(base.baseURL + 'PublicApi/bs_comminfo_view',(res) =>{
                res.results.forEach((item) => {
                    if(item.comm_ID){
                        let temp = item.comm_ID.substring(0,3);
                        if(item.subClass_Value){
                            if(temp == 102)this.offerCmpList.push({id:item.comm_ID,value:item.subClass_Value,address:item.cmp_Adress,isEnable:item.isEnable});
                            if(temp == 109)this.transportList.push({id:item.comm_ID,value:item.subClass_Value});
                            if(temp == 114)this.useCmpList.push({id:item.comm_ID,value:item.subClass_Value,address:item.cmp_Adress,isEnable:item.isEnable});
                        }
                    }
                })
            });
    },
    watch:{
        total: function(val) {
            base.watchTotal(val, this);
        }
    }
};
</script>

               
