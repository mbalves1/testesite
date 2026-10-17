<script setup lang="ts">
import gsap from 'gsap'

const cards = [
  { index: '01', tag: 'Direção', title: 'O eixo muda', text: 'O scroll vertical vira movimento lateral. A página fica fixa enquanto o trilho desliza.' },
  { index: '02', tag: 'Ritmo', title: 'Cards em sequência', text: 'Cada card entra em escala e ganha contraste ao chegar no centro da tela.' },
  { index: '03', tag: 'Espaço', title: 'Imagem em destaque', text: 'Formato largo, pensado para receber fotografias ou capturas de projeto.' },
  { index: '04', tag: 'Textura', title: 'Tons de cinza', text: 'Superfícies em camadas de cinza criam hierarquia sem precisar de cor.' },
  { index: '05', tag: 'Fim', title: 'Próxima parada', text: 'Ao terminar o trilho, o scroll volta a descer normalmente.' }
]

const section = ref<HTMLElement>()
const track = ref<HTMLElement>()
const bar = ref<HTMLElement>()
const active = useActiveSection()

let ctx: gsap.Context | undefined

onMounted(() => {
  ctx = gsap.context(() => {
    const distance = () => track.value!.scrollWidth - window.innerWidth

    const slide = gsap.to(track.value!, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: section.value,
        start: 'top top',
        end: () => `+=${distance()}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        onToggle: (self) => self.isActive && (active.value = 1),
        onUpdate: (self) => gsap.set(bar.value!, { scaleX: self.progress })
      }
    })

    // Cada card cresce e acende ao entrar pela direita
    gsap.utils.toArray<HTMLElement>('.h__card').forEach((card) => {
      gsap.fromTo(
        card,
        { scale: 0.86, opacity: 0.25, rotateY: -18 },
        {
          scale: 1,
          opacity: 1,
          rotateY: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            containerAnimation: slide,
            start: 'left right',
            end: 'center 60%',
            scrub: true
          }
        }
      )
    })

    // Texto gigante de fundo anda mais devagar (parallax)
    gsap.to('.h__backdrop', {
      xPercent: -30,
      ease: 'none',
      scrollTrigger: {
        trigger: section.value,
        start: 'top top',
        end: () => `+=${distance()}`,
        scrub: 1,
        invalidateOnRefresh: true
      }
    })
  }, section.value)
})

onBeforeUnmount(() => ctx?.revert())
</script>

<template>
  <section ref="section" class="h">
    <p class="h__backdrop display" aria-hidden="true">horizonte horizonte</p>

    <div ref="track" class="h__track">
      <div class="h__intro">
        <p class="eyebrow">Seção 02 — Horizonte</p>
        <h2 class="display h__title">Siga<br>em frente.</h2>
        <p class="h__lead">
          Continue rolando: o conteúdo agora corre para a direita.
        </p>
      </div>

      <ContentCard
        v-for="(c, i) in cards"
        :key="c.index"
        class="h__card"
        :variant="i === 2 ? 'wide' : 'default'"
        :class="{ 'h__card--wide': i === 2, 'h__card--offset': i % 2 === 1 }"
        v-bind="c"
      />

      <div class="h__outro">
        <p class="display">↓</p>
        <p class="eyebrow">Descer</p>
      </div>
    </div>

    <div class="h__progress" aria-hidden="true">
      <div ref="bar" class="h__progress-bar" />
    </div>
  </section>
</template>

<style scoped>
.h {
  position: relative;
  height: 100vh;
  height: 100svh;
  overflow: hidden;
  background: linear-gradient(180deg, var(--black) 0%, var(--bg-2) 100%);
  perspective: 1400px;
}

.h__backdrop {
  position: absolute;
  bottom: 4vh;
  left: 0;
  white-space: nowrap;
  font-size: clamp(8rem, 26vw, 24rem);
  color: transparent;
  -webkit-text-stroke: 1px #1f1f24;
  pointer-events: none;
  user-select: none;
}

.h__track {
  position: relative;
  display: flex;
  align-items: center;
  gap: clamp(24px, 4vw, 64px);
  height: 100%;
  width: max-content;
  padding: 0 var(--gutter);
  will-change: transform;
}

.h__intro {
  flex: none;
  width: min(560px, 84vw);
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-right: clamp(0px, 6vw, 120px);
}

.h__title {
  font-size: clamp(3rem, 8vw, 7rem);
}

.h__lead {
  max-width: 34ch;
  line-height: 1.6;
  color: var(--text-2);
}

.h__card {
  flex: none;
  width: min(380px, 78vw);
  transform-origin: left center;
}

.h__card--wide {
  width: min(620px, 84vw);
}

.h__card--offset {
  margin-top: 12vh;
}

.h__outro {
  flex: none;
  width: min(300px, 60vw);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.h__outro .display {
  font-size: 4rem;
  color: var(--muted);
}

.h__progress {
  position: absolute;
  left: var(--gutter);
  right: var(--gutter);
  bottom: 28px;
  height: 1px;
  background: var(--line);
}

.h__progress-bar {
  height: 100%;
  background: var(--text);
  transform: scaleX(0);
  transform-origin: left;
}

@media (max-width: 640px) {
  .h__card--offset {
    margin-top: 0;
  }
}
</style>
