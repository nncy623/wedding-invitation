<script setup>
import { computed } from 'vue'

const props = defineProps({
  as: { type: String, default: 'div' },
  box: { type: Array, required: true },
})
const position = computed(() => {
  const [x, y, width, height] = props.box
  return { '--x': x, '--y': y, '--w': width, '--h': height }
})
</script>

<template>
  <component :is="as" class="layout-box" :style="position"><slot /></component>
</template>
