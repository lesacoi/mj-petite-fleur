grammar Pattern;
prog: pattern EOF;
pattern: sequence+ | mirror_pattern;
mirror_pattern: sequence+ '*';
sequence:
	throw+
	| repeat_sequence
	| schync_sequence
	| multiplex_sequence;

schync_sequence:
	'(' (throw+ | multiplex_sequence) ',' (
		throw+
		| multiplex_sequence
	) ')';
multiplex_sequence: '[' throw+ ']';
repeat_sequence: '(' throw+ ')' '^' INT;
NEWLINE: [\r\n]+ -> skip;
throw: INT+ | INT 'x';
INT: [0-9];