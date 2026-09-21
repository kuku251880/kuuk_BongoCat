<script setup lang="ts">
import { save } from '@tauri-apps/plugin-dialog'
import { writeTextFile } from '@tauri-apps/plugin-fs'
import { useNow } from '@vueuse/core'
import { Button, message, Popconfirm, Switch } from 'antdv-next'
import dayjs from 'dayjs'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import ProListItem from '@/components/pro-list-item/index.vue'
import ProList from '@/components/pro-list/index.vue'
import { useStatisticsStore } from '@/stores/statistics'
import {
  getInputStatisticsLabel,
  getKeyboardStatisticsHand,
  parseInputStatisticsKey,
} from '@/utils/statistics'

import KeyboardHeatmap from './components/keyboard-heatmap/index.vue'

const statisticsStore = useStatisticsStore()
const now = useNow({ interval: 1000 })
const { t } = useI18n()

function sumCounts(counts: Record<string, number>) {
  return Object.values(counts).reduce((total, count) => total + count, 0)
}

const todayTotal = computed(() => sumCounts(statisticsStore.todayCounts))
const total = computed(() => sumCounts(statisticsStore.totalCounts))
const liveApm = computed(() => statisticsStore.getRecentPressCount(now.value.getTime()))
const hasData = computed(() => total.value > 0)

const handUsage = computed(() => {
  let left = 0
  let right = 0

  for (const [key, count] of Object.entries(statisticsStore.todayCounts)) {
    const input = parseInputStatisticsKey(key)

    if (input?.source !== 'keyboard') continue

    const hand = getKeyboardStatisticsHand(input.id)

    if (hand === 'left') left += count
    if (hand === 'right') right += count
  }

  const ratedTotal = left + right

  const leftPercent = ratedTotal > 0 ? Math.round((left / ratedTotal) * 100) : 0

  return {
    leftPercent,
    rightPercent: ratedTotal > 0 ? 100 - leftPercent : 0,
  }
})

const topKeys = computed(() => {
  return Object.entries(statisticsStore.todayCounts)
    .flatMap(([key, count]) => {
      const input = parseInputStatisticsKey(key)

      if (!input) return []

      return [{
        key,
        count,
        label: getInputStatisticsLabel(input.source, input.id),
      }]
    })
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
    .slice(0, 10)
})

async function exportStatistics() {
  try {
    const path = await save({
      defaultPath: `bongo-cat-statistics-${dayjs().format('YYYY-MM-DD')}.json`,
      filters: [{
        name: 'JSON',
        extensions: ['json'],
      }],
    })

    if (!path) return

    await writeTextFile(path, JSON.stringify(statisticsStore.getExportData(), null, 2))
    message.success(t('pages.preference.statistics.hints.exportSuccess'))
  } catch (error) {
    message.error(String(error))
  }
}

function clearStatistics() {
  statisticsStore.resetStatistics()
  message.success(t('pages.preference.statistics.hints.clearSuccess'))
}
</script>

<template>
  <ProList :title="$t('pages.preference.statistics.labels.overview')">
    <ProListItem :title="$t('pages.preference.statistics.labels.todayTotal')">
      <div class="text-5 font-semibold tabular-nums">
        {{ todayTotal }}
      </div>
    </ProListItem>

    <ProListItem :title="$t('pages.preference.statistics.labels.total')">
      <div class="text-5 font-semibold tabular-nums">
        {{ total }}
      </div>
    </ProListItem>

    <ProListItem
      :description="$t('pages.preference.statistics.hints.liveApm')"
      :title="$t('pages.preference.statistics.labels.liveApm')"
    >
      <div class="text-5 font-semibold tabular-nums">
        {{ liveApm }}
      </div>
    </ProListItem>
  </ProList>

  <ProList :title="$t('pages.preference.statistics.labels.handUsage')">
    <ProListItem
      :description="$t('pages.preference.statistics.hints.handUsage')"
      :title="$t('pages.preference.statistics.labels.handUsage')"
    >
      <div class="w-52 flex items-center gap-3">
        <span class="whitespace-nowrap text-3 color-text-secondary">
          {{ $t('pages.preference.statistics.labels.leftHand') }} {{ handUsage.leftPercent }}%
        </span>

        <div class="h-2 flex flex-1 overflow-hidden bg-[--ant-color-fill-secondary] rounded-full">
          <div
            class="h-full transition-[width] duration-300 bg-cyan-5"
            :style="{ width: `${handUsage.leftPercent}%` }"
          />

          <div
            class="h-full bg-amber-5 transition-[width] duration-300"
            :style="{ width: `${handUsage.rightPercent}%` }"
          />
        </div>

        <span class="whitespace-nowrap text-3 color-text-secondary">
          {{ $t('pages.preference.statistics.labels.rightHand') }} {{ handUsage.rightPercent }}%
        </span>
      </div>
    </ProListItem>
  </ProList>

  <ProList :title="$t('pages.preference.statistics.labels.heatmap')">
    <ProListItem
      :description="$t('pages.preference.statistics.hints.heatmap')"
      :title="$t('pages.preference.statistics.labels.heatmapEnabled')"
    >
      <Switch v-model:checked="statisticsStore.heatmapEnabled" />
    </ProListItem>

    <ProListItem
      v-if="statisticsStore.heatmapEnabled"
      :title="$t('pages.preference.statistics.labels.heatmapCounts')"
      vertical
    >
      <KeyboardHeatmap :counts="statisticsStore.totalCounts" />
    </ProListItem>
  </ProList>

  <ProList :title="$t('pages.preference.statistics.labels.topKeys')">
    <ProListItem
      v-for="(item, index) in topKeys"
      :key="item.key"
      :title="`${index + 1}. ${item.label}`"
    >
      <div class="text-4 font-semibold tabular-nums">
        {{ item.count }}
      </div>
    </ProListItem>

    <ProListItem
      v-if="topKeys.length === 0"
      :title="$t('pages.preference.statistics.labels.noData')"
    />
  </ProList>

  <ProList :title="$t('pages.preference.statistics.labels.dataManagement')">
    <ProListItem
      :description="$t('pages.preference.statistics.hints.exportStatistics')"
      :title="$t('pages.preference.statistics.labels.exportStatistics')"
    >
      <Button
        :disabled="!hasData"
        @click="exportStatistics"
      >
        {{ $t('pages.preference.statistics.buttons.export') }}
      </Button>
    </ProListItem>

    <ProListItem
      :description="$t('pages.preference.statistics.hints.clearStatistics')"
      :title="$t('pages.preference.statistics.labels.clearStatistics')"
    >
      <Popconfirm
        :description="$t('pages.preference.statistics.hints.clearConfirm')"
        :title="$t('pages.preference.statistics.labels.clearStatistics')"
        @confirm="clearStatistics"
      >
        <Button
          danger
          :disabled="!hasData"
        >
          {{ $t('pages.preference.statistics.buttons.clear') }}
        </Button>
      </Popconfirm>
    </ProListItem>
  </ProList>
</template>
