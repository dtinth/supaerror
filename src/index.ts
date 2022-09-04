/**
 * Makes promises that may resolve to an object with an `error` property reject with that error.
 * @public
 * @param promise - A promise that resolves to an object that may contain an `error` property
 * @returns A promise that resolves with the same value as the base promise when there is no error, but rejects when there is an `error` property on the base promise.
 * @remarks
 *  If the `error` property is a non-error object, it will be converted into an Error object with `cause` property set to the original object.
 */
export async function rejectOnError<T extends { error: unknown }>(
  promise: PromiseLike<T>,
): Promise<T> {
  const result = await promise
  if (result.error) {
    if (result.error instanceof Error) {
      throw result.error
    } else if (typeof result.error === 'string') {
      throw new Error(result.error)
    } else {
      throw Object.assign(new Error(JSON.stringify(result.error)), {
        cause: result.error,
      })
    }
  }
  return result
}
