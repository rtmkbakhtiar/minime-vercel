import React, { useState } from 'react';
import {
	ColumnDef,
	ColumnFiltersState,
	ExpandedState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	Row,
	RowSelectionState,
	SortingState,
	useReactTable,
	VisibilityState,
} from '@tanstack/react-table';

import BarLoader from '../Loader/Bar';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '../Table';

import Paginator, { PaginationType } from './Paginator';

export interface PaginationProps {
	type?: PaginationType;
	pageIndex: number;
}
export interface DataTableProps {
	data: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
	columns: ColumnDef<any, any>[]; // eslint-disable-line @typescript-eslint/no-explicit-any
	defaultColumnVisibility?: Record<string, boolean>;
	renderTableTitle?: () => React.JSX.Element;
	renderExpandableRow?: (subRow?: any[], row?: Row<any>) => React.JSX.Element | null; // eslint-disable-line @typescript-eslint/no-explicit-any, no-unused-vars
	onPaginationChange?: (updatedPagination: PaginationProps) => void; // eslint-disable-line no-unused-vars
	rowCount?: number;
	loading?: boolean;
	disabledNextPagination?: boolean;
}

const DataTable: React.FC<DataTableProps> = ({
	data,
	columns,
	defaultColumnVisibility,
	renderTableTitle,
	renderExpandableRow,
	onPaginationChange,
	loading,
	disabledNextPagination
}) => {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
	const [expanded, setExpanded] = useState<ExpandedState>({});

	const table = useReactTable({
		data,
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		onExpandedChange: setExpanded,
		getSubRows: row => row.subRows,
		getPaginationRowModel: getPaginationRowModel(),
		enableRowSelection: true,
		// ...onPaginationChange && rowCount
		// 	? {
		// 		rowCount: rowCount,
		// 		manualPagination: true,
		// 		onPaginationChange: setPagination
		// 	}
		// 	: { getPaginationRowModel: getPaginationRowModel() },
		state: {
			sorting,
			columnFilters,
			columnVisibility: {
				...columnVisibility,
				...defaultColumnVisibility
			},
			rowSelection,
			expanded,
			// ...onPaginationChange && rowCount
			// 	? {
			// 		pagination: {
			// 			pageIndex: pagination?.pageIndex,
			// 			pageSize: pagination?.pageSize
			// 		}
			// 	} : {}
		},
	});

	const renderRow = (row: Row<any>) => { // eslint-disable-line @typescript-eslint/no-explicit-any
		const renderedRow = (
			<TableRow
				key={ row.id }
				data-state={ row.getIsSelected() && 'selected' }
				{ ...row.getCanExpand()
					? { onClick: () => row.toggleExpanded() }
					: {}
				}
			>
				{ row.getVisibleCells().map(cell => (
					<TableCell key={ cell.id }>
						{ flexRender(
							cell.column.columnDef.cell,
							cell.getContext()
						) }
					</TableCell>
				)) }
			</TableRow>
		);

		if (row.getIsExpanded() && renderExpandableRow) {
			return <React.Fragment key={ `subrows-${ row.id }` }>
				{ renderedRow }
				<TableRow>
					<TableCell
						colSpan={ table.getAllLeafColumns().length }
						className='bg-neutral-white'>
						{ renderExpandableRow(row.originalSubRows, row) }
					</TableCell>
				</TableRow>
			</React.Fragment>;
		} else {
			return renderedRow;
		}
	};

	return (
		<div className='w-full'>
			<div className='rounded-lg border border-gray-200 bg-white overflow-hidden shadow-table'>
				{ renderTableTitle && renderTableTitle() }

				<Table>
					<TableHeader className='bg-gray-50'>
						{ table.getHeaderGroups().map(headerGroup => (
							<TableRow key={ headerGroup.id }>
								{ headerGroup.headers.map(header => {
									return (
										<TableHead key={ header.id }>
											{ header.isPlaceholder
												? null
												: flexRender(
													header.column.columnDef.header,
													header.getContext()
												) }
										</TableHead>
									);
								}) }
							</TableRow>
						)) }
					</TableHeader>
					<TableBody>
						{ table.getRowModel().rows?.length ? (
							<>
								{ table.getRowModel().rows.map(row => renderRow(row)) }
								{ loading && (
									<TableRow>
										<TableCell
											colSpan={ columns.length }
											className='h-full bg-black-primary/5 absolute inset-0'
										>
											<div className='flex h-full w-full justify-center items-center'>
												<BarLoader barClassName='bg-gray-500 w-1.5 h-8' />
											</div>
										</TableCell>
									</TableRow>
								) }
							</>
						) : (
							<TableRow>
								<TableCell
									colSpan={ columns.length }
									className='h-[300px] flex-auto'
								>
									<div className='flex items-center justify-center'>
										{ loading
											? <BarLoader barClassName='bg-gray-500 w-1.5 h-8' />
											: 'No results' }
									</div>
								</TableCell>
							</TableRow>
						) }
					</TableBody>
				</Table>
				<Paginator
					// initialPage={ table.getState().pagination.pageIndex }
					// totalPage={ table.getPageCount() }
					onPageChange={ (pageNumber: number, type?: PaginationType) => {
						if (onPaginationChange) {
							onPaginationChange({
								type,
								pageIndex: pageNumber
							});
						}
						// table.setPageIndex(pageNumber);
					} }
					disabledNext={ disabledNextPagination }
				/>
			</div>
		</div>
	);
};

export default DataTable;