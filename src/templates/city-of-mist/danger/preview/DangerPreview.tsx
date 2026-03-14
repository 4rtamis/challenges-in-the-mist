import {
    useCityOfMistDangerSheetStore,
    useCityOfMistDangerStore,
    useCityOfMistDangerViewStore,
} from '../hooks'
import BasicBlock from './blocks/BasicBlock'
import CustomMovesBlock from './blocks/CustomMovesBlock'
import DescriptionBlock from './blocks/DescriptionBlock'
import MetaFooterBlock from './blocks/MetaFooterBlock'
import MoveListBlock from './blocks/MoveListBlock'
import SpectrumsBlock from './blocks/SpectrumsBlock'
import './dangerTheme.css'

export function DangerPreview() {
    const { cityOfMistDanger } = useCityOfMistDangerStore()
    const { openSheet } = useCityOfMistDangerSheetStore()
    const {
        zoom,
        background,
        columnCount,
        titlePlacement,
        columnHeight,
        showSeparators,
    } = useCityOfMistDangerViewStore()

    const isTwoColumns = columnCount === 2
    const titleOutside = isTwoColumns && titlePlacement === 'outside'
    const hasCustomMoves = cityOfMistDanger.custom_moves.length > 0
    const hasHardMoves = cityOfMistDanger.hard_moves.length > 0
    const hasSoftMoves = cityOfMistDanger.soft_moves.length > 0
    return (
        <div className="city-danger-preview-root">
            <div
                className="city-danger-sheet"
                style={{
                    transform: `scale(${zoom})`,
                    transformOrigin: 'top left',
                }}
            >
                <div
                    className={`city-danger-card city-danger-token-scope ${background}`}
                    data-columns={columnCount}
                    style={
                        {
                            '--danger-column-height': `${columnHeight}px`,
                        } as React.CSSProperties
                    }
                >
                    {titleOutside ? (
                        <BasicBlock
                            onClick={() =>
                                openSheet({ kind: 'basic', mode: 'edit' })
                            }
                        />
                    ) : null}

                    <div
                        className={
                            isTwoColumns
                                ? 'city-danger-flow city-danger-flow--columns'
                                : 'city-danger-flow'
                        }
                    >
                        {!titleOutside ? (
                            <BasicBlock
                                onClick={() =>
                                    openSheet({ kind: 'basic', mode: 'edit' })
                                }
                            />
                        ) : null}

                        <DescriptionBlock
                            onClick={() =>
                                openSheet({ kind: 'basic', mode: 'edit' })
                            }
                        />

                        <SpectrumsBlock
                            onClick={() =>
                                openSheet({ kind: 'spectrums', mode: 'create' })
                            }
                        />

                        <CustomMovesBlock
                            onClick={() =>
                                openSheet({
                                    kind: 'customMoves',
                                    mode: 'create',
                                })
                            }
                        />

                        {showSeparators &&
                        hasCustomMoves &&
                        (hasHardMoves || hasSoftMoves) ? (
                            <DangerSeparator />
                        ) : null}

                        <MoveListBlock
                            values={cityOfMistDanger.hard_moves}
                            emptyLabel="add hard moves"
                            ariaLabel="Edit hard moves"
                            onClick={() =>
                                openSheet({ kind: 'hardMoves', mode: 'create' })
                            }
                        />

                        {showSeparators && hasHardMoves && hasSoftMoves ? (
                            <DangerSeparator />
                        ) : null}

                        <MoveListBlock
                            values={cityOfMistDanger.soft_moves}
                            emptyLabel="add soft moves"
                            ariaLabel="Edit soft moves"
                            onClick={() =>
                                openSheet({ kind: 'softMoves', mode: 'create' })
                            }
                        />
                    </div>
                </div>

                <MetaFooterBlock
                    onClick={() => openSheet({ kind: 'meta', mode: 'edit' })}
                />
            </div>
        </div>
    )
}

function DangerSeparator() {
    return <hr className="city-danger-separator" />
}
