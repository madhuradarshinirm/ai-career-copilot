export function selectQuestions(allQuestions, gaps) {
  const TARGET_COUNT = 7

  // Build a priority-ordered list of gap topics: high first, then medium, then low
  const priorityOrder = { high: 0, medium: 1, low: 2 }
  const sortedGaps = [...gaps].sort(
    (a, b) => (priorityOrder[a.priority] ?? 3) - (priorityOrder[b.priority] ?? 3)
  )
  const gapTopics = sortedGaps.map((g) => g.topic)

  const selected = []
  const usedIds = new Set()

  // Step 1: pull questions from gap topics, in priority order, spreading across topics
  let round = 0
  while (selected.length < TARGET_COUNT - 1 && round < 3) {
    for (const topic of gapTopics) {
      if (selected.length >= TARGET_COUNT - 1) break

      const candidates = allQuestions.filter(
        (q) => q.topic === topic && !usedIds.has(q.id)
      )

      if (candidates.length > 0) {
        const pick = candidates[Math.floor(Math.random() * candidates.length)]
        selected.push(pick)
        usedIds.add(pick.id)
      }
    }
    round++
  }

  // Step 2: add at least 1 question from a topic NOT in the gap list (a strength area)
  const strengthCandidates = allQuestions.filter(
    (q) => !gapTopics.includes(q.topic) && !usedIds.has(q.id)
  )
  if (strengthCandidates.length > 0) {
    const pick = strengthCandidates[Math.floor(Math.random() * strengthCandidates.length)]
    selected.push(pick)
    usedIds.add(pick.id)
  }

  // Step 3: if still under target (e.g. gap topics ran out of unique questions), fill from anywhere unused
  while (selected.length < TARGET_COUNT) {
    const remaining = allQuestions.filter((q) => !usedIds.has(q.id))
    if (remaining.length === 0) break
    const pick = remaining[Math.floor(Math.random() * remaining.length)]
    selected.push(pick)
    usedIds.add(pick.id)
  }

  return selected
}