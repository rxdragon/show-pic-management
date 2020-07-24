<template>
  <div class="sub-category-edit">
    <el-button v-if="productObj.isSimple === 'notSimple'" class="add-style" @click="addStyle" type="primary">添加修图风格</el-button>
    <p class="product-sku-empty" v-if="productObj.isSimple === 'simple'">当前产品暂无修图风格/升级体验设置</p>
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
          v-if="item.styleForm.thumbnailList.length"
          class="thumbnail-img"
          :src="imgCompressDomain + item.styleForm.thumbnailList[0].path"
          alt=""
        />
        <div class="empty-img" v-else></div>
      </div>
      <div class="style-item">
        <span class="label">价格设置:</span>
        <span v-if="item.styleForm.isSimple === 'notSimple'">无价格设置(见升级体验)</span>
        <div v-else>
          <div v-if="item.styleForm.priceObj.simplePrice === 'contact'">
            <span>联系客服:</span>
            <span>展示价格：¥{{ item.styleForm.priceObj.simplePriceText }}</span>
          </div>
          <div class="price-standards" v-else>
            <div
              class="standard"
              v-for="(standerPriceItem, standerPriceIndex) in item.styleForm.priceObj.standerPrice"
              :key="standerPriceIndex"
            >
              <p>{{ standerPriceItem.name }}</p>
              <p>起始人头数: {{ standerPriceItem.basePeople }}人/张</p>
              <p>限制人头数: {{ standerPriceItem.limitPeople }}人</p>
              <p>照片价格: {{ standerPriceItem.price }}元/张</p>
              <p>起始人头数: {{ standerPriceItem.stepPrice }}元/人</p>
            </div>
          </div>
        </div>
      </div>
      <div class="style-item">
        <span class="label">下单说明:</span>
        <span>{{ item.styleForm.desc }}</span>
      </div>
      <!-- 升级体验区域 -->
      <div v-if="item.upgradeForms.length" class="upgrade-area" >
        <p class="title">升级体验</p>
        <el-table border class="upgrade-form" :data="item.upgradeForms" style="width: 100%;">
          <el-table-column prop="name" label="升级体验名称" width="120"></el-table-column>
          <el-table-column label="缩略图" width="120">
            <template slot-scope="scope">
              <img
                v-if="scope.row.thumbnailList.length"
                class="thumbnail-img"
                :src="imgCompressDomain + scope.row.thumbnailList[0].path"
                alt=""
              />
              <div class="empty-img" v-else></div>
            </template>
          </el-table-column>
          <el-table-column label="价格设置">
            <template slot-scope="scope">
              <div v-if="scope.row.priceObj.simplePrice === 'contact'">
                <p>联系客服</p>
                <p>展示价格: ¥{{ scope.row.priceObj.simplePriceText }}</p>
              </div>
              <div class="price-area-wrap" v-else>
                <div
                  class="price-area"
                  v-for="(standerPriceItem, standerPriceIndex) in scope.row.priceObj.standerPrice"
                  :key="standerPriceIndex"
                >
                  <p>{{ standerPriceItem.name }}</p>
                  <p>起始人头数: {{ standerPriceItem.basePeople }}人/张</p>
                  <p>限制人头数: {{ standerPriceItem.limitPeople }}人</p>
                  <p>照片价格: {{ standerPriceItem.price }}元/张</p>
                  <p>起始人头数: {{ standerPriceItem.stepPrice }}元/人</p>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="desc" label="下单说明" width="150"></el-table-column>
          <el-table-column label="操作" width="100">
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
      <el-button @click="check('next')" type="primary">下一步</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Tool from '../tools/index.js'

export default {
  name: 'SubCategoryConfigEdit',
  components: {},
  props: {
    productObj: { type: Object, required: true },
    productSkus: { type: Array, required: true },
    checkStatus: { type: Object, required: true }
  },
  computed: {
    ...mapGetters(['imgCompressDomain'])
  },
  mounted() {
    if (this.checkStatus.SubCategoryConfigEdit) {
      this.check()
      this.$emit('finalCheck', {
        type: 'del',
        tab: 'SubCategoryConfigEdit'
      })
    }
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
    check (type) {
      const { isSimple } = this.productObj
      const { productSkus } = this
      if (isSimple === 'notSimple' && !productSkus.length) {
        this.$newMessage.warning('设置了非单层商品,但是还未添加子品类')
        return
      }
      let hasNeedUpgrade = productSkus.some((item) => item.styleForm.isSimple === 'notSimple' && !item.upgradeForms.length)
      if (hasNeedUpgrade) {
        this.$newMessage.warning('存在缺少升级体验的产品')
        return
      }
      // 编辑时候可能老数据没有缩略图,检查没有缩略图的情况
      if (Tool.checkNoThumbnail(productSkus)) {
        this.$newMessage.warning('存在缺少缩略图的的产品')
        return
      }
      if (type === 'next') this.$emit('next', { aim: 'DetailConfig' })
     
      
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
  height: 1000px;
  overflow-y: auto;

  &::-webkit-scrollbar-thumb {
    display: none;
  }

  .categorys {
    margin-top: 20px;
    font-size: 14px;
    color: #303133;
  }

  .empty-img {
    display: inline-block;
    width: 100px;
    height: 100px;
    background: #fafafa;
  }

  .product-sku-empty {
    text-align: center;
  }

  .thumbnail-img {
    display: inline-block;
    width: 100px;
    height: 100px;
  }

  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 10px;
    font-size: 16px;
    font-weight: 700;
    background: #f0f2f5;

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
    display: flex;
    margin-top: 10px;

    .price-standards {
      display: flex;

      .standard {
        margin-right: 10px;
      }
    }

    .label {
      display: inline-block;
      width: 100px;
      margin-right: 10px;
    }
  }

  .upgrade-area {
    margin-top: 10px;

    .title {
      margin-bottom: 10px;
      font-weight: 700;
    }
  }

  .upgrade-form {
    .price-area-wrap {
      display: flex;

      .price-area {
        margin-right: 10px;
      }
    }
  }

  .next-page {
    display: flex;
    justify-content: center;
    margin-top: 10px;
  }
}
</style>
