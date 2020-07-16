---
title: 产品拖拽组件
---

# 产品拖拽排序
对展示产品，在线产品值进行排序操作

:::demo 测试

```html
<template>
  <drag-product @uploadSuccess="onUploadSuccess" />
</template>

<script>
  import DragProduct from '@/components/DragProduct'

  export default {
    components: {
      DragProduct
    },
    methods () {
      onUploadSuccess () {
        console.log('更新信息成功')
      }
    }
  }
</script>
```

#### Attributes Options

参数|说明|类型|可选值|默认值|备注
:--:|:--:|:--:|:--:|:--:|:--:
wait|间隔时间|Number|800|-
isDebounce|是否为防抖|Boolean|-|false|-

事件名称|说明|回调参数
:--:|:--:|:--:
uploadSuccess｜更新排序成功｜-
