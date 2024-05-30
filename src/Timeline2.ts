// import { Ball } from "./Ball";
// import { Hand } from "./Hand";
// import { CWeakRef } from "./CustomWeakRef";
// import * as THREE from "three";

// class JugglingEvent {
//     time: number;
//     unit_time: number;
//     private _ball_ref?: CWeakRef<Ball>;
//     private _hand_ref?: CWeakRef<Hand>;

//     constructor(time: number, unit_time: number, hand?: Hand, ball?: Ball) {
//         this.time = time;
//         this.unit_time = unit_time;
//         this._hand_ref = hand !== undefined ? new CWeakRef<Hand>(hand) : undefined;
//         this._ball_ref = ball !== undefined ? new CWeakRef<Ball>(ball) : undefined;
//     }

//     get hand(): Hand {
//         const obj = this._hand_ref?.deref();
//         if (obj === undefined) {
//             throw new Error("hand is undefined");
//         }
//         return obj;
//     }

//     set hand(new_hand: Hand) {
//         this._hand_ref = new CWeakRef(new_hand);
//     }

//     get ball(): Ball {
//         const obj = this._ball_ref?.deref();
//         if (obj === undefined) {
//             throw new Error("hand is undefined");
//         }
//         return obj;
//     }

//     set ball(new_ball: Ball) {
//         this._ball_ref = new CWeakRef(new_ball);
//     }
// }

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

// // class TableEvent extends JugglingEvent {
// //     this.table: Table ;

// //     constructor(time: number, unit_time: number, hand?: Hand, ball?: Ball) {
// //         super(time, unit_time, hand, ball);
// //     }
// // }

// // type CatchEvent = {
// //     status: "CATCH";
// //     time: number;
// //     ball: Ball;
// //     unit_time: number;
// //     hand?: CWeakRef<Hand>;
// //     throw_event?: CWeakRef<ThrowEvent>;
// // };

// // type ThrowEvent = {
// //     status: "THROW";
// //     time: number;
// //     ball: Ball;
// //     unit_time: number;
// //     hand?: CWeakRef<Hand>;
// //     catch_event?: CWeakRef<ThrowEvent>;
// // };

// // function throw_to_catch_event(event: ThrowEvent): CatchEvent {
// //     return {
// //         status: "CATCH",
// //         time: event.catch_time,
// //         ball: event.ball,
// //         unit_time: event.catch_unit_time,
// //         throw_time: event.time,
// //         throw_hand: this,
// //         throw_unit_time: event.unit_time
// //     };
// // }
// // function catch_to_throw_event(event: CatchEvent): ThrowEvent {
// //     return {
// //         status: "THROW",
// //         time: event.throw_time,
// //         ball: event.ball,
// //         unit_time: event.throw_unit_time,
// //         catch_time: event.time,
// //         catch_hand: this,
// //         catch_unit_time: event.unit_time
// //     };
// // }

// export { JugglingEvent, ThrowEvent, CatchEvent };
