<style lang="less" scoped>
   @import './stepLog.less';
</style>

<template>
    <div>
        <Modal width="800px" v-model="modal1">
            <p slot="header" >
                <Icon type="compose" size="16"></Icon>
                <span>管材到发货登记表</span>
            </p>
            <div class="ivu-table ivu-table-border">
                <Form :label-width="80">
                    <table class="tableHeade" border="1" cellspacing="0">
                        <tr style="display: none; font-size: 24px;">
                            <td colspan="6">管材到(发)货登记表</td>
                        </tr>
                        <tr>
                            <td colspan="2">品名</td>
                            <td>规格</td>
                            <td colspan="2">供货单位</td>
                            <td>到货日期</td>
                        </tr>
                        <tr>
                            <td colspan="2">
                                <Select :transfer="true">
                                    <Option v-for="item in cityList" :value="item.label" :key="item.value">{{ item.value }}</Option>
                                </Select>
                            </td>
                        </tr>
                    </table>
                </Form>
            </div>
            <Table :columns="logColumns"></Table>
            <div style="width:24px; margin:5px auto;">
                <Button type="primary" shape="circle" icon="plus" size="small"></Button>
            </div>
        </Modal>
    </div>
</template>
<script>
export default {
    data () {
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
                modal1: true,
                logColumns:[//录入表格的列
                    {title: ' ', type:'index', "width": 50,align:"center"},
                    {title: '炉号', key: 'FurnaceNo', "width": 250,align:"center"},
                    {title: '批次', key: 'Batch',align:"center"},
                    {title: '支数', key: 'Number',align:"center"},
                    {title: '重量', key: 'Weight',align:"center"},
                ],
            }
        }
}
</script>
