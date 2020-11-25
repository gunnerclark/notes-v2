<template>
    <div>
        <router-view />
    </div>
</template>

<script>
export default {
    watch: {
      '$route' (to, from) {
        document.title = to.meta.title || 'Notes'
      }
    }
}
</script>

<style lang="scss" scoped>

</style>