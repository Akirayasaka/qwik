import { component$ } from '@builder.io/qwik';
import { routeLoader$, routeAction$, Form } from '@builder.io/qwik-city';

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
  // Calling our `useDadJoke` hook, will return a reactive signal to the loaded data.
  const dadJokeSignal = useDadJoke();
  const favoriteJokeAction = useJokeVoteAction();
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
    </section>
  );
});
