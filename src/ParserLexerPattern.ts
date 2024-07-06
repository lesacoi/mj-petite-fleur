import { CharStream, CommonTokenStream } from "antlr4ng";
import { PatternLexer } from "./parser/PatternLexer.ts";
import {
    C_handContext,
    IntContext,
    PatternContext,
    PatternParser,
    Schync_sequenceContext,
    SequenceContext,
    ThrowContext
} from "./parser/PatternParser.ts";
import { PatternVisitor } from "./parser/PatternVisitor.ts";

function makeTree(c: string): PatternContext {
    const inputStream = CharStream.fromString(c);
    const lexer = new PatternLexer(inputStream);
    const tokenStream = new CommonTokenStream(lexer);
    const parser = new PatternParser(tokenStream);
    const tree = parser.pattern();
    return tree;
}

class pier {
    hauteur: number;
    source: number; //: Hand;
    target: number; //: Hand;
    time: number;
    flight_time: number;

    constructor(
        hauteur: number,
        source: number,
        target: number,
        time: number,
        flight_time: number
    ) {
        this.hauteur = hauteur;
        this.source = source;
        this.target = target;
        this.time = time;
        this.flight_time = flight_time;
    }
}

class MyVisitor<result> extends PatternVisitor<result> {
    nulPier = new pier(0, 0, 0, 0, 0);
    public visitPattern = (ctx: PatternContext): result => {
        const nHand = 2;
        const pattern: result[][] = Array(nHand)
            .fill(null)
            .map(() => Array<result>());
        for (const child of ctx.children) {
            const childContext = this.visit(child);
            for (let i = 0; i < nHand; i++) {
                for (const pierChild of childContext[i]) {
                    pattern[i].push(pierChild);
                }
            }
        }

        return pattern;
    };

    public visitSchync_sequence = (ctx: Schync_sequenceContext): result => {
        const nHand = 2;
        const schync_sequence: result[][] = Array(nHand)
            .fill(null)
            .map(() => Array<result>());
        let i = 0;
        for (const child of ctx.children) {
            const childContext = this.visit(child);
            console.log(childContext);
            if (childContext != null) {
                schync_sequence[i % nHand].push(childContext[0]);
                schync_sequence[i % nHand].push(this.nulPier);
                i++;
            }
        }
        return schync_sequence;
    };
    public visitSequence = (ctx: SequenceContext): result => {
        const nHand = 2;
        const sequence: result[][] = Array(nHand)
            .fill(null)
            .map(() => Array<result>());
        let i = 0;
        while (true) {
            for (const child of ctx.children) {
                const childContext: result[] = this.visit(child);
                for (const pier of childContext) {
                    if (pier != undefined) {
                        sequence[i % nHand].push(pier);
                        sequence[(i + 1) % nHand].push(this.nulPier);
                        i++;
                    }
                }
            }
            if (i % nHand != 1) break;
        }
        return sequence;
    };

    public visitThrow = (ctx: ThrowContext): result => {
        return this.visit(ctx.children[0]);
    };

    public visitC_hand = (ctx: C_handContext): result => {
        const h = parseInt(ctx.INT().getText());
        return [new pier(h, 0, 1, 0.25, 0.25)];
    };
    public visitInt = (ctx: IntContext): result => {
        const table = [];
        for (let i = 0; i < ctx.children.length; i++) {
            const h = parseInt(ctx.INT(i).getText());
            table.push(new pier(h, 0, 0, 0.25, 0.25));
        }
        return table;
    };
}

export { MyVisitor, pier, makeTree };
