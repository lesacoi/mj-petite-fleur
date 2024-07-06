grammar Pattern;
pattern: (
		sequence+
		| repeat_sequence+
		| schync_sequence+
		| multiplex_sequence+
	)
	| mirror_pattern;
mirror_pattern: (
		sequence+
		| repeat_sequence+
		| schync_sequence+
		| multiplex_sequence+
	) '*';
sequence: throw+;

schync_sequence:
	'(' (throw+ | multiplex_sequence) ',' (
		throw+
		| multiplex_sequence
	) ')';
multiplex_sequence: '[' throw+ ']';
repeat_sequence: '(' throw+ '^' int ')';
NEWLINE: [\r\n]+ -> skip;
throw: int | c_hand;
c_hand: INT 'x';
int: INT+;
INT: [0-9];