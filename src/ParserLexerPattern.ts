import { CharStream, CommonTokenStream } from "antlr4ng";
import { PatternLexer } from "./parser/PatternLexer.ts";
import {
    C_handContext,
    IntContext,
    PatternContext,
    PatternParser,
    Synchr_sequenceContext,
    SequenceContext,
    ThrowContext,
    Repeat_sequenceContext,
    Mirror_patternContext
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
    //For convert in Hand, change the const inversion in main
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

class MyVisitor<result> extends PatternVisitor<result[][]> {
    nulPier = new pier(0, 0, 0, 0, 0);
    time = 0;
    unit_time = 0;
    flight_time = 0.25; //(default)
    d = this.flight_time / 2;
    //TODO: manage sequence+synchr_sequence =>
    //if (sequence.length%2 === 1) synchr_sequence[0] = synchr_sequence[1]
    public visitPattern = (ctx: PatternContext): result[][] => {
        const nHand = 2;
        const pattern: result[][] = Array(nHand)
            .fill(null)
            .map(() => Array<result>());
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, no-constant-condition
        while (true) {
            //const size = pattern[0].length;
            for (const child of ctx.children) {
                const size = pattern[0].length;
                const childContext = this.visit(child);
                for (let i = 0; i < nHand; i++) {
                    if (childContext != null) {
                        for (const pier of childContext[i]) {
                            pattern[(i + (size % nHand)) % nHand].push(pier);
                        }
                    }
                }
            }
            if (pattern[0].length % nHand === 0) {
                break;
            }
        }

        return pattern;
    };

    public visitMirror_pattern = (ctx: Mirror_patternContext): result[][] => {
        const nHand = 2;
        const pattern: result[][] = Array(nHand)
            .fill(null)
            .map(() => Array<result>());
        for (let i2 = 0; i2 < 2; i2++) {
            for (const child of ctx.children) {
                const childContext = this.visit(child);
                for (let i = 0; i < nHand; i++) {
                    if (childContext != null) {
                        for (const pier of childContext[i]) {
                            pattern[(i + i2) % nHand].push(pier);
                        }
                    }
                }
            }
        }
        return pattern;
    };

    public visitSynchr_sequence = (ctx: Synchr_sequenceContext): result[][] => {
        const nHand = 2;
        const synchr_sequence: result[][] = Array(nHand)
            .fill(null)
            .map(() => Array<result>());
        let i = 0;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        for (const child of ctx.children) {
            if (child.constructor.name != "TerminalNode") {
                let childContext;
                if (i > 0) {
                    this.time -= this.flight_time;
                    this.unit_time--;
                    childContext = this.visit(child);
                    this.time += this.flight_time;
                    this.unit_time++;
                } else {
                    childContext = this.visit(child);
                }
                if (childContext != null) {
                    synchr_sequence[i % nHand].push(childContext[0]);
                    synchr_sequence[i % nHand].push(this.nulPier);
                    i++;
                }
            }
        }
        return synchr_sequence;
    };
    public visitSequence = (ctx: SequenceContext): result[][] => {
        const nHand = 2;
        const sequence: result[][] = Array(nHand)
            .fill(null)
            .map(() => Array<result>());
        let i = 0;
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
        return sequence;
    };

    public visitRepeat_sequence = (ctx: Repeat_sequenceContext): result[][] => {
        const repeat: number = this.visit(ctx.children[ctx.children.length - 2]);
        const repeat_sequence: result[] = [];
        for (let i = 0; i < repeat; i++) {
            for (let i2 = 1; i2 < ctx.children.length - 3; i2++) {
                const childContext = this.visit(ctx.children[i2]);
                repeat_sequence.push(...childContext);
            }
        }

        return repeat_sequence;
    };

    public visitThrow = (ctx: ThrowContext): result => {
        return this.visit(ctx.children[0]);
    };

    public visitC_hand = (ctx: C_handContext): result => {
        const h = parseInt(ctx.INT().getText());
        const table = [new pier(h, 0, 1, this.time, h * this.flight_time - this.d)];
        this.time += this.flight_time;
        this.unit_time++;
        return table;
    };
    public visitInt = (ctx: IntContext): result => {
        if (ctx.parent.constructor.name === "ThrowContext") {
            const table = [];
            for (let i = 0; i < ctx.children.length; i++) {
                const h = parseInt(ctx.INT(i).getText());
                table.push(new pier(h, 0, 0, this.time, h * this.flight_time - this.d));
                this.time += this.flight_time;
                this.unit_time++;
            }
            return table;
        } else {
            let int = "";
            for (const child of ctx.children) {
                int = int + child.getText();
            }
            return parseInt(int);
        }
    };
}

export { MyVisitor, pier, makeTree };
