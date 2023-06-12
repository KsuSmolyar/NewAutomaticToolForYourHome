export const sendForm = async ({ name, email, message }) => {
  const body = await fetch('https://dummyjson.com/users/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: name, email: email, message: message }),
  });
  return await body.json();
};
