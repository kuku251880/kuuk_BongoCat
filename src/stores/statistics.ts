import dayjs from 'dayjs'
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

import {
  getInputStatisticsKey,
  normalizeInputStatisticsId,
  parseInputStatisticsKey,
} from '@/utils/statistics'

const DATE_FORMAT = 'YYYY-MM-DD'
const APM_WINDOW = 60 * 1000

export interface StatisticsExportData {
  version: 1
  exportedAt: string
  todayDate: string
  todayCounts: Record<string, number>
  totalCounts: Record<string, number>
}

export const useStatisticsStore = defineStore('statistics', () => {
  const todayDate = ref(dayjs().format(DATE_FORMAT))
  const todayCounts = reactive<Record<string, number>>({})
  const totalCounts = reactive<Record<string, number>>({})
  const heatmapEnabled = ref(true)
  const pressedInputs = new Set<string>()
  const recentPressTimestamps: number[] = []

  const clearCounts = (counts: Record<string, number>) => {
    for (const key of Object.keys(counts)) {
      delete counts[key]
    }
  }

  const normalizeCounts = (counts: Record<string, number>) => {
    const normalizedCounts: Record<string, number> = {}

    for (const [key, count] of Object.entries(counts)) {
      const input = parseInputStatisticsKey(key)
      const nextKey = input
        ? getInputStatisticsKey(input.source, normalizeInputStatisticsId(input.source, input.id))
        : key

      normalizedCounts[nextKey] = (normalizedCounts[nextKey] ?? 0) + count
    }

    clearCounts(counts)
    Object.assign(counts, normalizedCounts)
  }

  const refreshDate = () => {
    const date = dayjs().format(DATE_FORMAT)

    if (todayDate.value === date) return

    todayDate.value = date
    clearCounts(todayCounts)
  }

  const init = () => {
    refreshDate()
    normalizeCounts(todayCounts)
    normalizeCounts(totalCounts)
  }

  const recordPress = (source: 'keyboard' | 'mouse', id: string) => {
    const key = getInputStatisticsKey(source, normalizeInputStatisticsId(source, id))

    if (pressedInputs.has(key)) return false

    pressedInputs.add(key)
    refreshDate()

    todayCounts[key] = (todayCounts[key] ?? 0) + 1
    totalCounts[key] = (totalCounts[key] ?? 0) + 1
    recentPressTimestamps.push(Date.now())

    return true
  }

  const recordRelease = (source: 'keyboard' | 'mouse', id: string) => {
    pressedInputs.delete(getInputStatisticsKey(source, normalizeInputStatisticsId(source, id)))
  }

  const clearPressedInputs = () => {
    pressedInputs.clear()
  }

  const getRecentPressCount = (now = Date.now()) => {
    const cutoff = now - APM_WINDOW

    while (recentPressTimestamps.length > 0 && recentPressTimestamps[0] <= cutoff) {
      recentPressTimestamps.shift()
    }

    return recentPressTimestamps.length
  }

  const resetStatistics = () => {
    todayDate.value = dayjs().format(DATE_FORMAT)
    clearCounts(todayCounts)
    clearCounts(totalCounts)
    clearPressedInputs()
    recentPressTimestamps.length = 0
  }

  const getExportData = (): StatisticsExportData => ({
    version: 1,
    exportedAt: new Date().toISOString(),
    todayDate: todayDate.value,
    todayCounts: { ...todayCounts },
    totalCounts: { ...totalCounts },
  })

  return {
    todayDate,
    todayCounts,
    totalCounts,
    heatmapEnabled,
    init,
    recordPress,
    recordRelease,
    clearPressedInputs,
    getRecentPressCount,
    getExportData,
    resetStatistics,
  }
})
