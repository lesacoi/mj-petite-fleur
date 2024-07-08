grammar Pattern;
// multiplayeurs_pattern: pattern+; ----------------------------------------------------------------
// TODO: pattern: (sequence | synchr_sequence+)+ | mirror_pattern; To accept
// sequence+synchr_sequence
pattern: (sequence | synchr_sequence+) | mirror_pattern;
mirror_pattern: (sequence | synchr_sequence+) '*';
sequence: (throw+ | multiplex_sequence+ | repeat_sequence+)+;
synchr_sequence:
	'(' (throw+ | multiplex_sequence) ',' (
		throw+
		| multiplex_sequence
	) ')';
repeat_sequence: '(' (throw+ | multiplex_sequence+) '^' int ')';
//TODO: add synchr_sequence and edit ParserLexerPattern.ts
multiplex_sequence: '[' throw+ ']';
NEWLINE: [\r\n]+ -> skip;
throw: int | c_hand;
c_hand: INT 'x';
int: INT+;
INT: [0-9];