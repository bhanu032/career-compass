import type { MockPaper } from "@/types/mockTest";

/**
 * Authentic Paper Loader.
 * Guarantees zero question duplication or fake dummy papers.
 */
export function generateExpandedPaperSets(
  _examId: string,
  _examName: string,
  _tier: string,
  basePaper: MockPaper,
  _count: number = 1
): MockPaper[] {
  const actualTotalQ = basePaper.sections.reduce((acc, s) => acc + s.questions.length, 0);

  const cleanBasePaper: MockPaper = {
    ...basePaper,
    totalQuestions: actualTotalQ > 0 ? actualTotalQ : basePaper.totalQuestions,
  };

  return [cleanBasePaper];
}
