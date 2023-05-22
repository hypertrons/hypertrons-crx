export type ShouldRunConditions = {
  asLongAs: ((() => boolean) | (() => Promise<boolean>))[] | undefined;
  include: ((() => boolean) | (() => Promise<boolean>))[] | undefined;
  exclude: ((() => boolean) | (() => Promise<boolean>))[] | undefined;
};

export default async function shouldFeatureRun(
  props: ShouldRunConditions
): Promise<boolean> {
  const {
    /** Every condition must be true */
    asLongAs = [() => true],
    /** At least one condition must be true */
    include = [() => true],
    /** No conditions must be true */
    exclude = [() => false],
  } = props;
  return (
    (await Promise.all(asLongAs.map((c) => c())).then((flags) =>
      flags.every((flag) => flag === true)
    )) &&
    (await Promise.all(include.map((c) => c())).then((flags) =>
      flags.some((flag) => flag === true)
    )) &&
    (await Promise.all(exclude.map((c) => c())).then((flags) =>
      flags.every((flag) => flag === false)
    ))
  );
}
