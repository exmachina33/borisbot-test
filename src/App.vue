<template>
  <div class="app">
    <app-scene/>
    <button class="app-button" @click="addBox">add block</button>
    <app-box
        v-for="box in boxes"
        :key="box.id"
        :box="box"
        :state-relation="relation"
        @clickPoint="clickPointHandler"
        @deleteBox="deleteBoxHandler"
        @deleteThread="deleteThreadHandler"
    />
  </div>
</template>

<script>
import AppBox from "@/components/AppBox";
import Box from "@/store/models/box";
import Thread from "@/store/models/thread";
import AppScene from "@/components/AppScene";
export default {
  name: "App",
  components: {AppScene, AppBox},
  computed: {
    boxes() {
      return this.$store
          .$db()
          .model(Box)
          .query()
          .with('toThreads')
          .with('fromThreads')
          .get()
    }
  },
  data() {
    return {
     relation: {
       fromBoxId: null,
       toBoxId: null,
       fromBoxSide: null,
       toBoxSide: null,
     }
    }
  },
  methods: {
    async addBox() {
      await Box.insert({ data: { id: null } })
    },
    async clickPointHandler(box, side) {
      if(this.relation.fromBoxSide === side && this.relation.fromBoxId === box.id) {
        this.resetRelation()
        return;
      }
      if(!this.relation.fromBoxId || this.relation.fromBoxId === box.id) {
        this.relation.fromBoxId = box.id;
        this.relation.fromBoxSide = side;
        return;
      }
      this.relation.toBoxId = box.id;
      this.relation.toBoxSide = side;
      await this.createRelation();
      this.resetRelation();
    },
    resetRelation() {
      for(let key in this.relation) {
        this.relation[key] = null;
      }
    },
    async createRelation() {
      const data = { ...this.relation }
      await Thread.insert({ data })
    },
    async deleteBoxHandler(box) {
      await box.delete()
    },
    async deleteThreadHandler(box, side) {
      [...box.toThreads, ...box.fromThreads].forEach(thread => {
        if(thread.toBoxSide !== side && thread.fromBoxSide !== side) return;
        thread.$delete()
      })
    }
  }
}
</script>


<style lang="scss">
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
.app-button {
  padding: 20px;
  background-color: #92a8e8;
  border: 1px solid #3355c0;
  color: white;
  text-transform: uppercase;
  cursor: pointer;
  position: fixed;
  margin: 5px;
  top: 0;
  right: 0;
}
</style>
