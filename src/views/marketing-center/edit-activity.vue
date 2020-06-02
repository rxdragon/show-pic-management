<template>
  <div class="edit-activity">
    <!-- 基础配置 -->
    <div class="module-panel base-form">
      <div class="panel-title">基础配置</div>
      <el-form ref="baseForm" :model="baseForm" :rules="baseRules" label-width="80px">
        <el-form-item label="活动名称" prop="activityName">
          <el-input v-model.trim="baseForm.activityName" placeholder="请输入活动名称" />
        </el-form-item>
        <el-form-item label="活动时间" prop="activityTime">
          <date-picker v-model="baseForm.activityTime" />
        </el-form-item>
      </el-form>
    </div>
    <!-- 分享链接配置 -->
    <div class="module-panel base-form">
      <div class="panel-title">分享链接配置</div>
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
    <activity-h5-page />
    <!-- 活动优惠券配置 -->
    <div class="module-panel base-form">
      <div class="panel-title">活动优惠券配置</div>
      <el-form ref="couponForm" :model="couponForm" :rules="couponRules" label-width="140px">
        <el-form-item label="优惠券名称：" prop="couponName">
          <el-input v-model.trim="couponForm.couponName" placeholder="请输入优惠券名称" />
        </el-form-item>
        <el-form-item label="总发行张数：" prop="circulation">
          <el-input v-model.trim="couponForm.circulation" v-numberOnly placeholder="请输入总发行张数" /> 张
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
            <el-option label="立减劵" value="money"></el-option>
            <el-option label="折扣劵" value="discount"></el-option>
          </el-select>
        </el-form-item>
        <!-- 立减券 -->
        <template v-if="couponForm.type === 'money'">
          <el-form-item label="面额：" prop="erectMoney">
            <el-input v-numberOnly min="1" class="min-input" v-model="couponForm.erectMoney"/> 元
          </el-form-item>
        </template>
        <!-- 折扣卷 -->
        <template v-if="couponForm.type === 'discount'">
          <el-form-item label="折扣力度：" prop="discountRange">
            <el-input v-numberOnly min="1" class="min-input" v-model="couponForm.discountRange"/> 折
          </el-form-item>
          <el-form-item label="减免上限：" prop="discountMaxMoney">
            <el-input v-numberOnly min="1" class="min-input" v-model="couponForm.discountMaxMoney"/> 元
          </el-form-item>
        </template>
        <el-form-item label="有效时间：" prop="effectivity">
          <el-radio-group v-model="couponForm.effectivity.effectivityType">
            <el-radio :label="0">无限制</el-radio>
            <el-radio :label="1">
              自激活后 <el-input class="min-input" v-numberOnly min="1" v-model="couponForm.effectivity.autoExceed"/> 天有效
            </el-radio>
            <el-radio :label="2">
              固定截止日期
              <el-date-picker v-model="couponForm.effectivity.abortTime" type="datetime" placeholder="选择截止日期时间" default-time="12:00:00"/>
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="抽取概率：" prop="lottery">
          <el-input v-model.trim="couponForm.lottery" v-numberOnly min="1" placeholder="请输入抽取概率"/>%
        </el-form-item>
      </el-form>
    </div>
    <div class="submit-box">
      <el-button type="info" @click="goBack">返 回</el-button>
      <el-button type="primary" @click="sumbitActivity">生成活动</el-button>
    </div>
  </div>
</template>

<script>
import DatePicker from '@/components/DatePicker'
import UploadSharePhoto from './components/UploadSharePhoto'
import ActivityH5Page from './components/ActivityH5Page'
import { validateLimitCount, validateEffectivity } from '@/utils/validator.js'
// 基础配置
const baseRules = {
  activityName: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
  activityTime: [{ type: 'date', required: true, message: '请输入活动时间', trigger: 'change' }],
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
  discountRange: [{ required: true, message: '请输入折扣力度', trigger: 'blur' }],
  discountMaxMoney: [{ required: true, message: '请输入减免上限', trigger: 'blur' }],
  effectivity: [{ required: true, validator: validateEffectivity, trigger: 'blur' }],
  lottery: [{ required: true, message: '请输入抽取概率', trigger: 'blur' }]
}

export default {
  name: 'EditActivity',
  components: { DatePicker, UploadSharePhoto, ActivityH5Page },
  data () {
    return {
      baseRules,
      shareRules,
      couponRules,
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
        effectivity: {
          effectivityType: '',
          autoExceed: '',
          abortTime: ''
        },
        lottery: '' // 抽奖率
      }
    }
  },
  created () {
    // setTimeout(() => {
    //   this.shareForm.fileList = [
    //     {
    //       path: "2020/06/02/FnFUA7HVIBwJvJrlgkqecgE9ZnTm.jpg",
    //       percentage: 100,
    //       status: 'success',
    //       response: '2020/06/02/FnFUA7HVIBwJvJrlgkqecgE9ZnTm.jpg'
    //     }
    //   ]
    // }, 3000)
  },
  methods: {
    async sumbitActivity () {
      try {
        await Promise.all([
          this.$refs.baseForm.validate(),
          this.$refs.shareForm.validate(),
          this.$refs.couponForm.validate()
        ])
      } catch (error) {
        if (error !== false) {
          throw new Error(error)
        }
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
  }

  .base-form {
    padding-bottom: 2px;
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
