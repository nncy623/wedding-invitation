<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import LayoutBox from './LayoutBox.vue'
import { assetUrl } from './data.js'

const props = defineProps({
  box: { type: Array, required: true },
  names: { type: Array, required: true },
  alt: { type: String, required: true },
})

const track = ref(null)
const loops = computed(() => props.names.length > 1)
const slides = computed(() => loops.value
  ? [props.names.at(-1), ...props.names, props.names[0]]
  : props.names)
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

let active = 1
let visible = false
let pressing = false
let observer
let resizeObserver
let autoplay
let settling

function goTo(index, behavior = 'auto') {
  const slide = track.value.children[index]
  if (slide) track.value.scrollTo({ left: slide.offsetLeft, behavior })
}

function nearestSlide() {
  const { scrollLeft, clientWidth } = track.value
  return Math.round(scrollLeft / clientWidth)
}

function move(direction) {
  const target = Math.max(0, Math.min(slides.value.length - 1, nearestSlide() + direction))
  goTo(target, reducedMotion.matches ? 'auto' : 'smooth')
}

function queueAutoplay() {
  clearTimeout(autoplay)
  if (!visible || pressing || reducedMotion.matches || track.value.matches(':focus-visible')) return

  autoplay = setTimeout(() => {
    if (!reducedMotion.matches) move(1)
  }, 4200)
}

function settle() {
  if (pressing) return
  const index = nearestSlide()
  // The matching images at the ends allow a single-slide wrap in either direction.
  active = index === 0 ? props.names.length : index === slides.value.length - 1 ? 1 : index
  if (active !== index) goTo(active)
  queueAutoplay()
}

function onScroll() {
  if (!loops.value) return
  clearTimeout(autoplay)
  clearTimeout(settling)
  settling = setTimeout(settle, 160)
}

function pause() {
  pressing = true
  clearTimeout(autoplay)
}

function resume() {
  pressing = false
  if (loops.value) onScroll()
}

function onKey(event) {
  if (!loops.value || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return
  event.preventDefault()
  move(event.key === 'ArrowLeft' ? -1 : 1)
}

function isClone(index) {
  return loops.value && (index === 0 || index === slides.value.length - 1)
}

onMounted(() => {
  if (!loops.value) return
  goTo(active)

  if ('ResizeObserver' in window) {
    resizeObserver = new ResizeObserver(() => goTo(active))
    resizeObserver.observe(track.value)
  }

  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(([entry]) => {
      visible = entry.intersectionRatio >= .5
      queueAutoplay()
    }, { threshold: .5 })
    observer.observe(track.value)
  }
})

onBeforeUnmount(() => {
  clearTimeout(autoplay)
  clearTimeout(settling)
  observer?.disconnect()
  resizeObserver?.disconnect()
})
</script>

<template>
  <LayoutBox :box="box" class="film">
    <figure
      ref="track"
      class="film-track"
      role="group"
      :aria-label="alt"
      :tabindex="loops ? 0 : undefined"
      @scroll.passive="onScroll"
      @pointerdown="pause"
      @pointerup="resume"
      @pointercancel="resume"
      @pointerleave="resume"
      @focus="queueAutoplay"
      @blur="queueAutoplay"
      @keydown="onKey"
    >
      <div v-for="(name, index) in slides" :key="index" class="film-photo" :aria-hidden="isClone(index)">
        <img
          :src="assetUrl('photos/' + name + '.webp')"
          :alt="isClone(index) ? '' : alt + ' ' + (index + (loops ? 0 : 1))"
          loading="lazy"
          decoding="async"
          draggable="false"
        />
      </div>
    </figure>
  </LayoutBox>
</template>
