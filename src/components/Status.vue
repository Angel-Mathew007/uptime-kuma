<template>
    <span
        class="badge rounded-pill"
        :class="'bg-' + computedColor"
        :title="computedText"
        :aria-label="'Monitor status: ' + computedText"
    >
        {{ computedText }}
    </span>
</template>

<script>
export default {
    props: {
        /** Current status of monitor */
        status: {
            type: Number,
            default: 0,
        },
        /** Optional custom color mapping */
        statusColorMap: {
            type: Object,
            default: () => ({
                0: "danger",      // Down
                1: "primary",     // Up
                2: "warning",     // Pending
                3: "maintenance", // Maintenance
                unknown: "secondary",
            }),
        },
        /** Optional custom text mapping */
        statusTextMap: {
            type: Object,
            default: () => ({
                0: "Down",
                1: "Up",
                2: "Pending",
                3: "Maintenance",
                unknown: "Unknown",
            }),
        },
    },

    computed: {
        computedColor() {
            return this.statusColorMap[this.status] || this.statusColorMap.unknown;
        },

        computedText() {
            return this.statusTextMap[this.status] || this.statusTextMap.unknown;
        },
    },
};
</script>

<style scoped>
span {
    min-width: 64px;
    text-align: center;
}
</style>
