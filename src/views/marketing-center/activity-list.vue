<template>
  <div class="activity-list">
    <div class="header-plugin">
      <el-button type="primary" size="small" @click="linkToCreateActivity">新增活动</el-button>
    </div>
    <main class="module-panel">
      <div class="search-box">
        <div class="search-item">
          <span>创建时间</span>
          <date-picker v-model="timeSpan" />
        </div>
        <div class="search-item">
          <span>活动名称</span>
          <el-input v-model.trim="acactivityName" clearable placeholder="请输入活动名称" />
        </div>
        <div class="search-item">
          <span>活动状态</span>
          <account-source-select v-model="acactivityState" />
        </div>
        <div class="search-button search-item">
          <el-button type="primary" size="small" @click="searchActivityList(1)">查 询</el-button>
        </div>
      </div>
      <div class="table-box">
        <el-table :data="tableData" style="width: 100%;">
          <el-table-column prop="id" label="编号" width="50" />
          <el-table-column prop="name" label="活动名称" />
          <el-table-column prop="statusCN" label="活动状态" />
          <el-table-column prop="beginTime" label="开始时间" />
          <el-table-column prop="endTime" label="结束时间" />
          <el-table-column label="优惠劵(张)" width="150">
            <template slot-scope="{ row }">
              <div>
                <p><span>总发行量：</span>{{ row.couponBatchesInfo.total }}</p>
                <p><span>剩余张数：</span>{{ row.couponBatchesInfo.waitActiveNum }}</p>
                <p><span>每人限量：</span>{{ row.couponBatchesInfo.limitCount }}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="creatorName" label="创建者" />
          <el-table-column label="操作" align="right">
            <template slot-scope="{ row }">
              <el-dropdown>
                <el-button type="primary" size="small">
                  更多操作<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-if="row.status === ACTIVITY_STATE.STARTED" @click.native="offlineActivity(row)">下线活动</el-dropdown-item>
                  <el-dropdown-item
                    v-if="row.status === ACTIVITY_STATE.STARTED || row.status === ACTIVITY_STATE.WAITING"
                    @click.native="copyActivityLink(row, $event)"
                  >
                    复制活动链接
                  </el-dropdown-item>
                  <el-dropdown-item v-if="row.status === ACTIVITY_STATE.WAITING" @click.native="deleteActivity(row)">删除活动</el-dropdown-item>
                  <el-dropdown-item v-if="row.status === ACTIVITY_STATE.WAITING" @click.native="editActivity(row.id)">编辑活动</el-dropdown-item>
                  <el-dropdown-item @click.native="linkToDetail(row.couponBatchId)">查询活动优惠券</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </main>
    <div class="page-box">
      <el-pagination
        hide-on-single-page
        layout="prev, pager, next, jumper"
        :current-page.sync="pager.page"
        :page-size="pager.pageSize"
        :total="pager.total"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import DatePicker from '@/components/DatePicker'
import AccountSourceSelect from '@selectBox/AccountSourceSelect'
import handleClipboard from '@/utils/clipboard.js'
import * as TimeUtil from '@/utils/timeUtil.js'
import * as Activity from '@/api/activity.js'
import { ACTIVITY_STATE } from '@/model/Enumerate'

export default {
  name: 'ActivityList',
  components: { DatePicker, AccountSourceSelect },
  data () {
    return {
      ACTIVITY_STATE,
      timeSpan: null,
      acactivityName: '', // 活动名称
      acactivityState: '', // 活动状态
      tableData: [], // 订单列表
      pager: {
        page: 1,
        pageSize: 10,
        total: 100
      }
    }
  },
  created () {
    this.searchActivityList()
  },
  methods: {
    /**
     * @description 搜索活动列表
     */
    async searchActivityList (page) {
      try {
        this.$loading()
        const req = {
          cond: {},
          page: this.pager.page,
          pageSize: this.pager.pageSize
        }
        if (this.timeSpan) {
          req.cond.createBeginTime = TimeUtil.startDayTime(this.timeSpan[0]),
          req.cond.createEndTime = TimeUtil.endDayTime(this.timeSpan[1])
        }
        if (this.acactivityState) { req.cond.status = this.acactivityState }
        if (this.acactivityName) { req.cond.name = this.acactivityName }
        if (!Object.keys(req.cond).length) { delete req.cond }
        this.pager.page = page ? page : this.pager.page
        const data = await Activity.getActivityList(req)
        this.tableData = data.list
        this.pager.total = data.total
      } catch (error) {
        console.error(error)
        throw new Error(error)
      } finally {
        this.$loadingClose()
      }
    },
    /**
     * @description 页面改变
     */
    handleCurrentChange () {
      this.searchActivityList()
    },
    /**
     * @description 跳转到详情
     */
    linkToDetail (id) {
      if (!id) return this.$newMessage.warning('优惠券id获取失败')
      this.$router.push({
        path: '/marketing-center/coupon-management/coupon-detail',
        query: { id }
      })
    },
    /**
     * @description 跳转链接
     */
    linkToCreateActivity () {
      this.$router.push({
        path: '/marketing-center/activity-management/edit-activity'
      })
    },
    /**
     * @description 拷贝链接
     */
    copyActivityLink (row, event) {
      // TODO 更改链接
      const text = '123'
      handleClipboard(text, event)
    },
    /**
     * @description 编辑活动
     */
    editActivity (activityId) {
      this.$router.push({
        path: '/marketing-center/activity-management/edit-activity',
        query: { activityId }
      })
    },
    /**
     * @description 下线活动
     */
    async offlineActivity (row) {
      try {
        await this.$confirm(`确定将【${row.name}】提前下线吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        this.$loading()
        const req = { id: row.id }
        await Activity.offlineActivity(req)
        this.searchActivityList()
      } catch (error) {
        console.error(error)
      } finally {
        this.$loadingClose()
      }
    },
    /**
     * @description 删除活动
     */
    async deleteActivity (row) {
      try {
        await this.$confirm(`确定将【${row.name}】删除吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        this.$loading()
        const req = { id: row.id }
        await Activity.deleteActivity(req)
        this.searchActivityList()
      } catch (error) {
        console.error(error)
      } finally {
        this.$loadingClose()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.activity-list {
  margin-top: 20px;
}
</style>
