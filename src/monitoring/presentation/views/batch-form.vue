<script setup>
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';

const { t, locale, messages } = useI18n();

const props = defineProps({
  lotName: { type: String, required: true },
  cropType: { type: String, required: true },
  humidity: { type: Number, required: true },
  cropTypeOptions: { type: Array, required: true },
  humidityGuide: { type: Object, default: null }
});

const emit = defineEmits([
  'update:lotName',
  'update:cropType',
  'update:humidity',
  'submit',
  'cancel'
]);

const updateLotName = (event) => emit('update:lotName', event.target.value);
const updateCropType = (event) => emit('update:cropType', event.target.value);
const updateHumidity = (event) => emit('update:humidity', Number(event.target.value));

const humidityGuideTranslated = computed(() => {
  const key = props.cropType.toLowerCase();
  try {
    return messages.value[locale.value]?.['humidity-guides']?.[key] || null;
  } catch {
    return null;
  }
});
</script>

<template>
  <div class="batch-form-wrap">
	<form class="batch-form" @submit.prevent="emit('submit')">
	  <input
		:value="props.lotName"
		type="text"
      :placeholder="t('monitoring.lot-name-placeholder')"
		required
		@input="updateLotName"
	  />

	  <select :value="props.cropType" required @change="updateCropType">
		<option v-for="crop in props.cropTypeOptions" :key="crop" :value="crop">{{ crop }}</option>
	  </select>

	  <input
		:value="props.humidity"
		type="number"
		min="0"
		max="100"
      :placeholder="t('monitoring.humidity-placeholder')"
		@input="updateHumidity"
	  />

	  <div class="batch-form-actions">
      <button type="submit" class="btn btn-primary">{{ t('monitoring.save-lot-btn') }}</button>
      <button type="button" class="btn" @click="emit('cancel')">{{ t('monitoring.cancel-btn') }}</button>
	  </div>
	</form>

    <p v-if="humidityGuideTranslated" class="guide">
      {{ t('monitoring.recommended-label') }} {{ props.cropType }}: {{ humidityGuideTranslated.min }}% - {{ humidityGuideTranslated.max }}%.
      {{ humidityGuideTranslated.note }}
    </p>
  </div>
</template>

<style scoped>
.batch-form-wrap {
  margin-bottom: 0.7rem;
}

.batch-form {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
}

.batch-form input,
.batch-form select {
  background: #23364f;
  border: 1px solid #376385;
  color: #e6f4ff;
  border-radius: 6px;
  padding: 0.5rem 0.65rem;
}

.batch-form-actions {
  display: flex;
  gap: 0.45rem;
}

.btn {
  border: 1px solid #5bbf7f;
  background: transparent;
  color: #fff;
  border-radius: 6px;
  padding: 0.5rem 0.8rem;
  cursor: pointer;
}

.btn-primary {
  background: #2d945b;
}

.guide {
  border-radius: 8px;
  padding: 0.6rem 0.75rem;
  margin: 0.7rem 0 0;
  background: #203a29;
  border: 1px solid #57c27f;
}
</style>

