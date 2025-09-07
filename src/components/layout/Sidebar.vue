<template>
  <div class="sidebar">
    <!-- TODO: existing sidebar content should go here -->
    <div class="filter-bar">
      <select>
        <option>Select</option>
      </select>
      <input type="text" placeholder="Search..." />
      <button>Status</button>
      <button>Active</button>
      <button>Tags</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Sidebar",
};
</script>

<style scoped>
/* Sidebar fix */
.sidebar {
  max-width: 100vw;
  overflow-x: hidden;
  word-wrap: break-word;
  white-space: normal;
}

/* Fix filter bar inside the List tab */
.filter-bar {
  display: flex;
  flex-wrap: wrap;        /* allow items to wrap */
  gap: 6px;               /* spacing between wrapped items */
  max-width: 100%;        /* never exceed screen width */
  overflow-x: hidden;     /* prevent horizontal scroll */
}

/* Make dropdowns/search shrink instead of pushing */
.filter-bar select,
.filter-bar input,
.filter-bar button {
  flex: 1 1 auto;         /* allow them to shrink on small screens */
  min-width: 80px;        /* prevent collapsing too much */
}
</style>
