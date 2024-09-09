"use client"

import { useEffect, useState } from "react"

interface TimerProps {
    endTime: Date
}

export function Timer({ endTime }: TimerProps) {
    const [timeLeft, setTimeLeft] = useState("")

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date()
            const difference = endTime.getTime() - now.getTime()

            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24))
                const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
                const minutes = Math.floor((difference / 1000 / 60) % 60)
                const seconds = Math.floor((difference / 1000) % 60)

                setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`)
            } else {
                setTimeLeft("Contest Ended")
                clearInterval(timer)
            }
        }, 1000)

        return () => clearInterval(timer)
    }, [endTime])

    return <p>{timeLeft}</p>
}