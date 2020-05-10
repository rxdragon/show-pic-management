<template>
  <div class="order-require">
    <div class="panel-title">修图信息</div>
    <div class="require-main">
      <div class="require-row">
        <div class="require-item">
          <div class="require-label">修图师：</div>
          <div class="require-value">张三</div>
        </div>
        <div class="require-item">
          <div class="require-label">在线看片师：</div>
          <div class="require-value">张三</div>
        </div>
      </div>
      <div class="require-row">
        <el-tag size="medium" type="success">中等标签</el-tag>
      </div>
      <div class="require-row photo-mark">
        <div class="require-label">修图风格：</div>
        <div class="require-value">
          我的风格
          <el-image
            :src="url"
            :preview-src-list="[url]">
          </el-image>
          <el-link :underline="false" type="success">下载风格照片</el-link>
        </div>
      </div>
      <div class="require-row">
        <div class="require-label">备注信息：</div>
        <div class="require-value require-note">
          我想要变好看  我要变好看我要变好看 再变好看我要变好看 再变好看我要变好看 再变好看我要变好看 再变好看我要变好看 再变好看我要变好看 再变好看我要变好看 再变好看我要变好看 再变好看我要变好看 再变好看我要变好看 再变好看我要变好看 再变好看我要变好看 再变好看我要变好看 再变好看我要变好看 再变好看
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderRequire',
  data () {
    return {
      url: 'https://cloud.cdn-qn.hzmantu.com/compress/2020/05/01/Fsgr3VQAuzewZ3xA--Vp-GbrbYGC.jpg',
    }
  }
}
</script>

<style lang="less" scoped>
.order-require {
  .require-main {
    background-color: #fafafa;
    border-radius: 4px;
    padding: 0 20px;
    margin-top: 16px;

    .require-row {
      padding: 20px 0;
      display: flex;
      border-bottom: 1px solid #ebeef5;

      &:nth-last-of-type(1) {
        border: none;
      }

      .require-item {
        width: 50%;
        display: flex;
      }

      .require-label,
      .require-value {
        font-size: 14px;
        font-weight: 400;
        color: #303133;
      }

      .require-label {
        min-width: 70px;
      }

      .require-value {
        .el-image {
          width: 54px;
          height: 54px;
        }

        .el-link {
          text-decoration-line: underline;
        }
      }

      .require-note {
        max-width: 632px;
      }
    }

    .photo-mark {
      align-items: center;

      .require-value {
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>
