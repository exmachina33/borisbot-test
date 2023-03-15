<template>
  <div
      :id="`box-${box.id}`"
      class="box"
      ref="box"
      @mousedown.self="start"
      @mouseup.self="stop"
      :style="{left, top}"
  >
    <button class="box-delete-btn" @click="deleteHandler">X</button>
    <div
        v-for="point in box.connectPoints"
        :key="point"
        :class="[
            `connect-point point-${point}`,
            { 'connect-point--selected': point === selectedPoint },
            { 'connect-point--connected': connectedPoints.has(point) }
            ]"
        @click="clickHandler(point)"
    >
      <div class="point-delete-icon">X</div>
    </div>
  </div>
</template>

<script>

export default {
  name: "App-container",
  props: {
    box: {
      type: Object,
      default: () => {}
    },
    stateRelation: {
      type: Object,
      default: () => {}
    },
  },
  data() {
    return {
      container: null,
      left: 0,
      top: 0,
      shiftX: 0,
      shiftY: 0,
    }
  },
  computed: {
    selectedPoint() {
      const fromBoxSide = this.stateRelation.fromBoxSide;
      const fromBoxId = this.stateRelation.fromBoxId;
      if(!fromBoxId) return false;
      if(fromBoxId === this.box.id) return fromBoxSide;
    },
    connectedPoints() {
      const threads = [...this.box.fromThreads,...this.box.toThreads];
      const points = new Set();
      threads.forEach(thread => {
        if(thread.fromBoxId === this.box.id) points.add(thread.fromBoxSide);
        if(thread.toBoxId === this.box.id) points.add(thread.toBoxSide);
      })
      return points;
    }
  },
  methods: {
    start(event) {
      //Устанавливаем сдвиг относительно указателя мыши
      this.shiftX = event.clientX - this.container.getBoundingClientRect().left;
      this.shiftY = event.clientY - this.container.getBoundingClientRect().top;
      // удаляем браузерное событие
      this.container.ondragstart = () => false;
      // перетаскиваем container под указатель мыши
      this.moveAt(event);
      // передвигаем container при событии mousemove
      document.addEventListener('mousemove', this.onMouseMove);
    },
    // передвигаем container при событии mousemove
    onMouseMove(event) {
      this.moveAt(event);
    },
    // переносит container на координаты (pageX, pageY) и записывает координаты в Box,
    moveAt(event) {
      this.left = event.pageX - this.shiftX + 'px';
      this.top = event.pageY - this.shiftY + 'px';
    },
    // отпускаем container удаляем ненужные события
    stop() {
      document.removeEventListener('mousemove', this.onMouseMove);
      this.container.onmouseup = null;
    },
    clickHandler(point) {
      // если на выбранно point есть связь с другим box, то удаляем связь
      if(this.connectedPoints.has(point)) {
        this.$emit('deleteThread', this.box, point);
        return;
      }
      this.$emit('clickPoint', this.box, point);
    },
    deleteHandler() {
      this.$emit('deleteBox', this.box);
    }
  },
  mounted() {
    this.container = this.$refs.box;
  }
}
</script>

<style lang="scss" scoped>
.box {
  z-index: 1;
  position: absolute;
  width: 100px;
  height: 100px;
  background: #92a8e8;
  .box-delete-btn {
    display: block;
    border: none;
    height: 20px;
    width: 20px;
    visibility: hidden;
    cursor: pointer;
    background-color: rgba(255, 255, 255, 0.7);
    margin-left: auto;
    right: 0;
  }
  .connect-point {
    z-index: 2;
    position: absolute;
    width: 30px;
    height: 30px;
    background: #f57575;
    border-radius: 50%;
    border: 4px solid #fff;
    overflow: hidden;
    cursor: pointer;

    &--selected {
      background: #46da84;
    }
    &--connected {
      background: #3355c0;

      &:hover .point-delete-icon {
        visibility: visible;
      }
    }
    .point-delete-icon {
      display: flex;
      justify-content: center;
      align-items: center;
      color: white;
      width: 100%;
      height: 100%;
      visibility: hidden;
      cursor: pointer;
      background-color: rgba(255, 255, 255, 0.3);
    }
  }
  .point-top {
    left: 31px;
    top: -19px
  }
  .point-right {
    top: 31px;
    right: -19px;
  }
  .point-bottom {
    top: 81px;
    left: 31px;
  }
  .point-left {
    top: 31px;
    left: -19px;
  }
}
.box:hover .box-delete-btn {
  visibility: visible;
}
</style>
