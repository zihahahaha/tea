<template>
    <div class="app-blog">
      <div class="app-blog_menubar">

        <MenuBar>

          <Menu title="文件">
            <Action title="新建" />
            <Action title="打开" />
            <Action title="保存" />
            <Action title="信息" />
          </Menu>

          <Menu title="查看">
            <Action title="预览" 
              @click="preview" />
            <Action title="信息" />
          </Menu>

        </MenuBar>
          
      </div>

      <textarea class="editor"
        ref="editor"
        spellcheck="false" 
        v-model="markdown"
        @keydown="keydown" />

      <div class="statebar">

      </div>

    </div>

</template>

<script>
import { nextTick } from "vue";

// Components
import { MenuBar, Menu, Action } from "cn/Menus";

// Utils
import md from "app/__utils/markdown.js";
import { list, listItem } from "app/__utils/datastruct.js"

const markdownHistroyNum = 10;

export default {
  components: {
    MenuBar,
    Menu,
    Action,
  },

  name: "blog",

  // created() {
  //   this.$parent.setTitle("新建BLOG");
  // },

  data() {
    return {
      previewWndId: undefined,
      markdownHistroys: new list(),
      markdown: "",
    }
  },
  created() {
    this.markdownHistroys.add(new listItem({ val: this.markdown, select: this.markdown.length }));
  },
  watch: {
    markdown: {
      handler(val) {
        if (this.markdownHistroys.num < markdownHistroyNum) {
          this.markdownHistroys.add(new listItem({ val, select: this.$refs.editor.selectionStart }));
        }
        else {
          this.markdownHistroys.deleteHead();
          this.markdownHistroys.add(new listItem({ val, select: this.$refs.editor.selectionStart }));
        }

        if (this.previewWndId) {
          this.$parent.sendMessage(this.previewWndId, md.render(this.markdown));
        }
      }
    }
  },
  methods: {
    keydown(e) {
      if (e.key == "Tab") {
        if (this.$refs.editor.selectionStart == this.$refs.editor.selectionEnd) {
          let pos = this.$refs.editor.selectionStart;
          e.preventDefault();
          this.markdown = this.markdown.slice(0, pos) + "  " + this.markdown.slice(pos);
          nextTick(() => {
            this.$refs.editor.setSelectionRange(pos + 2, pos + 2);
          })
        }
      }
      if (e.key == "Enter") {
        e.preventDefault();
        let ans, insertPosL, insertPosR;
        if (this.$refs.editor.selectionStart < this.$refs.editor.selectionEnd) {
          ans = this.$refs.editor.selectionStart;
          insertPosL = ans;
          insertPosR = this.$refs.editor.selectionEnd;
        }
        else {
          ans = this.$refs.editor.selectionEnd;
          insertPosL = ans;
          insertPosR = this.$refs.editor.selectionStart;
        }
        let whiteNum = 0;
        while (this.markdown[ans] != "\n" && ans > 0) ans--;
        if (this.markdown[ans] == "\n") ans++;
        while (this.markdown[ans++] == " ") whiteNum++;
        let plus = "";
        if (this.$refs.editor.selectionStart == this.$refs.editor.selectionEnd
          && this.markdown[this.$refs.editor.selectionStart - 1] == "{"
          && this.markdown[this.$refs.editor.selectionStart] == "}") {
          console.log("{}");
        }
        this.markdown = this.markdown.slice(0, insertPosL) + "\n" + " ".repeat(whiteNum) + this.markdown.slice(insertPosR);
        nextTick(() => {
          this.$refs.editor.setSelectionRange(insertPosL + whiteNum + 1, insertPosL + whiteNum + 1);
        })
      }
      if (e.key.toLowerCase() == "z" && e.ctrlKey) {
        e.preventDefault();
        if (this.markdownHistroys.num > 1) {
          this.markdownHistroys.deleteTail();
          this.markdown = this.markdownHistroys.tail.val;
          const select = this.markdownHistroys.tail.select;
          this.markdownHistroys.deleteTail();
          nextTick(() => {
            this.$refs.editor.setSelectionRange(select, select);
          })
        }
      }
      if (e.key == "{") {
        if (this.$refs.editor.selectionStart == this.$refs.editor.selectionEnd
          && this.$refs.editor.selectionStart == this.markdown.length) {
          e.preventDefault();
          this.markdown += "{}";
          nextTick(() => {
            this.$refs.editor.setSelectionRange(this.markdown.length - 1, this.markdown.length - 1);
          });
        }
      }
    },
    preview() {
      let id = this.$parent.open("blog-preview");
      this.previewWndId = id;
    },
  }

}
</script>

<style scoped>
.app-blog {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}
.app-blog_menubar {
  flex-shrink: 0;
}
.editor {
  flex: 1;
  outline: none;
  resize: none;
  border: none;
  white-space: nowrap;
}
.statebar {
  text-align: right;
  padding-right: 10px;
}
</style>