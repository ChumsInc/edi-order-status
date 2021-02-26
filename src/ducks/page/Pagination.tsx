import React from "react";
import classNames from "classnames";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from '../index';
import {setPage} from "./index";


const PAGE_LABELS = {
    prev: '‹',
    ellipsis: '…',
    next: '›',
};

interface CurrentPageButton {
    page: number,
}

const CurrentPageButton: React.FC<CurrentPageButton> = ({page}) => (
    <li className="page-item active">
        <span className="page-link">{page}</span>
    </li>
)

interface PageButton {
    page: number,
    label?: string,
    disabled?: boolean,
    onClick: (page: number) => void,
    isCurrent?: boolean,
}

const PageButton: React.FC<PageButton> = ({page, label, disabled, onClick, isCurrent = false}) => {
    if (isCurrent) {
        return (<CurrentPageButton page={page}/>);
    }

    const handleClick = (ev: React.MouseEvent) => {
        ev.preventDefault();
        onClick(page);
    }

    return (
        <li className={classNames("page-item", {disabled})}>
            <a href="#" className="page-link" onClick={handleClick}>{label || page}</a>
        </li>
    )
}


interface Pagination {
    pages: number,
    maxButtons?: number,
}

const Pagination: React.FC<Pagination> = ({pages, maxButtons = 9}) => {
    const {page} = useSelector((state: RootState) => state.page);
    const dispatch = useDispatch();
    const onClickPage = (page: number) => dispatch(setPage(page));

    if (page > pages && page > 1) {
        console.log({page, pages});
        onClickPage(1);
    }
    const hasMore = pages > maxButtons;
    const maxPageButtons = pages > maxButtons ? maxButtons - 2 : maxButtons;

    let renderPages = [];
    const pageRange = Math.floor(maxPageButtons / 2);
    const beforeRender = Math.min(page - pageRange, pages - maxPageButtons);
    const afterRender = Math.max(page + pageRange, maxPageButtons);
    const firstEllipsis = [];
    const lastEllipsis = [];
    for (let i = 2; i < pages; i += 1) {
        if (i <= beforeRender) {
            firstEllipsis.push(i);
        } else if (i < afterRender) {
            renderPages.push(i);
        } else {
            lastEllipsis.push(i);
        }
    }


    return (
        <nav aria-label="Page Navigation">
            <label>Page</label>
            <ul className="pagination pagination-sm">
                {hasMore &&
                <PageButton page={page - 1} label={PAGE_LABELS.prev} onClick={onClickPage} disabled={page <= 1}/>}
                <PageButton page={1} onClick={onClickPage} isCurrent={page === 1}/>
                {hasMore && firstEllipsis.length === 1 && (
                    <PageButton page={firstEllipsis[0]} onClick={onClickPage}/>
                )}
                {hasMore && firstEllipsis.length > 1 && (
                    <PageButton page={0} label={PAGE_LABELS.ellipsis} onClick={onClickPage} disabled/>
                )}
                {renderPages.map(p => <PageButton key={p} page={p} onClick={onClickPage} isCurrent={page === p}/>)}
                {hasMore && lastEllipsis.length === 1 && (
                    <PageButton page={lastEllipsis[0]} onClick={onClickPage}/>
                )}
                {hasMore && lastEllipsis.length > 1 && (
                    <PageButton page={0} label={PAGE_LABELS.ellipsis} disabled={true} onClick={onClickPage}/>
                )}
                {pages > 1 && (
                    <PageButton page={pages} isCurrent={page === pages} onClick={onClickPage}/>
                )}
                {hasMore && (
                    <PageButton page={page + 1} label={PAGE_LABELS.next} onClick={onClickPage}
                                disabled={page === pages}/>
                )}
            </ul>
        </nav>
    )
}

export default Pagination;
