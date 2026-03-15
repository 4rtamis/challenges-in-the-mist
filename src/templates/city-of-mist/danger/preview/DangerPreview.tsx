import {
    shouldShow,
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
    const view = useCityOfMistDangerViewStore()
    const {
        zoom,
        background,
        columnCount,
        titlePlacement,
        columnHeight,
        showSeparators,
    } = view

    const isTwoColumns = columnCount === 2
    const titleOutside = isTwoColumns && titlePlacement === 'outside'
    const showBasic = shouldShow(cityOfMistDanger, 'basic', view)
    const showDescription = shouldShow(cityOfMistDanger, 'description', view)
    const showSpectrums = shouldShow(cityOfMistDanger, 'spectrums', view)
    const showCustomMoves = shouldShow(cityOfMistDanger, 'customMoves', view)
    const showHardMoves = shouldShow(cityOfMistDanger, 'hardMoves', view)
    const showSoftMoves = shouldShow(cityOfMistDanger, 'softMoves', view)
    const showMeta = shouldShow(cityOfMistDanger, 'meta', view)

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
                    className={`city-danger-card ${background}`}
                    data-columns={columnCount}
                    style={
                        {
                            '--danger-column-height': `${columnHeight}px`,
                        } as React.CSSProperties
                    }
                >
                    {titleOutside && showBasic ? (
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
                        {!titleOutside && showBasic ? (
                            <BasicBlock
                                onClick={() =>
                                    openSheet({ kind: 'basic', mode: 'edit' })
                                }
                            />
                        ) : null}

                        {showDescription ? (
                            <DescriptionBlock
                                onClick={() =>
                                    openSheet({ kind: 'basic', mode: 'edit' })
                                }
                            />
                        ) : null}

                        {showSpectrums ? (
                            <SpectrumsBlock
                                onAddClick={() =>
                                    openSheet({
                                        kind: 'spectrums',
                                        mode: 'create',
                                    })
                                }
                                onItemClick={(index) =>
                                    openSheet({
                                        kind: 'spectrums',
                                        mode: 'edit',
                                        index,
                                    })
                                }
                            />
                        ) : null}

                        {showCustomMoves ? (
                            <CustomMovesBlock
                                onAddClick={() =>
                                    openSheet({
                                        kind: 'customMoves',
                                        mode: 'create',
                                    })
                                }
                                onItemClick={(index) =>
                                    openSheet({
                                        kind: 'customMoves',
                                        mode: 'edit',
                                        index,
                                    })
                                }
                            />
                        ) : null}

                        {showSeparators &&
                        showCustomMoves &&
                        (showHardMoves || showSoftMoves) ? (
                            <DangerSeparator />
                        ) : null}

                        {showHardMoves ? (
                            <MoveListBlock
                                values={cityOfMistDanger.hard_moves}
                                emptyLabel="add hard moves"
                                ariaLabel="Edit hard moves"
                                itemAriaLabel={(index) =>
                                    `Edit hard move ${index + 1}`
                                }
                                onAddClick={() =>
                                    openSheet({
                                        kind: 'hardMoves',
                                        mode: 'create',
                                    })
                                }
                                onItemClick={(index) =>
                                    openSheet({
                                        kind: 'hardMoves',
                                        mode: 'edit',
                                        index,
                                    })
                                }
                            />
                        ) : null}

                        {showSeparators && showHardMoves && showSoftMoves ? (
                            <DangerSeparator />
                        ) : null}

                        {showSoftMoves ? (
                            <MoveListBlock
                                values={cityOfMistDanger.soft_moves}
                                emptyLabel="add soft moves"
                                ariaLabel="Edit soft moves"
                                itemAriaLabel={(index) =>
                                    `Edit soft move ${index + 1}`
                                }
                                onAddClick={() =>
                                    openSheet({
                                        kind: 'softMoves',
                                        mode: 'create',
                                    })
                                }
                                onItemClick={(index) =>
                                    openSheet({
                                        kind: 'softMoves',
                                        mode: 'edit',
                                        index,
                                    })
                                }
                            />
                        ) : null}
                    </div>
                </div>

                {showMeta ? (
                    <MetaFooterBlock
                        onClick={() => openSheet({ kind: 'meta', mode: 'edit' })}
                    />
                ) : null}
            </div>
        </div>
    )
}

function DangerSeparator() {
    return <hr className="city-danger-separator" />
}
