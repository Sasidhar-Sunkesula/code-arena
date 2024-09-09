import prisma from "./client";

async function main() {
    // Create Users
    const user1 = await prisma.user.upsert({
        where: { email: 'user1@example.com' },
        update: {},
        create: {
            email: 'user1@example.com',
            name: 'User One',
            password: 'password1',
        },
    });

    const user2 = await prisma.user.upsert({
        where: { email: 'user2@example.com' },
        update: {},
        create: {
            email: 'user2@example.com',
            name: 'User Two',
            password: 'password2',
        },
    });

    // Create Problems with Markdown Content
    const problem1 = await prisma.problem.create({
        data: {
            name: 'Sum of two numbers',
            content: `
# Problem One

## Description
This is the content of problem one. Solve the problem by adding two numbers.

## Sample Input
\`\`\`
1 2
\`\`\`

## Sample Output
\`\`\`
3
\`\`\`
      `,
            difficultyLevel: 'EASY',
        },
    });

    const problem2 = await prisma.problem.create({
        data: {
            name: 'Problem Two',
            content: `
# Problem Two

## Description
This is the content of problem two. Solve the problem by multiplying two numbers.

## Sample Input
\`\`\`
3 4
\`\`\`

## Sample Output
\`\`\`
12
\`\`\`
      `,
            difficultyLevel: 'MEDIUM',
        },
    });

    // Create TestCases with Multi-line Strings
    await prisma.testCase.upsert({
        where: { id: 1 },
        update: {
            input: '1 2\n3 4',
            expectedOutput: '3\n7',
        },
        create: {
            input: '1 2\n3 4',
            expectedOutput: '3\n7',
            problemId: problem1.id,
        },
    });

    await prisma.testCase.upsert({
        where: { id: 2 },
        update: {
            input: '5 6\n7 8',
            expectedOutput: '11\n15',
        },
        create: {
            input: '5 6\n7 8',
            expectedOutput: '11\n15',
            problemId: problem1.id,
        },
    });

    await prisma.testCase.upsert({
        where: { id: 3 },
        update: {
            input: '2 3\n4 5',
            expectedOutput: '6\n20',
        },
        create: {
            input: '2 3\n4 5',
            expectedOutput: '6\n20',
            problemId: problem2.id,
        },
    });

    await prisma.testCase.upsert({
        where: { id: 4 },
        update: {
            input: '6 7\n8 9',
            expectedOutput: '42\n72',
        },
        create: {
            input: '6 7\n8 9',
            expectedOutput: '42\n72',
            problemId: problem2.id,
        },
    });

    // Create Contests
    const contest1 = await prisma.contest.create({
        data: {
            name: 'Contest One',
            noOfProblems: 2,
            level: 'BEGINNER',
            closesOn: new Date('2023-12-31'),
            problems: {
                connect: [{ id: problem1.id }, { id: problem2.id }],
            },
            users: {
                connect: [{ id: user1.id }, { id: user2.id }],
            },
        },
    });

    // Create Submissions
    await prisma.submission.upsert({
        where: { userId_problemId: { userId: user1.id, problemId: problem1.id } },
        update: {
            status: 'UNSOLVED',
            contestId: contest1.id,
        },
        create: {
            status: 'UNSOLVED',
            userId: user1.id,
            problemId: problem1.id,
            contestId: contest1.id,
        },
    });

    await prisma.submission.upsert({
        where: { userId_problemId: { userId: user2.id, problemId: problem1.id } },
        update: {
            status: 'SOLVED',
            contestId: contest1.id,
        },
        create: {
            status: 'SOLVED',
            userId: user2.id,
            problemId: problem1.id,
            contestId: contest1.id,
        },
    });

    await prisma.submission.upsert({
        where: { userId_problemId: { userId: user1.id, problemId: problem2.id } },
        update: {
            status: 'UNSOLVED',
            contestId: contest1.id,
        },
        create: {
            status: 'UNSOLVED',
            userId: user1.id,
            problemId: problem2.id,
            contestId: contest1.id,
        },
    });

    console.log('Seed data created successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });