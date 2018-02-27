<style lang="less" scoped>
//    @import './stepLog.less';
</style>
<template>
	 <div>
        <card>
            <row justify="center" >
                <!-- <Col span="6"  style="display:inline-block;">
                    <div style="">
                        <p style="font-size:20px;font-weight:700;margin:0px 10px 0px 0px;color:#666666;">原料到货记录管理</p>
                    </div>
                    
                </Col> -->
                <Col span=""  style="display:inline-block;">
                    <div style="display: inline-block; margin-right: 15px;">
		            	<i-button type="primary" @click="logModal = true;log()" icon="plus">到货登记</i-button>
                        <i-button type="primary" @click="lookModal = true;look()" icon="ios-search">查看</i-button>
                        <i-button type="primary" icon="minus">删除</i-button>
                        <i-button type="primary" icon="forward">送检</i-button>
                        <i-button type="primary" icon="reply">取消送检</i-button>
		            </div>
                </Col>
            </row>
        </card>
        <card class="margin-bottom-10 margin-top-10">
			<row justify="center" >
				<div class="margin-bottom-10">
			   		<div style="display: inline-block; margin-right: 15px;" justify="center">
		            	<label  for="for" align="middle" style="display:inline-block;width: 35px;text-align: right;">原料:</label>
				        <Select v-model="material" style="width:175px">
					        <Option v-for="item in materialList" :value="item || 0" :key="item">{{item}}</Option>
					    </Select>
		            </div>
		            <div style="display: inline-block; margin-right: 15px;">
		            	<label  for="for" style="display:inline-block; vertical-align: middle;width: 60px;text-align: right;">供货单位:</label>
				        <Select v-model="office"  style="width:175px">
					        <Option v-for="item in officeList" :value="item || 0" :key="item">{{ item }}</Option>
					    </Select>
		            </div>
		        	<div style="display: inline-block; margin-right: 15px;">
		            	<label  for="for" style="display:inline-block; vertical-align: middle;width: 60px;text-align: right;">使用单位:</label>
				        <Select v-model="user"  style="width:175px">
					        <Option v-for="item in userList" :value="item || 0" :key="item">{{ item }}</Option>
					    </Select>
		            </div>
                    <div style="display: inline-block; margin-right: 15px;">
		            	<label  for="for" style="display:inline-block; vertical-align: middle;width: 60px;text-align: right;">筛选状态:</label>
				        <Select v-model="model2"  style="width:175px">
					        <Option v-for="item in statesList" :value="item || 0" :key="item">{{ item }}</Option>
					    </Select>
		            </div>
                    
				</div>
				<div >
		        	<div style="display: inline-block; margin-right: 15px;">
		            	<label  for="for" style="display:inline-block; vertical-align: middle;width: 35px;text-align: right;">车号:</label>
				        <Select v-model="carNum"  style="width:175px">
					        <Option v-for="item in carNumList" :value="item || 0" :key="item">{{ item }}</Option>
					    </Select>
		            </div>
		        	<div style="display: inline-block; margin-right: 15px;">
		            	<label  for="for" style="display:inline-block; vertical-align: middle;width: 60px;text-align: right;">库区:</label>
				        <Select v-model="storeA"  style="width:175px">
					        <Option v-for="item in storeList" :value="item || 0" :key="item">{{ item }}</Option>
					    </Select>
		            </div>
		            <div style="display: inline-block; margin-right: 15px;">
		            	<label  for="for" style="display:inline-block; vertical-align: middle;width: 60px;text-align: right;">时间:</label>
		            	<Date-picker v-model="dateRange" type="daterange" placement="bottom-end" placeholder="选择日期" style="width:175px"></Date-picker>
		            </div>
			        <div style="display: inline-block; margin-right: 15px;">
			        	<i-button type="primary" icon="ios-search" @click="query()" >查询</i-button>
		                <i-button type="primary"  icon="social-dropbox-outline">清空</i-button>
		                <i-button type="primary"  icon="ios-upload">导出信息</i-button>
			        </div>
				</div>
			</row>
		</card>
			<div class="margin-bottom-10" >
	            <Table class="fontSize" size="small" border :data="data" :columns="columns" stripe ref="table2image" @on-selection-change='haveSelected'></Table>
	        </div>
             <Page :total="total" :current="1" @on-change="changePage" @on-page-size-change="changePageSize" show-elevator show-sizer></Page>
	      	<div style="clear: both;"></div>
        </card>
        <!-- 录入界面弹出框 -->
        <Modal width='800px' v-model="logModal" ok-text="保存" cancel-text="关闭" @on-ok="handleSubmit('postData')">
             <p slot="header" >
                 <Icon type="compose" size='16'></Icon>
                <span>管材到发货登记表</span>
            </p>
            <div class="ivu-table ivu-table-border">
                <Form ref="postData" :model="postData" :rules="ruleCustom" :label-width="80">
                    <table class="tableHeade" border="1" cellspacing='0'>
                        <tr style="display:none;font-size:24px;">
                            <td colspan="6">管材到(发)货登记表</td>
                        </tr>
                        <tr>
                            <td colspan="2">品名</td>
                            <td>规格</td>
                            <td colspan="2">供货单位</td>
                            <td>到货日期</td>
                        </tr>
                        <tr>
                            <td colspan="2"><Select @on-change='goodId'>
                                <Option v-for="item in cityList" :value="item.label" :key="item.value">{{ item.value }}</Option>
                            </Select></td>
                            <td>73.02*5.51</td>
                            <td colspan="2"><Select @on-change='offerCmpId'>
                                <Option v-for="item in offerCmpList" :value="item.id" :key="item.value">{{ item.value }}</Option>
                            </Select></td>
                            <td><DatePicker type="date" placeholder="Select date" @on-change='pickerDate'></DatePicker></td>
                        </tr>
                        <tr>
                            <td colspan="2">使用单位</td>
                            <td>存储库区</td>
                            <td>磅重一</td>
                            <td>磅重二</td>
                            <td>磅重合计</td>
                        </tr>
                        <tr>
                            <td colspan="2"><Select @on-change='useCmpId'>
                                <Option v-for="item in useCmpList" :value="item.id" :key="item.value">{{ item.value }}</Option>
                            </Select></td>
                            <td>
                                <FormItem prop="StoreArea">
                                    <Input v-model="postData.StoreArea" placeholder="" ></Input>
                                </FormItem>
                            </td>
                            <td>
                                <FormItem prop="PoundWeight1">
                                    <Input v-model="postData.PoundWeight1" placeholder="" number></Input>
                                </FormItem>
                            </td>
                            <td>
                                <Input v-model="postData.PoundWeight2" placeholder="" ></Input>
                            </td>
                            <td><span>{{PoundWeightTotle}}</span></td>
                        </tr>
                        <tr>
                            <td>车皮号</td>
                            <td>支数</td>
                            <td>质保书量</td>
                            <td colspan="3">备注</td>
                        </tr>
                        <tr>
                            <td><Input v-model="postData.CarNo" placeholder=""></Input></td>
                            <td>{{numTotle}}</td>
                            <td>{{weightTotle}}</td>
                            <td colspan="3"><Input v-model="postData.Remark" placeholder="" ></Input></td>
                        </tr>
                    </table>
                </Form>
                <Table :columns='logColumns' :data='logData'></Table>
                <div style="width:24px;margin:5px auto;">
                    <Button type="primary" shape="circle" icon="plus" size="small" :disabled="!addable" @click="addTr"></Button>
                </div>
            </div>
            <!-- <p slot="footer" >
                <Button type="primary" icon="android-close" size="small">关闭</Button>
                <Button type="primary" icon="android-done" size="small">保存</Button>
            </p> -->
        </Modal>
        <!-- 查询界面弹出框 -->
        <Modal width='800px' v-model="lookModal"  title="管材到发货登记表" ok-text="保存" cancel-text="关闭">
            <div class="ivu-table ivu-table-border">
                <table border="1" cellspacing='0' class="tableHeade">
                    <tr style="display:none;font-size:24px;">
                        <td colspan="6">管材到(发)货登记表</td>
                    </tr>
                    <tr>
                        <td colspan="2">品名</td>
                        <td>规格</td>
                        <td colspan="2">供货单位</td>
                        <td>到货日期</td>
                    </tr>
                    <tr>
                        <td colspan="2">产品：{{office}}</td>
                        <td>73.01*35.00</td>
                        <td colspan="2">{{office}}</td>
                        <td>{{postData.ArrivalGoodsDate}}</td>
                    </tr>
                    <tr>
                        <td colspan="2">使用单位</td>
                        <td>存储库区</td>
                        <td>磅重一</td>
                        <td>磅重二</td>
                        <td>磅重合计</td>
                    </tr>
                    <tr>
                        <td colspan="2">{{office}}</td>
                        <td>{{postData.StoreArea}}</td>
                        <td>{{postData.PoundWeight1}}</td>
                        <td>{{postData.PoundWeight2}}</td>
                        <td><span>{{PoundWeightTotle}}</span></td>
                    </tr>
                    <tr>
                        <td>车皮号</td>
                        <td>支数</td>
                        <td>质保书量</td>
                        <td colspan="3">备注</td>
                    </tr>
                    <tr>
                        <td>{{postData.YLStoreSgl_ID}}</td>
                        <td><span>{{office}}</span></td>
                        <td></td>
                        <td colspan="3">{{postData.Remark}}</Input></td>
                    </tr>
                </table>
                <Table :columns='lookColumns' :data='lookData'></Table>
            </div>
        </Modal>
	</div>
</template>
<script>

export default {
    data () {
        const validateAge = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('Age cannot be empty'));
            }
            // 异步验证效果
            setTimeout(() => {
                if (!Number.isInteger(value)) {
                    this.$Message.error('Fail!');
                    callback(new Error('Please enter a numeric value'));
                } else {
                    if (value < 18) {
                        this.$Message.error('Fail!');
                        callback(new Error('Must be over 18 years of age'));
                    } else {
                        this.$Message.error('Fail!');
                        callback();
                    }
                }
            }, 200);
        };
        return {
                cityList: [
                    {
                        value: 'New York',
                        label: 'New York'
                    },
                    {
                        value: 'London',
                        label: 'London'
                    },
                    {
                        value: 'Sydney',
                        label: 'Sydney'
                    },
                    {
                        value: 'Ottawa',
                        label: 'Ottawa'
                    },
                    {
                        value: 'Paris',
                        label: 'Paris'
                    },
                    {
                        value: 'Canberra',
                        label: 'Canberra'
                    }
                ],
                ruleCustom: {
                    StoreArea: [
                        { validator: validateAge, trigger: 'blur' }
                    ],
                    PoundWeight1: [
                        { validator: validateAge, trigger: 'blur' }
                    ]
                },
                logModal: false,//录入模态框
                lookModal:true,//查看模态框
                addable:true,
                columns: [//首页显示表格的列
                    {type: 'selection',width: 30,align:"center","fixed": "left",},
                    {title: '序号', width: 50,type:'index',align:"center","fixed": "left","sortable": true},
                    {title: '车号',key: 'zCarNo',align:"center","width": 60,"sortable": true},
                    {title: '品名',key: 'zylPinMing',align:"center","width": 225,"sortable": true},
                    {title: '供货单位', key: 'zylSupCmp',"sortable": true,"width": 100,align:"center"},
                    {title: '榜重1', key: 'deviceAddress',"sortable": true,"width": 60,align:"center"},
                    {title: '榜重2', key: 'deviceType', "sortable": true,"width": 60,align:"center"},
                    {
                        title: '榜重合计',
                        key: 'groupName',
                        "sortable": true,"width": 80,align:"center"
                        
                    },
                    {
                        title: '质保书量',
                        key: 'installationAddress',
                        "sortable": true,"width": 80,align:"center"
                   
                    },
                     {
                        title: '磅差',
                        key: 'installationAddress',
                    "sortable": true,"width": 60,align:"center"
                    },
                     {
                        title: '支数',
                        key: 'zNumber',
                   "sortable": true,"width": 60,align:"center"
                    },
                     {
                        title: '分厂',
                        key: 'zylUseCmp',
                       "sortable": true,"width": 60,align:"center"
                    },
                     {
                        title: '库区',
                        key: 'zStoreArea',
                       "sortable": true,"width": 60,align:"center"
                    },
                    {
                        title: '明细',
                        key: 'zDetailNum',
                       "sortable": true,"width": 60,align:"center"
                    },
                    {
                        title: '日期',
                         key: '',
                       "sortable": true,"width": 120,align:"center"
                    },
                    {
                        title: '状态',
                        key: 'storeStatus',
                     "sortable": true,"width": 60,align:"center"
                    },
                     {
                        title: '入库单',
                        key: 'installationAddress',
                     "sortable": true,"width": 60,align:"center"
                    },
                     {
                        title: '质检员',
                        key: 'inspector',
                     "sortable": true,"width": 70,align:"center"
                    },
                     {
                        title: '检测报告',
                        key: 'zInspectionResult',
                       "sortable": true,"width": 90,align:"center"
                    },
                    {
                        title: '操作',
                        "sortable": true,"width": 60,align:"center",
                        width: 250,
                        key: 'handle',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'default',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.show(params.index)
                                        }
                                    }
                                }, '验收记录'),
                                h('Button', {
                                    props: {
                                        type: 'default',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.modify(params.index)
                                        }
                                    }
                                }, '复检单'),
                                h('Button', {
                                    props: {
                                        type: 'warning',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.remove(params.index)
                                        }
                                    }
                                }, '判定书'),
                                 h('Button', {
                                    props: {
                                        type: 'warning',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.remove(params.index)
                                        }
                                    }
                                }, '质保书')
                            ]);
                        }
                    } 
                ],
                logColumns:[//录入表格的列
                    {title: ' ', type:'index', "width": 50,align:"center"},
                    {title: '炉号', key: 'FurnaceNo', "width": 250,align:"center"},
                    {title: '批次', key: 'Batch',align:"center"},
                    {title: '支数', key: 'Number',align:"center"},
                    {title: '重量', key: 'Weight',align:"center"},
                ],
                logData:[],//录入子表的数据
                lookColumns:[//查看表格的列
                    {title: ' ', type:'index', "width": 50,align:"center"},
                    {title: '炉号', key: 'FurnaceNo', "width": 250,align:"center"},
                    {title: '批次', key: 'Batch',align:"center"},
                    {title: '支数', key: 'Number',align:"center"},
                    {title: '重量', key: 'Weight',align:"center"},
                ],
                lookData:[],//查看的数据
                selectedIds:[],//选中的id
                model2: '',
                data: [],//获取主页列表的数据
                total:0,//总条数
                pageCurrent: 1,//当前页码
                pageSize: 10,//页面大小
                //主页面
                materialList:[],//原料筛选列表
                material:'',//选中的材料
                officeList:[],//供货单位列表
                office:'',//选中的供货单位
                userList:[],//使用单位列表
                user:'',//选中的使用单位
                statesList:[],//状态列表
                state:'',//选中状态
                dateRange:[],//日期范围
                storeList:[],//库区列表
                storeA:'',//选中库区
                carNumList:[],//车号列表
                carNum:'',//选定车号
                //录入界面提交的数据
                postData:{
                    "ID": "",
                    "CarNo": "",
                    "YL_TyID": "",
                    "YLSupCmp_ID": "",
                    "YLStoreSgl_ID": "",
                    "ArrivalGoodsDate": "",
                    "YLUseCmp_ID": "",
                    "StoreArea": "",
                    "PoundWeight1": 0,
                    "PoundWeight2": 0,
                    "PoundWeight": 0,
                    "StandardWeight": 0,
                    "Number": "",
                    "DetailNum": "",
                    "Librarian": "",
                    "StoreStatus": "",
                    "DecisionSgl_ID": "",
                    "Inspector": "",
                    "InspectionResult": "",
                    "IsTmpStore": "",
                    "DecisionDate": "",
                    "IsLock": 1,
                    "Remark": "",
                    "Yl_ArrivalRecDetail": []
                },
                //录入界面
                goodsList:[],//品名列表
                offerCmpList:[],//供货单位列表
                useCmpList:[]//使用单位列表

            }
    },
    computed:{
        //总重量计算
         PoundWeightTotle(){
             let sum = parseFloat(this.postData.PoundWeight1) + parseFloat(this.postData.PoundWeight2);
             sum = sum || 0;
             this.postData.PoundWeight = sum;
             return sum ;
         },
         //支数计算
         numTotle(){
             let sum = 0;
             this.logData.forEach((item) => {
                 if(item.Number)
                 sum += parseFloat(item.Number);
             });
             this.postData.Number = sum;
             return sum;
         },
         weightTotle(){
             let sum = 0;
             this.logData.forEach((item) => {
                 if(item.Weight)
                 sum += parseFloat(item.Weight);
             });
             return sum;
         }
    },
    methods: {
        addTr(){
            let len = this.logData.length;
            if(len < 25){
                this.logData.push({});
            }else{
                this.addable = false;
            }
        },
        //到货日期
        pickerDate(value){
            this.postData.ArrivalGoodsDate = value;
        },
        //存储选中的id和查看项
        haveSelected(selectedData){
            this.selectedIds = [];
            this.lookData = [];
            selectedData.forEach((item,index) => {
                this.selectedIds.push(item.id);
                this.lookData.push(item);
            })
            
        },
        //查看列表填充
        look(){
            let len = this.lookData.length;
            for(var i = 0; i < 10 - len;i++){
                this.lookData.push({});
            }
        },
        //登记数据处理
        log(){
            //物品信息
            this.goodsList=[];
            this.offerCmpList=[];
            this.useCmpList=[];
            this.getAjaxData(this.baseURL + 'PublicApi/bs_goodsinfo_view',(res) =>{
                res.results.forEach((item) => {
                    if(item.isEnable){
                        this.goodsList.push({id:item.wp_ID,value:item.pinMing});
                    }
                })
                
            });
            //公共信息类
            this.getAjaxData(this.baseURL + 'PublicApi/bs_comminfo_view',(res) =>{
                res.results.forEach((item) => {
                    let temp = item.comm_ID.substring(0,3);
                    if(temp == 101 && item.isEnable){
                        this.offerCmpList.push({id:item.comm_ID,value:item.subClass_Value});
                    }
                    if(temp == 104 && item.isEnable){
                        this.useCmpList.push({id:item.comm_ID,value:item.subClass_Value});
                    }
                })
                
            });
        },
        //获取选中品名的id
        goodId(id){
            this.postData.YL_TyID = id;
        },
        offerCmpId(id){
            this.postData.YLSupCmp_ID = id;
        },
        useCmpId(id){
            this.postData.YLUseCmp_ID = id;
        },
        //改变页数时的函数
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
        //查询函数
        query(skip,take){
            let options = '';
            options += '&ZYLPinMing='+this.material;
            if(this.office){
                options += '&ZYLSupCmp='+this.office;
            };
            if(this.user){
                options += '&ZYLUseCmp='+this.user;
            }    
            if(this.storeA){
                options += '&ZStoreArea='+this.storeA;
            }
            if(this.carNum){
                options += '&ZCarNo='+this.carNum;
            }
            if(skip == undefined)skip = 0;
            if(take == undefined)take = this.pageSize;
            this.getAjaxData(this.baseURL+'WlCenter/yl_arrivalrecdetail_view?Skip='+skip+'&take='+take+options,(res) => {
                this.data = res.results;
                this.total = res.total;
            });
        },
        //判断对象是否为空
        isEmptyObject(obj){ 
            for(var key in obj){
                return false;
                break; 
            };
            return true;
        },
        //保存提交
        commitLog(){
            let self = this;
            this.logData.forEach((item) =>{//做提交处理
                if(!this.isEmptyObject(item)){
                    this.postData.Yl_ArrivalRecDetail.push(item);
                }
            });
            this.postAjaxData(this.baseURL+'WlCenter/Yl_ArrivalRec',JSON.stringify(this.postData));
            this.init();
        },
        handleSubmit (name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.commitLog();
                    this.$Message.success('Success!');
                } else {
                    this.$Message.error('Fail!');
                }
            })
        },
        deleteData(id){
            this.deleteAjaxData(this.baseURL+'WlCenter/Yl_ArrivalRec?ID='+id);
        },
        init(){
            // 添加筛选选项的列表
            let _self = this;
            let materialListTemp = [];
            let officeListTemp = [];
            let userListTemp = [];
            let storeListTemp = [];
            let carNumListTemp = [];
            let statesListTemp = [];
            this.getAjaxData(this.baseURL+'WlCenter/yl_arrivalrecdetail_view?&take='+this.pageSize,function(res){
                _self.data = res.results;
                _self.total = res.total;
                res.results.forEach(function(item) {
                    if(materialListTemp.indexOf(item.zylPinMing) == -1)materialListTemp.push(item.zylPinMing);
                    if(officeListTemp.indexOf(item.zylSupCmp) == -1)officeListTemp.push(item.zylSupCmp);
                    if(userListTemp.indexOf(item.zylUseCmp) == -1)userListTemp.push(item.zylUseCmp);
                    if(storeListTemp.indexOf(item.zStoreArea) == -1)storeListTemp.push(item.zStoreArea);
                    if(carNumListTemp.indexOf(item.zCarNo) == -1)carNumListTemp.push(item.zCarNo);
                    if(carNumListTemp.indexOf(item.zStoreStatus) == -1)carNumListTemp.push(item.zStoreStatus);
                });
               _self.materialList = materialListTemp;
               _self.material = materialListTemp[0];
               _self.officeList = officeListTemp;
               _self.userList = userListTemp;
               _self.storeList = storeListTemp;
               _self.carNumList = carNumListTemp;
               _self.statesList = statesListTemp;
            });
        }
    },
    created(){
            this.init();
            //给表格增加input框
            let self = this;
            for(var i = 0;i < 10;i++){
                this.logData.push({});
            }
            this.logColumns.forEach((item,index) => {
                if(item.key){//只循环有key的项
                    item.render = (h,params) => {
                        let i = params.index;//读取当前行
                        return h('Input',{
                            props:{
                                type:'text',
                                value: self.logData[i][item.key]
                            },
                            on:{
                                'on-blur':(e) => {
                                    self.$set(self.logData[i],item.key,e.target.value)
                                }
                            }
                        })
                    }
                }
            })
    },
    mounted(){
    }
};
</script>
