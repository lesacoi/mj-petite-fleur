// Generated from Pattern.g4 by ANTLR 4.13.1

import { ErrorNode, ParseTreeListener, ParserRuleContext, TerminalNode } from "antlr4ng";


import { PatternContext } from "./PatternParser.js";
import { Mirror_patternContext } from "./PatternParser.js";
import { SequenceContext } from "./PatternParser.js";
import { Schync_sequenceContext } from "./PatternParser.js";
import { Multiplex_sequenceContext } from "./PatternParser.js";
import { Repeat_sequenceContext } from "./PatternParser.js";
import { ThrowContext } from "./PatternParser.js";
import { C_handContext } from "./PatternParser.js";
import { IntContext } from "./PatternParser.js";


/**
 * This interface defines a complete listener for a parse tree produced by
 * `PatternParser`.
 */
export class PatternListener implements ParseTreeListener {
    /**
     * Enter a parse tree produced by `PatternParser.pattern`.
     * @param ctx the parse tree
     */
    enterPattern?: (ctx: PatternContext) => void;
    /**
     * Exit a parse tree produced by `PatternParser.pattern`.
     * @param ctx the parse tree
     */
    exitPattern?: (ctx: PatternContext) => void;
    /**
     * Enter a parse tree produced by `PatternParser.mirror_pattern`.
     * @param ctx the parse tree
     */
    enterMirror_pattern?: (ctx: Mirror_patternContext) => void;
    /**
     * Exit a parse tree produced by `PatternParser.mirror_pattern`.
     * @param ctx the parse tree
     */
    exitMirror_pattern?: (ctx: Mirror_patternContext) => void;
    /**
     * Enter a parse tree produced by `PatternParser.sequence`.
     * @param ctx the parse tree
     */
    enterSequence?: (ctx: SequenceContext) => void;
    /**
     * Exit a parse tree produced by `PatternParser.sequence`.
     * @param ctx the parse tree
     */
    exitSequence?: (ctx: SequenceContext) => void;
    /**
     * Enter a parse tree produced by `PatternParser.schync_sequence`.
     * @param ctx the parse tree
     */
    enterSchync_sequence?: (ctx: Schync_sequenceContext) => void;
    /**
     * Exit a parse tree produced by `PatternParser.schync_sequence`.
     * @param ctx the parse tree
     */
    exitSchync_sequence?: (ctx: Schync_sequenceContext) => void;
    /**
     * Enter a parse tree produced by `PatternParser.multiplex_sequence`.
     * @param ctx the parse tree
     */
    enterMultiplex_sequence?: (ctx: Multiplex_sequenceContext) => void;
    /**
     * Exit a parse tree produced by `PatternParser.multiplex_sequence`.
     * @param ctx the parse tree
     */
    exitMultiplex_sequence?: (ctx: Multiplex_sequenceContext) => void;
    /**
     * Enter a parse tree produced by `PatternParser.repeat_sequence`.
     * @param ctx the parse tree
     */
    enterRepeat_sequence?: (ctx: Repeat_sequenceContext) => void;
    /**
     * Exit a parse tree produced by `PatternParser.repeat_sequence`.
     * @param ctx the parse tree
     */
    exitRepeat_sequence?: (ctx: Repeat_sequenceContext) => void;
    /**
     * Enter a parse tree produced by `PatternParser.throw`.
     * @param ctx the parse tree
     */
    enterThrow?: (ctx: ThrowContext) => void;
    /**
     * Exit a parse tree produced by `PatternParser.throw`.
     * @param ctx the parse tree
     */
    exitThrow?: (ctx: ThrowContext) => void;
    /**
     * Enter a parse tree produced by `PatternParser.c_hand`.
     * @param ctx the parse tree
     */
    enterC_hand?: (ctx: C_handContext) => void;
    /**
     * Exit a parse tree produced by `PatternParser.c_hand`.
     * @param ctx the parse tree
     */
    exitC_hand?: (ctx: C_handContext) => void;
    /**
     * Enter a parse tree produced by `PatternParser.int`.
     * @param ctx the parse tree
     */
    enterInt?: (ctx: IntContext) => void;
    /**
     * Exit a parse tree produced by `PatternParser.int`.
     * @param ctx the parse tree
     */
    exitInt?: (ctx: IntContext) => void;

    visitTerminal(node: TerminalNode): void {}
    visitErrorNode(node: ErrorNode): void {}
    enterEveryRule(node: ParserRuleContext): void {}
    exitEveryRule(node: ParserRuleContext): void {}
}

