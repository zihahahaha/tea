import MarkdownIt from "markdown-it";
import hljs from "highlight.js"

export default MarkdownIt({
    breaks: true,
    highlight: function (str, lang) {
        console.log(str);
        if (lang && hljs.getLanguage(lang)) {
            return hljs.highlight(str, { language: lang }).value;
        }
        return ''; // 使用额外的默认转义
    }
});