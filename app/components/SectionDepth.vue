<script setup lang="ts">
import gsap from 'gsap'

// Distância (px) entre cada camada no eixo Z
const STEP = 1600

type Layer =
  | { kind: 'title'; eyebrow: string; title: string; text?: string; x: number; y: number }
  | { kind: 'card'; index: string; tag: string; title: string; text: string; x: number; y: number }

// x/y em vw/vh a partir do centro da tela
const layers: Layer[] = [
  { kind: 'title', eyebrow: 'Seção 01 — Profundidade', title: 'Entre no\nescuro.', text: 'Role para avançar', x: 0, y: 0 },
  { kind: 'card', index: '01', tag: 'Camada', title: 'Primeira camada', text: 'Cada scroll empurra a câmera para dentro da cena, atravessando os elementos.', x: -22, y: -6 },
  { kind: 'card', index: '02', tag: 'Camada', title: 'Mais fundo', text: 'Os cards vivem em planos diferentes do eixo Z e ganham nitidez conforme se aproximam.', x: 22, y: 8 },
  { kind: 'card', index: '03', tag: 'Camada', title: 'Quase lá', text: 'Espaço reservado para imagens e conteúdo que virão depois.', x: -18, y: 10 },
  { kind: 'title', eyebrow: 'Fim da descida', title: 'Agora,\npara o lado.', x: 0, y: 0 }
]

const DEPTH = (layers.length - 1) * STEP

// Partículas com gerador determinístico, para o SSR e o cliente renderizarem igual
function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const rand = mulberry32(7)
const particles = Array.from({ length: 70 }, () => ({
  x: (rand() - 0.5) * 160,
  y: (rand() - 0.5) * 120,
  z: -rand() * (DEPTH + 2000) + 600,
  size: 1 + rand() * 2.5
}))

const section = ref<HTMLElement>()
const world = ref<HTMLElement>()
const active = useActiveSection()

let ctx: gsap.Context | undefined

onMounted(() => {
  const nodes = Array.from(world.value!.querySelectorAll<HTMLElement>('[data-z]'))
  const depthOf = nodes.map((n) => Number(n.dataset.z))
  const isLayer = nodes.map((n) => n.classList.contains('depth__layer'))

  // Opacidade de cada elemento de acordo com a distância até a câmera
  const render = (worldZ: number) => {
    for (let i = 0; i < nodes.length; i++) {
      const z = depthOf[i]! + worldZ
      let o: number
      if (z > 0) o = 1 - z / 700 // passou da câmera: some
      else o = 1 + z / (isLayer[i] ? 2600 : 4000) // longe: esmaece
      o = Math.max(0, Math.min(1, o))
      nodes[i]!.style.opacity = String(o)
      nodes[i]!.style.visibility = o <= 0.001 ? 'hidden' : 'visible'
    }
  }

  ctx = gsap.context(() => {
    const state = { z: 0 }
    render(0)

    gsap.to(state, {
      z: DEPTH,
      ease: 'none',
      onUpdate: () => {
        gsap.set(world.value!, { z: state.z })
        render(state.z)
      },
      scrollTrigger: {
        trigger: section.value,
        start: 'top top',
        end: () => `+=${layers.length * window.innerHeight}`,
        pin: true,
        scrub: 1,
        onToggle: (self) => self.isActive && (active.value = 0)
      }
    })

    // Título inicial entra com fade
    gsap.from('.depth__layer--0 > *', {
      opacity: 0,
      y: 40,
      duration: 1.4,
      stagger: 0.12,
      ease: 'power3.out',
      delay: 0.2
    })
  }, section.value)
})

onBeforeUnmount(() => ctx?.revert())
</script>

<template>
  <section ref="section" class="depth">
    <div class="depth__vignette" aria-hidden="true" />

    <div ref="world" class="depth__world">
      <span
        v-for="(p, i) in particles"
        :key="`p${i}`"
        class="depth__particle"
        :data-z="p.z"
        :style="{
          width: `${p.size}px`,
          height: `${p.size}px`,
          transform: `translate3d(${p.x}vw, ${p.y}vh, ${p.z}px)`
        }"
      />

      <div
        v-for="(layer, i) in layers"
        :key="i"
        class="depth__layer"
        :class="[`depth__layer--${i}`, `depth__layer--${layer.kind}`]"
        :data-z="-i * STEP"
        :style="{ transform: `translate(-50%, -50%) translate3d(${layer.x}vw, ${layer.y}vh, ${-i * STEP}px)` }"
      >
        <template v-if="layer.kind === 'title'">
          <p class="eyebrow">{{ layer.eyebrow }}</p>
          <h1 class="display depth__title">{{ layer.title }}</h1>
          <p v-if="layer.text" class="depth__hint">
            <span class="depth__hint-line" /> {{ layer.text }}
          </p>
        </template>

        <ContentCard
          v-else
          :index="layer.index"
          :tag="layer.tag"
          :title="layer.title"
          :text="layer.text"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.depth {
  position: relative;
  height: 100vh;
  height: 100svh;
  overflow: hidden;
  perspective: 1000px;
  perspective-origin: 50% 50%;
  background:
    radial-gradient(ellipse at 50% 50%, #1a1a1e 0%, var(--bg) 55%, var(--black) 100%);
}

.depth__vignette {
  pointer-events: none;
  position: absolute;
  inset: 0;
  z-index: 2;
  background: radial-gradient(ellipse at center, transparent 40%, rgba(0, 0, 0, 0.75) 100%);
}

.depth__world {
  position: absolute;
  inset: 0;
  transform-style: preserve-3d;
  will-change: transform;
}

.depth__particle {
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 50%;
  background: var(--text-2);
  box-shadow: 0 0 6px rgba(255, 255, 255, 0.25);
}

.depth__layer {
  position: absolute;
  top: 50%;
  left: 50%;
  will-change: transform, opacity;
}

.depth__layer--card {
  width: min(400px, 84vw);
}

.depth__layer--title {
  width: min(1100px, 92vw);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.depth__title {
  font-size: clamp(3.2rem, 12vw, 10rem);
  white-space: pre-line;
  background: linear-gradient(180deg, var(--white) 30%, #6a6a72 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.depth__hint {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.85rem;
  color: var(--muted);
}

.depth__hint-line {
  display: block;
  width: 40px;
  height: 1px;
  background: var(--muted);
  transform-origin: left;
  animation: hint 2.4s ease-in-out infinite;
}

@keyframes hint {
  0%, 100% { transform: scaleX(0.2); }
  50% { transform: scaleX(1); }
}
</style>
