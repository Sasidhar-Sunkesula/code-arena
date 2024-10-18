import { Code, FileInput, PackageCheck, ReceiptText, Check } from "lucide-react"

export function Stepper({ step }: { step: number }) {
    return (
        <ol className="relative text-gray-500 border-s border-gray-200 dark:border-gray-700 dark:text-gray-400">
            <li className="mb-10 ms-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full -start-4 ring-4 ring-white dark:ring-gray-900 dark:bg-green-900">
                    {step > 1 ? <Check className="w-5 text-green-500" /> : <ReceiptText className="w-5" />}
                </span>
                <h3 className="font-medium leading-tight">Problem Details</h3>
                <p className="text-sm">Give problem name and description</p>
            </li>
            <li className="mb-10 ms-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full -start-4 ring-4 ring-white dark:ring-gray-900 dark:bg-gray-700">
                    {step > 2 ? <Check className="w-5 text-green-500" /> : <Code className="w-5" />}
                </span>
                <h3 className="font-medium leading-tight">Boilerplate Code</h3>
                <p className="text-sm">Add boilerplate codes</p>
            </li>
            <li className="mb-10 ms-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full -start-4 ring-4 ring-white dark:ring-gray-900 dark:bg-gray-700">
                    {step > 3 ? <Check className="w-5 text-green-500" /> : <FileInput className="w-5" />}
                </span>
                <h3 className="font-medium leading-tight">Test Cases</h3>
                <p className="text-sm">Add test cases</p>
            </li>
            <li className="ms-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full -start-4 ring-4 ring-white dark:ring-gray-900 dark:bg-gray-700">
                    {step > 4 ? <Check className="w-5 text-green-500" /> : <PackageCheck className="w-5" />}
                </span>
                <h3 className="font-medium leading-tight">Confirmation</h3>
                <p className="text-sm">Check if the code runs with the given details</p>
            </li>
        </ol>
    )
}