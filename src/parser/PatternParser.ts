// Generated from Pattern.g4 by ANTLR 4.13.1

import * as antlr from "antlr4ng";
import { Token } from "antlr4ng";

import { PatternListener } from "./PatternListener.js";
import { PatternVisitor } from "./PatternVisitor.js";

// for running tests with parameters, TODO: discuss strategy for typed parameters in CI
// eslint-disable-next-line no-unused-vars
type int = number;


export class PatternParser extends antlr.Parser {
    public static readonly T__0 = 1;
    public static readonly T__1 = 2;
    public static readonly T__2 = 3;
    public static readonly T__3 = 4;
    public static readonly T__4 = 5;
    public static readonly T__5 = 6;
    public static readonly T__6 = 7;
    public static readonly T__7 = 8;
    public static readonly NEWLINE = 9;
    public static readonly INT = 10;
    public static readonly RULE_pattern = 0;
    public static readonly RULE_mirror_pattern = 1;
    public static readonly RULE_sequence = 2;
    public static readonly RULE_schync_sequence = 3;
    public static readonly RULE_multiplex_sequence = 4;
    public static readonly RULE_repeat_sequence = 5;
    public static readonly RULE_throw = 6;
    public static readonly RULE_c_hand = 7;
    public static readonly RULE_int = 8;

    public static readonly literalNames = [
        null, "'*'", "'('", "','", "')'", "'['", "']'", "'^'", "'x'"
    ];

    public static readonly symbolicNames = [
        null, null, null, null, null, null, null, null, null, "NEWLINE", 
        "INT"
    ];
    public static readonly ruleNames = [
        "pattern", "mirror_pattern", "sequence", "schync_sequence", "multiplex_sequence", 
        "repeat_sequence", "throw", "c_hand", "int",
    ];

    public get grammarFileName(): string { return "Pattern.g4"; }
    public get literalNames(): (string | null)[] { return PatternParser.literalNames; }
    public get symbolicNames(): (string | null)[] { return PatternParser.symbolicNames; }
    public get ruleNames(): string[] { return PatternParser.ruleNames; }
    public get serializedATN(): number[] { return PatternParser._serializedATN; }

    protected createFailedPredicateException(predicate?: string, message?: string): antlr.FailedPredicateException {
        return new antlr.FailedPredicateException(this, predicate, message);
    }

    public constructor(input: antlr.TokenStream) {
        super(input);
        this.interpreter = new antlr.ParserATNSimulator(this, PatternParser._ATN, PatternParser.decisionsToDFA, new antlr.PredictionContextCache());
    }
    public pattern(): PatternContext {
        let localContext = new PatternContext(this.context, this.state);
        this.enterRule(localContext, 0, PatternParser.RULE_pattern);
        let _la: number;
        try {
            this.state = 24;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 1, this.context) ) {
            case 1:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 19;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                do {
                    {
                    {
                    this.state = 18;
                    this.sequence();
                    }
                    }
                    this.state = 21;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                } while ((((_la) & ~0x1F) === 0 && ((1 << _la) & 1060) !== 0));
                }
                break;
            case 2:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 23;
                this.mirror_pattern();
                }
                break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public mirror_pattern(): Mirror_patternContext {
        let localContext = new Mirror_patternContext(this.context, this.state);
        this.enterRule(localContext, 2, PatternParser.RULE_mirror_pattern);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 27;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            do {
                {
                {
                this.state = 26;
                this.sequence();
                }
                }
                this.state = 29;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            } while ((((_la) & ~0x1F) === 0 && ((1 << _la) & 1060) !== 0));
            this.state = 31;
            this.match(PatternParser.T__0);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public sequence(): SequenceContext {
        let localContext = new SequenceContext(this.context, this.state);
        this.enterRule(localContext, 4, PatternParser.RULE_sequence);
        try {
            let alternative: number;
            this.state = 41;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 4, this.context) ) {
            case 1:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 34;
                this.errorHandler.sync(this);
                alternative = 1;
                do {
                    switch (alternative) {
                    case 1:
                        {
                        {
                        this.state = 33;
                        this.throw_();
                        }
                        }
                        break;
                    default:
                        throw new antlr.NoViableAltException(this);
                    }
                    this.state = 36;
                    this.errorHandler.sync(this);
                    alternative = this.interpreter.adaptivePredict(this.tokenStream, 3, this.context);
                } while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER);
                }
                break;
            case 2:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 38;
                this.repeat_sequence();
                }
                break;
            case 3:
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 39;
                this.schync_sequence();
                }
                break;
            case 4:
                this.enterOuterAlt(localContext, 4);
                {
                this.state = 40;
                this.multiplex_sequence();
                }
                break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public schync_sequence(): Schync_sequenceContext {
        let localContext = new Schync_sequenceContext(this.context, this.state);
        this.enterRule(localContext, 6, PatternParser.RULE_schync_sequence);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 43;
            this.match(PatternParser.T__1);
            this.state = 50;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case PatternParser.INT:
                {
                this.state = 45;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                do {
                    {
                    {
                    this.state = 44;
                    this.throw_();
                    }
                    }
                    this.state = 47;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                } while (_la === 10);
                }
                break;
            case PatternParser.T__4:
                {
                this.state = 49;
                this.multiplex_sequence();
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
            this.state = 52;
            this.match(PatternParser.T__2);
            this.state = 59;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case PatternParser.INT:
                {
                this.state = 54;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                do {
                    {
                    {
                    this.state = 53;
                    this.throw_();
                    }
                    }
                    this.state = 56;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                } while (_la === 10);
                }
                break;
            case PatternParser.T__4:
                {
                this.state = 58;
                this.multiplex_sequence();
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
            this.state = 61;
            this.match(PatternParser.T__3);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public multiplex_sequence(): Multiplex_sequenceContext {
        let localContext = new Multiplex_sequenceContext(this.context, this.state);
        this.enterRule(localContext, 8, PatternParser.RULE_multiplex_sequence);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 63;
            this.match(PatternParser.T__4);
            this.state = 65;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            do {
                {
                {
                this.state = 64;
                this.throw_();
                }
                }
                this.state = 67;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            } while (_la === 10);
            this.state = 69;
            this.match(PatternParser.T__5);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public repeat_sequence(): Repeat_sequenceContext {
        let localContext = new Repeat_sequenceContext(this.context, this.state);
        this.enterRule(localContext, 10, PatternParser.RULE_repeat_sequence);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 71;
            this.match(PatternParser.T__1);
            this.state = 73;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            do {
                {
                {
                this.state = 72;
                this.throw_();
                }
                }
                this.state = 75;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            } while (_la === 10);
            this.state = 77;
            this.match(PatternParser.T__6);
            this.state = 78;
            this.int();
            this.state = 79;
            this.match(PatternParser.T__3);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public throw_(): ThrowContext {
        let localContext = new ThrowContext(this.context, this.state);
        this.enterRule(localContext, 12, PatternParser.RULE_throw);
        try {
            this.state = 83;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 11, this.context) ) {
            case 1:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 81;
                this.int();
                }
                break;
            case 2:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 82;
                this.c_hand();
                }
                break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public c_hand(): C_handContext {
        let localContext = new C_handContext(this.context, this.state);
        this.enterRule(localContext, 14, PatternParser.RULE_c_hand);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 85;
            this.match(PatternParser.INT);
            this.state = 86;
            this.match(PatternParser.T__7);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public int(): IntContext {
        let localContext = new IntContext(this.context, this.state);
        this.enterRule(localContext, 16, PatternParser.RULE_int);
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 89;
            this.errorHandler.sync(this);
            alternative = 1;
            do {
                switch (alternative) {
                case 1:
                    {
                    {
                    this.state = 88;
                    this.match(PatternParser.INT);
                    }
                    }
                    break;
                default:
                    throw new antlr.NoViableAltException(this);
                }
                this.state = 91;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 12, this.context);
            } while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }

    public static readonly _serializedATN: number[] = [
        4,1,10,94,2,0,7,0,2,1,7,1,2,2,7,2,2,3,7,3,2,4,7,4,2,5,7,5,2,6,7,
        6,2,7,7,7,2,8,7,8,1,0,4,0,20,8,0,11,0,12,0,21,1,0,3,0,25,8,0,1,1,
        4,1,28,8,1,11,1,12,1,29,1,1,1,1,1,2,4,2,35,8,2,11,2,12,2,36,1,2,
        1,2,1,2,3,2,42,8,2,1,3,1,3,4,3,46,8,3,11,3,12,3,47,1,3,3,3,51,8,
        3,1,3,1,3,4,3,55,8,3,11,3,12,3,56,1,3,3,3,60,8,3,1,3,1,3,1,4,1,4,
        4,4,66,8,4,11,4,12,4,67,1,4,1,4,1,5,1,5,4,5,74,8,5,11,5,12,5,75,
        1,5,1,5,1,5,1,5,1,6,1,6,3,6,84,8,6,1,7,1,7,1,7,1,8,4,8,90,8,8,11,
        8,12,8,91,1,8,0,0,9,0,2,4,6,8,10,12,14,16,0,0,99,0,24,1,0,0,0,2,
        27,1,0,0,0,4,41,1,0,0,0,6,43,1,0,0,0,8,63,1,0,0,0,10,71,1,0,0,0,
        12,83,1,0,0,0,14,85,1,0,0,0,16,89,1,0,0,0,18,20,3,4,2,0,19,18,1,
        0,0,0,20,21,1,0,0,0,21,19,1,0,0,0,21,22,1,0,0,0,22,25,1,0,0,0,23,
        25,3,2,1,0,24,19,1,0,0,0,24,23,1,0,0,0,25,1,1,0,0,0,26,28,3,4,2,
        0,27,26,1,0,0,0,28,29,1,0,0,0,29,27,1,0,0,0,29,30,1,0,0,0,30,31,
        1,0,0,0,31,32,5,1,0,0,32,3,1,0,0,0,33,35,3,12,6,0,34,33,1,0,0,0,
        35,36,1,0,0,0,36,34,1,0,0,0,36,37,1,0,0,0,37,42,1,0,0,0,38,42,3,
        10,5,0,39,42,3,6,3,0,40,42,3,8,4,0,41,34,1,0,0,0,41,38,1,0,0,0,41,
        39,1,0,0,0,41,40,1,0,0,0,42,5,1,0,0,0,43,50,5,2,0,0,44,46,3,12,6,
        0,45,44,1,0,0,0,46,47,1,0,0,0,47,45,1,0,0,0,47,48,1,0,0,0,48,51,
        1,0,0,0,49,51,3,8,4,0,50,45,1,0,0,0,50,49,1,0,0,0,51,52,1,0,0,0,
        52,59,5,3,0,0,53,55,3,12,6,0,54,53,1,0,0,0,55,56,1,0,0,0,56,54,1,
        0,0,0,56,57,1,0,0,0,57,60,1,0,0,0,58,60,3,8,4,0,59,54,1,0,0,0,59,
        58,1,0,0,0,60,61,1,0,0,0,61,62,5,4,0,0,62,7,1,0,0,0,63,65,5,5,0,
        0,64,66,3,12,6,0,65,64,1,0,0,0,66,67,1,0,0,0,67,65,1,0,0,0,67,68,
        1,0,0,0,68,69,1,0,0,0,69,70,5,6,0,0,70,9,1,0,0,0,71,73,5,2,0,0,72,
        74,3,12,6,0,73,72,1,0,0,0,74,75,1,0,0,0,75,73,1,0,0,0,75,76,1,0,
        0,0,76,77,1,0,0,0,77,78,5,7,0,0,78,79,3,16,8,0,79,80,5,4,0,0,80,
        11,1,0,0,0,81,84,3,16,8,0,82,84,3,14,7,0,83,81,1,0,0,0,83,82,1,0,
        0,0,84,13,1,0,0,0,85,86,5,10,0,0,86,87,5,8,0,0,87,15,1,0,0,0,88,
        90,5,10,0,0,89,88,1,0,0,0,90,91,1,0,0,0,91,89,1,0,0,0,91,92,1,0,
        0,0,92,17,1,0,0,0,13,21,24,29,36,41,47,50,56,59,67,75,83,91
    ];

    private static __ATN: antlr.ATN;
    public static get _ATN(): antlr.ATN {
        if (!PatternParser.__ATN) {
            PatternParser.__ATN = new antlr.ATNDeserializer().deserialize(PatternParser._serializedATN);
        }

        return PatternParser.__ATN;
    }


    private static readonly vocabulary = new antlr.Vocabulary(PatternParser.literalNames, PatternParser.symbolicNames, []);

    public override get vocabulary(): antlr.Vocabulary {
        return PatternParser.vocabulary;
    }

    private static readonly decisionsToDFA = PatternParser._ATN.decisionToState.map( (ds: antlr.DecisionState, index: number) => new antlr.DFA(ds, index) );
}

export class PatternContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public sequence(): SequenceContext[];
    public sequence(i: number): SequenceContext | null;
    public sequence(i?: number): SequenceContext[] | SequenceContext | null {
        if (i === undefined) {
            return this.getRuleContexts(SequenceContext);
        }

        return this.getRuleContext(i, SequenceContext);
    }
    public mirror_pattern(): Mirror_patternContext | null {
        return this.getRuleContext(0, Mirror_patternContext);
    }
    public override get ruleIndex(): number {
        return PatternParser.RULE_pattern;
    }
    public override enterRule(listener: PatternListener): void {
        if(listener.enterPattern) {
             listener.enterPattern(this);
        }
    }
    public override exitRule(listener: PatternListener): void {
        if(listener.exitPattern) {
             listener.exitPattern(this);
        }
    }
    public override accept<Result>(visitor: PatternVisitor<Result>): Result | null {
        if (visitor.visitPattern) {
            return visitor.visitPattern(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class Mirror_patternContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public sequence(): SequenceContext[];
    public sequence(i: number): SequenceContext | null;
    public sequence(i?: number): SequenceContext[] | SequenceContext | null {
        if (i === undefined) {
            return this.getRuleContexts(SequenceContext);
        }

        return this.getRuleContext(i, SequenceContext);
    }
    public override get ruleIndex(): number {
        return PatternParser.RULE_mirror_pattern;
    }
    public override enterRule(listener: PatternListener): void {
        if(listener.enterMirror_pattern) {
             listener.enterMirror_pattern(this);
        }
    }
    public override exitRule(listener: PatternListener): void {
        if(listener.exitMirror_pattern) {
             listener.exitMirror_pattern(this);
        }
    }
    public override accept<Result>(visitor: PatternVisitor<Result>): Result | null {
        if (visitor.visitMirror_pattern) {
            return visitor.visitMirror_pattern(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class SequenceContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public throw_(): ThrowContext[];
    public throw_(i: number): ThrowContext | null;
    public throw_(i?: number): ThrowContext[] | ThrowContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ThrowContext);
        }

        return this.getRuleContext(i, ThrowContext);
    }
    public repeat_sequence(): Repeat_sequenceContext | null {
        return this.getRuleContext(0, Repeat_sequenceContext);
    }
    public schync_sequence(): Schync_sequenceContext | null {
        return this.getRuleContext(0, Schync_sequenceContext);
    }
    public multiplex_sequence(): Multiplex_sequenceContext | null {
        return this.getRuleContext(0, Multiplex_sequenceContext);
    }
    public override get ruleIndex(): number {
        return PatternParser.RULE_sequence;
    }
    public override enterRule(listener: PatternListener): void {
        if(listener.enterSequence) {
             listener.enterSequence(this);
        }
    }
    public override exitRule(listener: PatternListener): void {
        if(listener.exitSequence) {
             listener.exitSequence(this);
        }
    }
    public override accept<Result>(visitor: PatternVisitor<Result>): Result | null {
        if (visitor.visitSequence) {
            return visitor.visitSequence(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class Schync_sequenceContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public multiplex_sequence(): Multiplex_sequenceContext[];
    public multiplex_sequence(i: number): Multiplex_sequenceContext | null;
    public multiplex_sequence(i?: number): Multiplex_sequenceContext[] | Multiplex_sequenceContext | null {
        if (i === undefined) {
            return this.getRuleContexts(Multiplex_sequenceContext);
        }

        return this.getRuleContext(i, Multiplex_sequenceContext);
    }
    public throw_(): ThrowContext[];
    public throw_(i: number): ThrowContext | null;
    public throw_(i?: number): ThrowContext[] | ThrowContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ThrowContext);
        }

        return this.getRuleContext(i, ThrowContext);
    }
    public override get ruleIndex(): number {
        return PatternParser.RULE_schync_sequence;
    }
    public override enterRule(listener: PatternListener): void {
        if(listener.enterSchync_sequence) {
             listener.enterSchync_sequence(this);
        }
    }
    public override exitRule(listener: PatternListener): void {
        if(listener.exitSchync_sequence) {
             listener.exitSchync_sequence(this);
        }
    }
    public override accept<Result>(visitor: PatternVisitor<Result>): Result | null {
        if (visitor.visitSchync_sequence) {
            return visitor.visitSchync_sequence(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class Multiplex_sequenceContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public throw_(): ThrowContext[];
    public throw_(i: number): ThrowContext | null;
    public throw_(i?: number): ThrowContext[] | ThrowContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ThrowContext);
        }

        return this.getRuleContext(i, ThrowContext);
    }
    public override get ruleIndex(): number {
        return PatternParser.RULE_multiplex_sequence;
    }
    public override enterRule(listener: PatternListener): void {
        if(listener.enterMultiplex_sequence) {
             listener.enterMultiplex_sequence(this);
        }
    }
    public override exitRule(listener: PatternListener): void {
        if(listener.exitMultiplex_sequence) {
             listener.exitMultiplex_sequence(this);
        }
    }
    public override accept<Result>(visitor: PatternVisitor<Result>): Result | null {
        if (visitor.visitMultiplex_sequence) {
            return visitor.visitMultiplex_sequence(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class Repeat_sequenceContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public int(): IntContext {
        return this.getRuleContext(0, IntContext)!;
    }
    public throw_(): ThrowContext[];
    public throw_(i: number): ThrowContext | null;
    public throw_(i?: number): ThrowContext[] | ThrowContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ThrowContext);
        }

        return this.getRuleContext(i, ThrowContext);
    }
    public override get ruleIndex(): number {
        return PatternParser.RULE_repeat_sequence;
    }
    public override enterRule(listener: PatternListener): void {
        if(listener.enterRepeat_sequence) {
             listener.enterRepeat_sequence(this);
        }
    }
    public override exitRule(listener: PatternListener): void {
        if(listener.exitRepeat_sequence) {
             listener.exitRepeat_sequence(this);
        }
    }
    public override accept<Result>(visitor: PatternVisitor<Result>): Result | null {
        if (visitor.visitRepeat_sequence) {
            return visitor.visitRepeat_sequence(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ThrowContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public int(): IntContext | null {
        return this.getRuleContext(0, IntContext);
    }
    public c_hand(): C_handContext | null {
        return this.getRuleContext(0, C_handContext);
    }
    public override get ruleIndex(): number {
        return PatternParser.RULE_throw;
    }
    public override enterRule(listener: PatternListener): void {
        if(listener.enterThrow) {
             listener.enterThrow(this);
        }
    }
    public override exitRule(listener: PatternListener): void {
        if(listener.exitThrow) {
             listener.exitThrow(this);
        }
    }
    public override accept<Result>(visitor: PatternVisitor<Result>): Result | null {
        if (visitor.visitThrow) {
            return visitor.visitThrow(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class C_handContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public INT(): antlr.TerminalNode {
        return this.getToken(PatternParser.INT, 0)!;
    }
    public override get ruleIndex(): number {
        return PatternParser.RULE_c_hand;
    }
    public override enterRule(listener: PatternListener): void {
        if(listener.enterC_hand) {
             listener.enterC_hand(this);
        }
    }
    public override exitRule(listener: PatternListener): void {
        if(listener.exitC_hand) {
             listener.exitC_hand(this);
        }
    }
    public override accept<Result>(visitor: PatternVisitor<Result>): Result | null {
        if (visitor.visitC_hand) {
            return visitor.visitC_hand(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class IntContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public INT(): antlr.TerminalNode[];
    public INT(i: number): antlr.TerminalNode | null;
    public INT(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(PatternParser.INT);
    	} else {
    		return this.getToken(PatternParser.INT, i);
    	}
    }
    public override get ruleIndex(): number {
        return PatternParser.RULE_int;
    }
    public override enterRule(listener: PatternListener): void {
        if(listener.enterInt) {
             listener.enterInt(this);
        }
    }
    public override exitRule(listener: PatternListener): void {
        if(listener.exitInt) {
             listener.exitInt(this);
        }
    }
    public override accept<Result>(visitor: PatternVisitor<Result>): Result | null {
        if (visitor.visitInt) {
            return visitor.visitInt(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
