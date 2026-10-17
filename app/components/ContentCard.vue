<script setup lang="ts">
// Card genérico. Passe `image` quando tiver as imagens;
// sem ela, aparece um placeholder em tons de cinza.
withDefaults(
  defineProps<{
    title: string
    text?: string
    tag?: string
    index?: string
    image?: string
    imageAlt?: string
    variant?: 'default' | 'wide' | 'compact'
  }>(),
  { variant: 'default' }
)
</script>

<template>
  <article class="card" :class="`card--${variant}`">
    <div v-if="variant !== 'compact'" class="card__media">
      <img v-if="image" :src="image" :alt="imageAlt ?? title" loading="lazy">
      <div v-else class="card__placeholder" aria-hidden="true">
        <span>imagem</span>
      </div>
    </div>

    <div class="card__body">
      <div class="card__meta">
        <span v-if="index" class="card__index">{{ index }}</span>
        <span v-if="tag" class="eyebrow">{{ tag }}</span>
      </div>
      <h3 class="card__title">{{ title }}</h3>
      <p v-if="text" class="card__text">{{ text }}</p>
      <slot />
    </div>
  </article>
</template>

<style scoped>
.card {
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background:
    linear-gradient(160deg, rgba(255, 255, 255, 0.04), transparent 40%),
    var(--surface);
  box-shadow:
    0 30px 60px -30px rgba(0, 0, 0, 0.8),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);
  transition: border-color 0.4s ease, transform 0.4s ease;
}

.card:hover {
  border-color: var(--line-2);
}

.card__media {
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background: var(--surface-2);
}

.card--wide .card__media {
  aspect-ratio: 4 / 3;
}

.card__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(0.4) contrast(1.05);
}

.card__placeholder {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  background:
    radial-gradient(circle at 30% 20%, #26262c, transparent 60%),
    repeating-linear-gradient(135deg, transparent 0 14px, rgba(255, 255, 255, 0.025) 14px 15px),
    var(--surface-2);
}

.card__placeholder span {
  font-family: var(--font-display);
  font-size: 0.7rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--muted);
}

.card__body {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: clamp(20px, 2.4vw, 28px);
}

.card__meta {
  display: flex;
  align-items: center;
  gap: 14px;
}

.card__index {
  font-family: var(--font-display);
  font-size: 0.8rem;
  color: var(--text-2);
  padding: 4px 10px;
  border: 1px solid var(--line-2);
  border-radius: 999px;
}

.card__title {
  font-family: var(--font-display);
  font-weight: 500;
  font-size: clamp(1.25rem, 2vw, 1.6rem);
  letter-spacing: -0.02em;
  color: var(--white);
}

.card__text {
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--text-2);
}
</style>
