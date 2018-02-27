<style lang="less">
   @import './quality-report-mgmt.less';
</style>

<template>
	 <div class="table-component-common">
        <card class="margin-bottom-10 margin-top-10 padding-top-bottom-minish">
            <div class="select-col">
                <div class="div">
                    <label align="middle" class="label">产品类别</label>
                    <Select v-model="material" class="select li-width" >
                        <Option v-for="item in goodsList" :value="item.id" :key="item.value">{{item.value}}</Option>
                    </Select>
                </div>
                <div class="div">
                    <label class="label">生产单位</label>
                    <Select v-model="user"  class="select">
                        <Option  :value="0">全部</Option>
                        <Option v-for="item in useCmpList" :value="item.id" :key="item.value">{{ item.value }}</Option>
                    </Select>
                </div>
                <div class="div">
                    <label class="label">序号</label>
                    <Input v-model="storeNum" placeholder="请输入序号" class="select"></Input>
                </div>
                <div class="div">
                    <label class="label">起始日期</label>
                    <DatePicker :options="options" :value='dateRange.start' placement="bottom-end" placeholder="选择日期" class="select" @on-change="dateFormatStart"></DatePicker>
                </div>
                <div class="div">
                    <label class="label">截止日期</label>
                    <DatePicker :options="options" :value='dateRange.end' placement="bottom-end" placeholder="选择日期" class="select" @on-change="dateFormatEnd"></DatePicker>
                </div>
                <Button type="primary" icon="ios-search" @click="btnQuery()" >查询</Button>
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
        <Modal  class="modal-table-form quality-report-modal" v-model="lookModal" :mask-closable="false"  width="900px" class-name="vertical-center-modal">
            <p slot="header" >
                <Icon type="clipboard"></Icon>
                <span>产品质量保证书</span>
            </p>
            <div>
                <Button type="primary" icon="ios-upload" size="small">导出excel</Button>
                <table class="table-common quality-table" cellspan="0" cellpadding="0" border="1">
                    <tr>
                       <td colspan="16">陕西延长石油材料有限公司</td>
                    </tr>
                    <tr>
                       <td colspan="16">SHAANXI YANCHANG PETROLEUM MATERIAL CO.LTD</td>
                    </tr>
                    <tr>
                       <td colspan="16">产 品 质 量 证 明 书 </td>
                    </tr>
                    <tr>
                       <td colspan="16" class="padding-buttom-10">INSPECTION CERTIFICATE</td>
                    </tr>
                    <tr>
                        <td colspan="5" class="align-left"> 订货单位：{{lookModalData.bcOrderGdCmp}}</td>
                        <td colspan="6"><label class="label">日期：</label> <DatePicker :options="options" v-model="lookDateShow" placement="bottom-end" placeholder="选择日期" style="width:100px;" @on-change='lookDateChange'></DatePicker></td>
                        <td colspan="5" class="align-right">NO.{{lookModalData.zSeq_Num}}</td>
                    </tr>
                    <tr>
                        <td colspan="2"> <p>产品类别</p> <p>Product</p> </td>
                        <td colspan="2"> {{lookModalData.bgCPName}}</td>
                        <td colspan="2"> <p>技术标准</p> <p>Spec</p> </td>
                        <td colspan="2"> {{lookModalData.zExecutionStandard}} </td>
                        <td colspan="2"> <p>合同编号</p> <p>Contract No.</p> </td>
                        <td colspan="2"> {{lookModalData.xsHt_Code}} </td>
                        <td colspan="2"> <p>交货状态</p> <p>Deliverycondition</p> </td>
                        <td colspan="2"> {{lookModalData.bgDeliveryState}} </td>
                    </tr>
                    <tr>
                        <td colspan="2">钢级</td>
                        <td colspan="2"> {{lookModalData.bgSteelGrade}} </td>
                        <td colspan="2"> <p>规 格(DxS)</p> <p>Size mm</p> </td>
                        <td colspan="2"> {{lookModalData.bgJsSpecifications}} </td>
                        <td colspan="2"> <p>总长度 m</p> <p>length</p> </td>
                        <td colspan="2"> {{lookModalData.zTotalLength}}</td>
                        <td colspan="2"> <p>螺 纹 形 式</p> <p>Type of Thread</p> </td>
                        <td colspan="2"> {{lookModalData.bgLuoWenTypeFlag}} </td>
                    </tr>
                    <tr>
                        <td colspan="2"> <p>重量（t）</p> <p>Weight</p> </td>
                        <td colspan="2"> {{lookModalData.zTotalWeight}} </td>
                        <td colspan="2"> <p>支 数</p> <p>Price</p> </td>
                        <td colspan="2"> {{lookModalData.zTotalNumber}} </td>
                        <td colspan="2"> <p> 件 数</p> <p>Bundles</p> </td>
                        <td colspan="2"> {{lookModalData.zTotalJianShu}} </td>
                        <td colspan="2"> <p> 产 品 编 号</p> <p>NO.</p> </td>
                        <td colspan="2"> <Input placeholder="见产品出库清单"></Input> </td>
                    </tr>
                    <tr>
                        <td>炉号</td>
                        <td>C</td>
                        <td>Mn</td>
                        <td>Si</td>
                        <td>P</td>
                        <td>S</td>
                        <td>Cr</td>
                        <td>Ni</td>
                        <td>Cu</td>
                        <td>Mo</td>
                        <td>Al</td>
                        <td>Bi</td>
                        <td>Sn</td>
                        <td>Pb</td>
                        <td>As</td>
                        <td>Sb</td>
                    </tr>
                    <tr v-for="item in LHParamManageData" >
                        <td>{{item.zFurnaceNo}}</td>
                        <td>{{item.zc}}</td>
                        <td>{{item.zMn}}</td>
                        <td>{{item.zSi}}</td>
                        <td>{{item.zp}}</td>
                        <td>{{item.zs}}</td>
                        <td>{{item.zCr}}</td>
                        <td>{{item.zNi}}</td>
                        <td>{{item.zCu}}</td>
                        <td>{{item.zMo}}</td>
                        <td>{{item.zAl}}</td>
                        <td>{{item.zBi}}</td>
                        <td>{{item.zSn}}</td>
                        <td>{{item.zPb}}</td>
                        <td>{{item.zAs}}</td>
                        <td>{{item.zSb}}</td>
                    </tr>
                    <tr>
                        <td colspan="7"> <p>拉伸试验(纵向)</p> <p>Tensile Test(Longitudinal)</p> </td>
                        <td colspan="4"> <p>冲击试验</p> <p>J Inpact value</p> </td>
                        <td rowspan="2"> <p>通径检验</p> <p>Drifring</p> </td>
                        <td rowspan="2"> <p>静水压试验</p> <p>H.W.P</p> </td>
                        <td rowspan="2"> <p>无损探伤</p> <p>NDE</p> </td>
                        <td rowspan="2"> <p>表面检验</p> <p>Surface</p> </td>
                        <td rowspan="2"> <p>尺寸</p> <p>Demenition</p> </td>
                    </tr>
                    <tr>
                        <td>炉号</td>
                        <td colspan="2"> <p>抗拉强度(Mpa)</p> <p>TS</p> </td>
                        <td colspan="2"> <p>屈服极限(Mpa)</p> <p>YS</p> </td>
                        <td colspan="2"> <p>伸长率,A(%)</p> E.L</td>
                        <td colspan="2"> <p>横向冲击AK</p>  Widthwise</td>
                        <td colspan="2"> <p>纵向冲击AK</p>  Lengthwise</td>
                    </tr>
                    <tr v-for="item in LHParamManageData">
                        <td>{{item.zFurnaceNo}}</td>
                        <td colspan="2">{{item.zTensileStrength}}</td>
                        <td colspan="2">{{item.zquFuLimit}}</td>
                        <td colspan="2">{{item.zElongation}}</td>
                        <td colspan="2">{{item.zTransverseImpact}}</td>
                        <td colspan="2">{{item.zLongitudinalImpact}}</td>
                        <td rowspan="rowspanNum">合格</td>
                        <td rowspan="rowspanNum">合格</td>
                        <td rowspan="rowspanNum">合格</td>
                        <td rowspan="rowspanNum">合格</td>
                        <td rowspan="rowspanNum">合格</td>
                    </tr>
                    <tr>
                        <td colspan="2"> <p>备注</p> Remark </td>
                        <td colspan="12"></td>
                        <td>车号</td>
                        <td>{{lookModalData.zCarNo}}</td>
                    </tr>
                    <tr>
                        <td colspan="16" class="align-left">地址：陕西省西安市枣园东路31(Add:No.31,Zaoyuan East Road,Xi’an,ShaanXi)  邮编(P.C)：710077 Email:153922341 @ qq.com</td>
                    </tr>
                    <tr>
                        <td colspan="16" class="align-left">电话(Tel)：(029)84622961 传真(Fax)：(029)846229619)84622961</td>
                    </tr>
                    <tr>
                        <td colspan="8" class="align-left">质量主管 ：董建平  </td>
                        <td colspan="8" class="align-right"> 判定员：彭慧  </td>
                    </tr>
                </table>
            </div>
            <div slot="footer">
                <Button type="ghost" @click="handleClose('lookModal')">取消</Button>
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
                lookModal: false,//查看
                columns: [//首页显示表格的列
                    {title: ' 序号', key: 'zSeq_Num',width: 60,align:"center"},
                    {title: '产品类别', key: 'cpPinMin',align:"center",width: 200,},
                    {title: '生产单位', key: 'depName',align:"center",width: 100,},
                    {title: '订货单位', key: 'bcOrderGdCmp', align:"center",width: 100,},
                    {title: '合同编号', key: 'xsHt_Code',align:"center",width: 100},
                    {title: '总重量', key: 'zTotalWeight', align:"center"},
                    {title: '总长度', key: 'zTotalLength', align:"center"},
                    {title: '总件数', key: 'zTotalJianShu', align:"center"},
                    {title: '出库日期', key: 'zInputDate', align:"center"},
                    {title: '判定状态', key: 'zInspectionStatusN', align:"center"},
                    {title: '操作',
                        width: 120,align:"center",
                        key: 'handle',
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
                                        click: () => {this.show(params.row)}
                                    }
                                }, '质保书')
                            ]);
                        }
                    } 
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
                material: '',
                user: 0,
                goodsList: [],
                useCmpList: [],
                dateRange:{start:'',end:''},//日期范围
                storeNum: '', 
                lookModalData: {},
                LHParamManageData: {},
                furnaceNo: [],
                rowspanNum: 0,
                lookDateShow:'',
                goodsInfor:'',
            }
    },
    methods: {
        clearQuery(){
                this.office = 0;
                this.user = 0;
                this.furnaceNo = '';
                this.dateRange.start = '';
                this.dateRange.end = '';
        },
        lookDateChange(val){
            this.lookDateShow = val;
        },
        // 查看
        show (row) {
            let newArray = [];
            let furnaceValue = ''
            this.lookModal = true;
            this.lookModalData = row;
            this.lookDateShow = this.lookModalData.zInputDate
            
            base.getAjaxData(base.baseURL + '/WlCenter/Cp_OutManageRec_view?ZCp_OutManageId=' + this.lookModalData.zid, (res)=>{
                this.furnaceNo = [];
                if(res.results.length > 0){
                    res.results.forEach((item) =>{
                        this.furnaceNo.push(item.zFurnaceNo);
                    })
                    if(this.furnaceNo){
                        this.furnaceNo.forEach((item) => {
                        if(newArray.indexOf(item) == -1) 
                            newArray.push(item);
                        })
                    }
                }else{
                    this.$Message.info({duration: 5,content:'数据为空'});
                }
                furnaceValue = newArray.join(",");
                base.getAjaxData(base.baseURL + '/ZLCheck/Zj_LHParamManage_view?ZFurnaceNoIn=' + furnaceValue, (res)=>{
                    if(res.results.length > 0){
                        res.results.forEach((item)=>{
                            item.zTransverseImpact = '合格'
                            item.zLongitudinalImpact = '合格'
                        })
                        this.LHParamManageData = res.results;
                        this.rowspanNum = res.total;
                    }else{
                        
                    }
                });
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
        btnQuery() {
            this.pageCurrent = 1;
            this.query(0, this.pageSize);
        },
        //查询函数
        query(skip,take){
            let options = '';
            let date = this.dateRange;

            options += '&ZCP_TyID='+this.material;
            if(this.user) options += '&zCpProdCmp_IDIn=' + this.user;
            if(this.storeNum) options += '&zSeq_NumContains='+ this.storeNum;
          
            if(date.start && date.end){
                date.start > date.end ? this.$Modal.warning({content: '<p>起始日期大于截至日期,条件无效</p>'}) : (options += '&zInputDateBetween='+date.start + ',' +date.end);
            }else if(date.start){
                options += '&>zInputDate=' + date.start;
            }else if(date.end){
                options += '&zInputDate<=' + date.end;
            }
            if(skip == undefined)skip = 0;
            if(take == undefined)take = this.pageSize;
            
            base.getAjaxData(base.baseURL+'WlCenter/Cp_Outmanage_view?ZInspectionStatus=3&orderBy=-ZID&Skip='+ skip +'&take=' + take + options, (res) => {
                this.data = res.results;
                this.data.forEach( (item) => {
                    if(item.zInputDate){
                       item.zInputDate = item.zInputDate.substring(0,10);
                    }
                });
                this.total = res.total;
            });
        },
        //关闭模态框
        handleClose(modal){
            this[modal] = false;
        },
    },
    created(){
        //物品信息
        this.goodsList= [];
        this.useCmpList= [];
        base.getAjaxData(base.baseURL + 'PublicApi/bs_goodsinfo_view',(bsGoods) =>{
            bsGoods.results.forEach((item) => {
                if(item.isEnable && item.pinMing && item.wp_ID){
                    let temp = item.wp_ID.substring(0,3);
                    if(temp == 108)this.goodsList.push({id:item.wp_ID,value:item.pinMing});
                }
            })
            if(!this.material) this.material = this.goodsList[0].id;
            this.query();
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
