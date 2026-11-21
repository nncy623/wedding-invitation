<script setup>
import LayoutBox from './LayoutBox.vue'
import { assetUrl } from './data.js'

defineProps({
  box: { type: Array, required: true },
  name: { type: String, required: true },
  text: { type: String, default: '' },
  as: { type: String, default: 'div' },
  priority: Boolean,
})
</script>

<template>
  <LayoutBox :as="as" :box="box" class="reference-art">
    <img :src="assetUrl(name + '.webp')" alt="" :loading="priority ? 'eager' : 'lazy'" decoding="async" />
    <span v-if="text" class="sr-only">{{ text }}</span>
  </LayoutBox>
</template>
