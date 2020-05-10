<template>
  <div class="photo-box">
    <div class="image-box">
      <el-image :src="src" fit="cover"></el-image>
    </div>
    <div class="handle-box" @click.stop="">
      <div class="version-name">{{ version }}</div>
      <el-button type="text">下载照片</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PhotoBox',
  props: {
    src: { type: String, required: true },
    version: { type: String, default: '' }
  }
}
</script>

<style lang="less" scoped>
.photo-box {
  .image-box {
    position: relative;
    width: 100%;
    height: 0;
    padding-bottom: 100%;
    overflow: hidden;
    border-radius: 4px;

    .el-image {
      position: absolute;
      width: 100%;
      height: 100%;

      img {
        -webkit-user-select: none;
        object-position: top;
      }
    }
  }

  .handle-box {
    display: flex;
    justify-content: space-between;
    padding: 12px 6px 6px;

    .version-name {
      font-size: 12px;
      font-weight: 400;
      color: #606266;
    }

    .el-button {
      padding: 0;
      font-size: 12px;
      font-weight: 400;
      line-height: 17px;
    }

    .people-num {
      font-size: 12px;
      font-weight: 400;
      line-height: 17px;
      color: #606266;
    }

    .joint-label {
      font-size: 12px;
      font-weight: 400;
      line-height: 17px;
      color: #606266;
    }
  }
}
</style>
