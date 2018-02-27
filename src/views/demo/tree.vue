<template>
    <div>
        <Card style="">
            <Button type="primary" @click="append">add</Button>
            <Button type="error">remove</Button>
        </Card>
        <Tree :data="data" @on-select-change="choose"></Tree>
        <Modal v-model="modal" title="添加部门" @on-ok="ok">
            <Input v-model="deptmName" placeholder="部门名称" style=""></Input>
        </Modal>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                data: [
                    {
                        title: 'parent 1',
                        expand: true,
                        children: [
                            {
                                title: 'parent 1-1',
                                expand: true,
                                children: [
                                    {
                                        title: 'leaf 1-1-1'
                                    },
                                    {
                                        title: 'leaf 1-1-2'
                                    }
                                ]
                            },
                            {
                                title: 'parent 1-2',
                                expand: true,
                                children: [
                                    {
                                        title: 'leaf 1-2-1'
                                    },
                                    {
                                        title: 'leaf 1-2-1'
                                    }
                                ]
                            }
                        ]
                    }
                ],
                modal: false,
                deptmName: '',
                nodeInfo: {}
            }
        },
        mounted () {
            console.log(this)
        },
        methods: {
            choose (data) {
                console.log(data)
                this.nodeInfo = data;
            },
            append () {
                this.modal = true;
                // this.nodeInfo = data;
            },
            ok () {
                let data = this.nodeInfo;
                const children = data.children || [];
                children.push({
                    title: this.deptmName,
                    expand: true
                });
                this.$set(data, 'children', children);
                this.nodeInfo = {};
                this.deptmName = '';
            }
        }
    }
</script>
