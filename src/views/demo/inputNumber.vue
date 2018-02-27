<template>
    <Input v-model="value" placeholder="" style="width: 300px" :maxlength="8" @on-keyup="check('number', value)"></Input>
</template>
<script>
    export default {
        props: {
            maxlength: 5
        },
        data () {
            return {
                value: ''
            }
        },
        methods: {
            check(type, value) {
                switch (type) {
                    case 'number':
                        this.value = value.replace(/[^0-9.]/g, '')
                        break;
                
                    default:
                        break;
                }
            },
            check2(type) {
                switch (type) {
                    case 'number':
                        this.value = this.value.replace(/[^0-9.]/g, '')
                        break;
                
                    default:
                        break;
                }
            }
        }
    }
</script>