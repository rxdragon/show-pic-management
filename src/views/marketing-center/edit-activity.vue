<template>
  <div class="edit-activity">
    <!-- 基础配置 -->
    <div class="module-panel base-box base-form">
      <div class="panel-title">基础配置</div>
      <el-form ref="baseForm" :model="baseForm" :rules="baseRules" label-width="80px">
        <el-form-item label="活动名称" prop="activityName">
          <el-input v-model.trim="baseForm.activityName" maxlength="15" placeholder="请输入活动名称" />
        </el-form-item>
        <el-form-item label="活动时间" prop="activityTime">
          <date-picker future valueFormat="yyyy-MM-dd HH:mm:ss" type="datetimerange" v-model="baseForm.activityTime" />
        </el-form-item>
      </el-form>
    </div>
    <!-- 分享链接配置 -->
    <div class="module-panel base-form">
      <div class="panel-title">分享链接配置</div>
      <div class="share-main">
        <div class="share-form">
          <el-form ref="shareForm" :model="shareForm" :rules="shareRules" label-width="140px">
            <el-form-item label="活动分享图(可选)：">
              <upload-share-photo v-model="shareForm.fileList" />
            </el-form-item>
            <el-form-item label="活动分享标题：" prop="activityShareTitle">
              <el-input v-model.trim="shareForm.activityShareTitle" placeholder="请输入活动分享标题" />
            </el-form-item>
            <el-form-item label="活动分享描述：" prop="activityShareDesc">
              <el-input type="textarea" v-model.trim="shareForm.activityShareDesc" placeholder="请输入活动分享描述" />
            </el-form-item>
          </el-form>
        </div>
        <div class="share-model">
          <share-message-model :config="shareForm" />
        </div>
      </div>
    </div>
    <!-- 活动页面配置 -->
    <activity-h5-page ref="activityConfig" />
    <!-- 活动优惠券配置 -->
    <div class="module-panel base-form" v-if="!isEdit">
      <div class="panel-title">活动优惠券配置</div>
      <el-form ref="couponForm" :model="couponForm" :rules="couponRules" label-width="140px">
        <el-form-item label="优惠券名称：" prop="couponName">
          <el-input v-model.trim="couponForm.couponName" placeholder="请输入优惠券名称" />
        </el-form-item>
        <el-form-item label="总发行张数：" prop="circulation">
          <el-input-number
            :min="1"
            :max="1500"
            v-model="couponForm.circulation"
            controls-position="right"
            placeholder="请输入总发行张数"
          /> 张
        </el-form-item>
        <el-form-item label="每人限领张数：" prop="limitCount">
          <el-radio-group v-model="couponForm.limitCount.limitType">
            <el-radio :label="0">无限制</el-radio>
            <el-radio :label="1">
              限制 <el-input class="min-input" v-numberOnly min="1" v-model="couponForm.limitCount.count"/> 张/人
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="优惠劵类型：" prop="type">
          <el-select v-model="couponForm.type" placeholder="请选择优惠劵类型">
            <el-option label="立减劵" value="decrease_coupon"></el-option>
            <el-option label="折扣劵" value="discount_coupon"></el-option>
          </el-select>
        </el-form-item>
        <!-- 立减券 -->
        <template v-if="couponForm.type === 'decrease_coupon'">
          <el-form-item label="面额：" prop="erectMoney">
            <el-input v-numberOnly min="1" class="min-input" v-model="couponForm.erectMoney"/> 元
          </el-form-item>
        </template>
        <!-- 折扣卷 -->
        <template v-if="couponForm.type === 'discount_coupon'">
          <el-form-item label="折扣力度：" prop="discountRange">
            <el-input
              v-discountOnly
              min="1"
              max="9.9"
              class="min-input"
              v-model="couponForm.discountRange"
            /> 折
          </el-form-item>
          <el-form-item label="减免上限：" prop="discountMaxMoney">
            <el-input v-numberOnly min="1" class="min-input" v-model="couponForm.discountMaxMoney"/> 元
          </el-form-item>
        </template>
        <el-form-item label="使用门槛：" prop="useLimit">
          <el-radio-group v-model="couponForm.useLimit.usetype">
            <el-radio :label="0">无限制</el-radio>
            <el-radio :label="1">
              满 <el-input-number :min="1" v-model="couponForm.useLimit.maxMoney" controls-position="right" /> 元可用
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="有效时间：" prop="effectivity">
          <el-radio-group v-model="couponForm.effectivity.effectivityType">
            <el-radio label="limitless">无限制</el-radio>
            <el-radio label="receive">
              自激活后 <el-input-number :min="1" v-model="couponForm.effectivity.autoExceed" controls-position="right" /> 天有效
            </el-radio>
            <el-radio label="fixed">
              固定截止日期
              <el-date-picker
                v-model="couponForm.effectivity.abortTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                placeholder="选择截止日期时间"
                :picker-options="pickerOptions"
                default-time="12:00:00"
              />
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注(可选)：">
          <el-input
            type="textarea"
            maxlength="150"
            show-word-limit
            :rows="6"
            v-model.trim="couponForm.desc"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>
    </div>
    <div class="submit-box">
      <el-button type="info" @click="goBack">返 回</el-button>
      <el-button type="primary" @click="sumbitActivity">{{ isEdit ? '修改' : '生成' }}活动</el-button>
    </div>
  </div>
</template>

<script>
import DatePicker from '@/components/DatePicker'
import UploadSharePhoto from './components/UploadSharePhoto'
import ActivityH5Page from './components/ActivityH5Page'
import ShareMessageModel from './components/ShareMessageModel'
import { validateLimitCount, validateUseLimit, validateEffectivity } from '@/utils/validator.js'
import { mapGetters } from 'vuex'
import * as Activity from '@/api/activity.js'
import * as PhotoTool from '@/utils/photoTool.js'
// 基础配置
const baseRules = {
  activityName: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
  activityTime: [{ required: true, message: '请输入活动时间', trigger: 'change' }],
}
// 分享配置
const shareRules = {
  activityShareTitle: [{ required: true, message: '请输入活动分享标题', trigger: 'blur' }],
  activityShareDesc: [{ required: true, message: '请输入活动分享描述', trigger: 'blur' }]
}
// 活动优惠劵配置
const couponRules = {
  couponName: [{ required: true, message: '请输入优惠券名称', trigger: 'blur' }],
  circulation: [{ required: true, message: '请输入总发行量', trigger: 'blur' }],
  limitCount: [{ required: true, validator: validateLimitCount, trigger: ['blur', 'change'] }],
  type: [{ required: true, message: '请选择优惠劵类型', trigger: ['blur', 'change'] }],
  erectMoney: [{ required: true, message: '请输入立减券面额', trigger: 'blur' }],
  useLimit: [{ required: true, validator: validateUseLimit, trigger: ['blur', 'change'] }],
  discountRange: [{ required: true, message: '请输入折扣力度', trigger: 'blur' }],
  discountMaxMoney: [{ required: true, message: '请输入减免上限', trigger: 'blur' }],
  effectivity: [{ required: true, validator: validateEffectivity, trigger: ['blur', 'change'] }],
  lottery: [{ required: true, message: '请输入抽取概率', trigger: 'blur' }]
}

export default {
  name: 'EditActivity',
  components: { DatePicker, UploadSharePhoto, ActivityH5Page, ShareMessageModel },
  data () {
    return {
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now()
        }
      },
      baseRules,
      shareRules,
      couponRules,
      activityId: '',
      isEdit: false,
      baseForm: {
        activityName: '',
        activityTime: null
      },
      shareForm: {
        fileList: [],
        activityShareTitle: '',
        activityShareDesc: ''
      },
      couponForm: {
        couponName: '',
        circulation: '',
        limitCount: {
          limitType: '',
          count: ''
        },
        type: '',
        erectMoney: '',
        discountRange: '',
        discountMaxMoney: '',
        useLimit: {
          usetype: '', // 使用门槛
          maxMoney: '', // 多少元可用
        },
        effectivity: {
          effectivityType: '',
          autoExceed: '',
          abortTime: ''
        },
        desc: ''
      }
    }
  },
  computed: {
    ...mapGetters(['imgDomain'])
  },
  created () {
    const { activityId } = this.$route.query
    this.activityId = activityId
    this.isEdit = Boolean(activityId)
    if (!this.isEdit) return
    this.getActivityId(activityId)
  },
  methods: {
    /**
     * @description 获取活动详情
     */
    async getActivityId (id) {
      try {
        this.$loading()
        const req = { id }
        const data = await Activity.getActivityDetail(req)
        this.baseForm = data.baseForm
        this.shareForm = data.shareForm
        this.couponForm = data.couponForm
        this.$refs.activityConfig.pageForm = data.pageForm
        const photoName = PhotoTool.fileNameFormat(data.pageForm.headerImg)
        this.$refs.activityConfig.fileList = [{
          name: photoName,
          url: data.pageForm.headerImg
        }]
      } catch (error) {
        console.error(error)
        throw new Error(error)
      } finally {
        this.$loadingClose()
      }
    },
    /**
     * @description 获取活动参数配置
     */
    getActivityConfigData () {
      const pageFormData = this.$refs.activityConfig.pageForm
      const rules = pageFormData.activityDesc.filter(item => item)
      const req = {
        name: this.baseForm.activityName,
        beginTime: this.baseForm.activityTime[0],
        endTime: this.baseForm.activityTime[1],
        shareConfig: {
          title: this.shareForm.activityShareTitle,
          desc: this.shareForm.activityShareDesc
        },
        styleConfig: {
          title: pageFormData.title,
          headerImg: pageFormData.headerImg,
          bkgColor: pageFormData.bkgColor,
          captchaBkgColor: pageFormData.captchaBkgColor,
          captchaTextColor: pageFormData.captchaTextColor,
          receiveBkgColor: pageFormData.receiveBkgColor,
          rules,
          rulesFontColor: pageFormData.rulesFontColor
        }
      }
      const mainImg = _.get(this.shareForm, 'fileList[0].path')
      if (mainImg) { req.shareConfig.mainImg = this.imgDomain + mainImg }
      return req
    },
    /**
     * @description 创建活动
     */
    async sumbitActivity () {
      // 如果编辑进入保存配置
      if (this.isEdit) return this.editActivity()
      try {
        this.$loading()
        await Promise.all([
          this.$refs.baseForm.validate(),
          this.$refs.activityConfig.validatePageForm(),
          this.$refs.shareForm.validate(),
          this.$refs.couponForm.validate()
        ])
        const activityReq = this.getActivityConfigData()
        if (this.couponForm.type === 'discount_coupon' && (+this.couponForm.discountRange >= 10 || +this.couponForm.discountRange <= 0)) {
          return this.$newMessage.warning('请输入正确的折扣券')
        }
        const req = {
          couponConfig: {
            title: this.couponForm.couponName,
            type: this.couponForm.type,
            total: this.couponForm.circulation,
            value: this.couponForm.type === 'decrease_coupon' ? this.couponForm.erectMoney : this.couponForm.discountRange,
            limit: {},
            dateType: this.couponForm.effectivity.effectivityType
          },
          ...activityReq
        }
        // 每人限领数量
        if (this.couponForm.limitCount.limitType === 1) {
          req.couponConfig.limitCount = this.couponForm.limitCount.count
        }
        // 减免上线
        if (this.couponForm.type === 'discount_coupon') {
          req.couponConfig.limit.reductionUpperLimit = this.couponForm.discountMaxMoney
        }
        if (this.couponForm.useLimit.usetype === 1) {
          req.couponConfig.limit.orderMoneyLowerLimit = this.couponForm.useLimit.maxMoney
        } else {
          req.couponConfig.limit.orderMoneyLowerLimit = 0
        }
        if (this.couponForm.desc) { req.couponConfig.note = this.couponForm.desc }
        // 生效时间
        if (this.couponForm.effectivity.effectivityType === 'receive') {
          req.couponConfig.expireDay = this.couponForm.effectivity.autoExceed
        }
        if (this.couponForm.effectivity.effectivityType === 'fixed') {
          req.couponConfig.stopAt = this.couponForm.effectivity.abortTime
        }
        await Activity.addActivity(req)
        this.$newMessage.success('生成成功')
        this.goBack()
      } catch (error) {
        console.error(error)
        this.$newMessage.warning(error.message || error || '请输入相关配置')
        this.$loadingClose()
      }
    },
    /**
     * @description 修改活动配置
     */
    async editActivity () {
      try {
        this.$loading()
        await Promise.all([
          this.$refs.baseForm.validate(),
          this.$refs.activityConfig.validatePageForm(),
          this.$refs.shareForm.validate()
        ])
        const activityReq = this.getActivityConfigData()
        const req = {
          id: this.activityId,
          ...activityReq
        }
        const mainImg = _.get(this.shareForm, 'fileList[0].path')
        req.shareConfig.mainImg = mainImg ? this.imgDomain + mainImg : ''
        await Activity.editActivity(req)
        this.$newMessage.success('修改成功')
        this.goBack()
      } catch (error) {
        console.error(error)
        this.$loadingClose()
      }
    },
    /**
     * @description 返回信息
     */
    goBack () {
      this.$router.push({
        path: '/marketing-center/activity-management/activity-list'
      })
    }
  }
}
</script>

<style lang="less" scoped>
.edit-activity {
  .module-panel {
    margin-top: 20px;

    .el-input {
      width: 300px;
    }

    .el-textarea {
      width: 300px;
    }

    .panel-title {
      margin-bottom: 20px;
    }

    .share-main {
      display: flex;
      overflow: hidden;

      .share-form {
        flex-shrink: 0;
        width: 600px;
        padding-top: 20px;
        margin-right: 40px;
      }
    }
  }

  .base-box {
    .el-input {
      width: 400px;
    }

    & /deep/ .el-range-editor.el-input__inner {
      width: 400px;
    }
  }

  .base-form {
    padding-bottom: 2px;

    .min-input {
      width: 80px;
    }
  }

  & /deep/ .el-upload-list--picture-card {
    .el-upload-list__item-thumbnail {
      object-fit: contain;
    }
  }

  .submit-box {
    margin: 20px 0 50px;
  }
}
</style>
