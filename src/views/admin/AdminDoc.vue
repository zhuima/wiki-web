<template>


  <a-layout>
    <a-layout-sider width="200" style="background: #fff">
      <a-menu
          v-model:selectedKeys="selectedKeys2"
          v-model:openKeys="openKeys"
          mode="inline"
          :style="{ height: '100%', borderRight: 0 }"
      >
        <a-sub-menu key="sub1">
          <template #title>
              <span>
                <user-outlined />
                subnav 1
              </span>
          </template>
          <a-menu-item key="1">option1</a-menu-item>
          <a-menu-item key="2">option2</a-menu-item>
          <a-menu-item key="3">option3</a-menu-item>
          <a-menu-item key="4">option4</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="sub2">
          <template #title>
              <span>
                <laptop-outlined />
                subnav 2
              </span>
          </template>
          <a-menu-item key="5">option5</a-menu-item>
          <a-menu-item key="6">option6</a-menu-item>
          <a-menu-item key="7">option7</a-menu-item>
          <a-menu-item key="8">option8</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="sub3">
          <template #title>
              <span>
                <notification-outlined />
                subnav 3
              </span>
          </template>
          <a-menu-item key="9">option9</a-menu-item>
          <a-menu-item key="10">option10</a-menu-item>
          <a-menu-item key="11">option11</a-menu-item>
          <a-menu-item key="12">option12</a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>
    <a-layout-content
        :style="{ background: '#fff', padding: '24px', margin: 0, minHeight: '280px' }"
    >

      <a-row :gutter="18">
        <a-col :span="6">
    <!-- 检索 -->
    <p>
        <a-form layout="inline" :model="param">
          <a-form-item>
            <a-input v-model:value="param.name" placeholder="名称" allowClear>
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="handleQuery()">
              查询
            </a-button>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="add()">
              新增
            </a-button>
          </a-form-item>
        </a-form>
      </p>


      <!-- 列表页展示 -->
    <a-table
        v-if="level1.length > 0"
        :columns="columns"
        :row-key="record => record.id"
        :data-source="level1"
        :pagination="false"
        :loading="loading"
        size="small"
        :default-expand-all-rows="true"
      >
      <template #name="{ text, record }">
        {{record.sort}} {{text}}
      </template>
      <template v-slot:action="{ text, record }">
        <a-space size="small">
          <a-button type="primary" @click="edit(record)" size="small">
            编辑
          </a-button>
          <a-popconfirm
              title="删除后不可恢复，确认删除?"
              ok-text="是"
              cancel-text="否"
              @confirm="handleDelete(record.id)"
          >
            <a-button type="danger" size="small">
              删除
            </a-button>
          </a-popconfirm>
        </a-space>
      </template>
      </a-table>

      </a-col>
      <a-col :span="16">
        <p>
          <a-form layout="inline" :model="param">
            <a-form-item>
              <a-button type="primary" @click="handleSave()">
                保存
              </a-button>
            </a-form-item>
          </a-form>
        </p>
        <a-form :model="doc" layout="vertical">
          <a-form-item>
            <a-input v-model:value="doc.name" placeholder="名称"/>
          </a-form-item>
          <a-form-item>
            <a-tree-select
                v-model:value="doc.parent"
                style="width: 100%"
                :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                :tree-data="treeSelectData"
                placeholder="请选择父文档"
                tree-default-expand-all
                :fieldNames="{label: 'name', key: 'id', value: 'id'}"
            >
            </a-tree-select>
          </a-form-item>
          <a-form-item>
            <a-input v-model:value="doc.sort" placeholder="顺序"/>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="handlePreviewContent()">
              <EyeOutlined /> 内容预览
            </a-button>
          </a-form-item>
          <a-form-item>
            <div id="content"></div>
          </a-form-item>
        </a-form>

      </a-col>
      </a-row>


      <a-drawer width="900" placement="right" :closable="false" :visible="drawerVisible" @close="onDrawerClose">
        <div class="wangeditor" :innerHTML="previewHtml"></div>
      </a-drawer>
    </a-layout-content>
  </a-layout>
</template>


<script lang="ts">
import { defineComponent, onMounted, ref, createVNode } from 'vue';
import axios from 'axios';
import {message, Modal} from 'ant-design-vue';
import {useRoute} from "vue-router";
import ExclamationCircleOutlined from "@ant-design/icons-vue/ExclamationCircleOutlined";
import E from 'wangeditor';
import {Tool} from "../../util/tool";

  export default defineComponent({
    name: 'AdminDoc',
    setup() {
      const route = useRoute();
      console.log("路由：", route);
      console.log("route.path：", route.path);
      console.log("route.query：", route.query);
      console.log("route.param：", route.params);
      console.log("route.fullPath：", route.fullPath);
      console.log("route.name：", route.name);
      console.log("route.meta：", route.meta);
      const param = ref();
      param.value = {};
      const docs = ref();
      const loading = ref(false);
      // 因为树选择组件的属性状态，会随当前编辑的节点而变化，所以单独声明一个响应式变量
      const treeSelectData = ref();
      treeSelectData.value = [];

      const columns = [
        {
          title: '名称',
          dataIndex: 'name',
          slots: { customRender: 'name' }
        },
        {
          title: 'Action',
          key: 'action',
          slots: { customRender: 'action' }
        }
      ];

      /**
       * 一级分类树，children属性就是二级分类
       * [{
       *   id: "",
       *   name: "",
       *   children: [{
       *     id: "",
       *     name: "",
       *   }]
       * }]
       */
      const level1 = ref(); // 一级分类树，children属性就是二级分类
      level1.value = [];

      /**
       * 数据查询
       **/
      const handleQuery = () => {
        loading.value = true;
        // 如果不清空现有数据，则编辑保存重新加载数据后，再点编辑，则列表显示的还是编辑前的数据
        level1.value = [];
        axios.get("/api/v1/docs", {
          params: {
            page: 1,
            size: 100
          }
        }).then((response) => {
          loading.value = false;
          const data = response.data;
          if (data.success) {
            docs.value = data.content.list;
            console.log("原始数组：", docs.value);

            level1.value = [];
            level1.value = Tool.array2Tree(docs.value, 0);
            console.log("树形结构：", level1);
            // 父文档下拉框初始化，相当于点击新增
            treeSelectData.value = Tool.copy(level1.value) || [];
            // 为选择树添加一个"无"
            treeSelectData.value.unshift({id: 0, name: '无'});
          } else {
            message.error(data.message);
          }
        });
      };

      // -------- 表单 ---------
      const doc = ref({});
      doc.value = {
        ebookId: route.query.ebookId
      };
      const modalVisible = ref(false);
      const modalLoading = ref(false);
      const editor = new E('#content');
      editor.config.zIndex = 0;
      // 显示上传图片按钮，转成Base64存储，同时也支持拖拽图片
      // 上传图片文档：https://doc.wangeditor.com/pages/07-%E4%B8%8A%E4%BC%A0%E5%9B%BE%E7%89%87/01-%E9%85%8D%E7%BD%AE%E6%9C%8D%E5%8A%A1%E7%AB%AF%E6%8E%A5%E5%8F%A3.html
      // 上传视频文档：https://doc.wangeditor.com/pages/07-%E4%B8%8A%E4%BC%A0%E8%A7%86%E9%A2%91/01-%E9%85%8D%E7%BD%AE%E6%9C%8D%E5%8A%A1%E7%AB%AF%E6%8E%A5%E5%8F%A3.html
      editor.config.uploadImgShowBase64 = true;



      const handleSave = () => {
        modalLoading.value = true;
        doc.value.content = editor.txt.html();
        axios.post("/api/v1/docs", doc.value).then((response) => {
          modalLoading.value = false;
          const data = response.data; // data = commonResp
          if (data.success) {
            // modalVisible.value = false;
            message.success("保存成功！");

            // 重新加载列表
            handleQuery();
          } else {
            message.error(data.message);
          }
        });
      };


      /**
       * 将某节点及其子孙节点全部置为disabled
       */
      const setDisable = (treeSelectData: any, id: any) => {
        // console.log(treeSelectData, id);
        // 遍历数组，即遍历某一层节点
        for (let i = 0; i < treeSelectData.length; i++) {
          const node = treeSelectData[i];
          if (node.id === id) {
            // 如果当前节点就是目标节点
            console.log("disabled", node);
            // 将目标节点设置为disabled
            node.disabled = true;

            // 遍历所有子节点，将所有子节点全部都加上disabled
            const children = node.children;
            if (Tool.isNotEmpty(children)) {
              for (let j = 0; j < children.length; j++) {
                setDisable(children, children[j].id)
              }
            }
          } else {
            // 如果当前节点不是目标节点，则到其子节点再找找看。
            const children = node.children;
            if (Tool.isNotEmpty(children)) {
              setDisable(children, id);
            }
          }
        }
      };

      const deleteIds: Array<string> = [];
      const deleteNames: Array<string> = [];
      /**
       * 查找整根树枝
       */
      const getDeleteIds = (treeSelectData: any, id: any) => {
        // console.log(treeSelectData, id);
        // 遍历数组，即遍历某一层节点
        for (let i = 0; i < treeSelectData.length; i++) {
          const node = treeSelectData[i];
          if (node.id === id) {
            // 如果当前节点就是目标节点
            console.log("delete", node);
            // 将目标ID放入结果集ids
            // node.disabled = true;
            deleteIds.push(id);
            deleteNames.push(node.name);

            // 遍历所有子节点
            const children = node.children;
            if (Tool.isNotEmpty(children)) {
              for (let j = 0; j < children.length; j++) {
                getDeleteIds(children, children[j].id)
              }
            }
          } else {
            // 如果当前节点不是目标节点，则到其子节点再找找看。
            const children = node.children;
            if (Tool.isNotEmpty(children)) {
              getDeleteIds(children, id);
            }
          }
        }
      };


      /**
       * 内容查询
       **/
      const handleQueryContent = () => {
        axios.get("/doc/find-content/" + doc.value.id).then((response) => {
          const data = response.data;
          if (data.success) {
            editor.txt.html(data.content)
          } else {
            message.error(data.message);
          }
        });
      };




      /**
       * 编辑
       */
      const edit = (record: any) => {
        // 清空富文本框
        editor.txt.html("");
        modalVisible.value = true;
        doc.value = Tool.copy(record);
        handleQueryContent();

        // 不能选择当前节点及其所有子孙节点，作为父节点，会使树断开
        treeSelectData.value = Tool.copy(level1.value);
        setDisable(treeSelectData.value, record.id);

        // 为选择树添加一个"无"
        treeSelectData.value.unshift({id: 0, name: '无'});
      };

      /**
       * 新增
       */
      const add = () => {
        // 清空富文本框
        editor.txt.html("");
        modalVisible.value = true;
        doc.value = {
          ebookId: route.query.ebookId
        };

        treeSelectData.value = Tool.copy(level1.value) || [];

        // 为选择树添加一个"无"
        treeSelectData.value.unshift({id: 0, name: '无'});
      };

      const handleDelete = (id: number) => {
        // console.log(level1, level1.value, id)
        // 清空数组，否则多次删除时，数组会一直增加
        deleteIds.length = 0;
        deleteNames.length = 0;
        getDeleteIds(level1.value, id);
        Modal.confirm({
          title: '重要提醒',
          icon: createVNode(ExclamationCircleOutlined),
          content: '将删除：【' + deleteNames.join("，") + "】删除后不可恢复，确认删除？",
          onOk() {
            // console.log(ids)
            axios.delete("/api/v1/doc/" + deleteIds.join(",")).then((response) => {
              const data = response.data; // data = commonResp
              if (data.success) {
                // 重新加载列表
                handleQuery();
              } else {
                message.error(data.message);
              }
            });
          },
        });
      };

      // ----------------富文本预览--------------
      const drawerVisible = ref(false);
      const previewHtml = ref();
      const handlePreviewContent = () => {
        const html = editor.txt.html();
        previewHtml.value = html;
        drawerVisible.value = true;
      };
      const onDrawerClose = () => {
        drawerVisible.value = false;
      };




      onMounted(() => {
        handleQuery();
        editor.create();
      });

      return {
        param,
        // docs,
        level1,
        columns,
        loading,
        handleQuery,

        edit,
        add,

        doc,
        modalVisible,
        modalLoading,
        handleSave,

        handleDelete,

        treeSelectData,

        drawerVisible,
        previewHtml,
        handlePreviewContent,
        onDrawerClose,
      }
    }
  });
</script>

<style scoped>
  img {
    width: 50px;
    height: 50px;
  }
</style>
