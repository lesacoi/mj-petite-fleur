// Generated from src/parser/Pattern.g4 by ANTLR 4.13.1

import * as antlr from "antlr4ng";
import { Token } from "antlr4ng";


export class PatternLexer extends antlr.Lexer {
    public static readonly T__0 = 1;
    public static readonly T__1 = 2;
    public static readonly T__2 = 3;
    public static readonly T__3 = 4;
    public static readonly T__4 = 5;
    public static readonly T__5 = 6;
    public static readonly T__6 = 7;
    public static readonly T__7 = 8;
    public static readonly NEWLINE = 9;
    public static readonly HAND = 10;
    public static readonly INT = 11;

    public static readonly channelNames = [
        "DEFAULT_TOKEN_CHANNEL", "HIDDEN"
    ];

    public static readonly literalNames = [
        null, "'*'", "'('", "','", "')'", "'^'", "'['", "']'", "'x'"
    ];

    public static readonly symbolicNames = [
        null, null, null, null, null, null, null, null, null, "NEWLINE", 
        "HAND", "INT"
    ];

    public static readonly modeNames = [
        "DEFAULT_MODE",
    ];

    public static readonly ruleNames = [
        "T__0", "T__1", "T__2", "T__3", "T__4", "T__5", "T__6", "T__7", 
        "NEWLINE", "HAND", "INT",
    ];


    public constructor(input: antlr.CharStream) {
        super(input);
        this.interpreter = new antlr.LexerATNSimulator(this, PatternLexer._ATN, PatternLexer.decisionsToDFA, new antlr.PredictionContextCache());
    }

    public get grammarFileName(): string { return "Pattern.g4"; }

    public get literalNames(): (string | null)[] { return PatternLexer.literalNames; }
    public get symbolicNames(): (string | null)[] { return PatternLexer.symbolicNames; }
    public get ruleNames(): string[] { return PatternLexer.ruleNames; }

    public get serializedATN(): number[] { return PatternLexer._serializedATN; }

    public get channelNames(): string[] { return PatternLexer.channelNames; }

    public get modeNames(): string[] { return PatternLexer.modeNames; }

    public static readonly _serializedATN: number[] = [
        4,0,11,50,6,-1,2,0,7,0,2,1,7,1,2,2,7,2,2,3,7,3,2,4,7,4,2,5,7,5,2,
        6,7,6,2,7,7,7,2,8,7,8,2,9,7,9,2,10,7,10,1,0,1,0,1,1,1,1,1,2,1,2,
        1,3,1,3,1,4,1,4,1,5,1,5,1,6,1,6,1,7,1,7,1,8,4,8,41,8,8,11,8,12,8,
        42,1,8,1,8,1,9,1,9,1,10,1,10,0,0,11,1,1,3,2,5,3,7,4,9,5,11,6,13,
        7,15,8,17,9,19,10,21,11,1,0,3,2,0,10,10,13,13,2,0,76,76,82,82,1,
        0,48,57,50,0,1,1,0,0,0,0,3,1,0,0,0,0,5,1,0,0,0,0,7,1,0,0,0,0,9,1,
        0,0,0,0,11,1,0,0,0,0,13,1,0,0,0,0,15,1,0,0,0,0,17,1,0,0,0,0,19,1,
        0,0,0,0,21,1,0,0,0,1,23,1,0,0,0,3,25,1,0,0,0,5,27,1,0,0,0,7,29,1,
        0,0,0,9,31,1,0,0,0,11,33,1,0,0,0,13,35,1,0,0,0,15,37,1,0,0,0,17,
        40,1,0,0,0,19,46,1,0,0,0,21,48,1,0,0,0,23,24,5,42,0,0,24,2,1,0,0,
        0,25,26,5,40,0,0,26,4,1,0,0,0,27,28,5,44,0,0,28,6,1,0,0,0,29,30,
        5,41,0,0,30,8,1,0,0,0,31,32,5,94,0,0,32,10,1,0,0,0,33,34,5,91,0,
        0,34,12,1,0,0,0,35,36,5,93,0,0,36,14,1,0,0,0,37,38,5,120,0,0,38,
        16,1,0,0,0,39,41,7,0,0,0,40,39,1,0,0,0,41,42,1,0,0,0,42,40,1,0,0,
        0,42,43,1,0,0,0,43,44,1,0,0,0,44,45,6,8,0,0,45,18,1,0,0,0,46,47,
        7,1,0,0,47,20,1,0,0,0,48,49,7,2,0,0,49,22,1,0,0,0,2,0,42,1,6,0,0
    ];

    private static __ATN: antlr.ATN;
    public static get _ATN(): antlr.ATN {
        if (!PatternLexer.__ATN) {
            PatternLexer.__ATN = new antlr.ATNDeserializer().deserialize(PatternLexer._serializedATN);
        }

        return PatternLexer.__ATN;
    }


    private static readonly vocabulary = new antlr.Vocabulary(PatternLexer.literalNames, PatternLexer.symbolicNames, []);

    public override get vocabulary(): antlr.Vocabulary {
        return PatternLexer.vocabulary;
    }

    private static readonly decisionsToDFA = PatternLexer._ATN.decisionToState.map( (ds: antlr.DecisionState, index: number) => new antlr.DFA(ds, index) );
}