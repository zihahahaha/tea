import { reactive } from "vue";

const desktop = reactive({
    desktopClient: {
        bgc: {
            //img | color
            type: "img",
            data: "bgc2.jpg",
            sizeAndPosition: {
                type: "default",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }
        }
    },
    taskbar: {
        //top | bottom | left | right
        pos: "left",
        hidden: false,
    }
});

export { desktop };
