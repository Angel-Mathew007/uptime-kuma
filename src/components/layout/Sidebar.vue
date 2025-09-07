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

<style>
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
  flex-wrap: wrap;
  gap: 6px;
  max-width: 100%;
  overflow-x: hidden;
}

/* Make dropdowns/search shrink instead of pushing */
.filter-bar select,
.filter-bar input,
.filter-bar button {
  flex: 1 1 auto;
  min-width: 80px;
}

/* Extra catch-all for small screens */
@media (max-width: 768px) {
  .sidebar div,
  .list-tab div {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    max-width: 100%;
    overflow-x: hidden;
  }

  .sidebar div select,
  .sidebar div input,
  .sidebar div button,
  .list-tab div select,
  .list-tab div input,
  .list-tab div button {
    flex: 1 1 auto;
    min-width: 80px;
  }
}
</style>
