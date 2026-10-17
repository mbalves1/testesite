<script setup lang="ts">
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Os componentes filhos criam seus ScrollTriggers antes deste onMounted;
// recalcula tudo depois que as fontes carregarem (elas mudam as larguras).
onMounted(() => {
  ScrollTrigger.refresh()
  document.fonts?.ready.then(() => ScrollTrigger.refresh())
})
</script>

<template>
  <div class="site">
    <NuxtRouteAnnouncer />
    <div class="grain" aria-hidden="true" />
    <SiteHeader />

    <main>
      <!-- wrappers com id ficam fora do pin, então servem de âncora para a navegação -->
      <div id="profundidade"><SectionDepth /></div>
      <div id="horizonte"><SectionHorizontal /></div>
      <div id="descida"><SectionVertical /></div>
    </main>
  </div>
</template>
