"use server";

import prisma from "@repo/db/client";
import { subYears, format, addMonths, startOfMonth } from "date-fns";

export async function getSubmissionsForPastYear(userId: string) {
  try {
    // Calculate the date one year ago from today
    const oneYearAgo = subYears(new Date(), 1);

    // Query for all submissions in the past one year
    const submissionsInPastYear = await prisma.submission.findMany({
      where: {
        userId: userId,
        createdAt: {
          gte: oneYearAgo,
        },
      },
      orderBy: {
        createdAt: "asc",
      },
      select: {
        createdAt: true,
      },
    });

    // Initialize all months with zero submissions
    const allMonths = [];
    let currentDate = startOfMonth(oneYearAgo);
    const endDate = startOfMonth(new Date());

    while (currentDate <= endDate) {
      allMonths.push({
        month: format(currentDate, "MMMM yyyy"), // Format as "MMMM yyyy"
        submissions: 0,
      });
      currentDate = addMonths(currentDate, 1);
    }

    // Group submissions by month and count the number of submissions for each month
    const submissionsByMonthObj = submissionsInPastYear.reduce(
      (acc, submission) => {
        const month = format(submission.createdAt, "MMMM yyyy"); // Format as "MMMM yyyy"
        if (!acc[month]) {
          acc[month] = 0;
        }
        acc[month]++;
        return acc;
      },
      {} as { [key: string]: number },
    );

    // Merge the grouped data with the initialized months array
    const submissionsByMonth = allMonths.map((monthData) => ({
      month: monthData.month,
      submissions: submissionsByMonthObj[monthData.month] || 0,
    }));
    return {
      submissionsByMonth,
    };
  } catch (error) {
    return {
      msg: "An error occurred while fetching submissions. Please try again later.",
    };
  }
}
