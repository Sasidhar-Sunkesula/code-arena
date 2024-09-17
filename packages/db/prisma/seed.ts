import prisma from "./client";
import bcrypt from "bcrypt";

async function main() {
    // Create Users
    const salt = await bcrypt.genSalt(10);
    const hash1 = await bcrypt.hash("sasidhar6", salt)
    const user1 = await prisma.user.create({
        data: {
            email: 'www.sasidharsunkesula579@gmail.com',
            name: 'User One',
            password: hash1,
        },
    })

    // Create Problems with Markdown Content
    const problem1 = await prisma.problem.create({
        data: {
            name: "Sum of two numbers",
            content: `
## Description
Find the sum of two given elements. Both the numbers will always be 0 or positive.
    
### Sample Input 1
    
#### Input
\`\`\`
1, 2
\`\`\`
    
#### Output
\`\`\`
3
\`\`\`
    
### Sample Input 2
    
#### Input
\`\`\`
1, 100
\`\`\`
    
#### Output
\`\`\`
101
\`\`\`
            `,
            difficultyLevel: "EASY"
        },
    });

    const problem2 = await prisma.problem.create({
        data: {
            name: 'Problem Two',
            content: `
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
    await prisma.testCase.create({
        data: {
            input: '1 2\n3 4',
            expectedOutput: '3\n7',
            problemId: problem1.id,
        },
    });

    await prisma.testCase.create({
        data: {
            input: '5 6\n7 8',
            expectedOutput: '11\n15',
            problemId: problem1.id,
        },
    });

    await prisma.testCase.create({
        data: {
            input: '2 3\n4 5',
            expectedOutput: '6\n20',
            problemId: problem2.id,
        },
    });

    await prisma.testCase.create({
        data: {
            input: '6 7\n8 9',
            expectedOutput: '42\n72',
            problemId: problem2.id,
        },
    });
    const language = await prisma.language.create({
        data: {
            judge0Name: "Python",
            monacoName: "python",
            judge0Id: 71
        }
    })
    // Create Contests
    const contest1 = await prisma.contest.create({
        data: {
            name: 'Basic Booster',
            noOfProblems: 2,
            level: 'BEGINNER',
            closesOn: new Date('2024-09-15'),
            problems: {
                create: [
                    { problem: { connect: { id: problem1.id } } },
                    { problem: { connect: { id: problem2.id } } },
                ],
            },
            users: {
                create: [
                    { user: { connect: { id: user1.id } } },
                ],
            },
        },
    });

    // Create Submissions
    await prisma.submission.create({
        data: {
            status: 'Accepted',
            userId: user1.id,
            languageId: language.id,
            submittedCode: `function sum(a, b) {\n
    // implementation goes here\n
}`,
            problemId: problem1.id,
            createdAt: new Date(),
            memory: 2000,
            runTime: 2000,
            testCasesPassed: 1,
            contestId: contest1.id,
        },
    });

    console.log('Seed data created successfully!');
}
async function deleteAll() {
    // Delete all records from each table in the correct order
    await prisma.userContest.deleteMany({});
    await prisma.contestProblem.deleteMany({});
    await prisma.submission.deleteMany({});
    await prisma.boilerPlate.deleteMany({});
    await prisma.testCase.deleteMany({});
    await prisma.problem.deleteMany({});
    await prisma.contest.deleteMany({});
    await prisma.language.deleteMany({});
    await prisma.user.deleteMany({});

    console.log('All data deleted');
}
async function addBoilerPlate() {
    await prisma.boilerPlate.create({
        data: {
            languageId: 2,
            problemId: 1,
            boilerPlateCode: `def sum(a,b):
# Implementation goes here
return result`
        }
    })
    console.log("bpc updated");
}
main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });