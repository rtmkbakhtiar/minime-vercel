import React, { useRef } from 'react';
import { BottomSheet, BottomSheetRef } from 'react-spring-bottom-sheet';

type BottomSheetProps = {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	children: React.ReactNode;
	header?: JSX.Element;
	footer?: JSX.Element;
	sticky?: boolean;
};

const CustomBottomSheet: React.FC<BottomSheetProps> = ({
	open,
	setOpen,
	children,
	header,
	footer,
	sticky
}) => {
	const sheetRef = useRef<BottomSheetRef | null>(null);

	return (
		<BottomSheet
			open={ open }
			ref={ sheetRef }
			onDismiss={ () => setOpen(false) }
			defaultSnap={ sticky
				? ({ snapPoints, lastSnap }) =>
					lastSnap ?? Math.min(...snapPoints)
				: undefined }
			snapPoints={ sticky
				? ({ maxHeight }) => [maxHeight - maxHeight / 5, maxHeight * 0.6]
				: ({ minHeight }) => minHeight }
			header={ header }
			footer={ footer }
		>
			{ children }
		</BottomSheet>
	);
};

export default CustomBottomSheet;
