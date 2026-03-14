type Props = {
    title: string
    align?: 'center' | 'left'
    onClick?: () => void
}

export function SectionHeader({ title, align = 'center', onClick }: Props) {
    const base =
        (align === 'center' ? 'section--center' : 'section--left') +
        ' relative group w-full text-left'

    const content = (
        <>
            {align === 'center' ? (
                <>
                    <div className="section-line" />
                    <div className="section-title">{title}</div>
                    <div className="section-line" />
                </>
            ) : (
                <>
                    <div className="section-title">{title}</div>
                    <div className="section-line" />
                </>
            )}
        </>
    )

    if (onClick) {
        return (
            <button
                type="button"
                onClick={onClick}
                aria-label={`Edit ${title}`}
                className={base}
            >
                {content}
            </button>
        )
    }

    return <div className={base}>{content}</div>
}
