<script lang="ts" setup>
import { computed, useAttrs } from "vue";

type ButtonVariant = "primary" | "secondary";
type NativeButtonType = "button" | "submit" | "reset";

const props = withDefaults(
    defineProps<{
        variant?: ButtonVariant;
        label?: string;
        disabled?: boolean;
        type?: NativeButtonType;
    }>(),
    {
        variant: "primary",
        label: "",
        disabled: false,
        type: "button",
    }
);

const emit = defineEmits<{
    (e: "click", ev: MouseEvent): void;
}>();

const attrs = useAttrs();

const isDisabled = computed(() => !!props.disabled || !!attrs["disabled"]);

const baseClasses =
    "inline-flex items-center justify-center select-none rounded-full h-12 px-8 font-semibold text-sm leading-none transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

const variantClasses = computed(() => {
    if (isDisabled.value) {
        return "bg-[#E3E3E3] text-[#C8C8C8] cursor-not-allowed";
    }

    if (props.variant === "secondary") {
        // Enabled: light blue bg + blue text
        // Pressed: deeper light blue bg
        return "bg-[#E3F4FE] text-[#4BA6EE] active:bg-[#92D3F9]";
    }

    // Primary
    // Enabled: blue bg + white text
    // Pressed: darker blue bg
    return "bg-[#4BA6EE] text-white active:bg-[#377DB2]";
});

const classes = computed(() => `${baseClasses} ${variantClasses.value}`);

const onClick = (ev: MouseEvent) => {
    if (isDisabled.value) return;
    emit("click", ev);
};
</script>

<template>
    <button
        :type="type"
        :disabled="isDisabled"
        :class="classes"
        @click="onClick"
    >
        <slot>
            <span>{{ label }}</span>
        </slot>
    </button>
</template>
