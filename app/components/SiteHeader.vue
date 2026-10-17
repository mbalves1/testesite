<script setup lang="ts">
const active = useActiveSection()
const { $lenis } = useNuxtApp()

function goTo(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  if ($lenis) $lenis.scrollTo(el, { duration: 1.6 })
  else el.scrollIntoView()
}
</script>

<template>
  <header class="header">
    <a href="#profundidade" class="header__logo" @click.prevent="goTo('profundidade')">
      <span class="header__dot" /> testesite
    </a>

    <nav class="header__nav">
      <a
        v-for="(s, i) in sections"
        :key="s.id"
        :href="`#${s.id}`"
        :class="{ 'is-active': active === i }"
        @click.prevent="goTo(s.id)"
      >
        <span class="header__num">0{{ i + 1 }}</span>
        <span class="header__label">{{ s.label }}</span>
      </a>
    </nav>
  </header>
</template>

<style scoped>
.header {
  position: fixed;
  inset: 0 0 auto 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 20px var(--gutter);
  mix-blend-mode: difference;
}

.header__logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-display);
  font-weight: 500;
  letter-spacing: -0.01em;
  color: var(--white);
}

.header__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--white);
}

.header__nav {
  display: flex;
  gap: clamp(12px, 3vw, 32px);
}

.header__nav a {
  display: flex;
  gap: 8px;
  font-size: 0.8rem;
  color: var(--muted);
  transition: color 0.3s ease;
}

.header__nav a:hover,
.header__nav a.is-active {
  color: var(--white);
}

.header__num {
  font-family: var(--font-display);
}

@media (max-width: 640px) {
  .header__label {
    display: none;
  }
}
</style>
