<template>
  <div class="coupon-detail">
    <main class="module-panel">
      <div class="coupon-base">
        <div class="panel-title">券码基础信息</div>
        <el-row class="info-main" :gutter="20" type="flex">
          <el-col :span="6">
            <div class="label">优惠劵名称：</div>
            <div class="value">xxx优惠劵</div>
          </el-col>
          <el-col :span="6">
            <div class="label">对应活动：</div>
            <div class="value">-</div>
          </el-col>
          <el-col :span="6">
            <div class="label">优惠劵类型：</div>
            <div class="value">立减券</div>
          </el-col>
          <el-col :span="6">
            <div class="label">面额：</div>
            <div class="value">¥50.00</div>
          </el-col>
          <el-col :span="6">
            <div class="label">使用门槛：</div>
            <div class="value">满20可用</div>
          </el-col>
          <el-col :span="6">
            <div class="label">总发行量：</div>
            <div class="value">1000张</div>
          </el-col>
          <el-col :span="6">
            <div class="label">有效时间：</div>
            <div class="value">无限制</div>
          </el-col>
        </el-row>
        <div class="remark">
          <div class="label">备注：</div>
          <div class="value">备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注</div>
        </div>
        <el-row class="info-main active-info" :gutter="20" type="flex">
          <el-col :span="4">
            <div class="label">待激活：</div>
            <div class="value">200张</div>
          </el-col>
          <el-col :span="4">
            <div class="label">已激活：</div>
            <div class="value">200张</div>
          </el-col>
          <el-col :span="4">
            <div class="label">已停用：</div>
            <div class="value">200张</div>
          </el-col>
          <el-col :span="4">
            <div class="label">已过期：</div>
            <div class="value">200张</div>
          </el-col>
          <el-col :span="4">
            <div class="label">已作废：</div>
            <div class="value">200张</div>
          </el-col>
        </el-row>
      </div>
      <el-divider></el-divider>
      <div class="coupon-tabel-search">
        <div class="panel-title">券码编号信息</div>
        <div class="search-box">
          <div class="search-item">
            <span>券码编号：</span>
            <el-input v-model="couponCode" placeholder="请输入编号"></el-input>
          </div>
          <div class="search-item">
            <span>券码状态：</span>
            <coupon-state-select v-model="couponState" />
          </div>
          <div class="search-button search-item">
            <el-button size="small" type="primary">查 询</el-button>
            <el-button size="small" type="blue">导 出</el-button>
          </div>
        </div>
        <!-- 优惠券列表 -->
        <el-table :data="tableData" style="width: 100%;">
          <el-table-column prop="couponCode" label="券码编号" width="120" />
          <el-table-column prop="couponState" label="状态" />
          <el-table-column prop="activeTime" label="激活时间" min-width="80" />
          <el-table-column prop="useTime" label="使用时间" min-width="80" />
          <el-table-column prop="usedUserAccount" label="绑定账号" min-width="100" />
          <el-table-column prop="usedOrder" label="使用订单号" min-width="130"/>
          <el-table-column label="操作" align="right">
            <template slot-scope="{ row }">
              <el-popover
                placement="top"
                title="作废提示"
                width="220"
                v-model="row.showPopover"
                popper-class="cancellation-box"
              >
                <p>{{ `确定是否作废【${row.couponName}】下的所有优惠券？` }}</p>
                <p class="cancellation-tip">提示：已经使用的优惠券将无法作废</p>
                <div class="cancellation-button">
                  <el-button type="info" size="mini" @click="cancelPop(row)">取消</el-button>
                  <el-button type="danger" size="mini" @click="showCancellation(row)">确定</el-button>
                </div>
                <el-button slot="reference" type="danger" size="small">作废</el-button>
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </main>
  </div>
</template>

<script>
import CouponStateSelect from '@selectBox/CouponStateSelect'

export default {
  name: 'CouponDetail',
  components: { CouponStateSelect },
  data () {
    return {
      couponCode: '',
      couponState: '',
      tableData: [
        {
          id: '12',
          couponCode: '12HJ89SU09',
          couponState: '已激活',
          activeTime: '2020-03-03 13:00:00',
          useTime: '2020-03-04 13:00:00',
          usedUserAccount: '13329877120',
          usedOrder: 'X202003211234',
          showPopover: false
        }
      ]
    }
  },
  methods: {
    /**
     * @description 取消作废选择
     */
    cancelPop (listItem) {
      listItem.showPopover = false
    },
    /**
     * @description 确定作废
     */
    showCancellation (listItem) {
      listItem.showPopover = false
    }
  }
}
</script>

<style lang="less" scoped>
.coupon-detail {
  margin-top: 24px;

  .label {
    width: 100px;
    font-size: 14px;
    font-weight: 400;
    color: #3e3e3e;
  }

  .value {
    font-size: 14px;
    font-weight: 400;
    color: #6e6e6e;
  }

  .coupon-base {
    .info-main {
      flex-wrap: wrap;
      margin-top: 20px;

      .el-col {
        display: flex;
        margin-bottom: 16px;
      }
    }

    .active-info {
      .el-col {
        margin-bottom: 0;

        .label {
          width: 80px;
        }
      }
    }

    .remark {
      display: flex;

      .value {
        width: 600px;
        word-wrap: break-word;
      }
    }
  }

  .search-box {
    margin-top: 20px;
  }
}
</style>

<style lang="less">
.cancellation-box {
  & /deep/ .el-popover__title {
    font-weight: 500;
  }

  .cancellation-tip {
    margin-top: 4px;
    font-size: 12px;
    color: @color-text-placeholder;
  }

  .cancellation-button {
    margin-top: 10px;
    text-align: right;
  }
}
</style>
