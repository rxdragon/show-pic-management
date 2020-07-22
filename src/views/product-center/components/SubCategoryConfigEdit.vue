<template>
  <div class="sub-category-edit">
    <el-button v-if="productObj.isSimple === 'notSimple'" class="add-style" @click="addStyle" type="primary">添加修图风格</el-button>
    <div v-for="(item, index) in productSkus" class="categorys" :key="item.uuid">
      <div class="top">
        <span>{{ item.styleForm.name }}</span>
        <div class="operate">
          <span @click="delStyle(index, item.styleForm)" class="operate-text del">删除</span>
          <span @click="editStyle(index)" class="operate-text edit">编辑</span>
        </div>
      </div>
      <div class="style-item">
        <span class="label">缩略图:</span>
        <img
          class="thumbnail-img"
          :src="imgCompressDomain + item.styleForm.thumbnailList[0].path"
          alt=""
        />
      </div>
      <div class="style-item">
        <span class="label">价格设置:</span>
        <span v-if="item.styleForm.isSimple === 'notSimple'">无价格设置(见升级体验)</span>
        <div v-else>
          <div v-if="item.styleForm.priceObj.simplePrice === 'contact'">
            <span>联系客服:</span>
            <span>展示价格：¥{{ item.styleForm.priceObj.simplePriceText }}</span>
          </div>
          <div v-else>
            <div
              v-for="(standerPriceItem, standerPriceIndex) in item.styleForm.priceObj.standerPrice"
              :key="standerPriceIndex"
            >
              <p>修图标准: {{ standerPriceItem.name }}</p>
              <p>起始人头数: {{ standerPriceItem.basePeople }}人/张</p>
              <p>限制人头数: {{ standerPriceItem.limitPeople }}人</p>
              <p>照片价格: {{ standerPriceItem.price }}元/张</p>
              <p>起始人头数: {{ standerPriceItem.stepPrice }}元/人</p>
            </div>
          </div>
        </div>
      </div>
      <div class="style-item">
        <span class="label">下单说明</span>
        <span>{{ item.styleForm.desc }}</span>
      </div>
      <!-- 升级体验区域 -->
      <div v-if="item.upgradeForms.length" class="upgrade-area" >
        <p>升级体验</p>
        <el-table class="upgrade-form" :data="item.upgradeForms" style="width: 1000px;">
          <el-table-column prop="name" label="升级体验名称" width="180"></el-table-column>
          <el-table-column label="缩略图" width="180">
            <template slot-scope="scope">
              <img
                class="thumbnail-img"
                :src="imgCompressDomain + scope.row.thumbnailList[0].path"
                alt=""
              />
            </template>
          </el-table-column>
          <el-table-column label="价格设置">
            <template slot-scope="scope">
              <div v-if="scope.row.priceObj.simplePrice === 'contact'">
                <p>联系客服</p>
                <p>展示价格: ¥{{ scope.row.priceObj.simplePriceText }}</p>
              </div>
              <div v-else>
                <div
                  class="price-area"
                  v-for="(standerPriceItem, standerPriceIndex) in scope.row.priceObj.standerPrice"
                  :key="standerPriceIndex"
                >
                  <p>修图标准: {{ standerPriceItem.name }}</p>
                  <p>起始人头数: {{ standerPriceItem.basePeople }}人/张</p>
                  <p>限制人头数: {{ standerPriceItem.limitPeople }}人</p>
                  <p>照片价格: {{ standerPriceItem.price }}元/张</p>
                  <p>起始人头数: {{ standerPriceItem.stepPrice }}元/人</p>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="desc" label="下单说明" width="180"></el-table-column>
          <el-table-column label="操作" width="180">
            <template slot-scope="scope">
              <el-button
                type="danger"
                @click="delUpgradeItem(scope.$index, scope.row, index)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="next-page">
      <el-button @click="nextPage" type="primary">下一步</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'SubCategoryConfigEdit',
  components: {},
  props: {
    productObj: { type: Object, required: true },
    productSkus: { type: Array, required: true }
  },
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['imgCompressDomain'])
  },
  methods: {
    /**
     * @description 提交到下一步
     */
    submit () {
      if (this.check()) {
        this.$emit('next', {
          aim: 'DetailConfig'
        })
      }
    },
    /**
     * @description 删除一个升级项
     */
    async delUpgradeItem (upgradeIndex, item, skuIndex) {
      try {
        await this.$confirm(`确定要删除${item.name}升级体验吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        this.productSkus[skuIndex].upgradeForms.splice(upgradeIndex, 1)
      } catch (error) {
        console.error(error)
      }
    },
    /**
     * @description 下一步
     */
    nextPage () {
      const { isSimple } = this.productObj
      const { productSkus } = this
      if (isSimple === 'notSimple' && !productSkus.length) {
        this.$newMessage.warning('设置了非单层商品,但是还未添加子品类')
        return
      }
      this.$emit('next', {
        aim: 'DetailConfig'
      })
      
    },
    /**
     * @description add一个风格
     */
    addStyle () {
      this.$emit('next', {
        type: 'edit',
        isNew: true
      })
    },
    /**
     * @description 删除一个风格
     */
    async delStyle (index, item) {
      try {
        await this.$confirm(`确定要删除${item.name}风格吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        this.productSkus.splice(index, 1)
      } catch (error) {
        console.error(error)
      }
    },
    /**
     * @description 跳转新增页面页
     */
    editStyle (index) {
      this.$emit('next', {
        type: 'edit',
        isNew: false,
        index
      })
    },
  }
}
</script>

<style lang="less" scoped>
.sub-category-edit {
  .thumbnail-img {
    width: 100px;
    height: 100px;
  }

  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 10px;
    background: lightgray;

    .operate-text {
      margin: 10px;
      cursor: pointer;

      &.del {
        color: red;
      }

      &.edit {
        color: #00b1b7;
      }
    }
  }

  .style-item {
    margin-top: 10px;

    .label {
      display: inline-block;
      width: 100px;
      margin-right: 10px;
    }
  }

  .upgrade-form {
    .price-area {
      margin-bottom: 10px;
    }
  }

  .next-page {
    display: flex;
    justify-content: center;
    margin-top: 10px;
  }
}
</style>
