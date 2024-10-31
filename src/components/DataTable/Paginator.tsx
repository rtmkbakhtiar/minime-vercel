import React, { useState } from 'react';

import { cn } from '@/lib/utils';

import ArrowLeft from '../../../public/images/icons/arrow-left.svg';

export const BreakView = ({
	className,
	breakHandler
}: { className?: string; breakHandler?: () => void; }) => {
	return (
		<button
			className={ cn('cursor-pointer text-gray-500 text-sm text-center font-medium', className) }
			onClick={ breakHandler }
		>
			...
		</button>
	);
};

export type PaginationType = 'prev' | 'next';

type PaginatorProps = {
	pageRangeDisplayed?: number;
	marginPagesDisplayed?: number;
	initialPage?: number;
	totalPage?: number;
	breakClassName?: string;
	onPageChange?: (idx: number, type?: PaginationType) => void; // eslint-disable-line no-unused-vars
	disabledNext?: boolean;
};

const Paginator = ({
	initialPage = 0,
	totalPage = 1,
	onPageChange,
	disabledNext
}: PaginatorProps) => {
	const [selected, setSelected] = useState<number>(initialPage !== 0 ? initialPage - 1 : 0);

	const callCallback = (selectedItem: number, type?: PaginationType) => {
		if (onPageChange && typeof onPageChange === 'function') {
			onPageChange(selectedItem, type);
		}
	};

	const handlePageChange = (nextSelected: number, type?: PaginationType) => {
		if (selected !== nextSelected) {
			setSelected(nextSelected);

			// Call the callback with the new selected item:
			callCallback(nextSelected, type || (nextSelected > selected ? 'next' : 'prev'));
		}
	};

	const handleClick = (nextSelectedPage?: number, type?: PaginationType) => {
		if (nextSelectedPage !== undefined) {
			handlePageChange(nextSelectedPage, type);
		}
	};

	const handlePreviousPage = () => {
		handleClick(selected > 0 ? selected - 1 : undefined, 'prev');
	};

	const handleNextPage = () => {
		handleClick(!disabledNext || (selected < totalPage - 1) ? selected + 1 : undefined, 'next');
	};

	// const handlePageSelected = (currentSelected: number) => {
	// 	if (selected === currentSelected) {
	// 		handleClick();
	// 		return;
	// 	}

	// 	handleClick(currentSelected);
	// };

	// const getForwardJump = () => {
	// 	const forwardJump = selected + pageRangeDisplayed;

	// 	return forwardJump >= totalPage ? totalPage - 1 : forwardJump;
	// };

	// const getBackwardJump = () => {
	// 	const backwardJump = selected - pageRangeDisplayed;

	// 	return backwardJump < 0 ? 0 : backwardJump;
	// };

	// const handleBreakClick = (index: number) => {
	// 	handleClick(selected < index ? getForwardJump() : getBackwardJump());
	// };

	// const getPageElement = (index: number) => {
	// 	const page = index + 1;

	// 	return (
	// 		<button
	// 			key={ index }
	// 			onClick={ () => handlePageSelected(index) }
	// 			aria-current='page'
	// 			className={ cn(
	// 				'focus:ring-0 focus:outline-none relative inline-flex items-center justify-center w-6 h-6 lg:w-10 lg:h-10 text-xs lg:text-sm font-medium rounded-full',
	// 				selected === index
	// 					? 'bg-purple-100 text-purple-500 z-10'
	// 					: 'bg-white text-gray-500 hover:bg-gray-50'
	// 			) }
	// 		>
	// 			{ page }
	// 		</button>
	// 	);
	// };

	// const renderPagination = () => {
	// 	const items = [];

	// 	if (totalPage <= pageRangeDisplayed) {
	// 		for (let index = 0; index < totalPage; index++) {
	// 			items.push(getPageElement(index));
	// 		}
	// 	} else {
	// 		let leftSide = pageRangeDisplayed / 2;
	// 		let rightSide = pageRangeDisplayed - leftSide;

	// 		if (selected > totalPage - pageRangeDisplayed / 2) {
	// 			rightSide = totalPage - selected;
	// 			leftSide = pageRangeDisplayed - rightSide;
	// 		} else if (selected < pageRangeDisplayed / 2) {
	// 			leftSide = selected;
	// 			rightSide = pageRangeDisplayed - leftSide;
	// 		}

	// 		const createPageView = (index: number) => getPageElement(index);
	// 		let breakView;

	// 		const pagesBreaking: {
	// 			type: string,
	// 			index: number,
	// 			display: React.JSX.Element,
	// 		}[] = [];

	// 		for (let index = 0; index < totalPage; index++) {
	// 			const page = index + 1;

	// 			// Left side
	// 			if (page <= marginPagesDisplayed) {
	// 				pagesBreaking.push({
	// 					type: 'page',
	// 					index,
	// 					display: createPageView(index),
	// 				});

	// 				continue;
	// 			}

	// 			// Right side
	// 			if (page > totalPage - marginPagesDisplayed) {
	// 				pagesBreaking.push({
	// 					type: 'page',
	// 					index,
	// 					display: createPageView(index),
	// 				});
	// 				continue;
	// 			}

	// 			const adjustedRightSide = selected === 0 && pageRangeDisplayed > 1
	// 				? rightSide - 1
	// 				: rightSide;

	// 			// Center part of the pagination
	// 			if (
	// 				index >= selected - leftSide &&
	// 				index <= selected + adjustedRightSide
	// 			) {
	// 				pagesBreaking.push({
	// 					type: 'page',
	// 					index,
	// 					display: createPageView(index),
	// 				});

	// 				continue;
	// 			}

	// 			// if the last item of the current 'items' array is not a break element, add break view.
	// 			if (
	// 				pagesBreaking.length > 0 &&
	// 				pagesBreaking[pagesBreaking.length - 1].display !== breakView &&
	// 				(pageRangeDisplayed > 0 || marginPagesDisplayed > 0)
	// 			) {
	// 				breakView = (
	// 					<BreakView
	// 						key={ index }
	// 						className={ breakClassName }
	// 						breakHandler={ () => handleBreakClick(index) }
	// 					/>
	// 				);

	// 				pagesBreaking.push({
	// 					type: 'break',
	// 					index,
	// 					display: breakView
	// 				});
	// 			}
	// 		}

	// 		// Remove breaks containing one page.
	// 		pagesBreaking.forEach((pageElement, i) => {
	// 			let actualPageElement = pageElement;
	// 			// 1 2 3 4 5 6 7 ... 9 10
	// 			//         |
	// 			// 1 2 ... 4 5 6 7 8 9 10
	// 			//             |
	// 			// The break should be replaced by the page.
	// 			if (
	// 				pageElement.type === 'break' &&
	// 				pagesBreaking[i - 1] &&
	// 				pagesBreaking[i - 1].type === 'page' &&
	// 				pagesBreaking[i + 1] &&
	// 				pagesBreaking[i + 1].type === 'page' &&
	// 				pagesBreaking[i + 1].index - pagesBreaking[i - 1].index <= 2
	// 			) {
	// 				actualPageElement = {
	// 					type: 'page',
	// 					index: pageElement.index,
	// 					display: createPageView(pageElement.index),
	// 				};
	// 			}

	// 			// add the displayed elements
	// 			items.push(actualPageElement.display);
	// 		});
	// 	}

	// 	return items;
	// };

	return (
		<nav
			className='relative flex items-center justify-between p-6 gap-2'
			aria-label='Pagination'>
			<button
				onClick={ handlePreviousPage }
				disabled={ selected === 0 }
				className='focus:ring-0 focus:outline-none flex items-center gap-2 text-gray-500 font-medium text-sm'
			>
				<ArrowLeft className='h-4 w-4 text-gray-500' />
				<span className='max-lg:hidden'>Previous</span>
			</button>

			{ /* <div className='flex items-center gap-2'>
				{ renderPagination() }
			</div> */ }

			<button
				onClick={ handleNextPage }
				disabled={ disabledNext }
				className='focus:ring-0 focus:outline-none flex items-center gap-2 text-gray-500 font-medium text-sm'
			>
				<span className='max-lg:hidden'>Next</span>
				<ArrowLeft className='h-4 w-4 rotate-180 text-gray-500' />
			</button>
		</nav>
	);
};

export default Paginator;