<style lang="less">
    //  @import './storage-notice-mgmt.less';
</style>

<template>
	 <div class="table-component-common">
        <card class="margin-bottom-10 padding-top-bottom-minish">
            <div class="select-col">
                <div class="div">
                    <label align="middle" class="label">订购产品</label>
                    <Select v-model="material" class="select li-width" >
                        <Option v-for="item in goodsList" :value="item.id" :key="item.value">{{item.value}}</Option>
                    </Select>
                </div>
                <div class="div">
                    <label class="label">供货单位</label>
                    <Select v-model="office" class="select" >
                        <Option  :value="0">全部</Option>
                        <Option v-for="item in offerCmpList" :value="item.id" :key="item.value">{{ item.value }}</Option>
                    </Select>
                </div>
                <div class="div">
                    <label class="label">生产单位</label>
                    <Select v-model="user" class="select" @on-change='handleProLineIds'>
                        <Option  :value="0">全部</Option>
                        <Option v-for="item in useCmpList" :value="item.id" :key="item.value">{{ item.value }}</Option>
                    </Select>
                </div>
                <div class="div">
                    <label class="label">判定状态</label>
                    <Select v-model="state" class="select">
                        <Option v-for="item in statesList" :value="item.num" :key="item.value">{{ item.value }}</Option>
                    </Select>
                </div>
                <div class="div">
                    <label class="label">入库序号</label>
                    <Input v-model="storeNum" placeholder="请输入入库序号" class="select"></Input>
                </div>
                <div class="div">
                    <label  class="label">起始日期</label>
                    <DatePicker :options="options" placement="bottom-end" :value='dateRange.start' placeholder="选择日期" class="select" @on-change="dateFormatStart"></DatePicker>
                </div>
                <div class="div">
                    <label class="label">截止日期</label>
                    <DatePicker :options="options" placement="bottom-end" :value='dateRange.end' placeholder="选择日期" class="select" @on-change="dateFormatEnd"> </DatePicker>
                </div>
                <Button type="primary" icon="ios-search" @click="btnQuery()">查询</Button>
                <Button type="primary" icon="social-dropbox-outline" @click="clearQuery()">清空</Button>
            </div>
		</card>
        <card>
			<div class="margin-bottom-10" >
	            <Table class="fontSize" size="small" border :data="data" :columns="columns" stripe ref="table2image"></Table>
	        </div>
            <Page ref='page' :total="total" :current="pageCurrent" @on-change="changePage" @on-page-size-change="changePageSize" show-elevator show-sizer placement='top'></Page>
        </card>
        <!-- 查看界面弹出框 -->
        <Modal  class="modal-table-form storage-modal" v-model="lookModal" :mask-closable="false"  width="1000px" :styles="{top: '0px'}">
            <p slot="header" >
                <Icon type="clipboard"></Icon>
                <span>产品判定入库通知书</span>
            </p>
            <div>
                <table class="margin-top-10 table-common table-common-bottom table-common-top table-common-tworow storage-table" cellspan="0" cellpadding="0" border="1" style="width:100%;">
                    <tr>
                        <td colspan="14" class="table-title">产品判定入库通知书</td>
                    </tr>
                    <tr>
                        <td colspan="3">生产单位：{{upUnitSelect}}</td>
                        <td ></td>
                        <td colspan="5">日期：{{upShowDate}}</td>
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
                        <td colspan="2">{{lookModalData.subClass_Value}}</td>
                        <td >{{lookModalData.steelGrade}}</td>
                        <td colspan="2" style="width:141px;">{{lookModalData.specifications}}</td>
                        <td colspan="2">API Spec5CT</td>
                        <td colspan="2">{{totalWeight}}</td>
                        <td >{{totalLength}}</td>
                        <td >{{totalNumber}}</td>
                        <td >{{totalJianShu}}</td>
                        <td >{{lookModalData.Seq_Num}}</td>
                        <td >{{lookModalData.StoreArea}}</td>
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
                        <td v-text="item.left.YLSupCmpName"></td>
                        <td v-if="index == 0 || (index>0 && modelData2[index].left.FurnaceNo != modelData2[index-1].left.FurnaceNo)" v-text="item.left.FurnaceNo"></td>
                        <td v-else></td>
                        <td v-text="item.left.BundleNo"></td>
                        <td v-text="item.left.Weight"></td>
                        <td v-text="item.left.Length"></td>
                        <td v-text="item.left.Number"></td>
                        <!-- 右 -->
                        <td>{{index+31}}</td>
                        <td v-text="item.right.YLSupCmpName"></td>
                        <td v-if="(modelData2[0].right.FurnaceNo != modelData2[24].left.FurnaceNo) || (index>0 && modelData2[index].right.FurnaceNo != modelData2[index-1].right.FurnaceNo)" v-text="item.right.FurnaceNo"></td>
                        <td v-else></td>
                        <td v-text="item.right.BundleNo"></td>
                        <td v-text="item.right.Weight"></td>
                        <td v-text="item.right.Length"></td>
                        <td v-text="item.right.Number"></td>
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
                <Button type="ghost" @click="handleClose('lookModal')">关闭</Button>
                <Button type="primary" @click="handleClose('lookModal')">确认</Button>
            </div>
        </Modal>
	</div>
</template>
<script>
import base from '@/libs/base';

export default {
    data () {
        return {
                lookBillData:{
                    ylPinMing:'',
                    cpProdCmpName:'',
                    bcSubClass_Value:'',
                    zFurnaceNo:'',
                    zTotalWeight:'',
                    zTotalLength:'',
                    zTotalJianShu:'',
                    zRecordDate:'',
                    zDecisionDate:'0',
                    zDecisionStatus:'',
                },
                //表单提交总验证
                formValid:true,
                //模态框控制
                lookModal:false,//查看
                columns: [//首页显示表格的列
                    // {title: ' ', width: 50,type:'index',align:"center","fixed": "left"},
                    {title: '产品类别', key: 'ylPinMing',align:"center",width: 200,},
                    {title: '生产单位', key: 'cpProdCmpName',align:"center",width: 100},
                    {title: '原料供货单位', key: 'bcSubClass_Value', align:"center",width: 100},
                    {title: '入库序号', key: 'zSeq_Num',align:"center",width: 80},
                    {title: '炉号', key: 'zFurnaceNo',align:"center",width: 100},
                    {title: '总重量', key: 'zTotalWeight', align:"center",width: 100},
                    {title: '总长度', key: 'zTotalLength', align:"center",width: 100},
                    {title: '总件数', key: 'zTotalJianShu', align:"center",width: 80},
                    {title: '日期', key: 'zDate', align:"center",width: 100},
                    {title: '检定日期', key: 'zDecisionDate', align:"center",width: 100},
                    {title: '是否合格', key: 'zDecisionStatus',width: 80,align:"center", render: () => {
                        return '合格';
                    }},
                    {
                        title: '锁定状态',
                        key: 'zIsLock',
                        width: 50,
                        align:"center",
                        fixed:"right",
                        render: (h, params) => {
                            if( params.row.zIsLock == 1){
                                return h('div', [
                                    h('Icon', {
                                        props: {
                                            type: 'unlocked',
                                            size: '18',
                                            color: 'yellowgreen'
                                        }
                                    })
                                ])
                            }
                            if( params.row.zIsLock == 2){
                                return h('div', [
                                    h('Icon', {
                                        props: {
                                            type: 'locked',
                                            size: '18',
                                            color: 'gray'
                                        }
                                    })
                                ])
                            }
                        }
                    },
                    {
                        title: '操作',
                        width: 140,align:"center",
                        key: 'handle',
                        fixed:"right",
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        size: 'small',
                                    },
                                    style:{
                                        marginRight: '8px'
                                    },
                                    on: {
                                        click: () => {
                                            this.lock(params.row);
                                        }
                                    }
                                }, '解锁 / 锁定'),
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
                                            this.show(params.row);
                                        }
                                    }
                                }, '明细')
                            ]);
                        }
                    } 
                ],
                // 表格及分页数据
                data: [],
                total: 100,
                pageCurrent: 1,
                pageSize: 10,
                skip: 0,
                //主页面
                proLineIds:'',
                options:{
                    disabledDate(date){
                        return date.valueOf() > Date.now();
                    }
                },
                material:'',
                office:0,
                user:0,
                state:0,//选中状态
                goodsList:[],//品名列表
                offerCmpList:[],//供货单位列表
                useCmpList:[],//使用单位列表
                statesList:[//状态列表
                    {num:0, value:'全部'},
                    {num:3, value:'合格'},
                    {num:2, value:'不合格'},
                ],
                dateRange:{start:'',end:''},//日期范围
                inDate:'',
                outDate:'',
                storeNum:'',  // 入库序号
                upUnitSelect:'',
                upShowDate:'',
                lookModalData:{
                    subClass_Value:'',
                    steelGrade:'',
                    specifications:'',
                    Seq_Num:'',
                    StoreArea:''
                },
                modelData2:[],
                rowNum:30,
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
        //总重量显示
        totalWeight(){
            let sum = 0;
            this.modelData2.forEach( (item) => {
                if(item.left.BundleNo || item.right.BundleNo){
                    sum += (item.left.Weight*1 || 0);
                    sum += (item.right.Weight*1 || 0);
                }
            });
            return sum.toFixed(3);
        },
        // 总长度显示
        totalLength(){
            let sum = 0;
            this.modelData2.forEach( (item) => {
                if(item.left.BundleNo || item.right.BundleNo){
                    sum += (item.left.Length*1 || 0);
                    sum += (item.right.Length*1 || 0);
                }
            });
            return sum.toFixed(3);
        },
        // 总支数显示
        totalNumber(){
            let sum = 0;
            this.modelData2.forEach( (item,index,data) => {
                    if(item.left.BundleNo){
                        sum += (item.left.Number*1 || 0);
                    }
                    if(item.right.BundleNo){
                        sum += (item.right.Number*1 || 0);
                    }
            });
            return sum.toFixed(0);
        },
        //总件数显示
        totalJianShu(){
            let sum = 0;
            this.modelData2.forEach( (item) => {
                if(item.left.BundleNo) sum += 1;
                if(item.right.BundleNo) sum += 1;
            });
            return sum;
        },
    },
    methods: {
        lock(data){
            let _self = this;
            switch (data.zIsLock) {
                case 1:
                    base.ajaxData('FCManage/Cp_ProdstoreStatUpd_view', {ID: data.id, IsLock: 2, DecisionStatus: data.zDecisionStatus}, 'put', (e) => {
                        _self.$Message.success({duration: 3, content: '锁定成功！'});
                        _self.query(this.skip, this.pageSize);
                    });
                    break;
                case 2:
                    base.ajaxData('FCManage/Cp_ProdstoreStatUpd_view', {ID: data.id, IsLock: 1, DecisionStatus: data.zDecisionStatus}, 'put', (e) => {
                        _self.$Message.success({duration: 3, content: '解锁成功！'});
                        _self.query(this.skip, this.pageSize);
                    });
                    break;
                default:
                    break;
            }
        },
        // 查看
        show (data) {
            this.lookModal = true;
            for(var key in this.formValidate){
                let oKey =  key;
                key = 'z' + key;
                this.updateData[oKey] = data[key];
            }
            this.lookModalData.subClass_Value = data.bgSubClass_Value;
            this.lookModalData.steelGrade = data.bgSteelGrade;
            this.lookModalData.specifications = data.bgSpecifications;
            this.lookModalData.Seq_Num = data.zSeq_Num;
            this.lookModalData.StoreArea = data.zStoreArea;
            this.upUnitSelect = data.cpProdCmpName;
            this.upShowDate = data.zDate;
            this.modelData2 = [];
            for(var i = 0;i < this.rowNum;i++){
                this.modelData2.push({
                    left:{},
                    right:{}
                });
            }
            base.getAjaxData(base.baseURL + 'FCManage/Cp_ProdStoreRec?orderBy=ID&cp_ProdStoreId=' + data.id,(res)=>{
                let resData = res.results;
                let len = resData.length;
                this.max = len > 0 ? len-1:0;
                for(var i = 0;i < len;i++){
                    if(i < this.rowNum){
                        this.modelData2[i].left = resData[i];
                        if(i == 0){
                            this.modelData2[i].left.YLSupCmp_ID = resData[i].ylSupCmp_ID;
                            this.modelData2[i].left.FurnaceNo = resData[i].furnaceNo;
                        }else{
                            this.modelData2[i].left.YLSupCmp_ID = resData[i].ylSupCmp_ID == resData[i-1].ylSupCmp_ID ? '':resData[i].ylSupCmp_ID;
                            this.modelData2[i].left.FurnaceNo = resData[i].furnaceNo == resData[i-1].furnaceNo ? '': resData[i].furnaceNo;
                        }
                        this.modelData2[i].left.YLSupCmpName = this.childName(this.modelData2[i].left.YLSupCmp_ID);
                        this.modelData2[i].left.BundleNo = this.showBundleNo(resData[i].bundleNo);
                        this.modelData2[i].left.Weight = resData[i].weight;
                        this.modelData2[i].left.Length = resData[i].length;
                        this.modelData2[i].left.Number = resData[i].number;
                    }else if(i >= this.rowNum){
                        this.modelData2[i-this.rowNum].right = resData[i];
                        if(i == this.rowNum){
                            this.modelData2[0].right.YLSupCmp_ID = resData[i].ylSupCmp_ID == resData[i-1].ylSupCmp_ID ? '':resData[i].ylSupCmp_ID;;
                            this.modelData2[0].right.FurnaceNo = resData[i].furnaceNo == resData[i-1].furnaceNo ? '': resData[i].furnaceNo;
                            
                        }else{
                            this.modelData2[i-this.rowNum].right.YLSupCmp_ID = resData[i].ylSupCmp_ID == resData[i-1].ylSupCmp_ID ? '':resData[i].ylSupCmp_ID;
                            this.modelData2[i-this.rowNum].right.FurnaceNo = resData[i].FurnaceNo == resData[i-1].FurnaceNo ? '': resData[i].FurnaceNo;
                        }
                        this.modelData2[i-this.rowNum].right.YLSupCmpName = this.childName(this.modelData2[i-this.rowNum].right.YLSupCmp_ID);
                        this.modelData2[i-this.rowNum].right.BundleNo = this.showBundleNo(resData[i].bundleNo);
                        this.modelData2[i-this.rowNum].right.Weight = resData[i].weight;
                        this.modelData2[i-this.rowNum].right.Length = resData[i].length;
                        this.modelData2[i-this.rowNum].right.Number = resData[i].number;
                    }
                }
                // this.modelData2 = temp;
            });
        },
        childName(id){
            if(id){
                let name = this.offerCmpList.find( function(item,index,data){
                    if( item.id == id )return item;
                })
                return name.value;
            }
        },
        showBundleNo(val){
            if(val >= 1000) {
                const date = String(val).match(/\d{4}/).toString();
                let num = String(val).replace(/\d{4}/, date + '-');
                return num;
            }else{
                return val;
            }
        },
        //日期范围
        dateFormatStart(val){
            this.dateRange.start = val;
        },
        dateFormatEnd(val){
            this.dateRange.end = val;
        },
        //生产线查找
        handleProLineIds(val){
            val ? base.getAjaxData(base.baseURL + 'PublicApi/Bs_commdep1_view?mid=' + val , (res)=>{
                this.proLineIds = res.results[0].mChildDepID;
            }) : this.proLineIds = 0;
        },
        changePage (index) {
            this.pageCurrent = index;
            let _size = this.pageSize;
            this.skip = (index - 1) * _size;
            this.query(this.skip, _size);
        },
        changePageSize (size) {
            this.pageSize = size;
            this.query(this.skip, size);
        },
        btnQuery() {
            this.pageCurrent = 1;
            this.query(0, this.pageSize);
        },
        //查询函数
        query(skip, take){
            let options = '';
            let date = this.dateRange;
            options += '&ZCP_TyID='+this.material;
            if(this.office)options += '&ZYLSupCmp_ID='+this.office;
            if(this.proLineIds) options += '&zCpProdCmp_IDIn=' + this.proLineIds;
            if(this.storeNum)options += '&ZSeq_Num='+this.storeNum;
            if(this.state)options += '&ZDecisionStatus='+this.state;
            if(date.start && date.end){
                date.start > date.end ? this.$Modal.warning({content: '<p>起始日期大于截至日期,条件无效</p>'}) : (options += '&ZDateBetween='+date.start + ',' +date.end);
            }else if(date.start){
                options += '&>ZDate=' + date.start;
            }else if(date.end){
                options += '&ZDate<=' + date.end;
            }
            if(skip == undefined)skip = 0;
            if(take == undefined)take = this.pageSize;
            base.getAjaxData(base.baseURL + 'FCManage/Cp_ProdStore_view?orderBy=-ID&ZDecisionStatus=3&Skip=' + skip + '&take=' + take + options, (res) => {
                this.data = res.results;
                //对一些字段进行处理
                this.data.forEach( (item) => {
                   
                    if(item.zDate){
                       item.zDate = item.zDate.substring(0,10);
                    }
                    if(item.zDecisionDate){
                       item.zDecisionDate = item.zDecisionDate.substring(0,10);
                    }
                });
                this.total = res.total;
            });
        },
        //清空查询条件
        clearQuery(){
            this.office = 0;
            this.user = 0;
            this.state = 0;
            this.storeNum = '';
            this.dateRange.start = '';
            this.dateRange.end = '';
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
