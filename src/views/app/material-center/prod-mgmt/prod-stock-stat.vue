<style lang="less">

</style>

<template>
	<div class="table-component-common">
        <card class="padding-top-bottom-minish">
            <div class="select-col" >
                <div class="div">
                    <label align="middle" class="label">产品类别</label>
                    <Select v-model="material" class="select li-width">
                        <Option v-for="item in goodsList" :value="item.id" :key="item.value">{{item.value}}</Option>
                    </Select>
                </div>
                <div class="div">
                    <label class="label">生产单位</label>
                    <Select v-model="office" class="select">
                        <Option :value="0">全部</Option>
                        <Option v-for="item in offerCmpList" :value="item.mid" :key="item.mid">{{ item.mDepName }}</Option>
                    </Select>
                </div>
                <div class="div">
                    <label class="label">供货单位</label>
                    <Select v-model="user"  class="select">
                        <Option :value="0">全部</Option>
                        <Option v-for="item in useCmpList" :value="item.id" :key="item.value">{{ item.value }}</Option>
                    </Select>
                </div>
                <div class="div">
                    <label class="label">筛选状态</label>
                    <Select v-model="state"  class="select">
                        <Option :value="0">全部</Option>
                        <Option v-for="item in statesList" :value="item.num" :key="item.value">{{ item.value }}</Option>
                    </Select>
                </div>
                <div class="div">
                    <label class="label">起始捆号</label>
                    <Input v-model="startBundleNo" placeholder="请输入起始捆号" class="select"></Input>
                </div>
                <div class="div">
                    <label class="label">炉号</label>
                    <Input v-model="FurnaceNoInput" placeholder="请输入炉号" class="select"></Input>
                </div>
                <div class="div">
                    <label class="label">捆重量</label>
                    <Input v-model="BundleWeight" placeholder="请输入捆重量" class="select"></Input>
                </div>
                <div class="div">
                    <label class="label">捆长度</label>
                    <Input v-model="BundleLenght" placeholder="请输入捆长度" class="select"></Input>
                </div>
                <div class="div">
                    <label class="label">起始日期</label>
                    <DatePicker :value='dateRange.start' placement="bottom-end" :options="options" placeholder="选择日期" @on-change='dateFormatStart'></DatePicker>
                </div>
                <div class="div">
                    <label class="label">截止日期</label>
                    <DatePicker :value='dateRange.end' placement="bottom-end" :options="options" placeholder="选择日期" @on-change='dateFormatEnd'></DatePicker>
                </div>
                <Button type="primary" icon="ios-search" @click="btnQuery()" >查询统计</Button>
                <Button type="primary" icon="social-dropbox-outline" @click="clearQuery()">清空条件</Button>
            </div>
		</card>
        <card class="margin-bottom-10 ">
                <span class="page-span">库存捆数：{{totalBundleNo}} 捆</span>
                <span class="page-span">总重量：{{(totalWeight/1000).toFixed(3)}} 吨</span>
                <span class="page-span">总长度：{{totalLenght.toFixed(3)}} m</span>
                <span class="page-span">总支数：{{totalNumber}} 支</span>
        </card>
        <card>
			<div class="margin-bottom-10" >
	            <Table highlight-row  size="small" border :data="data" :columns="columns" stripe ref="table2image" ></Table>
	        </div>
                <Page :total="total" :current="pageCurrent" @on-change="changePage" @on-page-size-change="changePageSize" show-elevator show-sizer placement='top' :transfer="true"></Page>
	      	<div style="clear: both;"></div>
        </card>
        
	</div>
</template>
<script>
import base from '@/libs/base';

export default {
    data () {
        return {
            columns: [//首页显示表格的列
                {title: '捆编号',key: 'zBundleNo',align:"center", ellipsis: true, width:80,
                render: (h, para) => {
                    let str = para.row.zBundleNo.toString();
                    return str.substring(0, 4) + '-' + str.substring(4, 8);
                }},
                {title: '产品类别',key: 'bgWuPin',align:"center", ellipsis: true,width:160},
                {title: '生产分厂', key: 'depProdCmpName',align:"center", ellipsis: true,width:100},
                {title: '原料供货', key: 'bcYLSupCmpName',align:"center", ellipsis: true,width:100},
                {title: '炉号', key: 'zFurnaceNo', align:"center", ellipsis: true,width:80},
                {title: '捆重量',key: 'zWeight',align:"center", ellipsis: true,width:80},
                {title: '捆长度',key: 'zLength',align:"center", ellipsis: true,width:80},
                {title: '支数', key: 'zNumber',align:"center", ellipsis: true,width:80},
                {title: '入库序号', key: 'cpoInStoreSeq_Num',align:"center", ellipsis: true,width:80},
                {title: '出库序号', key: 'cmoOutStoreSeq_Num', align:"center",width:80},
                {title: '入库日期',key: 'cpoInStoreDate',align:"center", ellipsis: true,width:100},
                {title: '出库日期',key: 'cmoOutStoreDate',align:"center",width: 100},
                {title: '状态', key: 'decisionStatusRecN',align:"center",width:80},
                {title: '录入', key: 'zLibrarian', align:"center",width:80},
            ],
            data: [],                       //获取主页列表的数据
            total: 0,                        //总条数
            pageCurrent: 1,                 //当前页码
            pageSize: 10,                   //页面大小
            material: '',                    //选中的材料
            office: 0,                       //选中的供货单位
            user: 0,                         //选中的使用单位
            startBundleNo: '',               // 起始捆号
            FurnaceNoInput: '',              //炉号 筛选条件
            BundleWeight: '',                // 筛选条件 捆重量
            BundleLenght: '',                // 筛选条件 捆长度
            statesList: [                    //状态列表
                {num: 3,value: '显示已出库商品'},
                {num: 2,value: '显示已入库商品'},
            ], 
            state:0,                        //选中状态
            dateRange: {start:'',end:''},   //日期范围
            options: {                       //日期选项
                disabledDate(date){
                    return date.valueOf() > Date.now();
                }
            },
            goodsList: [],                   //品名列表
            offerCmpList: [],                //生产单位
            useCmpList: [],                  //订货单位
            totalBundleNo: 0,
            totalWeight: 0,
            totalLenght: 0,
            totalNumber: 0,
        }
    },
    computed:{
        
    },
    methods: {
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
        //查询按钮
        btnQuery(){
            this.pageCurrent = 1;
            this.query(0, this.pageSize);
        },
        condition(){
            let options = '';
            let date = this.dateRange;

            options += '&zcP_TyID='+this.material;
            if(this.office) options += '&ZCpProdCmp_ID=' + this.office;
            if(this.user) options += '&zCp_OrderGdCmp_ID=' + this.user;
            if(this.startBundleNo) options += '&>zBundleNo=' + this.startBundleNo;
            if(this.FurnaceNoInput) options += '&zFurnaceNoContains=' + this.FurnaceNoInput;
            if(this.state) options += '&decisionStatusRec=' + this.state;
            if(this.BundleWeight) options += '&zWeight=' + this.BundleWeight;
            if(this.BundleLenght) options += '&zLength=' + this.BundleLenght;

            if(date.start && date.end){
                date.start > date.end ? this.$Modal.warning({content: '<p>起始日期大于截至日期,条件无效</p>'}) : (options += '&CpoInStoreDateBetween='+ date.start + ',' + date.end);
            }else if(date.start){
                options += '&>CpoInStoreDate=' + date.start;
            }else if(date.end){
                options += '&CpoInStoreDate<=' + date.end;
            }
            return options;
        },
        //查询函数
        query(skip,take){
            this.totalWeight = 0;
            this.totalNumber = 0;
            this.totalLenght = 0;
            let options = this.condition();

            if(skip == undefined)skip = 0;
            if(take == undefined)take = this.pageSize;

            base.getAjaxData(base.baseURL+'FCManage/Cp_ProdStoreRec_view?DecisionStatusRec=2&orderBy=-ZID&Skip='+ skip +'&take='+ take + options,(res) => {
                if(res.results){
                        res.results.forEach( (item) => {
                            if(item.cpoInStoreDate) item.cpoInStoreDate = item.cpoInStoreDate.substring(0,10);
                            if(item.cmoOutStoreDate) item.cmoOutStoreDate = item.cmoOutStoreDate.substring(0,10);
                        });
                        this.data = res.results;
                    }
                this.total = res.total;
            });
            // 待服务器端统计
            base.getAjaxData(base.baseURL+'/FCManage/Cp_ProdStoreRec_view?DecisionStatusRec=2' + options, (res) => {
                if(res.results){
                        res.results.forEach( (item) => {
                            if(item.zWeight) this.totalWeight += Number(item.zWeight);
                            if(item.zNumber) this.totalNumber += Number(item.zNumber);
                            if(item.zLength) this.totalLenght += Number(item.zLength);
                        });
                    }
                this.totalBundleNo = res.total;
            });
        },
        //清空查询条件
        clearQuery(){
                this.office = 0;
                this.user = 0;
                this.state = 0;
                this.FurnaceNoInput = '';
                this.startBundleNo = '';
                this.BundleWeight = '';           
                this.BundleLenght = '';  
                this.dateRange.start = '';
                this.dateRange.end = '';           
        },
        init(){
            this.changePage(this.pageCurrent);
        }
    },
    created(){
        // 添加筛选选项的列表
        this.goodsList=[];
        this.useCmpList=[];
        this.receiveCmpList = [];
        base.getAjaxData(base.baseURL + 'PublicApi/bs_goodsinfo_view?Wp_IDStartsWith=108',(bsGoods) =>{
            bsGoods.results.forEach((item) => {
                if(item.isEnable==1 && item.pinMing && item.wp_ID){
                    this.goodsList.push({id:item.wp_ID,value:item.pinMing});
                }
            })
            if(this.goodsList[0].id)this.material = this.goodsList[0].id;
            this.xsMaterial = this.material;
            this.init();
        });
        // 订货单位
        base.getAjaxData(base.baseURL + 'PublicApi/bs_comminfo_view',(res) =>{
            res.results.forEach((item) => {
                if(item.comm_ID){
                    let temp = item.comm_ID.substring(0,3);
                    if(item.subClass_Value){
                        if(temp == 100)this.useCmpList.push({id:item.comm_ID,value:item.subClass_Value});
                    }
                }
            })
        });
        // 生产单位
        base.getAjaxData(base.baseURL + 'PublicApi/Bs_commdep1_view',(res) =>{
            this.offerCmpList = res.results;
        });
    }
};
</script>

               
