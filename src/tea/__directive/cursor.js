import { exports } from "tea/config/exports";
const style = exports.style;

//接收在move时的回调函数,光标样式作为arg
export const move = {
    created(el, binding) {
        let onMove = binding.value.move;
        let upHook = binding.value.up ? binding.value.up : () => { };
        function onDown(e, el) {
            if (e.button == 0) {
                console.log("down");
                style.sheet.insertRule(`*{cursor:${binding.arg}!important}`, 0);
                window.addEventListener("mousemove", onMove);
                window.addEventListener("mouseup", onUp);
            }
        }
        function onUp() {
            console.log("up");
            style.sheet.deleteRule(0);
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseup", onUp);
            upHook();
        }
        el.addEventListener("mousedown", onDown);
    }
};

export const enter = {
    created(el, binding) {
        el.addEventListener("mouseenter", () => {
            binding.value = true;
        });
        el.addEventListener("mouseout", () => {
            binding.value = false;
            console.log('out');
        });
    }
}

