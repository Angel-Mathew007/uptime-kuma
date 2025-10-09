import dayjs from "dayjs";
import "dayjs/plugin/utc";
import "dayjs/plugin/timezone";

/**
 * DateTime Mixin
 * Handles timezone and localization via vue-i18n
 */
export default {
    data() {
        return {
            userTimezone: localStorage.timezone || "auto",
        };
    },

    methods: {
        /**
         * Convert value to UTC
         * @param {string | number | Date | dayjs.Dayjs} value Time to convert
         * @returns {dayjs.Dayjs} Converted time
         */
        toUTC(value) {
            return dayjs.tz(value, this.timezone).utc().format();
        },

        /**
         * Used for <input type="datetime" />
         * @param {string | number | Date | dayjs.Dayjs} value Value to convert
         * @returns {string} Datetime string
         */
        toDateTimeInputFormat(value) {
            return this.datetimeFormat(value, { dateStyle: "short", timeStyle: "short" });
        },

        /**
         * Format a value in localized datetime
         * @param {any} value Value to format
         * @returns {string} Formatted string
         */
        datetime(value) {
            return this.datetimeFormat(value, { dateStyle: "medium", timeStyle: "short" });
        },

        /**
         * Converts a Unix timestamp to localized datetime
         * @param {number} value Unix timestamp
         * @returns {string} Localized datetime string
         */
        unixToDateTime(value) {
            return this.datetimeFormat(new Date(value * 1000), { dateStyle: "medium", timeStyle: "short" });
        },

        /**
         * Converts Unix timestamp to dayjs object
         * @param {number} value Unix timestamp
         * @returns {dayjs.Dayjs} dayjs object
         */
        unixToDayjs(value) {
            return dayjs.unix(value).tz(this.timezone);
        },

        /**
         * Converts a value to dayjs object with timezone
         * @param {string} value
         * @returns {dayjs.Dayjs}
         */
        toDayjs(value) {
            return dayjs.utc(value).tz(this.timezone);
        },

        /**
         * Format maintenance time with conditional format
         * @param {any} value
         * @returns {string}
         */
        datetimeMaintenance(value) {
            const inputDate = new Date(value);
            const now = new Date(Date.now());

            if (
                inputDate.getFullYear() === now.getUTCFullYear() &&
                inputDate.getMonth() === now.getUTCMonth() &&
                inputDate.getDate() === now.getUTCDate()
            ) {
                return this.datetimeFormat(value, { timeStyle: "short" });
            } else {
                return this.datetimeFormat(value, { dateStyle: "short", timeStyle: "short" });
            }
        },

        /**
         * Format date only
         * @param {any} value
         * @returns {string}
         */
        date(value) {
            return this.datetimeFormat(value, { dateStyle: "medium" });
        },

        /**
         * Format time only
         * @param {any} value
         * @param {boolean} includeSeconds
         * @returns {string}
         */
        time(value, includeSeconds = true) {
            const options = includeSeconds
                ? { hour: "2-digit", minute: "2-digit", second: "2-digit" }
                : { hour: "2-digit", minute: "2-digit" };
            return this.datetimeFormat(value, options);
        },

        /**
         * Main datetime formatter using vue-i18n
         * @param {any} value
         * @param {Object} options Intl.DateTimeFormat options
         * @returns {string}
         */
        datetimeFormat(value, options = { dateStyle: "medium", timeStyle: "short" }) {
            if (!value) return "";
            return this.$d(new Date(value), options);
        },
    },

    computed: {
        timezone() {
            if (this.userTimezone === "auto") {
                return dayjs.tz.guess();
            }
            return this.userTimezone;
        },
    },
};
