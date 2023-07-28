import { component$, useSignal, useStylesScoped$, useTask$ } from '@builder.io/qwik';
import { routeLoader$, routeAction$, Form, server$ } from '@builder.io/qwik-city';
import styles from "./index.css?inline";

/** Loading Data */
export const useDadJoke = routeLoader$(async () => {
  const response = await fetch('https://icanhazdadjoke.com/', {
    headers: { Accept: 'application/json' },
  });
  const res = (await response.json()) as {
    id: string;
    status: number;
    joke: string;
  };
  console.log(res);
  return res;
});

/** Post Data to Server */
export const useJokeVoteAction = routeAction$((props) => {
  // Leave it as an exercise for the reader to implement this.
  console.log('VOTE', props);
});

export default component$(() => {
  useStylesScoped$(styles);
  const isFavoriteSignal = useSignal(false);
  // Calling our `useDadJoke` hook, will return a reactive signal to the loaded data.
  const dadJokeSignal = useDadJoke();
  const favoriteJokeAction = useJokeVoteAction();

  // Such as Vue3 Watch 
  useTask$(({ track }) => {
    track(() => isFavoriteSignal.value);
    console.log('FAVORITE (isomorphic)', isFavoriteSignal.value);
    server$(() => {
      console.log('FAVORITE (server)', isFavoriteSignal.value);
    })();
  });

  return (
    <section class="section bright">
      <p>{dadJokeSignal.value.joke}</p>
      <Form action={favoriteJokeAction}>
        <input type="hidden" name="jokeID" value={dadJokeSignal.value.id} />
        <button type="submit" name="vote" value="up">
          👍
        </button>
        <button type="submit" name="vote" value="down">
          👎
        </button>
      </Form>
      <button
        onClick$={() => (isFavoriteSignal.value = !isFavoriteSignal.value)}
      >
        {isFavoriteSignal.value ? '❤️' : '🤍'}
      </button>
    </section>
  );
});
