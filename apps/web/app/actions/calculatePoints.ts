import { DifficultyLevel } from "@prisma/client/edge";

export function calculatePoints(problemDifficulty: DifficultyLevel, incorrectSubmissions?: number) {
    // Calculate points
    let points = 0;
    if (problemDifficulty === DifficultyLevel.EASY) {
        points = 100;
    } else if (problemDifficulty === DifficultyLevel.MEDIUM) {
        points = 200;
    } else {
        points = 300;
    }
    // Apply penalty
    points -= (incorrectSubmissions ?? 0) * 5;
    return points;
}