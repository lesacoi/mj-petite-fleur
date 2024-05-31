import { Ball } from "./Ball";
import { Hand } from "./Hand";
import { CWeakRef } from "./CustomWeakRef";
import * as THREE from "three";

//TODO : Gestion des corrodonnées globales / locales
//TODO : Pb d'avoir get_abll_position ici : pos de la main et de la balle ne sont pas les mêmes
// (légérement au dessus par exemple)
//TODO : Really needs references if can be gathered from the ball timeline ?

//TODO : Timeline fait intermédiaire entre main et balle. Balle ne peut pas accéder main, et inversement ?
// Mais comment gérer le temps ?

class JugglingEvent {
    time: number;
    unit_time: number;
    readonly ball_status: "AIRBORNE" | "HELD";
    readonly hand_status: "CATCH" | "THROW";
    private _ball_ref?: CWeakRef<Ball>;
    private _hand_ref?: CWeakRef<Hand>;
    private _paired_event_ref?: CWeakRef<JugglingEvent>;

    constructor(
        time: number,
        unit_time: number,
        status: "CATCH" | "THROW",
        hand?: Hand,
        ball?: Ball
    ) {
        this.time = time;
        this.unit_time = unit_time;
        this._hand_ref = hand !== undefined ? new CWeakRef<Hand>(hand) : undefined;
        this._ball_ref = ball !== undefined ? new CWeakRef<Ball>(ball) : undefined;
        this.ball_status = status === "THROW" ? "AIRBORNE" : "HELD";
        this.hand_status = status;
    }

    get hand(): Hand {
        const obj = this._hand_ref?.deref();
        if (obj === undefined) {
            throw new Error("hand is undefined");
        }
        return obj;
    }

    set hand(new_hand: Hand) {
        this._hand_ref = new CWeakRef(new_hand);
    }

    get ball(): Ball {
        const obj = this._ball_ref?.deref();
        if (obj === undefined) {
            throw new Error("hand is undefined");
        }
        return obj;
    }

    set ball(new_ball: Ball) {
        this._ball_ref = new CWeakRef(new_ball);
    }

    get paired_event(): JugglingEvent {
        const event = this._paired_event_ref?.deref();
        if (event === undefined) {
            throw new Error("Paired Event is undefined.");
        }
        return event;
    }

    set paired_event(event: JugglingEvent) {
        this._paired_event_ref = new CWeakRef<JugglingEvent>(event);
    }

    pair_with(other: JugglingEvent): void {
        other.paired_event = this;
        this.paired_event = other;
    }

    //TODO: Offset the ball by its radius up ?
    //TODO: Telle what is local/global
    get_hand_global_position(): THREE.Vector3 {
        const local_position = this.hand.get_site_position(this.unit_time, this.is_thrown);
        return this.hand.origin_object.localToWorld(local_position);
    }

    get_ball_velocity(): THREE.Vector3 {
        const pos0 = this.get_hand_global_position();
        const pos1 = this.paired_event.get_hand_global_position();
        const t0 = this.time;
        const t1 = this.paired_event.time;
        if (this.is_thrown) {
            return Ball.get_velocity_at_event(pos0, t0, pos1, t1, this.is_thrown);
        } else {
            return Ball.get_velocity_at_event(pos1, t1, pos0, t0, this.is_thrown);
        }
    }

    get is_thrown(): boolean {
        return this.hand_status === "THROW";
    }

    get is_caught(): boolean {
        return this.hand_status === "CATCH";
    }
}

// class ThrowEvent extends JugglingEvent {
//     siteswap_height: number;
//     ball_status = "AIRBORNE" as const;
//     hand_status = "THROW" as const;
//     private _catch_event_ref?: CWeakRef<CatchEvent>;

//     constructor(
//         time: number,
//         unit_time: number,
//         siteswap_height: number,
//         hand?: Hand,
//         ball?: Ball,
//         catch_event?: CatchEvent
//     ) {
//         super(time, unit_time, hand, ball);
//         this.siteswap_height = siteswap_height;
//         if (catch_event !== undefined) {
//             this._catch_event_ref = new CWeakRef<CatchEvent>(catch_event);
//         }
//     }

//     get catch_event(): CatchEvent {
//         const event = this._catch_event_ref?.deref();
//         if (event === undefined) {
//             throw new Error("Catch Event is undefined");
//         }
//         return event;
//     }

//     set catch_event(event: CatchEvent) {
//         this._catch_event_ref = new CWeakRef<CatchEvent>(event);
//     }

//     pair_with(catch_event: CatchEvent): void {
//         catch_event.throw_event = this;
//         this.catch_event = catch_event;
//     }
// }

// class CatchEvent extends JugglingEvent {
//     ball_status = "HELD" as const;
//     hand_status = "CATCH" as const;
//     private _throw_event_ref?: CWeakRef<ThrowEvent>;

//     constructor(
//         time: number,
//         unit_time: number,
//         hand?: Hand,
//         ball?: Ball,
//         throw_event?: ThrowEvent
//     ) {
//         super(time, unit_time, hand, ball);
//         if (throw_event !== undefined) {
//             this._throw_event_ref = new CWeakRef<ThrowEvent>(throw_event);
//         }
//     }

//     get throw_event(): ThrowEvent {
//         const event = this._throw_event_ref?.deref();
//         if (event === undefined) {
//             throw new Error("throw_event is undefined");
//         }
//         return event;
//     }

//     set throw_event(event: ThrowEvent) {
//         this._throw_event_ref = new CWeakRef<ThrowEvent>(event);
//     }

//     pair_with(throw_event: ThrowEvent): void {
//         throw_event.pair_with(this);
//         // this.throw_event = throw_event;
//         // throw_event.catch_event = this;
//     }
// }

// class TableEvent extends JugglingEvent {
//     this.table: Table ;

//     constructor(time: number, unit_time: number, hand?: Hand, ball?: Ball) {
//         super(time, unit_time, hand, ball);
//     }
// }

export { JugglingEvent };
