<template>
  <div class="login">
    <iframe ref="login" class="login_iframe" :src="ssoUrl" />
    <div id="loading-login">
      <div class="loading-logo">
        <img src="@/assets/logo.png" alt="Logo">
      </div>
      <div class="loading">
        <div class="effect-1 effects"></div>
        <div class="effect-2 effects"></div>
        <div class="effect-3 effects"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { Base64 } from 'js-base64'
export default {
  name: 'Login',
  props: {},
  data () {
    return {
      ssoUrl: '',
      animationFinish: false,
      loginFinish: false
    }
  },
  async created () {
    // 判断是否已经登录
    if (sessionStorage.getItem('xStreamId')) {
      this.$router.push({ path: '/' })
    }
    this.getLoginSsoUrl()
  },
  mounted () {
    // 监听事件
    window.addEventListener('message', this.onMessage)
  },
  methods: {
    /**
     * @description 监听iframe 页面传递的参数
     * @param {*} e
     */
    onMessage (e) {
      if (typeof e.data === 'object' && 'type' in e.data && 'msg' in e.data) {
        if (e.data.type === 'dd-token') {
          this.tokenLogin(e.data.msg)
        }
        if (e.data.type === 'animation-finish') {
          this.animationFinish = true
          this.judgeJump()
        }
      }
    },
    /**
     * @description 登录
     * @param {*} code
     */
    async tokenLogin (token) {
      try {
        await this.$store.dispatch('userStore/login', token)
        const info = await this.$store.dispatch('userStore/getUserInfo')
        if (!info.name) {
          this.$router.push({ path: '/401' })
        } else {
          this.loginFinish = true
          this.judgeJump()
        }
      } catch (error) {
        this.$router.push({ path: '/401' })
      }
    },
    /**
     * @description 转码
     */
    getLoginSsoUrl () {
      let redirectPath = '/login.html'
      if (window.location.pathname.includes('show-pic-management')) {
        redirectPath = '/show-pic-management/login.html'
      }
      const query = JSON.stringify({
        title: '缦图云端',
        redirect: `${window.location.origin}${redirectPath}#/?token=`
      })
      this.ssoUrl = process.env.VUE_APP_LOGIN_API + Base64.encode(query)
    },
    /**
     * @description 判断是否跳转
     */
    judgeJump () {
      if (this.animationFinish && this.loginFinish) {
        window.removeEventListener('message', this.onMessage)
        this.$router.push({ path: '/' })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.login {
  iframe {
    position: relative;
    z-index: 2;
    width: 100vw;
    height: 100vh;
    border: none;
    -webkit-app-region: drag;
  }

  #loading-login {
    position: absolute;
    top: 0;
    z-index: 1;
    display: block;
    width: 100%;
    height: 100%;
    background: #00b1b7;

    .loading-logo {
      position: absolute;
      top: 40%;
      left: calc(50% - 189px);
    }

    .loading {
      position: absolute;
      top: 55%;
      left: calc(50% - 35px);
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      width: 55px;
      height: 55px;
      border: 3px solid transparent;
      border-radius: 50%;
    }

    .loading .effect-1,
    .loading .effect-2 {
      position: absolute;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      border: 3px solid transparent;
      border-left: 3px solid #ff8f00;
      border-radius: 50%;
    }

    .loading .effect-1 {
      animation: rotate 1s ease infinite;
    }

    .loading .effect-2 {
      animation: rotateOpacity 1s ease infinite 0.1s;
    }

    .loading .effect-3 {
      position: absolute;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      border: 3px solid transparent;
      border-left: 3px solid #ff8f00;
      border-radius: 50%;
      -webkit-animation: rotateopacity 1s ease infinite 0.2s;
      animation: rotateOpacity 1s ease infinite 0.2s;
    }

    .loading .effects {
      transition: all 0.3s ease;
    }
  }

  @keyframes rotate {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }

    100% {
      -webkit-transform: rotate(1turn);
      transform: rotate(1turn);
    }
  }

  @keyframes rotateOpacity {
    0% {
      opacity: 0.1;
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }

    100% {
      opacity: 1;
      -webkit-transform: rotate(1turn);
      transform: rotate(1turn);
    }
  }
}
</style>

