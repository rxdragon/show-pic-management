<template>
  <div class="order-detail">
    <div class="order-data module-panel">
      <order-info />
      <order-require class="order-require" />
    </div>
    <div class="photo-data module-panel">
       <div class="panel-title">
         照片详情
         <div class="button-box right-flow">
           <el-button @click="downForZip" size="small" type="primary">原片下载</el-button>
           <el-button size="small" type="primary">成片下载</el-button>
           <el-button size="small" type="primary">满意片下载</el-button>
         </div>
       </div>
       <div class="photo-version-box">
         <div class="photo-title">照片1</div>
         <photo-version />
       </div>
       <div class="photo-version-box">
         <div class="photo-title">照片1</div>
         <photo-version />
       </div>
    </div>
  </div>
</template>

<script>
import OrderInfo from "@/components/OrderInfo"
import OrderRequire from "@/components/OrderRequire"
import PhotoVersion from "@/components/PhotoVersion"
import * as DownPhoto from '@/utils/DownPhoto'

export default {
  name: 'orderDetail',
  components: { OrderInfo, OrderRequire, PhotoVersion },
  data () {
    return {
      photoVersion: [
        {
          version: '原片',
          src: 'https://cloud.cdn-qn.hzmantu.com/compress/2020/05/01/Fh_ng-dn42IKZY5-6gBunCtzVt28.jpg'
        },
        {
          version: '云端成片',
          src: 'https://cloud.cdn-qn.hzmantu.com/compress/2020/05/01/Fsgr3VQAuzewZ3xA--Vp-GbrbYGC.jpg'
        },
        {
          version: '顾客满意照片',
          src: 'https://cloud.cdn-qn.hzmantu.com/compress/2020/05/01/Fsgr3VQAuzewZ3xA--Vp-GbrbYGC.jpg'
        }
      ],
    }
  },
  methods: {
    /**
     * @description 一键下载
     */
    downForZip () {
      const imgArr = this.photoVersion.map(item => item.src)
      DownPhoto.downForZip(imgArr)
    }
  }
}
</script>

<style lang="less" scoped>
.order-detail {
  .module-panel {
    margin-top: 24px;
  }

  .order-require {
    margin-top: 40px;
  }

  .photo-data {
    .button-box {
      button {
        width: 124px;
      }
    }

    .photo-version-box {
      background-color: #fafafa;
      border-radius: 4px;
      margin-top: 20px;

      &:nth-of-type(1) {
        margin-top: 24px;
      }

      .photo-title {
        margin-bottom: 10px;
        font-size: 14px;
        font-weight: 600;
        color: #303133;
      }
    }
  }
}
</style>
