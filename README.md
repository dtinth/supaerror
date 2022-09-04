Pop quiz! Can you guess what’s wrong with this code?

```js
try {
  await supabase.auth.signIn({ email })
  showOtpMessage()
} catch (error) {
  showError('Unable to sign in', error)
}
```

The code above looks like an idiomatic async JS code. However, the problem is that **the error handler, `showError`, is never going to be called.** That’s because Supabase never gives out rejected promises. [Instead, the promises always resolve to an object with an `error` property](https://github.com/supabase/supabase-js/issues/32) which has to be manually checked.

```js
const { error } = await supabase.auth.signIn({ email })
if (error) {
  // The `error` may be an Error instance (in case of client-side validation failure)
  // or can also be a plain object (in case of network error during calls).
  showError('Unable to sign in', error)
  return
}
showOtpMessage()
```

This could [result in a cumbersome code, especially when dealing with other APIs.](https://github.com/supabase/supabase-js/issues/92#issuecomment-802341629)

Supabase added a [`throwOnError()`](https://github.com/supabase/postgrest-js/pull/188) method to make promises reject on errors instead. However, it is only available for the database APIs, and [not available for auth APIs](https://github.com/supabase/gotrue-js/issues/212) or on [storage APIs](https://github.com/supabase/gotrue-js/issues/212#issuecomment-1024260125).

This library provides a simple function `rejectOnError` that wraps a promise and rejects whenever the promise resolved with an object containing an `error` property.

```js
try {
  await rejectOnError(supabase.auth.signIn({ email }))
  showOtpMessage()
} catch (error) {
  showError('Unable to sign in', error)
}
```
