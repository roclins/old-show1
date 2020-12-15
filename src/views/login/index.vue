<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">老人福祉科技管理系统</h3>
      </div>
      <el-button
        type="primary"
        class="login-model"
        :class="{ 'login-type': loginType == 'user' }"
        @click="setLoginUser"
        >个人用户</el-button
      >
      <el-button
        type="primary"
        class="login-model"
        :class="{ 'login-type': loginType == 'admin' }"
        @click="setLoginAdmin"
        >管理员用户</el-button
      >
      <div class="login-type-tip">当前用户模式为:{{loginType}}</div>
      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="Username"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="Password"
          name="password"
          tabindex="2"
          auto-complete="on"
        />
        <!-- @keyup.enter.native="handleLogin" -->
        <span class="show-pwd" @click="showPwd">
          <svg-icon
            :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
          />
        </span>
      </el-form-item>

      <el-button
        :loading="loading"
        type="primary"
        style="width: 100%; margin-bottom: 30px"
        @click="handleLogin"
        >Login</el-button
      >

      <!-- <div class="tips">
        <span style="margin-right: 20px">username: admin</span>
        <span> password: any</span>
      </div> -->
    </el-form>
  </div>
</template>

<script>
// import { validUsername } from '@/utils/validate'
// import axios from "axios";
// import qs from "qs";
import store from "@/store";
export default {
  name: "Login",
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value.trim()) {
        callback(new Error("Please enter the correct user name"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error("Please enter the correct password"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: "",
        password: "",
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername },
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword },
        ],
      },
      loading: false,
      passwordType: "password",
      redirect: undefined,
      loginType: "user",
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
        console.log(route.query, route.query.redirect, this.redirect);
      },
      immediate: true,
    },
  },
  methods: {
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          // old-back/v1/user/user/login
          this.$store
            .dispatch("user/login", this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || "/" });
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });

          // this.$axios
          //   .post(
          //     "/test/user/login",
          //     {
          //       account: this.loginForm.username,
          //       password: this.loginForm.password,
          //     },
          //     {
          //       withCredentials: true,
          //     }
          //   )
          //   .then(function (response) {
          //     console.log(response);
          //     this.loading = false;
          //   })
          //   .catch(function (error) {
          //     console.log(error);
          //     this.loading = false;
          //   });
        } else {
          console.log("error submit!!");
          // return false;
        }
      });
    },
    setLoginUser() {
      this.loginType = "user";
      store.commit("user/SET_LOGINTYPE",'user')
    },
    setLoginAdmin() {
      this.loginType = "admin";
      console.log(this.loginType)
      store.commit("user/SET_LOGINTYPE",'admin')
    },
  },
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
// $bg:#034fac;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
// $bg: #0e5fca;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}

.login-model {
  margin-left: 0;
  width: 50%;
  // margin-bottom: 28px;
}

.login-type {
  background-color: #ffffff;
  color: black;
}

.login-type-tip {
  height: 28px;
  color: #ffffff;
  line-height: 28px;
  font-size: 12px;
}
</style>
