import { categoriesMap } from '@/constants/categories'
import { implementedMoveFlags, moves, type Move } from '@/constants/moves'
import { typesMap } from '@/constants/types'
import clsx from 'clsx'
import { useMemo, type MouseEvent } from 'react'

export function MovesPage() {
    const sortedMoves = useMemo(() => {
        return moves.toSorted((moveA, moveB) => {
            return (
                moveA.desc.localeCompare(moveB.desc) ||
                moveA.target.localeCompare(moveB.target) ||
                moveA.category.localeCompare(moveB.category) ||
                moveA.basePower - moveB.basePower
            )
        })
    }, [moves])

    const handleFieldClick = (move: Move, field: keyof Move) => {
        switch (field) {
            case 'name':
                navigator.clipboard.writeText(move.name)
                break
            case 'desc':
                navigator.clipboard.writeText(move.desc)
                break
        }
    }

    const handleFieldContextMenu = (move: Move, field: keyof Move, event: MouseEvent) => {
        event.preventDefault()

        switch (field) {
            case 'name':
                window.open(`https://bulbapedia.bulbagarden.net/wiki/${move.text}_(move)`)
                break
        }
    }

    return (
        <div className="h-full overflow-auto">
            <table className="w-full">
                <thead className="sticky top-0 bg-zinc-900 text-left outline outline-zinc-600">
                    <tr>
                        <th className="px-4">STT</th>
                        <th className="px-4">Tên</th>
                        <th className="px-4">Thể loại</th>
                        <th className="px-4">Loại</th>
                        <th className="px-4">Sức mạnh</th>
                        <th className="px-4">Độ chính xác</th>
                        <th className="px-4">Ưu tiên</th>
                        <th className="px-4">Mục tiêu</th>
                        <th className="px-4">Mô tả</th>
                    </tr>
                </thead>
                <tbody className="divide-transparent">
                    {sortedMoves.map((move, i) => {
                        const prevMove = sortedMoves.at(i - 1)
                        const isNewDesc = move.desc !== prevMove?.desc
                        const implementedEffect = implementedMoveFlags[move.name]
                        return (
                            <tr
                                className={clsx(
                                    'group border-t hover:bg-zinc-900',
                                    isNewDesc && 'border-zinc-800',
                                )}
                            >
                                <td className="px-4">{i}</td>
                                <td
                                    className={clsx(
                                        'cursor-copy px-4 active:bg-rose-600',
                                        implementedEffect && 'text-orange-300',
                                    )}
                                    onClick={handleFieldClick.bind(null, move, 'name')}
                                    onContextMenu={handleFieldContextMenu.bind(null, move, 'name')}
                                >
                                    {move.name}
                                </td>
                                <td className="px-4">
                                    <div
                                        className="inline-flex rounded px-1 text-sm leading-tight text-white"
                                        style={{
                                            backgroundColor: categoriesMap[move.category].bgColor,
                                        }}
                                    >
                                        {move.category}
                                    </div>
                                </td>
                                <td className="px-4">
                                    <div
                                        className="inline-flex rounded px-1 text-sm leading-tight text-white"
                                        style={{ backgroundColor: typesMap[move.type].bgColor }}
                                    >
                                        {move.type}
                                    </div>
                                </td>
                                <td className="px-4">{move.basePower || '-'}</td>
                                <td className="px-4">
                                    {move.accuracy === true ? '-' : move.accuracy}
                                </td>
                                <td
                                    className={clsx(
                                        move.priority > 0 && 'text-green-500',
                                        move.priority < 0 && 'text-rose-500',
                                    )}
                                >
                                    {move.priority < 0
                                        ? move.priority
                                        : move.priority > 0
                                          ? '+' + move.priority
                                          : '-'}
                                </td>
                                <td className="px-4">
                                    {move.target === 'normal' ? '-' : move.target}
                                </td>
                                <td
                                    className="cursor-copy px-4 active:bg-rose-600"
                                    title={move.longDesc}
                                    onClick={handleFieldClick.bind(null, move, 'desc')}
                                >
                                    {isNewDesc && move.desc}
                                    {!isNewDesc && (
                                        <div className="invisible text-zinc-500 group-hover:visible">
                                            {move.desc}
                                        </div>
                                    )}
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}
