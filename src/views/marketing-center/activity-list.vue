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
          <el-input v-model.trim="acactivityName" placeholder="请输入活动名称" />
        </div>
        <div class="search-item">
          <span>活动状态</span>
          <account-source-select v-model="acactivityState" />
        </div>
        <div class="search-button search-item">
          <el-button type="primary" size="small" @click="searchData(1)">查 询</el-button>
        </div>
      </div>
      <div class="table-box">
        <el-table :data="tableData" style="width: 100%;">
          <el-table-column prop="num" label="编号" width="50" />
          <el-table-column prop="acactivityName" label="活动名称" />
          <el-table-column prop="acactivityState" label="活动状态" />
          <el-table-column prop="startTime" label="开始时间" />
          <el-table-column prop="endTime" label="结束时间" />
          <el-table-column prop="date" label="优惠劵(张)" />
          <el-table-column prop="creater" label="创建者" />
          <el-table-column label="操作" align="right">
            <template slot-scope="{ row }">
              <el-dropdown>
                <el-button type="primary" size="small">
                  更多操作<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>下线活动</el-dropdown-item>
                  <el-dropdown-item @click.native="copyAcactivityLink(row, $event)">复制活动链接</el-dropdown-item>
                  <el-dropdown-item>删除活动</el-dropdown-item>
                  <el-dropdown-item>编辑活动</el-dropdown-item>
                  <el-dropdown-item>查询活动</el-dropdown-item>
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

export default {
  name: 'ActivityList',
  components: { DatePicker, AccountSourceSelect },
  data () {
    return {
      timeSpan: null,
      acactivityName: '',
      acactivityState: '',
      tableData: [
        {
          num: '1',
          acactivityName: 'xxxx',
          acactivityState: '未开始',
          startTime: '2019-09-09 13:00:00',
          endTime: '2019-09-10 13:00:00',
          creater: '班纳'
        }
      ],
      pager: {
        page: 1,
        pageSize: 10,
        total: 100
      }
    }
  },
  methods: {
    /**
     * @description 查询
     */
    searchData (page) {
      this.pager.page = page ? page : this.pager.page
    },
    /**
     * @description 页面改变
     */
    handleCurrentChange () {
      this.searchData()
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
    copyAcactivityLink (row, event) {
      // TODO 更改链接
      const text = ''
      handleClipboard(text, event)
    }
  }
}
</script>

<style lang="less" scoped>
.activity-list {
  margin-top: 20px;
}
</style>
