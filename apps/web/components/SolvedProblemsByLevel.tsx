import { DifficultyLevel } from "@repo/common/types";

function getColorBasedOnLevel(type: DifficultyLevel) {
  switch (type) {
    case DifficultyLevel.EASY:
      return "text-green-500";
    case DifficultyLevel.MEDIUM:
      return "text-yellow-500";
    case DifficultyLevel.HARD:
      return "text-red-500";
    default:
      return "text-gray-100";
  }
}
export function SolvedProblemsByLevel({
  type,
  solved,
  total,
}: {
  type: DifficultyLevel;
  solved: number;
  total: number;
}) {
  return (
    <div className="flex flex-col items-center gap-y-1 border px-8 py-1">
      <div className={`text-xs ${getColorBasedOnLevel(type)}`}>
        {type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}
      </div>
      <div className="text-sm font-medium">
        {solved} / {total}
      </div>
    </div>
  );
}
