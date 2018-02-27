<style lang="less">
   @import './chemistry-param-mgmt.less';
</style>

<template>
	 <div class="table-component-common">
            <Button type="primary" @click="btnAddData('postForm')" icon="plus">新增</Button>
            <Button type="primary" @click="btnEditData()" icon="edit">修改</Button>
        <Card class="margin-bottom-10 margin-top-10 padding-top-bottom-minish">
            <div class="select-col">
                <div class="div">
                    <label for="for" align="middle" class="label" >产品类别</label>
                    <Select v-model="material" class="select li-width" >
                        <Option v-for="item in goodsList" :value="item.id" :key="item.value">{{item.value}}</Option>
                    </Select>
                </div>
                <div class="div">
                    <label  for="for" class="label" style="width:40px;">炉号</label>
                    <Input v-model="furnaceNo" placeholder="请输入炉号" class="select"></Input>
                </div>
                <Button type="primary" icon="ios-search" @click="btnQuery()" >查询</Button>
            </div>
		</Card>
        <card>
			<div class="margin-bottom-10" >
	            <Table ref='mainTable' highlight-row class="fontSize" size="small" border :data="data" :columns="columns" stripe @on-row-click='handleSelect'></Table>
	        </div>
            <Page ref='page' :total="total" :current="pageCurrent" @on-change="changePage" @on-page-size-change="changePageSize" show-elevator show-sizer placement='top'></Page>
        </card>

        <!-- 新增模态框 -->
        <Modal  class="modal-table-form chemistry-param-modal" v-model="addModal" :mask-closable="false"  width="1000px" class-name="vertical-center-modal" >
            <p slot="header" >
                <Icon type="clipboard"></Icon>
                <span>产品理化参数信息</span>
            </p>
            <Form ref="postForm" :model="postData" :rules="ruleValidate">    
                <table class="table-common add-table table-common-top" cellspan="0" cellpadding="0" border="1">
                    <tr>
                        <td colspan="9" class="table-title">化学成分</td>
                    </tr>
                    <tr>
                        <td>产品</td>
                        <td>炉号</td>
                        <td>C</td>
                        <td>Mn</td>
                        <td>Si</td>
                        <td>P</td>
                        <td>S</td>
                        <td>Cr</td>
                        <td>Ni</td>
                    </tr>
                    <tr>
                        <td>
                            <FormItem prop="CP_TyID">
                                <Select v-model="postData.cP_TyID" class="select" >
                                    <Option v-for="item in goodsList" :value="item.id" :key="item.value">{{item.value}}</Option>
                                </Select>
                            </FormItem>
                        </td>
                        <td>
                            <FormItem prop="FurnaceNo">
                                <Input v-model="postData.FurnaceNo" placeholder="" :maxlength="10"></Input>
                            </FormItem>
                        </td>
                        <td>
                            <FormItem prop="c">
                                <Input v-model="postData.c" placeholder="" :maxlength="8" @on-keyup="numCheck('postData.c')"></Input>
                            </FormItem>
                        </td>
                        <td>
                            <FormItem prop="Mn">
                                <Input v-model="postData.Mn" placeholder="" :maxlength="8" @on-keyup="numCheck('postData.Mn')"></Input>
                            </FormItem>
                        </td>
                        <td>
                            <FormItem prop="Si">
                                <Input v-model="postData.Si" placeholder="" :maxlength="8" @on-keyup="numCheck('postData.Si')"></Input>
                            </FormItem>
                        </td>
                        <td>
                            <FormItem prop="p">
                                <Input v-model="postData.p" placeholder="" :maxlength="8" @on-keyup="numCheck('postData.p')"></Input>
                            </FormItem>
                        </td>
                        <td>
                            <FormItem prop="s">
                                <Input v-model="postData.s" placeholder="" :maxlength="8" @on-keyup="numCheck('postData.s')"></Input>
                            </FormItem>
                        </td>
                        <td>
                            <FormItem prop="Cr">
                                <Input v-model="postData.Cr" placeholder="" :maxlength="8" @on-keyup="numCheck('postData.Cr')"></Input>
                            </FormItem>
                        </td>
                        <td>
                            <FormItem prop="Ni">
                                <Input v-model="postData.Ni" placeholder="" :maxlength="8" @on-keyup="numCheck('postData.Ni')"></Input>
                            </FormItem>
                        </td>
                    </tr>
                    <tr>
                        <td>Cu</td>
                        <td>Mo</td>
                        <td>Al</td>
                        <td>V</td>
                        <td>Bi</td>
                        <td>Sn</td>
                        <td>Pb</td>
                        <td>As</td>
                        <td>Sb</td>
                    </tr>
                    <tr>
                        <td>
                            <FormItem prop="Cu">
                                <Input v-model="postData.Cu" placeholder="" :maxlength="8" @on-keyup="numCheck('postData.Cu')"></Input>
                            </FormItem>
                        </td>
                        <td>
                            <FormItem prop="Mo">
                                <Input v-model="postData.Mo" placeholder="" :maxlength="8" @on-keyup="numCheck('postData.Mo')"></Input>
                            </FormItem>
                        </td>
                        <td>
                            <FormItem prop="Al">
                                <Input v-model="postData.Al" placeholder="" :maxlength="8" @on-keyup="numCheck('postData.Al')"></Input>
                            </FormItem>
                        </td>
                        <td>
                            <FormItem prop="v">
                                <Input v-model="postData.v" placeholder="" :maxlength="8" @on-keyup="numCheck('postData.v')"></Input>
                            </FormItem>
                        </td>
                        <td>
                            <FormItem prop="Bi">
                                <Input v-model="postData.Bi" placeholder="" :maxlength="8" @on-keyup="numCheck('postData.Bi')"></Input>
                            </FormItem>
                        </td>
                        <td>
                            <FormItem prop="Sn">
                                <Input v-model="postData.Sn" placeholder="" :maxlength="8" @on-keyup="numCheck('postData.Sn')"></Input>
                            </FormItem>
                        </td>
                        <td>
                            <FormItem prop="Pb">
                                <Input v-model="postData.Pb" placeholder="" :maxlength="8" @on-keyup="numCheck('postData.Pb')"></Input>
                            </FormItem>
                        </td>
                        <td>
                            <FormItem prop="As">
                                <Input v-model="postData.As" placeholder="" :maxlength="8" @on-keyup="numCheck('postData.As')"></Input>
                            </FormItem>
                        </td>
                        <td>
                            <FormItem prop="Sb">
                                <Input v-model="postData.Sb" placeholder="" :maxlength="8" @on-keyup="numCheck('postData.Sb')"></Input>
                            </FormItem>
                        </td>
                    </tr>
                    <tr>
                        <td>Ti</td>
                        <td colspan="4">拉伸试验（纵向）</td>
                        <td colspan="4">冲击试验</td>
                    </tr>
                    <tr>
                        <td>
                            <FormItem prop="Ti">
                                <Input v-model="postData.Ti" placeholder="" :maxlength="8" @on-keyup="numCheck('postData.Ti')"></Input>
                            </FormItem>
                        </td>
                        <td>抗拉强度</td>
                        <td colspan="2">屈伸极限</td>
                        <td>伸长率</td>
                        <td colspan="2">横向冲击</td>
                        <td colspan="2">纵向冲击</td>
                    </tr>
                    <tr>
                        <td></td>
                        <td>
                            <FormItem prop="TensileStrength">
                                <Input v-model="postData.TensileStrength" placeholder="" :maxlength="10" @on-keyup="numCheck('postData.TensileStrength','space')"></Input>
                            </FormItem>
                        </td>
                        <td colspan="2">
                            <FormItem prop="quFuLimit">
                                <Input v-model="postData.quFuLimit" placeholder="" :maxlength="10" @on-keyup="numCheck('postData.quFuLimit','space')"></Input>
                            </FormItem>
                        </td>
                        <td>
                            <FormItem prop="Elongation">
                                <Input v-model="postData.Elongation" placeholder="" :maxlength="10" @on-keyup="numCheck('postData.Elongation','space')"></Input>
                            </FormItem>
                        </td>
                        <td colspan="2">
                            合格
                            <!-- <FormItem prop="TransverseImpact">
                                <Input v-model="postData.TransverseImpact" placeholder="" :maxlength="10"></Input>
                            </FormItem> -->
                        </td>
                        <td colspan="2">
                            合格
                            <!-- <FormItem prop="LongitudinalImpact">
                                <Input v-model="postData.LongitudinalImpact" placeholder="" :maxlength="10"></Input>
                            </FormItem> -->
                        </td>
                    </tr>
                    <tr>
                        <td>通径检验</td>
                        <td colspan="2">静水压试验</td>
                        <td colspan="2">无损探伤</td>
                        <td colspan="2">表面检验</td>
                        <td colspan="2">尺寸</td>
                    </tr>
                    <tr>
                        <td>合格</td>
                        <td colspan="2">合格</td>
                        <td colspan="2">合格</td>
                        <td colspan="2">合格</td>
                        <td colspan="2">合格</td>
                    </tr>
                </table> 
            </Form>
            <div slot="footer">
                <Button type="ghost" @click="handleClose('addModal')">取消</Button>
                <Button type="primary" @click="handleSubmit('postForm')">保存</Button>
            </div>
        </Modal>
	</div>
</template>
<script>
import base from '@/libs/base';

export default {
    data () {
        return {
            ruleValidate:{
                FurnaceNo:[
                    {required:true, message:' '}
                ],
                c:[
                    {required:true, message:' '}
                ],
                Mn:[
                    {required:true, message:' '}
                ],
                Si:[
                    {required:true, message:' '}
                ],
                p:[
                    {required:true, message:' '}
                ],
                s:[
                    {required:true, message:' '}
                ],
                Cr:[
                    {required:true, message:' '}
                ],
                Ni:[
                    {required:true, message:' '}
                ],
                Cu:[
                    {required:true, message:' '}
                ],
                TensileStrength:[
                    {required:true, message:' '}
                ],
                quFuLimit:[
                    {required:true, message:' '}
                ],
                Elongation:[
                    {required:true, message:' '}
                ]
            },
            // 新增提交数据
            postData:{
                id: "",
                cP_TyID: "",
                FurnaceNo: "",
                ylSupCmp_ID: "",
                c: "",
                Mn: "",
                Si: "",
                p: "",
                s: "",
                Cr: "",
                Ni: "",
                Cu: "",
                Mo: "",
                Al: "",
                v: "",
                Bi: "",
                Sn: "",
                Pb: "",
                As: "",
                Sb: "",
                Ti: "",
                TensileStrength: "",
                quFuLimit: "",
                Elongation: "",
                TransverseImpact: "合格",
                LongitudinalImpact: "合格",
                PathTest: "",
                JinShuiPressTest: "",
                WuSunTanShang: "",
                SurfaceTest: "",
                Size: "",
                IsInPut: '',
                Remark: ""
            },
            //表单提交总验证
            formValid:true,
            //模态框控制
            editModal:false,      //查看
            addModal:false,       // 新增
            columns: [//首页显示表格的列
                // {title: 'id', key: 'zid',align:"center",width:60},
                // {title: 'isinput', key: 'zIsInPut', align:"center",width:60},
                {title: '品名', key: 'wuPinMin',align:"center",width:200},
                {title: '供货商', key: 'bcYLSupCmp', align:"center",width:80},
                {title: '炉号', key: 'zFurnaceNo',align:"center",width:75},
                {title: 'C', key: 'zc', align:"center",width:40},
                {title: 'Mn', key: 'zMn', align:"center",width:40},
                {title: 'Si', key: 'zSi', align:"center",width:40},
                {title: 'P', key: 'zp', align:"center",width:40},
                {title: 'S', key: 'zs', align:"center",width:40},
                {title: 'Cr', key: 'zCr', align:"center",width:40},
                {title: 'Ni', key: 'zNi', align:"center",width:40},
                {title: 'Cu', key: 'zCu', align:"center",width:40},
                {title: 'Mo', key: 'zMo', align:"center",width:40},
                {title: 'Al', key: 'zAl', align:"center",width:40},
                {title: 'V', key: 'zv', align:"center",width:40},
                {title: 'Bi', key: 'zBi', align:"center",width:40},
                {title: 'Sn', key: 'zSn', align:"center",width:40},
                {title: 'Pb', key: 'zPb', align:"center",width:40},
                {title: 'As', key: 'zAs', align:"center",width:40},
                {title: 'Sb', key: 'zSb', align:"center",width:40},
                {title: 'Ti', key: 'zTi', align:"center",width:40},
                {title: '抗拉强度', key: 'zTensileStrength', align:"center",width:60},
                {title: '屈伸极限', key: 'zquFuLimit', align:"center",width:60},
                {title: '伸长率', key: 'zElongation', align:"center",width:60},
                {title: '操作',width: 60,align:"center",key: 'handle',
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'warning',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        this.deleteData(params.row.zid);
                                    }
                                }
                            }, '删除')
                        ]);
                    }
                } 
            ],
            data: [],//获取主页列表的数据
            total:0,//总条数
            pageCurrent: 1,//当前页码
            pageSize: 10,//页面大小
            material:'',//选中的材料
            goodsList:[],//品名列表
            furnaceNo:'',   // 炉号
            currentRow:'',
        }
    },
    methods: {
        handleSelect(cur){
            this.currentRow = cur;
            for(var key in this.postData){
                let newKey = 'z' + key;
                this.postData[key] = cur[newKey];
            }
        },
        //提交
        handleSubmit(name){
            this.$refs[name].validate( (valid) => {
                if(valid){
                    if(this.postData.id){
                        this.postData.IsInPut = 3,
                        base.putAjaxData(base.baseURL + 'ZLCheck/Zj_LHParamManage',JSON.stringify(this.postData),(res) =>{
                            this.addModal = false;
                            this.init();
                        })
                    }
                    else{
                        this.postData.IsInPut = 3,
                        base.postAjaxData(base.baseURL + 'ZLCheck/Zj_LHParamManage',JSON.stringify(this.postData),(res) =>{
                            this.addModal = false;
                            this.init();
                        })
                    }
                }else{
                    this.$Message.warning({duration: 5, content:'请填写完整！'});
                }
            });
        },
        btnAddData(name){
            this.addModal = true;
            this.$refs[name].resetFields();
            this.postData.id = '';
            this.currentRow = '';
            this.postData.cP_TyID = this.material;
        },
        btnEditData(){
            if(this.currentRow){
                this.addModal = true;
            }else{
                this.$Message.warning({duration: 5, content:'请选择数据'});
            }
        },
        //数字输入框
        numCheck(str,type) {
            str = str.split('.');
            let len = str.length;
            if(type ==  'space'){
                switch (len) {
                    case 1:
                        this[str[0]] = String(this[str[0]]).replace(/[^0-9\s]/g,'');
                        break;
                    case 2:
                        this[str[0]][str[1]] = String(this[str[0]][str[1]]).replace(/[^0-9\s]/g,'');
                        break;
                    case 3:
                        this[str[0]][str[1]][str[2]] = String(this[str[0]][str[1]][str[2]]).replace(/[^0-9\s]/g,'');
                        break;
                    default:
                        break;
                }
            }else{
                switch (len) {
                    case 1:
                        this[str[0]] = String(this[str[0]]).replace(/[^0-9.]/g,'');
                        break;
                    case 2:
                        this[str[0]][str[1]] = String(this[str[0]][str[1]]).replace(/[^0-9.]/g,'');
                        break;
                    case 3:
                        this[str[0]][str[1]][str[2]] = String(this[str[0]][str[1]][str[2]]).replace(/[^0-9.]/g,'');
                        break;
                    default:
                        break;
                }
            }
        },
        //删除
        deleteData(id){
            this.$Modal.confirm({
                content:'<p>确定删除数据么</p>',
                onOk:() =>{
                    base.deleteAjaxData(base.baseURL + 'ZLCheck/Zj_LHParamManage?ID='+id,() => {
                        this.$Message.success('数据已删除！');
                        this.init();
                    });
                }
            })
        },
        /**
         * 改变页数
         */
        changePage (index) {
            // 这里直接更改了模拟的数据，真实使用场景应该从服务端获取数据
            this.pageCurrent = index;
            let _size = this.pageSize;
            let _skip = (index-1)*_size;
            this.query(_skip, _size);
        },
        //改变页显示数
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
            let para = {};
            para.Skip = skip;
            para.Take = this.pageSize;
            
            para.ZCP_TyID = this.material;
            if(this.furnaceNo) para.zFurnaceNoContains = this.furnaceNo;
            base.ajaxData('ZLCheck/Zj_LHParamManage_view?orderBy=-zID&>ZIsInPut=2', para, 'GET', (e) => {
                this.data = e.results;
                this.total = e.total;
            });
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
    }
};
</script>
