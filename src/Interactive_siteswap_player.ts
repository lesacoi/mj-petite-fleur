/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { Ball } from "./Ball";
import { Hand } from "./Hand";
import { Juggler } from "./Juggler";
import { Simulator } from "./Simulator";
import { JugglingEvent } from "./Timeline";
import { thrown } from "./ParserLexerPattern";
import * as TWEAKPANE from "tweakpane";
import * as THREE from "three";

function lance(
    ball: Ball,
    time: number,
    flight_time: number,
    source: Hand,
    target: Hand,
    unit_time: number,
    sound?: string[] | string
): void {
    const ev1 = new JugglingEvent(time, unit_time, "THROW", source, ball);
    const ev2 = new JugglingEvent(time + flight_time, unit_time, "CATCH", target, ball, sound);
    ev1.pair_with(ev2);
    ball.timeline = ball.timeline.insert(ev1.time, ev1);
    ball.timeline = ball.timeline.insert(ev2.time, ev2);
    source.timeline = source.timeline.insert(ev1.time, ev1);
    target.timeline = target.timeline.insert(ev2.time, ev2);
}

function lance_pattern(
    pattern: thrown[][],
    colors: string[],
    u: number,
    d: number,
    juggler: Juggler,
    simulator: Simulator,
    b_invalid_siteswap: TWEAKPANE.ButtonApi,
    scene: THREE.Scene
): void {
    function pre_lancer(pattern: thrown[][], size: number, held_balls: Ball[]): void {
        /// May be convert to boolean to handle errors
        // For pier:
        const flat = pattern.flat();
        const hauteur = [];
        for (const pier of flat) {
            for (const p of pier.pier) {
                hauteur.push(p.hauteur);
            }
        }
        const thrown_max = Math.max(...hauteur);
        // const thrown_max = Math.max(...pattern.flat());
        function known_all_positions(pier: number[][]): boolean {
            for (let i = 0; i < thrown_max - 1; i++) {
                for (const subArray of pier) {
                    if (!Number.isInteger(subArray[i])) {
                        return false;
                    }
                }
            }
            return true;
        }
        //const pier: number[][] = [];
        const pier: number[][] = Array.from(pattern, () => Array<number>(thrown_max));
        // for (const item of pattern) {
        //     pier.push([]); // Ajoutez un nouveau sous-tableau vide
        //}
        while (!known_all_positions(pier)) {
            for (let i = 0; i < size; i++) {
                if (i % pattern.length === 0) {
                    for (let i2 = 0; i2 < pattern.length; i2++) {
                        pier[i2].splice(0, 1);
                        pier[i2][thrown_max - 1] = 0;
                    }
                }
                for (const p of pattern[i % pattern.length][~~(i / pattern.length)].pier) {
                    if (p.hauteur != 0) {
                        const inversion: number = p.target;
                        pier[((i % pattern.length) + p.hauteur + inversion) % 2][
                            p.hauteur - 1
                        ] += 1; // += 1 pour accepter les attrapages multiples
                    }
                }
            }
        }
        console.log(pier);
        // Execute pier in time -u
        const spattern: number[][] = [[], []]; // All pier execute at time -u with hand i (spattern[i])
        const totale_size = pier.reduce((total, subArray) => total + subArray.length, 0);

        // Make spattern and execute it
        for (let i = 0; i < totale_size; i++) {
            if (pier[i % pier.length][~~(i / pier.length)] != 0) {
                for (let r = 0; r < pier[i % pier.length][~~(i / pier.length)]; r++) {
                    const last_spattern_position = spattern.flat().length;
                    spattern[i % pier.length][last_spattern_position] = ~~(i / pier.length) + 1;
                    copyBalls(
                        held_balls[last_spattern_position],
                        held_balls_hand,
                        i,
                        pier.length,
                        r
                    );
                    // console.log(
                    //     "prelance:",
                    //     held_balls[last_spattern_position],
                    //     ~~(i / pier.length) + 1,
                    //     held_balls_hand
                    // );
                    lance(
                        held_balls[last_spattern_position],
                        -u,
                        u * (~~(i / pier.length) + 1) - d,
                        juggler.hands[i % 2],
                        juggler.hands[i % 2],
                        u
                    );
                }
            }
        }
        //console.log(spattern);
    }

    function thrown_from_0(held_balls: Ball[], held_balls_hand: Ball[][][], i: number): void {
        if (held_balls_hand[i % 2][~~(i / pattern.length)] != undefined) {
            for (let i2 = 0; i2 < held_balls_hand[i % 2][~~(i / pattern.length)].length; i2++) {
                let new_position: number;
                if (held_balls_hand[i2 % 2][~~(i / pattern.length) + 1] != undefined) {
                    new_position = held_balls_hand[i2 % 2][~~(i / pattern.length) + 1].length;
                } else {
                    new_position = 0;
                    held_balls_hand[i2 % 2][~~(i / pattern.length) + 1] = [];
                }
                held_balls_hand[i2 % 2][~~(i / pattern.length) + 1][new_position] =
                    held_balls_hand[i % 2][~~(i / pattern.length)][i2];
            }
        }
        //Normalement inutile
        // if (held_balls[i] != undefined) {
        //     held_balls.splice(i, 0, undefined);
        //     //console.log(held_balls, i);
        // }
    }

    function copyBalls(
        ball: Ball,
        held_balls_hand: Ball[][][],
        i: number,
        length: number,
        c: number
    ): void {
        if (held_balls_hand[i % 2][~~(i / length)] === undefined) {
            const table: Ball[] = [];
            held_balls_hand[i % 2][~~(i / length)] = table;
        }
        held_balls_hand[i % 2][~~(i / length)][c] = ball;
    }

    function main(
        N: number,
        held_balls: Ball[],
        held_balls_hand: Ball[][][],
        pattern: thrown[][]
    ): void {
        for (let i = 0; i < N - total_size; i++) {
            //const h = pattern.flat()[i % total_size];
            let countPier = 0;
            let h: number;
            for (const pier of pattern[i % pattern.length][
                ~~(i / pattern.length) % pattern[i % pattern.length].length
            ].pier) {
                h = pier.hauteur;
                if (h === 0) {
                    thrown_from_0(held_balls, held_balls_hand, i);
                } else {
                    if (held_balls_hand[i % 2][~~(i / pattern.length)] == undefined) {
                        throw new Error(
                            "held_balls_hand[i % 2][~~(i / pattern.length)] === undefined \r\n"
                        );
                    }
                    // if (held_balls_hand[i % 2][~~(i / pattern.length)] == undefined) {
                    //     //Impossible, but juste for verify
                    //     if (held_balls[i] != undefined) {
                    //         copyBalls(held_balls[i], held_balls_hand, i, pattern.length);
                    //     } else {
                    //         console.log(
                    //             "held_balls_hand[",
                    //             i % 2,
                    //             "][",
                    //             ~~(i / pattern.length),
                    //             "] et held_balls[",
                    //             i,
                    //             "] sont undefined.",
                    //             held_balls,
                    //             held_balls_hand
                    //         );
                    //         //     deleteEmptyBox([], held_balls_hand, i, pattern.length);
                    //         //     //held_balls_hand[i % 2].splice(~~(i / pattern.length), 1);
                    //     }
                    // }
                    const inversion: number = pier.target;
                    if (
                        held_balls_hand[(i + h + inversion) % 2][~~(i / pattern.length) + h] ==
                        undefined
                    ) {
                        held_balls_hand[(i + h + inversion) % 2][~~(i / pattern.length) + h] = [];
                    }
                    held_balls_hand[(i + h + inversion) % 2][~~(i / pattern.length) + h][
                        held_balls_hand[(i + h + inversion) % 2][~~(i / pattern.length) + h].length
                    ] = held_balls[i] = held_balls_hand[i % 2][~~(i / pattern.length)][countPier];

                    let time: number = ~~(i / pattern.length) * u;
                    let flight_time: number = h * u - d;
                    const timeExecution: number = pattern[0].length * u; //duration of one execution
                    const nExecution: number = ~~(i / total_size); // number of execution
                    const timeInExecution: number = pier.time;
                    console.assert(
                        timeExecution * nExecution + timeInExecution === time,
                        "//Temps préenregistré dans pier ne correspond pas avec le temps calculé.",
                        timeExecution * nExecution + timeInExecution,
                        "!=",
                        time
                    );
                    console.assert(
                        pier.flight_time === flight_time,
                        "//Temps de vole préenregistré dans pier ne correspond pas avec le temps calculé.",
                        pier.flight_time,
                        "!=",
                        flight_time
                    );
                    time = timeExecution * nExecution + timeInExecution;
                    flight_time = pier.flight_time;
                    //console.log(held_balls[i], "    ", h, held_balls_hand);
                    lance(
                        held_balls[i],
                        time, //~~(i / pattern.length) * u,
                        flight_time, //h * u - d,
                        juggler.hands[i % 2],
                        juggler.hands[(i + h + inversion) % 2],
                        u
                    );
                }
                countPier += 1;
            }
            if (held_balls_hand[i % 2][~~(i / pattern.length)]?.length > countPier) {
                // copie les balls non utilisé dans la case suivante du tableau (h!=0 sert à éliminer les cas undefined)
                if (held_balls_hand[i % 2][~~(i / pattern.length) + 1] != undefined) {
                    held_balls_hand[i % 2][~~(i / pattern.length) + 1] = [
                        ...held_balls_hand[i % 2][~~(i / pattern.length)].slice(countPier),
                        ...held_balls_hand[i % 2][~~(i / pattern.length) + 1]
                    ];
                } else {
                    held_balls_hand[i % 2][~~(i / pattern.length) + 1] = [];
                    held_balls_hand[i % 2][~~(i / pattern.length) + 1] = [
                        ...held_balls_hand[i % 2][~~(i / pattern.length)].slice(countPier)
                    ];
                }
            }
        }
        console.log(held_balls_hand);
    }

    // Count the balls needed
    let n_balls = 0;
    for (const subArray of pattern) {
        n_balls +=
            subArray.reduce((p, c) => p + c.pier.reduce((p, c) => p + c.hauteur, 0), 0) /
            subArray.length;
    }

    //Verificatipon du siteswap à refaire
    if (!Number.isInteger(n_balls)) {
        b_invalid_siteswap.hidden = !b_invalid_siteswap.hidden;
        //siteswap_blade.hidden = !siteswap_blade.hidden;
        return;
    }
    if (!b_invalid_siteswap.hidden) {
        b_invalid_siteswap.hidden = !b_invalid_siteswap.hidden;
    }

    // Build the sequence of throws
    const total_size = pattern.reduce((total, subArray) => total + subArray.length, 0);
    const N = total_size * 50;
    const held_balls: Ball[] = Array<Ball>(N); // TODO change name to juste balls to take.
    const held_balls_hand: Ball[][][] = [[], []];

    simulator.reset_pattern();

    // Build the balls
    for (let i = 0; i < n_balls; i++) {
        held_balls[i] = simulator.balls[i] = new Ball(colors[i], 0.04);
    }

    // Add balls to scene
    simulator.balls.forEach((ball) => {
        scene.add(ball.mesh);
    });

    // for (let i = 0; i < simulator.balls.length; i++) {
    //     held_balls[i] = simulator.balls[i];
    // }

    pre_lancer(pattern, total_size, held_balls);
    simulator.balls = simulator.balls.filter((ball) => {
        return ball.timeline.length !== 0;
    });
    main(N, held_balls, held_balls_hand, pattern);

    return;
}

export { lance, lance_pattern };
