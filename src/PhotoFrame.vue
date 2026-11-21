<script setup>
import LayoutBox from './LayoutBox.vue'
import { assetUrl } from './data.js'

defineProps({
  box: { type: Array, required: true },
  name: { type: String, required: true },
  alt: { type: String, required: true },
  priority: Boolean,
  monochrome: Boolean,
  position: { type: String, default: 'center' },
})
</script>

<template>
  <LayoutBox :box="box" class="photo-frame" :class="{ monochrome }">
    <img
      :src="assetUrl('photos/' + name + '.webp')"
      :alt="alt"
      :loading="priority ? 'eager' : 'lazy'"
      :fetchpriority="priority ? 'high' : undefined"
      :style="{ objectPosition: position }"
      decoding="async"
    />
  </LayoutBox>
</template>
