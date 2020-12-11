<template>
  <div class="creation-coupon">
    <main class="module-panel">
      <el-form ref="form" :model="couponForm" :rules="rules" label-width="110px">
        <!-- 优惠劵名称 -->
        <el-form-item label="优惠劵名称：" prop="name">
          <el-input v-model="couponForm.name" maxlength="15" placeholder="请输入优惠劵名称" />
        </el-form-item>

        <!-- 适用产品 -->
        <el-form-item label="适用产品：" prop="products">
          <product-select v-model="couponForm.products" />
        </el-form-item>

        <!-- 优惠劵类型 -->
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

          <!-- 减免上限 -->
          <el-form-item label="减免上限：" prop="discountMaxMoney">
            <el-input v-numberOnly min="1" class="min-input" v-model="couponForm.discountMaxMoney"/> 元
          </el-form-item>
        </template>

        <!-- 使用门槛 -->
        <el-form-item label="使用门槛：" prop="useLimit">
          <el-radio-group v-model="couponForm.useLimit.usetype">
            <el-radio :label="0">无限制</el-radio>
            <el-radio :label="1">
              满 <el-input-number :min="1" v-model="couponForm.useLimit.maxMoney" controls-position="right" /> 元可用
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 总发行量 -->
        <el-form-item label="总发行量：" prop="circulation">
          <el-input-number
            :min="1"
            :max="1500"
            v-model="couponForm.circulation"
            controls-position="right"
            placeholder="请输入总发行量"
          /> 张
        </el-form-item>

        <!-- 有效时间 -->
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
                :picker-options="pickerOptions"
                placeholder="选择截止日期时间"
                default-time="25:59:59"
              />
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 备注(可选) -->
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
        <!-- 按钮 -->
        <el-form-item>
          <el-button type="info" @click="cancelCreate">返 回</el-button>
          <el-button v-if="cacheTitle !== couponForm.name" type="primary" @click="createCoupon">生 成</el-button>
        </el-form-item>
      </el-form>
      <!-- 券码编号 -->
      <div class="coupon-box" v-if="couponList.length">
        <coupon-code-list :coupon-name="outName" :coupon-list="couponList" />
      </div>
    </main>
  </div>
</template>

<script>
import CouponCodeList from './components/CouponCodeList'
import ProductSelect from '@/components/SelectBox/ProductSelect'
import * as Coupon from '@/api/coupon.js'
import { validateUseLimit, validateEffectivity } from '@/utils/validator.js'

export default {
  name: 'CreationCoupon',
  components: { CouponCodeList, ProductSelect },
  data () {
    return {
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now()
        }
      },
      rules: {
        name: [{ required: true, message: '请输入优惠劵名称', trigger: 'blur' }],
        type: [{ required: true, message: '请选择优惠劵类型', trigger: ['blur', 'change'] }],
        erectMoney: [{ required: true, message: '请输入立减券面额', trigger: 'blur' }],
        discountRange: [{ required: true, message: '请输入折扣力度', trigger: 'blur' }],
        discountMaxMoney: [{ required: true, message: '请输入减免上限', trigger: 'blur' }],
        useLimit: [{ required: true, validator: validateUseLimit, trigger: ['blur', 'change'] }],
        circulation: [{ required: true, message: '请输入总发行量', trigger: 'blur' }],
        effectivity: [{ required: true, validator: validateEffectivity, trigger: ['blur', 'change'] }]
      },
      outName: '', // 导出名字
      cacheTitle: '', // 缓存标题
      couponForm: {
        name: '', // 优惠劵名称
        products: [], // 适用产品
        type: 'discount_coupon', // 优惠劵类型 discount_coupon 折扣 decrease_coupon 立减
        erectMoney: '', // 立减劵面额
        discountRange: '', // 折扣力度
        discountMaxMoney: '', // 减免上限
        useLimit: {
          usetype: '', // 使用门槛
          maxMoney: '', // 多少元可用
        },
        circulation: '', // 总发行量
        effectivity: {
          effectivityType: '', // 有效类型
          autoExceed: '', // 自激活多少天后生效
          abortTime: '' // 固定截止日期
        },
        desc: '' // 备注
      },
      couponList: []
    }
  },
  activated () {
    this.resetPageData()
  },
  methods: {
    /**
     * @description 初始化信息
     */
    resetPageData (cleanList = true) {
      this.cacheTitle = ''
      this.couponForm = {
        name: '', // 优惠劵名称
        products: [], // 适用产品
        type: 'discount_coupon', // 优惠劵类型 discount_coupon 折扣 decrease_coupon 立减
        erectMoney: '', // 立减劵面额
        discountRange: '', // 折扣力度
        discountMaxMoney: '', // 减免上限
        useLimit: {
          usetype: '', // 使用门槛
          maxMoney: '', // 多少元可用
        },
        circulation: '', // 总发行量
        effectivity: {
          effectivityType: '', // 有效类型
          autoExceed: '', // 自激活多少天后生效
          abortTime: '' // 固定截止日期
        },
        desc: '' // 备注
      }
      if (cleanList) {
        this.couponList = []
        this.outName = ''
      }
      this.$refs.form.resetFields()
    },
    /**
     * @description 返回
     */
    cancelCreate () {
      this.$router.push('/marketing-center/coupon-management/coupon-list')
    },
    /**
     * @description 生成优惠劵
     */
    async createCoupon () {
      try {
        this.$loading()
        await this.$refs.form.validate()
        if (this.cacheTitle === this.couponForm.name) return this.$newMessage.warning('请更改相关配置再生成优惠券')
        if (this.couponForm.type === 'discount_coupon' && (+this.couponForm.discountRange >= 10 || +this.couponForm.discountRange <= 0)) {
          return this.$newMessage.warning('请输入正确的折扣券')
        }
        const req = {
          title: this.couponForm.name,
          type: this.couponForm.type,
          total: this.couponForm.circulation,
          value: this.couponForm.type === 'decrease_coupon' ? this.couponForm.erectMoney : this.couponForm.discountRange,
          limit: {},
          dateType: this.couponForm.effectivity.effectivityType
        }
        // 产品限制
        if (this.couponForm.products.length) {
          req.limit.productLimit = this.couponForm.products
        }
        // 减免上线
        if (this.couponForm.type === 'discount_coupon') {
          req.limit.reductionUpperLimit = this.couponForm.discountMaxMoney
        }
        if (this.couponForm.useLimit.usetype === 1) {
          req.limit.orderMoneyLowerLimit = this.couponForm.useLimit.maxMoney
        } else {
          req.limit.orderMoneyLowerLimit = 0
        }
        if (this.couponForm.desc) { req.note = this.couponForm.desc }
        // 生效时间
        if (this.couponForm.effectivity.effectivityType === 'receive') {
          req.expireDay = this.couponForm.effectivity.autoExceed
        }
        if (this.couponForm.effectivity.effectivityType === 'fixed') {
          req.stopAt = this.couponForm.effectivity.abortTime
        }
        const couponId = await Coupon.addCouponBatch(req)
        this.cacheTitle = this.couponForm.name
        await this.getCouponBatchCodeUseList(couponId)
        this.outName = this.couponForm.name
        this.resetPageData(false)
      } catch (error) {
        console.error(error)
      } finally {
        this.$loadingClose()
      }
    },
    /**
     * @description 获取券码列表
     */
    async getCouponBatchCodeUseList (couponBatchId) {
      const req = {
        cond: { couponBatchId },
        page: 1,
        pageSize: 1500
      }
      const data = await Coupon.getCouponBatchCodeUseList(req)
      this.couponList = data.list
    }
  }
}
</script>

<style lang="less" scoped>
.creation-coupon {
  margin-top: 24px;

  .module-panel {
    position: relative;

    .el-form {
      & /deep/ .el-form-item__label {
        color: #606266;
      }

      & /deep/ .el-radio__label {
        color: #606266;
      }

      .el-select {
        width: 250px;
      }

      .product-select {
        width: 250px;

        & /deep/ .el-select {
          width: 250px;
        }
      }

      .el-input {
        width: 250px;
      }

      .min-input {
        width: 80px;
      }

      .el-textarea {
        width: 400px;
      }
    }

    .coupon-box {
      position: absolute;
      top: 24px;
      right: 24px;
      padding: 16px;
      border: 1px solid #eee;
      border-radius: 10px;
    }
  }
}
</style>
