<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import LayoutBox from './LayoutBox.vue'
import PhotoFrame from './PhotoFrame.vue'
import PhotoFilm from './PhotoFilm.vue'
import ReferenceArt from './ReferenceArt.vue'
import { assetUrl, copy, wedding } from './data.js'

const date = new Date(wedding.date + 'T00:00:00+08:00')
const weekday = new Intl.DateTimeFormat('zh-CN', { weekday: 'long', timeZone: 'Asia/Shanghai' }).format(date)
const displayDate = wedding.date.split('-').map(Number).join('/')
const endingDate = wedding.date.split('-').join('.')
const dressSwatches = ['#fbf7f0', '#e5cbae', '#a87b52', '#2b2620']
const mapUrl = 'https://uri.amap.com/search?' + new URLSearchParams({
  keyword: wedding.mapKeyword,
  city: wedding.city,
  view: 'map',
  src: 'wedding-invitation-h5',
})
const schedule = [
  { label: '签到合影', time: wedding.signInTime, box: [158, 10706, 136, 35], side: 'end' },
  { label: '婚礼仪式', time: wedding.ceremonyTime, box: [442, 10872, 126, 35], side: 'start' },
  { label: '晚宴开始', time: wedding.banquetTime, box: [166, 11069, 138, 35], side: 'end' },
]
const player = ref(null)
const playing = ref(false)
const UNLOCK_EVENTS = ['pointerdown', 'touchstart', 'touchend', 'keydown', 'wheel', 'scroll']
let fadeTimer = null

// 浏览器普遍禁止“有声自动播放”，先直接尝试；被拦下就等第一次触摸或滑动再播，
// 这样用户不用主动去点右上角音符。
function attemptPlay() {
  const el = player.value
  if (!el || !el.paused) return
  el.play().catch(() => {})
}

// 微信内置浏览器允许通过 WeixinJSBridge 直接出声，宾客多在微信里打开，
// 这里单独兜住，做到真正“点开即响”。
function wechatAutoplay() {
  attemptPlay()
  // 部分安卓微信要等网络类型回调后才允许出声，补一枪。
  try {
    window.WeixinJSBridge?.invoke('getNetworkType', {}, () => attemptPlay())
  } catch {
    /* 非微信环境忽略 */
  }
}

function bindUnlock() {
  UNLOCK_EVENTS.forEach((type) =>
    window.addEventListener(type, attemptPlay, { passive: true, capture: true }),
  )
}

function unbindUnlock() {
  UNLOCK_EVENTS.forEach((type) =>
    window.removeEventListener(type, attemptPlay, { capture: true }),
  )
}

function fadeIn() {
  const el = player.value
  if (!el) return
  clearInterval(fadeTimer)
  el.volume = 0
  fadeTimer = setInterval(() => {
    el.volume = Math.min(0.6, el.volume + 0.05)
    if (el.volume >= 0.6) clearInterval(fadeTimer)
  }, 120)
}

function onPlay() {
  playing.value = true
  unbindUnlock()
  fadeIn()
}

function onPause() {
  playing.value = false
  clearInterval(fadeTimer)
}

async function toggleMusic() {
  const el = player.value
  if (!el) return
  if (!el.paused) {
    el.pause()
    return
  }
  try {
    await el.play()
  } catch {
    playing.value = false
  }
}

onMounted(() => {
  attemptPlay()
  bindUnlock()
  document.addEventListener('WeixinJSBridgeReady', wechatAutoplay, false)
})

onBeforeUnmount(() => {
  unbindUnlock()
  document.removeEventListener('WeixinJSBridgeReady', wechatAutoplay, false)
  clearInterval(fadeTimer)
})
</script>

<template>
  <main class="invitation" :style="{ '--paper': 'url(' + assetUrl('paper.webp') + ')' }">
    <div v-if="wedding.music" class="music-dock">
      <button type="button" class="music" :aria-label="playing ? '暂停背景音乐' : '播放背景音乐'" :aria-pressed="playing" @click="toggleMusic">
        <img :src="assetUrl('music-note.webp')" alt="" />
      </button>
      <audio ref="player" :src="assetUrl(wedding.music)" preload="auto" loop @play="onPlay" @pause="onPause"></audio>
    </div>

    <header class="spread" style="--start:0; --span:2026" aria-label="婚礼请柬">
      <ReferenceArt as="h1" name="wedding-title" :box="[55,69,610,218]" text="Welcome to the wedding of" priority />
      <LayoutBox as="p" class="couple-names" :box="[94,326,532,56]">
        <span>{{ wedding.groom }}</span><span class="ampersand">&amp;</span><span>{{ wedding.bride }}</span>
      </LayoutBox>
      <PhotoFrame name="cover" class="cover-photo" :box="[83,429,554,741]" alt="袁野与吴倩金在窗边相拥" position="50% 35%" priority />
      <ReferenceArt as="p" name="intro" :box="[166,1227,394,159]" :text="copy.intro" />
      <PhotoFrame name="groom" class="round-photo" :box="[86,1465,241,241]" alt="袁野的童年照片" />
      <ReferenceArt name="bride-script" :box="[422,1479,185,75]" text="Bride" />
      <LayoutBox as="p" class="portrait-name" :box="[412,1556,224,53]">{{ wedding.bride }}</LayoutBox>
      <PhotoFrame name="bride" class="round-photo" :box="[405,1646,241,241]" alt="吴倩金的童年照片" />
      <ReferenceArt name="groom-script" :box="[120,1739,172,98]" text="Groom" />
      <LayoutBox as="p" class="portrait-name" :box="[94,1841,225,62]">{{ wedding.groom }}</LayoutBox>
    </header>

    <section class="spread" style="--start:2026; --span:8280" aria-labelledby="about-us">
      <ReferenceArt as="h2" id="about-us" name="about-us" :box="[143,2050,444,129]" text="About us" />
      <ReferenceArt as="p" name="before" :box="[43,2263,492,187]" :text="copy.before" />
      <LayoutBox class="black-mat" :box="[266,3372,418,631]" aria-hidden="true" />
      <PhotoFrame name="mono-three" :box="[319,3372,365,576]" alt="树荫下牵手合影的我们" monochrome />
      <PhotoFrame name="mono-two" :box="[71,3000,321,477]" alt="草地上扬起头纱的我们" monochrome />
      <PhotoFrame name="mono-one" :box="[218,2539,356,530]" alt="撑伞合影的我们" monochrome />
      <ReferenceArt name="yes" :box="[25,3382,212,195]" text="Yes," class="collage-script" />
      <ReferenceArt name="yes-arc" :box="[391,3342,95,33]" class="collage-script" />
      <ReferenceArt as="p" name="ordinary" :box="[303,4080,377,203]" :text="copy.ordinary" />
      <PhotoFilm :box="[35,4377,649,965]" :names="['garden-one','garden-two','garden-three','garden-four','garden-five','garden-six']" alt="中式园林婚纱照" />
      <ReferenceArt as="p" name="encounter" :box="[20,5390,560,220]" :text="copy.encounter" />
      <PhotoFilm :box="[35,5659,577,863]" :names="['studio-one','french-door','french-window','studio-two','studio-five','studio-six']" alt="法式婚纱照" />
      <ReferenceArt name="all-mine" :box="[271,6474,437,108]" class="collage-script" />
      <PhotoFrame name="french-bride" :box="[183,6625,244,305]" alt="吴倩金的法式单人婚纱照" position="50% 30%" />
      <PhotoFrame name="french-groom" :box="[442,6625,243,305]" alt="袁野的法式单人婚纱照" position="50% 65%" />
      <PhotoFilm :box="[35,7036,649,969]" :names="['forest-one','forest-two','forest-three']" alt="草地上的婚纱照" />
      <ReferenceArt as="p" name="invitation" :box="[111,8102,510,198]" :text="copy.invitation" />
      <ReferenceArt name="collage-line" :box="[442,8477,278,364]" />
      <PhotoFrame name="warm-one" :box="[36,8400,421,622]" alt="并肩步入镜头的我们" />
      <PhotoFrame name="warm-two" :box="[420,8710,264,395]" alt="米色礼服婚纱合影" />
      <PhotoFilm :box="[39,9187,645,966]" :names="['warm-slide-one','warm-slide-two','warm-slide-three','warm-slide-four','warm-slide-five','warm-slide-six']" alt="米色婚纱照" />
      <ReferenceArt name="happy-wedding" :box="[26,10196,214,46]" text="Happy Wedding" />
    </section>

    <section class="spread" style="--start:10306; --span:1935" aria-labelledby="about-wedding">
      <ReferenceArt as="h2" id="about-wedding" name="about-wedding" :box="[54,10276,624,143]" text="About Wedding" />
      <ReferenceArt as="h3" name="details" :box="[276,10461,165,70]" text="Details" />
      <LayoutBox as="time" :datetime="wedding.date" class="wedding-date" :box="[125,10534,470,96]">
        <span>{{ displayDate }}</span><span>{{ wedding.lunarDate }} {{ weekday }}</span>
      </LayoutBox>
      <ReferenceArt name="schedule" :box="[110,10697,532,486]" text="Guest Sign In 签到合影。Wedding ceremony 婚礼仪式。Wedding Banquet 晚宴开始。" />
      <LayoutBox v-for="event in schedule" :key="event.label" as="p" class="event-time" :data-side="event.side" :box="event.box">
        <span class="sr-only">{{ event.label }}：</span>{{ event.time || '时间待定' }}
      </LayoutBox>
      <PhotoFrame name="day" :box="[77,11294,565,860]" alt="头纱下相拥的我们" position="50% 38%" />
    </section>

    <section class="spread" style="--start:12241; --span:1628" aria-labelledby="location">
      <ReferenceArt as="h2" id="location" name="location" :box="[289,12216,153,64]" text="Location" />
      <LayoutBox as="address" class="venue" :box="[65,12296,590,93]">
        <span>{{ wedding.venue }}</span><span>{{ wedding.address }}</span>
      </LayoutBox>
      <LayoutBox as="a" class="map-card" :box="[127,12408,466,309]" :href="mapUrl" target="_blank" rel="noopener noreferrer" aria-label="点击地图导航至目的地">
        <strong>{{ wedding.venue }}</strong>
        <span>{{ wedding.address }}</span>
        <img class="map-preview" :src="assetUrl('map.webp')" alt="" loading="lazy" />
        <small>© OpenStreetMap</small>
      </LayoutBox>
      <ReferenceArt name="navigate" :box="[235,12735,251,47]" text="点击地图导航至目的地" />
      <PhotoFrame name="final" :box="[35,12884,649,972]" alt="窗边的中式婚纱照" position="50% 40%" monochrome />
    </section>

    <footer class="spread" style="--start:13869; --span:1578" aria-label="温馨提示与着装建议">
      <ReferenceArt name="upper-flower" :box="[291,13937,162,181]" />
      <ReferenceArt as="p" name="tips-copy" :box="[43,14160,548,153]" :text="copy.tips" />
      <ReferenceArt as="p" name="tips-copy-2" :box="[43,14318,557,215]" :text="copy.tips2" />
      <ReferenceArt name="dress-code" :box="[250,14587,220,43]" />
      <LayoutBox as="p" class="dress-line" :box="[0,14659,720,38]">推荐着装</LayoutBox>
      <LayoutBox as="p" class="dress-line dress-line--note" :box="[0,14711,720,38]">纯色 / 浅色系 会与婚礼布置更搭哦</LayoutBox>
      <LayoutBox as="ul" class="dress-swatches" :box="[0,14773,720,80]" aria-label="推荐色系">
        <li v-for="tone in dressSwatches" :key="tone" :style="{ background: tone }" />
      </LayoutBox>
      <ReferenceArt name="lower-flower" :box="[290,14891,140,190]" />
      <LayoutBox as="p" class="ending-date" :box="[0,15107,720,46]">{{ endingDate }}</LayoutBox>
      <LayoutBox as="p" class="ending-meet" :box="[0,15173,720,60]">我们，婚礼见</LayoutBox>
      <LayoutBox as="span" class="ending-rule" :box="[110,15287,500,2]" aria-hidden="true" />
      <LayoutBox as="p" class="ending-thanks" :box="[0,15357,720,50]">THANKS.</LayoutBox>
    </footer>
  </main>
</template>
