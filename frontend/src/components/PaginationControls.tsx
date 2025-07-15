type PaginationControlsProps = {
    next: string | null;
    previous: string | null;
    page: number;
    onPageChange: (newPage: number) => void;
};

export default function PaginationControls({
                                               next,
                                               previous,
                                               page,
                                               onPageChange,
                                           }: PaginationControlsProps) {
    return (
        <div className="pagination-controls">
            <button
                onClick={() => onPageChange(page - 1)}
                disabled={previous === null}
                className="button prev"
            >
                Prev
            </button>
            <button
                onClick={() => onPageChange(page + 1)}
                disabled={next === null}
                className="button next"
            >
                Next
            </button>
        </div>
    );
}
