export default abstract class PerceptorBase{
  public abstract run(config:any|null): Promise<void>;
}