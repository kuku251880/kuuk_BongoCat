<script setup lang="ts">
import { Tooltip } from 'antdv-next'
import { computed } from 'vue'

import type { KeyboardLayoutKey } from '@/utils/statistics'

import {
  getInputStatisticsKey,
  keyboardMainRows,
} from '@/utils/statistics'

const { counts } = defineProps<{
  counts: Record<string, number>
}>()

const keyCounts = computed(() => {
  const result: Record<string, number> = {}

  for (const key of keyboardMainRows.flat()) {
    result[key.id] = counts[getInputStatisticsKey('keyboard', key.id)] ?? 0
  }

  return result
})

const maxCount = computed(() => Math.max(0, ...Object.values(keyCounts.value)))

function getIntensity(count: number) {
  if (count <= 0 || maxCount.value <= 0) return 0

  return 0.15 + 0.85 * (count / maxCount.value) ** 0.65
}

function getKeyStyle(key: KeyboardLayoutKey) {
  const count = keyCounts.value[key.id] ?? 0
  const intensity = getIntensity(count)

  return {
    flexBasis: '0%',
    flexGrow: key.width,
    background: count > 0
      ? `linear-gradient(rgba(207, 95, 85, ${intensity}), rgba(207, 95, 85, ${intensity})), var(--ant-color-fill-tertiary)`
      : void 0,
    color: intensity > 0.62 ? '#fff' : void 0,
  }
}

function getKeyTooltip(key: KeyboardLayoutKey) {
  return `${key.label}: ${keyCounts.value[key.id] ?? 0}`
}
</script>

<template>
  <div class="w-full select-none">
    <div
      v-for="(row, rowIndex) in keyboardMainRows"
      :key="rowIndex"
      class="flex gap-1"
      :class="{ 'mt-1': rowIndex > 0 }"
    >
      <Tooltip
        v-for="key in row"
        :key="key.id"
        :title="getKeyTooltip(key)"
      >
        <div
          class="h-10 min-w-0 flex items-center justify-center b-1 b-solid text-3 font-medium b-border-sec rounded-md"
          :style="getKeyStyle(key)"
        >
          <span class="truncate px-1">{{ key.label }}</span>
        </div>
      </Tooltip>
    </div>

    <div class="mt-3 flex items-center justify-end gap-2 text-3 color-text-tertiary">
      <span>{{ $t('pages.preference.statistics.labels.heatmapLess') }}</span>

      <div
        class="h-2 w-28 rounded-full"
        style="background: linear-gradient(90deg, rgba(207, 95, 85, 0.15), rgba(207, 95, 85, 1)), var(--ant-color-fill-tertiary)"
      />

      <span>{{ $t('pages.preference.statistics.labels.heatmapMore') }}</span>
    </div>
  </div>
</template>
