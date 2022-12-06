export default {

    created() {
        if (this.$parent && this.$parent.menuInstance) {
            this.$parent.menuInstance(this);
        }
    },

    data() {
        return {
            preMenu: null,
            menus: [],
        }
    },

    methods: {
        menuInstance(menu) {
            this.menus.push(menu);
        },
        //子menu leave时要把对象传来，子Action不需要调用此函数
        menuLeave(menu) {
            this.preMenu = menu;
        },
        //子menu enter时传对象，子Action调用，不需要传对象(虽然传了也没事)
        //为了让前一个关闭
        enter(menu) {
            //两次menu相同:发生在光标从Actions外绕过去的情况
            if (this.preMenu && (!menu || this.preMenu != menu)) {
                this.preMenu.setVisible(false);
            }
        },
    }
}