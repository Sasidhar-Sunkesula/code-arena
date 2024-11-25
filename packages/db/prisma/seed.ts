import prisma from "./client";
import bcrypt from "bcrypt";

async function main() {
    // Create Users
    const salt = await bcrypt.genSalt(10);
    const hash1 = await bcrypt.hash("sasidhar6", salt)
    const user1 = await prisma.user.create({
        data: {
            email: 'www.sasidharsunkesula579@gmail.com',
            username: 'venky',
            location: "India",
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

    await prisma.testCase.create({
        data: {
            input: '1\n2\n',
            expectedOutput: '3\n',
            problemId: problem1.id,
        },
    });

    await prisma.testCase.create({
        data: {
            input: '5\n6\n',
            expectedOutput: '11\n',
            problemId: problem1.id,
        },
    });

    await prisma.testCase.create({
        data: {
            input: '2\n3\n',
            expectedOutput: '5\n',
            problemId: problem1.id,
        },
    });

    await prisma.testCase.create({
        data: {
            input: '6\n7\n',
            expectedOutput: '13\n',
            problemId: problem1.id,
        },
    });
    const languages = [
        { id: 45, name: "Assembly (NASM 2.14.02)" },
        { id: 46, name: "Bash (5.0.0)" },
        { id: 47, name: "Basic (FBC 1.07.1)" },
        { id: 75, name: "C (Clang 7.0.1)" },
        { id: 76, name: "C++ (Clang 7.0.1)" },
        { id: 48, name: "C (GCC 7.4.0)" },
        { id: 52, name: "C++ (GCC 7.4.0)" },
        { id: 49, name: "C (GCC 8.3.0)" },
        { id: 53, name: "C++ (GCC 8.3.0)" },
        { id: 50, name: "C (GCC 9.2.0)" },
        { id: 54, name: "C++ (GCC 9.2.0)" },
        { id: 86, name: "Clojure (1.10.1)" },
        { id: 51, name: "C# (Mono 6.6.0.161)" },
        { id: 77, name: "COBOL (GnuCOBOL 2.2)" },
        { id: 55, name: "Common Lisp (SBCL 2.0.0)" },
        { id: 56, name: "D (DMD 2.089.1)" },
        { id: 57, name: "Elixir (1.9.4)" },
        { id: 58, name: "Erlang (OTP 22.2)" },
        { id: 44, name: "Executable" },
        { id: 87, name: "F# (.NET Core SDK 3.1.202)" },
        { id: 59, name: "Fortran (GFortran 9.2.0)" },
        { id: 60, name: "Go (1.13.5)" },
        { id: 88, name: "Groovy (3.0.3)" },
        { id: 61, name: "Haskell (GHC 8.8.1)" },
        { id: 62, name: "Java (OpenJDK 13.0.1)", monacoName: "java" },
        { id: 63, name: "JavaScript (Node.js 12.14.0)", monacoName: "javascript" },
        { id: 78, name: "Kotlin (1.3.70)" },
        { id: 64, name: "Lua (5.3.5)" },
        { id: 89, name: "Multi-file program" },
        { id: 79, name: "Objective-C (Clang 7.0.1)" },
        { id: 65, name: "OCaml (4.09.0)" },
        { id: 66, name: "Octave (5.1.0)" },
        { id: 67, name: "Pascal (FPC 3.0.4)" },
        { id: 85, name: "Perl (5.28.1)" },
        { id: 68, name: "PHP (7.4.1)" },
        { id: 43, name: "Plain Text" },
        { id: 69, name: "Prolog (GNU Prolog 1.4.5)" },
        { id: 70, name: "Python (2.7.17)" },
        { id: 71, name: "Python (3.8.1)", monacoName: "python" },
        { id: 80, name: "R (4.0.0)" },
        { id: 72, name: "Ruby (2.7.0)" },
        { id: 73, name: "Rust (1.40.0)", monacoName: "rust" },
        { id: 81, name: "Scala (2.13.2)" },
        { id: 82, name: "SQL (SQLite 3.27.2)" },
        { id: 83, name: "Swift (5.2.3)" },
        { id: 74, name: "TypeScript (3.7.4)", monacoName: "typescript" },
        { id: 84, name: "Visual Basic.Net (vbnc 0.0.0.5943)" }
    ];

    for (const language of languages) {
        await prisma.language.create({
            data: {
                judge0Id: language.id,
                judge0Name: language.name,
                monacoName: language.monacoName || language.name
            }
        });
    }

    const js = await prisma.language.findFirst({
        where: {
            judge0Id: 63
        }
    })
    if (!js) throw new Error("Unable to complete seeding")

    await prisma.boilerPlate.create({
        data: {
            problemId: problem1.id,
            languageId: js.id,
            initialFunction:
                `function sum(a, b) {
  // Implement this function
}`,
            boilerPlateCode:
                `const readline = require('readline');
const rl = readline.createInterface({
input: process.stdin,
output: process.stdout,
terminal: false
});

let input = [];
rl.on('line', function(line) {
input.push(line);
if (input.length === 2) {
const a = parseInt(input[0]);
const b = parseInt(input[1]);
console.log(sum(a, b));
rl.close();
}
});`
        }
    })
    const today = new Date();
    const afterTenDays = new Date(today);
    afterTenDays.setDate(today.getDate() + 10);

    await prisma.contest.create({
        data: {
            name: 'Basic Booster',
            level: 'BEGINNER',
            closesOn: afterTenDays,
            startsOn: afterTenDays,
            problems: {
                create: [
                    { problem: { connect: { id: problem1.id } } },
                ],
            },
            contributedBy: user1.username,
        },
    });
    console.log("seed command executed successfully")
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });