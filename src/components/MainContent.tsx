import { useEffect, useState } from "react";
import axios from "axios";

interface PasteBinType {
  id: number;
  date: Date;
  title: null | string;
  body: string;
}

const url =
  process.env.NODE_ENV === "production"
    ? "https://alli-ben-maghfoor-pastebin.onrender.com"
    : "http://localhost:4000";

export default function MainContent(): JSX.Element {
  const [pasteBinBody, setPasteBinBody] = useState<string>("");
  const [pasteBinTitle, setPasteBinTitle] = useState<string>("");
  const [allData, setAllData] = useState<PasteBinType[]>([]);

  useEffect(() => {
    getPastes();
    console.log(allData);
  }, [allData.length]);

  //GET pasteBins from API
  const getPastes = async () => {
    console.log("getPastes works");
    try {
      const response = await axios.get(url + "/pastes");
      setAllData(response.data);
    } catch (error) {
      console.error("Woops... issue with GET request: ", error);
    }
  };

  //POST highscore to API
  const postPastes = async (newBody: string, newTitle?: string) => {
    console.log("postPastes function is running!");
    try {
      await axios.post(url + "/pastes", { body: newBody, title: newTitle });
    } catch (error) {
      console.error("Woops... issue with POST request: ", error);
    }
  };
  const handlePost = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    pasteBinTitle === ""
      ? postPastes(pasteBinBody)
      : postPastes(pasteBinBody, pasteBinTitle);
    setPasteBinBody("");
    setPasteBinTitle("");
    getPastes();
  };

  return (
    <>
      <h1>WELCOME TO PASTEBINS</h1>
      <form onSubmit={handlePost}>
        <input
          placeholder="title"
          type="text"
          value={pasteBinTitle}
          onChange={(e) => setPasteBinTitle(e.target.value)}
        />
        <input
          placeholder="body"
          type="text"
          value={pasteBinBody}
          onChange={(e) => setPasteBinBody(e.target.value)}
        />
        <button type="submit">Post</button>
      </form>
      {allData.length > 0 && (
        <>
          <h1>PasteBins</h1>
          {allData.map((el) => {
            return (
              <div key={el.id}>
                <p>
                  {el.title ? (
                    <>
                      {el.title} | {el.date}
                    </>
                  ) : (
                    <>{el.date}</>
                  )}
                </p>
                <p>{el.body.slice(0, 450)}</p>
                <hr />
              </div>
            );
          })}
        </>
      )}
    </>
  );
}
