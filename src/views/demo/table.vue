<template>
    <div>
        <card>
            <div class="margin-bottom-10">
                <Table style="min-height: 400px" :data="data" :columns="columns" stripe border size="small"></Table>
            </div>
             <Page :total="total" :current="1" @on-change="changePage" @on-page-size-change="changePageSize" show-elevator show-sizer placement="top" :transfer="true"></Page>
        </card>
        <div style="padding-top: 10px;">
            <Modal v-model="modalModify" title="修改信息" @on-ok="ok" @on-cancel="cancel">
                <Input style="margin-bottom: 10px;" placeholder="设备ID" :value="this.modifyData.deviceID"></Input>
                <Input style="margin-bottom: 10px;" placeholder="small size" :value="this.modifyData.deviceAddress"></Input>
                <Input style="margin-bottom: 10px;" placeholder="small size" :value="this.modifyData.deviceName"></Input>
            </Modal>
        </div>
    </div>
</template>

<script>
import base from '@/libs/base';

export default {
    name: 'tableCanEdit',
    data () {
        return {
            columns: [
                {key: "deviceID", title: "设备ID"},
                {key: "deviceAddress", title: "设备地址"},
                {key: "parentID", title: "父节点ID"},
                {key: "deviceName", title: "设备名称", ellipsis: true},
                {key: "installationAddress", title: "安装位置"},
                {key: "deviceType", title: "设备类型"},
                {key: "groupName", title: "采油队"},
                {key: "txtdata", title: "状态"},
                {
                    title: '操作',
                    align: 'center',
                    width: 190,
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
                            }, '查看'),
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
                            }, '修改'),
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
                            }, '删除')
                        ]);
                    }
                }
            ],
            data: [],               // 表格数据
            total: 100,             // 当前操作数据总数
            pageCurrent: 1,         // 表格当前页
            pageSize: 10,           // 每页显示行数
            modifyData: [],         // 选中修改的当前行数据
            modalModify: false      // 模态框默认状态（关闭）
        }
    },
    created () {
        // 测试
        // this.deleteAjaxData(this.baseURL + 'Ping/Test/StuGrade?ID=4');
    },
    mounted () {
        let _self = this;
        // 页面加载完成后表格数据初始化
        base.getAjaxData(base.baseURL + 'Ping/Devices?skip=0&take=10', (e) => {
            this.fillData(e)
        });
    },
    methods: {
        // 填充数据
        fillData (e) {
            this.total = e.total;
            this.data = e.results;
        },
        // 点击页码重新获取数据
        changePage (index) {
            this.pageCurrent = index;
            let _size = this.pageSize;
            let _skip = (index-1)*_size;
            base.getAjaxData(base.baseURL + 'Ping/Devices?skip=' + _skip + '&take=' + _size, (e) => {
                this.fillData(e)
            });
        },
        // 改变每页显示条数后重新加载时间
        changePageSize (size) {
            this.pageSize = size;
            let _current = this.pageCurrent;
            let _skip = (_current-1)*size;
            base.getAjaxData(base.baseURL + 'Ping/Devices?skip=' + _skip + '&take=' + size, (e) => {
                this.fillData(e)
            });
        },
        // 显示选中行数据
        show (index) {
            this.$Modal.info({
                title: '用户信息',
                content: `设备ID：${this.data[index].deviceID}<br>设备名称：${this.data[index].deviceName}<br>设备地址：${this.data[index].deviceAddress}`
            })
        },
        // 修改选中行数据
        modify (index) {
            this.modalModify = true;
            this.modifyData = this.data[index];
        },
        // 删除选中行数据（实际操作时需调用对应API）
        remove (index) {
            this.data.splice(index, 1);
        },
        // 模态框确定和取消提示信息
        ok () {
            this.$Message.info('点击了确定');
        },
        cancel () {
            this.$Message.info('点击了取消');
        }
    }
}
</script>
