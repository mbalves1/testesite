<script setup lang="ts">
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const cards = [
  { index: '01', tag: 'Base', title: 'De volta ao fluxo', text: 'Aqui o scroll é vertical e natural. Os cards surgem enquanto você desce.' },
  { index: '02', tag: 'Grade', title: 'Grid flexível', text: 'Duas colunas no desktop, uma no celular. Fácil de ampliar com novos blocos.' },
  { index: '03', tag: 'Mídia', title: 'Pronto para imagens', text: 'Cada card já tem a área de mídia; basta passar a prop image.' },
  { index: '04', tag: 'Detalhe', title: 'Parallax sutil', text: 'As colunas se movem em velocidades diferentes para manter a sensação de camadas.' }
]

const stats = [
  { value: '03', label: 'direções de scroll' },
  { value: '∞', label: 'tons de cinza' },
  { value: '01', label: 'experiência contínua' }
]

const section = ref<HTMLElement>()
const active = useActiveSection()

let ctx: gsap.Context | undefined

onMounted(() => {
  ctx = gsap.context(() => {
    ScrollTrigger.create({
      trigger: section.value,
      start: 'top 60%',
      end: 'bottom bottom',
      onToggle: (self) => self.isActive && (active.value = 2)
    })

    // Título: linhas sobem de dentro de uma máscara
    gsap.from('.v__title-line > span', {
      yPercent: 110,
      duration: 1.2,
      stagger: 0.1,
      ease: 'power4.out',
      scrollTrigger: { trigger: '.v__head', start: 'top 75%' }
    })

    // Cards aparecem em lote conforme entram na tela
    gsap.set('.v__card', { opacity: 0, y: 80 })
    ScrollTrigger.batch('.v__card', {
      start: 'top 88%',
      onEnter: (batch) =>
        gsap.to(batch, { opacity: 1, y: 0, duration: 1.1, stagger: 0.12, ease: 'power3.out' })
    })

    // Coluna da direita anda um pouco mais rápido (parallax)
    gsap.to('.v__col--b', {
      yPercent: -12,
      ease: 'none',
      scrollTrigger: { trigger: '.v__grid', start: 'top bottom', end: 'bottom top', scrub: true }
    })

    gsap.from('.v__stat', {
      opacity: 0,
      y: 40,
      duration: 1,
      stagger: 0.12,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.v__stats', start: 'top 85%' }
    })
  }, section.value)
})

onBeforeUnmount(() => ctx?.revert())
</script>

<template>
  <section ref="section" class="v">
    <header class="v__head">
      <p class="eyebrow">Seção 03 — Descida</p>
      <h2 class="display v__title">
        <span class="v__title-line"><span>Continue</span></span>
        <span class="v__title-line"><span>descendo.</span></span>
      </h2>
      <p class="v__lead">
        Depois da profundidade e do horizonte, a última seção segue o fluxo
        natural da página, com conteúdo que se revela aos poucos.
      </p>
    </header>

    <div class="v__grid">
      <div class="v__col v__col--a">
        <ContentCard v-for="c in cards.filter((_, i) => i % 2 === 0)" :key="c.index" class="v__card" v-bind="c" />
      </div>
      <div class="v__col v__col--b">
        <ContentCard v-for="c in cards.filter((_, i) => i % 2 === 1)" :key="c.index" class="v__card" v-bind="c" />
      </div>
    </div>

    <div class="v__stats">
      <div v-for="s in stats" :key="s.label" class="v__stat">
        <p class="display v__stat-value">{{ s.value }}</p>
        <p class="v__stat-label">{{ s.label }}</p>
      </div>
    </div>

    <footer class="v__footer">
      <p class="display v__footer-title">Fim.</p>
      <p class="eyebrow">© {{ new Date().getFullYear() }} testesite</p>
    </footer>
  </section>
</template>

<style scoped>
.v {
  position: relative;
  padding: clamp(96px, 16vh, 180px) var(--gutter) 48px;
  background: linear-gradient(180deg, var(--bg-2) 0%, var(--bg) 30%, var(--black) 100%);
}

.v__head {
  max-width: 1200px;
  margin: 0 auto clamp(64px, 12vh, 140px);
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.v__title {
  font-size: clamp(3rem, 10vw, 9rem);
  display: flex;
  flex-direction: column;
}

.v__title-line {
  display: block;
  overflow: hidden;
  padding-bottom: 0.06em;
}

.v__title-line > span {
  display: inline-block;
}

.v__title-line:last-child {
  color: var(--muted);
}

.v__lead {
  max-width: 48ch;
  font-size: 1.05rem;
  line-height: 1.7;
  color: var(--text-2);
}

.v__grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(20px, 3vw, 40px);
  align-items: start;
}

.v__col {
  display: flex;
  flex-direction: column;
  gap: clamp(20px, 3vw, 40px);
}

.v__col--b {
  margin-top: clamp(0px, 18vh, 200px);
}

.v__stats {
  max-width: 1200px;
  margin: clamp(96px, 18vh, 200px) auto 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border-top: 1px solid var(--line);
}

.v__stat {
  padding: 32px 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.v__stat + .v__stat {
  padding-left: clamp(16px, 3vw, 40px);
  border-left: 1px solid var(--line);
}

.v__stat-value {
  font-size: clamp(2.4rem, 6vw, 5rem);
}

.v__stat-label {
  font-size: 0.9rem;
  color: var(--muted);
}

.v__footer {
  max-width: 1200px;
  margin: clamp(120px, 24vh, 260px) auto 0;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.v__footer-title {
  font-size: clamp(4rem, 18vw, 16rem);
  color: var(--surface-2);
}

@media (max-width: 720px) {
  .v__grid {
    grid-template-columns: 1fr;
  }

  .v__col--b {
    margin-top: 0;
  }

  .v__stats {
    grid-template-columns: 1fr;
  }

  .v__stat + .v__stat {
    padding-left: 0;
    border-left: 0;
    border-top: 1px solid var(--line);
  }
}
</style>
