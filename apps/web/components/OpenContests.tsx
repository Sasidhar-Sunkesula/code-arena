import { ContestCard } from "./ContestCard"

const contests = [
  {
    name: "Weekly Algorithm Challenge",
    problemCount: 5,
    level: "Intermediate",
    closesOn: "2023-06-30",
  },
  {
    name: "Data Structures Mastery",
    problemCount: 8,
    level: "Advanced",
    closesOn: "2023-07-05",
  },
  {
    name: "Beginner's Coding Sprint",
    problemCount: 3,
    level: "Beginner",
    closesOn: "2023-06-28",
  },
]

export function OpenContests() {
  return (
    <section className="p-4 md:p-8">
      <h2 className="text-3xl font-bold mb-6">Open Contests</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contests.map((contest, index) => (
          <ContestCard key={index} {...contest} />
        ))}
      </div>
    </section>
  )
}