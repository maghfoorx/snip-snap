import { useEffect, useState } from "react";
import axios from "axios";

const url =
  process.env.NODE_ENV === "production"
    ? "https://alli-ben-maghfoor-pastebin.onrender.com"
    : "http://localhost:4000";

interface PasteBinType {
  id: number;
  date: Date;
  title: null | string;
  body: string;
}

interface PasteComment {
  comment_id: number;
  paste_id: number;
  comment_body: string;
  date: Date;
}

export default function MainContent(): JSX.Element {
  const [pasteBinBody, setPasteBinBody] = useState<string>("");
  const [pasteBinTitle, setPasteBinTitle] = useState<string>("");
  const [allData, setAllData] = useState<PasteBinType[]>([]);
  const [allComments, setAllComments] = useState<PasteComment[]>([]);
  //creating a function for individual snaps
  interface SnapProps {
    snap: PasteBinType;
    allCommProps: PasteComment[];
  }
  const SnapItem: React.FC<SnapProps> = (props: SnapProps) => {
    const sliceLength = 450;
    const { snap, allCommProps } = props;

    const [commentBody, setCommentBody] = useState<string>("");
    const [comments, setComments] = useState<PasteComment[]>([]);
    const [CommsVis, setCommsVis] = useState<boolean>(false);
    const [fullBody, setFullBody] = useState("");

    //GET comments from API
    // const getComments = async () => {
    //   try {
    //     const response = await axios.get(url + `/comments/${snap.id}`);
    //     setAllComments(response.data);
    //   } catch (error) {
    //     console.error("Woops... issue with GET comments request: ", error);
    //   }
    // };
    const handleViewComments = (id: number) => {
      setComments(allCommProps.filter((el) => el.paste_id === id));
      setCommsVis(true);
      console.log(comments);
      // console.log(CommsVis)
    };
    const handleReadMore = (body: string) => {
      setFullBody(body.slice(sliceLength, body.length));
      if (fullBody.length > 0) {
        setFullBody("");
      }
    };

    return (
      <div key={snap.id}>
        {comments.map((el) => {
          return <p key={el.comment_id}>{el.comment_body}</p>;
        })}
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
        <span>
          {snap.body.length > sliceLength && fullBody.length < 1 && (
            <button value={fullBody} onClick={() => handleReadMore(snap.body)}>
              More
            </button>
          )}
          <button>Leave a comment</button>
          {/* {comments.length > 0 && (
              <button onClick={handleViewComments}>View comments</button>
            )} */}
          <button onClick={() => handleViewComments(snap.id)}>
            View comments
          </button>
          {/* {CommsVis && 
            <div>{comments.map((el)=> {
              return(
                <p >{el.commentBody}</p>
              )
            })}</div>} */}
        </span>
        {fullBody.length > 0 && (
          <button value={fullBody} onClick={() => handleReadMore(snap.body)}>
            Less
          </button>
        )}
        <hr />
      </div>
    );
  };

  useEffect(() => {
    getPastes();
    getAllComments();
    console.log(allComments);
  }, [allData.length, allComments.length]);

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

  //GET Allcomments from API
  const getAllComments = async () => {
    try {
      const response = await axios.get(url + `/comments`);
      setAllComments(response.data);
    } catch (error) {
      console.error("Woops... issue with GET request: ", error);
    }
  };

  //POST pastes to API
  const postPastes = async (newBody: string, newTitle?: string) => {
    console.log("postPastes function is running!");
    try {
      if (newBody.length < 1) {
        alert("You can't post an empty snap bruh😂😂😂");
      } else {
        await axios.post(url + "/pastes", { body: newBody, title: newTitle });
      }
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
      {allComments.map((el) => {
        return <p key={el.comment_id}>{el.comment_body}</p>;
      })}
      <h1>
        WELCOME TO SNIP SNAP{" "}
        <img src="../logo.png" alt="" className="logo-image" />
      </h1>
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
            <SnapItem key={el.id} snap={el} allCommProps={allComments} />
          ))}
        </>
      )}
    </>
  );
}
