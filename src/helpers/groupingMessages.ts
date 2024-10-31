const groupingMessages = (messages: ChatItem[]) => {
	const groupedMessages = messages.reduce(
		(acc: GroupingChatItem[], curr: ChatItem) => {
			const lastGroup = acc[acc.length - 1];

			if (lastGroup && lastGroup.role === curr.role) {
				lastGroup.contents.push(curr);
			} else {
				acc.push({
					role: curr.role,
					contents: [curr],
				});
			}

			return acc;
		},
		[]
	);

	return groupedMessages;
};

export default groupingMessages;
