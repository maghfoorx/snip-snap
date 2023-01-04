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

  //creating a function for individual snaps
  interface SnapProps {
    snap: PasteBinType;
  }

  const SnapItem: React.FC<SnapProps> = (props: SnapProps) => {
    const sliceLength = 450;
    const { snap } = props;
    // const [isExpanded, setIsExpanded] = useState<boolean>(false)
    const [fullBody, setFullBody] = useState("");
    const handleReadMore = (body: string) => {
      setFullBody(body.slice(sliceLength, body.length));
      if (fullBody.length > 0) {
        setFullBody("");
      }
    };
    return (
      <>
        <div key={snap.id}>
          <p>
            {snap.title ? (
              <>
                {snap.title} | {snap.date}
              </>
            ) : (
              <>{snap.date}</>
            )}
          </p>
          <p>
            {snap.body.slice(0, sliceLength)}
            <span>{fullBody}</span>
          </p>
          {snap.body.length > sliceLength && fullBody.length < 1 && (
            <button value={fullBody} onClick={() => handleReadMore(snap.body)}>
              More
            </button>
          )}
          {fullBody.length > 0 && (
            <button value={fullBody} onClick={() => handleReadMore(snap.body)}>
              Less
            </button>
          )}
          {/* <p className={isExpanded ? "" : "expanded-text"}>{snap.body}</p>
                {snap.body.length > 450 && <button onClick={handleReadMore} className="read-more-button">more</button>} */}
          <hr />
        </div>
      </>
    );
  };

  return (
    <>
      <h1>WELCOME TO SNIP SNAP</h1>
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
          <h1>Snips & Snaps</h1>
          {allData.map((el) => (
            <SnapItem key={el.id} snap={el} />
          ))}
        </>
      )}
    </>
  );
}
