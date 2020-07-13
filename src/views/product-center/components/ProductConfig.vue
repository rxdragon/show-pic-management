<template>
  <div class="product-config">
    <!-- 基础配置 -->
    <div class="module-panel base-box base-form">
      <div class="panel-title">基础设置</div>
      <el-form ref="baseForm" :model="baseForm" :rules="baseRules" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model.trim="baseForm.name" maxlength="15" placeholder="产品名称,最多10个字符" />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>

// 基础配置
const baseRules = {
  name: [
    { required: true, message: '请输入产品名称', trigger: 'blur' },
    { max: 10, message: '最多10个字符', trigger: 'blur' }
  ],
}

export default {
  name: 'ProductConfig',
  props: {},
  data() {
    return {
      baseRules,
      baseForm: {
        name: ''
      },
    }
  },
  watch: {
   
  },
  methods: {
    
  }
}
</script>

<style lang="less" scoped>
.product-list {
  box-sizing: border-box;
  width: 400px;
  min-height: 600px;
  padding: 10px;
  border: 1px solid lightgray;

  .top {
    display: flex;
    justify-content: space-between;
  }

  .search {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;

    .el-input {
      width: 50%;
    }

    .el-select {
      width: 30%;
    }
  }

  .list-area {
    padding-top: 10px;

    /deep/ .is-current {
      color: aquamarine;
    }
  }
}
</style>
