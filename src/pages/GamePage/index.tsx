import { game } from '@/constants/game'
import { useEffect } from 'react'

export function GamePage() {
    useEffect(() => {
        game
    }, [])

    return <div className="fixed top-0 left-0 size-full text-white select-none"></div>
}
