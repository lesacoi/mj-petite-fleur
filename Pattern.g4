grammar Pattern;
// multiplayeurs_pattern: pattern+; ----------------------------------------------------------------
// TODO: pattern: (sequence | synchr_sequence+)+ | mirror_pattern; To accept
// sequence+synchr_sequence --> Voir ligne 63/65 pour cas : 555(6,3) (main 1: 5053 main 2: 0506) ou
// (main 1: 5056 main 2: 0503) si ce cas est accepté.
pattern: (sequence | synchr_sequence+) | mirror_pattern;
mirror_pattern: (sequence | synchr_sequence+) '*';
sequence: (throw+ | multiplex_sequence+ | repeat_sequence+)+;
synchr_sequence:
	'(' (throw+ | multiplex_sequence) ',' (
		throw+
		| multiplex_sequence
	) ')';
repeat_sequence:
	'(' (throw+ | multiplex_sequence+)+ '^' int ')';
	//TODO: add synchr_sequence at repeat_sequence and edit ParserLexerPattern.ts
multiplex_sequence: '[' throw+ ']';
NEWLINE: [\r\n]+ -> skip;
throw: int | c_hand;
c_hand: INT 'x';
int: INT+;
INT: [0-9];