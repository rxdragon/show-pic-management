<template>
  <div class="photo-version">
    <div class="photo-module" v-for="(photoItem, photoIndex) in photoVersion" :key="photoIndex">
      <photo-box :src="photoItem.src" :version="photoItem.version" />
    </div>
  </div>
</template>

<script>
import PhotoBox from "@/components/PhotoBox"

export default {
  name: 'PhotoVersion',
  components: { PhotoBox },
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
      ]
    }
  }
}
</script>

<style lang="less" scoped>
.photo-version {
  display: flex;
  flex-wrap: wrap;

  .photo-module {
    width: 253px;
    margin-right: 12px;
  }
}
</style>
