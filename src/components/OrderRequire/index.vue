<template>
  <div class="order-require">
    <div class="panel-title">
      修图信息
      <div class="right-flow">
        <amend-remark
          :order-id="orderInfo.id"
          :requires-info="requiresInfo"
          v-if="Object.keys(requiresInfo).length && streamState === STREAM_STATE.WAIT_RETOUCH"
        />
      </div>
    </div>
    <div class="require-main">
      <div class="require-row">
        <div class="require-item">
          <div class="require-label">修图师：</div>
          <div class="require-value">{{ requiresInfo.retoucherList }}</div>
        </div>
        <div class="require-item">
          <div class="require-label">在线看片师：</div>
          <div class="require-value">{{ requiresInfo.onlineRetoucherName }}</div>
        </div>
      </div>
      <div class="require-row tag-box">
        <template v-for="(requiresItem, requiresIndex) in requiresInfo.baseRequires">
          <el-tag size="medium" type="success" :key="requiresIndex" v-if="Boolean(requiresItem)">
            {{ requiresIndex | tagFilter }}{{ requiresItem | toLabelName }}
          </el-tag>
        </template>
      </div>
      <div class="require-row photo-mark" v-if="requiresInfo.referenceDiagram">
        <div class="require-label">参考图：</div>
        <div class="require-value">
          <el-image
            fit="contain"
            :src="requiresInfo.referenceDiagramCompress"
            :preview-src-list="[requiresInfo.referenceDiagramOriginal]"
          >
          </el-image>
          <el-link :underline="false" type="success" @click="downPhoto">下载风格照片</el-link>
        </div>
      </div>
      <div class="require-row">
        <div class="require-label">备注信息：</div>
        <div class="require-value require-note">{{ requiresInfo.retouchRemark }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { STREAM_STATE } from '@/model/Enumerate'
import * as DownPhoto from '@/utils/DownPhoto.js'
import AmendRemark from './components/AmendRemark'

export default {
  name: 'OrderRequire',
  components: { AmendRemark },
  filters: {
    tagFilter (val) {
      const tagCN = {
        eye: '眼睛增大幅度',
        face: '瘦脸幅度',
        pimples: '祛痣'
      }
      return tagCN[val]
    }
  },
  props: {
    orderInfo: { type: Object, required: true }
  },
  data () {
    return {
      STREAM_STATE
    }
  },
  computed: {
    ...mapGetters(['imgDomain']),
    requiresInfo () {
      return this.orderInfo.requiresData || {}
    },
    streamState () {
      return this.orderInfo.streamState
    }
  },
  methods: {
    /**
     * @description 下载照片
     */
    downPhoto () {
      DownPhoto.downOnePicture(this.imgDomain + this.requiresInfo.referenceDiagram)
    }
  }
}
</script>

<style lang="less" scoped>
.order-require {
  .require-main {
    padding: 0 20px;
    margin-top: 16px;
    background-color: #fafafa;
    border-radius: 4px;

    .require-row {
      display: flex;
      padding: 20px 0;
      border-bottom: 1px solid #ebeef5;

      &:nth-last-of-type(1) {
        border: none;
      }

      .require-item {
        display: flex;
        width: 50%;
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
          margin: 0 10px;
        }

        .el-link {
          text-decoration-line: underline;
        }
      }

      .require-note {
        max-width: 632px;
      }
    }

    .tag-box {
      .el-tag {
        margin-right: 12px;
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
