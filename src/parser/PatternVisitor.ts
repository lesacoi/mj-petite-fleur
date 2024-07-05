// Generated from Pattern.g4 by ANTLR 4.13.1

import { AbstractParseTreeVisitor } from "antlr4ng";


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
 * This interface defines a complete generic visitor for a parse tree produced
 * by `PatternParser`.
 *
 * @param <Result> The return type of the visit operation. Use `void` for
 * operations with no return type.
 */
export class PatternVisitor<Result> extends AbstractParseTreeVisitor<Result> {
    /**
     * Visit a parse tree produced by `PatternParser.pattern`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitPattern?: (ctx: PatternContext) => Result;
    /**
     * Visit a parse tree produced by `PatternParser.mirror_pattern`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitMirror_pattern?: (ctx: Mirror_patternContext) => Result;
    /**
     * Visit a parse tree produced by `PatternParser.sequence`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitSequence?: (ctx: SequenceContext) => Result;
    /**
     * Visit a parse tree produced by `PatternParser.schync_sequence`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitSchync_sequence?: (ctx: Schync_sequenceContext) => Result;
    /**
     * Visit a parse tree produced by `PatternParser.multiplex_sequence`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitMultiplex_sequence?: (ctx: Multiplex_sequenceContext) => Result;
    /**
     * Visit a parse tree produced by `PatternParser.repeat_sequence`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitRepeat_sequence?: (ctx: Repeat_sequenceContext) => Result;
    /**
     * Visit a parse tree produced by `PatternParser.throw`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitThrow?: (ctx: ThrowContext) => Result;
    /**
     * Visit a parse tree produced by `PatternParser.c_hand`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitC_hand?: (ctx: C_handContext) => Result;
    /**
     * Visit a parse tree produced by `PatternParser.int`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitInt?: (ctx: IntContext) => Result;
}

