import prisma from "./client";

// async function main() {
//     // Create Users
//     const user1 = await prisma.user.create({
//         data: {
//             email: 'user1@example.com',
//             name: 'User One',
//             password: 'password1',
//         },
//     });

//     const user2 = await prisma.user.create({
//         data: {
//             email: 'user2@example.com',
//             name: 'User Two',
//             password: 'password2',
//         },
//     });

//     // Create Problems with Markdown Content
//     const problem1 = await prisma.problem.create({
//         data: {
//             name: 'Sum of two numbers',
//             content: `
// # Problem One

// ## Description
// This is the content of problem one. Solve the problem by adding two numbers.

// ## Sample Input
// \`\`\`
// 1 2
// \`\`\`

// ## Sample Output
// \`\`\`
// 3
// \`\`\`
//       `,
//             difficultyLevel: 'EASY',
//         },
//     });

//     const problem2 = await prisma.problem.create({
//         data: {
//             name: 'Problem Two',
//             content: `
// # Problem Two

// ## Description
// This is the content of problem two. Solve the problem by multiplying two numbers.

// ## Sample Input
// \`\`\`
// 3 4
// \`\`\`

// ## Sample Output
// \`\`\`
// 12
// \`\`\`
//       `,
//             difficultyLevel: 'MEDIUM',
//         },
//     });

//     // Create TestCases with Multi-line Strings
//     await prisma.testCase.create({
//         data: {
//             input: '1 2\n3 4',
//             expectedOutput: '3\n7',
//             problemId: problem1.id,
//         },
//     });

//     await prisma.testCase.create({
//         data: {
//             input: '5 6\n7 8',
//             expectedOutput: '11\n15',
//             problemId: problem1.id,
//         },
//     });

//     await prisma.testCase.create({
//         data: {
//             input: '2 3\n4 5',
//             expectedOutput: '6\n20',
//             problemId: problem2.id,
//         },
//     });

//     await prisma.testCase.create({
//         data: {
//             input: '6 7\n8 9',
//             expectedOutput: '42\n72',
//             problemId: problem2.id,
//         },
//     });

//     // Create Contests
//     const contest1 = await prisma.contest.create({
//         data: {
//             name: 'Contest One',
//             noOfProblems: 2,
//             level: 'BEGINNER',
//             closesOn: new Date('2023-12-31'),
//             problems: {
//                 create: [
//                     { problem: { connect: { id: problem1.id } } },
//                     { problem: { connect: { id: problem2.id } } },
//                 ],
//             },
//             users: {
//                 create: [
//                     { user: { connect: { id: user1.id } } },
//                     { user: { connect: { id: user2.id } } },
//                 ],
//             },
//         },
//     });

//     // Create Submissions
//     await prisma.submission.create({
//         data: {
//             status: 'UNSOLVED',
//             userId: user1.id,
//             problemId: problem1.id,
//             contestId: contest1.id,
//         },
//     });

//     await prisma.submission.create({
//         data: {
//             status: 'SOLVED',
//             userId: user2.id,
//             problemId: problem1.id,
//             contestId: contest1.id,
//         },
//     });

//     await prisma.submission.create({
//         data: {
//             status: 'UNSOLVED',
//             userId: user1.id,
//             problemId: problem2.id,
//             contestId: contest1.id,
//         },
//     });

//     console.log('Seed data created successfully!');
// }
async function main() {
    const updatedProblem = await prisma.problem.update({
        where: {
            id: 1
        }, data: {
            content: `## Description
Find the sum of two given elements. Both the numbers will always be 0 or posve.

### Test case 1

#### Input
\`\`\`
1, 2
\`\`\`

#### Output
\`\`\`
3
\`\`\`

### Test case 2

#### Input
\`\`\`
1, 100
\`\`\`

#### Output
\`\`\`
100
\`\`\`
            `
        }
    })
    console.log("seed executed")
}
main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });