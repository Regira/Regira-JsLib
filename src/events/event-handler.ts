import Event from "./event"

type EventCallback = (event: Event, arg?: unknown) => unknown
type ConstraintFn = (e: unknown, arg?: unknown) => boolean

interface Listener {
    constraint?: ConstraintFn | null
    callback: EventCallback
    scope?: unknown
    once?: boolean
}

interface ListenerOptions {
    key: string
    constraint?: ConstraintFn | null
    callback: EventCallback
    thisScope?: unknown
    once?: boolean
}

type ListenerMap = Record<string, Listener[]>

const getOptions = (argArray: unknown[]): ListenerOptions => {
    const key = argArray[0] as string
    const options = argArray.splice(0, 1)[0] as Record<string, unknown>
    const callback = (options["callback"] ?? argArray[argArray.length - 1]) as EventCallback
    const constraint = (options["constraint"] ??
        (argArray.length > 2 ? argArray.splice(0, 1).find((x): x is ConstraintFn => x !== callback && typeof x === "function") : undefined)) as
        ConstraintFn | undefined
    const thisScope = options["scope"]
    return {
        key: key ?? "",
        constraint,
        callback,
        thisScope,
    }
}

function setListener(this: { listeners: ListenerMap }, options: ListenerOptions): void {
    const me = this
    options.key.split(" ").forEach((x) => {
        if (!(x in me.listeners)) {
            me.listeners[x] = []
        }
        const listener: Listener = {
            constraint: options.constraint,
            callback: options.callback,
            scope: options.thisScope,
            once: options.once,
        }
        me.listeners[x].push(listener)
    })
}

class EventHandler {
    static injectInto(target: object): void {
        Object.defineProperties(target, {
            listeners: {
                get(this: { _listeners?: ListenerMap }) {
                    // create new object per instance
                    if (!("_listeners" in this)) {
                        Object.defineProperty(this, "_listeners", { value: {} })
                    }
                    return this._listeners
                },
            },
            on: {
                value(this: { listeners: ListenerMap }) {
                    const options = getOptions([...arguments])
                    setListener.call(this, options)
                    return this
                },
                configurable: true,
            },
            once: {
                value(this: { listeners: ListenerMap }) {
                    const options = getOptions([...arguments])
                    options.once = true
                    setListener.call(this, options)
                    return this
                },
                configurable: true,
            },
            off: {
                value(this: { listeners: ListenerMap }, key: string, listener?: EventCallback | null) {
                    if (this.listeners[key]) {
                        if (this.listeners[key].length && typeof listener === "function") {
                            const index = this.listeners[key].findIndex((x) => x.callback === listener)
                            if (index >= 0) {
                                this.listeners[key].splice(index, 1)
                            }
                        }
                        if (!this.listeners[key].length || listener == null) {
                            delete this.listeners[key]
                        }
                    }
                    return this
                },
                configurable: true,
            },
            trigger: {
                async value(this: { listeners: ListenerMap; off(key: string, cb: EventCallback): void }, e: Event | string, arg?: unknown) {
                    const me = this
                    const event = typeof e === "string" ? new Event(e) : e
                    const results: unknown[] = []
                    const listeners = (me.listeners[event.type] ?? [])
                        .concat(me.listeners[""] ?? [])
                        .filter((x: Listener) => {
                            return x && (x.constraint == null || x.constraint.call(x.scope ?? me, e, arg))
                        })
                        .map((x: Listener) => {
                            if (x.once) {
                                me.off(event.type, x.callback)
                            }
                            return () => {
                                try {
                                    const result = x.callback.call(x.scope ?? me, event, arg ?? {})
                                    return Promise.resolve(result)
                                } catch (error) {
                                    console.error("Executing listener failed", { error, event, listener: x.callback })
                                    return Promise.resolve(error)
                                }
                            }
                        })

                    return listeners
                        .reduce((r: Promise<unknown>, f: () => Promise<unknown>) => {
                            return r.then(f).then((result) => {
                                results.push(result)
                                return result
                            })
                        }, Promise.resolve<unknown>(undefined))
                        .then(() => results)
                },
                configurable: true,
            },
        })
    }
}

EventHandler.injectInto(EventHandler.prototype)

export default EventHandler
