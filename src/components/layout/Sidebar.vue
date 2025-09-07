<template>
  <div class="sidebar">
    <!-- TODO: existing sidebar content should go here -->
  </div>
</template>

<script>
export default {
  name: "Sidebar",
};
</script>

<style scoped>
/* Fix for mobile navbar overflow */
.sidebar {
  max-width: 100vw;       /* Prevent going outside screen */
  overflow-x: hidden;     /* Hide horizontal scroll */
  word-wrap: break-word;  /* Wrap long labels */
  white-space: normal;    /* Allow text to wrap instead of pushing */
}
</style>
