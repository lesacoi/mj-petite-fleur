// Generated from c:/Users/leosailhac/Desktop/mj-petite-fleur/Pattern.g4 by ANTLR 4.13.1

import * as antlr from "antlr4ng";
import { Token } from "antlr4ng";

import { PatternListener } from "./PatternListener.js";
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
    public static readonly RULE_prog = 0;
    public static readonly RULE_pattern = 1;
    public static readonly RULE_mirror_pattern = 2;
    public static readonly RULE_sequence = 3;
    public static readonly RULE_schync_sequence = 4;
    public static readonly RULE_multiplex_sequence = 5;
    public static readonly RULE_repeat_sequence = 6;
    public static readonly RULE_throw = 7;

    public static readonly literalNames = [
        null, "'*'", "'('", "','", "')'", "'['", "']'", "'^'", "'x'"
    ];

    public static readonly symbolicNames = [
        null, null, null, null, null, null, null, null, null, "NEWLINE", 
        "INT"
    ];
    public static readonly ruleNames = [
        "prog", "pattern", "mirror_pattern", "sequence", "schync_sequence", 
        "multiplex_sequence", "repeat_sequence", "throw",
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
    public prog(): ProgContext {
        let localContext = new ProgContext(this.context, this.state);
        this.enterRule(localContext, 0, PatternParser.RULE_prog);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 16;
            this.pattern();
            this.state = 17;
            this.match(PatternParser.EOF);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                localContext.exception = re;
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
    public pattern(): PatternContext {
        let localContext = new PatternContext(this.context, this.state);
        this.enterRule(localContext, 2, PatternParser.RULE_pattern);
        let _la: number;
        try {
            this.state = 25;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 1, this.context) ) {
            case 1:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 20;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                do {
                    {
                    {
                    this.state = 19;
                    this.sequence();
                    }
                    }
                    this.state = 22;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                } while ((((_la) & ~0x1F) === 0 && ((1 << _la) & 1060) !== 0));
                }
                break;
            case 2:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 24;
                this.mirror_pattern();
                }
                break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                localContext.exception = re;
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
        this.enterRule(localContext, 4, PatternParser.RULE_mirror_pattern);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 28;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            do {
                {
                {
                this.state = 27;
                this.sequence();
                }
                }
                this.state = 30;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            } while ((((_la) & ~0x1F) === 0 && ((1 << _la) & 1060) !== 0));
            this.state = 32;
            this.match(PatternParser.T__0);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                localContext.exception = re;
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
        this.enterRule(localContext, 6, PatternParser.RULE_sequence);
        try {
            let alternative: number;
            this.state = 42;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 4, this.context) ) {
            case 1:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 35;
                this.errorHandler.sync(this);
                alternative = 1;
                do {
                    switch (alternative) {
                    case 1:
                        {
                        {
                        this.state = 34;
                        this.throw_();
                        }
                        }
                        break;
                    default:
                        throw new antlr.NoViableAltException(this);
                    }
                    this.state = 37;
                    this.errorHandler.sync(this);
                    alternative = this.interpreter.adaptivePredict(this.tokenStream, 3, this.context);
                } while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER);
                }
                break;
            case 2:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 39;
                this.repeat_sequence();
                }
                break;
            case 3:
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 40;
                this.schync_sequence();
                }
                break;
            case 4:
                this.enterOuterAlt(localContext, 4);
                {
                this.state = 41;
                this.multiplex_sequence();
                }
                break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                localContext.exception = re;
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
        this.enterRule(localContext, 8, PatternParser.RULE_schync_sequence);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 44;
            this.match(PatternParser.T__1);
            this.state = 51;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case PatternParser.INT:
                {
                this.state = 46;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                do {
                    {
                    {
                    this.state = 45;
                    this.throw_();
                    }
                    }
                    this.state = 48;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                } while (_la === 10);
                }
                break;
            case PatternParser.T__4:
                {
                this.state = 50;
                this.multiplex_sequence();
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
            this.state = 53;
            this.match(PatternParser.T__2);
            this.state = 60;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case PatternParser.INT:
                {
                this.state = 55;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                do {
                    {
                    {
                    this.state = 54;
                    this.throw_();
                    }
                    }
                    this.state = 57;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                } while (_la === 10);
                }
                break;
            case PatternParser.T__4:
                {
                this.state = 59;
                this.multiplex_sequence();
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
            this.state = 62;
            this.match(PatternParser.T__3);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                localContext.exception = re;
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
        this.enterRule(localContext, 10, PatternParser.RULE_multiplex_sequence);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 64;
            this.match(PatternParser.T__4);
            this.state = 66;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            do {
                {
                {
                this.state = 65;
                this.throw_();
                }
                }
                this.state = 68;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            } while (_la === 10);
            this.state = 70;
            this.match(PatternParser.T__5);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                localContext.exception = re;
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
        this.enterRule(localContext, 12, PatternParser.RULE_repeat_sequence);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 72;
            this.match(PatternParser.T__1);
            this.state = 74;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            do {
                {
                {
                this.state = 73;
                this.throw_();
                }
                }
                this.state = 76;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            } while (_la === 10);
            this.state = 78;
            this.match(PatternParser.T__3);
            this.state = 79;
            this.match(PatternParser.T__6);
            this.state = 80;
            this.match(PatternParser.INT);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                localContext.exception = re;
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
        this.enterRule(localContext, 14, PatternParser.RULE_throw);
        try {
            let alternative: number;
            this.state = 89;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 12, this.context) ) {
            case 1:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 83;
                this.errorHandler.sync(this);
                alternative = 1;
                do {
                    switch (alternative) {
                    case 1:
                        {
                        {
                        this.state = 82;
                        this.match(PatternParser.INT);
                        }
                        }
                        break;
                    default:
                        throw new antlr.NoViableAltException(this);
                    }
                    this.state = 85;
                    this.errorHandler.sync(this);
                    alternative = this.interpreter.adaptivePredict(this.tokenStream, 11, this.context);
                } while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER);
                }
                break;
            case 2:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 87;
                this.match(PatternParser.INT);
                this.state = 88;
                this.match(PatternParser.T__7);
                }
                break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                localContext.exception = re;
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
        4,1,10,92,2,0,7,0,2,1,7,1,2,2,7,2,2,3,7,3,2,4,7,4,2,5,7,5,2,6,7,
        6,2,7,7,7,1,0,1,0,1,0,1,1,4,1,21,8,1,11,1,12,1,22,1,1,3,1,26,8,1,
        1,2,4,2,29,8,2,11,2,12,2,30,1,2,1,2,1,3,4,3,36,8,3,11,3,12,3,37,
        1,3,1,3,1,3,3,3,43,8,3,1,4,1,4,4,4,47,8,4,11,4,12,4,48,1,4,3,4,52,
        8,4,1,4,1,4,4,4,56,8,4,11,4,12,4,57,1,4,3,4,61,8,4,1,4,1,4,1,5,1,
        5,4,5,67,8,5,11,5,12,5,68,1,5,1,5,1,6,1,6,4,6,75,8,6,11,6,12,6,76,
        1,6,1,6,1,6,1,6,1,7,4,7,84,8,7,11,7,12,7,85,1,7,1,7,3,7,90,8,7,1,
        7,0,0,8,0,2,4,6,8,10,12,14,0,0,98,0,16,1,0,0,0,2,25,1,0,0,0,4,28,
        1,0,0,0,6,42,1,0,0,0,8,44,1,0,0,0,10,64,1,0,0,0,12,72,1,0,0,0,14,
        89,1,0,0,0,16,17,3,2,1,0,17,18,5,0,0,1,18,1,1,0,0,0,19,21,3,6,3,
        0,20,19,1,0,0,0,21,22,1,0,0,0,22,20,1,0,0,0,22,23,1,0,0,0,23,26,
        1,0,0,0,24,26,3,4,2,0,25,20,1,0,0,0,25,24,1,0,0,0,26,3,1,0,0,0,27,
        29,3,6,3,0,28,27,1,0,0,0,29,30,1,0,0,0,30,28,1,0,0,0,30,31,1,0,0,
        0,31,32,1,0,0,0,32,33,5,1,0,0,33,5,1,0,0,0,34,36,3,14,7,0,35,34,
        1,0,0,0,36,37,1,0,0,0,37,35,1,0,0,0,37,38,1,0,0,0,38,43,1,0,0,0,
        39,43,3,12,6,0,40,43,3,8,4,0,41,43,3,10,5,0,42,35,1,0,0,0,42,39,
        1,0,0,0,42,40,1,0,0,0,42,41,1,0,0,0,43,7,1,0,0,0,44,51,5,2,0,0,45,
        47,3,14,7,0,46,45,1,0,0,0,47,48,1,0,0,0,48,46,1,0,0,0,48,49,1,0,
        0,0,49,52,1,0,0,0,50,52,3,10,5,0,51,46,1,0,0,0,51,50,1,0,0,0,52,
        53,1,0,0,0,53,60,5,3,0,0,54,56,3,14,7,0,55,54,1,0,0,0,56,57,1,0,
        0,0,57,55,1,0,0,0,57,58,1,0,0,0,58,61,1,0,0,0,59,61,3,10,5,0,60,
        55,1,0,0,0,60,59,1,0,0,0,61,62,1,0,0,0,62,63,5,4,0,0,63,9,1,0,0,
        0,64,66,5,5,0,0,65,67,3,14,7,0,66,65,1,0,0,0,67,68,1,0,0,0,68,66,
        1,0,0,0,68,69,1,0,0,0,69,70,1,0,0,0,70,71,5,6,0,0,71,11,1,0,0,0,
        72,74,5,2,0,0,73,75,3,14,7,0,74,73,1,0,0,0,75,76,1,0,0,0,76,74,1,
        0,0,0,76,77,1,0,0,0,77,78,1,0,0,0,78,79,5,4,0,0,79,80,5,7,0,0,80,
        81,5,10,0,0,81,13,1,0,0,0,82,84,5,10,0,0,83,82,1,0,0,0,84,85,1,0,
        0,0,85,83,1,0,0,0,85,86,1,0,0,0,86,90,1,0,0,0,87,88,5,10,0,0,88,
        90,5,8,0,0,89,83,1,0,0,0,89,87,1,0,0,0,90,15,1,0,0,0,13,22,25,30,
        37,42,48,51,57,60,68,76,85,89
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

export class ProgContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public pattern(): PatternContext {
        return this.getRuleContext(0, PatternContext)!;
    }
    public EOF(): antlr.TerminalNode {
        return this.getToken(PatternParser.EOF, 0)!;
    }
    public override get ruleIndex(): number {
        return PatternParser.RULE_prog;
    }
    public override enterRule(listener: PatternListener): void {
        if(listener.enterProg) {
             listener.enterProg(this);
        }
    }
    public override exitRule(listener: PatternListener): void {
        if(listener.exitProg) {
             listener.exitProg(this);
        }
    }
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
}


export class Repeat_sequenceContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public INT(): antlr.TerminalNode {
        return this.getToken(PatternParser.INT, 0)!;
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
}


export class ThrowContext extends antlr.ParserRuleContext {
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
}
