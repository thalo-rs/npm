export type Aggregate<Agg, Ev, Cmd> = {
  $new(id: string): Agg;
  $apply(event: Ev): void;
} & Cmd;

export type Event<T, E> = E & { $type: T };
