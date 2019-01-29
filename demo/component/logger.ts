export default class Logger {
  public config = {}
  constructor(conf:any) {
    this.config = conf
  }
  getConf() {
    return this.config
  }
  info(ctx: string) {
    console.info(ctx)
  }
}
