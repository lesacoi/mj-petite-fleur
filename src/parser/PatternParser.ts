// Generated from src/parser/Pattern.g4 by ANTLR 4.13.1

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
    public static readonly HAND = 10;
    public static readonly INT = 11;
    public static readonly RULE_pattern = 0;
    public static readonly RULE_mirror_pattern = 1;
    public static readonly RULE_sequence = 2;
    public static readonly RULE_synchr_sequence = 3;
    public static readonly RULE_repeat_sequence = 4;
    public static readonly RULE_multiplex_sequence = 5;
    public static readonly RULE_throw = 6;
    public static readonly RULE_c_hand = 7;
    public static readonly RULE_int = 8;

    public static readonly literalNames = [
        null, "'*'", "'('", "','", "')'", "'^'", "'['", "']'", "'x'"
    ];

    public static readonly symbolicNames = [
        null, null, null, null, null, null, null, null, null, "NEWLINE", 
        "HAND", "INT"
    ];
    public static readonly ruleNames = [
        "pattern", "mirror_pattern", "sequence", "synchr_sequence", "repeat_sequence", 
        "multiplex_sequence", "throw", "c_hand", "int",
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
            this.state = 25;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 2, this.context) ) {
            case 1:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 20;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                do {
                    {
                    this.state = 20;
                    this.errorHandler.sync(this);
                    switch (this.interpreter.adaptivePredict(this.tokenStream, 0, this.context) ) {
                    case 1:
                        {
                        this.state = 18;
                        this.sequence();
                        }
                        break;
                    case 2:
                        {
                        this.state = 19;
                        this.synchr_sequence();
                        }
                        break;
                    }
                    }
                    this.state = 22;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                } while ((((_la) & ~0x1F) === 0 && ((1 << _la) & 2116) !== 0));
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
            this.state = 29;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            do {
                {
                this.state = 29;
                this.errorHandler.sync(this);
                switch (this.interpreter.adaptivePredict(this.tokenStream, 3, this.context) ) {
                case 1:
                    {
                    this.state = 27;
                    this.sequence();
                    }
                    break;
                case 2:
                    {
                    this.state = 28;
                    this.synchr_sequence();
                    }
                    break;
                }
                }
                this.state = 31;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            } while ((((_la) & ~0x1F) === 0 && ((1 << _la) & 2116) !== 0));
            this.state = 33;
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
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 50;
            this.errorHandler.sync(this);
            alternative = 1;
            do {
                switch (alternative) {
                case 1:
                    {
                    this.state = 50;
                    this.errorHandler.sync(this);
                    switch (this.tokenStream.LA(1)) {
                    case PatternParser.INT:
                        {
                        this.state = 36;
                        this.errorHandler.sync(this);
                        alternative = 1;
                        do {
                            switch (alternative) {
                            case 1:
                                {
                                {
                                this.state = 35;
                                this.throw_();
                                }
                                }
                                break;
                            default:
                                throw new antlr.NoViableAltException(this);
                            }
                            this.state = 38;
                            this.errorHandler.sync(this);
                            alternative = this.interpreter.adaptivePredict(this.tokenStream, 5, this.context);
                        } while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER);
                        }
                        break;
                    case PatternParser.T__5:
                        {
                        this.state = 41;
                        this.errorHandler.sync(this);
                        alternative = 1;
                        do {
                            switch (alternative) {
                            case 1:
                                {
                                {
                                this.state = 40;
                                this.multiplex_sequence();
                                }
                                }
                                break;
                            default:
                                throw new antlr.NoViableAltException(this);
                            }
                            this.state = 43;
                            this.errorHandler.sync(this);
                            alternative = this.interpreter.adaptivePredict(this.tokenStream, 6, this.context);
                        } while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER);
                        }
                        break;
                    case PatternParser.T__1:
                        {
                        this.state = 46;
                        this.errorHandler.sync(this);
                        alternative = 1;
                        do {
                            switch (alternative) {
                            case 1:
                                {
                                {
                                this.state = 45;
                                this.repeat_sequence();
                                }
                                }
                                break;
                            default:
                                throw new antlr.NoViableAltException(this);
                            }
                            this.state = 48;
                            this.errorHandler.sync(this);
                            alternative = this.interpreter.adaptivePredict(this.tokenStream, 7, this.context);
                        } while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER);
                        }
                        break;
                    default:
                        throw new antlr.NoViableAltException(this);
                    }
                    }
                    break;
                default:
                    throw new antlr.NoViableAltException(this);
                }
                this.state = 52;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 9, this.context);
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
    public synchr_sequence(): Synchr_sequenceContext {
        let localContext = new Synchr_sequenceContext(this.context, this.state);
        this.enterRule(localContext, 6, PatternParser.RULE_synchr_sequence);
        let _la: number;
        try {
            this.state = 96;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 18, this.context) ) {
            case 1:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 54;
                this.match(PatternParser.T__1);
                this.state = 61;
                this.errorHandler.sync(this);
                switch (this.tokenStream.LA(1)) {
                case PatternParser.INT:
                    {
                    this.state = 56;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                    do {
                        {
                        {
                        this.state = 55;
                        this.throw_();
                        }
                        }
                        this.state = 58;
                        this.errorHandler.sync(this);
                        _la = this.tokenStream.LA(1);
                    } while (_la === 11);
                    }
                    break;
                case PatternParser.T__5:
                    {
                    this.state = 60;
                    this.multiplex_sequence();
                    }
                    break;
                default:
                    throw new antlr.NoViableAltException(this);
                }
                this.state = 63;
                this.match(PatternParser.T__2);
                this.state = 70;
                this.errorHandler.sync(this);
                switch (this.tokenStream.LA(1)) {
                case PatternParser.INT:
                    {
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
                    } while (_la === 11);
                    }
                    break;
                case PatternParser.T__5:
                    {
                    this.state = 69;
                    this.multiplex_sequence();
                    }
                    break;
                default:
                    throw new antlr.NoViableAltException(this);
                }
                this.state = 72;
                this.match(PatternParser.T__3);
                }
                break;
            case 2:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 74;
                this.match(PatternParser.T__1);
                this.state = 81;
                this.errorHandler.sync(this);
                switch (this.tokenStream.LA(1)) {
                case PatternParser.INT:
                    {
                    this.state = 76;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                    do {
                        {
                        {
                        this.state = 75;
                        this.throw_();
                        }
                        }
                        this.state = 78;
                        this.errorHandler.sync(this);
                        _la = this.tokenStream.LA(1);
                    } while (_la === 11);
                    }
                    break;
                case PatternParser.T__5:
                    {
                    this.state = 80;
                    this.multiplex_sequence();
                    }
                    break;
                default:
                    throw new antlr.NoViableAltException(this);
                }
                this.state = 83;
                this.match(PatternParser.T__2);
                this.state = 90;
                this.errorHandler.sync(this);
                switch (this.tokenStream.LA(1)) {
                case PatternParser.INT:
                    {
                    this.state = 85;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                    do {
                        {
                        {
                        this.state = 84;
                        this.throw_();
                        }
                        }
                        this.state = 87;
                        this.errorHandler.sync(this);
                        _la = this.tokenStream.LA(1);
                    } while (_la === 11);
                    }
                    break;
                case PatternParser.T__5:
                    {
                    this.state = 89;
                    this.multiplex_sequence();
                    }
                    break;
                default:
                    throw new antlr.NoViableAltException(this);
                }
                this.state = 92;
                this.match(PatternParser.T__3);
                this.state = 93;
                this.match(PatternParser.HAND);
                this.state = 94;
                this.match(PatternParser.INT);
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
    public repeat_sequence(): Repeat_sequenceContext {
        let localContext = new Repeat_sequenceContext(this.context, this.state);
        this.enterRule(localContext, 8, PatternParser.RULE_repeat_sequence);
        let _la: number;
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 98;
            this.match(PatternParser.T__1);
            this.state = 109;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            do {
                {
                this.state = 109;
                this.errorHandler.sync(this);
                switch (this.tokenStream.LA(1)) {
                case PatternParser.INT:
                    {
                    this.state = 100;
                    this.errorHandler.sync(this);
                    alternative = 1;
                    do {
                        switch (alternative) {
                        case 1:
                            {
                            {
                            this.state = 99;
                            this.throw_();
                            }
                            }
                            break;
                        default:
                            throw new antlr.NoViableAltException(this);
                        }
                        this.state = 102;
                        this.errorHandler.sync(this);
                        alternative = this.interpreter.adaptivePredict(this.tokenStream, 19, this.context);
                    } while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER);
                    }
                    break;
                case PatternParser.T__5:
                    {
                    this.state = 105;
                    this.errorHandler.sync(this);
                    alternative = 1;
                    do {
                        switch (alternative) {
                        case 1:
                            {
                            {
                            this.state = 104;
                            this.multiplex_sequence();
                            }
                            }
                            break;
                        default:
                            throw new antlr.NoViableAltException(this);
                        }
                        this.state = 107;
                        this.errorHandler.sync(this);
                        alternative = this.interpreter.adaptivePredict(this.tokenStream, 20, this.context);
                    } while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER);
                    }
                    break;
                default:
                    throw new antlr.NoViableAltException(this);
                }
                }
                this.state = 111;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            } while (_la === 6 || _la === 11);
            this.state = 113;
            this.match(PatternParser.T__4);
            this.state = 114;
            this.int();
            this.state = 115;
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
        this.enterRule(localContext, 10, PatternParser.RULE_multiplex_sequence);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 117;
            this.match(PatternParser.T__5);
            this.state = 119;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            do {
                {
                {
                this.state = 118;
                this.throw_();
                }
                }
                this.state = 121;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            } while (_la === 11);
            this.state = 123;
            this.match(PatternParser.T__6);
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
            this.state = 127;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 24, this.context) ) {
            case 1:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 125;
                this.int();
                }
                break;
            case 2:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 126;
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
            this.state = 129;
            this.match(PatternParser.INT);
            this.state = 130;
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
            this.state = 133;
            this.errorHandler.sync(this);
            alternative = 1;
            do {
                switch (alternative) {
                case 1:
                    {
                    {
                    this.state = 132;
                    this.match(PatternParser.INT);
                    }
                    }
                    break;
                default:
                    throw new antlr.NoViableAltException(this);
                }
                this.state = 135;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 25, this.context);
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
        4,1,11,138,2,0,7,0,2,1,7,1,2,2,7,2,2,3,7,3,2,4,7,4,2,5,7,5,2,6,7,
        6,2,7,7,7,2,8,7,8,1,0,1,0,4,0,21,8,0,11,0,12,0,22,1,0,3,0,26,8,0,
        1,1,1,1,4,1,30,8,1,11,1,12,1,31,1,1,1,1,1,2,4,2,37,8,2,11,2,12,2,
        38,1,2,4,2,42,8,2,11,2,12,2,43,1,2,4,2,47,8,2,11,2,12,2,48,4,2,51,
        8,2,11,2,12,2,52,1,3,1,3,4,3,57,8,3,11,3,12,3,58,1,3,3,3,62,8,3,
        1,3,1,3,4,3,66,8,3,11,3,12,3,67,1,3,3,3,71,8,3,1,3,1,3,1,3,1,3,4,
        3,77,8,3,11,3,12,3,78,1,3,3,3,82,8,3,1,3,1,3,4,3,86,8,3,11,3,12,
        3,87,1,3,3,3,91,8,3,1,3,1,3,1,3,1,3,3,3,97,8,3,1,4,1,4,4,4,101,8,
        4,11,4,12,4,102,1,4,4,4,106,8,4,11,4,12,4,107,4,4,110,8,4,11,4,12,
        4,111,1,4,1,4,1,4,1,4,1,5,1,5,4,5,120,8,5,11,5,12,5,121,1,5,1,5,
        1,6,1,6,3,6,128,8,6,1,7,1,7,1,7,1,8,4,8,134,8,8,11,8,12,8,135,1,
        8,0,0,9,0,2,4,6,8,10,12,14,16,0,0,155,0,25,1,0,0,0,2,29,1,0,0,0,
        4,50,1,0,0,0,6,96,1,0,0,0,8,98,1,0,0,0,10,117,1,0,0,0,12,127,1,0,
        0,0,14,129,1,0,0,0,16,133,1,0,0,0,18,21,3,4,2,0,19,21,3,6,3,0,20,
        18,1,0,0,0,20,19,1,0,0,0,21,22,1,0,0,0,22,20,1,0,0,0,22,23,1,0,0,
        0,23,26,1,0,0,0,24,26,3,2,1,0,25,20,1,0,0,0,25,24,1,0,0,0,26,1,1,
        0,0,0,27,30,3,4,2,0,28,30,3,6,3,0,29,27,1,0,0,0,29,28,1,0,0,0,30,
        31,1,0,0,0,31,29,1,0,0,0,31,32,1,0,0,0,32,33,1,0,0,0,33,34,5,1,0,
        0,34,3,1,0,0,0,35,37,3,12,6,0,36,35,1,0,0,0,37,38,1,0,0,0,38,36,
        1,0,0,0,38,39,1,0,0,0,39,51,1,0,0,0,40,42,3,10,5,0,41,40,1,0,0,0,
        42,43,1,0,0,0,43,41,1,0,0,0,43,44,1,0,0,0,44,51,1,0,0,0,45,47,3,
        8,4,0,46,45,1,0,0,0,47,48,1,0,0,0,48,46,1,0,0,0,48,49,1,0,0,0,49,
        51,1,0,0,0,50,36,1,0,0,0,50,41,1,0,0,0,50,46,1,0,0,0,51,52,1,0,0,
        0,52,50,1,0,0,0,52,53,1,0,0,0,53,5,1,0,0,0,54,61,5,2,0,0,55,57,3,
        12,6,0,56,55,1,0,0,0,57,58,1,0,0,0,58,56,1,0,0,0,58,59,1,0,0,0,59,
        62,1,0,0,0,60,62,3,10,5,0,61,56,1,0,0,0,61,60,1,0,0,0,62,63,1,0,
        0,0,63,70,5,3,0,0,64,66,3,12,6,0,65,64,1,0,0,0,66,67,1,0,0,0,67,
        65,1,0,0,0,67,68,1,0,0,0,68,71,1,0,0,0,69,71,3,10,5,0,70,65,1,0,
        0,0,70,69,1,0,0,0,71,72,1,0,0,0,72,73,5,4,0,0,73,97,1,0,0,0,74,81,
        5,2,0,0,75,77,3,12,6,0,76,75,1,0,0,0,77,78,1,0,0,0,78,76,1,0,0,0,
        78,79,1,0,0,0,79,82,1,0,0,0,80,82,3,10,5,0,81,76,1,0,0,0,81,80,1,
        0,0,0,82,83,1,0,0,0,83,90,5,3,0,0,84,86,3,12,6,0,85,84,1,0,0,0,86,
        87,1,0,0,0,87,85,1,0,0,0,87,88,1,0,0,0,88,91,1,0,0,0,89,91,3,10,
        5,0,90,85,1,0,0,0,90,89,1,0,0,0,91,92,1,0,0,0,92,93,5,4,0,0,93,94,
        5,10,0,0,94,95,5,11,0,0,95,97,1,0,0,0,96,54,1,0,0,0,96,74,1,0,0,
        0,97,7,1,0,0,0,98,109,5,2,0,0,99,101,3,12,6,0,100,99,1,0,0,0,101,
        102,1,0,0,0,102,100,1,0,0,0,102,103,1,0,0,0,103,110,1,0,0,0,104,
        106,3,10,5,0,105,104,1,0,0,0,106,107,1,0,0,0,107,105,1,0,0,0,107,
        108,1,0,0,0,108,110,1,0,0,0,109,100,1,0,0,0,109,105,1,0,0,0,110,
        111,1,0,0,0,111,109,1,0,0,0,111,112,1,0,0,0,112,113,1,0,0,0,113,
        114,5,5,0,0,114,115,3,16,8,0,115,116,5,4,0,0,116,9,1,0,0,0,117,119,
        5,6,0,0,118,120,3,12,6,0,119,118,1,0,0,0,120,121,1,0,0,0,121,119,
        1,0,0,0,121,122,1,0,0,0,122,123,1,0,0,0,123,124,5,7,0,0,124,11,1,
        0,0,0,125,128,3,16,8,0,126,128,3,14,7,0,127,125,1,0,0,0,127,126,
        1,0,0,0,128,13,1,0,0,0,129,130,5,11,0,0,130,131,5,8,0,0,131,15,1,
        0,0,0,132,134,5,11,0,0,133,132,1,0,0,0,134,135,1,0,0,0,135,133,1,
        0,0,0,135,136,1,0,0,0,136,17,1,0,0,0,26,20,22,25,29,31,38,43,48,
        50,52,58,61,67,70,78,81,87,90,96,102,107,109,111,121,127,135
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
    public synchr_sequence(): Synchr_sequenceContext[];
    public synchr_sequence(i: number): Synchr_sequenceContext | null;
    public synchr_sequence(i?: number): Synchr_sequenceContext[] | Synchr_sequenceContext | null {
        if (i === undefined) {
            return this.getRuleContexts(Synchr_sequenceContext);
        }

        return this.getRuleContext(i, Synchr_sequenceContext);
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
    public synchr_sequence(): Synchr_sequenceContext[];
    public synchr_sequence(i: number): Synchr_sequenceContext | null;
    public synchr_sequence(i?: number): Synchr_sequenceContext[] | Synchr_sequenceContext | null {
        if (i === undefined) {
            return this.getRuleContexts(Synchr_sequenceContext);
        }

        return this.getRuleContext(i, Synchr_sequenceContext);
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
    public multiplex_sequence(): Multiplex_sequenceContext[];
    public multiplex_sequence(i: number): Multiplex_sequenceContext | null;
    public multiplex_sequence(i?: number): Multiplex_sequenceContext[] | Multiplex_sequenceContext | null {
        if (i === undefined) {
            return this.getRuleContexts(Multiplex_sequenceContext);
        }

        return this.getRuleContext(i, Multiplex_sequenceContext);
    }
    public repeat_sequence(): Repeat_sequenceContext[];
    public repeat_sequence(i: number): Repeat_sequenceContext | null;
    public repeat_sequence(i?: number): Repeat_sequenceContext[] | Repeat_sequenceContext | null {
        if (i === undefined) {
            return this.getRuleContexts(Repeat_sequenceContext);
        }

        return this.getRuleContext(i, Repeat_sequenceContext);
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


export class Synchr_sequenceContext extends antlr.ParserRuleContext {
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
    public HAND(): antlr.TerminalNode | null {
        return this.getToken(PatternParser.HAND, 0);
    }
    public INT(): antlr.TerminalNode | null {
        return this.getToken(PatternParser.INT, 0);
    }
    public override get ruleIndex(): number {
        return PatternParser.RULE_synchr_sequence;
    }
    public override enterRule(listener: PatternListener): void {
        if(listener.enterSynchr_sequence) {
             listener.enterSynchr_sequence(this);
        }
    }
    public override exitRule(listener: PatternListener): void {
        if(listener.exitSynchr_sequence) {
             listener.exitSynchr_sequence(this);
        }
    }
    public override accept<Result>(visitor: PatternVisitor<Result>): Result | null {
        if (visitor.visitSynchr_sequence) {
            return visitor.visitSynchr_sequence(this);
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
    public multiplex_sequence(): Multiplex_sequenceContext[];
    public multiplex_sequence(i: number): Multiplex_sequenceContext | null;
    public multiplex_sequence(i?: number): Multiplex_sequenceContext[] | Multiplex_sequenceContext | null {
        if (i === undefined) {
            return this.getRuleContexts(Multiplex_sequenceContext);
        }

        return this.getRuleContext(i, Multiplex_sequenceContext);
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
