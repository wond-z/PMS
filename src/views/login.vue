<style lang="less">
    @import './login.less';
</style>

<template>
    <div class="login" @keydown.enter="handleSubmit">
        <!-- <div class="login-title">
            <h1>陕西延长石油材料有限责任公司</h1>
            <h2>- 生产管理系统</h2>
        </div> -->
        <div class="login-con">
            <Card :bordered="false">
                <p slot="title">
                    <Icon type="log-in"></Icon>
                    欢迎登录生产管理系统
                </p>
                <div class="form-con">
                    <Form ref="loginForm" :model="form" :rules="rules">
                        <FormItem prop="userName">
                            <Input v-model="form.userName" placeholder="请输入用户名">
                                <span slot="prepend">
                                    <Icon :size="16" type="person"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="password">
                            <Input type="password" v-model="form.password" placeholder="请输入密码">
                                <span slot="prepend">
                                    <Icon :size="14" type="locked"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem>
                            <Button @click="handleSubmit" type="primary" long>登录</Button>
                        </FormItem>
                    </Form>
                    <p class="login-tip">&copy; 陕西延长石油材料有限责任公司.2017</p>
                </div>
            </Card>
        </div>
    </div>
</template>

<script>
import Cookies from 'js-cookie';
import base from '@/libs/base';
export default {
    data () {
        return {
            form: {
                userName: '',
                password: ''
            },
            rules: {
                userName: [
                    { required: true, message: '账号不能为空', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '密码不能为空', trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
        handleSubmit () {
            let _self = this;
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    if (this.form.userName == 'pms' && this.form.password == 'pms2018') {
                        Cookies.set('user', this.form.userName);
                        this.$store.commit('setAvator', 'https://raw.githubusercontent.com/wond-z/Pic/6e9951acbd3a175cd8c13e26555d9cafc0068415/logo-min.png');
                        if (this.form.userName === 'pms') {
                            Cookies.set('access', 0);
                        } else {
                            Cookies.set('access', 1);
                        }
                        this.$router.push({
                            name: 'home_index'
                        });
                    } else {
                        this.$Message.error('请确认用户名密码是否正确');
                    }
                    // $.ajax({
                    //     url: 'http://61.185.0.135:6988/Auth/datis',
                    //     data: {
                    //         provider: 'credentials',
                    //         UserName: this.form.userName,
                    //         Password: this.form.password,
                    //         RememberMe: true
                    //     },
                    //     type: "POST",
                    //     dataType: 'JSON',
                    //     success: function (response, status, xhr) {
                    //         Cookies.set('user', _self.form.userName);
                    //         Cookies.set('pms-ss-id', response.sessionId);
                    //         Cookies.set('pms-X-UAId', response.userId);
                    //         _self.$store.commit('setAvator', 'https://raw.githubusercontent.com/wond-z/Pic/6e9951acbd3a175cd8c13e26555d9cafc0068415/logo-min.png');
                    //         if (_self.form.userName === 'datist') {
                    //             Cookies.set('access', 0);
                    //         } else {
                    //             Cookies.set('access', 1);
                    //         }
                    //         _self.$router.push({
                    //             name: 'home_index'
                    //         });
                    //     },
                    //     error: function (er) {
                    //         this.$Message.error('请确认用户名密码是否正确');
                    //     }
                    // });
                }
            });
        }
    }
};
</script>

<style>

</style>
