<template>
  <svg class="scene">
    <app-arrow v-for="thread in threads" :key="thread.$id" :thread="thread"/>
  </svg>
</template>

<script>
import Thread from "@/store/models/thread";
import AppArrow from "@/components/AppArrow";

export default {
  name: "AppScene",
  components: {AppArrow},
  computed: {
    threads() {
      return this.$store
          .$db()
          .model(Thread)
          .query()
          .with('toBox')
          .with('fromBox')
          .get()
    }
  }
}
</script>

<style lang="scss" scoped>
.scene {
  width: 100%;
  height: 100%;
  min-height: 100vh;
}
</style>
