<template>
    <a-layout>
      <a-layout-content
          :style="{ background: '#fff', padding: '24px', margin: 0, minHeight: '280px' }"
      >
        关于我们
      </a-layout-content>
    </a-layout>
</template>


<script lang="ts">
import axios from 'axios';
import { defineComponent, onMounted, ref, reactive, toRef } from 'vue';


export default defineComponent({
  name: 'About',
  // vue3 中大部分生命周期方法都被setup取代
  setup(){
    console.log("setup");

    // 响应式数据
    const ebooks = ref();

    // // 另外一种方式, vue3新增的方式
    // const ebooks1 = reactive({books: []});

    onMounted(() => {
      console.log("onMounted");
      axios.get('/api/v1/ebooks?page=1&size=10').then(
          (response) =>  {
            const data = response.data;
            ebooks.value = data.content.list;
            console.log(response);
          }
      )
    })
    return {
      ebooks,
      pagination:{
        onChange: (page: number) => {
          console.log(page);
        },
        pageSize: 10,
      },
      actions: [
      { type: 'StarOutlined', text: '156' },
      { type: 'LikeOutlined', text: '156' },
      { type: 'MessageOutlined', text: '2' },
    ],
    }

  }
});
</script>



<style scoped>
#components-layout-demo-top-side-2 .logo {
  float: left;
  width: 120px;
  height: 31px;
  margin: 16px 24px 16px 0;
  background: rgba(255, 255, 255, 0.3);
}

.ant-row-rtl #components-layout-demo-top-side-2 .logo {
  float: right;
  margin: 16px 0 16px 24px;
}

.site-layout-background {
  background: #fff;
}


.ant-avatar {
  width: 50px;
  height: 50px;
  line-height: 50px;
  border-radius: 8%;
  margin: 5px 0;
}
</style>