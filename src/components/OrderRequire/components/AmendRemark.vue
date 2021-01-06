<template>
  <div class="amend-remark">
    <el-button type="primary" size="small" @click="showDialog">修改备注</el-button>
    <!-- 模态框 -->
    <el-dialog
      :visible.sync="dialogVisible"
      :before-close="beforeClose"
      :close-on-click-modal="false"
      center
      custom-class="amend-dialog"
      width="400px"
    >
      <span class="dialog-center" slot="title">修改备注</span>
      <div class="dialog-main">
        <el-form ref="form" :model="requiresData" label-width="120px">
          <el-form-item label="眼睛增大幅度：">
            <el-select v-model="requiresData.eye" placeholder="请选择眼睛增大幅度">
              <el-option label="大" value="big"></el-option>
              <el-option label="中" value="middle"></el-option>
              <el-option label="小" value="small"></el-option>
              <el-option label="不要求" value="not_required"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="瘦脸幅度：">
            <el-select v-model="requiresData.face" placeholder="请选择瘦脸幅度">
              <el-option label="大" value="big"></el-option>
              <el-option label="中" value="middle"></el-option>
              <el-option label="小" value="small"></el-option>
              <el-option label="不要求" value="not_required"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="是否去痣：">
            <el-select v-model="requiresData.pimples" placeholder="请选择是否去痣">
              <el-option label="是" :value="true"></el-option>
              <el-option label="否" :value="false"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="参考图：">
            <upload-share-photo :showtip="false" :verify="false" v-model="requiresData.fileList" />
          </el-form-item>

          <el-form-item label="备注信息：">
            <el-input type="textarea" :maxlength="255" v-model="requiresData.note" />
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button :disabled="loading" @click="dialogVisible = false">取 消</el-button>
        <el-button :loading="loading" type="primary" @click="updateRequires">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import UploadSharePhoto from '@/views/marketing-center/components/UploadSharePhoto'
import { mapGetters } from 'vuex'
import * as Order from '@/api/order.js'
import * as PhotoTool from '@/utils/photoTool'

export default {
  name: 'AmendRemark',
  components: { UploadSharePhoto },
  props: {
    requiresInfo: { type: Object, required: true },
    orderId: { type: [String, Number], required: true }
  },
  data () {
    return {
      dialogVisible: false, // 模态框显示开关
      loading: false,
      requiresData: {
        eye: '', // 眼睛增大幅度
        face: '', // 瘦脸幅度
        pimples: '', // 是否去痣
        note: '', // 备注信息
        fileList: [] // 参考图
      },
    }
  },
  computed: {
    ...mapGetters(['imgDomain']),
  },
  created () {
    this.requiresData.eye = this.requiresInfo.baseRequires.eye
    this.requiresData.face = this.requiresInfo.baseRequires.face
    this.requiresData.pimples = Boolean(this.requiresInfo.baseRequires.pimples)
    this.requiresData.note = this.requiresInfo.retouchRemark

    if (this.requiresInfo.referenceDiagram) {
      this.requiresData.fileList = [{
        name: '',
        path: this.requiresInfo.referenceDiagramCompress,
        percentage: 100,
        raw: null,
        size: 17334127,
        status: "success",
        uid: '1',
        uploadedName: PhotoTool.fileNameFormat(this.requiresInfo.referenceDiagramCompress)
      }]
    }
  },
  methods: {
    /**
     * @description 更新反馈信息
     */
    async updateRequires () {
      const req = {
        id: this.orderId,
        retouchClaim: {
          1: this.requiresData.eye,
          2: this.requiresData.face,
          3: this.requiresData.pimples
        }
      }
      // 添加备注
      if (this.requiresData.note) { req.note = this.requiresData.note }
      // 添加照片
      const photoInfo = _.get(this.requiresData, 'fileList[0]') || {}
      if (photoInfo.name) {
        req.retouchClaim[8] = photoInfo.path
      } else if (!photoInfo.path) {
        req.retouchClaim[8] = ''
      } else {
        req.retouchClaim[8] = this.requiresInfo.referenceDiagram
      }

      try {
        this.loading = true
        await Order.editRetouchClaim(req)
        this.$newMessage.success('修改成功')
        this.beforeClose()
        this.$refresh(this)
      } finally {
        this.loading = false
      }
    },
    /**
     * @description 关闭前回掉
     */
    beforeClose () {
      if (this.loading) return
      this.dialogVisible = false
    },
    showDialog () {
      this.dialogVisible = true
    }
  }
}
</script>

<style lang="less">
.amend-dialog {
  .el-select {
    width: 100%;
  }

  .el-dialog__body {
    padding: 15px 15px 10px !important;
  }
}
</style>
