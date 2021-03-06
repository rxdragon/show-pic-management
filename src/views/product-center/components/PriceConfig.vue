<template>
  <div class="normal-config">
    <div class="condition">
      <el-radio-group v-model="priceObj.simplePrice">
        <div class="contact-wrap">
          <el-radio :label="PRODUCT_PRICE_STATUS.CONTACT">联系客服(针对特殊产品需要顾客联系客服下单)</el-radio>
          <div
            class="show-price"
            v-if="priceObj.simplePrice === PRODUCT_PRICE_STATUS.CONTACT"
          >
            <el-form ref="contactPrice" :model="priceObj" :rules="contactRules" label-width="100px">
              <el-form-item label="展示价格:" prop="simplePriceText">
                <el-input v-decimalOnly v-model.trim="priceObj.simplePriceText" placeholder="需要展示的价格" />
              </el-form-item>
            </el-form>
          </div>
        </div>
        <el-radio :label="PRODUCT_PRICE_STATUS.NORMAL">常规设置</el-radio>
      </el-radio-group>
    </div>
    <div
      class="top"
      v-if="priceObj.simplePrice === PRODUCT_PRICE_STATUS.NORMAL"
    >
      <el-form ref="psStandard" :model="priceObj" :rules="psStandardRules" label-width="110px">
        <el-form-item label="选择修图标准:" prop="psStandard">
          <el-checkbox-group @change="checkStandard" v-model="priceObj.psStandard">
            <el-checkbox label="blue">普通修图</el-checkbox>
            <el-checkbox label="master">大师修图</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </div>
    <div
      class="content"
      v-if="priceObj.simplePrice === PRODUCT_PRICE_STATUS.NORMAL"
    >
      <el-form
        v-for="(item, index) in priceObj.standerPrice"
        ref="standerPrice"
        :model="item"
        :rules="priceRules"
        label-width="100px"
        :key="item.name"
      >
        <p class="content-title">{{ item.name }}</p>
        <el-form-item label="起始人头数:" prop="basePeople">
          <el-input @change="(value) => baseChange(value, index)" v-numberOnly v-model="item.basePeople" />
          <span>人/张</span>
        </el-form-item>
        <el-form-item label="指定人头数:" prop="limitPeople">
          <el-input @change="(value) => limitChange(value, index)" v-numberOnly v-model="item.limitPeople" />
          <span>人</span>
        </el-form-item>
        <el-form-item label="照片价格:" prop="price">
          <el-input v-decimalOnly v-model="item.price" />
          <span>元</span>
        </el-form-item>
        <el-form-item label="人头价格:" prop="stepPrice">
          <el-input v-decimalOnly v-model="item.stepPrice" />
          <span>元/人</span>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { positiveIntValidator, priceDoubleValidator } from '@/utils/validator.js'
import { psTypeNameEnum, PRODUCT_PRICE_STATUS } from '@/model/Enumerate.js'

const contactRules = {
  simplePriceText: [
    { required: true, message: '请输入客服展示价格', trigger: ['blur', 'change'] }
  ]
}
const psStandardRules = {
  psStandard: [
    { required: true, message: '请至少勾选一项', trigger: 'change' }
  ]
}
const priceRules = {
  basePeople: [
    { required: true, message: '请输入起始人头数', trigger: ['blur', 'change'] },
    { validator: positiveIntValidator, message: '大于0的整数', trigger: ['blur', 'change'] }
  ],
  limitPeople: [
    { validator: positiveIntValidator, message: '大于0的整数', trigger: ['blur', 'change'] }
  ],
  price: [
    { required: true, message: '请输入照片基础价格', trigger: ['blur', 'change'] },
    { validator: priceDoubleValidator, message: '最多支持两位小数', trigger: ['blur', 'change'] }
  ],
  stepPrice: [
    { required: true, message: '请输入单个人头价格', trigger: ['blur', 'change'] },
    { validator: priceDoubleValidator, message: '最多支持两位小数', trigger: ['blur', 'change'] }
  ]
}
export default {
  name: 'PriceConfig',
  props: {
    priceObj: { type: Object, required: true }
  },
  data () {
    return {
      priceRules,
      contactRules,
      psStandardRules,
      PRODUCT_PRICE_STATUS
    }
  },
  methods: {
    /**
     * @description 勾选修图标准
     */
    checkStandard (value) {
      const tempArr = value.reduce((sum, item) => {
        let tempObj = {
          type: item,
          name: psTypeNameEnum[item],
          basePeople: '',
          limitPeople: '',
          price: '',
          stepPrice: ''
        }
        this.priceObj.standerPrice.forEach(standerPriceItem => {
          if (standerPriceItem.type === item) tempObj = standerPriceItem
        })
        if (item === 'blue') {
          sum.unshift(tempObj)
        } else {
          sum.push(tempObj)
        }
        return sum
      }, [])
      this.priceObj.standerPrice = tempArr
    },
    /**
     * @description 表单校验
     */
    formCheck (value) {
      const tempArr = []
      // 分客服情况和非客服情况
      if (this.priceObj.simplePrice === PRODUCT_PRICE_STATUS.CONTACT) {
        tempArr.push(this.$refs.contactPrice.validate())
        return tempArr
      }
      tempArr.push(this.$refs.psStandard.validate())
      this.priceObj.psStandard.forEach((item, index) => {
        tempArr.push(this.$refs.standerPrice[index].validate())
      })
      return tempArr
    },
    /**
     * @description 获取价格配置数据
     */
    getConfig (value) {
      const { simplePrice, simplePriceText, standerPrice } = this.priceObj
      const tempObj = { simplePrice }
      
      if (this.simplePrice === PRODUCT_PRICE_STATUS.CONTACT) { // 联系客服时候,获取展示价格
        tempObj.simplePriceText = simplePriceText
      }
      if (this.simplePrice === PRODUCT_PRICE_STATUS.NORMAL) { // 正常设置时候
        tempObj.standerPrice = standerPrice
      }
      return tempObj
    },
    /**
     * @description 限制人头数更改时
     */
    limitChange (value, index) {
      this.priceObj.standerPrice[index].basePeople = value
    },
    /**
     * @description 起始人头数更改时
     */
    baseChange (value, index) {
      this.priceObj.standerPrice[index].limitPeople = ''
    },
  }
}
</script>

<style lang="less" scoped>
.normal-config {
  .condition {
    margin-bottom: 20px;

    .contact-wrap {
      display: flex;
      align-items: center;
      height: 40px;
    }

    .show-price {
      display: flex;
      align-items: center;

      .el-form-item {
        margin-bottom: 0;
      }

      .title {
        width: 100px;
        font-size: 14px;
      }
    }

    /deep/ .el-input {
      width: 130px;
    }
  }

  .top {
    display: flex;

    .top-title {
      padding-right: 12px;
      font-size: 14px;
      font-weight: 700;
      color: #303133;
    }
  }

  .content {
    display: flex;

    /deep/ .el-input {
      width: 100px;
      margin-right: 12px;
    }

    .el-form {
      margin-right: 24px;
    }

    .content-title {
      width: 100px;
      padding-right: 12px;
      margin-bottom: 10px;
      font-weight: bold;
      text-align: right;
    }

    .item {
      margin-right: 100px;
    }

    .normal-item {
      display: flex;
      align-items: center;
      margin: 10px;
    }
  }
}
</style>
