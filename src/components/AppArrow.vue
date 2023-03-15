<template>
  <path
      :d="`M${fromThreadCoords.x} ${fromThreadCoords.y} L${toThreadCoords.x} ${toThreadCoords.y}`"
      fill="transparent"
      stroke="#3355c0"
  />
</template>

<script>
export default {
  name: "AppArrow",
  props: {
    thread: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      fromBox: null,
      toBox: null,
      fromBoxObserver: null,
      toBoxObserver: null,
      fromBoxData: {
        coords: {
          x: 0,
          y: 0
        },
        size: {
          height: 0,
          width: 0
        }
      },
      toBoxData: {
        coords: {
          x: 0,
          y: 0
        },
        size: {
          height: 0,
          width: 0
        }
      }
    }
  },
  computed: {
    fromThreadCoords() {
      if(!this.thread) return;
      const { height, width } = this.fromBoxData.size;
      let { x, y } = this.fromBoxData.coords;
      const side = this.thread.fromBoxSide;
      switch (side) {
        case 'top':
          x += width / 2;
          break;
        case 'right':
          x += width;
          y += height / 2;
          break;
        case 'bottom':
          x += width / 2;
          y += height;
          break;
        case 'left':
          y += height / 2;
          break;
      }
      return { x, y };
    },
    toThreadCoords() {
      if(!this.thread) return;
      const { height, width } = this.toBoxData.size;
      let { x, y } = this.toBoxData.coords;
      const side = this.thread.toBoxSide;
      switch (side) {
        case 'top':
          x += width / 2;
          break;
        case 'right':
          x += width;
          y += height / 2;
          break;
        case 'bottom':
          x += width / 2;
          y += height;
          break;
        case 'left':
          y += height / 2;
          break;
      }
      return { x, y };
    }
  },
  methods: {
    enableWatchElements(DOMElement, eventFunction) {
      if (!DOMElement) return null;
      const drag = new MutationObserver(eventFunction);
      drag.observe(DOMElement, { attributes: true });
      return drag;
    },
    disconnectObservers(observer) {
      if (!observer) return;
      observer.disconnect();
    },
    dragFromBox() {
      const { x, y } = this.getCoords(this.fromBox);
      this.fromBoxData.coords.x = x;
      this.fromBoxData.coords.y = y;
    },
    dragToBox() {
      const { x, y } = this.getCoords(this.toBox);
      this.toBoxData.coords.x = x;
      this.toBoxData.coords.y = y;
    },
    setBoxesData() {
      const fromBoxHeight = this.fromBox.offsetHeight;
      const fromBoxWidth = this.fromBox.offsetWidth;
      const toBoxHeight = this.toBox.offsetHeight;
      const toBoxWidth = this.toBox.offsetWidth;
      this.fromBoxData.size.height = fromBoxHeight;
      this.fromBoxData.size.width = fromBoxWidth;
      this.toBoxData.size.height = toBoxHeight;
      this.toBoxData.size.width = toBoxWidth;
      const fromBoxCoords = this.getCoords(this.fromBox);
      const toBoxCoords = this.getCoords(this.toBox);
      this.fromBoxData.coords.x = fromBoxCoords.x;
      this.fromBoxData.coords.y = fromBoxCoords.y;
      this.toBoxData.coords.x = toBoxCoords.x;
      this.toBoxData.coords.y = toBoxCoords.y;
    },
    getCoords(elem) {
      const { x, y } = elem.getBoundingClientRect();
      return { x, y }
    }
  },
  async mounted() {
    const fromBoxId = `box-${this.thread.fromBoxId}`;
    const toBoxId = `box-${this.thread.toBoxId}`;
    this.fromBox = document.getElementById(fromBoxId);
    this.toBox = document.getElementById(toBoxId);
    this.fromBoxObserver = this.enableWatchElements(this.fromBox, this.dragFromBox);
    this.toBoxObserver = this.enableWatchElements(this.toBox, this.dragToBox);
    this.setBoxesData();
  },
  beforeDestroy() {
    this.disconnectObservers(this.fromBoxObserver);
    this.disconnectObservers(this.toBoxObserver);
  }
}
</script>

<style scoped>

</style>
