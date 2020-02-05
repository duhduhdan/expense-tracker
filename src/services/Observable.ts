class Observer {
  state: any
  subscribers: any[]

  constructor(state?: any) {
    this.state = state
    this.subscribers = []
  }

  get() {
    return this.state
  }

  set(state: any) {
    this.state = state
    this.broadcast(state)
  }

  subscribeMany(fns: Function[] = []) {
    return fns.map(fn => this.subscribe(fn))
  }

  subscribe(fn: Function) {
    if (Array.isArray(fn)) {
      return this.subscribeMany(fn)
    }

    this.subscribers.push(fn)

    return () => {
      this.subscribers = this.subscribers.filter(
        subscriber => subscriber !== fn,
      )
    }
  }

  broadcast(data: any) {
    this.subscribers.forEach(subscriber => subscriber(data))

    return data
  }
}

const observer = new Observer()

export { observer }
