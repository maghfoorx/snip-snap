import { useState } from "react";

interface PasteBinType {
  id: number;
  date: Date;
  title: null | string;
  body: string;
}

export default function MainContent(): JSX.Element {
  const [pasteBinInput, setPasteBinInput] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };
  return (
    <>
      <h1>HELLO</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={pasteBinInput}
          onChange={(e) => setPasteBinInput(e.target.value)}
        />
        <button type="submit">Post</button>
      </form>
    </>
  );
}
