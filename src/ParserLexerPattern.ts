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

const inputStream = CharStream.fromString("55555)");
const lexer = new PatternLexer(inputStream);
const tokenStream = new CommonTokenStream(lexer);
const parser = new PatternParser(tokenStream);
const tree = parser.pattern();

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
    public visitSequence = (ctx: SequenceContext): result => {
        const table: result[][] = [];
        let i = 0;
        for (const child of ctx.children) {
            if (!Array.isArray(table[i % 2])) {
                table.push([]);
            }
            const childContext: result[] = this.visit(child);
            for (const pier of childContext) {
                if (!Array.isArray(table[i % 2])) {
                    table.push([]);
                }
                if (pier != undefined) {
                    table[i % 2].push(pier);
                    i++;
                }
            }
            i++;
        }
        console.log(i);
        return table;
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

export { MyVisitor, pier, tree };
